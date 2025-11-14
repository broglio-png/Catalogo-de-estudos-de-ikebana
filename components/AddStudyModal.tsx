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
  const [selectedGraduation, setSelectedGraduation] = useState<string>(GRADUATIONS[0]);
  const [selectedStudyId, setSelectedStudyId] = useState<number | undefined>(undefined);
  const [customTitle, setCustomTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [variety, setVariety] = useState<'Moribana' | 'Nageire' | 'N/A'>('N/A');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const availableStudies = useMemo(() => {
    return IKEBANA_CURRICULUM.filter(s => s.graduation === selectedGraduation);
  }, [selectedGraduation]);
  
  const handleSave = () => {
    if (!imageDataUrl || !selectedStudyId || !author) {
      alert('Por favor, preencha a imagem, o estudo e o autor.');
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

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-on-surface-light dark:text-on-surface-dark";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-serif font-bold text-on-surface-light dark:text-on-surface-dark">Adicionar Novo Estudo</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                <XMarkIcon className="w-6 h-6"/>
            </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
            <div>
                <label className={labelClasses + " mb-2"}>Imagem do Estudo</label>
                <div className="mt-1 flex justify-center p-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="mx-auto h-40 w-auto object-contain rounded-md" />
                        ) : (
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l-6-6-6 6M28 8v12a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h4m12 0h4a4 4 0 014 4v4m-4-4L36 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-surface-light dark:bg-surface-dark rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-light">
                                <span>Carregar um arquivo</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange}/>
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="graduation" className={labelClasses}>Graduação</label>
                <select id="graduation" value={selectedGraduation} onChange={e => { setSelectedGraduation(e.target.value); setSelectedStudyId(undefined); }} className={inputClasses}>
                    {GRADUATIONS.map(grad => <option key={grad} value={grad}>{grad}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="study" className={labelClasses}>Estudo</label>
                <select id="study" value={selectedStudyId ? String(selectedStudyId) : ''} onChange={e => setSelectedStudyId(Number(e.target.value))} className={inputClasses} disabled={!selectedGraduation}>
                    <option value="">Selecione um estudo</option>
                    {availableStudies.map(study => <option key={study.id} value={study.id}>{study.study}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="author" className={labelClasses}>Autor do Estudo</label>
                <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className={inputClasses} placeholder="Seu nome"/>
            </div>
            <div>
                <label htmlFor="title" className={labelClasses}>Título Personalizado (Opcional)</label>
                <input type="text" id="title" value={customTitle} onChange={e => setCustomTitle(e.target.value)} className={inputClasses} placeholder="Ex: Estudo de Primavera"/>
            </div>
                <div>
                <label className={labelClasses}>Variedade</label>
                <div className="mt-2 flex items-center space-x-4 rounded-md bg-gray-100 dark:bg-gray-900 p-1">
                    {(['Moribana', 'Nageire', 'N/A'] as const).map(v => (
                        <button key={v} onClick={() => setVariety(v)} className={`w-full py-1.5 text-sm font-medium rounded-md transition-colors ${variety === v ? 'bg-white dark:bg-gray-700 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50'}`}>
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">Cancelar</button>
            <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default AddStudyModal;