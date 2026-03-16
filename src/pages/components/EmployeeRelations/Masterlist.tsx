import React, { useState } from 'react';
import {
    IconArrowLeft,
    IconSearch,
    IconDownload,
    IconFilter,
    IconPlus,
    IconDotsVertical,
    IconChevronRight,
    IconChevronLeft
} from '@tabler/icons-react';

interface MasterlistProps {
    onBack: () => void;
}

interface EmployeeRecord {
    no: number;
    empId: string;
    lastName: string;
    firstName: string;
    extName: string;
    middleName: string;
    mobileNumber: string;
    address: string;
    gender: 'M' | 'F';
    dateHired: string;
    status: 'REGULAR' | 'PROBATIONARY' | 'RESIGNED' | 'TERMINATED';
    remarks: string;
    position: string;
    deptLine: string;
    section: string;
    building: string;
    shift: 'DAY' | 'NIGHT';
}

const Masterlist: React.FC<MasterlistProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'OVERALL' | 'ACTIVE' | 'TURNOVER' | 'DAY SHIFT' | 'NIGHT SHIFT'>('OVERALL');

    const data: EmployeeRecord[] = [
        { no: 1, empId: 'FL-2024-001', lastName: 'DELA CRUZ', firstName: 'JUAN', extName: '', middleName: 'PETER', mobileNumber: '0917-123-4567', address: 'BRGY. SAN JOSE, ANTIPOLO CITY', gender: 'M', dateHired: '2020-01-10', status: 'REGULAR', remarks: 'GOOD STANDING', position: 'OPERATOR', deptLine: 'LINE 01', section: 'PRODUCTION', building: 'BLDG 1', shift: 'DAY' },
        { no: 2, empId: 'FL-2024-002', lastName: 'SANTOS', firstName: 'MARIA', extName: '', middleName: 'LOPEZ', mobileNumber: '0918-987-6543', address: 'QUEZON CITY, METRO MANILA', gender: 'F', dateHired: '2022-03-15', status: 'REGULAR', remarks: '-', position: 'HR ASSISTANT', deptLine: 'ADMIN', section: 'HR', building: 'BLDG 3', shift: 'DAY' },
        { no: 3, empId: 'FL-2024-003', lastName: 'REYES', firstName: 'RICARDO', extName: '', middleName: 'GARCIA', mobileNumber: '0920-555-0192', address: 'CAVITE CITY', gender: 'M', dateHired: '2019-11-20', status: 'RESIGNED', remarks: 'PERSONAL REASONS', position: 'QA INSPECTOR', deptLine: 'LINE 05', section: 'QA', building: 'BLDG 2', shift: 'NIGHT' },
        { no: 4, empId: 'FL-2024-004', lastName: 'BAUTISTA', firstName: 'ANNA', extName: 'JR.', middleName: 'MAE', mobileNumber: '0999-444-3322', address: 'BULACAN', gender: 'F', dateHired: '2023-06-01', status: 'PROBATIONARY', remarks: '-', position: 'WAREHOUSE CLERK', deptLine: 'LOGISTICS', section: 'WH', building: 'BLDG 1', shift: 'DAY' },
        { no: 5, empId: 'FL-2024-005', lastName: 'MENDOZA', firstName: 'ALEX', extName: '', middleName: 'TAN', mobileNumber: '0915-111-2233', address: 'BATAAN', gender: 'M', dateHired: '2021-05-12', status: 'TERMINATED', remarks: 'VIOLATION', position: 'SUPERVISOR', deptLine: 'LINE 02', section: 'PRODUCTION', building: 'BLDG 1', shift: 'NIGHT' },
    ];

    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!matchesSearch) return false;

        if (activeTab === 'ACTIVE') return item.status === 'REGULAR' || item.status === 'PROBATIONARY';
        if (activeTab === 'TURNOVER') return item.status === 'RESIGNED' || item.status === 'TERMINATED';
        if (activeTab === 'DAY SHIFT') return item.shift === 'DAY';
        if (activeTab === 'NIGHT SHIFT') return item.shift === 'NIGHT';
        return true;
    });

    const columns = [
        '#', 'ID NUMBER', 'LAST NAME', 'FIRST NAME', 'EXT NAME', 'MIDDLE NAME',
        'MOBILE NUMBER', 'ADDRESS', 'GENDER', 'DATE HIRED', 'STATUS',
        'REMARKS', 'POSITION', 'DEPARTMENT / LINE', 'SECTION', 'BUILDING'
    ];

    return (
        <div className="flex flex-col h-full animate-fadeIn">
            {/* Header Section */}
            <div className="px-3 py-1.5 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 group"
                    >
                        <IconArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-[10px] font-black text-white tracking-widest uppercase mb-0.5">Masterlist Database</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                            <span className="text-[7.5px] text-text-secondary font-bold uppercase tracking-widest opacity-60">System Synchronized</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Tabs */}
                    <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/5 mr-2">
                        {(['OVERALL', 'ACTIVE', 'TURNOVER', 'DAY SHIFT', 'NIGHT SHIFT'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-2.5 py-1 text-[7.5px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab
                                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                                    : 'text-text-secondary hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary transition-colors" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[9px] text-white focus:outline-none w-32 focus:w-48 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-xl text-primary-light text-[9px] font-black uppercase tracking-wider hover:bg-primary/30 shadow-lg shadow-primary/10 transition-all active:scale-95">
                        <IconPlus className="w-3.5 h-3.5" />
                        Add Employee
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-[9px] font-bold uppercase tracking-wider hover:bg-white/10">
                        <IconFilter className="w-3 h-3" />
                        Refine
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-primary/20 border border-primary/30 rounded-lg text-primary-light text-[9px] font-bold uppercase tracking-wider hover:bg-primary/30">
                        <IconDownload className="w-3 h-3" />
                        CSV
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[2200px]">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-[#1a1c1e] border-b border-white/10">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-2 py-1 text-[8px] font-black text-text-secondary uppercase tracking-tight border-r border-white/5 last:border-0 text-center whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                            <th className="px-2 py-1 text-[8px] font-black text-text-secondary uppercase tracking-tighter text-center sticky right-0 bg-[#1a1c1e] border-l border-white/10 z-30">OPS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredData.map((row) => (
                            <tr
                                key={row.no}
                                className={`transition-all duration-200 group ${row.status === 'RESIGNED' || row.status === 'TERMINATED'
                                    ? 'bg-danger/10 hover:bg-danger/20'
                                    : 'hover:bg-primary/5'
                                    }`}
                            >
                                <td className={`px-2 py-0.5 text-[8.5px] font-bold border-r border-white/5 text-center ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger-light' : 'text-white/40'}`}>{row.no}</td>
                                <td className="px-2 py-0.5 text-[8.5px] font-bold text-primary-light border-r border-white/5 text-center">{row.empId}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] font-black border-r border-white/5 uppercase ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger-light' : 'text-white'}`}>{row.lastName}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] font-bold border-r border-white/5 uppercase ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger-light' : 'text-white'}`}>{row.firstName}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/70' : 'text-white/60'}`}>{row.extName || '-'}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/70' : 'text-white/60'}`}>{row.middleName}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 font-mono ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger-light' : 'text-success/90'}`}>{row.mobileNumber}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 max-w-[150px] truncate ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/70' : 'text-white/70'}`}>{row.address}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center font-bold ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger-light' : 'text-white'}`}>{row.gender}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/70' : 'text-white/60'}`}>{row.dateHired}</td>
                                <td className="px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center">
                                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-black tracking-tight ${row.status === 'REGULAR' ? 'bg-success/10 text-success border border-success/20' :
                                        row.status === 'PROBATIONARY' ? 'bg-warning/10 text-warning border border-warning/20' :
                                            'bg-danger text-white border border-danger/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 italic ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/60' : 'text-white/40'}`}>{row.remarks}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 font-bold ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger-light' : 'text-white/90'}`}>{row.position}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/70' : 'text-info-light'}`}>{row.deptLine}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/70' : 'text-white/80'}`}>{row.section}</td>
                                <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${row.status === 'RESIGNED' || row.status === 'TERMINATED' ? 'text-danger/70' : 'text-white/80'}`}>{row.building}</td>
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

            {/* Footer */}
            <div className="px-3 py-1 border-t border-white/10 bg-white/5 flex items-center justify-between backdrop-blur-md">
                <div className="text-[8px] text-text-secondary font-bold uppercase tracking-widest opacity-40">
                    Active Cache: <span className="text-white opacity-100 font-black">{filteredData.length}</span> / <span className="text-white opacity-100 font-black">{data.length}</span> Records
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-0.5 rounded bg-white/5 text-text-secondary hover:bg-white/10 opacity-50"><IconChevronLeft className="w-3 h-3" /></button>
                    <span className="text-[8px] text-text-secondary uppercase font-black px-2">Page 1 of 1</span>
                    <button className="p-0.5 rounded bg-white/5 text-text-secondary hover:bg-white/10"><IconChevronRight className="w-3 h-3" /></button>
                </div>
            </div>
        </div>
    );
};

export default Masterlist;
