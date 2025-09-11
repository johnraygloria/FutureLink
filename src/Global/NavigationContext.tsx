import React, { createContext, useContext } from "react";

type SectionKey =
  | "dashboard"
  | "screening"
  | "assessment"
  | "selection"
  | "engagement"
  | "employee_relations"
  | "recruitment-database";

interface NavigationContextValue {
  activeSection: SectionKey;
  setActiveSection: (section: SectionKey) => void;
  currentApplicantNo?: string;
  setCurrentApplicantNo: (no?: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export const NavigationProvider: React.FC<{
  activeSection: SectionKey;
  setActiveSection: (section: SectionKey) => void;
  children: React.ReactNode;
}> = ({ activeSection, setActiveSection, children }) => {
  const [currentApplicantNo, setCurrentApplicantNo] = React.useState<string | undefined>(undefined);
  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection, currentApplicantNo, setCurrentApplicantNo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}


