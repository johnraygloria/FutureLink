import React, { useEffect, useState } from 'react';
import { useVirtualRows, spacerRowStyle } from '../../../components/Tables/useVirtualRows';
import * as XLSX from 'xlsx';
import {
    IconArrowLeft,
    IconSearch,
    IconDownload,
    IconFilter,
    IconPlus,
    IconDotsVertical,
    IconChevronRight,
    IconChevronLeft,
    IconX,
    IconPencil,
    IconTrash,
} from '@tabler/icons-react';
import {
    createMasterlistEmployee,
    deleteMasterlistEmployee,
    fetchMasterlistEmployees,
    fetchNextFliNumber,
    updateMasterlistEmployee,
    type CreateMasterlistEmployeeInput,
    type EmployeeStatus,
    type MasterlistEmployee,
} from '../../../api/masterlist';
import { fetchPrincipals, type Principal } from '../../../api/principal';

interface MasterlistProps {
    onBack: () => void;
}

const initialFormState: CreateMasterlistEmployeeInput = {
    lastName: '',
    firstName: '',
    extName: '',
    middleName: '',
    jbwJobNo: '',
    principal: '',
    mobileNumber: '',
    fbLink: '',
    sbmaIdValidity: '',
    emailAddress: '',
    gender: 'M',
    dateHired: '',
    status: 'ACTIVE',
    remarks: '',
    position: '',
    shirt: '',
    shoes: '',
    level: '',
    levelRemarks: '',
    recordDate: '',
    age: '',
    place: '',
    sss: '',
    pagibig: '',
    philhealth: '',
    tin: '',
    houseNo: '',
    street: '',
    barangay: '',
    municipality: '',
    province: '',
    zipCode: '',
    completePresent: '',
    houseNo2: '',
    street2: '',
    barangay2: '',
    municipality2: '',
    province2: '',
    zipCode2: '',
    mothersMaidenName: '',
    fathersName: '',
    civilStatus: '',
    spousesName: '',
    numChildren: '',
    childrenAges: '',
    religion: '',
    contactPerson: '',
    contactNumber: '',
    completeAddress: '',
    relation: '',
    lastDatePresent: '',
    otherRemarks: '',
    transferStatus: '',
};

type ColumnKey = keyof MasterlistEmployee | 'row_number';

const TABLE_COLUMNS: { key: ColumnKey; label: string }[] = [
    { key: 'row_number', label: '#' },
    { key: 'fli_number', label: 'FLI NUMBER' },
    { key: 'jbw_job_no', label: 'JBW JOB NO.' },
    { key: 'full_name', label: 'FULL NAME' },
    { key: 'ext_name', label: 'EXT NAME' },
    { key: 'middle_name', label: 'MIDDLE NAME' },
    { key: 'principal', label: 'PRINCIPAL' },
    { key: 'mobile_number', label: 'MOBILE NUMBER' },
    { key: 'fb_link', label: 'FB LINK' },
    { key: 'sbma_id_validity', label: 'SBMA ID VALIDITY' },
    { key: 'email_address', label: 'EMAIL ADDRESS' },
    { key: 'gender', label: 'GENDER' },
    { key: 'date_hired', label: 'DATE HIRED' },
    { key: 'status', label: 'STATUS' },
    { key: 'remarks', label: 'REMARKS' },
    { key: 'position', label: 'POSITION' },
    { key: 'shirt', label: 'SHIRT' },
    { key: 'shoes', label: 'SHOES' },
    { key: 'level', label: 'LEVEL' },
    { key: 'level_remarks', label: 'LEVEL REMARKS' },
    { key: 'record_date', label: 'DATE' },
    { key: 'age', label: 'AGE' },
    { key: 'place', label: 'PLACE' },
    { key: 'sss', label: 'SSS' },
    { key: 'pagibig', label: 'PAG-IBIG' },
    { key: 'philhealth', label: 'PHILHEALTH' },
    { key: 'tin', label: 'TIN' },
    { key: 'house_no', label: 'HOUSE #' },
    { key: 'street', label: 'STREET' },
    { key: 'barangay', label: 'BARANGAY' },
    { key: 'municipality', label: 'MUNICIPALITY' },
    { key: 'province', label: 'PROVINCE' },
    { key: 'zip_code', label: 'ZIP CODE' },
    { key: 'complete_present', label: 'COMPLETE PRESENT' },
    { key: 'house_no_2', label: 'HOUSE #2' },
    { key: 'street_2', label: 'STREET 2' },
    { key: 'barangay_2', label: 'BARANGAY 2' },
    { key: 'municipality_2', label: 'MUNICIPALITY 2' },
    { key: 'province_2', label: 'PROVINCE 2' },
    { key: 'zip_code_2', label: 'ZIP CODE 2' },
    { key: 'mothers_maiden_name', label: "MOTHER'S MAIDEN NAME" },
    { key: 'fathers_name', label: "FATHER'S NAME" },
    { key: 'civil_status', label: 'CIVIL STATUS' },
    { key: 'spouses_name', label: "SPOUSE'S NAME" },
    { key: 'num_children', label: '# OF CHILDREN' },
    { key: 'children_ages', label: 'AGES' },
    { key: 'religion', label: 'RELIGION' },
    { key: 'contact_person', label: 'CONTACT PERSON' },
    { key: 'contact_number', label: 'CONTACT NUMBER' },
    { key: 'complete_address', label: 'COMPLETE ADDRESS' },
    { key: 'relation', label: 'RELATION' },
    { key: 'last_date_present', label: 'LAST DATE PRESENT' },
    { key: 'other_remarks', label: 'OTHER REMARKS' },
    { key: 'transfer_status', label: 'TRANSFER STATUS' },
];

const ADD_FORM_FIELDS: { name: keyof CreateMasterlistEmployeeInput; label: string; required?: boolean; type?: string }[] = [
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'firstName', label: 'First Name', required: true },
    { name: 'extName', label: 'Ext Name' },
    { name: 'middleName', label: 'Middle Name' },
    { name: 'jbwJobNo', label: 'JBW Job No.' },
    { name: 'mobileNumber', label: 'Mobile Number' },
    { name: 'fbLink', label: 'FB Link' },
    { name: 'sbmaIdValidity', label: 'SBMA ID Validity' },
    { name: 'emailAddress', label: 'Email Address', type: 'email' },
    { name: 'dateHired', label: 'Date Hired', type: 'date' },
    { name: 'position', label: 'Position' },
    { name: 'shirt', label: 'Shirt' },
    { name: 'shoes', label: 'Shoes' },
    { name: 'level', label: 'Level' },
    { name: 'levelRemarks', label: 'Level Remarks' },
    { name: 'recordDate', label: 'Date', type: 'date' },
    { name: 'age', label: 'Age' },
    { name: 'place', label: 'Place' },
    { name: 'sss', label: 'SSS' },
    { name: 'pagibig', label: 'Pag-IBIG' },
    { name: 'philhealth', label: 'PhilHealth' },
    { name: 'tin', label: 'TIN' },
    { name: 'houseNo', label: 'House #' },
    { name: 'street', label: 'Street' },
    { name: 'barangay', label: 'Barangay' },
    { name: 'municipality', label: 'Municipality' },
    { name: 'province', label: 'Province' },
    { name: 'zipCode', label: 'Zip Code' },
    { name: 'houseNo2', label: 'House #2' },
    { name: 'street2', label: 'Street 2' },
    { name: 'barangay2', label: 'Barangay 2' },
    { name: 'municipality2', label: 'Municipality 2' },
    { name: 'province2', label: 'Province 2' },
    { name: 'zipCode2', label: 'Zip Code 2' },
    { name: 'mothersMaidenName', label: "Mother's Maiden Name" },
    { name: 'fathersName', label: "Father's Name" },
    { name: 'civilStatus', label: 'Civil Status' },
    { name: 'spousesName', label: "Spouse's Name" },
    { name: 'numChildren', label: '# of Children' },
    { name: 'childrenAges', label: 'Children Ages' },
    { name: 'religion', label: 'Religion' },
    { name: 'contactPerson', label: 'Contact Person' },
    { name: 'contactNumber', label: 'Contact Number' },
    { name: 'completeAddress', label: 'Complete Address' },
    { name: 'relation', label: 'Relation' },
    { name: 'lastDatePresent', label: 'Last Date Present', type: 'date' },
    { name: 'transferStatus', label: 'Transfer Status' },
];

const isTurnover = (status: string) => status === 'RESIGNED' || status === 'TERMINATED';

const statusSelectClass = (status: string) => {
    if (status === 'ACTIVE') return 'bg-success/10 text-success border-success/20';
    if (status === 'RESIGNED') return 'bg-danger/10 text-danger-light border-danger/30';
    return 'bg-danger text-white border-danger/50';
};

const cellClass = (inactive: boolean, emphasis = false) => {
    if (inactive) return emphasis ? 'text-danger-light' : 'text-danger/70';
    return emphasis ? 'text-white font-bold' : 'text-white/80';
};

const employeeToForm = (employee: MasterlistEmployee): CreateMasterlistEmployeeInput => ({
    lastName: employee.last_name || '',
    firstName: employee.first_name || '',
    extName: employee.ext_name || '',
    middleName: employee.middle_name || '',
    jbwJobNo: employee.jbw_job_no || '',
    principal: employee.principal || '',
    mobileNumber: employee.mobile_number || '',
    fbLink: employee.fb_link || '',
    sbmaIdValidity: employee.sbma_id_validity || '',
    emailAddress: employee.email_address || '',
    gender: employee.gender || 'M',
    dateHired: employee.date_hired || '',
    status: employee.status,
    remarks: employee.remarks || '',
    position: employee.position || '',
    shirt: employee.shirt || '',
    shoes: employee.shoes || '',
    level: employee.level || '',
    levelRemarks: employee.level_remarks || '',
    recordDate: employee.record_date || '',
    age: employee.age || '',
    place: employee.place || '',
    sss: employee.sss || '',
    pagibig: employee.pagibig || '',
    philhealth: employee.philhealth || '',
    tin: employee.tin || '',
    houseNo: employee.house_no || '',
    street: employee.street || '',
    barangay: employee.barangay || '',
    municipality: employee.municipality || '',
    province: employee.province || '',
    zipCode: employee.zip_code || '',
    completePresent: employee.complete_present || '',
    houseNo2: employee.house_no_2 || '',
    street2: employee.street_2 || '',
    barangay2: employee.barangay_2 || '',
    municipality2: employee.municipality_2 || '',
    province2: employee.province_2 || '',
    zipCode2: employee.zip_code_2 || '',
    mothersMaidenName: employee.mothers_maiden_name || '',
    fathersName: employee.fathers_name || '',
    civilStatus: employee.civil_status || '',
    spousesName: employee.spouses_name || '',
    numChildren: employee.num_children || '',
    childrenAges: employee.children_ages || '',
    religion: employee.religion || '',
    contactPerson: employee.contact_person || '',
    contactNumber: employee.contact_number || '',
    completeAddress: employee.complete_address || '',
    relation: employee.relation || '',
    lastDatePresent: employee.last_date_present || '',
    otherRemarks: employee.other_remarks || '',
    transferStatus: employee.transfer_status || '',
});

const Masterlist: React.FC<MasterlistProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'OVERALL' | 'ACTIVE' | 'TURNOVER'>('OVERALL');
    const [data, setData] = useState<MasterlistEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<MasterlistEmployee | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [form, setForm] = useState(initialFormState);
    const [nextFliNumber, setNextFliNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [principals, setPrincipals] = useState<Principal[]>([]);

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

    const loadNextFli = async () => {
        try {
            const fliNumber = await fetchNextFliNumber();
            setNextFliNumber(fliNumber);
        } catch {
            setNextFliNumber('');
        }
    };

    useEffect(() => {
        loadEmployees();
        fetchPrincipals()
            .then(setPrincipals)
            .catch(() => setPrincipals([]));
    }, []);

    useEffect(() => {
        if (modalMode === 'add') {
            loadNextFli();
        }
    }, [modalMode]);

    useEffect(() => {
        const closeMenu = () => setOpenMenuId(null);
        if (openMenuId !== null) {
            document.addEventListener('click', closeMenu);
            return () => document.removeEventListener('click', closeMenu);
        }
    }, [openMenuId]);

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

    const searchableValues = (item: MasterlistEmployee) =>
        TABLE_COLUMNS
            .filter(col => col.key !== 'row_number')
            .map(col => item[col.key as keyof MasterlistEmployee]);

    const filteredData = data.filter(item => {
        const matchesSearch = searchableValues(item).some(val =>
            (val ?? '').toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!matchesSearch) return false;
        if (activeTab === 'ACTIVE') return item.status === 'ACTIVE';
        if (activeTab === 'TURNOVER') return isTurnover(item.status);
        return true;
    });

    // Windowed rendering — the masterlist row is very short, so a small estimate.
    const {
        containerRef: masterlistScrollRef,
        items: virtualRows,
        topSpacer: masterlistTopSpacer,
        bottomSpacer: masterlistBottomSpacer,
        measureRow: measureMasterlistRow,
    } = useVirtualRows(filteredData, 24);
    const masterlistColCount = TABLE_COLUMNS.length + 1;

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const closeModal = () => {
        setModalMode(null);
        setEditingEmployee(null);
        setForm(initialFormState);
    };

    const openAddModal = () => {
        setForm(initialFormState);
        setEditingEmployee(null);
        setModalMode('add');
    };

    const openEditModal = (employee: MasterlistEmployee) => {
        setEditingEmployee(employee);
        setForm(employeeToForm(employee));
        setOpenMenuId(null);
        setModalMode('edit');
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.lastName.trim() || !form.firstName.trim()) return;

        try {
            setSubmitting(true);
            const employee = await createMasterlistEmployee(form);
            setData(prev => [...prev, employee]);
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add employee');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee || !form.lastName.trim() || !form.firstName.trim()) return;

        try {
            setSubmitting(true);
            setError(null);
            const updated = await updateMasterlistEmployee(editingEmployee.id, form);
            setData(prev => prev.map(item => item.id === editingEmployee.id ? updated : item));
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update employee');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveEmployee = async (employee: MasterlistEmployee) => {
        const name = employee.full_name || `${employee.first_name} ${employee.last_name}`.trim();
        if (!confirm(`Remove ${name || 'this employee'} from the masterlist?`)) return;

        try {
            setRemovingId(employee.id);
            setOpenMenuId(null);
            setError(null);
            await deleteMasterlistEmployee(employee.id);
            setData(prev => prev.filter(item => item.id !== employee.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove employee');
        } finally {
            setRemovingId(null);
        }
    };

    const exportToExcel = () => {
        const exportData = filteredData.map((row, index) => {
            const record: Record<string, string> = {};
            TABLE_COLUMNS.forEach((col) => {
                if (col.key === 'row_number') {
                    record[col.label] = String(index + 1);
                    return;
                }
                const value = row[col.key as keyof MasterlistEmployee];
                record[col.label] = value == null || value === '' ? '' : String(value);
            });
            return record;
        });

        const headers = TABLE_COLUMNS.map(col => col.label);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData, { header: headers });
        ws['!cols'] = headers.map(label => ({ wch: Math.max(label.length, 14) }));
        XLSX.utils.book_append_sheet(wb, ws, 'Masterlist');

        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `MASTERLIST_${date}.xlsx`);
    };

    const renderCell = (row: MasterlistEmployee, key: ColumnKey, index: number) => {
        const inactive = isInactive(row);

        if (key === 'row_number') {
            return <span className={cellClass(inactive)}>{index + 1}</span>;
        }

        if (key === 'fli_number') {
            return <span className="text-primary-light font-bold">{row.fli_number}</span>;
        }

        if (key === 'status') {
            return (
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
            );
        }

        const value = row[key as keyof MasterlistEmployee];
        const display = value == null || value === '' ? '-' : String(value);

        if (key === 'full_name' || key === 'position') {
            return <span className={cellClass(inactive, true)}>{display}</span>;
        }

        if (key === 'mobile_number' || key === 'contact_number') {
            return <span className={`font-mono ${cellClass(inactive)}`}>{display}</span>;
        }

        if (key === 'complete_present' || key === 'complete_address' || key === 'remarks' || key === 'other_remarks') {
            return <span className={`max-w-[180px] truncate block ${cellClass(inactive)}`}>{display}</span>;
        }

        return <span className={cellClass(inactive)}>{display}</span>;
    };

    return (
        <div className="flex flex-col h-full animate-fadeIn">
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
                    <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/5 mr-2">
                        {(['OVERALL', 'ACTIVE', 'TURNOVER'] as const).map((tab) => (
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
                        onClick={openAddModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-xl text-primary-light text-[9px] font-black uppercase tracking-wider hover:bg-primary/30 shadow-lg shadow-primary/10 transition-all active:scale-95"
                    >
                        <IconPlus className="w-3.5 h-3.5" />
                        Add Employee
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-[9px] font-bold uppercase tracking-wider hover:bg-white/10">
                        <IconFilter className="w-3 h-3" />
                        Refine
                    </button>
                    <button
                        onClick={exportToExcel}
                        disabled={filteredData.length === 0}
                        className="flex items-center gap-1 px-2 py-1 bg-primary/20 border border-primary/30 rounded-lg text-primary-light text-[9px] font-bold uppercase tracking-wider hover:bg-primary/30 disabled:opacity-40"
                    >
                        <IconDownload className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>

            {error && (
                <div className="px-3 py-1.5 bg-danger/10 border-b border-danger/20 text-danger-light text-[9px] font-bold uppercase tracking-wider">
                    {error}
                </div>
            )}

            <div ref={masterlistScrollRef} className="flex-1 overflow-auto custom-scrollbar relative">
                {loading ? (
                    <div className="flex items-center justify-center h-32 text-[10px] text-text-secondary uppercase tracking-widest font-black">
                        Loading employees...
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[7200px]">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-[#1a1c1e] border-b border-white/10">
                                {TABLE_COLUMNS.map((col) => (
                                    <th key={col.key} className="px-2 py-1 text-[8px] font-black text-text-secondary uppercase tracking-tight border-r border-white/5 last:border-0 text-center whitespace-nowrap">
                                        {col.label}
                                    </th>
                                ))}
                                <th className="px-2 py-1 text-[8px] font-black text-text-secondary uppercase tracking-tighter text-center sticky right-0 bg-[#1a1c1e] border-l border-white/10 z-30">OPS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {masterlistTopSpacer > 0 && (
                                <tr aria-hidden><td colSpan={masterlistColCount} style={spacerRowStyle(masterlistTopSpacer)} /></tr>
                            )}
                            {virtualRows.map((virtualItem) => {
                                const row = filteredData[virtualItem.index];
                                const index = virtualItem.index;
                                return (
                                <tr
                                    key={row.id}
                                    ref={measureMasterlistRow}
                                    data-index={virtualItem.index}
                                    className={`transition-all duration-200 group ${isInactive(row)
                                        ? 'bg-danger/10 hover:bg-danger/20'
                                        : 'hover:bg-primary/5'
                                        }`}
                                >
                                    {TABLE_COLUMNS.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-2 py-0.5 text-[8.5px] border-r border-white/5 text-center"
                                        >
                                            {renderCell(row, col.key, index)}
                                        </td>
                                    ))}
                                    <td className="px-2 py-0.5 text-center sticky right-0 bg-[#0f1112] z-30 border-l border-white/10 group-hover:bg-[#1a1c1e] transition-colors">
                                        <div className="relative inline-block">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                }}
                                                className="p-0.5 rounded hover:bg-white/10 text-text-secondary hover:text-white transition-all"
                                            >
                                                <IconDotsVertical className="w-3.5 h-3.5" />
                                            </button>
                                            {openMenuId === row.id && (
                                                <div
                                                    className="absolute right-0 top-full mt-1 min-w-[110px] rounded-lg border border-white/10 bg-[#1a1c1e] shadow-xl z-40 overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(row)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-primary/20 transition-colors"
                                                    >
                                                        <IconPencil className="w-3 h-3 text-primary-light" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveEmployee(row)}
                                                        disabled={removingId === row.id}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-danger-light hover:bg-danger/20 transition-colors disabled:opacity-50 border-t border-white/10"
                                                    >
                                                        <IconTrash className="w-3 h-3" />
                                                        {removingId === row.id ? 'Removing...' : 'Remove'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                            {masterlistBottomSpacer > 0 && (
                                <tr aria-hidden><td colSpan={masterlistColCount} style={spacerRowStyle(masterlistBottomSpacer)} /></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

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

            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-4xl bg-[#1a1c1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-xs font-black text-white uppercase tracking-widest">
                                    {modalMode === 'add' ? 'Add Employee' : 'Edit Employee'}
                                </h2>
                                <p className="text-[9px] text-primary-light mt-1 font-bold uppercase tracking-wider">
                                    {modalMode === 'add'
                                        ? `FLI Number (auto): ${nextFliNumber || 'Generating...'}`
                                        : `FLI Number: ${editingEmployee?.fli_number || '-'}`}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded hover:bg-white/10 text-text-secondary hover:text-white"
                            >
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>
                        <form
                            onSubmit={modalMode === 'add' ? handleAddEmployee : handleEditEmployee}
                            className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar"
                        >
                            {ADD_FORM_FIELDS.map(field => (
                                <div key={field.name}>
                                    <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        name={field.name}
                                        type={field.type || 'text'}
                                        value={(form[field.name] as string) || ''}
                                        onChange={handleFormChange}
                                        required={field.required}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Principal</label>
                                <select
                                    name="principal"
                                    value={form.principal || ''}
                                    onChange={handleFormChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none"
                                >
                                    <option value="">Select principal</option>
                                    {form.principal && !principals.some((p) => p.name === form.principal) && (
                                        <option value={form.principal}>{form.principal}</option>
                                    )}
                                    {principals.map((principal) => (
                                        <option key={principal.id} value={principal.name}>
                                            {principal.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                            <div className="col-span-2 md:col-span-3">
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={form.remarks || ''}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-3">
                                <label className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1">Other Remarks</label>
                                <textarea
                                    name="otherRemarks"
                                    value={form.otherRemarks || ''}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-3 flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-1.5 text-[9px] font-black uppercase tracking-wider text-text-secondary hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-lg text-primary-light text-[9px] font-black uppercase tracking-wider hover:bg-primary/30 disabled:opacity-50"
                                >
                                    {submitting
                                        ? 'Saving...'
                                        : modalMode === 'add'
                                            ? 'Save Employee'
                                            : 'Update Employee'}
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
