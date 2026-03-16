import React from 'react';
import {
    IconArrowLeft,
    IconSearch,
    IconFileSpreadsheet,
    IconChevronRight
} from '@tabler/icons-react';

interface ManningViewProps {
    onBack: () => void;
    onSelectItem: (item: string) => void;
}

const ManningView: React.FC<ManningViewProps> = ({ onBack, onSelectItem }) => {
    const items = [
        { id: 1, name: 'MANNING UPDATE.xlsx', type: 'excel', status: 'Active', color: 'primary', count: '590 Staff' },
        { id: 2, name: 'MASTERLIST.xlsx', type: 'excel', status: 'Updated', color: 'success', count: '1,240 Records' },
    ];

    return (
        <div className="flex flex-col h-full animate-fadeIn bg-[#0f1112]">
            {/* Header */}
            {/* Image Style Header */}
            <div className="px-3 py-1.5 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2 sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70">
                        <IconArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-black text-white tracking-tight">FUTURE LINK INCORPORATED</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[11px] font-black text-white tracking-tight uppercase">MANNING DIRECTORY - PHILIPPINES JINBOWAY TECHNOLOGY LTD. CORPORATION</span>

                    <div className="relative group hidden md:block">
                        <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary transition-colors" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="bg-black/20 border border-white/10 rounded-lg py-1 pl-8 pr-3 text-[9px] text-white focus:outline-none w-32 focus:w-48 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onSelectItem(item.name.includes('MASTERLIST') ? 'masterlist' : 'manning_update')}
                            className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                        >
                            {/* Accent Glow */}
                            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${item.color}/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`} />

                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-4 rounded-2xl bg-${item.color}/20 text-${item.color}-light ring-1 ring-${item.color}/30 shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                                        <IconFileSpreadsheet className="w-10 h-10" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-${item.color}/30 bg-${item.color}/10 text-${item.color} mb-1 shadow-sm`}>
                                            {item.status}
                                        </span>
                                        <span className="text-[9px] text-text-secondary font-bold uppercase opacity-40">Auto-Synced</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-white font-black text-2xl tracking-tighter group-hover:text-primary-light transition-colors duration-300">
                                        {item.name}
                                    </h3>
                                    <p className="text-text-secondary text-xs mt-2 opacity-60 font-medium">
                                        Comprehensive data management for {item.name.includes('MASTERLIST') ? 'corporate staffing records' : 'real-time headcount tracking'}.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-6 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-white tracking-widest uppercase">{item.count}</span>
                                        <span className="text-[9px] text-text-secondary uppercase font-bold opacity-40 leading-none mt-1">Total Indexed</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary-light font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                                        Open Module
                                        <IconChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* System Message */}
                <div className="mt-12 flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
                        Future Link Manning Core System v2.1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManningView;
