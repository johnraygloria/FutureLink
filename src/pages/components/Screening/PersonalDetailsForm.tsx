import React from 'react';

interface FormFields {
  no: string;
  referredBy?: string;
  lastName: string;
  firstName: string;
  ext?: string;
  middle?: string;
  gender: string;
  size?: string;
  dateOfBirth: string;
  dateApplied: string;
  facebook?: string;
  age?: string;
  location?: string;
  contactNumber?: string;
  positionApplied?: string;
  experience?: string;
}

interface PersonalDetailsFormProps {
  form: FormFields;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: (e: React.FormEvent) => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ form, handleChange, onNext }) => (
  <>
    <h3 className="text-lg font-semibold mb-4 col-span-full">Personal Details</h3>
    <form onSubmit={onNext} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="no" className="text-sm font-medium text-gray-700">No *</label>
        <input id="no" name="no" value={form.no} onChange={handleChange} className="input" required aria-required="true" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="referredBy" className="text-sm font-medium text-gray-700">Referred By</label>
        <input id="referredBy" name="referredBy" value={form.referredBy} onChange={handleChange} className="input" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</label>
        <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} className="input" required />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</label>
        <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} className="input" required />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="ext" className="text-sm font-medium text-gray-700">Extension</label>
        <input id="ext" name="ext" value={form.ext} onChange={handleChange} className="input" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="middle" className="text-sm font-medium text-gray-700">Middle Name</label>
        <input id="middle" name="middle" value={form.middle} onChange={handleChange} className="input" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</label>
        <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="input" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="size" className="text-sm font-medium text-gray-700">Size</label>
        <input id="size" name="size" value={form.size} onChange={handleChange} className="input" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth *</label>
        <input id="dateOfBirth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" className="input" required />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="dateApplied" className="text-sm font-medium text-gray-700">Date Applied *</label>
        <input id="dateApplied" name="dateApplied" value={form.dateApplied} onChange={handleChange} type="date" className="input" required />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="facebook" className="text-sm font-medium text-gray-700">Facebook Name</label>
        <input id="facebook" name="facebook" value={form.facebook} onChange={handleChange} className="input" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="age" className="text-sm font-medium text-gray-700">Age</label>
        <input id="age" name="age" value={form.age} onChange={handleChange} className={`input${form.age && Number(form.age) > 50 ? ' text-red-600' : ''}`} readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
        <input id="location" name="location" value={form.location} onChange={handleChange} className="input" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">Contact Number</label>
        <input id="contactNumber" name="contactNumber" value={form.contactNumber} onChange={handleChange} className="input" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="positionApplied" className="text-sm font-medium text-gray-700">Position Applied For</label>
        <input id="positionApplied" name="positionApplied" value={form.positionApplied} onChange={handleChange} className="input" />
      </div>
      <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-6">
        <button type="submit" className="px-8 py-2 bg-custom-teal hover:bg-teal-700 text-white rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-custom-teal">Next</button>
      </div>
    </form>
  </>
);

export default PersonalDetailsForm;