import React, { useState } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import DocumentChecklistForm from './DocumentChecklistForm';

interface InputApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: typeof initialFormState) => void;
  onUpdateStatus: (form: typeof initialFormState, newStatus: string) => void;
}

export const initialFormState = {
  no: '',
  referredBy: '',
  lastName: '',
  firstName: '',
  ext: '',
  middle: '',
  gender: '',
  size: '',
  dateOfBirth: '',
  dateApplied: '',
  name: '',
  age: '',
  location: '',
  contactNumber: '',
  positionApplied: '',
  experience: '',
  recentPicture: false,
  psaBirthCertificate: false,
  schoolCredentials: false,
  nbiClearance: false,
  policeClearance: false,
  barangayClearance: false,
  sss: false,
  pagibig: false,
  cedula: false,
  vaccinationStatus: false,
  datian: '',
  hokei: '',
  pobc: '',
  jinboway: '',
  surprise: '',
  thaleste: '',
  aolly: '',
  enjoy: '',
  status: '',
  requirementsStatus: '',
  finalInterviewStatus: '',
  medicalStatus: '',
  statusRemarks: '',
  applicantRemarks: '',
};

const InputApplicantModal: React.FC<InputApplicantModalProps> = ({ isOpen, onClose, onSubmit, onUpdateStatus }) => {
  const [form, setForm] = useState(initialFormState);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/60 backdrop-blur-sm transition-all duration-300" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-4xl relative animate-fade-in border border-gray-200">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 rounded-full p-2 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-custom-teal"
          onClick={() => { onClose(); setStep(1); setForm(initialFormState); }}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-custom-teal text-center">Input Applicant Personal Details</h2>

        {step === 1 && (
          <PersonalDetailsForm form={form} handleChange={handleChange} onNext={handleNext} />
        )}
        {step === 2 && (
          <DocumentChecklistForm 
            form={form} 
            handleChange={handleChange} 
            onBack={() => setStep(1)} 
            onSubmit={handleSubmit} 
          />
        )}
      </div>
    </div>
  );
};

export default InputApplicantModal; 