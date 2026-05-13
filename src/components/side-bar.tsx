import {
  Bell,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

type UserRole = "ADMIN" | "DENTIST" | "PATIENT";
type NavIcon = typeof LayoutDashboard;

interface NavItem {
  label: string;
  icon: NavIcon;
  path: string;
  active: boolean;
}

interface SideBarProps {
  collapsed: boolean;
  isMobile: boolean;
  setCollapsed: (value: boolean) => void;
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

function getActiveRole(pathname: string): UserRole {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/dentist")) return "DENTIST";

  const roles = parseRoles(Cookies.get("roles") || Cookies.get("role"));

  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("DENTIST")) return "DENTIST";

  return "PATIENT";
}

export default function SideBar({
  collapsed,
  isMobile,
  setCollapsed,
}: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname;
  const activeRole = getActiveRole(currentPage);
  const username = Cookies.get("username") ?? "User";
  const firstLetter = username.charAt(0).toUpperCase();

  const roleLabels: Record<UserRole, string> = {
    ADMIN: "Admin",
    DENTIST: "Dentist",
    PATIENT: "Patient",
  };

  const navItemsByRole: Record<UserRole, NavItem[]> = {
    ADMIN: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
        active: currentPage.startsWith("/admin/dashboard"),
      },
      {
        label: "Users",
        icon: Users,
        path: "/admin/users",
        active: currentPage.startsWith("/admin/users"),
      },
      {
        label: "Dentists",
        icon: Stethoscope,
        path: "/admin/dentists",
        active: currentPage.startsWith("/admin/dentists"),
      },
    ],
    DENTIST: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dentist/dashboard",
        active: currentPage.startsWith("/dentist/dashboard"),
      },
      {
        label: "Calendar",
        icon: Calendar,
        path: "/dentist/calendar",
        active: currentPage.startsWith("/dentist/calendar"),
      },
      {
        label: "Patients",
        icon: Users,
        path: "/dentist/patients",
        active: currentPage.startsWith("/dentist/patients"),
      },
    ],
    PATIENT: [
      {
        label: "Home",
        icon: LayoutDashboard,
        path: "/home",
        active: currentPage === "/home",
      },
      {
        label: "Calendar",
        icon: Calendar,
        path: "/calendar",
        active: currentPage.startsWith("/calendar"),
      },
      {
        label: "News",
        icon: Newspaper,
        path: "/news",
        active: currentPage.startsWith("/news"),
      },
    ],
  };

  const navItems = navItemsByRole[activeRole];
  const homePath = navItems[0].path;

  const handleNavigate = (path: string) => {
    navigate(path);

    if (isMobile) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    Cookies.remove("role");
    Cookies.remove("roles");
    Cookies.remove("username");
    navigate("/login");
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl z-40 flex items-center justify-between px-4 border-b border-slate-200">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <button
            onClick={() => handleNavigate(homePath)}
            className="text-lg font-bold text-[#1a3cff]"
          >
            DenTeeth
          </button>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-xl hover:bg-slate-100 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>

            <div className="w-9 h-9 rounded-full bg-[#1a3cff] text-white flex items-center justify-center text-sm font-semibold shadow-md">
              {firstLetter}
            </div>
          </div>
        </div>
      )}

      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#0f172a] border-r border-white/10 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isMobile
            ? collapsed
              ? "-translate-x-full w-72"
              : "translate-x-0 w-72"
            : collapsed
              ? "w-24"
              : "w-72"
        }`}
      >
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/10">
          {!collapsed && (
            <button
              onClick={() => handleNavigate(homePath)}
              className="flex items-center gap-3"
            >
              <div className="text-left">
                <h1 className="text-white font-bold text-lg">DenTeeth</h1>
                <p className="text-xs text-slate-400">AI Dental Platform</p>
              </div>
            </button>
          )}

          <button
            onClick={() =>
              isMobile ? setCollapsed(true) : setCollapsed(!collapsed)
            }
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 transition"
            aria-label={isMobile ? "Close sidebar" : "Toggle sidebar"}
          >
            {isMobile ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  className={`group relative flex items-center w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-[#1a3cff] to-[#4f6dff] text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                  {item.active && (
                    <div className="absolute right-3 w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          {!collapsed ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a3cff] to-[#4f6dff] text-white flex items-center justify-center font-bold shadow-lg">
                  {firstLetter}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {username}
                  </p>
                  <p className="text-xs text-slate-400">
                    {roleLabels[activeRole]}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavigate(homePath)}
              className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#1a3cff] to-[#4f6dff] text-white flex items-center justify-center font-bold shadow-lg"
              aria-label={`${roleLabels[activeRole]} home`}
            >
              <UserRound className="w-6 h-6" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
