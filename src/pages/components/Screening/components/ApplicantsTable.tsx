import React, { useEffect } from "react";
import type { User } from "../../../../api/applicant";
import { formatAppliedDate, getUserInitials, ADDITIONAL_SCREENING_COLUMNS, mapUserToDisplayFormat } from "../utils/screeningUtils";
import { useVirtualRows, spacerRowStyle } from "../../../../components/Tables/useVirtualRows";
import { useTableSort } from "../../../../components/Tables/useTableSort";
import SortHeaderButton, { ariaSortValue } from "../../../../components/Tables/SortHeaderButton";
import { PIPELINE_SORT_COLUMNS } from "../../../../components/Tables/pipelineSortColumns";
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

type ApplicantsTableProps = {
  users: User[];
  selectedUser: User | null;
  onUserClick: (user: User) => void;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
};

// Fill the remaining height of the fullHeight page shell and scroll internally
// (this element is the virtualizer's scroll root). min-h-0 lets it shrink inside
// the card's flex column so the internal scroll engages instead of overflowing.
const virtualScrollContainer = `${pipelineTableContainer} flex-1 min-h-0 overflow-y-auto`;

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ users, selectedUser, onUserClick, isLoading, hasActiveFilters = false }) => {
  const { sortedRows, sortState, toggleSort } = useTableSort(users, PIPELINE_SORT_COLUMNS);
  const { containerRef, items, topSpacer, bottomSpacer, measureRow } = useVirtualRows(sortedRows, 73);
  const colCount = 4 + ADDITIONAL_SCREENING_COLUMNS.length;

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [sortState, containerRef]);

  return (
  <div ref={containerRef} className={virtualScrollContainer}>
    <table className={pipelineTable}>
      <thead className={pipelineThead}>
        <tr>
          <th scope="col" aria-sort={ariaSortValue('Name', sortState)} className={pipelineThSticky}>
            <SortHeaderButton label="Name" sortKey="Name" sortState={sortState} onToggle={toggleSort} />
          </th>
          <th scope="col" aria-sort={ariaSortValue('Position', sortState)} className={`${pipelineTh} ${pipelineColPosition}`}>
            <SortHeaderButton label="Position" sortKey="Position" sortState={sortState} onToggle={toggleSort} />
          </th>
          <th scope="col" aria-sort={ariaSortValue('Applied Date', sortState)} className={`${pipelineTh} ${pipelineColDate}`}>
            <SortHeaderButton label="Applied Date" sortKey="Applied Date" sortState={sortState} onToggle={toggleSort} />
          </th>
          <th scope="col" aria-sort={ariaSortValue('Status', sortState)} className={`${pipelineTh} ${pipelineColStatus}`}>
            <SortHeaderButton label="Status" sortKey="Status" sortState={sortState} onToggle={toggleSort} />
          </th>
          {ADDITIONAL_SCREENING_COLUMNS.map((columnKey) => (
            <th key={columnKey} scope="col" aria-sort={ariaSortValue(columnKey, sortState)} className={`${pipelineThExtra} ${pipelineColExtra}`}>
              <SortHeaderButton label={columnKey} sortKey={columnKey} sortState={sortState} onToggle={toggleSort} />
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
              {ADDITIONAL_SCREENING_COLUMNS.map((_, colIdx) => (
                <td key={colIdx} className={pipelineTd}><div className="h-4 bg-white/10 rounded-full w-20" /></td>
              ))}
            </tr>
          ))
        )}
        {!isLoading && users.length === 0 && (
          <tr>
            <td colSpan={colCount} className="px-6 py-20 text-center text-text-secondary">
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
        {!isLoading && topSpacer > 0 && (
          <tr aria-hidden><td colSpan={colCount} style={spacerRowStyle(topSpacer)} /></tr>
        )}
        {!isLoading && items.map((virtualItem) => {
          const user = sortedRows[virtualItem.index];
          const displayData = mapUserToDisplayFormat(user);
          const isSelected = selectedUser?.id === user.id;
          return (
            <tr
              key={user.id}
              ref={measureRow}
              data-index={virtualItem.index}
              className={isSelected ? pipelineRowSelected : pipelineRowDefault}
              onClick={() => onUserClick(user)}
            >
              <td className={isSelected ? pipelineTdStickySelected : pipelineTdStickyDefault}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/90 to-primary-dark flex items-center justify-center shadow-lg ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                      <span className="text-sm text-white font-bold">{getUserInitials(user)}</span>
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
                <div className="text-sm text-text-secondary group-hover:text-white transition-colors font-medium">{user.positionApplied || '-'}</div>
              </td>
              <td className={pipelineTd}>
                <div className="text-sm text-text-secondary group-hover:text-white/90">{formatAppliedDate(user.dateApplied) || '-'}</div>
              </td>
              <td className={pipelineTd}>
                <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full border ${user.status.includes('Rejected') ? 'bg-danger/10 text-danger border-danger/20' :
                    user.status.includes('Hired') ? 'bg-success/10 text-success border-success/20' :
                      'bg-warning/10 text-warning border-warning/20'
                  }`}>
                  {user.status}
                </span>
              </td>
              {ADDITIONAL_SCREENING_COLUMNS.map((columnKey) => (
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
        {!isLoading && bottomSpacer > 0 && (
          <tr aria-hidden><td colSpan={colCount} style={spacerRowStyle(bottomSpacer)} /></tr>
        )}
      </tbody>
    </table>
  </div>
  );
};

export default ApplicantsTable;
