import React, { useState } from 'react';
import { Scene } from '../types';

interface AddSceneFormProps {
  onAddScene: (scene: Omit<Scene, 'id'>) => void;
}

const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const createInitialShots = () => [
    { id: crypto.randomUUID(), url: '' },
    { id: crypto.randomUUID(), url: '' },
];

const AddSceneForm: React.FC<AddSceneFormProps> = ({ onAddScene }) => {
  const [title, setTitle] = useState('');
  const [vo, setVo] = useState('');
  const [description, setDescription] = useState('');
  const [shots, setShots] = useState(createInitialShots());

  const handleShotFileChange = (index: number, file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newShots = [...shots];
      newShots[index].url = e.target?.result as string;
      setShots(newShots);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveShot = (id: string) => {
    setShots(shots.filter(shot => shot.id !== id));
  };

  const handleAddShot = () => {
    if (shots.length < 5) {
        setShots([...shots, { id: crypto.randomUUID(), url: '' }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
        alert("Please provide a title for the scene.");
        return;
    }
    
    const validShots = shots
        .filter(shot => shot.url.trim() !== '')
        .map(shot => ({
            id: crypto.randomUUID(),
            imageUrl: shot.url.trim()
        }));

    if (validShots.length === 0) {
        alert("Please provide at least one shot image.");
        return;
    }

    onAddScene({
      title,
      vo,
      description,
      shots: validShots,
    });

    setTitle('');
    setVo('');
    setDescription('');
    setShots(createInitialShots());
  };

  return (
    <div className="bg-white/[.03] backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black/30 mb-16">
      <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Add New Scene</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/1 transition-all"
            placeholder="e.g., The Opening Chase"
            required
          />
        </div>

        <div>
          <label htmlFor="vo" className="block text-sm font-medium text-slate-300 mb-2">Voiceover (VO)</label>
          <textarea
            id="vo"
            value={vo}
            onChange={(e) => setVo(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/1 transition-all"
            placeholder="e.g., 'In a world of chrome and shadows...'"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/1 transition-all"
            placeholder="e.g., A wide shot of the futuristic city at night. Rain slicks the streets."
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Shots</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {shots.map((shot, index) => (
                    <div key={shot.id} className="relative aspect-video group">
                        <label className="cursor-pointer w-full h-full bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20 hover:border-cyan-400 hover:bg-white/5 transition-colors duration-200">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleShotFileChange(index, e.target.files ? e.target.files[0] : null)}
                            />
                            {shot.url ? (
                                <img src={shot.url} alt={`Shot preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <div className="text-center text-slate-400">
                                    <PhotoIcon className="mx-auto h-8 w-8" />
                                    <span className="mt-2 text-xs block">Upload Image</span>
                                </div>
                            )}
                        </label>
                        {shots.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveShot(shot.id)}
                                className="absolute -top-2 -right-2 bg-red-600/50 backdrop-blur-sm border border-red-500/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/80 hover:scale-110"
                                aria-label="Remove shot"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
                 {shots.length < 5 && (
                    <button
                        type="button"
                        onClick={handleAddShot}
                        className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20 hover:border-cyan-400 hover:bg-white/5 transition-colors duration-200 text-slate-400 hover:text-cyan-400"
                    >
                        <PlusIcon className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-cyan-500 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-1"
        >
          Add Scene
        </button>
      </form>
    </div>
  );
};

export default AddSceneForm;