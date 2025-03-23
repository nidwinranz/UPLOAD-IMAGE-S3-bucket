"use client";

import { useState, useEffect, useRef } from "react";

const UploadForm = () => {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]); // Stores all images (fetched + newly uploaded)
  
  // Reference for the file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/s3-images");
        const data = await response.json();

        if (response.ok && data.images) {
          setUploadedImages(data.images);
        } else {
          console.error("Failed to fetch images");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setFileName(file.name);

    // Restrict uploading the same file name again
    if (uploadedImages.some((img) => img.includes(file.name))) {
      alert(`An image with the name "${file.name}" has already been uploaded.`);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and GIF files are allowed.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setUploadedImages((prevImages) => [data.imageUrl, ...prevImages]);
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      setFileName("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleButtonClick = () => {
    // Trigger the click event on the hidden file input
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-green-600">
      <div
        className={`w-96 h-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-5 mt-10 ${
          dragging ? "border-white" : "border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-white text-6xl">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <header className="text-white text-4xl font-medium mb-2 text-center font-sans">
          Drag & Drop to Upload Image
        </header>
        <br />
        <span className="text-white text-2xl font-sans font-medium mb-4">OR</span>
        <button
          className="bg-white text-green-900 py-2 px-6 rounded-lg font-sans text-lg font-medium hover:bg-gray-400 transition-all bg-[#eee] border-none w-[10em] text-lightcoral border-radius-[1rem] box-shadow-[0_0.4rem_#dfd9d9] cursor-pointer active:text-white active:box-shadow-[0_0.2rem_#dfd9d9] active:transform-[translateY(0.2rem)] hover:not\\(:disabled\\):bg-lightcoral hover:not\\(:disabled\\):text-white hover:not\\(:disabled\\):text-shadow-[0_0.1rem_#bcb4b4] disabled:cursor-auto disabled:text-grey"
          onClick={handleButtonClick} // Trigger the click event when the button is clicked
        >
          Browse File
        </button>
        <input
          ref={fileInputRef} // Assign the reference to the file input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {uploading && (
        <p className="text-white mt-4">
          Uploading: <strong>{fileName}</strong>
        </p>
      )}

      {/* Image grid */}
      <div className="w-90 flex-grow mt-6">
        <div className="grid grid-cols-3 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative w-full h-32 overflow-hidden">
              <img
                src={url}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
