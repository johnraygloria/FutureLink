import React from "react";
import type { User } from "../../../../api/applicant";
import { formatAppliedDate, getUserInitials, ADDITIONAL_SELECTION_COLUMNS, mapUserToDisplayFormat } from "../utils/selectionUtils";
import {
  pipelineColDate,
  pipelineColExtra,
  pipelineColPosition,
  pipelineColStatus,
  pipelineRowDefault,
  pipelineRowSelected,
  pipelineTable,
  pipelineTableContainer,
  pipelineTd,
  pipelineTdStickyDefault,
  pipelineTdStickySelected,
  pipelineThead,
  pipelineTh,
  pipelineThExtra,
  pipelineThSticky,
} from "../../../../components/Tables/pipelineTableStyles";

type SelectionTableProps = {
  users: User[];
  selectedUser: User | null;
  onUserClick: (user: User) => void;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
};

const SelectionTable: React.FC<SelectionTableProps> = ({ users, selectedUser, onUserClick, isLoading, hasActiveFilters = false }) => (
  <div className={pipelineTableContainer}>
    <table className={pipelineTable}>
      <thead className={pipelineThead}>
        <tr>
          <th scope="col" className={pipelineThSticky}>Name</th>
          <th scope="col" className={`${pipelineTh} ${pipelineColPosition}`}>Position</th>
          <th scope="col" className={`${pipelineTh} ${pipelineColDate}`}>Applied Date</th>
          <th scope="col" className={`${pipelineTh} ${pipelineColStatus}`}>Status</th>
          {ADDITIONAL_SELECTION_COLUMNS.map((columnKey) => (
            <th key={columnKey} scope="col" className={`${pipelineThExtra} ${pipelineColExtra}`}>
              {columnKey}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          Array.from({ length: 6 }).map((_, idx) => (
            <tr key={`skeleton-${idx}`} className="animate-pulse">
              <td className={`${pipelineTdStickyDefault} ${pipelineTd}`}><div className="h-4 bg-white/10 rounded-full w-3/5" /></td>
              <td className={pipelineTd}><div className="h-4 bg-white/10 rounded-full w-2/5" /></td>
              <td className={pipelineTd}><div className="h-4 bg-white/10 rounded-full w-1/4" /></td>
              <td className={pipelineTd}><div className="h-6 bg-white/10 rounded-full w-24" /></td>
              {ADDITIONAL_SELECTION_COLUMNS.map((_, colIdx) => (
                <td key={colIdx} className={pipelineTd}><div className="h-4 bg-white/10 rounded-full w-20" /></td>
              ))}
            </tr>
          ))
        )}
        {!isLoading && users.length === 0 && (
          <tr>
            <td colSpan={4 + ADDITIONAL_SELECTION_COLUMNS.length} className="px-6 py-20 text-center text-text-secondary">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <i className={`fas ${hasActiveFilters ? 'fa-filter' : 'fa-user-slash'} text-white/20 text-2xl`} />
              </div>
              <p className="text-base font-medium text-white mb-1">
                {hasActiveFilters ? 'No applicants match your filters' : 'No applicants found'}
              </p>
              {hasActiveFilters && (
                <p className="text-sm text-text-secondary/60">Try adjusting your filter criteria</p>
              )}
            </td>
          </tr>
        )}
        {!isLoading && users.map((user) => {
          const displayData = mapUserToDisplayFormat(user);
          const isSelected = selectedUser?.id === user.id;
          const normalizedStatus =
            user.status === 'Final Interview/Complete Requirements' ? 'For Medical' : user.status;
          return (
            <tr
              key={user.id}
              className={isSelected ? pipelineRowSelected : pipelineRowDefault}
              onClick={() => onUserClick(user)}
            >
              <td className={isSelected ? pipelineTdStickySelected : pipelineTdStickyDefault}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/90 to-primary-dark flex items-center justify-center shadow-lg ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                      <span className="text-white font-bold text-sm">{getUserInitials(user)}</span>
                    </div>
                    {isSelected && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-light rounded-full ring-2 ring-[#0f2430] shadow-[0_0_12px_rgba(0,166,167,0.8)]" />}
                  </div>
                  <div className="min-w-[160px]">
                    <div className={`text-sm font-semibold transition-colors ${isSelected ? 'text-primary-light' : 'text-white group-hover:text-primary-light'}`}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-[11px] text-text-secondary/70 mt-0.5">{user.no || '-'}</div>
                  </div>
                </div>
              </td>
              <td className={pipelineTd}>
                <div className="text-sm text-text-secondary group-hover:text-white transition-colors">{user.positionApplied || '-'}</div>
              </td>
              <td className={pipelineTd}>
                <div className="text-sm text-text-secondary group-hover:text-white/90">{formatAppliedDate(user.dateApplied) || '-'}</div>
              </td>
              <td className={pipelineTd}>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${normalizedStatus === 'For Medical' ? 'bg-primary/10 text-primary-light border-primary/20' :
                  normalizedStatus === 'Pending For Medical' ? 'bg-info/10 text-info border-info/20' :
                  normalizedStatus === 'For SBMA Gate Pass' ? 'bg-warning/10 text-warning border-warning/20' :
                    normalizedStatus === 'Biometrics' ? 'bg-primary/20 text-primary-light border-primary/30 shadow-[0_0_10px_rgba(0,166,167,0.2)]' :
                      normalizedStatus === 'For Deployment' ? 'bg-primary/20 text-primary border-primary/30' :
                        normalizedStatus === 'Deployed' ? 'bg-success/10 text-success border-success/20' :
                          'bg-white/5 text-text-secondary border-white/10'
                  }`}>
                  {normalizedStatus}
                </span>
              </td>
              {ADDITIONAL_SELECTION_COLUMNS.map((columnKey) => (
                <td key={columnKey} className={pipelineTd}>
                  {columnKey === "PRINCIPAL" ? (
                    <div className="flex flex-wrap gap-1.5">
                      {displayData[columnKey] ? (
                        displayData[columnKey].split(', ').map((client: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-primary/10 text-primary-light border border-primary/20 group-hover:border-primary/35 transition-colors"
                          >
                            {client}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-white/20">-</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-text-secondary group-hover:text-white/80">{displayData[columnKey] || '-'}</div>
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default SelectionTable;
