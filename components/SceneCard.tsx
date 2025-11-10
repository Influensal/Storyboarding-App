import React from 'react';
import { Scene } from '../types';
import ShotCarousel from './ShotCarousel';

interface SceneCardProps {
  scene: Scene;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, scene: Scene) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, scene: Scene) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, scene: Scene) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  isDragOver: boolean;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
    </svg>
);


const SceneCard: React.FC<SceneCardProps> = ({ scene, onDelete, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd, isDragging, isDragOver }) => {
  const cardClasses = `
    relative group bg-white/[.03] backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/30
    flex flex-col p-8 gap-6 border
    transition-all duration-300
    hover:border-cyan-400/50 hover:-translate-y-1.5
    ${isDragging ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
    ${isDragOver ? 'border-cyan-400 shadow-2xl shadow-cyan-500/40 scale-[1.02]' : 'border-white/10'}
  `;
    
  return (
    <div 
        className={cardClasses}
        draggable="true"
        onDragStart={(e) => onDragStart(e, scene)}
        onDragOver={(e) => onDragOver(e, scene)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, scene)}
        onDragEnd={onDragEnd}
    >
      <button
        onClick={() => onDelete(scene.id)}
        className="absolute top-6 right-6 bg-red-600/20 border border-red-500/30 text-red-300 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600/50 hover:text-white hover:scale-110 focus:opacity-100 focus:outline-none"
        aria-label={`Delete scene "${scene.title}"`}
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-4 pr-12">
        <div className="cursor-grab text-slate-500 hover:text-slate-300 transition-colors" aria-label="Drag to reorder">
            <DragHandleIcon className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 tracking-tight">{scene.title}</h2>
      </div>
      
      <ShotCarousel shots={scene.shots} />
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Voiceover (VO)</h3>
          <p className="text-slate-300 text-sm whitespace-pre-wrap font-light leading-relaxed">{scene.vo || 'N/A'}</p>
        </div>
        
        <div className="border-t border-white/10"></div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-slate-300 text-sm whitespace-pre-wrap font-light leading-relaxed">{scene.description || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;