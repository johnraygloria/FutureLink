import React, { useState } from 'react';
import {
    IconArrowLeft,
    IconSearch,
    IconDownload,
    IconFilter,
    IconPlus,
    IconChevronRight,
    IconChevronLeft,
    IconDotsVertical
} from '@tabler/icons-react';

interface ManningUpdateProps {
    onBack: () => void;
}

interface ManningRecord {
    no: number;
    idNumber: string;
    lastName: string;
    firstName: string;
    extName: string;
    middleName: string;
    mobileNumber: string;
    address: string;
    gender: string;
    dateHired: string;
    status: string;
    remarks: string;
    position: string;
    deptLine: string;
    section: string;
    building: string;
    shift: 'DAY' | 'NIGHT';
}

const ManningUpdate: React.FC<ManningUpdateProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'TURNOVER' | 'NIGHT SHIFT' | 'DAY SHIFT'>('ACTIVE');

    const data: ManningRecord[] = [
        { no: 1, idNumber: 'A00218', lastName: 'Martillano', firstName: 'Ivy', extName: '', middleName: 'J', mobileNumber: '0917-xxx-xxxx', address: 'Subic, Zambales', gender: 'F', dateHired: '19-Mar-25', status: 'ACTIVE', remarks: 'Good', position: 'Operator', deptLine: 'Line 01', section: 'Production', building: 'Bldg 1', shift: 'DAY' },
        { no: 2, idNumber: 'NJY-00014', lastName: 'Bautista', firstName: 'Juvelyn', extName: '', middleName: 'S', mobileNumber: '0918-xxx-xxxx', address: 'Olongapo City', gender: 'F', dateHired: '23-Jun-25', status: 'TURNOVER', remarks: 'Resigned', position: 'Operator', deptLine: 'Line 02', section: 'Production', building: 'Bldg 1', shift: 'NIGHT' },
        { no: 3, idNumber: 'NJY-00172', lastName: 'Medrana', firstName: 'Jaymar Rubi', extName: '', middleName: 'R', mobileNumber: '0920-xxx-xxxx', address: 'Castillejos', gender: 'M', dateHired: '05-Aug-25', status: 'ACTIVE', remarks: '-', position: 'Leadman', deptLine: 'Line 05', section: 'QA', building: 'Bldg 2', shift: 'NIGHT' },
    ];

    const filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(val =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!matchesSearch) return false;

        if (activeTab === 'ACTIVE') return record.status === 'ACTIVE';
        if (activeTab === 'TURNOVER') return record.status === 'TURNOVER';
        if (activeTab === 'NIGHT SHIFT') return record.shift === 'NIGHT';
        if (activeTab === 'DAY SHIFT') return record.shift === 'DAY';
        return true;
    });

    const columns = [
        '#', 'ID NUMBER', 'LAST NAME', 'FIRST NAME', 'EXT NAME', 'MIDDLE NAME',
        'MOBILE NUMBER', 'ADDRESS', 'GENDER', 'DATE HIRED', 'STATUS',
        'REMARKS', 'POSITION', 'DEPARTMENT / LINE', 'SECTION', 'BUILDING'
    ];

    return (
        <div className="flex flex-col h-full animate-fadeIn bg-background/50">
            {/* Image Style Header */}
            <div className="px-3 py-1.5 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70">
                        <IconArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-black text-white tracking-tight">FUTURE LINK INCORPORATED</span>
                </div>
                <span className="text-[11px] font-black text-white tracking-tight uppercase">MANNING UPDATE - PHILIPPINES JINBOWAY TECHNOLOGY LTD. CORPORATION</span>
            </div>

            {/* Controls Bar */}
            <div className="px-3 py-1.5 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-white/5">
                    {(['ACTIVE', 'TURNOVER', 'DAY SHIFT', 'NIGHT SHIFT'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md transition-all ${activeTab === tab
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-text-secondary hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Manning..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[9px] text-white focus:outline-none w-32 focus:w-48 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-xl text-primary-light text-[9px] font-black uppercase tracking-wider hover:bg-primary/30 shadow-lg shadow-primary/10 transition-all active:scale-95">
                        <IconPlus className="w-3.5 h-3.5" />
                        Add Record
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-[9px] font-bold uppercase tracking-wider hover:bg-white/10">
                        <IconFilter className="w-3 h-3" />
                        Refine
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-primary/20 border border-primary/30 rounded-lg text-primary-light text-[9px] font-bold uppercase tracking-wider">
                        <IconDownload className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[2000px]">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-[#1a1c1e] border-b border-white/10">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-2 py-1.5 text-[9px] font-black text-text-secondary uppercase tracking-tight border-r border-white/5 last:border-0 text-center">
                                    {col}
                                </th>
                            ))}
                            <th className="px-2 py-1.5 text-[9px] font-black text-text-secondary uppercase tracking-tight text-center sticky right-0 bg-[#1a1c1e] border-l border-white/10 z-30">OPS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredData.map((row) => (
                            <tr
                                key={row.no}
                                className={`transition-colors group ${row.status === 'TURNOVER' ? 'bg-danger/10 hover:bg-danger/20' : 'hover:bg-white/5'}`}
                            >
                                <td className={`px-2 py-0.5 text-[8.5px] font-bold text-center border-r border-white/5 ${row.status === 'TURNOVER' ? 'text-danger-light' : 'text-white/40'}`}>{row.no}</td>
                                <td className="px-2 py-0.5 text-[8.5px] font-bold text-primary-light border-r border-white/5 text-center">{row.idNumber}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] font-black border-r border-white/5 uppercase ${row.status === 'TURNOVER' ? 'text-danger-light' : 'text-white'}`}>{row.lastName}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] font-bold border-r border-white/5 uppercase ${row.status === 'TURNOVER' ? 'text-danger-light' : 'text-white'}`}>{row.firstName}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${row.status === 'TURNOVER' ? 'text-danger/70' : 'text-white/60'}`}>{row.extName || '-'}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${row.status === 'TURNOVER' ? 'text-danger/70' : 'text-white/60'}`}>{row.middleName}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 font-mono ${row.status === 'TURNOVER' ? 'text-danger-light' : 'text-success/90'}`}>{row.mobileNumber}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 max-w-[150px] truncate ${row.status === 'TURNOVER' ? 'text-danger/70' : 'text-white/70'}`}>{row.address}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center font-bold ${row.status === 'TURNOVER' ? 'text-danger-light' : 'text-white'}`}>{row.gender}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${row.status === 'TURNOVER' ? 'text-danger/70' : 'text-white/60'}`}>{row.dateHired}</td>
                                <td className="px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center">
                                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-black tracking-tighter ${row.status === 'ACTIVE' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger text-white border border-danger/50'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 italic ${row.status === 'TURNOVER' ? 'text-danger/50' : 'text-white/40'}`}>{row.remarks}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 font-bold ${row.status === 'TURNOVER' ? 'text-danger-light' : 'text-white/90'}`}>{row.position}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${row.status === 'TURNOVER' ? 'text-danger/70' : 'text-white/80'}`}>{row.deptLine}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${row.status === 'TURNOVER' ? 'text-danger/70' : 'text-white/80'}`}>{row.section}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${row.status === 'TURNOVER' ? 'text-danger/70' : 'text-white/80'}`}>{row.building}</td>
                                <td className="px-2 py-0.5 text-center sticky right-0 bg-[#0f1112] z-30 border-l border-white/10 group-hover:bg-[#1a1c1e] transition-colors">
                                    <button className="p-0.5 rounded hover:bg-white/10 text-text-secondary hover:text-white transition-all">
                                        <IconDotsVertical className="w-3.5 h-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination/Status Footer */}
            <div className="px-3 py-1 border-t border-white/10 bg-white/5 flex items-center justify-between backdrop-blur-md">
                <div className="text-[8px] text-text-secondary font-bold uppercase tracking-widest opacity-40">
                    Displaying: <span className="text-white opacity-100 font-black">{filteredData.length}</span> records
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-0.5 rounded bg-white/5 text-text-secondary hover:bg-white/10 opacity-50"><IconChevronLeft className="w-3 h-3" /></button>
                    <span className="text-[8px] text-text-secondary uppercase font-black">Page 1 of 1</span>
                    <button className="p-0.5 rounded bg-white/5 text-text-secondary hover:bg-white/10"><IconChevronRight className="w-3 h-3" /></button>
                </div>
            </div>
        </div>
    );
};

export default ManningUpdate;
