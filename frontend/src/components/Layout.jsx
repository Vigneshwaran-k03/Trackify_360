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
  UserPlus,
  Target,
  BarChart3,
  Power,
  SquareUserRound,
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
            left-1/2 
            -translate-x-1/2
            left-full
            mb-2
            whitespace-nowrap
            z-[9999]
            px-2 py-1 rounded-lg text-xs
            bg-black/90 text-white shadow-xl
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-200
          "
        >
          {label}
          <div className="absolute left-1/2 -translate-x-1/2 right-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
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
        .catch(() => { });
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
    } catch (error) { }
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
        { path: "/profile", label: "Profile", Icon: SquareUserRound },
        { path: "/kracreation", label: "Create KRA", Icon: Target },
        { path: "/kpi_log", label: "KPI Log", Icon: ClipboardClock },
        { path: "/kra_log", label: "KRA Log", Icon: NotebookText },
        { path: "/requests", label: "Requests & Approvals", tooltipLabel: "R&A", Icon: ClipboardCheck },
      ];
    }

    if (roleLower === "manager") {
      return [
        { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
        { path: "/create_profile", label: "Create Employee", Icon: UserPlus },
        { path: "/profile", label: "Profile", Icon: SquareUserRound },
        { path: "/kracreation", label: "Create KRA", Icon: Target },
        { path: "/create_kpi", label: "Create & My KPI", Icon: BarChart3 },
        { path: "/kpi_log", label: "KPI Log", Icon: ClipboardClock },
        { path: "/kra_log", label: "KRA Log", Icon: NotebookText },
        { path: "/requests", label: "Requests & Approvals", tooltipLabel: "R&A", Icon: ClipboardCheck },
      ];
    }

    return [
      { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
      { path: "/profile", label: "Profile", Icon: SquareUserRound },
      { path: "/create_kpi", label: "Create & My KPI", Icon: BarChart3 },
      { path: "/kpi_log", label: "KPI Log", Icon: ClipboardClock },
      { path: "/requests", label: "Requests & Approvals", tooltipLabel: "R&A", Icon: ClipboardCheck },
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
    ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-teal-700 hover:bg-[linear-gradient(135deg,#005F77_0%,#002C33_100%)] shadow-md "
    : isEmployee
      ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-rose-800 hover:bg-[linear-gradient(135deg,#8A3A5A_0%,#3E1524_100%)]"
      : "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#C19A6B] hover:bg-[linear-gradient(135deg,#6A6248_0%,#2F2F2C_100%)]";

  const headerHomeButtonClass = isManager
    ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-teal-700 hover:bg-[linear-gradient(135deg,#005F77_0%,#002C33_100%)]"
    : isEmployee
      ? "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-rose-800 hover:bg-[linear-gradient(135deg,#8A3A5A_0%,#3E1524_100%)]"
      : "inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#C19A6B] hover:bg-[linear-gradient(135deg,#6A6248_0%,#2F2F2C_100%)]";

  const rootBgClass = isManager
    ? "bg-[linear-gradient(135deg,#005F77_0%,#002C33_100%)]"
    : isEmployee
      ? "bg-[linear-gradient(135deg,#8A3A5A_0%,#3E1524_100%)]"
      : "bg-[linear-gradient(135deg,#6A6248_0%,#2F2F2C_100%)]";

  const sidebarBaseClass = "bg-black/40 backdrop-blur-xl border border-black"


  const desktopSidebarWidth = isCollapsed ? "w-20" : "w-64";

  const headerClass =
    "p-3 bg-black/30 backdrop-blur-xl flex items-center gap-4";

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
          ${isMobile
            ? `fixed top-0 left-0 h-full w-64 z-[999] transform ${showSidebar ? "translate-x-0" : "-translate-x-full"
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
            className={`${isMobile || !isCollapsed ? "w-44 h-20" : "w-10 h-10"
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
                label={item.tooltipLabel || item.label}
                show={!isMobile && isCollapsed}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition ${isActive
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
