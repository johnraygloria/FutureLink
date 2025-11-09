import { useCallback, useEffect, useState } from "react";
import type { AssessmentHistoryItem } from "../utils/assessmentUtils";

export function useAssessmentHistory() {
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/applicants/assessment-history');
      const data = res.ok ? await res.json() : [];
      if (Array.isArray(data) && data.length > 0) {
        setHistory(data);
        return;
      }
      const res2 = await fetch('/api/applicants/screening-history');
      const rows = res2.ok ? await res2.json() : [];
      const filtered = Array.isArray(rows) ? rows.filter((r: any) => (
        r.action === 'Assessment Updated' ||
        r.action === 'Final Interview - Requirements Complete' ||
        r.action === 'Final Interview - Requirements Incomplete' ||
        r.action === 'Requirements Complete - Proceeded to Medical' ||
        r.action === 'Requirements Incomplete - Returned to Screening' ||
        r.action === 'Initial Interview Complete - Proceeded to Assessment' ||
        r.action === 'Proceeded to Selection'
      )) : [];
      setHistory(filtered);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUpdated = () => refresh();
    window.addEventListener('assessment-history-updated', onUpdated);
    return () => window.removeEventListener('assessment-history-updated', onUpdated);
  }, [refresh]);

  return { history, refresh };
}


