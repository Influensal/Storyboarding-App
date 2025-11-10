import React, { useState } from 'react';
import { Shot } from '../types';

interface ShotCarouselProps {
  shots: Shot[];
}

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const ShotCarousel: React.FC<ShotCarouselProps> = ({ shots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? shots.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === shots.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!shots || shots.length === 0) {
    return (
      <div className="aspect-video w-full bg-black/30 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
        <p className="text-slate-400">No shots available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video group">
      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg shadow-black/30">
        <img 
          src={shots[currentIndex].imageUrl} 
          alt={`Shot ${currentIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out" 
        />
      </div>
      {shots.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Previous shot"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Next shot"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}
      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs px-2.5 py-1 rounded-full">
        {currentIndex + 1} / {shots.length}
      </div>
    </div>
  );
};

export default ShotCarousel;