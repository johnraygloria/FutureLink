export type EmployeeStatus = 'ACTIVE' | 'RESIGNED' | 'TERMINATED';
export type EmploymentStatus = 'REGULAR' | 'PROBATIONARY';

export interface MasterlistEmployee {
  id: number;
  emp_id: string;
  last_name: string;
  first_name: string;
  ext_name: string | null;
  middle_name: string | null;
  mobile_number: string | null;
  address: string | null;
  gender: string | null;
  date_hired: string | null;
  status: EmployeeStatus;
  employment_status: EmploymentStatus;
  remarks: string | null;
  position: string | null;
  dept_line: string | null;
  section: string | null;
  building: string | null;
  shift: 'DAY' | 'NIGHT' | string | null;
  applicant_no?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMasterlistEmployeeInput {
  empId: string;
  lastName: string;
  firstName: string;
  extName?: string;
  middleName?: string;
  mobileNumber?: string;
  address?: string;
  gender?: string;
  dateHired?: string;
  status?: EmployeeStatus;
  employmentStatus?: EmploymentStatus;
  remarks?: string;
  position?: string;
  deptLine?: string;
  section?: string;
  building?: string;
  shift?: 'DAY' | 'NIGHT';
}

export async function fetchMasterlistEmployees(): Promise<MasterlistEmployee[]> {
  const response = await fetch('/api/masterlist');
  if (!response.ok) {
    throw new Error('Failed to fetch masterlist employees');
  }
  return response.json();
}

export async function createMasterlistEmployee(
  input: CreateMasterlistEmployeeInput
): Promise<MasterlistEmployee> {
  const response = await fetch('/api/masterlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: input.empId,
      lastName: input.lastName,
      firstName: input.firstName,
      extName: input.extName,
      middleName: input.middleName,
      mobileNumber: input.mobileNumber,
      address: input.address,
      gender: input.gender,
      dateHired: input.dateHired,
      status: input.status || 'ACTIVE',
      employmentStatus: input.employmentStatus || 'PROBATIONARY',
      remarks: input.remarks,
      position: input.position,
      deptLine: input.deptLine,
      section: input.section,
      building: input.building,
      shift: input.shift || 'DAY',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create employee');
  }

  return response.json();
}

export async function updateMasterlistEmployee(
  id: number,
  fields: Partial<Pick<MasterlistEmployee, 'status' | 'employment_status' | 'remarks'>>
): Promise<MasterlistEmployee> {
  const response = await fetch(`/api/masterlist/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update employee');
  }

  return response.json();
}
