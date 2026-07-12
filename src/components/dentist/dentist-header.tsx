import {
 Bell,
 ChevronDown,
 KeyRound,
 LogOut,
 Menu,
 Moon,
 Sun,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
 DENTIST_HEADER_NOTIFICATIONS,
 DENTIST_MODULE_LABELS,
} from "../../dentist/constants/dentist-header-data";
import { clearAuthCookies, COOKIE_KEYS, getCookie } from "../../utils/cookies";
import ChangePasswordModal from "./change-password-modal";

interface DentistHeaderProps {
 collapsed: boolean;
 isMobile: boolean;
 setCollapsed: (value: boolean) => void;
 isDarkMode: boolean;
 onToggleTheme: () => void;
}

function formatSegment(segment: string) {
 return (
 DENTIST_MODULE_LABELS[segment] ??
 segment
 .split("-")
 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
 .join(" ")
 );
}

export default function DentistHeader({
 collapsed,
 isMobile,
 setCollapsed,
 isDarkMode,
 onToggleTheme,
}: DentistHeaderProps) {
 const navigate = useNavigate();
 const location = useLocation();
 const [openMenu, setOpenMenu] = useState<"notifications" | "profile" | null>(
 null,
 );
 const [showChangePassword, setShowChangePassword] = useState(false);
 const containerRef = useRef<HTMLDivElement | null>(null);

 const username = getCookie(COOKIE_KEYS.username) || "Laxmi";
 const firstLetter = username.charAt(0).toUpperCase();

 const breadcrumbs = useMemo(() => {
 const segments = location.pathname.split("/").filter(Boolean);
 const dentistSegments = segments[0] === "dentist" ? segments.slice(1) : segments;
 const fallbackSegments = ["dashboard"];
 const activeSegments = dentistSegments.length > 0 ? dentistSegments : fallbackSegments;

 return activeSegments.map((segment, index) => ({
 label: formatSegment(segment),
 path: `/dentist/${activeSegments.slice(0, index + 1).join("/")}`,
 current: index === activeSegments.length - 1,
 }));
 }, [location.pathname]);

 useEffect(() => {
 const handlePointerDown = (event: PointerEvent) => {
 if (!containerRef.current?.contains(event.target as Node)) {
 setOpenMenu(null);
 }
 };

 document.addEventListener("pointerdown", handlePointerDown);

 return () => {
 document.removeEventListener("pointerdown", handlePointerDown);
 };
 }, []);

 const handleLogout = () => {
 clearAuthCookies();
 toast.success("Logged out successfully");
 navigate("/login");
 };

 return (
 <>
 <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur dark:bg-background/95">
 <div
 ref={containerRef}
 className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6"
 >
 <div className="flex min-w-0 items-center gap-3">
 {isMobile ? (
 <button
 type="button"
 onClick={() => setCollapsed(!collapsed)}
 className="grid size-9 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-muted/80"
 aria-label="Toggle sidebar"
 >
 <Menu className="size-4" />
 </button>
 ) : null}

 <div className="min-w-0">
 <nav
 aria-label="Breadcrumb"
 className="flex min-w-0 items-center gap-2 text-lg font-medium leading-7 text-muted-foreground sm:text-xl"
 >
 {breadcrumbs.map((item) => (
 <span key={item.path} className="inline-flex min-w-0 items-center gap-2">
 {breadcrumbs.length > 1 && item !== breadcrumbs[0] ? (
 <span className="shrink-0 text-slate-300 dark:text-slate-700">/</span>
 ) : null}
 {item.current ? (
 <span className="truncate font-semibold text-foreground">
 {item.label}
 </span>
 ) : (
 <button
 type="button"
 onClick={() => navigate(item.path)}
 className="cursor-pointer truncate transition hover:text-indigo-600 "
 >
 {item.label}
 </button>
 )}
 </span>
 ))}
 </nav>
 </div>
 </div>

 <div className="relative flex shrink-0 items-center gap-2">
 {/* Theme Toggle Button */}
 <button
 type="button"
 onClick={onToggleTheme}
 className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-indigo-600/30 hover:text-indigo-600 "
 aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
 >
 {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
 </button>

 <button
 type="button"
 onClick={() =>
 setOpenMenu((value) =>
 value === "notifications" ? null : "notifications",
 )
 }
 className="relative grid size-10 cursor-pointer place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-indigo-600/30 hover:text-indigo-600 "
 aria-label="Open notifications"
 aria-expanded={openMenu === "notifications"}
 >
 <Bell className="size-4" />
 <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
 </button>

 <button
 type="button"
 onClick={() =>
 setOpenMenu((value) => (value === "profile" ? null : "profile"))
 }
 className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-2 text-sm font-medium text-foreground transition hover:border-indigo-600/30"
 aria-label="Open profile menu"
 aria-expanded={openMenu === "profile"}
 >
 <span className="grid size-7 place-items-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
 {firstLetter}
 </span>
 <span className="hidden max-w-28 truncate sm:inline">{username}</span>
 <ChevronDown className="size-3.5 text-muted-foreground" />
 </button>

 {openMenu === "notifications" ? (
 <div className="absolute right-0 top-12 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
 <div className="border-b border-border px-4 py-3">
 <p className="text-sm font-semibold text-foreground">Notifications</p>
 <p className="text-xs text-muted-foreground">Recent dentist updates</p>
 </div>
 <div className="max-h-80 overflow-y-auto">
 {DENTIST_HEADER_NOTIFICATIONS.map((notification) => (
 <button
 key={notification.id}
 type="button"
 className="block w-full cursor-pointer border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-muted"
 >
 <div className="flex items-start justify-between gap-3">
 <p className="text-sm font-semibold text-foreground">
 {notification.title}
 </p>
 <span className="shrink-0 text-[11px] text-muted-foreground">
 {notification.time}
 </span>
 </div>
 <p className="mt-1 text-xs leading-5 text-muted-foreground">
 {notification.body}
 </p>
 </button>
 ))}
 </div>
 </div>
 ) : null}

 {openMenu === "profile" ? (
 <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
 <div className="border-b border-border px-4 py-3">
 <p className="truncate text-sm font-semibold text-foreground">
 {username}
 </p>
 <p className="text-xs text-muted-foreground">Dentist</p>
 </div>
 <button
 type="button"
 onClick={() => {
 setOpenMenu(null);
 setShowChangePassword(true);
 }}
 className="flex h-11 w-full cursor-pointer items-center gap-2 px-4 text-sm font-medium text-foreground transition hover:bg-muted"
 >
 <KeyRound className="size-4 text-muted-foreground" />
 Change Password
 </button>
 <button
 type="button"
 onClick={handleLogout}
 className="flex h-11 w-full cursor-pointer items-center gap-2 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
 >
 <LogOut className="size-4" />
 Logout
 </button>
 </div>
 ) : null}
 </div>
 </div>
 </header>

 <ChangePasswordModal
 open={showChangePassword}
 onClose={() => setShowChangePassword(false)}
 />
 </>
 );
}
