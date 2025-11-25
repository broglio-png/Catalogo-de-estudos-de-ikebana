
import React, { useState, useMemo, useEffect } from 'react';
import { CatalogedWork } from '../types';
import { IKEBANA_CURRICULUM } from '../constants';
import { StarIcon, ShareIcon, XMarkIcon, GalleryIcon } from './Icons';

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

            // 1. Background: Clean White (Requested)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // 2. Image Logic
            // Max height for image allows space for text at bottom
            const imgMaxHeight = 700; // Slightly reduced to make space for extra text
            const imgAspectRatio = img.width / img.height;
            let dWidth = contentWidth;
            let dHeight = dWidth / imgAspectRatio;
            
            if (dHeight > imgMaxHeight) {
                dHeight = imgMaxHeight;
                dWidth = dHeight * imgAspectRatio;
            }
            
            const dx = (canvasWidth - dWidth) / 2;
            const dy = padding + 20;

            // Image Shadow for "Pop" effect
            ctx.shadowColor = "rgba(94, 45, 145, 0.2)"; // Primary purple shadow
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 15;

            // Draw Image
            ctx.drawImage(img, dx, dy, dWidth, dHeight);

            // Subtle Border around image
            ctx.shadowColor = "transparent";
            ctx.strokeStyle = '#F3F4F6';
            ctx.lineWidth = 2;
            ctx.strokeRect(dx, dy, dWidth, dHeight);

            // 3. Text Section
            // All text uses Purple shades as requested ("letras em roxo")
            
            let currentY = dy + dHeight + 60;
            ctx.textAlign = 'center';

            // --- Parse Titles ---
            const fullString = study.study;
            // Portuguese is usually before the first parenthesis
            const cleanStudyName = fullString.split('(')[0].trim();
            // Japanese/Kanji are usually inside parentheses. We extract them.
            const matches = fullString.match(/\(([^)]+)\)/g);
            const japaneseText = matches ? matches.map(m => m.replace(/[()]/g, '')).join(' ') : '';

            // Main Title (Study Name - Portuguese)
            ctx.fillStyle = 'rgb(94, 45, 145)'; // #5E2D91 (Primary)
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

            // Japanese Subtitle (Kanji/Romaji)
            if (japaneseText) {
                ctx.fillStyle = '#8A4DBA'; // Medium Purple
                ctx.font = '30px Lora, serif'; // Using serif for better Kanji rendering if available
                ctx.fillText(japaneseText, canvasWidth / 2, currentY);
                currentY += 50;
            } else {
                currentY += 10;
            }

            // Subtitle (Graduation)
            ctx.font = '500 24px Inter, sans-serif';
            ctx.fillStyle = '#4A2472'; // Darker Purple
            ctx.fillText(study.graduation.toUpperCase(), canvasWidth / 2, currentY);
            currentY += 80;

            // Details Row
            // Using purple for labels
            ctx.textAlign = 'left';
            const leftColX = padding + 80;
            const rightColX = canvasWidth / 2 + 40;
            const detailsY = currentY;

            ctx.font = '20px Inter, sans-serif';
            ctx.fillStyle = '#B075D1'; // Light Purple Accent for Labels
            ctx.fillText('AUTOR', leftColX, detailsY);
            ctx.fillText('DATA', rightColX, detailsY);

            // Values
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillStyle = '#5E2D91'; // Primary Purple for Values
            ctx.fillText(work.author, leftColX, detailsY + 30);
            ctx.fillText(new Date(work.creationDate).toLocaleDateString(), rightColX, detailsY + 30);
            
            // Footer Branding
            ctx.textAlign = 'center';
            ctx.fillStyle = '#B075D1';
            ctx.font = '16px Inter, sans-serif';
            ctx.fillText('Ikebana Studio', canvasWidth / 2, canvasHeight - 40);

            // Trigger Download
            const link = document.createElement('a');
            link.download = `ikebana_${cleanStudyName.slice(0, 10).trim()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-serif font-bold text-on-surface-light dark:text-on-surface-dark mb-6 text-center">Galeria</h1>
            
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="Buscar por título, autor, estudo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-surface-light dark:bg-surface-dark focus:ring-primary focus:border-primary text-on-surface-light dark:text-on-surface-dark"
                />
                 <button onClick={() => setShowFavorites(!showFavorites)} className={`p-2 rounded-md flex items-center justify-center gap-2 transition-colors ${showFavorites ? 'bg-yellow-400 text-white shadow' : 'bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark'}`}>
                    <StarIcon className="w-5 h-5" filled={showFavorites} />
                    <span>Favoritos</span>
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredWorks.map(work => (
                    <div key={work.id} className="relative group aspect-square cursor-pointer" onClick={() => setSelectedWork(work)}>
                        <img src={work.imageDataUrl} alt={work.customTitle} className="w-full h-full object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 flex items-end p-2 rounded-lg opacity-0 group-hover:opacity-100">
                            <p className="text-white text-sm font-semibold truncate">{work.customTitle || IKEBANA_CURRICULUM.find(s=>s.id === work.curriculumId)?.study}</p>
                        </div>
                         <button onClick={(e) => { e.stopPropagation(); toggleFavorite(work); }} className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:text-yellow-500 transition-colors">
                           <StarIcon className={`w-5 h-5 ${work.isFavorite ? 'text-yellow-400' : 'text-gray-500'}`} filled={work.isFavorite}/>
                         </button>
                    </div>
                ))}
            </div>

            {filteredWorks.length === 0 && (
                 <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <GalleryIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"/>
                    <p>Nenhum estudo encontrado.</p>
                    <p className="text-sm">Adicione seu primeiro estudo no botão `+`!</p>
                </div>
            )}

            {selectedWork && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setSelectedWork(null)}>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                        <img src={selectedWork.imageDataUrl} alt={selectedWork.customTitle} className="w-full md:w-1/2 h-64 md:h-auto object-cover"/>
                        <div className="p-6 flex flex-col flex-1">
                           <div className="flex-grow overflow-y-auto pr-2">
                               <h2 className="text-2xl font-serif font-bold text-on-surface-light dark:text-on-surface-dark">{selectedWork.customTitle || "Estudo"}</h2>
                               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">por {selectedWork.author} em {new Date(selectedWork.creationDate).toLocaleDateString()}</p>
                               <div className="bg-primary/10 dark:bg-primary-dark/20 p-3 rounded-md mb-4">
                                   <p className="text-primary dark:text-primary-light font-semibold text-sm">Estudo</p>
                                   <p className="font-medium text-on-surface-light dark:text-on-surface-dark mt-1">{IKEBANA_CURRICULUM.find(s=>s.id === selectedWork.curriculumId)?.study}</p>
                               </div>
                               <div className="space-y-2 text-sm text-on-surface-light dark:text-on-surface-dark">
                                   <p><strong>Variedade:</strong> {selectedWork.variety}</p>
                               </div>
                            </div>
                           <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(selectedWork); setSelectedWork({...selectedWork, isFavorite: !selectedWork.isFavorite}); }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex items-center gap-2">
                                        <StarIcon className={`w-6 h-6 ${selectedWork.isFavorite ? 'text-yellow-400' : 'text-gray-500'}`} filled={selectedWork.isFavorite}/>
                                    </button>
                                     <button onClick={() => generateShareableImage(selectedWork)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex items-center gap-2" title="Compartilhar Imagem">
                                        <ShareIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                                    </button>
                                </div>
                                {showDeleteConfirm ? (
                                    <div className="flex items-center gap-2 animate-fadeIn">
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tem certeza?</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteWork(selectedWork.id); setSelectedWork(null); }} 
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Sim
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }} 
                                            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Não
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }} 
                                        className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 text-sm transition-colors"
                                    >
                                        Apagar
                                    </button>
                                )}
                           </div>
                        </div>
                        <button onClick={() => setSelectedWork(null)} className="absolute top-4 right-4 p-1 rounded-full bg-black/20 text-white hover:bg-black/40">
                            <XMarkIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
