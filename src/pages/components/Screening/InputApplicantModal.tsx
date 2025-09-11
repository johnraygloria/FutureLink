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
  no: '', referredBy: '', lastName: '', firstName: '', ext: '', middle: '', gender: '', size: '', dateOfBirth: '', dateApplied: '', name: '', facebook: '', age: '', location: '', contactNumber: '', positionApplied: '', experience: '',
  recentPicture: false, psaBirthCertificate: false, schoolCredentials: false, nbiClearance: false, policeClearance: false, barangayClearance: false, sss: false, pagibig: false, cedula: false, vaccinationStatus: false,
  resume: false, coe: false, philhealth: false, tinNumber: false,
  datian: '', hokei: '', pobc: '', jinboway: '', surprise: '', thaleste: '', aolly: '', enjoy: '', status: '', requirementsStatus: '', finalInterviewStatus: '', medicalStatus: '', statusRemarks: '', applicantRemarks: '',
};

const InputApplicantModal: React.FC<InputApplicantModalProps> = ({ isOpen, onClose, onSubmit, onUpdateStatus }) => {
  const [form, setForm] = useState(initialFormState);
  const [step, setStep] = useState(1);

  const reset = () => { setStep(1); setForm(initialFormState); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    let updatedForm = { ...form, [name]: type === 'checkbox' ? checked : value };
    if (name === 'dateOfBirth') {
      // Calculate age
      const today = new Date();
      const dob = new Date(value);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      updatedForm.age = isNaN(age) ? '' : age.toString();
    }
    setForm(updatedForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/60 backdrop-blur-sm transition-all duration-300" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-4xl relative animate-fade-in border border-gray-200">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 rounded-full p-2 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-custom-teal"
          onClick={() => { onClose(); reset(); }}
          aria-label="Close"
        >
          &times;
        </button>
        {step === 1 ? (
          <PersonalDetailsForm form={form} handleChange={handleChange} onNext={(e: React.FormEvent) => { e.preventDefault(); setStep(2); }} />
        ) : (
          <DocumentChecklistForm form={form} handleChange={handleChange} onBack={() => setStep(1)} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default InputApplicantModal; 