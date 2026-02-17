import React, { useState } from 'react';

interface DocumentChecklistFormProps {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DocumentChecklistForm: React.FC<DocumentChecklistFormProps> = ({ form, handleChange, onBack, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

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
              onChange={handleChange}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="recentPicture"
                checked={form.recentPicture}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Recent 2x2 picture</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="psaBirthCertificate"
                checked={form.psaBirthCertificate}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">PSA Birth Certificate</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="schoolCredentials"
                checked={form.schoolCredentials}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">School Credentials/Certificate</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="nbiClearance"
                checked={form.nbiClearance}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">NBI Clearance</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="policeClearance"
                checked={form.policeClearance}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Police Clearance</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="barangayClearance"
                checked={form.barangayClearance}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Barangay Clearance</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="sss"
                checked={form.sss}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">SSS</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="pagibig"
                checked={form.pagibig}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Pag-IBIG #</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="cedula"
                checked={form.cedula}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Cedula</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="vaccinationStatus"
                checked={form.vaccinationStatus}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Vaccination Status</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="resume"
                checked={form.resume}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Resume</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="coe"
                checked={form.coe}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">Certificate of Employment (COE)</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="philhealth"
                checked={form.philhealth}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">PhilHealth</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                name="tinNumber"
                checked={form.tinNumber}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-white/80 group-hover:text-white transition-colors text-sm">TIN Number</span>
            </label>
          </div>
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