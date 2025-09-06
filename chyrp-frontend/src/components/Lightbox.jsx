// src/components/Lightbox.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';

const Lightbox = ({ images, postId, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      fetchPostImages();
    }
  }, [isOpen, postId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex]);

  const fetchPostImages = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/lightbox/post/${postId}/images`);
      setImageData(response.data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      setImageData(images || []);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageData.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === imageData.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (!isOpen || imageData.length === 0) return null;

  const currentImage = imageData[currentImageIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl max-h-full bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/40 overflow-hidden animate-in zoom-in-95 duration-300" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
          <div className="text-purple-300 font-semibold text-lg">
            {currentImageIndex + 1} of {imageData.length}
          </div>
          <button 
            className="p-2 hover:bg-purple-500/20 rounded-xl transition-all duration-200 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Image */}
        <div className="relative flex items-center justify-center min-h-[400px] max-h-[70vh] bg-black/40">
          <button 
            className="absolute left-4 z-10 p-3 bg-slate-900/80 hover:bg-slate-800/90 text-white rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={goToPrevious}
            disabled={imageData.length <= 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex-1 flex items-center justify-center p-4">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                <span className="text-purple-300 font-medium">Loading...</span>
              </div>
            ) : (
              <img
                src={currentImage.url}
                alt={currentImage.alt || `Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onLoad={() => setLoading(false)}
              />
            )}
          </div>
          
          <button 
            className="absolute right-4 z-10 p-3 bg-slate-900/80 hover:bg-slate-800/90 text-white rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={goToNext}
            disabled={imageData.length <= 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Thumbnails */}
        {imageData.length > 1 && (
          <div className="p-6 border-t border-purple-500/20 bg-gradient-to-r from-slate-900/60 to-slate-800/60">
            <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent pb-2">
              {imageData.map((image, index) => (
                <img
                  key={index}
                  src={image.thumbnail || image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  className={`flex-shrink-0 w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'ring-3 ring-purple-400 transform scale-110 shadow-lg shadow-purple-900/30' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Image Info */}
        {currentImage.caption && (
          <div className="p-6 border-t border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
            <p className="text-gray-200 text-center text-lg leading-relaxed">
              {currentImage.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;