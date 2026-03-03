import React from 'react';
import {
    IconArrowLeft,
    IconSearch,
    IconDownload,
    IconDotsVertical,
    IconPlus
} from '@tabler/icons-react';

interface DisciplinaryRecord {
    no: number;
    idNo: string;
    fullname: string;
    principal: string;
    dateHired: string;
    violationDate: string;
    reason: string;
    kindOfViolation: string;
    category: string;
    deliveryDate: string;
    status: string;
}

interface DisciplinaryActionMonitoringProps {
    onBack: () => void;
}

const DisciplinaryActionMonitoring: React.FC<DisciplinaryActionMonitoringProps> = ({ onBack }) => {
    const dummyData: DisciplinaryRecord[] = [
        { no: 1, idNo: 'FLI-JBW-A00263', fullname: 'Delonday, Jackielyn', principal: 'JBW', dateHired: '19-Aug-25', violationDate: '4-Sep-25', reason: 'Caught Coffee and Softdrinks During Frisking', kindOfViolation: 'Conduct of Behavior', category: 'A', deliveryDate: '-', status: 'Pending' },
        { no: 2, idNo: 'FLI-JBW-A00273', fullname: 'Navarro, Julia Rose', principal: 'JBW', dateHired: '19-Aug-25', violationDate: '4-Sep-25', reason: 'Caught Coffee and Softdrinks During Frisking', kindOfViolation: 'Conduct of Behavior', category: 'A', deliveryDate: '-', status: 'Ongoing' },
        { no: 3, idNo: 'FLI-JBW-A00278', fullname: 'Ranido, Jhustin Leigh', principal: 'JBW', dateHired: '19-Aug-25', violationDate: '4-Sep-25', reason: 'Caught Coffee and Softdrinks During Frisking', kindOfViolation: 'Conduct of Behavior', category: 'A', deliveryDate: '-', status: 'Resolved' },
    ];

    return (
        <div className="flex flex-col h-full animate-fadeIn">
            <div className="px-3 py-1.5 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-1 rounded bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"><IconArrowLeft className="w-3.5 h-3.5" /></button>
                    <h1 className="text-xs font-bold text-white tracking-wide uppercase">Disciplinary Action Monitoring</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary transition-colors" />
                        <input type="text" placeholder="Search..." className="bg-black/20 border border-white/10 rounded-lg py-1 pl-8 pr-3 text-[9px] text-white focus:outline-none w-40" />
                    </div>
                    <button className="px-2 py-1 rounded bg-primary/20 text-primary-light hover:bg-primary/30 transition-all border border-primary/20 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                        <IconPlus className="w-3 h-3" /> Add
                    </button>
                    <button className="p-1 rounded bg-white/5 text-white hover:bg-white/10 border border-white/10"><IconDownload className="w-3.5 h-3.5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 px-3 py-2">
                {[
                    { label: 'Total', value: '45' },
                    { label: 'Cat. A', value: '32' },
                    { label: 'Cat. B', value: '10' },
                    { label: 'Resolved', value: '38' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded p-1.5 backdrop-blur-sm flex items-center justify-between">
                        <p className="text-text-secondary text-[7.5px] uppercase font-black tracking-widest">{stat.label}</p>
                        <p className="text-[10px] font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-auto px-1 pb-1 custom-scrollbar">
                <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden backdrop-blur-md">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5 text-[8.5px] font-black text-text-secondary uppercase tracking-[0.15em] sticky top-0 z-20 backdrop-blur-xl">
                                <th className="px-2 py-1.5 text-center w-8 text-white">No</th>
                                <th className="px-2 py-1.5">ID #</th>
                                <th className="px-2 py-1.5">Fullname</th>
                                <th className="px-2 py-1.5">Principal</th>
                                <th className="px-2 py-1.5 text-center">Cat.</th>
                                <th className="px-2 py-1.5 text-center">Status</th>
                                <th className="px-2 py-1.5">Violation</th>
                                <th className="px-1.5 py-1.5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {dummyData.map((record) => (
                                <tr key={record.no} className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-2 py-0.5 text-center text-[8.5px] font-bold text-text-secondary">{record.no}</td>
                                    <td className="px-2 py-0.5 font-mono text-[8.5px] text-primary-light">{record.idNo}</td>
                                    <td className="px-2 py-0.5 text-white font-semibold text-[9.5px] whitespace-nowrap">{record.fullname}</td>
                                    <td className="px-2 py-0.5 text-text-secondary text-[8.5px]">{record.principal}</td>
                                    <td className="px-2 py-0.5 text-center">
                                        <span className={`w-4 h-4 mx-auto flex items-center justify-center rounded-full text-[7px] font-bold border ${record.category === 'A' ? 'bg-warning/20 text-warning border-warning/30' : 'bg-info/20 text-info border-info/30'}`}>{record.category}</span>
                                    </td>
                                    <td className="px-2 py-0.5 text-center">
                                        <span className={`px-1.5 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-wider border ${record.status === 'Resolved' ? 'bg-success/20 text-success border-success/30' : record.status === 'Ongoing' ? 'bg-info/20 text-info border-info/30' : 'bg-warning/20 text-warning border-warning/30'}`}>{record.status}</span>
                                    </td>
                                    <td className="px-2 py-0.5 text-text-secondary text-[8.5px] truncate max-w-[300px]" title={record.reason}>{record.reason}</td>
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

export default DisciplinaryActionMonitoring;
