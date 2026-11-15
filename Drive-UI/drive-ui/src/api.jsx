const API = "/api";

async function call(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) {
    let m = r.statusText;
    try {
      m = (await r.json()).message || m;
    } catch {}
    throw new Error(m || `Request failed (${r.status})`);
  }
  return r;
}
const q = (parentId) => (parentId ? `?parentId=${parentId}` : "");

export const listItems = async (parentId) =>
  (await call(`${API}/items${q(parentId)}`)).json();

export const createFolder = (name, parentId) =>
  call(`${API}/folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });

export const uploadFile = (file, parentId) => {
  const fd = new FormData();
  fd.append("file", file);
  return call(`${API}/files${q(parentId)}`, { method: "POST", body: fd });
};

export const deleteItem = (id) =>
  call(`${API}/items/${id}`, { method: "DELETE" });
export const downloadUrl = (id) => `${API}/items/${id}/download`;
