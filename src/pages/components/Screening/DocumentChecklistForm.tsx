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
      <div className="flex flex-col items-center gap-4 mt-8">
        <span className="text-lg font-semibold text-custom-teal">Form submitted!</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 col-span-full">
        <h3 className="text-lg font-semibold">Checklist Requirements</h3>
        <label className="flex flex-col gap-1 min-w-[200px]">
          <span>Status</span>
          <select
            name="screeningStatus"
            value={form.screeningStatus || "Pending"}
            onChange={handleChange}
            className="border rounded px-2 py-1"
          >
            <option value="Pending">Status</option>
            <option value="Passed">For Final Interview</option>
            <option value="Failed">For Screening</option>
          </select>
        </label>
      </div>
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="recentPicture" checked={form.recentPicture} onChange={handleChange} />
          Recent 2x2 picture
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="psaBirthCertificate" checked={form.psaBirthCertificate} onChange={handleChange} />
          PSA Birth Certificate
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="schoolCredentials" checked={form.schoolCredentials} onChange={handleChange} />
          School Credentials/Certificate
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="nbiClearance" checked={form.nbiClearance} onChange={handleChange} />
          NBI Clearance
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="policeClearance" checked={form.policeClearance} onChange={handleChange} />
          Police Clearance
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="barangayClearance" checked={form.barangayClearance} onChange={handleChange} />
          Barangay Clearance
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="sss" checked={form.sss} onChange={handleChange} />
          SSS 
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="pagibig" checked={form.pagibig} onChange={handleChange} />
          Pag-IBIG #
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="cedula" checked={form.cedula} onChange={handleChange} />
          Cedula
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="vaccinationStatus" checked={form.vaccinationStatus} onChange={handleChange} />
          Vaccination Status
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="resume" checked={form.resume} onChange={handleChange} />
          Resume
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="coe" checked={form.coe} onChange={handleChange} />
          Certificate of Employment (COE)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="philhealth" checked={form.philhealth} onChange={handleChange} />
          PhilHealth
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="tinNumber" checked={form.tinNumber} onChange={handleChange} />
          TIN Number
        </label>
        <div className="md:col-span-2 lg:col-span-3 flex justify-between mt-6">
          <button type="button" onClick={onBack} className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-custom-teal">Back</button>
          <button type="submit" className="px-8 py-2 bg-custom-teal hover:bg-teal-700 text-white rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-custom-teal">Submit</button>
        </div>
      </form>
    </>
  );
};

export default DocumentChecklistForm; 