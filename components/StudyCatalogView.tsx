import React, { useMemo } from 'react';
import { CurriculumItem, CatalogedWork } from '../types';
import { GRADUATIONS, IKEBANA_CURRICULUM } from '../constants';

const StudyCatalogView: React.FC<{ works: CatalogedWork[] }> = ({ works }) => {
    const completedStudyIds = new Set(works.map(w => w.curriculumId));

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
        <div className="p-4 md:p-8 space-y-6">
             <h1 className="text-3xl font-serif font-bold text-on-surface-light dark:text-on-surface-dark text-center">Catálogo</h1>
             {GRADUATIONS.map(graduation => {
                 const progress = graduationProgress[graduation];
                 const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

                 return (
                 <div key={graduation} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <h2 className="text-2xl font-serif font-semibold text-primary dark:text-primary-light mb-2">{graduation}</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex-grow w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-16 text-right">{progress.completed} / {progress.total}</span>
                        </div>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {IKEBANA_CURRICULUM.filter(item => item.graduation === graduation).map(item => (
                            <li key={item.id} className="py-3 flex justify-between items-center">
                                <p className="flex-1 pr-4 font-medium text-on-surface-light dark:text-on-surface-dark">{item.study}</p>
                                {completedStudyIds.has(item.id) ? (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        Completo
                                    </span>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500 text-sm">Pendente</span>
                                )}
                            </li>
                        ))}
                    </ul>
                 </div>
                 );
             })}
        </div>
    );
}

export default StudyCatalogView;