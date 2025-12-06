import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [edits, setEdits] = useState({});

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        "https://3-d-backend-3pgu.vercel.app/api/admin/gallery",
        {
          headers: { Authorization: "Bearer admin123" },
        }
      );
      setImages(res.data || []);
    } catch (err) {
      alert("Failed to load images");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    if (title) form.append("title", title);
    try {
      setLoading(true);
      await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/admin/gallery",
        form,
        {
          headers: { Authorization: "Bearer admin123" },
        }
      );
      setFile(null);
      setTitle("");
      await fetchImages();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axios.delete(
        `https://3-d-backend-3pgu.vercel.app/api/admin/gallery/${id}`,
        {
          headers: { Authorization: "Bearer admin123" },
        }
      );
      await fetchImages();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const setEdit = (id, patch) => {
    setEdits((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  };

  const onSave = async (img) => {
    const form = new FormData();
    const current = edits[img._id] || {};
    if (typeof current.title !== "undefined")
      form.append("title", current.title);
    if (current.file) form.append("image", current.file);
    if (![...form.keys()].length) return; // nothing to update
    try {
      await axios.put(
        `https://3-d-backend-3pgu.vercel.app/api/admin/gallery/${img._id}`,
        form,
        {
          headers: { Authorization: "Bearer admin123" },
        }
      );
      setEdits((prev) => ({ ...prev, [img._id]: {} }));
      await fetchImages();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h2 className="mb-0">Gallery</h2>
        <form onSubmit={onUpload} className="d-flex gap-2 align-items-center">
          <input
            type="text"
            placeholder="Title (admin only)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            style={{ maxWidth: 240 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="form-control"
          />
          <button
            disabled={!file || loading}
            className="btn btn-primary"
            type="submit"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {images.length === 0 ? (
        <div className="text-muted">No images yet.</div>
      ) : (
        <div className="list-group">
          {images.map((img) => (
            <div
              key={img._id}
              className="list-group-item d-flex align-items-center gap-3"
            >
              <img
                src={`https://3-d-backend-3pgu.vercel.app${img.imageUrl}`}
                alt="Gallery"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <input
                type="text"
                defaultValue={img.title || ""}
                placeholder="Title (admin only)"
                className="form-control"
                style={{ maxWidth: 260 }}
                onChange={(e) => setEdit(img._id, { title: e.target.value })}
              />
              <input
                id={`file-${img._id}`}
                type="file"
                accept="image/*"
                className="form-control"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const f = e.target.files?.[0] || null;
                  if (!f) return;
                  setEdit(img._id, { file: f });
                  await onSave(img);
                  e.target.value = "";
                }}
              />
              <div className="ms-auto d-flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    const el = document.getElementById(`file-${img._id}`);
                    if (el) el.click();
                  }}
                >
                  Edit Image
                </button>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => onSave(img)}
                >
                  Save Title
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(img._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminGallery;
