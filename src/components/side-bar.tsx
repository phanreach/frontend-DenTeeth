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
  ClipboardClock,
  Microscope,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthCookies, COOKIE_KEYS, getCookie } from "../utils/cookies";

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
    //
  }

  return cookieValue
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

function getActiveRole(pathname: string): UserRole {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/dentist")) return "DENTIST";

  const roles = parseRoles(
    getCookie(COOKIE_KEYS.roles) || getCookie(COOKIE_KEYS.role),
  );

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

  const username = getCookie(COOKIE_KEYS.username) ?? "User";
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
        label: "Patient",
        icon: Users,
        path: "/admin/patients",
        active: currentPage.startsWith("/admin/patients"),
      },
      {
        label: "Dentists",
        icon: Stethoscope,
        path: "/admin/dentists",
        active: currentPage.startsWith("/admin/dentists"),
      },
      {
        label: "Appointments",
        icon: ClipboardClock,
        path: "/admin/appointment",
        active: currentPage.startsWith("/admin/appointments"),
      },
      {
        label: "AI Scans",
        icon: Microscope,
        path: "/admin/ai-scans",
        active: currentPage.startsWith("/admin/ai-scans"),
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
    clearAuthCookies();

    navigate("/login");
  };

  return (
    <>
      {isMobile && (
        <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl">
          <button
            onClick={() => setCollapsed(false)}
            className="rounded-xl p-2 transition hover:bg-secondary"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>

          <button
            onClick={() => handleNavigate(homePath)}
            className="font-serif text-xl text-primary"
          >
            DenTeeth
          </button>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl p-2 transition hover:bg-secondary">
              <Bell className="h-5 w-5 text-slate-600" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-lg">
              {firstLetter}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 flex h-screen flex-col border-r border-slate-200 bg-white/90 backdrop-blur-xl transition-all duration-300 ${
          isMobile
            ? collapsed
              ? "-translate-x-full w-72"
              : "translate-x-0 w-72"
            : collapsed
              ? "w-24"
              : "w-72"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          {!collapsed && (
            <button
              onClick={() => handleNavigate(homePath)}
              className="flex items-center gap-3"
            >
              <div className="text-left">
                <h1 className="font-bold text-xl text-primary">DenTeeth</h1>

                <p className="text-xs tracking-wide text-slate-500">
                  AI Dental Platform
                </p>
              </div>
            </button>
          )}

          <button
            onClick={() =>
              isMobile ? setCollapsed(true) : setCollapsed(!collapsed)
            }
            className="rounded-xl p-2 transition hover:bg-secondary hover:text-primary"
          >
            {isMobile ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  className={`group relative flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    item.active
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-600 hover:bg-secondary hover:text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  {!collapsed && <span className="ml-3">{item.label}</span>}

                  {item.active && !collapsed && (
                    <div className="absolute right-4 h-2 w-2 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User */}
        <div className="border-t border-slate-100 p-4">
          {!collapsed ? (
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-bold text-white shadow-lg">
                  {firstLetter}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {username}
                  </p>

                  <p className="text-xs text-slate-500">
                    {roleLabels[activeRole]}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavigate(homePath)}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20"
            >
              <UserRound className="h-6 w-6" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
