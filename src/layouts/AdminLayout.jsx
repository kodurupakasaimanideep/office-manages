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
  X
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

  const handleLogout = () => {
    navigate('/');
  };

  // Search filtering
  const filteredNav = searchQuery.trim().length > 0
    ? navItems.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.keywords || []).some(k => k.includes(q))
        );
      })
    : [];

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.trim().length > 0);
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Logo" 
            className="sidebar-logo"
            style={{ filter: "none" }}
          />
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
                <li 
                  key={item.name} 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon className="nav-icon" size={18} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span style={{ 
                      backgroundColor: '#fee2e2', 
                      color: '#ef4444', 
                      padding: '2px 6px', 
                      borderRadius: '10px', 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold' 
                    }}>
                      {item.badge}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>KPS</div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Super Admin</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          {/* Search with dropdown results */}
          <div style={{ position: 'relative' }}>
            <div className="search-bar" style={{ border: showSearchResults ? '2px solid var(--primary)' : '2px solid transparent', transition: 'border 0.2s' }}>
              <Search className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search pages, records, events..." 
                value={searchQuery}
                onChange={handleSearchInput}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setShowSearchResults(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0 0.25rem' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '0.75rem', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 500, overflow: 'hidden', minWidth: '350px' }}>
                {filteredNav.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pages found for "{searchQuery}"</div>
                ) : (
                  filteredNav.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.path} onMouseDown={() => handleSearchSelect(item.path)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background 0.15s', borderBottom: '1px solid var(--border)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-light)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ background: 'var(--primary)', borderRadius: '0.4rem', padding: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={14} color="white" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{item.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.path}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
          
          <div className="header-actions">
            <button className="action-btn" onClick={() => setIsDarkMode(!isDarkMode)} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="action-btn">
              <Bell size={20} />
            </button>
            <button className="action-btn">
              <Settings size={20} />
            </button>
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
