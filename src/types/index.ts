export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  modelUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  category: 'robotics' | 'computer-vision' | 'machine-learning' | 'multi-agent' | 'research';
  featured: boolean;
  year: number;
}

export interface Section {
  id: string;
  title: string;
  element: HTMLElement;
}

export interface ThreeSceneConfig {
  containerId: string;
  modelPath?: string;
  cameraPosition?: [number, number, number];
  backgroundColor?: string;
  enableControls?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}