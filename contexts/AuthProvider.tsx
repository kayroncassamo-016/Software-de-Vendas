import { useAuth } from "@/routes/routes";
import React from "react";
import { AuthContext } from "./AuthContext"; // <-- IMPORTANTE

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}