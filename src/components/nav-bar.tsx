import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import NavLink from "./nav-link";

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-[0_1px_12px_rgba(0,0,0,0.08)]"
          : "bg-white/80"
      } backdrop-blur-md border-b border-slate-100`}
    >
      <div className="mx-auto flex items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2 group">
          <h1 className="font-bold text-xl text-primary tracking-tight">
            DenTeeth
          </h1>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {[
            ["Home", "/"],
            ["AI Scan", "/scan"],
            ["Dentist", "/dentist"],
          ].map(([label, to]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/sign-up" className="hidden sm:block">
            <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95">
              Sign Up
            </button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-slate-600 rounded transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-slate-600 rounded transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-slate-600 rounded transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64" : "max-h-0"}`}
      >
        <div className="px-6 py-3 border-t border-slate-100 space-y-1">
          {[
            ["Home", "/"],
            ["AI Scan", "/scan"],
            ["History", "/history"],
          ].map(([label, to]) => (
            <NavLink key={to} to={to} onClick={() => setIsOpen(false)}>
              {label}
            </NavLink>
          ))}
          <div className="pt-2 pb-1">
            <Link to="/sign-up" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
