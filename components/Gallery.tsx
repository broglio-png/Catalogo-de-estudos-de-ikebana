
import React, { useState, useMemo, useEffect } from 'react';
import { CatalogedWork } from '../types';
import { IKEBANA_CURRICULUM } from '../constants';

interface GalleryProps {
    works: CatalogedWork[];
    onUpdateWork: (updatedWork: CatalogedWork) => void;
    onDeleteWork: (workId: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ works, onUpdateWork, onDeleteWork }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedWork, setSelectedWork] = useState<CatalogedWork | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (selectedWork) {
            setShowDeleteConfirm(false);
        }
    }, [selectedWork]);

    const filteredWorks = useMemo(() => {
        return works.filter(work => {
            const study = IKEBANA_CURRICULUM.find(s => s.id === work.curriculumId);
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                work.customTitle.toLowerCase().includes(searchLower) ||
                work.author.toLowerCase().includes(searchLower) ||
                study?.study.toLowerCase().includes(searchLower);
            
            const matchesFavorites = !showFavorites || work.isFavorite;

            return matchesSearch && matchesFavorites;
        }).sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [works, searchTerm, showFavorites]);

    const toggleFavorite = (work: CatalogedWork) => {
        onUpdateWork({ ...work, isFavorite: !work.isFavorite });
    };

    const generateShareableImage = async (work: CatalogedWork) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const study = IKEBANA_CURRICULUM.find(s => s.id === work.curriculumId);
        if (!study) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = work.imageDataUrl;

        img.onload = () => {
            // Polaroid-style vertical card
            const canvasWidth = 900;
            const canvasHeight = 1200;
            const padding = 60;
            const contentWidth = canvasWidth - (padding * 2);

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // 1. Background: Clean White
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // 2. Image Logic
            const imgMaxHeight = 700;
            const imgAspectRatio = img.width / img.height;
            let dWidth = contentWidth;
            let dHeight = dWidth / imgAspectRatio;
            
            if (dHeight > imgMaxHeight) {
                dHeight = imgMaxHeight;
                dWidth = dHeight * imgAspectRatio;
            }
            
            const dx = (canvasWidth - dWidth) / 2;
            const dy = padding + 20;

            // Image Shadow
            ctx.shadowColor = "rgba(94, 45, 145, 0.2)";
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 15;

            // Draw Image
            ctx.drawImage(img, dx, dy, dWidth, dHeight);

            // Border
            ctx.shadowColor = "transparent";
            ctx.strokeStyle = '#F3F4F6';
            ctx.lineWidth = 2;
            ctx.strokeRect(dx, dy, dWidth, dHeight);

            // 3. Text Section
            let currentY = dy + dHeight + 60;
            ctx.textAlign = 'center';

            // Parse Titles
            const fullString = study.study;
            const cleanStudyName = fullString.split('(')[0].trim();
            const matches = fullString.match(/\(([^)]+)\)/g);
            const japaneseText = matches ? matches.map(m => m.replace(/[()]/g, '')).join(' ') : '';

            // Main Title
            ctx.fillStyle = '#5E2D91';
            ctx.font = 'bold 42px Lora, serif';
            
            const words = cleanStudyName.split(' ');
            let line = '';
            for (const word of words) {
                const testLine = line + word + ' ';
                if (ctx.measureText(testLine).width > contentWidth && line.length > 0) {
                    ctx.fillText(line, canvasWidth / 2, currentY);
                    line = word + ' ';
                    currentY += 50; 
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line.trim(), canvasWidth / 2, currentY);
            currentY += 40;

            // Japanese Subtitle
            if (japaneseText) {
                ctx.fillStyle = '#8A4DBA';
                ctx.font = '30px Lora, serif';
                ctx.fillText(japaneseText, canvasWidth / 2, currentY);
                currentY += 50;
            } else {
                currentY += 10;
            }

            // Subtitle (Graduation)
            ctx.font = '500 24px Inter, sans-serif';
            ctx.fillStyle = '#4A2472';
            ctx.fillText(study.graduation.toUpperCase(), canvasWidth / 2, currentY);
            currentY += 80;

            // Details Row
            ctx.textAlign = 'left';
            const leftColX = padding + 80;
            const rightColX = canvasWidth / 2 + 40;
            const detailsY = currentY;

            ctx.font = '20px Inter, sans-serif';
            ctx.fillStyle = '#B075D1';
            ctx.fillText('AUTOR', leftColX, detailsY);
            ctx.fillText('DATA', rightColX, detailsY);

            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillStyle = '#5E2D91';
            ctx.fillText(work.author, leftColX, detailsY + 30);
            ctx.fillText(new Date(work.creationDate).toLocaleDateString(), rightColX, detailsY + 30);
            
            ctx.textAlign = 'center';
            ctx.fillStyle = '#B075D1';
            ctx.font = '16px Inter, sans-serif';
            ctx.fillText('Ikebana Studio', canvasWidth / 2, canvasHeight - 40);

            const link = document.createElement('a');
            link.download = `ikebana_${cleanStudyName.slice(0, 10).trim()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    };

    return (
        <div className="p-4 md:p-6 pb-28">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 sticky top-0 bg-background-light dark:bg-background-dark z-10 py-2">
                <h1 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark pl-2">Galeria</h1>
                
                <div className="flex gap-3">
                    <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center px-4 py-2.5">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-text-light dark:text-text-dark placeholder-gray-400 ml-2"
                        />
                    </div>
                     <button 
                        onClick={() => setShowFavorites(!showFavorites)} 
                        className={`px-4 rounded-xl flex items-center gap-2 transition-all font-semibold text-sm ${showFavorites ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/30' : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark border border-gray-200 dark:border-gray-800'}`}
                    >
                        <span className={`material-symbols-outlined ${showFavorites ? 'filled' : ''}`}>star</span>
                    </button>
                </div>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredWorks.map(work => (
                    <div key={work.id} className="relative group aspect-square cursor-pointer rounded-xl overflow-hidden shadow-sm" onClick={() => setSelectedWork(work)}>
                        <img src={work.imageDataUrl} alt={work.customTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <p className="text-white text-xs font-bold line-clamp-1">{work.customTitle || IKEBANA_CURRICULUM.find(s=>s.id === work.curriculumId)?.study}</p>
                            <p className="text-white/70 text-[10px]">{work.author}</p>
                        </div>
                         {work.isFavorite && (
                            <div className="absolute top-2 right-2 text-yellow-400">
                                <span className="material-symbols-outlined filled text-lg drop-shadow-md">star</span>
                            </div>
                         )}
                    </div>
                ))}
            </div>

            {filteredWorks.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-gray-400">photo_library</span>
                    </div>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Nenhum estudo encontrado.</p>
                </div>
            )}

            {/* Immersive Detail View */}
            {selectedWork && (
                <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-50 flex flex-col animate-fadeIn overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between p-4 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-10">
                        <button onClick={() => setSelectedWork(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-text-light dark:text-text-dark">arrow_back</span>
                        </button>
                        <div className="flex gap-2">
                             <button onClick={() => generateShareableImage(selectedWork)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
                                <span className="material-symbols-outlined">ios_share</span>
                            </button>
                            <button onClick={() => toggleFavorite(selectedWork)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className={`material-symbols-outlined ${selectedWork.isFavorite ? 'text-yellow-400 filled' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>star</span>
                            </button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="w-full aspect-square md:aspect-video bg-black">
                             <img src={selectedWork.imageDataUrl} className="w-full h-full object-contain mx-auto" alt="Detail" />
                        </div>
                        
                        <div className="p-6 max-w-2xl mx-auto space-y-6">
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark mb-1">{selectedWork.customTitle || "Estudo Sem Título"}</h1>
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                    Adicionado em {new Date(selectedWork.creationDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Metadata Card */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Estudo Curricular</p>
                                    <p className="text-base font-medium text-text-light dark:text-text-dark">
                                        {IKEBANA_CURRICULUM.find(s=>s.id === selectedWork.curriculumId)?.study}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <p className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-1">Graduação</p>
                                        <p className="text-sm text-text-light dark:text-text-dark">
                                            {IKEBANA_CURRICULUM.find(s=>s.id === selectedWork.curriculumId)?.graduation}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-1">Subgrupo</p>
                                        <p className="text-sm text-text-light dark:text-text-dark">
                                            {IKEBANA_CURRICULUM.find(s=>s.id === selectedWork.curriculumId)?.subGroup}
                                        </p>
                                    </div>
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <p className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-1">Variedade</p>
                                        <p className="text-sm text-text-light dark:text-text-dark">{selectedWork.variety}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-1">Autor</p>
                                        <p className="text-sm text-text-light dark:text-text-dark">{selectedWork.author}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delete Confirmation Overlay */}
                    {showDeleteConfirm && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">Apagar Estudo?</h3>
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">Essa ação não pode ser desfeita.</p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={() => { onDeleteWork(selectedWork.id); setSelectedWork(null); }}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white"
                                    >
                                        Apagar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Gallery;
