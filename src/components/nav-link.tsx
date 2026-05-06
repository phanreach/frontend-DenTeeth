import { Link, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

interface NavLinkProps {
  to?: string;
  children: ReactNode;
  onClick?: () => void;
}

export default function NavLink({ to, children, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to || "#"}
      onClick={onClick}
      className={`relative px-3 py-2 rounded-md text-sm lg:text-base transition-all duration-200
        ${
          isActive
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:text-primary"
        }
      `}
    >
      {children}

      {/* Active underline */}
      <span
        className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-300
        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      />
    </Link>
  );
}
