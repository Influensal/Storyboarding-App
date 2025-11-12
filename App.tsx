import React, { useState, useEffect } from 'react';
import { Scene, Storyboard } from './types';
import AddSceneForm from './components/AddSceneForm';
import SceneCard from './components/SceneCard';
import LoadStoryboardModal from './components/LoadStoryboardModal';
import CompilationModal from './components/CompilationModal';

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

const createNewStoryboard = (): Storyboard => ({
    id: `storyboard-${crypto.randomUUID()}`,
    name: 'Untitled Storyboard',
    scenes: [],
    lastModified: Date.now(),
});

const DEFAULT_STORYBOARD: Storyboard = {
  id: 'default',
  name: 'My First Storyboard',
  scenes: INITIAL_SCENES,
  lastModified: Date.now(),
};


// Fix: Defined an interface for `aistudio` to resolve a type conflict. The error message indicated that the property should be of type `AIStudio`.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
    aistudio: AIStudio;
  }
}

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5a2.25 2.25 0 0 1-2.25 2.25H10.5v-1.5a1.5 1.5 0 0 0-1.5-1.5H7.5V3.75m9 0a2.25 2.25 0 0 0-2.25-2.25H8.25a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 8.25 19.5h2.25a1.5 1.5 0 0 0 1.5-1.5v-1.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v1.5a1.5 1.5 0 0 0 1.5 1.5h.75a2.25 2.25 0 0 0 2.25-2.25V3.75Z" />
    </svg>
);

const App: React.FC = () => {
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [currentStoryboard, setCurrentStoryboard] = useState<Storyboard>(DEFAULT_STORYBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isCompilationModalOpen, setIsCompilationModalOpen] = useState(false);
  const [compilationShots, setCompilationShots] = useState<{ imageUrl: string; title: string; vo: string; }[]>([]);

  const [draggingScene, setDraggingScene] = useState<Scene | null>(null);
  const [dragOverScene, setDragOverScene] = useState<Scene | null>(null);

  useEffect(() => {
    try {
        const savedStoryboards = localStorage.getItem('storyboards');
        if (savedStoryboards) {
            setStoryboards(JSON.parse(savedStoryboards));
        }
        const savedCurrent = localStorage.getItem('currentStoryboard');
        if (savedCurrent) {
            setCurrentStoryboard(JSON.parse(savedCurrent));
        } else {
            // Save the default one if nothing is there
            localStorage.setItem('storyboards', JSON.stringify([DEFAULT_STORYBOARD]));
            localStorage.setItem('currentStoryboard', JSON.stringify(DEFAULT_STORYBOARD));
        }
    } catch (error) {
        console.error("Failed to load from localStorage", error);
        // If parsing fails, start fresh
        saveStoryboard(DEFAULT_STORYBOARD);
        setStoryboards([DEFAULT_STORYBOARD]);
        setCurrentStoryboard(DEFAULT_STORYBOARD);
    }
    setIsLoading(false);
  }, []);

  const saveStoryboard = (storyboardToSave: Storyboard) => {
    const updatedStoryboard = { ...storyboardToSave, lastModified: Date.now() };
    const otherStoryboards = storyboards.filter(s => s.id !== updatedStoryboard.id);
    const newStoryboards = [...otherStoryboards, updatedStoryboard];
    
    setStoryboards(newStoryboards);
    setCurrentStoryboard(updatedStoryboard);

    localStorage.setItem('storyboards', JSON.stringify(newStoryboards));
    localStorage.setItem('currentStoryboard', JSON.stringify(updatedStoryboard));
  };
  
  const handleAddScene = (newSceneData: Omit<Scene, 'id'>) => {
    const newScene: Scene = {
      ...newSceneData,
      id: `scene-${crypto.randomUUID()}`
    };
    const updatedStoryboard = { ...currentStoryboard, scenes: [...currentStoryboard.scenes, newScene] };
    saveStoryboard(updatedStoryboard);
  };

  const handleDeleteScene = (id: string) => {
    const updatedScenes = currentStoryboard.scenes.filter(scene => scene.id !== id);
    const updatedStoryboard = { ...currentStoryboard, scenes: updatedScenes };
    saveStoryboard(updatedStoryboard);
  };
  
  const handleDuplicateScene = (id: string) => {
    const sceneToDuplicate = currentStoryboard.scenes.find(scene => scene.id === id);
    if (sceneToDuplicate) {
      const duplicatedScene: Scene = {
        ...sceneToDuplicate,
        id: `scene-${crypto.randomUUID()}`,
        title: `${sceneToDuplicate.title} (Copy)`,
      };
      const sceneIndex = currentStoryboard.scenes.findIndex(scene => scene.id === id);
      const newScenes = [
        ...currentStoryboard.scenes.slice(0, sceneIndex + 1),
        duplicatedScene,
        ...currentStoryboard.scenes.slice(sceneIndex + 1),
      ];
      const updatedStoryboard = { ...currentStoryboard, scenes: newScenes };
      saveStoryboard(updatedStoryboard);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, scene: Scene) => {
    setDraggingScene(scene);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, scene: Scene) => {
    e.preventDefault();
    if (draggingScene?.id !== scene.id) {
        setDragOverScene(scene);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverScene(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetScene: Scene) => {
    e.preventDefault();
    if (!draggingScene) return;

    const scenes = [...currentStoryboard.scenes];
    const draggingIndex = scenes.findIndex(s => s.id === draggingScene.id);
    const targetIndex = scenes.findIndex(s => s.id === targetScene.id);
    
    if (draggingIndex > -1 && targetIndex > -1) {
      const [draggedItem] = scenes.splice(draggingIndex, 1);
      scenes.splice(targetIndex, 0, draggedItem);
      
      const updatedStoryboard = { ...currentStoryboard, scenes };
      saveStoryboard(updatedStoryboard);
    }
    
    setDragOverScene(null);
    setDraggingScene(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDragOverScene(null);
    setDraggingScene(null);
  };

  const handleExportToPDF = () => {
    const storyboardElement = document.getElementById('storyboard-grid');
    if (storyboardElement) {
        const { jsPDF } = window.jspdf;
        window.html2canvas(storyboardElement).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            // This is a rough estimation, you might need to split into multiple pages
            // if the storyboard is very long.
            if (height > pdfHeight) {
                console.warn("Storyboard is too long for a single PDF page. Content might be cut.");
            }

            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save(`${currentStoryboard.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
        });
    }
  };

  const handleLoadStoryboard = (id: string) => {
    const storyboardToLoad = storyboards.find(s => s.id === id);
    if (storyboardToLoad) {
        setCurrentStoryboard(storyboardToLoad);
        localStorage.setItem('currentStoryboard', JSON.stringify(storyboardToLoad));
    }
    setIsLoadModalOpen(false);
  };

  const handleDeleteStoryboard = (id: string) => {
      const remainingStoryboards = storyboards.filter(s => s.id !== id);
      setStoryboards(remainingStoryboards);
      localStorage.setItem('storyboards', JSON.stringify(remainingStoryboards));
      
      // If we are deleting the current storyboard, load another one or create a new one
      if (currentStoryboard.id === id) {
          if (remainingStoryboards.length > 0) {
              handleLoadStoryboard(remainingStoryboards[0].id);
          } else {
              const newStoryboard = createNewStoryboard();
              saveStoryboard(newStoryboard);
              setStoryboards([newStoryboard]);
              setCurrentStoryboard(newStoryboard);
          }
      }
  };

  const handleMakeCompilation = () => {
    if (currentStoryboard.scenes.length === 0) {
      alert("Add some scenes to your storyboard first!");
      return;
    }
  
    const shotsForCompilation = currentStoryboard.scenes
      .filter(scene => scene.shots.length > 0)
      .map(scene => {
        const randomShot = scene.shots[Math.floor(Math.random() * scene.shots.length)];
        return {
          imageUrl: randomShot.imageUrl,
          title: scene.title,
          vo: scene.vo,
        };
      });
  
    if (shotsForCompilation.length === 0) {
      alert("None of your scenes have images to compile.");
      return;
    }
  
    setCompilationShots(shotsForCompilation);
    setIsCompilationModalOpen(true);
  };


  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Storyboard...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter">
                    Storyboard Pro
                </h1>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button onClick={handleMakeCompilation} className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold py-2 px-4 rounded-lg transition-all hover:bg-cyan-500/20 hover:text-white hover:scale-105">
                        <FilmIcon className="w-5 h-5" />
                        <span>Make Compilation</span>
                    </button>
                    <button onClick={() => saveStoryboard(currentStoryboard)} className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors" aria-label="Save current storyboard">
                        <SaveIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsLoadModalOpen(true)} className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors" aria-label="Load a storyboard">
                        <FolderIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleExportToPDF} className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors" aria-label="Export to PDF">
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <input 
                type="text" 
                value={currentStoryboard.name}
                onChange={(e) => {
                    const updated = {...currentStoryboard, name: e.target.value };
                    setCurrentStoryboard(updated);
                    // Debounce saving or save on blur
                }}
                onBlur={() => saveStoryboard(currentStoryboard)}
                className="w-full sm:w-auto text-lg text-slate-400 bg-transparent border-none focus:ring-0 focus:text-slate-200 transition-colors mt-2 p-1 rounded"
                aria-label="Storyboard name"
            />
          </header>

          <main>
            <AddSceneForm onAddScene={handleAddScene} />
            
            <div id="storyboard-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentStoryboard.scenes.map(scene => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  onDelete={handleDeleteScene}
                  onDuplicate={handleDuplicateScene}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={draggingScene?.id === scene.id}
                  isDragOver={dragOverScene?.id === scene.id}
                />
              ))}
            </div>
             {currentStoryboard.scenes.length === 0 && (
                <div className="text-center py-16 px-8 bg-white/[.02] border-2 border-dashed border-white/10 rounded-3xl">
                    <h2 className="text-2xl font-semibold text-slate-300">Your storyboard is empty.</h2>
                    <p className="mt-2 text-slate-500">Use the form above to add your first scene.</p>
                </div>
            )}
          </main>
        </div>
      </div>
      <LoadStoryboardModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        storyboards={storyboards}
        onLoad={handleLoadStoryboard}
        onDelete={handleDeleteStoryboard}
      />
      <CompilationModal
        isOpen={isCompilationModalOpen}
        onClose={() => setIsCompilationModalOpen(false)}
        shots={compilationShots}
      />
    </>
  );
};

export default App;