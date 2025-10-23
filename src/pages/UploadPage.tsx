import { X, Camera, Plus, Check, CheckCircle2 } from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useAuth } from "../contexts/AuthContext";

// Product categories
const CATEGORIES = [
  { id: "clothing", label: "Clothing", sizeType: "clothing" },
  { id: "footwear", label: "Footwear", sizeType: "footwear" },
  { id: "accessories", label: "Accessories", sizeType: "onesize" },
  { id: "jewelry", label: "Jewelry", sizeType: "onesize" },
  { id: "bags", label: "Bags", sizeType: "onesize" },
  { id: "others", label: "Others", sizeType: "onesize" },
];

// Size options by size type
const SIZE_OPTIONS: Record<string, string[]> = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  footwear: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "US 13"],
  onesize: ["One Size"],
};

export function UploadPage() {
  const navigate = useNavigate();
  const { addPost } = usePosts();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>(["clothing"]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (categories.includes(categoryId)) {
      setCategories(categories.filter((id) => id !== categoryId));
    } else {
      setCategories([...categories, categoryId]);
    }
  };

  // Get size type from selected categories
  const getSizeType = (): string => {
    // Priority: footwear > onesize > clothing
    if (categories.some(cat => CATEGORIES.find(c => c.id === cat)?.sizeType === "footwear")) {
      return "footwear";
    }
    if (categories.some(cat => CATEGORIES.find(c => c.id === cat)?.sizeType === "onesize")) {
      return "onesize";
    }
    return "clothing";
  };

  const handleSizeToggle = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const validatePrice = (value: string): boolean => {
    if (!value.trim()) {
      setPriceError("Price is required");
      return false;
    }

    const priceNum = parseFloat(value);

    if (isNaN(priceNum)) {
      setPriceError("Please enter a valid number");
      return false;
    }

    if (priceNum < 0.01) {
      setPriceError("Price must be at least $0.01");
      return false;
    }

    if (priceNum > 999999.99) {
      setPriceError("Price is too high");
      return false;
    }

    // Check for valid decimal format (max 2 decimal places)
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!decimalRegex.test(value)) {
      setPriceError("Price can have at most 2 decimal places");
      return false;
    }

    setPriceError("");
    return true;
  };

  const handlePriceChange = (value: string) => {
    // Allow empty string, numbers, and single decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);

      // Only clear errors if the value is valid, don't set new errors while typing
      if (priceError && value) {
        const priceNum = parseFloat(value);
        const decimalRegex = /^\d+(\.\d{1,2})?$/;

        // Check if current value is valid
        if (!isNaN(priceNum) &&
            priceNum >= 0.01 &&
            priceNum <= 999999.99 &&
            decimalRegex.test(value)) {
          setPriceError(""); // Clear error only if valid
        }
      } else if (!value) {
        setPriceError(""); // Clear error when field is empty
      }
    }
  };

  const handlePost = () => {
    // Clear previous errors
    setUploadError("");
    setPriceError("");

    // Validate at least one image is uploaded
    if (uploadedImages.length === 0) {
      setUploadError("Please upload at least one image");
      return;
    }

    // Validate price before submitting
    if (!validatePrice(price)) {
      return;
    }

    // Create and add the post
    addPost({
      imageUrl: uploadedImages[0], // First image as the main image
      caption: title || "Untitled Post",
      description: description || undefined,
      images: uploadedImages,
      price: `$${parseFloat(price).toFixed(2)}`,
      tags: categories,
      sizes: sizes.length > 0 ? sizes : undefined,
      isProduct: true,
      userName: user?.email || "Anonymous",
    });

    // Show success notification
    setShowSuccess(true);

    // Navigate to home after a short delay
    setTimeout(() => {
      navigate("/");
    }, 1500);
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
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-medium">Post uploaded successfully!</span>
        </div>
      )}

      {/* Modal Container */}
      <div className="w-full h-screen md:h-auto md:max-w-2xl bg-black border-0 md:border md:border-white/10 rounded-none md:rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10">
          <button
            onClick={handleCancel}
            className="text-white hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <h2 className="text-white text-base md:text-lg font-medium">New Post</h2>
          <div className="w-5 md:w-6" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
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
              <div className="w-full h-full flex flex-col p-2 md:p-4 overflow-hidden">
                {/* Main Preview */}
                <div className="flex-1 relative group mb-2 md:mb-4 min-h-0 overflow-hidden">
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
                <div className="flex gap-2 overflow-x-auto pb-2 flex-shrink-0">
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

          {/* Upload Error Message */}
          {uploadError && (
            <p className="text-red-500 text-sm -mt-2">{uploadError}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Product Details Section */}
          <div className="space-y-4 border border-white/10 rounded-lg p-4 md:p-5">
            <h3 className="text-white text-sm md:text-base font-medium mb-3">Product Details</h3>

            {/* Title Field */}
            <div className="relative">
              <label className="block text-white/60 text-xs md:text-sm mb-2">
                Title {!title.trim() && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setTitle(e.target.value);
                  }
                }}
                placeholder="e.g., Vintage Denim Jacket"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-sm md:text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-colors"
              />
              <div className="flex justify-end mt-1">
                <span className="text-gray-600 text-xs">
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* Description Field */}
            <div className="relative">
              <label className="block text-white/60 text-xs md:text-sm mb-2">
                Description <span className="text-gray-600">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder="Describe the item, condition, materials, fit, etc..."
                className="w-full bg-transparent border border-white/20 rounded p-3 text-sm md:text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-colors resize-none"
                rows={4}
              />
              <div className="flex justify-end mt-1">
                <span className="text-gray-600 text-xs">
                  {description.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Details Section */}
          <div className="space-y-4 border border-white/10 rounded-lg p-4 md:p-5">
            <h3 className="text-white text-sm md:text-base font-medium mb-3">Pricing & Details</h3>

            {/* Price Field */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-white/60 text-xs md:text-sm">
                  Price {!price && <span className="text-red-500">*</span>}
                </label>
                <span className="text-white/60 text-xs md:text-sm">
                  $
                </span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                onBlur={() => price && validatePrice(price)}
                placeholder="0.00"
                className={`w-full bg-transparent border-b pb-2 text-sm md:text-base text-white placeholder:text-gray-500 focus:outline-none transition-colors ${
                  priceError
                    ? "border-red-500 focus:border-red-400"
                    : "border-white/20 focus:border-white/40"
                }`}
              />
              {priceError && (
                <p className="text-red-500 text-xs mt-1">{priceError}</p>
              )}
              <p className="text-gray-600 text-xs mt-1">
                Set your selling price
              </p>
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-white/60 text-xs md:text-sm mb-3">
                Category
              </label>
              <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                <div className="flex gap-2 pb-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`relative flex-shrink-0 px-4 py-2 border rounded-full text-sm transition-all whitespace-nowrap ${
                          isSelected
                            ? "border-white bg-white text-black"
                            : "border-white/20 text-white/60 hover:border-white/40"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                        )}
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-2">
                Select all that apply • Category affects available sizes
              </p>
            </div>

            {/* Sizes Field */}
            <div>
              <label className="block text-white/60 text-xs md:text-sm mb-3">
                Available Sizes <span className="text-gray-600">(optional)</span>
              </label>
              <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                <div className="flex gap-2 pb-2">
                  {SIZE_OPTIONS[getSizeType()].map((size) => {
                    const isSelected = sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`relative flex-shrink-0 px-4 py-2 border rounded-full text-sm transition-all whitespace-nowrap ${
                          isSelected
                            ? "border-white bg-white text-black"
                            : "border-white/20 text-white/60 hover:border-white/40"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                        )}
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-2">
                Select all available sizes
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Post Button */}
        <div className="border-t border-white/10 p-4 md:p-6 bg-black">
          <button
            onClick={handlePost}
            disabled={uploadedImages.length === 0 || !title.trim() || !price}
            className={`w-full py-3 md:py-4 rounded-lg font-medium text-base md:text-lg transition-all transform ${
              uploadedImages.length === 0 || !title.trim() || !price
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {uploadedImages.length === 0
              ? "Add images to post"
              : !title.trim()
              ? "Add title to post"
              : !price
              ? "Add price to post"
              : "Post to Discover"}
          </button>

          {/* Helper Text */}
          {uploadedImages.length > 0 && title.trim() && price && (
            <p className="text-center text-gray-500 text-xs mt-2">
              Your post will be visible to everyone
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
