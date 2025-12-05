
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CatalogedWork } from '../types';
import { IKEBANA_CURRICULUM, GRADUATIONS } from '../constants';

interface DashboardProps {
    works: CatalogedWork[];
}

const COLORS = ['#5E2D91', '#8A4DBA', '#B075D1', '#D4A8E0'];

const StatCard: React.FC<{ icon: string, title: string, value: string | number, subtext?: string }> = ({ icon, title, value, subtext }) => (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div>
            <h2 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{title}</h2>
            <p className="text-2xl font-bold text-text-light dark:text-text-dark">{value}</p>
            {subtext && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{subtext}</p>}
        </div>
    </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-surface-dark p-3 border border-gray-700 rounded-lg shadow-lg text-white text-sm">
                <p className="font-bold mb-2">{data.name}</p>
                <p style={{ color: payload.find(p => p.dataKey === 'completed')?.fill }}>
                    Completos: {payload.find(p => p.dataKey === 'completed')?.value}
                </p>
                <p style={{ color: payload.find(p => p.dataKey === 'remaining')?.fill }}>
                    Restantes: {payload.find(p => p.dataKey === 'remaining')?.value}
                </p>
            </div>
        );
    }
    return null;
};

const Dashboard: React.FC<DashboardProps> = ({ works }) => {
    const stats = useMemo(() => {
        const totalPhotos = works.length;
        const uniqueStudies = new Set(works.map(w => w.curriculumId));
        const totalStudies = IKEBANA_CURRICULUM.length;
        const completionPercentage = totalStudies > 0 ? (uniqueStudies.size / totalStudies) * 100 : 0;

        const progressByGraduation = GRADUATIONS.map(grad => {
            const studiesInGrad = IKEBANA_CURRICULUM.filter(s => s.graduation === grad);
            const total = studiesInGrad.length;

            const completedIdsInGrad = new Set(
                works
                    .filter(w => {
                        const study = IKEBANA_CURRICULUM.find(s => s.id === w.curriculumId);
                        return study && study.graduation === grad;
                    })
                    .map(w => w.curriculumId)
            );

            const completed = completedIdsInGrad.size;
            const remaining = total - completed;

            return {
                name: grad,
                total,
                completed,
                remaining,
            };
        });

        const varietyDistribution = works.reduce((acc, work) => {
            const variety = work.variety;
            if (variety !== 'N/A') {
                const existing = acc.find(item => item.name === variety);
                if (existing) {
                    existing.value += 1;
                } else {
                    acc.push({ name: variety, value: 1 });
                }
            }
            return acc;
        }, [] as { name: string, value: number }[]);

        return { totalPhotos, uniqueStudies, totalStudies, completionPercentage, progressByGraduation, varietyDistribution };
    }, [works]);

    const recentWorks = useMemo(() => {
        return [...works].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).slice(0, 5);
    }, [works]);

    return (
        <div className="p-4 md:p-6 space-y-6 pb-28">
            <header className="mb-6">
                <h1 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark">Painel de Progresso</h1>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Visão geral da sua jornada</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon="photo_library" title="Total de Fotos" value={stats.totalPhotos} />
                <StatCard icon="auto_stories" title="Estudos Únicos" value={`${stats.uniqueStudies.size}`} subtext={`de ${stats.totalStudies} possíveis`} />
                <StatCard icon="pie_chart" title="Conclusão Geral" value={`${stats.completionPercentage.toFixed(1)}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-serif font-bold mb-6 text-text-light dark:text-text-dark">Estudos por Graduação</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.progressByGraduation} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{fill: '#ad9cbf', fontSize: 12}} />
                            <Tooltip cursor={{fill: 'rgba(176, 117, 209, 0.1)'}} content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            <Bar dataKey="completed" stackId="a" fill="#5E2D91" name="Completos" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" name="Restantes" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-serif font-bold mb-6 text-text-light dark:text-text-dark">Estilos (Moribana vs Nageire)</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={stats.varietyDistribution} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={100} 
                                paddingAngle={5} 
                                labelLine={false}
                            >
                                {stats.varietyDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#2a2135', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-serif font-bold mb-4 text-text-light dark:text-text-dark">Atividades Recentes</h2>
                <ul className="space-y-4">
                    {recentWorks.map(work => {
                         const study = IKEBANA_CURRICULUM.find(s => s.id === work.curriculumId);
                         return (
                            <li key={work.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <img src={work.imageDataUrl} alt={work.customTitle} className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"/>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-bold text-sm text-text-light dark:text-text-dark truncate">{work.customTitle || 'Sem Título'}</h3>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">{study?.study || 'Estudo desconhecido'}</p>
                                    <p className="text-[10px] text-primary mt-1">{new Date(work.creationDate).toLocaleDateString()}</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
                            </li>
                         );
                    })}
                     {recentWorks.length === 0 && <div className="text-center text-text-secondary-light dark:text-text-secondary-dark py-10">
                        <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">history</span>
                        <p>Nenhuma atividade recente.</p>
                     </div>}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
