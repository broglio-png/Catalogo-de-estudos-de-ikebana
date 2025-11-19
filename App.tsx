
import React, { useState, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { CatalogedWork, Tab } from './types';
import Gallery from './components/Gallery';
import AddStudyModal from './components/AddStudyModal';
import { GalleryIcon, CatalogIcon, DashboardIcon, PlusIcon, BookOpenIcon } from './components/Icons';
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

    const handleGenerateBooklet = async () => {
        if (works.length === 0) {
            alert("Adicione estudos ao seu catálogo primeiro!");
            return;
        }
        setIsGeneratingPdf(true);
        // Allow UI to update before freezing for PDF gen
        setTimeout(() => {
            try {
                generateIkebanaBooklet(works);
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

    const NavButton: React.FC<{ tabName: Tab; icon: React.ReactNode; label: string }> = ({ tabName, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 group relative ${
                activeTab === tabName ? 'text-primary dark:text-primary-light' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
            }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
            <span className={`absolute bottom-0 h-0.5 w-1/2 bg-primary transition-transform duration-300 scale-x-0 ${activeTab === tabName ? 'scale-x-100' : 'group-hover:scale-x-50'}`}></span>
        </button>
    );

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-on-surface-light dark:text-on-surface-dark flex flex-col font-sans">
            <header className="sticky top-0 z-10 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-serif font-bold text-on-surface-light dark:text-on-surface-dark">Ikebana Studio</h1>
                    </div>
                    <button 
                        onClick={handleGenerateBooklet} 
                        disabled={isGeneratingPdf}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/30 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50"
                        title="Gerar Meu Livrinho de Ikebana em PDF"
                    >
                        <BookOpenIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">{isGeneratingPdf ? 'Gerando...' : 'Meu Livrinho'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow pb-24">
                {renderContent()}
            </main>

            {isModalOpen && <AddStudyModal onClose={() => setIsModalOpen(false)} onSave={handleSaveWork} />}
            
            <button onClick={() => setIsModalOpen(true)} className="fixed bottom-20 right-1/2 translate-x-1/2 z-20 w-14 h-14 bg-primary rounded-full text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-surface-light dark:focus:ring-offset-surface-dark">
                <PlusIcon className="w-7 h-7"/>
            </button>

            <footer className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-around items-center h-16 max-w-4xl mx-auto px-2">
                    <NavButton tabName="gallery" label="Galeria" icon={<GalleryIcon className="w-6 h-6" />} />
                    <NavButton tabName="catalog" label="Catálogo" icon={<CatalogIcon className="w-6 h-6" />} />
                    <NavButton tabName="dashboard" label="Progresso" icon={<DashboardIcon className="w-6 h-6" />} />
                </div>
            </footer>
        </div>
    );
};

export default App;