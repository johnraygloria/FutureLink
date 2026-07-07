import React from 'react';
import {
  panelClass,
  panelTitleClass,
  fieldLabelClass,
  inputClass,
  selectClass,
  readOnlyInputClass,
} from '../../../constants/applicantFormStyles';

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
  email?: string;
  positionApplied?: string;
  experience?: string;
}

interface PersonalDetailsFormProps {
  form: FormFields;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: (e: React.FormEvent) => void;
}

const SelectChevron = () => (
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </svg>
  </div>
);

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ form, handleChange, onNext }) => (
  <form onSubmit={onNext} className="space-y-5">
    <div className={`${panelClass} p-5 sm:p-6`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className={panelTitleClass}>Personal Details</h2>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-light bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Step 1 of 2
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5 text-sm">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="no" className={fieldLabelClass}>Applicant No.</label>
          <input
            id="no"
            name="no"
            value={form.no}
            onChange={handleChange}
            className={`${readOnlyInputClass} font-bold text-primary-light`}
            required
            readOnly
            title="Auto-generated"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="referredBy" className={fieldLabelClass}>Referred By</label>
          <input
            id="referredBy"
            name="referredBy"
            value={form.referredBy ?? ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="Name of referrer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className={fieldLabelClass}>Last Name *</label>
          <input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={`${inputClass} font-semibold`}
            required
            placeholder="e.g. Dela Cruz"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className={fieldLabelClass}>First Name *</label>
          <input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={`${inputClass} font-semibold`}
            required
            placeholder="e.g. Juan"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="ext" className={fieldLabelClass}>Extension</label>
          <input
            id="ext"
            name="ext"
            value={form.ext ?? ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Jr., III"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="middle" className={fieldLabelClass}>Middle Name</label>
          <input
            id="middle"
            name="middle"
            value={form.middle ?? ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Santos"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="gender" className={fieldLabelClass}>Gender *</label>
          <div className="relative">
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={selectClass}
              required
            >
              <option value="" className="bg-gray-900">Select Gender</option>
              <option value="Male" className="bg-gray-900">Male</option>
              <option value="Female" className="bg-gray-900">Female</option>
              <option value="Other" className="bg-gray-900">Other</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="size" className={fieldLabelClass}>Size</label>
          <input
            id="size"
            name="size"
            value={form.size ?? ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. M / 5'7"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="dateOfBirth" className={fieldLabelClass}>Date of Birth *</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            type="date"
            className={`${inputClass} [color-scheme:dark]`}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="dateApplied" className={fieldLabelClass}>Date Applied *</label>
          <input
            id="dateApplied"
            name="dateApplied"
            value={form.dateApplied}
            onChange={handleChange}
            type="date"
            className={`${inputClass} [color-scheme:dark]`}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="facebook" className={fieldLabelClass}>Facebook Name</label>
          <input
            id="facebook"
            name="facebook"
            value={form.facebook ?? ''}
            onChange={handleChange}
            className={`${inputClass} text-primary-light`}
            placeholder="Facebook profile name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="age" className={fieldLabelClass}>Age</label>
          <input
            id="age"
            name="age"
            value={form.age ?? ''}
            onChange={handleChange}
            className={`${readOnlyInputClass} ${form.age && Number(form.age) > 50 ? 'text-danger border-danger/30' : ''}`}
            readOnly
            placeholder="Auto-calculated"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className={fieldLabelClass}>Location</label>
          <input
            id="location"
            name="location"
            value={form.location ?? ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="City, Province"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contactNumber" className={fieldLabelClass}>Contact Number</label>
          <input
            id="contactNumber"
            name="contactNumber"
            value={form.contactNumber ?? ''}
            onChange={handleChange}
            className={`${inputClass} font-mono`}
            placeholder="0912 345 6789"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={fieldLabelClass}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email ?? ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="applicant@email.com"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
          <label htmlFor="positionApplied" className={fieldLabelClass}>Position Applied For</label>
          <input
            id="positionApplied"
            name="positionApplied"
            value={form.positionApplied ?? ''}
            onChange={handleChange}
            className={`${inputClass} text-primary-light font-semibold`}
            placeholder="e.g. Production Operator"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
          <label htmlFor="experience" className={fieldLabelClass}>Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={form.experience ?? ''}
            onChange={handleChange}
            className={`${inputClass} min-h-[90px] resize-y`}
            rows={3}
            placeholder="List relevant work experience..."
          />
        </div>
      </div>
    </div>

    <div className="flex justify-end">
      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border bg-primary text-white border-primary/30 shadow-lg shadow-primary/20 hover:bg-primary-light"
      >
        Next Step
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </form>
);

export default PersonalDetailsForm;
