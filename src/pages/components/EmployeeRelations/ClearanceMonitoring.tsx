import React, { useState } from 'react';
import {
    IconArrowLeft,
    IconSearch,
    IconDownload,
    IconDotsVertical,
    IconPlus,
    IconChevronDown
} from '@tabler/icons-react';

interface ClearanceRecord {
    idNo: string;
    fullname: string;
    principal: string;
    dateHired: string;
    dateResignation: string;
    withResignation: string;
    withExitInterview: string;
    returnedIdSbma: string;
    clearanceStatus: 'CLEARED / PAID' | 'WITH CLEARANCE' | 'RETURNED CLEARANCE' | 'NOT ISSUED' | 'PENDING';
    dateReturned: string;
    dateLastPay: string;
    dateClaimed: string;
}

interface ClearanceMonitoringProps {
    onBack: () => void;
}

const ClearanceMonitoring: React.FC<ClearanceMonitoringProps> = ({ onBack }) => {
    const [data, setData] = useState<ClearanceRecord[]>([
        { idNo: 'A00218', fullname: 'Martillano, Ivy', principal: 'JBW-ENJOY', dateHired: '19-Mar-25', dateResignation: '-', withResignation: 'YES', withExitInterview: 'YES', returnedIdSbma: 'YES', clearanceStatus: 'CLEARED / PAID', dateReturned: '9-Aug-25', dateLastPay: '13-Sep-25', dateClaimed: '13-Sep-25' },
        { idNo: 'NJY-00014', fullname: 'Bautista, Juvelyn', principal: 'JBW-ENJOY', dateHired: '23-Jun-25', dateResignation: '21-Jul-25', withResignation: 'YES', withExitInterview: '-', returnedIdSbma: 'YES', clearanceStatus: 'CLEARED / PAID', dateReturned: '23-Aug-25', dateLastPay: '05-Sep-25', dateClaimed: '08-Sep-25' },
        { idNo: 'NJY-00172', fullname: 'Medrana, Jaymar Rubi', principal: 'ENJOY 5B', dateHired: '5-Aug-25', dateResignation: '?', withResignation: '-', withExitInterview: 'YES', returnedIdSbma: 'YES', clearanceStatus: 'WITH CLEARANCE', dateReturned: '20-Aug-25', dateLastPay: '-', dateClaimed: '-' },
        { idNo: 'A00100', fullname: 'Edquibal, Timothy James', principal: 'JBW', dateHired: '22-Jan-25', dateResignation: '18-Sep-25', withResignation: 'YES', withExitInterview: 'YES', returnedIdSbma: 'YES', clearanceStatus: 'RETURNED CLEARANCE', dateReturned: '19-Sep-25', dateLastPay: '-', dateClaimed: '-' },
    ]);

    const statusOptions: ClearanceRecord['clearanceStatus'][] = ['CLEARED / PAID', 'WITH CLEARANCE', 'RETURNED CLEARANCE', 'NOT ISSUED', 'PENDING'];

    const handleStatusChange = (index: number, newStatus: ClearanceRecord['clearanceStatus']) => {
        const updatedData = [...data];
        updatedData[index].clearanceStatus = newStatus;
        setData(updatedData);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CLEARED / PAID': return 'bg-[#10b981] text-white border-[#10b981]/50';
            case 'WITH CLEARANCE': return 'bg-black text-white border-white/20';
            case 'RETURNED CLEARANCE': return 'bg-[#f59e0b] text-black border-[#f59e0b]/50';
            case 'NOT ISSUED': return 'bg-white/10 text-text-secondary border-white/10';
            case 'PENDING': return 'bg-[#ef4444] text-white border-[#ef4444]/50';
            default: return 'bg-white/5 text-text-secondary border-white/10';
        }
    };

    return (
        <div className="flex flex-col h-full animate-fadeIn">
            <div className="px-3 py-1.5 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-1 rounded bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"><IconArrowLeft className="w-3.5 h-3.5" /></button>
                    <h1 className="text-xs font-bold text-white tracking-wide uppercase">Clearance Monitoring</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary transition-colors" />
                        <input type="text" placeholder="Search..." className="bg-black/20 border border-white/10 rounded-lg py-1 pl-8 pr-3 text-[9px] text-white focus:outline-none w-32" />
                    </div>
                    <button className="px-2 py-1 rounded bg-primary/20 text-primary-light hover:bg-primary/30 transition-all border border-primary/20 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                        <IconPlus className="w-3 h-3" /> Add
                    </button>
                    <button className="p-1 rounded bg-white/5 text-white hover:bg-white/10 border border-white/10"><IconDownload className="w-3.5 h-3.5" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-1 py-1 custom-scrollbar">
                <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden backdrop-blur-md">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5 text-[8px] font-black text-text-secondary uppercase tracking-[0.15em] sticky top-0 z-20 backdrop-blur-xl">
                                <th className="px-2 py-1">ID #</th>
                                <th className="px-2 py-1">Fullname</th>
                                <th className="px-2 py-1">Principal</th>
                                <th className="px-2 py-1">Hired</th>
                                <th className="px-2 py-1">Resigned</th>
                                <th className="px-1 py-1 text-center w-8">Res.</th>
                                <th className="px-1 py-1 text-center w-8">Exit</th>
                                <th className="px-2 py-1">ID Return</th>
                                <th className="px-2 py-1 text-center w-32">Status</th>
                                <th className="px-2 py-1">Returned</th>
                                <th className="px-2 py-1">Last Pay</th>
                                <th className="px-2 py-1">Claimed</th>
                                <th className="px-1 py-1 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.map((record, index) => (
                                <tr key={index} className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-2 py-0.5 font-mono text-[8.5px] text-primary-light">{record.idNo}</td>
                                    <td className="px-2 py-0.5 text-white font-semibold text-[9.5px] whitespace-nowrap">{record.fullname}</td>
                                    <td className="px-2 py-0.5 text-text-secondary text-[8.5px]">{record.principal}</td>
                                    <td className="px-2 py-0.5 text-text-secondary text-[8.5px]">{record.dateHired}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] ${record.dateResignation === '?' ? 'text-danger font-bold' : 'text-text-secondary'}`}>{record.dateResignation}</td>
                                    <td className="px-1 py-0.5 text-center text-[8.5px] font-bold">{record.withResignation}</td>
                                    <td className="px-1 py-0.5 text-center text-[8.5px] font-bold">{record.withExitInterview}</td>
                                    <td className="px-2 py-0.5 text-text-secondary text-[8.5px] uppercase truncate">{record.returnedIdSbma}</td>
                                    <td className="px-2 py-0.5 text-center">
                                        <div className="relative group/status flex justify-center">
                                            <button className={`w-full px-1 py-0.5 rounded border text-[7px] font-black tracking-widest uppercase flex items-center justify-between transition-all ${getStatusColor(record.clearanceStatus)}`}>
                                                {record.clearanceStatus}
                                                <IconChevronDown className="w-2 h-2 ml-1 opacity-50" />
                                            </button>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-32 bg-background/95 backdrop-blur-2xl border border-white/10 rounded shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-30 py-1">
                                                {statusOptions.map((opt) => (
                                                    <button key={opt} onClick={() => handleStatusChange(index, opt)} className={`w-full px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-left hover:bg-white/5 transition-colors ${record.clearanceStatus === opt ? 'text-primary' : 'text-text-secondary'}`}>{opt}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-0.5 text-text-secondary text-[8.5px]">{record.dateReturned}</td>
                                    <td className="px-2 py-0.5 text-text-secondary text-[8.5px]">{record.dateLastPay}</td>
                                    <td className="px-2 py-0.5 text-[8.5px] font-bold text-success">{record.dateClaimed}</td>
                                    <td className="px-1.5 py-0.5 text-right">
                                        <button className="p-0.5 rounded text-text-secondary hover:text-white transition-all opacity-0 group-hover:opacity-100"><IconDotsVertical className="w-3 h-3" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClearanceMonitoring;
