import { createContext, useContext } from "react";

export const AuthContext = createContext<any>(null);

export function useContexto() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useContexto deve ser usado dentro de AuthProvider");
  }

  return context;
}