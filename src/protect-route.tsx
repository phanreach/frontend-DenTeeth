import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { COOKIE_KEYS, getCookie } from "./utils/cookies";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

function parseRoles(cookieValue: string | undefined): string[] {
  if (!cookieValue) return [];

  try {
    const parsed = JSON.parse(cookieValue);
    if (Array.isArray(parsed)) {
      return parsed.map((role) => String(role).trim()).filter(Boolean);
    }
  } catch {
    // ignore invalid JSON and fall back to comma-split
  }

  return cookieValue
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const rolesCookie =
      getCookie(COOKIE_KEYS.roles) || getCookie(COOKIE_KEYS.role);
    const userRoles = parseRoles(rolesCookie);

    if (userRoles.length === 0) {
      navigate("/login");
      return;
    }

    const hasAccess = userRoles.some((r) => allowedRoles.includes(r));

    if (!hasAccess) {
      navigate("/");
    }
  }, [navigate, allowedRoles]);

  return <Outlet />;
}
