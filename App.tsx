import React, { useState } from 'react';
import { Scene } from './types';
import AddSceneForm from './components/AddSceneForm';
import SceneCard from './components/SceneCard';

const INITIAL_SCENES: Scene[] = [
    {
        id: 'scene-1',
        title: 'Introduction to Neo-Kyoto',
        description: 'The camera pans across a sprawling, rain-slicked cyberpunk city. Towering skyscrapers are adorned with holographic ads. Flying vehicles zip between buildings.',
        vo: "They called it Neo-Kyoto, the city that never slept because it was always dreaming of the future. A future that had arrived too fast.",
        shots: [
            { id: 'shot-1-1', imageUrl: 'https://picsum.photos/800/450?random=10' },
            { id: 'shot-1-2', imageUrl: 'https://picsum.photos/800/450?random=11' },
            { id: 'shot-1-3', imageUrl: 'https://picsum.photos/800/450?random=12' },
        ]
    },
    {
        id: 'scene-2',
        title: 'The Rooftop Meeting',
        description: 'Our protagonist, Kael, meets a mysterious informant on a windswept rooftop overlooking the city. The informant hands him a data chip.',
        vo: "Information was the only currency that mattered. And I was about to make a very risky investment.",
        shots: [
            { id: 'shot-2-1', imageUrl: 'https://picsum.photos/800/450?random=20' },
            { id: 'shot-2-2', imageUrl: 'https://picsum.photos/800/450?random=21' },
        ]
    }
];

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v9l-2.25 1.313M3 7.5l2.25-1.313M3 7.5v9l2.25 1.313m18-13.5v13.5m-2.25-1.313L18.75 18m-1.5-1.313L15 18m-3-1.313L9.75 18m-1.5-1.313L6 18m-3 1.313V7.5m2.25-1.313L6 6m1.5 1.313L9.75 6m1.5 1.313L13.5 6m1.5 1.313L16.5 6m3-1.313-1.5 1.313" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18M3 16.5h18" />
    </svg>
);

function App() {
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [draggedItem, setDraggedItem] = useState<Scene | null>(null);
  const [dragOverSceneId, setDragOverSceneId] = useState<string | null>(null);

  const handleAddScene = (newSceneData: Omit<Scene, 'id'>) => {
    const newScene: Scene = {
      ...newSceneData,
      id: `scene-${crypto.randomUUID()}`,
    };
    setScenes(prevScenes => [...prevScenes, newScene]);
  };

  const handleDeleteScene = (sceneId: string) => {
    setScenes(prevScenes => prevScenes.filter(scene => scene.id !== sceneId));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, scene: Scene) => {
    setDraggedItem(scene);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetScene: Scene) => {
    e.preventDefault();
    if (draggedItem?.id !== targetScene.id) {
        setDragOverSceneId(targetScene.id);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      setDragOverSceneId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetScene: Scene) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetScene.id) return;

    const newScenes = [...scenes];
    const draggedIndex = newScenes.findIndex(s => s.id === draggedItem.id);
    const targetIndex = newScenes.findIndex(s => s.id === targetScene.id);
    
    const [removed] = newScenes.splice(draggedIndex, 1);
    newScenes.splice(targetIndex, 0, removed);

    setScenes(newScenes);
    setDraggedItem(null);
    setDragOverSceneId(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverSceneId(null);
  };


  return (
    <div className="min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Storyboard Pro
            </span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">Visualize your story, one scene at a time.</p>
        </header>
        
        <AddSceneForm onAddScene={handleAddScene} />

        <div className="border-t border-white/10 my-12"></div>

        {scenes.length > 0 ? (
          <div className="flex flex-col gap-8">
            {scenes.map(scene => (
              <SceneCard 
                key={scene.id} 
                scene={scene} 
                onDelete={handleDeleteScene} 
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={draggedItem?.id === scene.id}
                isDragOver={dragOverSceneId === scene.id && draggedItem?.id !== scene.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white/[.03] backdrop-blur-xl rounded-3xl border border-white/10">
            <div className="mx-auto w-fit bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full shadow-lg shadow-cyan-500/20">
              <FilmIcon className="w-10 h-10 text-white"/>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">Create Your First Scene</h2>
            <p className="mt-4 text-lg text-slate-400">Your storyboard is waiting. Use the form above to bring your vision to life.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;