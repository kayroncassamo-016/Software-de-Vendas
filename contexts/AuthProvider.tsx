import { useAuth } from "@/routes/routes"; // <-- teu hook atual (NÃO mexe nele)
import React, { createContext } from "react";

// cria o contexto
export const AuthContext = createContext<any>(null);

// provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth(); // <-- usa o teu hook atual

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}