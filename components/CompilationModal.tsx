import React, { useState, useEffect, useRef } from 'react';

// Icons
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

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

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
    </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);


interface CompilationModalProps {
  isOpen: boolean;
  onClose: () => void;
  shots: {
    imageUrl: string;
    title: string;
    vo: string;
  }[];
}

const SLIDE_DURATION = 3000; // 3 seconds per slide

const CompilationModal: React.FC<CompilationModalProps> = ({ isOpen, onClose, shots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);

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

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      goToNext();
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    if (isOpen) {
        // Reset to first slide and play when modal opens
        setCurrentIndex(0);
        setIsPlaying(true);
    } else {
        // Clear timer when modal closes
        if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isPlaying && isOpen && shots.length > 1) {
      startTimer();
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPlaying, isOpen, shots]);


  if (!isOpen) return null;

  const currentShot = shots[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-950/50 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-4xl h-[80vh] flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-8 h-8" />
        </button>

        {currentShot ? (
            <div className="w-full h-full flex flex-col justify-center items-center relative group">
                <div className="absolute inset-0">
                    <img src={currentShot.imageUrl} alt={currentShot.title} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 w-full p-8 text-center z-10" key={currentIndex}>
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg animate-slide-up">{currentShot.title}</h3>
                    {currentShot.vo && (
                        <p className="mt-2 text-slate-200 text-lg font-light max-w-3xl mx-auto drop-shadow-md animate-slide-up animation-delay-200 leading-relaxed italic">
                            "{currentShot.vo}"
                        </p>
                    )}
                    <p className="mt-4 text-slate-400 drop-shadow-md animate-slide-up animation-delay-400">{currentIndex + 1} / {shots.length}</p>
                </div>

                {shots.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 z-10"
                        aria-label="Previous shot"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 z-10"
                        aria-label="Next shot"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </>
                )}
            </div>
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-slate-400">No shots to display.</p>
            </div>
        )}

        {shots.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-center w-full px-4 z-10">
                 <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-2 flex items-center gap-4">
                    <button onClick={goToPrevious} className="text-white hover:text-cyan-300 p-2"><ChevronLeftIcon className="w-5 h-5"/></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="text-white bg-cyan-500/20 hover:bg-cyan-500/40 rounded-full p-3">
                        {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                    </button>
                    <button onClick={goToNext} className="text-white hover:text-cyan-300 p-2"><ChevronRightIcon className="w-5 h-5"/></button>
                 </div>
            </div>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 overflow-hidden rounded-b-2xl">
            <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-linear"
                style={{ width: `${((currentIndex + 1) / shots.length) * 100}%` }}
            ></div>
        </div>

      </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
            }
            @keyframes slide-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-up {
                animation: slide-up 0.5s ease-out forwards;
            }
            .animation-delay-200 { animation-delay: 0.2s; }
            .animation-delay-400 { animation-delay: 0.4s; }
        `}</style>
    </div>
  );
};

export default CompilationModal;