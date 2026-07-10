import React, { useState } from 'react';
import DocumentChecklistFields from '../../../components/DocumentChecklist/DocumentChecklistFields';
import { DOCUMENT_NUMBER_FIELDS } from '../../../constants/documentChecklist';

interface DocumentChecklistFormProps {
  form: any;
  onFieldChange: (name: string, value: boolean | string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DocumentChecklistForm: React.FC<DocumentChecklistFormProps> = ({ form, onFieldChange, onBack, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleCheckboxChange = (key: string, checked: boolean) => {
    onFieldChange(key, checked);
    if (!checked) {
      const numberConfig = DOCUMENT_NUMBER_FIELDS[key];
      if (numberConfig) onFieldChange(numberConfig.numberKey, '');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    onSubmit(e);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-custom-teal/20 rounded-full flex items-center justify-center mb-4 text-custom-teal">
          <i className="fas fa-check text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Form Submitted Successfully!</h3>
        <p className="text-text-secondary">The applicant data has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-clipboard-check text-custom-teal"></i>
          Checklist Requirements
        </h3>

        <div className="flex flex-col gap-1.5 min-w-[240px] w-full sm:w-auto">
          <span className="text-xs font-semibold text-text-secondary uppercase">Status</span>
          <div className="relative">
            <select
              name="screeningStatus"
              value={form.screeningStatus || "Pending"}
              onChange={(e) => onFieldChange('screeningStatus', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-custom-teal/50 appearance-none"
            >
              <option value="Pending" className="bg-slate-900">Status</option>
              <option value="Passed" className="bg-slate-900">For Final Interview</option>
              <option value="Failed" className="bg-slate-900">For Screening</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-3.5 text-text-secondary/50 text-xs pointer-events-none"></i>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <DocumentChecklistFields
            variant="form"
            values={form}
            onCheckboxChange={handleCheckboxChange}
            onNumberChange={(numberKey, value) => onFieldChange(numberKey, value)}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-medium transition-all text-sm flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>

          <button
            type="submit"
            className="btn-premium flex items-center gap-2"
          >
            <span>Submit Application</span>
            <i className="fas fa-check"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentChecklistForm;
