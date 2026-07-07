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
  no: '', referredBy: '', lastName: '', firstName: '', ext: '', middle: '', gender: '', size: '', dateOfBirth: '', dateApplied: '', name: '', facebook: '', age: '', location: '', contactNumber: '', email: '', positionApplied: '', experience: '',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-all duration-300 p-4" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="bg-[#0b1018]/98 backdrop-blur-xl rounded-2xl shadow-[-0_20px_60px_rgba(0,0,0,0.45)] w-full max-w-[820px] relative animate-fade-in border border-white/10 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="h-[3px] bg-gradient-to-r from-primary via-primary-light to-info/80 flex-shrink-0" />
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/[0.05] via-transparent to-transparent flex-shrink-0">
          <div>
            <h1 className="text-lg sm:text-xl text-white font-bold leading-tight tracking-tight">New Applicant</h1>
            <p className="text-sm text-primary-light/90 mt-1 font-semibold">Screening intake form</p>
          </div>
          <button
            className="flex items-center justify-center h-10 w-10 text-text-secondary hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={() => { onClose(); reset(); }}
            aria-label="Close"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {step === 1 ? (
            <PersonalDetailsForm form={form} handleChange={handleChange} onNext={(e: React.FormEvent) => { e.preventDefault(); setStep(2); }} />
          ) : (
            <DocumentChecklistForm form={form} handleChange={handleChange} onBack={() => setStep(1)} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InputApplicantModal; 
