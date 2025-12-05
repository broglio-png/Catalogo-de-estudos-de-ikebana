
import React, { useMemo, useState } from 'react';
import { CatalogedWork, CurriculumItem } from '../types';
import { GRADUATIONS, IKEBANA_CURRICULUM } from '../constants';

const StudyCatalogView: React.FC<{ works: CatalogedWork[] }> = ({ works }) => {
    const completedStudyIds = new Set(works.map(w => w.curriculumId));
    
    // Estado para controlar quais graduações estão expandidas
    const [expandedGraduations, setExpandedGraduations] = useState<Record<string, boolean>>({
        'Fundamental': true // Começa com o primeiro aberto
    });

    const toggleGraduation = (grad: string) => {
        setExpandedGraduations(prev => ({
            ...prev,
            [grad]: !prev[grad]
        }));
    };

    // Agrupamento dos dados: Graduação -> Subgrupo -> Estudos
    const groupedCurriculum = useMemo(() => {
        const structure: Record<string, Record<string, CurriculumItem[]>> = {};

        IKEBANA_CURRICULUM.forEach(item => {
            if (!structure[item.graduation]) {
                structure[item.graduation] = {};
            }
            if (!structure[item.graduation][item.subGroup]) {
                structure[item.graduation][item.subGroup] = [];
            }
            structure[item.graduation][item.subGroup].push(item);
        });
        return structure;
    }, []);

    // Cálculo de progresso
    const graduationProgress = useMemo(() => {
        const progress: { [key: string]: { completed: number, total: number } } = {};
        GRADUATIONS.forEach(grad => {
            const studiesInGrad = IKEBANA_CURRICULUM.filter(item => item.graduation === grad);
            const completedInGrad = studiesInGrad.filter(item => completedStudyIds.has(item.id));
            progress[grad] = {
                completed: completedInGrad.length,
                total: studiesInGrad.length,
            };
        });
        return progress;
    }, [completedStudyIds]);

    return (
        <div className="p-4 md:p-6 space-y-4 pb-28">
             <header className="mb-6">
                 <h1 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark">Catálogo Curricular</h1>
                 <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Acompanhe seu progresso por níveis</p>
             </header>

             {GRADUATIONS.map(graduation => {
                 const progress = graduationProgress[graduation];
                 const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
                 const isExpanded = expandedGraduations[graduation];
                 const subGroups = groupedCurriculum[graduation] || ({} as Record<string, CurriculumItem[]>);

                 return (
                 <div key={graduation} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Header da Graduação (Clicável) */}
                    <div 
                        onClick={() => toggleGraduation(graduation)}
                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-serif font-bold text-primary dark:text-white">{graduation}</h2>
                            <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark transform transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                expand_more
                            </span>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                                <span>{percentage}% concluído</span>
                                <span>{progress.completed}/{progress.total}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo em Cascata */}
                    {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
                            {Object.entries(subGroups).map(([subGroup, studies]: [string, CurriculumItem[]]) => (
                                <div key={subGroup} className="p-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
                                    <h3 className="text-sm font-bold text-text-light dark:text-text-dark mb-3 pl-2 border-l-4 border-primary/50 uppercase tracking-wide">
                                        {subGroup}
                                    </h3>
                                    <ul className="space-y-2">
                                        {studies.map(item => {
                                            const isCompleted = completedStudyIds.has(item.id);
                                            return (
                                                <li key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors">
                                                    <div className={`mt-0.5 shrink-0 ${isCompleted ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                                                        <span className="material-symbols-outlined text-xl">
                                                            {isCompleted ? 'check_circle' : 'circle'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium leading-snug ${isCompleted ? 'text-text-light dark:text-text-dark' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                                                            {item.study}
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
                 );
             })}
        </div>
    );
}

export default StudyCatalogView;
