import React from "react";

type ApplicantsToolbarProps = {
  search: string;
  setSearch: (s: string) => void;
  usersCount: number;
  onOpenModal: () => void;
  onOpenSheet: () => void;
};

const ApplicantsToolbar: React.FC<ApplicantsToolbarProps> = ({ search, setSearch, usersCount, onOpenModal, onOpenSheet }) => (
  <div className="flex items-center justify-between p-6 border-b bg-white">
    <div className="flex space-x-2">
      <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
        Applied <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{usersCount}</span>
      </button>
      <button
        className="px-4 py-2 cursor-pointer rounded-lg bg-custom-teal text-white font-semibold shadow-sm focus:outline-none border bordercustom-teal ml-2"
        onClick={onOpenModal}
      >
        Input Data
      </button>
      <button
        className="px-4 py-2 rounded-lg bg-green-800 cursor-pointer text-white font-semibold shadow-sm focus:outline-none border border-green-700 ml-2"
        onClick={onOpenSheet}
      >
        Open Google Sheet
      </button>
    </div>
    <div className="relative">
      <span className="absolute left-3 top-2.5 text-gray-400">
        <i className="fas fa-search" />
      </span>
      <input
        type="text"
        placeholder="Search candidate"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
      />
    </div>
  </div>
);

export default ApplicantsToolbar; 