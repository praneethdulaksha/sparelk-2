import { useState, useRef } from "react";
import { ZoomIn, X, Box } from "lucide-react";
import Model3D from "../items/Model3D";

interface ImageGalleryProps {
  mainImage: string;
  additionalImages?: string[];
  images360?: string[];
}

export function ImageGallery({
  mainImage,
  additionalImages = [],
  images360 = [],
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [show360, setShow360] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const zoomRef = useRef<HTMLDivElement>(null);
  const allImages = [mainImage, ...additionalImages].filter(Boolean);

  // For testing purposes, always show 3D button
  const has360View = true; // Force to true for testing

  // Handle zoom mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomRef.current) return;

    const { left, top, width, height } =
      zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-slate-50 rounded-xl border overflow-hidden aspect-square flex items-center justify-center">
        {show360 ? (
          <div className="w-full h-full">
            <Model3D />
          </div>
        ) : (
          <img
            src={selectedImage}
            alt="Product"
            className="max-h-full max-w-full object-contain"
          />
        )}

        {/* Action buttons positioned individually */}
        {!show360 && (
          <>
            {/* 3D Button - Left Side */}
            <button
              onClick={() => setShow360(true)}
              className="absolute bottom-4 left-4 bg-orange-500 text-white p-2 rounded-full shadow transition-colors"
              aria-label="View in 3D"
            >
              <Box className="h-5 w-5" />
            </button>

            {/* Zoom Button - Right Side */}
            <button
              onClick={() => setShowZoom(true)}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </>
        )}

        {/* 3D View toggle button (when in 3D mode) */}
        {show360 && (
          <button
            onClick={() => setShow360(false)}
            className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-full shadow transition-colors"
            aria-label="Exit 3D view"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Thumbnail images */}
      {allImages.length > 1 && !show360 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden bg-slate-50 ${
                selectedImage === image ? "ring-2 ring-orange-500" : ""
              }`}
              onClick={() => setSelectedImage(image)}
              aria-label={`View product image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal */}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-4">
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10"
              onClick={() => setShowZoom(false)}
              aria-label="Close zoom view"
            >
              <X className="h-6 w-6" />
            </button>

            <div
              ref={zoomRef}
              className="w-full h-full cursor-zoom-in rounded-lg bg-no-repeat"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundSize: "200%",
                backgroundPosition: "center",
              }}
              onMouseMove={handleMouseMove}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
