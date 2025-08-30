import React, { useState } from "react";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /// HANDLE FILE CHANGE
  /// FILE SELECTION
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a CSV file");
      setFile(null);
    }
  };

  /// HANDLE UPLOAD
  //UPLOADING FILE TO BACKEND
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      /// FORM DATA FOR FILE UPLOAD
      const formData = new FormData();
      formData.append("file", file);

      ///Backend API
      const res = await fetch("http://localhost:8000/datasets/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload Failed $ {res.status}`);
      }

      const data = await res.json();

      onUploadSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* UPLOAD CARD */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upload Your Dataset
          </h2>
          <p className="text-gray-600 mb-8">
            Upload a csv file to analyze the data.
          </p>

          {/* FILE INPUT */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {file && (
              <p className="mt-2 text-sm text-green-600">
                selected: {file.name}
              </p>
            )}
          </div>

          {/* UPLOAD BUTTON */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 text-white px-8 py-3 rounder-lg font-mediumhover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload and Analyze"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
