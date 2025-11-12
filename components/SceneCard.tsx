import React from 'react';
import { Scene } from '../types';
import ShotCarousel from './ShotCarousel';

interface SceneCardProps {
  scene: Scene;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
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

const DuplicateSceneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
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


const SceneCard: React.FC<SceneCardProps> = ({ scene, onDelete, onDuplicate, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd, isDragging, isDragOver }) => {
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
      <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onDuplicate(scene.id)}
          className="bg-blue-600/20 border border-blue-500/30 text-blue-300 p-2 rounded-full transition-all duration-200 hover:bg-blue-600/50 hover:text-white hover:scale-110 focus:opacity-100 focus:outline-none"
          aria-label={`Duplicate scene "${scene.title}"`}
        >
          <DuplicateSceneIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(scene.id)}
          className="bg-red-600/20 border border-red-500/30 text-red-300 p-2 rounded-full transition-all duration-200 hover:bg-red-600/50 hover:text-white hover:scale-110 focus:opacity-100 focus:outline-none"
          aria-label={`Delete scene "${scene.title}"`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 pr-28">
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