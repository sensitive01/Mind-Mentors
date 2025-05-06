import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Upload, X, Check, Image as ImageIcon, Loader2 } from "lucide-react";

const MultipleFileUpload = ({
  fieldName,
  name,
  onFileUpload,
  initialFiles = [],
}) => {
  // Convert initial URLs to file state objects
  const [files, setFiles] = useState([]);

  // Initialize files from initialFiles URLs when component mounts or initialFiles changes
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      // Convert URLs to file state objects
      const initialFileStates = initialFiles.map((url) => ({
        file: null, // No actual File object for existing images
        preview: url,
        status: "complete",
        url: url,
        isInitial: true, // Flag to identify it's an initial file
      }));
      setFiles(initialFileStates);
    }
  }, [initialFiles]);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const createPreview = (file) => {
    return new Promise((resolve) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
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
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFiles = async (newFiles) => {
    const fileArray = Array.from(newFiles);
    setUploading(true);

    try {
      const filePromises = fileArray.map(async (file) => {
        const preview = await createPreview(file);
        return {
          file,
          preview,
          status: "pending",
          url: null,
          isInitial: false,
        };
      });

      const newFileStates = await Promise.all(filePromises);
      setFiles((prev) => [...prev, ...newFileStates]);

      // Upload files one by one and collect URLs
      const uploadedUrls = [];
      for (let i = 0; i < newFileStates.length; i++) {
        const fileState = newFileStates[i];
        setFiles((prev) =>
          prev.map((f) => (f === fileState ? { ...f, status: "uploading" } : f))
        );

        const url = await uploadFile(fileState.file);
        if (url) {
          uploadedUrls.push(url);
          setFiles((prev) =>
            prev.map((f) =>
              f === fileState ? { ...f, status: "complete", url } : f
            )
          );
        } else {
          // Handle failed upload
          setFiles((prev) =>
            prev.map((f) => (f === fileState ? { ...f, status: "error" } : f))
          );
        }
      }

      // Get all URLs including previously uploaded files
      const allUrls = files
        .filter((f) => f.status === "complete")
        .map((f) => f.url);

      // Add newly uploaded URLs
      const updatedUrls = [...allUrls, ...uploadedUrls.filter(Boolean)];

      // Notify parent component of all uploaded URLs
      if (onFileUpload) {
        onFileUpload(updatedUrls);
      }
    } catch (error) {
      console.error("Error handling files:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (indexToRemove) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, index) => index !== indexToRemove);
      const urls = newFiles
        .filter((f) => f.status === "complete")
        .map((f) => f.url);

      // Notify parent component of updated URLs
      if (onFileUpload) {
        onFileUpload(urls);
      }
      return newFiles;
    });
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "uploading":
        return {
          icon: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
          text: "Uploading...",
          progressBar: <div className="h-full bg-blue-500 animate-pulse" />,
        };
      case "complete":
        return {
          icon: <Check className="w-5 h-5 text-green-500" />,
          text: "Upload complete!",
          progressBar: <div className="h-full bg-green-500 w-full" />,
        };
      case "error":
        return {
          icon: <X className="w-5 h-5 text-red-500" />,
          text: "Upload failed",
          progressBar: <div className="h-full bg-red-500 w-full" />,
        };
      default:
        return {
          icon: <Upload className="w-5 h-5 text-gray-400" />,
          text: "Pending upload",
          progressBar: <div className="h-full bg-gray-300 w-full" />,
        };
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        {fieldName}
      </label>
      <div
        className={`relative group transition-all duration-300 ease-in-out
          ${files.length === 0 ? "h-64" : "h-auto"} 
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
          name={name || fieldName}
          className="hidden"
          onChange={handleChange}
          accept="image/*"
          multiple
          disabled={uploading}
        />

        {files.length === 0 ? (
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
              Drag and drop multiple images here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF
            </p>
          </label>
        ) : (
          <div className="p-4 space-y-4">
            {files.map((fileState, index) => {
              const statusDisplay = getStatusDisplay(fileState.status);
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {fileState.preview ? (
                        <img
                          src={fileState.preview}
                          alt="Preview"
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {fileState.isInitial
                            ? "Uploaded image"
                            : fileState.file?.name || "Image"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fileState.isInitial
                            ? "Previously uploaded"
                            : fileState.file
                            ? `${(fileState.file.size / (1024 * 1024)).toFixed(
                                2
                              )} MB`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      disabled={fileState.status === "uploading"}
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    {statusDisplay.progressBar}
                  </div>
                  <div className="flex items-center justify-center mt-3">
                    {statusDisplay.icon}
                    <span className="ml-2 text-sm">{statusDisplay.text}</span>
                  </div>
                </div>
              );
            })}
            <label
              htmlFor={fieldName}
              className="block w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
            >
              <span className="text-sm text-blue-600">+ Add more images</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

MultipleFileUpload.propTypes = {
  fieldName: PropTypes.string.isRequired,
  name: PropTypes.string,
  onFileUpload: PropTypes.func.isRequired,
  initialFiles: PropTypes.array,
};

export default MultipleFileUpload;
