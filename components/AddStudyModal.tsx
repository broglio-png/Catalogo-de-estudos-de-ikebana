
import React, { useState, useMemo } from 'react';
import { CatalogedWork } from '../types';
import { GRADUATIONS, IKEBANA_CURRICULUM } from '../constants';
import { XMarkIcon } from './Icons';

interface AddStudyModalProps {
  onClose: () => void;
  onSave: (work: CatalogedWork) => void;
}

const AddStudyModal: React.FC<AddStudyModalProps> = ({ onClose, onSave }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  
  // Selection States
  const [selectedGraduation, setSelectedGraduation] = useState<string>(GRADUATIONS[0]);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>('');
  const [selectedStudyId, setSelectedStudyId] = useState<number | undefined>(undefined);

  const [customTitle, setCustomTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [variety, setVariety] = useState<'Moribana' | 'Nageire' | 'N/A'>('N/A');
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. Filter Subgroups based on Graduation
  const availableSubGroups = useMemo(() => {
      const studies = IKEBANA_CURRICULUM.filter(s => s.graduation === selectedGraduation);
      // Unique subgroups
      return Array.from(new Set(studies.map(s => s.subGroup)));
  }, [selectedGraduation]);

  // 2. Filter Studies based on Graduation AND Subgroup
  const availableStudies = useMemo(() => {
    if (!selectedSubGroup) return [];
    return IKEBANA_CURRICULUM.filter(s => 
        s.graduation === selectedGraduation && 
        s.subGroup === selectedSubGroup
    );
  }, [selectedGraduation, selectedSubGroup]);

  // Reset logic when parents change
  const handleGraduationChange = (val: string) => {
      setSelectedGraduation(val);
      setSelectedSubGroup('');
      setSelectedStudyId(undefined);
  };

  const handleSubGroupChange = (val: string) => {
      setSelectedSubGroup(val);
      setSelectedStudyId(undefined);
  };
  
  const handleSave = () => {
    if (!imageDataUrl || !selectedStudyId || !author) {
      setError('Por favor, adicione uma foto, selecione o estudo e informe o autor.');
      return;
    }

    const newWork: CatalogedWork = {
      id: crypto.randomUUID(),
      curriculumId: selectedStudyId,
      imageDataUrl,
      author,
      creationDate: new Date().toISOString(),
      customTitle,
      description: '',
      tags: [],
      isFavorite: false,
      rating: 0,
      professorNotes: '',
      variety,
    };
    onSave(newWork);
  };

  const inputClasses = "mt-1 block w-full px-4 py-3 bg-white dark:bg-[#1f1625] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-light dark:text-text-dark placeholder-gray-400";
  const labelClasses = "block text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 sm:p-4">
      <div className="bg-surface-light dark:bg-surface-dark w-full sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-slideUp sm:animate-fadeIn">
        
        {/* Header */}
        <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-serif font-bold text-text-light dark:text-text-dark">Novo Estudo</h2>
            <button onClick={onClose} className="p-2 rounded-full text-text-secondary-light hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
            
            {/* Image Upload */}
            <div>
                <label className={labelClasses}>Foto do Arranjo</label>
                <div className="mt-1">
                    <label className={`relative flex flex-col justify-center items-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all group overflow-hidden ${imagePreview ? 'border-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary'}`}>
                         {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="space-y-2 text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                                    <span className="material-symbols-outlined text-primary">add_a_photo</span>
                                </div>
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Toque para adicionar foto</p>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange}/>
                    </label>
                </div>
            </div>

            {/* Selectors Cascade */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className={labelClasses}>Graduação</label>
                    <select value={selectedGraduation} onChange={e => handleGraduationChange(e.target.value)} className={inputClasses}>
                        {GRADUATIONS.map(grad => <option key={grad} value={grad}>{grad}</option>)}
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>Subgrupo</label>
                    <select value={selectedSubGroup} onChange={e => handleSubGroupChange(e.target.value)} className={inputClasses}>
                        <option value="">Selecione o grupo...</option>
                        {availableSubGroups.map(sg => <option key={sg} value={sg}>{sg}</option>)}
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>Estudo Específico</label>
                    <select value={selectedStudyId ? String(selectedStudyId) : ''} onChange={e => setSelectedStudyId(Number(e.target.value))} className={inputClasses} disabled={!selectedSubGroup}>
                        <option value="">Selecione o estudo...</option>
                        {availableStudies.map(study => <option key={study.id} value={study.id}>{study.study}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className={labelClasses}>Autor</label>
                    <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className={inputClasses} placeholder="Seu nome"/>
                </div>
                 <div>
                    <label className={labelClasses}>Variedade</label>
                    <div className="mt-1 flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                        {(['Moribana', 'Nageire', 'N/A'] as const).map(v => (
                            <button key={v} onClick={() => setVariety(v)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${variety === v ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark'}`}>
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Título Personalizado (Opcional)</label>
                <input type="text" value={customTitle} onChange={e => setCustomTitle(e.target.value)} className={inputClasses} placeholder="Ex: Arranjo de Primavera"/>
            </div>
        </div>
        
        {/* Error */}
        {error && (
            <div className="px-6 pb-2 animate-shake">
                <p className="text-sm text-red-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                </p>
            </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50/50 dark:bg-black/20 sm:rounded-b-2xl">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                Cancelar
            </button>
            <button type="button" onClick={handleSave} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95">
                Salvar Estudo
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudyModal;
