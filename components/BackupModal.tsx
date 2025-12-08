
import React, { useRef, useState } from 'react';
import { CatalogedWork } from '../types';
import { createBackup, restoreBackup } from '../utils/backupSystem';

interface BackupModalProps {
    onClose: () => void;
    works: CatalogedWork[];
}

const BackupModal: React.FC<BackupModalProps> = ({ onClose, works }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleCreateBackup = async () => {
        setStatus('loading');
        setMessage('Compactando imagens e dados...');
        try {
            await createBackup(works);
            setStatus('success');
            setMessage('Backup baixado com sucesso! Guarde-o em local seguro (Google Drive, iCloud).');
        } catch (e: any) {
            setStatus('error');
            setMessage(e.message || 'Erro ao criar backup.');
        }
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("ATENÇÃO: Restaurar um backup substituirá TODOS os dados atuais. Deseja continuar?")) {
            e.target.value = ''; // Reset input
            return;
        }

        setStatus('loading');
        setMessage('Lendo arquivo e restaurando banco de dados...');
        
        try {
            await restoreBackup(file);
            setStatus('success');
            setMessage('Dados restaurados com sucesso! O aplicativo será recarregado.');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (e: any) {
            setStatus('error');
            setMessage(e.message || 'Arquivo inválido ou corrompido.');
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-surface-light dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">cloud_sync</span>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-text-light dark:text-text-dark">Backup & Restauração</h2>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
                        Seus dados são salvos apenas neste dispositivo. Faça backups regulares para não perder suas fotos.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Botão Exportar */}
                    <button 
                        onClick={handleCreateBackup}
                        disabled={status === 'loading'}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary dark:hover:border-primary group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined">upload</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-text-light dark:text-text-dark text-sm">Fazer Backup</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Baixar arquivo .zip</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
                    </button>

                    {/* Botão Importar */}
                    <button 
                        onClick={handleRestoreClick}
                        disabled={status === 'loading'}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary dark:hover:border-primary group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">download</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-text-light dark:text-text-dark text-sm">Restaurar Dados</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Carregar arquivo .zip</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
                    </button>
                    
                    {/* Input Oculto */}
                    <input 
                        type="file" 
                        accept=".zip" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                </div>

                {/* Status Message */}
                {status !== 'idle' && (
                    <div className={`mt-6 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        status === 'error' ? 'bg-red-100 text-red-700' : 
                        status === 'success' ? 'bg-green-100 text-green-700' : 
                        'bg-blue-50 text-blue-700'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {status === 'error' ? 'error' : status === 'success' ? 'check_circle' : 'hourglass_top'}
                        </span>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BackupModal;
