const P = (d, fill = "currentColor") => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={fill}><path d={d} /></svg>
);
export const FolderIcon = () => P("M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z", "#5f6368");
export const DownloadIcon = () => P("M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z");
export const DeleteIcon = () => P("M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z");
export const PlusIcon = () => P("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z");
export const NewFolderIcon = () => P("M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3z");
export const UploadIcon = () => P("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 9v4h-2v-4H8l4-4 4 4z");
export const ListIcon = () => P("M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z");
export const GridIcon = () => P("M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z");
export const DriveIcon = () => P("M19 2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM5 17v-2h14v2z");

export function FileIcon({ name }) {
  const e = (name.split(".").pop() || "").toLowerCase();
  const color = /^(png|jpe?g|gif|webp|svg|pdf)$/.test(e) ? "#d93025"
    : /^(docx?|txt|md)$/.test(e) ? "#1a73e8"
    : /^(xlsx?|csv)$/.test(e) ? "#188038"
    : /^(pptx?)$/.test(e) ? "#f29900"
    : /^(mp4|mov|mkv|webm|mp3|wav)$/.test(e) ? "#a142f4" : "#5f6368";
  return P("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 7V3.5L18.5 9z", color);
}