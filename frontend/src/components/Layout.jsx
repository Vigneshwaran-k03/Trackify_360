import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getToken, getRole, getUserName, clearAuth } from '../utils/authStorage';
import Notification from './Notification';
import male1 from '../assets/profile_image/male1.png';
import male2 from '../assets/profile_image/male2.png';
import male3 from '../assets/profile_image/male3.png';
import male4 from '../assets/profile_image/male4.png';
import male5 from '../assets/profile_image/male5.png';
import female1 from '../assets/profile_image/female1.png';
import female2 from '../assets/profile_image/female2.png';
import female3 from '../assets/profile_image/female3.png';
import female4 from '../assets/profile_image/female4.png';
import female5 from '../assets/profile_image/female5.png';

import { LayoutDashboard, UserPen, UserPlus, Target, BarChart3, ClipboardCheck, NotebookText, Menu as MenuIcon, Home as HomeIcon } from 'lucide-react';

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    const name = getUserName();
    setIsAuthenticated(!!token);
    setUserRole(role || '');
    setUserName(name || 'User');
    if (token) {
      fetch('http://localhost:3000/auth/profile', { headers: { Authorization: `Bearer ${token}` }})
        .then(async (r) => {
          if (r.status === 401) {
            clearAuth();
            navigate('/login');
            return null;
          }
          try { return await r.json(); } catch { return null; }
        })
        .then((data)=> { if (data) setAvatar(data?.avatar || 'default:male1'); })
        .catch(()=>{});
    }
    const onAvatarUpdated = (e) => {
      const next = e?.detail?.avatar;
      if (next) setAvatar(next);
    };
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
    };
    // initialize once
    handleResize();
    if (window.innerWidth >= 768) setShowSidebar(true);
    window.addEventListener('avatar_updated', onAvatarUpdated);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('avatar_updated', onAvatarUpdated);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    try { localStorage.removeItem('notif_popup_shown'); } catch {}
    setIsAuthenticated(false);
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
      case '/':
        return `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`;
      case '/kracreation':
        return 'Create KRA';
      case '/create_profile':
        return 'Create Profile';
      case '/profile':
        return 'Profile';
      case '/kpi_log':
        return 'KPI Log';
      case '/kra_log':
        return 'KRA Log';
      case '/requests':
        return 'Requests & Approvals';
      default:
        return 'Dashboard';
    }
  };

  const getNavigationItems = () => {
    const roleLower = (userRole || '').toLowerCase();
    
    // Admin navigation items
    if (roleLower === 'admin') {
      return [
        { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
        { path: '/create_profile', label: 'Create Profile', Icon: UserPlus },
        { path: '/profile', label: 'Profile', Icon: UserPen },
        { path: '/kracreation', label: 'Create KRA', Icon: Target },
        { path: '/kpi_log', label: 'KPI Log', Icon: BarChart3 },
        { path: '/kra_log', label: 'KRA Log', Icon: NotebookText },
        { path: '/requests', label: 'Requests & Approvals', Icon: ClipboardCheck }
      ];
    }
    
    // Manager navigation items
    if (roleLower === 'manager') {
      return [
        { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
        { path: '/create_profile', label: 'Create Employee', Icon: UserPlus },
        { path: '/profile', label: 'Profile', Icon: UserPen },
        { path: '/kracreation', label: 'Create KRA', Icon: Target },
        { path: '/create_kpi', label: 'Create & My KPI', Icon: BarChart3 },
        { path: '/kpi_log', label: 'KPI Log', Icon: BarChart3 },
        { path: '/kra_log', label: 'KRA Log', Icon: NotebookText },
        { path: '/requests', label: 'Requests & Approvals', Icon: ClipboardCheck }
      ];
    }
    
    // Default/Employee navigation items
    return [
      { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
      { path: '/profile', label: 'Profile', Icon: UserPen },
      { path: '/create_kpi', label: 'Create & My KPI', Icon: BarChart3 },
      { path: '/kpi_log', label: 'KPI Log', Icon: BarChart3 },
      { path: '/requests', label: 'Requests & Approvals', Icon: ClipboardCheck }
    ];

    return baseItems;
  };

  const resolveAvatar = (val) => {
    const map = { male1, male2, male3, male4, male5, female1, female2, female3, female4, female5 };
    if (!val || typeof val !== 'string') return male1;
    if (val.startsWith('default:')) {
      const key = val.split(':')[1];
      return map[key] || male1;
    }
    return val; // uploaded absolute URL
  };

  const roleLower = (userRole || '').toLowerCase();
  const isManager = roleLower === 'manager';

  const isEmployee = roleLower === 'employee';
  
// ==========================
// ROOT BACKGROUND (BODY)
// ==========================
const rootBgClass = isManager
  ? 'bg-gradient-to-br from-indigo-800 via-indigo-700 to-[#0D1226] font-semibold text-slate-100'
  : isEmployee
    ? 'bg-gradient-to-br from-purple-800 via-fuchsia-800 to-[#2C003E] font-semibold text-white'
    : 'bg-gradient-to-br from-teal-900 via-emerald-800 to-teal-950 font-semibold text-slate-50';


// ==========================
// SIDEBAR
// ==========================
const sidebarBaseClass = isManager
  ? 'w-64 shrink bg-[#0B0F29]/95 backdrop-blur-xl border-r border-indigo-500/40 text-slate-100 flex flex-col shadow-2xl shadow-indigo-900/60'
  : isEmployee
    ? 'w-64 shrink bg-[#2C003E]/95 backdrop-blur-xl border-r border-fuchsia-400/40 text-white flex flex-col shadow-2xl shadow-fuchsia-900/60'
    : 'w-64 shrink bg-teal-950/90 backdrop-blur-xl border-r border-teal-500/20 text-teal-50 flex flex-col shadow-2xl shadow-teal-900/50';


// ==========================
// NAV ITEM
// ==========================
const navItemClass = isManager
  ? 'flex items-center gap-3 py-2 px-4 rounded-xl bg-indigo-900/30 border border-transparent hover:bg-indigo-700/50 hover:border-indigo-300/50 transition-colors '
  : isEmployee
    ? 'flex items-center gap-3 py-2 px-4 rounded-xl bg-purple-900/30 border border-transparent hover:bg-fuchsia-700/50 hover:border-fuchsia-300/40 transition-colors'
    : 'flex items-center gap-3 py-2 px-4 rounded-xl bg-teal-900/20 border border-transparent hover:bg-teal-700/40 hover:border-teal-400/60 transition-colors';


// ==========================
// NAV ACTIVE ITEM
// ==========================
const navItemActiveClass = isManager
  ? 'bg-indigo-700/70 border-indigo-300 shadow-lg shadow-indigo-900/40'
  : isEmployee
    ? 'bg-fuchsia-600/80 border-fuchsia-300 shadow-lg shadow-fuchsia-900/60'
    : 'bg-teal-700/60 border-teal-400 shadow-lg shadow-teal-900/60';


// ==========================
// SIDEBAR FOOTER
// ==========================
const sidebarFooterClass = isManager
  ? 'p-4 border-t border-indigo-500/30 bg-[#0B0F29]/90'
  : isEmployee
    ? 'p-4 border-t border-fuchsia-400/30 bg-[#2C003E]/90'
    : 'p-4 border-t border-teal-500/20 bg-teal-950/70';


// ==========================
// LOGOUT BUTTON
// ==========================
const logoutButtonClass = isManager
  ? 'w-full text-white py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-900/40 hover:bg-red-500 transition-colors'
  : isEmployee
    ? 'w-full text-white py-2 px-4 rounded-xl bg-fuchsia-600 shadow-md shadow-fuchsia-900/40 hover:bg-red-500 transition-colors'
    : 'w-full text-white py-2 px-4 rounded-xl bg-teal-500 shadow-md shadow-teal-900/40 hover:bg-red-500 transition-colors';


// ==========================
// HEADER
// ==========================
const headerClass = isManager
  ? 'bg-[#0B0F29]/90 backdrop-blur-xl border-b border-indigo-400/40 shadow-lg shadow-indigo-900/60 p-4 flex-shrink-0'
  : isEmployee
    ? 'bg-[#2C003E]/90 backdrop-blur-xl border-b border-fuchsia-400/40 shadow-lg shadow-fuchsia-900/60 p-4 flex-shrink-0'
    : 'bg-teal-950/80 backdrop-blur-xl border-b border-teal-500/30 shadow-lg shadow-teal-950/60 p-4 flex-shrink-0';


// ==========================
// HEADER BUTTONS
// ==========================
const headerToggleButtonClass = isManager
  ? 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-indigo-300/60 bg-indigo-700/80 hover:bg-indigo-500 shadow-md shadow-indigo-900/50'
  : isEmployee
    ? 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-fuchsia-300/60 bg-purple-700/80 hover:bg-fuchsia-600 shadow-md shadow-fuchsia-900/50'
    : 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-teal-400/40 bg-teal-700/80 hover:bg-teal-500 shadow-md shadow-teal-900/50';

const headerHomeButtonClass = isManager
  ? 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-indigo-300/60 bg-indigo-800/80 hover:bg-indigo-600 shadow-md shadow-indigo-900/40'
  : isEmployee
    ? 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-fuchsia-300/60 bg-purple-800/90 hover:bg-fuchsia-600 shadow-md shadow-fuchsia-900/40'
    : 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-teal-400/40 bg-teal-800/90 hover:bg-teal-600 shadow-md shadow-teal-900/40';


// ==========================
// HEADER AVATAR
// ==========================
const headerAvatarClass = isManager
  ? 'inline-flex items-center justify-center w-10 h-10 rounded-full border border-indigo-300/70 bg-indigo-800/80 hover:bg-indigo-600/80 shadow-md shadow-indigo-900/60 overflow-visible'
  : isEmployee
    ? 'inline-flex items-center justify-center w-10 h-10 rounded-full border border-fuchsia-300/70 bg-purple-700/90 hover:bg-fuchsia-600/80 shadow-md shadow-fuchsia-900/60 overflow-visible'
    : 'inline-flex items-center justify-center w-10 h-10 rounded-full border border-teal-400/70 bg-teal-800/80 hover:bg-teal-600/80 shadow-md shadow-teal-900/60 overflow-visible';

  return (
    <div className={`flex h-screen w-screen ${rootBgClass}`}>
      {/* Sidebar */}
      {/* Mobile overlay */}
      {isMobile && showSidebar && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowSidebar(false)} />
      )}
      {(() => {
        const base = sidebarBaseClass;
        const mobile = `fixed z-50 left-0 top-0 h-full transform transition-transform duration-200 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`;
        const desktop = `${showSidebar ? 'block' : 'hidden'} relative`;
        const cls = `${isMobile ? mobile : desktop} ${base}`;
        return (
          <div className={cls}>
            <div className="p-6">
              <p className="text-4xl font-stretch-50% text-white font-bold">
                <img src="./src/assets/logo.png" className="w-50 h-20" alt="logo" />
              </p>
            </div>
            <nav className="flex-1 px-4 text-teal-50 overflow-y-auto">
              <ul className="space-y-2">
                {getNavigationItems().map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`${navItemClass} ${
                        location.pathname === item.path ? navItemActiveClass : ''
                      }`}
                      onClick={() => { if (isMobile) setShowSidebar(false); }}
                    >
                      <span className="text-white">
                        <item.Icon className="w-4 h-4" />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={sidebarFooterClass}>
              <button
                onClick={handleLogout}
                className={logoutButtonClass}
              >
                Logout
              </button>
            </div>
          </div>
        );
      })()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <header className={headerClass}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(prev => !prev)}
                className={headerToggleButtonClass}
                aria-label="Toggle sidebar"
                title="Toggle sidebar"
              >
                <MenuIcon className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-xl text-teal-50 font-semibold tracking-wide">{getPageTitle()}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-50/90">Welcome, {userName}</span>
              <Link
                to="/dashboard"
                title="Home"
                className={headerHomeButtonClass}
              >
                <HomeIcon className="w-7 h-7 text-white" />
              </Link>
              <Notification />
              <Link
                to="/profile"
                title="Profile"
                className={headerAvatarClass}
              >
                <img src={resolveAvatar(avatar)} alt="avatar" className="w-full h-full object-cover" />
              </Link>
            </div>
          </div>
        </header>
        <main id="main-scroll-container" className="flex-1 p-6 overflow-y-auto z-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
