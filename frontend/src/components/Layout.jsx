import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getToken,
  getRole,
  getUserName,
  clearAuth,
} from "../utils/authStorage";
import Notification from "./Notification";

import male1 from "../assets/profile_image/male1.png";
import male2 from "../assets/profile_image/male2.png";
import male3 from "../assets/profile_image/male3.png";
import male4 from "../assets/profile_image/male4.png";
import male5 from "../assets/profile_image/male5.png";
import female1 from "../assets/profile_image/female1.png";
import female2 from "../assets/profile_image/female2.png";
import female3 from "../assets/profile_image/female3.png";
import female4 from "../assets/profile_image/female4.png";
import female5 from "../assets/profile_image/female5.png";

import {
  ClipboardClock,
  LayoutDashboard,
  UserPen,
  UserPlus,
  Target,
  BarChart3,
  Power,
  ClipboardCheck,
  NotebookText,
  Menu as MenuIcon,
  Home as HomeIcon,
} from "lucide-react";

/* -----------------------------------------------------------
   FIXED TOOLTIP (NO SCROLL, FLOATS OUTSIDE SIDEBAR)
----------------------------------------------------------- */
function Tooltip({ label, children, show }) {
  return (
    <div className="relative group">
      {children}

      {show && (
        <div
          className="
            absolute 
            left-full 
            top-1/2 
            -translate-y-1/2
            ml-2
            whitespace-nowrap
            z-[9999]
            px-2 py-1 rounded-lg text-xs
            bg-black/90 text-white shadow-xl
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-200
          "
        >
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/90"></div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  /* -----------------------------------------------------------
     INITIAL SETUP
  ----------------------------------------------------------- */
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    const name = getUserName();

    setIsAuthenticated(!!token);
    setUserRole(role || "");
    setUserName(name || "User");

    if (token) {
      fetch("http://localhost:3000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (r) => {
          if (r.status === 401) {
            clearAuth();
            navigate("/login");
            return null;
          }
          try {
            return await r.json();
          } catch {
            return null;
          }
        })
        .then((data) => {
          if (data) setAvatar(data?.avatar || "default:male1");
        })
        .catch(() => {});
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  /* -----------------------------------------------------------
     LOGOUT
  ----------------------------------------------------------- */
  const handleLogout = () => {
    try {
      localStorage.removeItem("notif_popup_shown");
    } catch (error) {}
    clearAuth();
    window.location.href = "/login";
  };

  /* -----------------------------------------------------------
     TOGGLE SIDEBAR
  ----------------------------------------------------------- */
  const handleSidebarToggle = () => {
    if (isMobile) setShowSidebar(prev => !prev);
    else setIsCollapsed(prev => !prev);
  };

  /* -----------------------------------------------------------
     PAGE TITLE
  ----------------------------------------------------------- */
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
      case "/":
        return `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`;
      case "/kracreation":
        return "Create KRA";
      case "/create_profile":
        return "Create Profile";
      case "/profile":
        return "Profile";
      case "/kpi_log":
        return "KPI Log";
      case "/kra_log":
        return "KRA Log";
      case "/requests":
        return "Requests & Approvals";
      default:
        return "Dashboard";
    }
  };

  /* -----------------------------------------------------------
     NAVIGATION ITEMS
  ----------------------------------------------------------- */
  const getNavigationItems = () => {
    const roleLower = (userRole || "").toLowerCase();

    if (roleLower === "admin") {
      return [
        { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
        { path: "/create_profile", label: "Create Profile", Icon: UserPlus },
        { path: "/profile", label: "Profile", Icon: UserPen },
        { path: "/kracreation", label: "Create KRA", Icon: Target },
        { path: "/kpi_log", label: "KPI Log", Icon: ClipboardClock },
        { path: "/kra_log", label: "KRA Log", Icon: NotebookText },
        { path: "/requests", label: "Requests & Approvals", Icon: ClipboardCheck },
      ];
    }

    if (roleLower === "manager") {
      return [
        { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
        { path: "/create_profile", label: "Create Employee", Icon: UserPlus },
        { path: "/profile", label: "Profile", Icon: UserPen },
        { path: "/kracreation", label: "Create KRA", Icon: Target },
        { path: "/create_kpi", label: "Create & My KPI", Icon: BarChart3 },
        { path: "/kpi_log", label: "KPI Log", Icon: ClipboardClock },
        { path: "/kra_log", label: "KRA Log", Icon: NotebookText },
        { path: "/requests", label: "Requests & Approvals", Icon: ClipboardCheck },
      ];
    }

    return [
      { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
      { path: "/profile", label: "Profile", Icon: UserPen },
      { path: "/create_kpi", label: "Create & My KPI", Icon: BarChart3 },
      { path: "/kpi_log", label: "KPI Log", Icon: ClipboardClock },
      { path: "/requests", label: "Requests & Approvals", Icon: ClipboardCheck },
    ];
  };

  /* -----------------------------------------------------------
     AVATAR
  ----------------------------------------------------------- */
  const resolveAvatar = (val) => {
    const map = {
      male1,
      male2,
      male3,
      male4,
      male5,
      female1,
      female2,
      female3,
      female4,
      female5,
    };
    if (!val || typeof val !== "string") return male1;
    if (val.startsWith("default:")) {
      const key = val.split(":")[1];
      return map[key] || male1;
    }
    return val;
  };

  const roleLower = (userRole || "").toLowerCase();
  const isManager = roleLower === "manager";
  const isEmployee = roleLower === "employee";

  const headerToggleButtonClass = isManager
    ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-indigo-300/60 bg-indigo-700/80 hover:bg-indigo-500 shadow-md shadow-indigo-900/50"
    : isEmployee
    ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-fuchsia-300/60 bg-purple-700/80 hover:bg-fuchsia-600 shadow-md shadow-fuchsia-900/50"
    : "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-teal-400/40 bg-teal-700/80 hover:bg-teal-500 shadow-md shadow-teal-900/50";

  const headerHomeButtonClass = isManager
    ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-indigo-300/60 bg-indigo-800/80 hover:bg-indigo-600 shadow-md shadow-indigo-900/40"
    : isEmployee
    ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-fuchsia-300/60 bg-purple-800/90 hover:bg-fuchsia-600 shadow-md shadow-fuchsia-900/40"
    : "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-teal-400/40 bg-teal-800/90 hover:bg-teal-600 shadow-md shadow-teal-900/40";

  const rootBgClass = isManager
    ? "bg-gradient-to-br from-indigo-800 via-indigo-700 to-[#0D1226]"
    : isEmployee
    ? "bg-gradient-to-br from-purple-800 via-fuchsia-800 to-[#2C003E]"
    : "bg-gradient-to-br from-teal-900 via-emerald-800 to-teal-950";

  const sidebarBaseClass = isManager
    ? "bg-[#0B0F29]/95 text-white border-r border-indigo-500/40"
    : isEmployee
    ? "bg-[#2C003E]/95 text-white border-r border-fuchsia-400/40"
    : "bg-teal-950/95 text-white border-r border-teal-500/40";

  const desktopSidebarWidth = isCollapsed ? "w-20" : "w-64";

  const headerClass =
    "p-4 bg-black/30 backdrop-blur-xl flex items-center gap-4";

  /* -----------------------------------------------------------
     RETURN UI
  ----------------------------------------------------------- */
  return (
    <div className={`flex h-screen w-screen text-white ${rootBgClass}`}>
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`${sidebarBaseClass} flex flex-col h-full shrink-0 transition-all duration-300 
          ${
            isMobile
              ? `fixed top-0 left-0 h-full w-64 z-[999] transform ${
                  showSidebar ? "translate-x-0" : "-translate-x-full"
                }`
              : `relative ${desktopSidebarWidth}`
          }
        `}
      >
        {/* LOGO */}
        <div className="p-6 flex justify-center">
          <img
            src={
              isMobile || !isCollapsed
                ? "./src/assets/logo.png"
                : "./src/assets/logo1.png"
            }
            className={`${
              isMobile || !isCollapsed ? "w-44 h-20" : "w-10 h-10"
            } transition-all duration-300`}
          />
        </div>

        {/* NO SCROLL NAVIGATION */}
        <nav className="flex-1 px-4 space-y-4 overflow-visible">
          {getNavigationItems().map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Tooltip
                key={item.path}
                label={item.label}
                show={!isMobile && isCollapsed}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  onClick={() => isMobile && setShowSidebar(false)}
                >
                  <item.Icon className="w-5 h-5" />
                  {(isMobile || !isCollapsed) && item.label}
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-xl flex justify-center"
          >
            {isMobile || !isCollapsed ? "Logout" : <Power />}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={headerClass}>
          <button
            onClick={handleSidebarToggle}
            className={headerToggleButtonClass}
          >
            <MenuIcon />
          </button>

          <h1 className="text-xl text-teal-50 font-semibold tracking-wide flex-1 ml-2">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-3">
            <Link to="/dashboard" className={headerHomeButtonClass}>
              <HomeIcon />
            </Link>
            <Notification />
            <Link to="/profile">
              <img
                src={resolveAvatar(avatar)}
                className="w-10 h-10 object-cover rounded-full"
              />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
