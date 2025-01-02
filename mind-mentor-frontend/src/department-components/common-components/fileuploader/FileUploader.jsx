import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Upload, X, Check, Image as ImageIcon, Loader2 } from "lucide-react";

const FileUpload = ({ fieldName, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handlePreview = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    handlePreview(selectedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append(
      "cloud_name",
      import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
    );
    formData.append("folder", "mindmentorz");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
        }/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setLoading(false);
      if (onFileUpload) {
        onFileUpload(data.secure_url);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    if (onFileUpload) {
      onFileUpload(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        {fieldName}
      </label>
      <div
        className={`relative group transition-all duration-300 ease-in-out
          ${!file ? "h-64" : "h-auto"} 
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          } 
          border-2 border-dashed rounded-lg`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={fieldName}
          name={fieldName}
          className="hidden"
          onChange={handleChange}
          accept="image/*"
          disabled={loading}
        />

        {!file ? (
          <label
            htmlFor={fieldName}
            className="flex flex-col items-center justify-center h-full cursor-pointer p-6"
          >
            <Upload
              className={`w-12 h-12 mb-4 transition-colors duration-300 ${
                dragActive ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <p className="text-sm text-gray-600 text-center mb-2">
              Drag and drop your image here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF
            </p>
          </label>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                disabled={loading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              {loading ? (
                <div className="h-full bg-blue-500 animate-pulse" />
              ) : (
                <div className="h-full bg-green-500 w-full transition-all duration-500" />
              )}
            </div>
            <div className="flex items-center justify-center mt-3">
              {loading ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
              <span className="ml-2 text-sm">
                {loading ? "Uploading..." : "Upload complete!"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUpload;
