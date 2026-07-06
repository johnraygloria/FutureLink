import React, { useEffect, useState } from 'react';
import {
    IconArrowLeft,
    IconSearch,
    IconDownload,
    IconFilter,
    IconPlus,
    IconDotsVertical,
    IconChevronRight,
    IconChevronLeft,
    IconX
} from '@tabler/icons-react';
import {
    createMasterlistEmployee,
    fetchMasterlistEmployees,
    updateMasterlistEmployee,
    type CreateMasterlistEmployeeInput,
    type EmployeeStatus,
    type EmploymentStatus,
    type MasterlistEmployee,
} from '../../../api/masterlist';

interface MasterlistProps {
    onBack: () => void;
}

const initialFormState: CreateMasterlistEmployeeInput = {
    empId: '',
    lastName: '',
    firstName: '',
    extName: '',
    middleName: '',
    mobileNumber: '',
    address: '',
    gender: 'M',
    dateHired: '',
    status: 'ACTIVE',
    employmentStatus: 'PROBATIONARY',
    remarks: '',
    position: '',
    deptLine: '',
    section: '',
    building: '',
    shift: 'DAY',
};

const isTurnover = (status: string) => status === 'RESIGNED' || status === 'TERMINATED';

const statusSelectClass = (status: string) => {
    if (status === 'ACTIVE') return 'bg-success/10 text-success border-success/20';
    if (status === 'RESIGNED') return 'bg-danger/10 text-danger-light border-danger/30';
    return 'bg-danger text-white border-danger/50';
};

const employmentSelectClass = (status: string) =>
    status === 'REGULAR'
        ? 'bg-success/10 text-success border-success/20'
        : 'bg-warning/10 text-warning border-warning/20';

const Masterlist: React.FC<MasterlistProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'OVERALL' | 'ACTIVE' | 'TURNOVER' | 'DAY SHIFT' | 'NIGHT SHIFT'>('OVERALL');
    const [data, setData] = useState<MasterlistEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState(initialFormState);
    const [submitting, setSubmitting] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const employees = await fetchMasterlistEmployees();
            setData(employees);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const isInactive = (row: MasterlistEmployee) => isTurnover(row.status);

    const handleStatusChange = async (row: MasterlistEmployee, status: EmployeeStatus) => {
        if (row.status === status) return;
        try {
            setUpdatingId(row.id);
            setError(null);
            const updated = await updateMasterlistEmployee(row.id, { status });
            setData(prev => prev.map(item => item.id === row.id ? updated : item));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleEmploymentStatusChange = async (row: MasterlistEmployee, employmentStatus: EmploymentStatus) => {
        if (row.employment_status === employmentStatus) return;
        try {
            setUpdatingId(row.id);
            setError(null);
            const updated = await updateMasterlistEmployee(row.id, { employment_status: employmentStatus });
            setData(prev => prev.map(item => item.id === row.id ? updated : item));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update employment status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredData = data.filter(item => {
        const matchesSearch = [
            item.emp_id,
            item.last_name,
            item.first_name,
            item.ext_name,
            item.middle_name,
            item.mobile_number,
            item.address,
            item.gender,
            item.date_hired,
            item.status,
            item.employment_status,
            item.remarks,
            item.position,
            item.dept_line,
            item.section,
            item.building,
            item.shift,
        ].some(val =>
            (val ?? '').toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!matchesSearch) return false;

        if (activeTab === 'ACTIVE') return item.status === 'ACTIVE';
        if (activeTab === 'TURNOVER') return isTurnover(item.status);
        if (activeTab === 'DAY SHIFT') return item.shift === 'DAY';
        if (activeTab === 'NIGHT SHIFT') return item.shift === 'NIGHT';
        return true;
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.empId.trim() || !form.lastName.trim() || !form.firstName.trim()) return;

        try {
            setSubmitting(true);
            const employee = await createMasterlistEmployee(form);
            setData(prev => [...prev, employee]);
            setForm(initialFormState);
            setShowAddModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add employee');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        '#', 'ID NUMBER', 'LAST NAME', 'FIRST NAME', 'EXT NAME', 'MIDDLE NAME',
        'MOBILE NUMBER', 'ADDRESS', 'GENDER', 'DATE HIRED', 'STATUS', 'EMPLOYMENT STATUS',
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
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-xl text-primary-light text-[9px] font-black uppercase tracking-wider hover:bg-primary/30 shadow-lg shadow-primary/10 transition-all active:scale-95"
                    >
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

            {error && (
                <div className="px-3 py-1.5 bg-danger/10 border-b border-danger/20 text-danger-light text-[9px] font-bold uppercase tracking-wider">
                    {error}
                </div>
            )}

            {/* Table Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                {loading ? (
                    <div className="flex items-center justify-center h-32 text-[10px] text-text-secondary uppercase tracking-widest font-black">
                        Loading employees...
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[2400px]">
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
                            {filteredData.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`transition-all duration-200 group ${isInactive(row)
                                        ? 'bg-danger/10 hover:bg-danger/20'
                                        : 'hover:bg-primary/5'
                                        }`}
                                >
                                    <td className={`px-2 py-0.5 text-[8.5px] font-bold border-r border-white/5 text-center ${isInactive(row) ? 'text-danger-light' : 'text-white/40'}`}>{index + 1}</td>
                                    <td className="px-2 py-0.5 text-[8.5px] font-bold text-primary-light border-r border-white/5 text-center">{row.emp_id}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] font-black border-r border-white/5 uppercase ${isInactive(row) ? 'text-danger-light' : 'text-white'}`}>{row.last_name}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] font-bold border-r border-white/5 uppercase ${isInactive(row) ? 'text-danger-light' : 'text-white'}`}>{row.first_name}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${isInactive(row) ? 'text-danger/70' : 'text-white/60'}`}>{row.ext_name || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${isInactive(row) ? 'text-danger/70' : 'text-white/60'}`}>{row.middle_name || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 font-mono ${isInactive(row) ? 'text-danger-light' : 'text-success/90'}`}>{row.mobile_number || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 max-w-[150px] truncate ${isInactive(row) ? 'text-danger/70' : 'text-white/70'}`}>{row.address || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center font-bold ${isInactive(row) ? 'text-danger-light' : 'text-white'}`}>{row.gender || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center ${isInactive(row) ? 'text-danger/70' : 'text-white/60'}`}>{row.date_hired || '-'}</td>
                                    <td className="px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center">
                                        <select
                                            value={row.status}
                                            disabled={updatingId === row.id}
                                            onChange={(e) => handleStatusChange(row, e.target.value as EmployeeStatus)}
                                            className={`px-1 py-0.5 rounded text-[7px] font-black tracking-tight border appearance-none cursor-pointer text-center min-w-[72px] ${statusSelectClass(row.status)} disabled:opacity-50`}
                                        >
                                            <option value="ACTIVE" className="bg-gray-900 text-white">ACTIVE</option>
                                            <option value="RESIGNED" className="bg-gray-900 text-white">RESIGNED</option>
                                            <option value="TERMINATED" className="bg-gray-900 text-white">TERMINATED</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center">
                                        <select
                                            value={row.employment_status}
                                            disabled={updatingId === row.id}
                                            onChange={(e) => handleEmploymentStatusChange(row, e.target.value as EmploymentStatus)}
                                            className={`px-1 py-0.5 rounded text-[7px] font-black tracking-tight border appearance-none cursor-pointer text-center min-w-[88px] ${employmentSelectClass(row.employment_status)} disabled:opacity-50`}
                                        >
                                            <option value="REGULAR" className="bg-gray-900 text-white">REGULAR</option>
                                            <option value="PROBATIONARY" className="bg-gray-900 text-white">PROBATIONARY</option>
                                        </select>
                                    </td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 italic ${isInactive(row) ? 'text-danger/60' : 'text-white/40'}`}>{row.remarks || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 font-bold ${isInactive(row) ? 'text-danger-light' : 'text-white/90'}`}>{row.position || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${isInactive(row) ? 'text-danger/70' : 'text-info-light'}`}>{row.dept_line || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${isInactive(row) ? 'text-danger/70' : 'text-white/80'}`}>{row.section || '-'}</td>
                                    <td className={`px-2 py-0.5 text-[8.5px] border-r border-white/5 ${isInactive(row) ? 'text-danger/70' : 'text-white/80'}`}>{row.building || '-'}</td>
                                    <td className="px-2 py-0.5 text-center sticky right-0 bg-[#0f1112] z-30 border-l border-white/10 group-hover:bg-[#1a1c1e] transition-colors">
                                        <button className="p-0.5 rounded hover:bg-white/10 text-text-secondary hover:text-white transition-all">
                                            <IconDotsVertical className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-[#1a1c1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xs font-black text-white uppercase tracking-widest">Add Employee</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 rounded hover:bg-white/10 text-text-secondary hover:text-white"
                            >
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee} className="p-4 grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {[
                                { name: 'empId', label: 'ID Number', required: true },
                                { name: 'lastName', label: 'Last Name', required: true },
                                { name: 'firstName', label: 'First Name', required: true },
                                { name: 'extName', label: 'Ext Name' },
                                { name: 'middleName', label: 'Middle Name' },
                                { name: 'mobileNumber', label: 'Mobile Number' },
                                { name: 'address', label: 'Address' },
                                { name: 'dateHired', label: 'Date Hired', type: 'date' },
                                { name: 'position', label: 'Position' },
                                { name: 'deptLine', label: 'Department / Line' },
                                { name: 'section', label: 'Section' },
                                { name: 'building', label: 'Building' },
                            ].map(field => (
                                <div key={field.name}>
                                    <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        name={field.name}
                                        type={field.type || 'text'}
                                        value={(form as Record<string, string>)[field.name] || ''}
                                        onChange={handleFormChange}
                                        required={field.required}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={form.gender || 'M'}
                                    onChange={handleFormChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none"
                                >
                                    <option value="M">M</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Shift</label>
                                <select
                                    name="shift"
                                    value={form.shift || 'DAY'}
                                    onChange={handleFormChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none"
                                >
                                    <option value="DAY">DAY</option>
                                    <option value="NIGHT">NIGHT</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Status</label>
                                <select
                                    name="status"
                                    value={form.status || 'ACTIVE'}
                                    onChange={handleFormChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none"
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="RESIGNED">RESIGNED</option>
                                    <option value="TERMINATED">TERMINATED</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Employment Status</label>
                                <select
                                    name="employmentStatus"
                                    value={form.employmentStatus || 'PROBATIONARY'}
                                    onChange={handleFormChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none"
                                >
                                    <option value="REGULAR">REGULAR</option>
                                    <option value="PROBATIONARY">PROBATIONARY</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={form.remarks || ''}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-1.5 text-[9px] font-black uppercase tracking-wider text-text-secondary hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-lg text-primary-light text-[9px] font-black uppercase tracking-wider hover:bg-primary/30 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Masterlist;
