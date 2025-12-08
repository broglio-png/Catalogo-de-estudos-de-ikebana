
import JSZip from 'jszip';
import { CatalogedWork } from '../types';

/**
 * Cria um arquivo ZIP contendo os dados do localStorage e dispara o download.
 * Atualiza os metadados de backup para o sistema de lembretes.
 */
export const createBackup = async (works: CatalogedWork[]): Promise<boolean> => {
    try {
        const zip = new JSZip();

        // 1. Prepara os dados
        const dataToSave = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            works: works,
            // Podemos salvar configurações futuras aqui também
            theme: window.localStorage.getItem('theme') || 'dark'
        };

        // 2. Adiciona ao ZIP
        // Como suas imagens já estão em Base64 dentro do objeto 'works',
        // salvar o JSON é suficiente para salvar as imagens.
        // O JSZip vai comprimir essa string gigante de texto eficientemente.
        zip.file("ikebana_data.json", JSON.stringify(dataToSave));

        // 3. Gera o arquivo binário (Blob)
        const content = await zip.generateAsync({ type: "blob" });

        // 4. Dispara o download no navegador (Simulando Expo Sharing)
        const url = window.URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ikebana_backup_${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a);
        a.click();
        
        // Limpeza
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // 5. Atualiza metadados para o Lembrete Automático
        const metadata = {
            lastBackupDate: new Date().toISOString(),
            workCountAtBackup: works.length
        };
        window.localStorage.setItem('backup-metadata', JSON.stringify(metadata));

        return true;
    } catch (error) {
        console.error("Erro ao criar backup:", error);
        throw new Error("Falha ao compactar os dados. Verifique se há espaço disponível.");
    }
};

/**
 * Lê um arquivo ZIP, valida e restaura os dados no localStorage.
 */
export const restoreBackup = async (file: File): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Ler o ZIP
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(file);

            // 2. Localizar o arquivo de dados
            const dataFile = loadedZip.file("ikebana_data.json");
            if (!dataFile) {
                throw new Error("Arquivo de backup inválido. 'ikebana_data.json' não encontrado.");
            }

            // 3. Extrair conteúdo
            const content = await dataFile.async("string");
            const parsedData = JSON.parse(content);

            // 4. Validação básica
            if (!parsedData.works || !Array.isArray(parsedData.works)) {
                throw new Error("Formato de dados corrompido ou incompatível.");
            }

            // 5. Restaurar (Substituir Banco de Dados)
            // CUIDADO: Isso apaga os dados atuais
            window.localStorage.setItem('ikebana-works', JSON.stringify(parsedData.works));
            
            if (parsedData.theme) {
                window.localStorage.setItem('theme', JSON.stringify(parsedData.theme));
            }

            // Atualiza metadados de backup para evitar lembrete imediato
            const metadata = {
                lastBackupDate: new Date().toISOString(),
                workCountAtBackup: parsedData.works.length
            };
            window.localStorage.setItem('backup-metadata', JSON.stringify(metadata));

            resolve();
        } catch (error) {
            console.error("Erro ao restaurar:", error);
            reject(error);
        }
    });
};

/**
 * Verifica se o usuário precisa de um lembrete de backup
 */
export const checkBackupReminder = (currentWorkCount: number): string | null => {
    try {
        const storedMeta = window.localStorage.getItem('backup-metadata');
        if (!storedMeta) return null; // Nunca fez backup ou limpou dados, não incomodar imediatamente

        const { lastBackupDate, workCountAtBackup } = JSON.parse(storedMeta);
        
        const lastDate = new Date(lastBackupDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        const newWorksCount = currentWorkCount - workCountAtBackup;

        if (diffDays >= 15) {
            return `Faz ${diffDays} dias desde seu último backup. Que tal garantir a segurança dos seus dados?`;
        }

        if (newWorksCount >= 5) {
            return `Você adicionou ${newWorksCount} novos estudos! É um bom momento para fazer um backup rápido.`;
        }

        return null;
    } catch (e) {
        return null;
    }
};
