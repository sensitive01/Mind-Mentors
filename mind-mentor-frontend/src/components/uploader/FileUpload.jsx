import PropTypes from "prop-types";
import React, { useState } from 'react';

const FileUpload = ({ fieldName, onFileUpload }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET); // Cloudinary preset
        formData.append("cloud_name", import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME); // Cloudinary cloud name
        formData.append("folder", "mindmentorz"); // Specify the folder name here

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            setLoading(false);
            if (onFileUpload) {
                onFileUpload(data.secure_url); // Pass uploaded file URL back to the parent component
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setLoading(false);
        }
    };

    return (
        <div className="file-upload">
            <label htmlFor={fieldName} className="block font-medium mb-2">
                {fieldName}
            </label>
            <input
                type="file"  
                id={fieldName}
                name={fieldName}
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                disabled={loading}
            />
            {loading && <p className="text-sm text-gray-500">Uploading...</p>}
            {file && !loading && (
                <p className="text-sm text-green-500">File uploaded successfully!</p>
            )}
        </div>
    );
};

FileUpload.propTypes = {
    fieldName: PropTypes.string.isRequired,
    onFileUpload: PropTypes.func.isRequired,
};

export default FileUpload;
