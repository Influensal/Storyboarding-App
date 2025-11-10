export interface Shot {
  id: string;
  imageUrl: string;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  vo: string; // Voiceover
  shots: Shot[];
}

export interface Storyboard {
  id: string;
  name: string;
  scenes: Scene[];
  lastModified: number;
}
