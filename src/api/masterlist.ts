export type EmployeeStatus = 'ACTIVE' | 'RESIGNED' | 'TERMINATED';

export interface MasterlistEmployee {
  id: number;
  fli_number: string;
  jbw_job_no: string | null;
  last_name: string;
  first_name: string;
  ext_name: string | null;
  middle_name: string | null;
  full_name: string | null;
  principal: string | null;
  mobile_number: string | null;
  fb_link: string | null;
  sbma_id_validity: string | null;
  email_address: string | null;
  gender: string | null;
  date_hired: string | null;
  status: EmployeeStatus;
  remarks: string | null;
  position: string | null;
  shirt: string | null;
  shoes: string | null;
  level: string | null;
  level_remarks: string | null;
  record_date: string | null;
  age: string | null;
  place: string | null;
  sss: string | null;
  pagibig: string | null;
  philhealth: string | null;
  tin: string | null;
  house_no: string | null;
  street: string | null;
  barangay: string | null;
  municipality: string | null;
  province: string | null;
  zip_code: string | null;
  complete_present: string | null;
  house_no_2: string | null;
  street_2: string | null;
  barangay_2: string | null;
  municipality_2: string | null;
  province_2: string | null;
  zip_code_2: string | null;
  mothers_maiden_name: string | null;
  fathers_name: string | null;
  civil_status: string | null;
  spouses_name: string | null;
  num_children: string | null;
  children_ages: string | null;
  religion: string | null;
  contact_person: string | null;
  contact_number: string | null;
  complete_address: string | null;
  relation: string | null;
  last_date_present: string | null;
  other_remarks: string | null;
  transfer_status: string | null;
  applicant_no?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMasterlistEmployeeInput {
  lastName: string;
  firstName: string;
  extName?: string;
  middleName?: string;
  jbwJobNo?: string;
  principal?: string;
  mobileNumber?: string;
  fbLink?: string;
  sbmaIdValidity?: string;
  emailAddress?: string;
  gender?: string;
  dateHired?: string;
  status?: EmployeeStatus;
  remarks?: string;
  position?: string;
  shirt?: string;
  shoes?: string;
  level?: string;
  levelRemarks?: string;
  recordDate?: string;
  age?: string;
  place?: string;
  sss?: string;
  pagibig?: string;
  philhealth?: string;
  tin?: string;
  houseNo?: string;
  street?: string;
  barangay?: string;
  municipality?: string;
  province?: string;
  zipCode?: string;
  completePresent?: string;
  houseNo2?: string;
  street2?: string;
  barangay2?: string;
  municipality2?: string;
  province2?: string;
  zipCode2?: string;
  mothersMaidenName?: string;
  fathersName?: string;
  civilStatus?: string;
  spousesName?: string;
  numChildren?: string;
  childrenAges?: string;
  religion?: string;
  contactPerson?: string;
  contactNumber?: string;
  completeAddress?: string;
  relation?: string;
  lastDatePresent?: string;
  otherRemarks?: string;
  transferStatus?: string;
}

export async function fetchMasterlistEmployees(): Promise<MasterlistEmployee[]> {
  const response = await fetch('/api/masterlist');
  if (!response.ok) {
    throw new Error('Failed to fetch masterlist employees');
  }
  return response.json();
}

export async function fetchNextFliNumber(): Promise<string> {
  const response = await fetch('/api/masterlist/next-fli');
  if (!response.ok) {
    throw new Error('Failed to fetch next FLI number');
  }
  const data = await response.json();
  return data.fliNumber;
}

export async function createMasterlistEmployee(
  input: CreateMasterlistEmployeeInput
): Promise<MasterlistEmployee> {
  const response = await fetch('/api/masterlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lastName: input.lastName,
      firstName: input.firstName,
      extName: input.extName,
      middleName: input.middleName,
      jbwJobNo: input.jbwJobNo,
      principal: input.principal,
      mobileNumber: input.mobileNumber,
      fbLink: input.fbLink,
      sbmaIdValidity: input.sbmaIdValidity,
      emailAddress: input.emailAddress,
      gender: input.gender,
      dateHired: input.dateHired,
      status: input.status || 'ACTIVE',
      remarks: input.remarks,
      position: input.position,
      shirt: input.shirt,
      shoes: input.shoes,
      level: input.level,
      levelRemarks: input.levelRemarks,
      recordDate: input.recordDate,
      age: input.age,
      place: input.place,
      sss: input.sss,
      pagibig: input.pagibig,
      philhealth: input.philhealth,
      tin: input.tin,
      houseNo: input.houseNo,
      street: input.street,
      barangay: input.barangay,
      municipality: input.municipality,
      province: input.province,
      zipCode: input.zipCode,
      completePresent: input.completePresent,
      houseNo2: input.houseNo2,
      street2: input.street2,
      barangay2: input.barangay2,
      municipality2: input.municipality2,
      province2: input.province2,
      zipCode2: input.zipCode2,
      mothersMaidenName: input.mothersMaidenName,
      fathersName: input.fathersName,
      civilStatus: input.civilStatus,
      spousesName: input.spousesName,
      numChildren: input.numChildren,
      childrenAges: input.childrenAges,
      religion: input.religion,
      contactPerson: input.contactPerson,
      contactNumber: input.contactNumber,
      completeAddress: input.completeAddress,
      relation: input.relation,
      lastDatePresent: input.lastDatePresent,
      otherRemarks: input.otherRemarks,
      transferStatus: input.transferStatus,
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
  input: Partial<CreateMasterlistEmployeeInput> & Partial<Pick<MasterlistEmployee, 'status' | 'remarks' | 'other_remarks' | 'transfer_status'>>
): Promise<MasterlistEmployee> {
  const response = await fetch(`/api/masterlist/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update employee');
  }

  return response.json();
}

export async function deleteMasterlistEmployee(id: number): Promise<void> {
  const response = await fetch(`/api/masterlist/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete employee');
  }
}
