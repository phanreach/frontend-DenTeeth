import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const role = Cookies.get("role");

    if (!role) {
      navigate("/login");
      return;
    }

    const userRoles = role.split(",");
    const hasAccess = userRoles.some((r) => allowedRoles.includes(r));

    if (!hasAccess) {
      navigate("/");
    }
  }, [navigate, allowedRoles]);

  return <Outlet />;
}
