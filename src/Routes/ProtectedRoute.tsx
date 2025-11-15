import { useUserInfoQuery } from "@/redux/freatures/auth/auth.api";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

type TUserRole = "ADMIN" | "DRIVER" | "RIDER";

type TProtectedRouteProps = {
  allowedRoles: TUserRole[];
  children?: ReactNode; 
};

const ProtectedRoute = ({ allowedRoles, children }: TProtectedRouteProps) => {
  const { data, isLoading, isError } = useUserInfoQuery(undefined);
  const location = useLocation();

  const user = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(user.role as TUserRole)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (children) {
    return children;
  }

  return <Outlet />;
};

export default ProtectedRoute;