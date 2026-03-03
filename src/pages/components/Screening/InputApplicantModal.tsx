import React, { useState, useEffect } from 'react';
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

const InputApplicantModal: React.FC<InputApplicantModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialFormState);
  const [step, setStep] = useState(1);
  // Removed unused isLoadingNumber state

  const reset = () => { setStep(1); setForm(initialFormState); };

  // Auto-generate applicant number when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('/api/applicants/next-number')
        .then(res => res.json())
        .then(data => {
          if (data.applicant_no) {
            setForm(prev => ({ ...prev, no: data.applicant_no }));
          }
        })
        .catch(error => {
          console.error('Failed to fetch next applicant number:', error);
        });
    } else {
      // Reset form when modal closes
      reset();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Check if property 'checked' exists (it's on HTMLInputElement)
    const checked = (type === 'checkbox' && 'checked' in e.target) ? (e.target as HTMLInputElement).checked : undefined;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-4" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-3xl relative animate-fade-in border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          className="absolute top-3 right-3 text-text-secondary hover:text-white hover:bg-white/10 rounded-full p-1.5 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-custom-teal transition-all z-10"
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