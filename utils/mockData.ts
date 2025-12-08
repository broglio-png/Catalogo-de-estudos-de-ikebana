
import { CatalogedWork } from '../types';

export const MOCK_WORKS: CatalogedWork[] = [
    {
        id: 'mock-1',
        curriculumId: 1, // Fundamental - Tyokusseitai
        imageDataUrl: 'https://images.unsplash.com/photo-1621245084323-2b109315da2a?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2023-01-15T10:00:00.000Z',
        customTitle: 'Meu Primeiro Moribana',
        description: 'Primeira aula prática. Foco na verticalidade.',
        tags: ['início', 'moribana'],
        isFavorite: true,
        rating: 5,
        professorNotes: 'Ótima inclinação do Shin.',
        variety: 'Moribana'
    },
    {
        id: 'mock-2',
        curriculumId: 2, // Fundamental - Shasseitai
        imageDataUrl: 'https://images.unsplash.com/photo-1599818826725-78e0ac834217?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2023-02-20T14:30:00.000Z',
        customTitle: 'Estudo Inclinado',
        description: 'Dificuldade em fixar o Soe.',
        tags: ['treino'],
        isFavorite: false,
        rating: 4,
        professorNotes: '',
        variety: 'Moribana'
    },
    {
        id: 'mock-3',
        curriculumId: 11, // Intermediário - Nageire Fixação
        imageDataUrl: 'https://images.unsplash.com/photo-1678129735399-6e32d3999906?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2023-05-10T09:00:00.000Z',
        customTitle: 'Desafio do Nageire',
        description: 'Técnica de Kubari foi essencial.',
        tags: ['nageire', 'vaso alto'],
        isFavorite: true,
        rating: 5,
        professorNotes: '',
        variety: 'Nageire'
    },
    {
        id: 'mock-4',
        curriculumId: 20, // Intermediário - Linha Curva
        imageDataUrl: 'https://images.unsplash.com/photo-1563241527-300027ba37a8?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2023-07-01T16:00:00.000Z',
        customTitle: 'Movimento Sinuoso',
        description: 'Usando salgueiro chorão para criar curvas.',
        tags: ['movimento'],
        isFavorite: false,
        rating: 3,
        professorNotes: '',
        variety: 'Moribana'
    },
    {
        id: 'mock-5',
        curriculumId: 30, // Avançado - Volume
        imageDataUrl: 'https://images.unsplash.com/photo-1588697960627-759c55b1f9b3?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2023-09-15T11:00:00.000Z',
        customTitle: 'Massu com Rosas',
        description: 'Trabalhando o volume central.',
        tags: ['cores', 'volume'],
        isFavorite: true,
        rating: 5,
        professorNotes: '',
        variety: 'Moribana'
    },
    {
        id: 'mock-6',
        curriculumId: 44, // Avançado - Cruzamento (Kossa)
        imageDataUrl: 'https://images.unsplash.com/photo-1507646170669-e0b605953041?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2023-11-20T13:00:00.000Z',
        customTitle: 'Linhas Cruzadas',
        description: 'Experimento com galhos secos.',
        tags: ['kossa', 'avançado'],
        isFavorite: false,
        rating: 4,
        professorNotes: '',
        variety: 'Nageire'
    },
    {
        id: 'mock-7',
        curriculumId: 58, // Senshukai - Estudo de Cor
        imageDataUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2024-01-10T10:00:00.000Z',
        customTitle: 'Explosão de Cor',
        description: 'Contraste entre amarelo e roxo.',
        tags: ['cor', 'senshukai'],
        isFavorite: true,
        rating: 5,
        professorNotes: '',
        variety: 'Moribana'
    },
    {
        id: 'mock-8',
        curriculumId: 67, // Senshukai - Kakebana
        imageDataUrl: 'https://images.unsplash.com/photo-1555043862-231a314787a3?q=80&w=600&auto=format&fit=crop',
        author: 'Ana Silva',
        creationDate: '2024-02-15T14:00:00.000Z',
        customTitle: 'Arranjo de Parede',
        description: 'Minimalismo no bambu.',
        tags: ['parede', 'kakebana'],
        isFavorite: true,
        rating: 5,
        professorNotes: '',
        variety: 'N/A'
    }
];
