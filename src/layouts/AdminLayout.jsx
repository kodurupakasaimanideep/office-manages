import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarMinus, 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap,
  LogOut,
  Search,
  Moon,
  Sun,
  Bell,
  Settings,
  History,
  Landmark,
  FileSpreadsheet,
  PartyPopper,
  X,
  FolderOpen
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, keywords: ['home', 'overview', 'dash'] },
  { name: 'Pending Records', path: '/pending-records', icon: History, badge: 12, keywords: ['pending', 'records', 'work', 'staff'] },
  { name: 'Leaves Record', path: '/leaves-record', icon: CalendarMinus, keywords: ['leave', 'absent', 'casual'] },
  { name: 'Section Management', path: '/section-management', icon: Users, keywords: ['section', 'files', 'upload', 'department'] },
  { name: 'Schemes', path: '/schemes', icon: FileText, keywords: ['scheme', 'program', 'government'] },
  { name: 'Calendar', path: '/calendar', icon: Calendar, keywords: ['calendar', 'holiday', 'dates', 'month'] },
  { name: 'Scholarship Details', path: '/scholarships', icon: GraduationCap, keywords: ['scholarship', 'obc', 'bc', 'college', 'student'] },
  { name: 'Rice-indent', path: '/rice-indent', icon: FileSpreadsheet, keywords: ['rice', 'indent', 'hostel', 'ration'] },
  { name: 'Bank Confirmations', path: '/bank-confirmations', icon: Landmark, keywords: ['bank', 'confirmation', 'payment'] },
  { name: 'Jayantis', path: '/jayantis', icon: PartyPopper, keywords: ['jayanti', 'festival', 'event', 'celebration', 'ganesh', 'ambedkar'] },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleLogout = () => navigate('/');

  const filteredNav = searchQuery.trim().length > 0
    ? navItems.filter(item => {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || (item.keywords || []).some(k => k.includes(q));
      })
    : [];

  const handleSearchSelectResult = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Logo" className="sidebar-logo" />
          <div>
            <div className="sidebar-title">KPS Office</div>
            <div className="sidebar-subtitle">made by saimanideep</div>
          </div>
        </div>
        <div className="nav-section">
          <div className="nav-label">MAIN MENU</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => navigate(item.path)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon className="nav-icon" size={18} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}><LogOut size={16} /> Log Out</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div style={{ position: 'relative' }}>
            <div className="search-bar">
              <Search className="search-icon" />
              <input 
                type="text" className="search-input" placeholder="Search pages..." 
                value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(e.target.value.trim().length > 0); }}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              />
            </div>
            {showSearchResults && (
              <div className="search-dropdown">
                {filteredNav.map(item => (
                  <div key={item.path} onMouseDown={() => handleSearchSelectResult(item.path)} className="search-result-item">
                    <item.icon size={14} /> <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button className="action-btn"><Bell size={20} /></button>
          </div>
        </header>
        <div className="content-area">
          <Outlet context={{ searchQuery }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
