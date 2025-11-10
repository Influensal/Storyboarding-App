import React from 'react';
import { Storyboard } from '../types';

interface LoadStoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyboards: Storyboard[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const FolderOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0A2.25 2.25 0 0 1 6 7.5h3.75m-3.75 0A2.25 2.25 0 0 0 3.75 12M6 7.5h3.75m-3.75 0a2.25 2.25 0 0 1 2.25-2.25h1.5a2.25 2.25 0 0 1 2.25 2.25m-6 7.5h15m-3.75-.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);


const LoadStoryboardModal: React.FC<LoadStoryboardModalProps> = ({ isOpen, onClose, storyboards, onLoad, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Load Storyboard</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {storyboards.length > 0 ? (
            <ul className="space-y-3">
              {storyboards.sort((a,b) => b.lastModified - a.lastModified).map(storyboard => (
                <li key={storyboard.id} className="group flex items-center justify-between p-4 bg-white/[.03] rounded-lg border border-transparent hover:border-cyan-400/30 hover:bg-white/5 transition-all">
                  <div>
                    <p className="font-semibold text-slate-100">{storyboard.name}</p>
                    <p className="text-xs text-slate-400">
                      {storyboard.scenes.length} scene{storyboard.scenes.length !== 1 && 's'} &bull; Last modified: {new Date(storyboard.lastModified).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onLoad(storyboard.id)} 
                      className="p-2 text-cyan-400 bg-cyan-900/50 rounded-md hover:bg-cyan-900/80 hover:text-white transition-colors"
                      aria-label={`Load storyboard ${storyboard.name}`}
                    >
                      <FolderOpenIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(storyboard.id)} 
                      className="p-2 text-red-400 bg-red-900/50 rounded-md hover:bg-red-900/80 hover:text-white transition-colors"
                      aria-label={`Delete storyboard ${storyboard.name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <FolderOpenIcon className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="mt-4 text-lg font-semibold text-slate-300">No Saved Storyboards</h3>
              <p className="mt-1 text-sm text-slate-500">Use the "Save" button to save your work.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LoadStoryboardModal;
