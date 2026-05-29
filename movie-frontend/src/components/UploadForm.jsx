import React, { useRef, useState } from "react";
import { FiUploadCloud, FiFile, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import "./UploadForm.css";

function formatFileSize(bytes) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function UploadForm() {
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (file) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Please enter a document title.");
      setSuccessMessage("");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      setSuccessMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Upload failed. Please try again.";

        try {
          const data = await response.json();
          message = data?.message || message;
        } catch (e) {
          // keep default
        }

        throw new Error(message);
      }

      setSuccessMessage("Document uploaded successfully.");
      resetForm();
    } catch (uploadError) {
      setErrorMessage(uploadError?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer?.files?.[0] || null;
    handleFileSelect(file);
  };

  return (
    <section className="upload-shell">
      <form className="upload-card" onSubmit={handleUpload}>
        <div className="upload-header">
          <div>
            <p className="upload-eyebrow">Document Upload</p>
            <h2>Send files to your movie dashboard</h2>
            <p className="upload-description">
              Upload production notes, casting docs, or any supporting file into the Movie Informer backend.
            </p>
          </div>

          <div className="upload-icon-badge" aria-hidden="true">
            <FiUploadCloud />
          </div>
        </div>

        <div className="upload-grid">
          <label className="field-group">
            <span className="field-label">Document title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              placeholder="Enter document title"
              className="modern-input"
              autoComplete="off"
              disabled={loading}
            />
          </label>

          <div
            className={`dropzone ${isDragging ? "dropzone-active" : ""} ${selectedFile ? "dropzone-filled" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="*/*"
              className="hidden-file-input"
              onChange={(event) => handleFileSelect(event.target.files && event.target.files[0] ? event.target.files[0] : null)}
              disabled={loading}
            />

            <div className="dropzone-inner">
              <div className="dropzone-icon">
                <FiUploadCloud />
              </div>

              <div>
                <h3>Drag and drop your file here</h3>
                <p>Or click to browse any file type from your device.</p>
              </div>

              <button type="button" className="browse-button" disabled={loading}>
                Choose File
              </button>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="file-preview">
            <div className="file-preview-main">
              <span className="file-preview-icon">
                <FiFile />
              </span>

              <div>
                <h3>{selectedFile.name}</h3>
                <p>
                  {formatFileSize(selectedFile.size)} · {selectedFile.type || "Unknown file type"}
                </p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="message message-success" role="status">
            <FiCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="message message-error" role="alert">
            <FiAlertCircle />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="upload-actions">
          <button type="submit" className="upload-button" disabled={loading}>
            {loading ? (
              <>
                <FiLoader className="spinner" />
                Uploading...
              </>
            ) : (
              <>
                <FiUploadCloud />
                Upload Document
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
