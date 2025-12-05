
export interface CurriculumItem {
  id: number;
  graduation: string;
  subGroup: string;
  study: string;
  varietySuggestion: 'Moribana' | 'Nageire' | 'N/A';
}

export interface CatalogedWork {
  id: string; // uuid
  curriculumId: number;
  imageDataUrl: string;
  author: string;
  creationDate: string; // ISO string
  customTitle: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  rating: number; // 0-5
  professorNotes: string;
  variety: 'Moribana' | 'Nageire' | 'N/A';
}

export type Tab = 'gallery' | 'catalog' | 'dashboard';
