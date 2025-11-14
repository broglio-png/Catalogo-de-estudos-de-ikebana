import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CatalogedWork } from '../types';
import { IKEBANA_CURRICULUM, GRADUATIONS } from '../constants';
import { FlowerIcon, BookIcon, CheckCircleIcon, IkebanaIcon } from './Icons';

interface DashboardProps {
    works: CatalogedWork[];
}

const COLORS = ['#5E2D91', '#8A4DBA', '#B075D1', '#D4A8E0'];

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, subtext?: string }> = ({ icon, title, value, subtext }) => (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-primary-light/20 dark:bg-primary-dark/30 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h2>
            <p className="text-3xl font-bold text-primary dark:text-primary-light">{value}</p>
            {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
        </div>
    </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-surface-dark p-3 border border-gray-700 rounded-md shadow-lg text-on-surface-dark text-sm">
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
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-serif font-bold text-on-surface-light dark:text-on-surface-dark text-center">Painel</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<FlowerIcon className="w-6 h-6 text-primary dark:text-primary-light"/>} title="Total de Estudos" value={stats.totalPhotos} />
                <StatCard icon={<BookIcon className="w-6 h-6 text-primary dark:text-primary-light"/>} title="Estudos Únicos" value={`${stats.uniqueStudies.size}`} subtext={`de ${stats.totalStudies}`} />
                <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-primary dark:text-primary-light"/>} title="Conclusão" value={`${stats.completionPercentage.toFixed(1)}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-serif font-bold mb-4">Progresso por Graduação</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={stats.progressByGraduation} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'rgba(176, 117, 209, 0.1)'}} content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            <Bar dataKey="completed" stackId="a" fill="#5E2D91" name="Completos" />
                            <Bar dataKey="remaining" stackId="a" fill="#D4A8E0" name="Restantes" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-serif font-bold mb-4">Distribuição por Variedade</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats.varietyDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return (percent > 0.05) ? <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"> {`${(percent * 100).toFixed(0)}%`} </text> : null;
                            }}>
                                {stats.varietyDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#2C2C2C', border: 'none' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-serif font-bold mb-4">Atividades Recentes</h2>
                <ul className="space-y-4">
                    {recentWorks.map(work => {
                         const study = IKEBANA_CURRICULUM.find(s => s.id === work.curriculumId);
                         return (
                            <li key={work.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <img src={work.imageDataUrl} alt={work.customTitle} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
                                <div className="flex-grow">
                                    <h3 className="font-serif font-semibold text-lg">{work.customTitle || 'Sem Título'}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{study?.study || 'Estudo desconhecido'}</p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(work.creationDate).toLocaleDateString()}</p>
                                </div>
                            </li>
                         );
                    })}
                     {recentWorks.length === 0 && <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <IkebanaIcon className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        Nenhuma atividade recente.
                     </div>}
                </ul>
            </div>

        </div>
    );
};

export default Dashboard;