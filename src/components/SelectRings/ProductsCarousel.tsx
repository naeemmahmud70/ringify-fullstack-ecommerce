"use client";
import React, { useEffect, useState } from "react";

import ShareButton from "./ShareButton";

import "./ProductsCarousel.css";

interface ImageData {
  id: number;
  url: string;
  alt: string;
  additionalUrls: string[];
}

interface CarouselProps {
  images: ImageData[];
  selectedRing: number | null;
}

const ProductsCarousel: React.FC<CarouselProps> = ({
  images,
  selectedRing,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Find the selected ring's image data
  const selectedImage = selectedRing
    ? images.find(image => image.id === selectedRing)
    : images[0];

  const thumbnails = selectedImage ? selectedImage.additionalUrls : [];

  // Reset thumbnail index to first image when ring changes
  useEffect(() => {
    setCurrentIndex(3);
  }, [selectedRing]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full mb-6 lg:mb-0">
      {/* Main Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-none rounded-lg overflow-hidden">
        {thumbnails.length > 0 && (
          <img
            src={thumbnails[currentIndex]}
            alt={selectedImage?.alt}
            className="w-full h-full object-contain p-6 md:pr-8 xl:p-8"
          />
        )}
      </div>

      {/* Thumbnails - Always in One Row */}
      <div className="w-full flex justify-center items-center space-x-3 overflow-x-auto flex-nowrap pr-0 md:pr-6 xl:mt-6 lg:mt-4 md:mt-0 mt-8">
        {thumbnails.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => handleThumbnailClick(index)}
            className={`w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 bg-white cursor-pointer  rounded-lg transition-all duration-300 p-1 ${
              currentIndex === index ? "opacity-100" : "opacity-50"
            }`}
          />
        ))}
      </div>
      <div className="absolute right-4 lg:right-0 top-24 lg:top-auto lg:bottom-20">
        <ShareButton />
      </div>
    </div>
  );
};

export default ProductsCarousel;
