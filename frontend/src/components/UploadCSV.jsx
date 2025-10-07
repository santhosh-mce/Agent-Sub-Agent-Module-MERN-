import { useState, useRef } from "react";
import API from "../api";

export default function UploadCSV({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const fileInputRef = useRef(null); // Ref to reset input

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return setMsg("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/upload", formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });

      setMsg("File uploaded successfully");

      // Reset file state and input
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setMsg(err.response?.data?.msg || "Upload failed");
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Upload Tasks (CSV/XLSX)</h2>
      {msg && <div className="mb-2 text-green-600">{msg}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="file"
          accept=".csv,.xlsx"
          ref={fileInputRef}
          onChange={e => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Upload & Distribute
        </button>
      </form>
    </div>
  );
}
