"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AdminProvider } from "@/lib/context/AdminContext";

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <AdminProvider>
        {children}
      </AdminProvider>
    </AuthProvider>
  );
}