import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("JOB_SEEKER" | "COMPANY")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/jobs" replace />;
  }

  return <>{children}</>;
}
