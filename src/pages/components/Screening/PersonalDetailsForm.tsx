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
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: (e: React.FormEvent) => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ form, handleChange, onNext }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <i className="fas fa-user-circle text-custom-teal"></i>
        Personal Details
      </h3>
      <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">Step 1 of 4</span>
    </div>

    <form onSubmit={onNext} className="space-y-4">
      {/* Identity Section */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-semibold text-custom-teal uppercase tracking-wider mb-3 border-b border-white/5 pb-1.5">Identity Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="no" className="text-xs font-semibold text-text-secondary uppercase">Applicant No *</label>
            <div className="relative">
              <i className="fas fa-id-badge absolute left-3 top-3 text-text-secondary/50 text-xs"></i>
              <input
                id="no"
                name="no"
                value={form.no}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/5 rounded-lg py-2 pl-8 pr-3 text-sm text-white/50 cursor-not-allowed focus:outline-none"
                required
                readOnly
                title="Auto-generated"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-xs font-semibold text-text-secondary uppercase">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="glass-input w-full rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
              required
              placeholder="e.g. Juan"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="middle" className="text-xs font-semibold text-text-secondary uppercase">Middle Name</label>
            <input
              id="middle"
              name="middle"
              value={form.middle ?? ''}
              onChange={handleChange}
              className="glass-input w-full rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
              placeholder="e.g. Santos"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-xs font-semibold text-text-secondary uppercase">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="glass-input w-full rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
              required
              placeholder="e.g. Dela Cruz"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ext" className="text-xs font-semibold text-text-secondary uppercase">Suffix</label>
            <input
              id="ext"
              name="ext"
              value={form.ext ?? ''}
              onChange={handleChange}
              className="glass-input w-full rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
              placeholder="e.g. Jr., III"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gender" className="text-xs font-semibold text-text-secondary uppercase">Gender *</label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="glass-input w-full rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all appearance-none bg-transparent"
                required
              >
                <option value="" className="bg-slate-800">Select Gender</option>
                <option value="Male" className="bg-slate-800">Male</option>
                <option value="Female" className="bg-slate-800">Female</option>
                <option value="Other" className="bg-slate-800">Other</option>
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-3.5 text-text-secondary/50 text-xs pointer-events-none"></i>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dateOfBirth" className="text-xs font-semibold text-text-secondary uppercase">Date of Birth *</label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              type="date"
              className="glass-input w-full rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all [color-scheme:dark]"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="age" className="text-xs font-semibold text-text-secondary uppercase">Age</label>
            <input
              id="age"
              name="age"
              value={form.age ?? ''}
              onChange={handleChange}
              className={`w-full bg-black/40 border border-white/5 rounded-lg py-2 px-3 text-sm text-white/70 focus:outline-none ${form.age && Number(form.age) > 50 ? 'text-red-400 border-red-500/50' : ''}`}
              readOnly
              placeholder="Auto-calc"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="size" className="text-xs font-semibold text-text-secondary uppercase">Size/Height</label>
            <input
              id="size"
              name="size"
              value={form.size ?? ''}
              onChange={handleChange}
              className="glass-input w-full rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
              placeholder="e.g. M / 5'7"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-semibold text-custom-teal uppercase tracking-wider mb-3 border-b border-white/5 pb-1.5">Contact Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contactNumber" className="text-xs font-semibold text-text-secondary uppercase">Contact Number</label>
            <div className="relative">
              <i className="fas fa-phone absolute left-3 top-3 text-text-secondary/50 text-xs"></i>
              <input
                id="contactNumber"
                name="contactNumber"
                value={form.contactNumber ?? ''}
                onChange={handleChange}
                className="glass-input w-full rounded-lg py-2 pl-8 pr-3 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
                placeholder="0912 345 6789"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="facebook" className="text-xs font-semibold text-text-secondary uppercase">Facebook Name</label>
            <div className="relative">
              <i className="fab fa-facebook absolute left-3 top-3 text-text-secondary/50 text-xs"></i>
              <input
                id="facebook"
                name="facebook"
                value={form.facebook ?? ''}
                onChange={handleChange}
                className="glass-input w-full rounded-lg py-2.5 pl-8 pr-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
                placeholder="Facebook Profile Name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="text-xs font-semibold text-text-secondary uppercase">Current Location</label>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-3 top-3 text-text-secondary/50 text-xs"></i>
              <input
                id="location"
                name="location"
                value={form.location ?? ''}
                onChange={handleChange}
                className="glass-input w-full rounded-lg py-2.5 pl-8 pr-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
                placeholder="City, Province"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-semibold text-custom-teal uppercase tracking-wider mb-3 border-b border-white/5 pb-1.5">Application Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dateApplied" className="text-xs font-semibold text-text-secondary uppercase">Date Applied *</label>
            <input
              id="dateApplied"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
              type="date"
              className="glass-input w-full rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all [color-scheme:dark]"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="referredBy" className="text-xs font-semibold text-text-secondary uppercase">Referred By</label>
            <input
              id="referredBy"
              name="referredBy"
              value={form.referredBy ?? ''}
              onChange={handleChange}
              className="glass-input w-full rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
              placeholder="Name of Referrer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="positionApplied" className="text-xs font-semibold text-text-secondary uppercase">Position Applied For</label>
            <div className="relative">
              <i className="fas fa-briefcase absolute left-3 top-3 text-text-secondary/50 text-xs"></i>
              <input
                id="positionApplied"
                name="positionApplied"
                value={form.positionApplied ?? ''}
                onChange={handleChange}
                className="glass-input w-full rounded-lg py-2.5 pl-8 pr-4 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all"
                placeholder="e.g. Production Operator"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="experience" className="text-xs font-semibold text-text-secondary uppercase">Experience</label>
            <textarea
              id="experience"
              name="experience"
              value={form.experience ?? ''}
              onChange={handleChange}
              className="glass-input w-full rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal transition-all resize-none min-h-[80px]"
              rows={3}
              placeholder="List relevant work experience..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-custom-teal to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-teal-500 hover:to-custom-teal hover:shadow-custom-teal/30 focus:outline-none focus:ring-2 focus:ring-custom-teal focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <span className="relative flex items-center gap-2">
            Next Step
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </span>
        </button>
      </div>
    </form>
  </div>
);

export default PersonalDetailsForm;