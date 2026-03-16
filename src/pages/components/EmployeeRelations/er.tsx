import React, { useState } from 'react';
import {
    IconFolder,
    IconFileSpreadsheet,
    IconSearch,
    IconPlus
} from '@tabler/icons-react';
import DisciplinaryActionMonitoring from './DisciplinaryActionMonitoring';
import ClearanceMonitoring from './ClearanceMonitoring';
import ManningView from './ManningView';
import Masterlist from './Masterlist';
import ManningUpdate from './ManningUpdate';

const EmployeeRelations: React.FC = () => {
    const [currentView, setCurrentView] = useState<'main' | 'disciplinary' | 'clearance' | 'manning' | 'masterlist' | 'manning_update'>('main');

    const items = [
        { id: 1, name: 'ATTENDANCE', type: 'folder', status: '-', lastModified: '-' },
        { id: 2, name: 'MANNING', type: 'folder', status: 'Active', lastModified: 'manning' },
        { id: 3, name: 'CLEARANCE MONITORING.xlsx', type: 'excel', status: 'In Review', lastModified: 'clearance' },
        { id: 4, name: 'DISCIPLINARY ACTION MONITORING.xlsx', type: 'excel', status: 'Active', lastModified: 'disciplinary' },
    ];

    if (currentView === 'disciplinary') {
        return (
            <div className="flex w-full relative h-[calc(100vh-0.5rem)]">
                <div className="flex-1 w-full mx-auto py-0.5 px-0.5 h-full">
                    <div className="glass-card w-full h-full rounded-xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">
                        <DisciplinaryActionMonitoring onBack={() => setCurrentView('main')} />
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'clearance') {
        return (
            <div className="flex w-full relative h-[calc(100vh-0.5rem)]">
                <div className="flex-1 w-full mx-auto py-0.5 px-0.5 h-full">
                    <div className="glass-card w-full h-full rounded-xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">
                        <ClearanceMonitoring onBack={() => setCurrentView('main')} />
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'manning') {
        return (
            <div className="flex w-full relative h-[calc(100vh-0.5rem)]">
                <div className="flex-1 w-full mx-auto py-0.5 px-0.5 h-full">
                    <div className="glass-card w-full h-full rounded-xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">
                        <ManningView
                            onBack={() => setCurrentView('main')}
                            onSelectItem={(item) => setCurrentView(item as any)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'masterlist') {
        return (
            <div className="flex w-full relative h-[calc(100vh-0.5rem)]">
                <div className="flex-1 w-full mx-auto py-0.5 px-0.5 h-full">
                    <div className="glass-card w-full h-full rounded-xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">
                        <Masterlist onBack={() => setCurrentView('manning')} />
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'manning_update') {
        return (
            <div className="flex w-full relative h-[calc(100vh-0.5rem)]">
                <div className="flex-1 w-full mx-auto py-0.5 px-0.5 h-full">
                    <div className="glass-card w-full h-full rounded-xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">
                        <ManningUpdate onBack={() => setCurrentView('manning')} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full relative h-[calc(100vh-0.5rem)]">
            <div className="flex-1 w-full mx-auto py-0.5 px-0.5 h-full">
                <div className="glass-card w-full h-full rounded-xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">

                    {/* Header Section */}
                    <div className="px-4 py-3 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                                Employee Relations
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all w-48"
                                />
                            </div>
                        </div>
                    </div>

                    {/* List Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5 text-[9px] font-black text-text-secondary uppercase tracking-[0.15em]">
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => {
                                                if (item.lastModified === 'disciplinary') setCurrentView('disciplinary');
                                                if (item.lastModified === 'clearance') setCurrentView('clearance');
                                                if (item.lastModified === 'manning') setCurrentView('manning');
                                            }}
                                            className={`group hover:bg-white/5 transition-all duration-300 cursor-pointer ${item.lastModified !== '-' ? 'hover:border-primary/30' : ''}`}
                                        >
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-lg ${item.type === 'folder'
                                                        ? 'bg-primary/20 text-primary-light'
                                                        : 'bg-success/20 text-success'
                                                        }`}>
                                                        {item.type === 'folder' ? (
                                                            <IconFolder className="w-5 h-5" />
                                                        ) : (
                                                            <IconFileSpreadsheet className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <span className="text-white font-semibold text-xs group-hover:text-primary-light transition-colors">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                {item.status !== '-' && (
                                                    <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider ${item.status === 'Active' ? 'text-success border-success/30 bg-success/10' :
                                                        'text-primary border-primary/30 bg-primary/10'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-text-secondary text-[10px] uppercase font-bold opacity-60">
                                                {item.type}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <button
                                                    className="p-1 px-3 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (item.lastModified === 'disciplinary') setCurrentView('disciplinary');
                                                        if (item.lastModified === 'clearance') setCurrentView('clearance');
                                                        if (item.lastModified === 'manning') setCurrentView('manning');
                                                    }}
                                                >
                                                    Open
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Quick Actions / Integration Cards */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {[
                                { title: 'New Reporting', icon: IconPlus, color: 'primary' },
                                { title: 'Archive', icon: IconFolder, color: 'white' },
                                { title: 'Quick Search', icon: IconSearch, color: 'info' }
                            ].map((action, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-2.5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-${action.color}/10 text-${action.color} group-hover:scale-110 transition-transform`}>
                                        <action.icon className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-white font-bold text-[10px] uppercase tracking-wider">{action.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRelations;
