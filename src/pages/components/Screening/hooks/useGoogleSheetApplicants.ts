import { useEffect, useState } from "react";
import type { User } from "../../../../api/applicant";

export function useGoogleSheetApplicants() {
  const [applicants, setApplicants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applicants")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplicants(
            data.map((item, idx) => ({
              id: item.NO || idx + 1,
              positionApplied: item["POSITION APPLIED FOR"] || '',
              status: item.STATUS || '',
              contactNumber: item["CONTACT NUMBER"] || '',
              experience: item.EXPERIENCE || '',
              email: '',
              applicationDate: item["DATE APPLIED"] || '',
              referredBy: item["REFFERED BY"] || '',
              lastName: item["LAST NAME"] || '',
              firstName: item["FIRST NAME"] || '',
              ext: item["EXT"] || '',
              middle: item["MIDDLE"] || '',
              gender: item["GENDER"] || '',
              size: item["SIZE"] || '',
              dateOfBirth: item["DATE OF BIRTH"] || '',
              dateApplied: item["DATE APPLIED"] || '',
              facebook: item.fb_name || item["FB NAME"] || '',
              age: item["AGE"] || '',
              location: item["LOCATION"] || '',
              no: item["NO"] || '',
              datian: item["DATIAN "] || '',
              hokei: item["HOKEI "] || '',
              pobc: item["POBC "] || '',
              jinboway: item["JINBOWAY "] || '',
              surprise: item["SURPRISE "] || '',
              thaleste: item["THALESTE"] || '',
              aolly: item["AOLLY "] || '',
              enjoy: item["ENJOY "] || '',
              requirementsStatus: item["REQUIREMENTS STATUS"] || '',
            }))
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { applicants, loading };
} 