import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/side-bar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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
    <div className="min-h-screen bg-[#f5f7ff]">
      <SideBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <main
        className={`min-h-screen transition-all duration-300
        ${isMobile ? "ml-0 pt-16" : collapsed ? "ml-24" : "ml-72"}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
