import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DentistHeader from "./components/dentist/dentist-header";
import SideBar from "./components/side-bar";

export default function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const isDentistLayout = location.pathname.startsWith("/dentist");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f5f7ff]">
      <SideBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : collapsed ? "ml-24" : "ml-72"
        }`}
      >
        {isDentistLayout ? (
          <DentistHeader
            collapsed={collapsed}
            isMobile={isMobile}
            setCollapsed={setCollapsed}
          />
        ) : null}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
