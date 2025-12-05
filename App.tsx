
import React, { useState, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { CatalogedWork, Tab } from './types';
import Gallery from './components/Gallery';
import AddStudyModal from './components/AddStudyModal';
import Dashboard from './components/Dashboard';
import StudyCatalogView from './components/StudyCatalogView';
import { generateIkebanaBooklet } from './utils/pdfGenerator';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('gallery');
    const [works, setWorks] = useLocalStorage<CatalogedWork[]>('ikebana-works', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleSaveWork = useCallback((newWork: CatalogedWork) => {
        setWorks(prevWorks => [...prevWorks, newWork]);
        setIsModalOpen(false);
    }, [setWorks]);

    const handleUpdateWork = useCallback((updatedWork: CatalogedWork) => {
        setWorks(prevWorks => prevWorks.map(w => w.id === updatedWork.id ? updatedWork : w));
    }, [setWorks]);

    const handleDeleteWork = useCallback((workId: string) => {
        setWorks(prevWorks => prevWorks.filter(w => w.id !== workId));
    }, [setWorks]);

    const handleGenerateBooklet = () => {
        if (works.length === 0) {
            alert("Adicione estudos ao seu catálogo primeiro!");
            return;
        }
        setIsGeneratingPdf(true);
        setTimeout(async () => {
            try {
                await generateIkebanaBooklet(works);
            } catch (e) {
                console.error("Erro ao gerar PDF", e);
                alert("Ocorreu um erro ao gerar o livrinho.");
            } finally {
                setIsGeneratingPdf(false);
            }
        }, 100);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard works={works} />;
            case 'catalog':
                return <StudyCatalogView works={works} />;
            case 'gallery':
            default:
                return <Gallery works={works} onUpdateWork={handleUpdateWork} onDeleteWork={handleDeleteWork} />;
        }
    };

    const NavButton: React.FC<{ tabName: Tab; icon: string; label: string }> = ({ tabName, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                activeTab === tabName ? 'text-primary dark:text-white' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-white'
            }`}
        >
            <span className={`material-symbols-outlined mb-1 ${activeTab === tabName ? 'filled' : ''}`}>{icon}</span>
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex flex-col font-sans transition-colors duration-300">
            {/* Header (apenas para ações globais, títulos ficam nas views) */}
            <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         {/* Logo ou Nome do App Simples */}
                        <span className="font-serif font-bold text-xl tracking-tight text-primary dark:text-white">Ikebana Studio</span>
                    </div>
                    <button 
                        onClick={handleGenerateBooklet} 
                        disabled={isGeneratingPdf}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">auto_stories</span>
                        <span className="hidden sm:inline">{isGeneratingPdf ? 'Gerando...' : 'Meu Livrinho'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow w-full max-w-4xl mx-auto">
                {renderContent()}
            </main>

            {isModalOpen && <AddStudyModal onClose={() => setIsModalOpen(false)} onSave={handleSaveWork} />}
            
            {/* FAB (Floating Action Button) */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30">
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </div>

            {/* Bottom Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 z-20 pb-safe">
                <div className="flex justify-around items-center h-20 max-w-4xl mx-auto">
                    <NavButton tabName="gallery" label="Galeria" icon="photo_library" />
                    <NavButton tabName="catalog" label="Catálogo" icon="import_contacts" />
                    <NavButton tabName="dashboard" label="Progresso" icon="monitoring" />
                </div>
            </footer>
        </div>
    );
};

export default App;
