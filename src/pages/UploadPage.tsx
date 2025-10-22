import { X, Camera, Plus } from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePost = () => {
    // TODO: Handle post submission
    console.log("Post submitted:", { caption, tags, images: uploadedImages });
    navigate("/");
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const imageUrls: string[] = [];

    fileArray.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            imageUrls.push(e.target.result as string);
            if (imageUrls.length === fileArray.length) {
              setUploadedImages((prev) => [...prev, ...imageUrls]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    // Reset selected index if needed
    if (index === selectedImageIndex && uploadedImages.length > 1) {
      setSelectedImageIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 md:p-6">
      {/* Modal Container */}
      <div className="w-full h-screen md:h-auto md:max-w-2xl bg-black border-0 md:border md:border-white/10 rounded-none md:rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10">
          <button
            onClick={handleCancel}
            className="text-white hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <h2 className="text-white text-base md:text-lg font-medium">New Post</h2>
          <button
            onClick={handlePost}
            disabled={uploadedImages.length === 0}
            className={`font-medium text-sm md:text-base transition-opacity ${
              uploadedImages.length === 0
                ? "text-white/40 cursor-not-allowed"
                : "text-white hover:opacity-70"
            }`}
          >
            Post
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 h-[calc(100vh-5rem)] md:h-auto overflow-y-auto">
          {/* Image Upload Area */}
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg h-64 md:h-96 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging
                ? "border-white/60 bg-white/5"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            {uploadedImages.length === 0 ? (
              <>
                <div className="mb-4 relative">
                  <Camera className="w-12 h-12 md:w-16 md:h-16 text-white/60" />
                  <Plus className="w-6 h-6 md:w-8 md:h-8 text-white/60 absolute -bottom-1 -right-1" />
                </div>
                <p className="text-gray-500 text-center px-4 text-sm md:text-base">
                  Click or drag images here to upload
                </p>
                <p className="text-gray-600 text-xs md:text-sm mt-2">
                  Supports JPG, PNG, GIF
                </p>
              </>
            ) : (
              <div className="w-full h-full flex flex-col p-2 md:p-4">
                {/* Main Preview */}
                <div className="flex-1 relative group mb-2 md:mb-4">
                  <img
                    src={uploadedImages[selectedImageIndex]}
                    alt={`Preview ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(selectedImageIndex);
                    }}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 md:p-2 opacity-0 md:group-hover:opacity-100 opacity-100 md:opacity-0 transition-opacity"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  {uploadedImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full">
                      {selectedImageIndex + 1} / {uploadedImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {uploadedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded border-2 transition-all ${
                        index === selectedImageIndex
                          ? "border-white"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-white/20 rounded flex items-center justify-center hover:border-white/40 transition-colors"
                  >
                    <Plus className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Caption Field */}
          <div className="relative">
            <label className="block text-white/60 text-xs md:text-sm mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setCaption(e.target.value);
                }
              }}
              placeholder="Write a caption..."
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm md:text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-colors resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-1">
              <span className="text-gray-600 text-xs">
                {caption.length}/500
              </span>
            </div>
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-white/60 text-xs md:text-sm mb-2">
              Tags <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. streetwear, minimal, luxury"
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm md:text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-colors"
            />
            <p className="text-gray-600 text-xs mt-1">
              Separate tags with commas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
