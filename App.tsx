import React, { useState, useEffect } from 'react';
import { Scene, Storyboard } from './types';
import AddSceneForm from './components/AddSceneForm';
import SceneCard from './components/SceneCard';
import LoadStoryboardModal from './components/LoadStoryboardModal';

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


declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v9l-2.25 1.313M3 7.5l2.25-1.313M3 7.5v9l2.25 1.313m18-13.5v13.5m-2.25-1.313L18.75 18m-1.5-1.313L15 18m-3-1.313L9.75 18m-1.5-1.313L6 18m-3 1.313V7.5m2.25-1.313L6 6m1.5 1.313L9.75 6m1.5 1.313L13.5 6m1.5 1.313L16.5 6m3-1.313-1.5 1.313" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18M3 16.5h18" />
    </svg>
);

function App() {
  const [currentStoryboard, setCurrentStoryboard] = useState<Storyboard>(DEFAULT_STORYBOARD);
  const [savedStoryboards, setSavedStoryboards] = useState<Storyboard[]>(() => {
    try {
      const stored = localStorage.getItem('storyboards');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load storyboards from local storage:", error);
      return [];
    }
  });
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [draggedItem, setDraggedItem] = useState<Scene | null>(null);
  const [dragOverSceneId, setDragOverSceneId] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      localStorage.setItem('storyboards', JSON.stringify(savedStoryboards));
    } catch (error) {
        console.error("Failed to save storyboards to local storage:", error);
        alert("Could not save the storyboard. Your browser's storage might be full.");
    }
  }, [savedStoryboards]);

  const handleAddScene = (newSceneData: Omit<Scene, 'id'>) => {
    const newScene: Scene = {
      ...newSceneData,
      id: `scene-${crypto.randomUUID()}`,
    };
    setCurrentStoryboard(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
      lastModified: Date.now(),
    }));
  };

  const handleDeleteScene = (sceneId: string) => {
    setCurrentStoryboard(prev => ({
      ...prev,
      scenes: prev.scenes.filter(scene => scene.id !== sceneId),
      lastModified: Date.now(),
    }));
  };

  const handleNewStoryboard = () => {
    if (window.confirm("Are you sure you want to start a new storyboard? Any unsaved changes will be lost.")) {
      setCurrentStoryboard(createNewStoryboard());
    }
  };

  const handleSaveStoryboard = () => {
    let storyboardToSave = { ...currentStoryboard, lastModified: Date.now() };

    const isDefaultBoard = storyboardToSave.id === 'default';
    const isUntitled = storyboardToSave.name === 'Untitled Storyboard';

    if (isDefaultBoard || isUntitled) {
      const suggestedName = isUntitled ? '' : storyboardToSave.name;
      const name = window.prompt("Enter a name for your storyboard:", suggestedName);

      if (!name || name.trim() === '') {
        alert("Save cancelled. A name is required.");
        return;
      }
      
      storyboardToSave.name = name.trim();
      if (isDefaultBoard) {
        storyboardToSave.id = `storyboard-${crypto.randomUUID()}`;
      }
    }
    
    setCurrentStoryboard(storyboardToSave);

    setSavedStoryboards(prev => {
      const existingIndex = prev.findIndex(s => s.id === storyboardToSave.id);
      
      if (existingIndex > -1) {
        const newSaved = [...prev];
        newSaved[existingIndex] = storyboardToSave;
        return newSaved;
      } else {
        return [...prev, storyboardToSave];
      }
    });

    alert(`Storyboard "${storyboardToSave.name}" saved!`);
  };

  const handleLoadStoryboard = (storyboardId: string) => {
    const storyboardToLoad = savedStoryboards.find(s => s.id === storyboardId);
    if (storyboardToLoad) {
      setCurrentStoryboard(storyboardToLoad);
      setIsLoadModalOpen(false);
    }
  };
  
  const handleDeleteStoryboard = (storyboardId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this storyboard?")) {
      const newSaved = savedStoryboards.filter(s => s.id !== storyboardId);
      setSavedStoryboards(newSaved);
      
      if (currentStoryboard.id === storyboardId) {
        setCurrentStoryboard(newSaved.length > 0 ? newSaved[0] : createNewStoryboard());
      }
    }
  };

  const handleExportPdf = async () => {
    if (currentStoryboard.scenes.length === 0) {
      alert("There are no scenes to export.");
      return;
    }
    setIsExportingPdf(true);

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '0';
      document.body.appendChild(tempContainer);

      for (let i = 0; i < currentStoryboard.scenes.length; i++) {
        const scene = currentStoryboard.scenes[i];
        
        const sceneHtml = `
          <div style="background-color: #0f172a; color: #e2e8f0; padding: 40px; width: 842px; font-family: 'Poppins', sans-serif; box-sizing: border-box; min-height: 595px;">
            <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 24px 0; border-bottom: 1px solid #334155; padding-bottom: 12px; line-height: 1.2;">Scene ${i+1}: ${scene.title}</h2>
            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 0.5px;">Voiceover</h3>
              <p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${scene.vo || 'N/A'}</p>
            </div>
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 0.5px;">Description</h3>
              <p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${scene.description || 'N/A'}</p>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin: 0 0 12px 0; letter-spacing: 0.5px;">Shots</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
              ${scene.shots.map(shot => `<div style="aspect-ratio: 16 / 9;"><img src="${shot.imageUrl}" style="width: 100%; height: 100%; border-radius: 8px; object-fit: cover;" crossOrigin="anonymous" /></div>`).join('')}
            </div>
          </div>
        `;
        tempContainer.innerHTML = sceneHtml;

        const images = Array.from(tempContainer.querySelectorAll('img'));
        await Promise.all(images.map(img => new Promise(resolve => {
            if (img.complete) return resolve(true);
            img.onload = resolve;
            img.onerror = (e) => {
              console.warn(`Could not load image ${img.src} for PDF export.`, e);
              resolve(false);
            }
        })));
        
        const elementToCapture = tempContainer.children[0] as HTMLElement;
        if (!elementToCapture) {
            console.error("PDF Export: Could not find element to capture for scene", i);
            continue;
        }

        const canvas = await window.html2canvas(elementToCapture, { 
            useCORS: true, 
            allowTaint: true,
            scale: 2,
            backgroundColor: '#0f172a'
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        let imgWidth = pageWidth;
        let imgHeight = imgWidth / ratio;

        if (imgHeight > pageHeight) {
            imgHeight = pageHeight;
            imgWidth = imgHeight * ratio;
        }

        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = (pageHeight - imgHeight) / 2;
        
        if (i > 0) {
          doc.addPage();
        }
        doc.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      }

      doc.save(`${currentStoryboard.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_storyboard.pdf`);
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("An error occurred while exporting the PDF. Please check the console for details.");
    } finally {
      setIsExportingPdf(false);
    }
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

  const handleDragLeave = () => {
      setDragOverSceneId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetScene: Scene) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetScene.id) return;

    const newScenes = [...currentStoryboard.scenes];
    const draggedIndex = newScenes.findIndex(s => s.id === draggedItem.id);
    const targetIndex = newScenes.findIndex(s => s.id === targetScene.id);
    
    const [removed] = newScenes.splice(draggedIndex, 1);
    newScenes.splice(targetIndex, 0, removed);

    setCurrentStoryboard(prev => ({ ...prev, scenes: newScenes, lastModified: Date.now() }));
    setDraggedItem(null);
    setDragOverSceneId(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverSceneId(null);
  };


  return (
    <>
      <LoadStoryboardModal 
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        storyboards={savedStoryboards}
        onLoad={handleLoadStoryboard}
        onDelete={handleDeleteStoryboard}
      />
      <div className="min-h-screen font-sans">
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Storyboard Pro
              </span>
            </h1>
            <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">Visualize your story, one scene at a time.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <button onClick={handleNewStoryboard} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">New Storyboard</button>
              <button onClick={handleSaveStoryboard} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">Save</button>
              <button onClick={() => setIsLoadModalOpen(true)} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">Load</button>
              <button 
                onClick={handleExportPdf} 
                disabled={isExportingPdf || currentStoryboard.scenes.length === 0}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
              >
                {isExportingPdf ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </header>
          
          <AddSceneForm onAddScene={handleAddScene} />

          <div className="border-t border-white/10 my-12"></div>

          {currentStoryboard.scenes.length > 0 ? (
            <div className="flex flex-col gap-8">
              {currentStoryboard.scenes.map(scene => (
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
    </>
  );
}

export default App;