import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as api from "./api";
import {
  DeleteIcon, DownloadIcon, DriveIcon, FileIcon, FolderIcon, GridIcon,
  ListIcon, NewFolderIcon, PlusIcon, UploadIcon,
} from "./icons";
import "./App.css";

const isFolder = (i) => i.folder === true || String(i.type || "").toUpperCase() === "FOLDER";
const fmtSize = (n) =>
  n == null ? "—" : n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB`
  : n < 1073741824 ? `${(n / 1048576).toFixed(1)} MB` : `${(n / 1073741824).toFixed(2)} GB`;
const fmtDate = (i) => {
  const d = i.updatedAt || i.modifiedAt || i.createdAt;
  return d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
};

export default function App() {
  const [path, setPath] = useState([{ id: null, name: "My Drive" }]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [ctx, setCtx] = useState(null); // {x, y, item}
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState(false);
  const picker = useRef(null);
  const dragDepth = useRef(0);
  const parentId = path[path.length - 1].id;

  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const load = useCallback(async () => {
    setSelected(null);
    try {
      const data = await api.listItems(parentId);
      data.sort((a, b) => isFolder(b) - isFolder(a) || a.name.localeCompare(b.name));
      setItems(data); setError("");
    } catch (e) { setItems([]); setError(e.message); }
  }, [parentId]);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query]);

  const open = (i) => {
    if (isFolder(i)) { setPath((p) => [...p, { id: i.id, name: i.name }]); setQuery(""); }
    else download(i);
  };
  const download = (i) => {
    const a = document.createElement("a");
    a.href = api.downloadUrl(i.id); a.download = i.name;
    document.body.append(a); a.click(); a.remove();
  };
  const remove = async (i) => {
    if (!window.confirm(`Delete “${i.name}”? This can’t be undone.`)) return;
    try { await api.deleteItem(i.id); say(`Deleted “${i.name}”`); load(); }
    catch (e) { say(e.message); }
  };
  const upload = async (files) => {
    for (const f of files) {
      try { say(`Uploading “${f.name}”…`); await api.uploadFile(f, parentId); say(`Uploaded “${f.name}”`); }
      catch (e) { say(`Couldn’t upload “${f.name}”: ${e.message}`); }
    }
    load();
  };
  const newFolder = async () => {
    setNewOpen(false);
    const name = window.prompt("New folder", "Untitled folder");
    if (!name?.trim()) return;
    try { await api.createFolder(name.trim(), parentId); load(); } catch (e) { say(e.message); }
  };

  // close menus on outside click / Esc, delete key, drag-and-drop upload
  useEffect(() => {
    const close = () => { setNewOpen(false); setCtx(null); };
    const key = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Delete" && selected && document.activeElement.tagName !== "INPUT") remove(selected);
    };
    const enter = (e) => { e.preventDefault(); dragDepth.current++; setDragging(true); };
    const leave = () => { if (--dragDepth.current <= 0) { dragDepth.current = 0; setDragging(false); } };
    const drop = (e) => {
      e.preventDefault(); dragDepth.current = 0; setDragging(false);
      if (e.dataTransfer.files.length) upload([...e.dataTransfer.files]);
    };
    const over = (e) => e.preventDefault();
    document.addEventListener("click", close);
    document.addEventListener("keydown", key);
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", key);
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  });

  const itemProps = (i) => ({
    className: selected?.id === i.id ? "sel" : "",
    onClick: () => setSelected(i),
    onDoubleClick: () => open(i),
    onContextMenu: (e) => { e.preventDefault(); setSelected(i); setCtx({ x: e.clientX, y: e.clientY, item: i }); },
  });
  const icon = (i) => (isFolder(i) ? <FolderIcon /> : <FileIcon name={i.name} />);

  return (
    <div className={`shell ${dragging ? "drop" : ""}`}>
      <header className="top">
        <div className="logo"><DriveIcon /><span>Drive</span></div>
        <label className="search">
          <input type="search" placeholder="Search in Drive" aria-label="Search in Drive"
            value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </header>

      <aside className="side">
        <div className="newwrap">
          <button className="new" onClick={(e) => { e.stopPropagation(); setNewOpen((o) => !o); }}>
            <PlusIcon /> New
          </button>
          {newOpen && (
            <div className="menu" style={{ top: 68, left: 0 }}>
              <button onClick={newFolder}><NewFolderIcon /> New folder</button>
              <button onClick={() => { setNewOpen(false); picker.current.click(); }}><UploadIcon /> File upload</button>
            </div>
          )}
        </div>
        <button className="nav active"><DriveIcon /> My Drive</button>
        <input ref={picker} type="file" multiple hidden
          onChange={(e) => { upload([...e.target.files]); e.target.value = ""; }} />
      </aside>

      <main className="main">
        <div className="bar">
          <nav className="crumbs" aria-label="Folder path">
            {path.map((p, i) => (
              <span key={p.id ?? "root"}>
                {i > 0 && <span className="sep">›</span>}
                <button onClick={() => { setPath(path.slice(0, i + 1)); setQuery(""); }}>{p.name}</button>
              </span>
            ))}
          </nav>
          <div className="view">
            <button className={mode === "list" ? "on" : ""} onClick={() => setMode("list")} aria-label="List layout"><ListIcon /></button>
            <button className={mode === "grid" ? "on" : ""} onClick={() => setMode("grid")} aria-label="Grid layout"><GridIcon /></button>
          </div>
        </div>

        <div className="scroll">
          {error ? (
            <div className="empty"><b>Couldn’t load files</b>{error}</div>
          ) : !visible.length ? (
            <div className="empty">
              <b>{query ? "No results" : "Drop files here"}</b>
              {query ? `Nothing here matches “${query}”.` : "Or use the New button to upload a file or create a folder."}
            </div>
          ) : mode === "grid" ? (
            <div className="grid">
              {visible.map((i) => (
                <div key={i.id} {...itemProps(i)} className={`card ${itemProps(i).className}`}>
                  <div className="pv">{icon(i)}</div>
                  <div className="nm">{icon(i)}<span>{i.name}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="head"><div>Name</div><div>Owner</div><div>Last modified</div><div>File size</div><div /></div>
              {visible.map((i) => (
                <div key={i.id} {...itemProps(i)} className={`row ${itemProps(i).className}`}>
                  <div className="cell-name">{icon(i)}<span>{i.name}</span></div>
                  <div className="mute">me</div>
                  <div className="mute">{fmtDate(i)}</div>
                  <div className="mute">{isFolder(i) ? "—" : fmtSize(i.size)}</div>
                  <div className="ops">
                    {!isFolder(i) && (
                      <button title="Download" aria-label="Download"
                        onClick={(e) => { e.stopPropagation(); download(i); }}><DownloadIcon /></button>
                    )}
                    <button title="Delete" aria-label="Delete"
                      onClick={(e) => { e.stopPropagation(); remove(i); }}><DeleteIcon /></button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {ctx && (
        <div className="menu" style={{ left: Math.min(ctx.x, innerWidth - 240), top: Math.min(ctx.y, innerHeight - 140) }}>
          <button onClick={() => open(ctx.item)}>{isFolder(ctx.item) ? "Open" : "Download"}</button>
          {!isFolder(ctx.item) && <button onClick={() => download(ctx.item)}><DownloadIcon /> Download</button>}
          <button className="danger" onClick={() => remove(ctx.item)}><DeleteIcon /> Delete</button>
        </div>
      )}
      <div id="toast" className={toast ? "show" : ""} role="status">{toast}</div>
    </div>
  );
}