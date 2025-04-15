import { createContext, useContext, useState, ReactNode } from "react";

const CollapseContext = createContext<{
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
}>({ openKey: null, setOpenKey: () => {} });

export function useCollapseGroup() {
  return useContext(CollapseContext);
}

export function CollapseGroup({ children }: { children: ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  return (
    <CollapseContext.Provider value={{ openKey, setOpenKey }}>
      {children}
    </CollapseContext.Provider>
  );
}
