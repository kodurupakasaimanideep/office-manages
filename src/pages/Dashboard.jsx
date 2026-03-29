import React, { useState, useEffect, useRef } from 'react';
import { Upload, Star, StarOff, Eye, Trash2, X, FileText, AlertTriangle, FolderOpen, ArrowLeft, Search } from 'lucide-react';

/* ─── Time-theme LiveClock ───────────────────────────────────────────────── */
function getTimePalette(h) {
  if (h >= 5  && h < 7)  return { label: '🌅 Dawn',      gradA: '#ff7e5f', gradB: '#feb47b' };
  if (h >= 7  && h < 12) return { label: '☀️ Morning',   gradA: '#f9d423', gradB: '#f83600' };
  if (h >= 12 && h < 15) return { label: '🌤 Noon',      gradA: '#43c6ac', gradB: '#f8ffae' };
  if (h >= 15 && h < 18) return { label: '🌇 Afternoon', gradA: '#ff6a00', gradB: '#ee0979' };
  if (h >= 18 && h < 21) return { label: '🌆 Evening',   gradA: '#8e44ad', gradB: '#e74c3c' };
  if (h >= 21 && h < 24) return { label: '🌙 Night',     gradA: '#0f0c29', gradB: '#302b63' };
  return                        { label: '⭐ Midnight',   gradA: '#1a1a2e', gradB: '#16213e' };
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const h = now.getHours(), pal = getTimePalette(h);
  const hh = String(h % 12 || 12).padStart(2,'0'), mm = String(now.getMinutes()).padStart(2,'0'), ss = String(now.getSeconds()).padStart(2,'0');
  const ampm = h < 12 ? 'AM' : 'PM';
  const dateStr = now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  return (
    <div style={{ background:`linear-gradient(135deg,${pal.gradA},${pal.gradB})`, borderRadius:'1rem', padding:'1rem 1.5rem', color:'#fff', boxShadow:'0 8px 24px rgba(0,0,0,0.2)', minWidth:'230px', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(120deg,rgba(255,255,255,0.18) 0%,transparent 60%)',pointerEvents:'none' }}/>
      <div style={{ fontSize:'0.65rem',letterSpacing:'0.15em',fontWeight:700,opacity:0.9,marginBottom:'0.15rem' }}>{pal.label}</div>
      <div style={{ display:'flex',alignItems:'baseline',justifyContent:'center',gap:'2px',fontFamily:"'Courier New',monospace",fontWeight:800 }}>
        <span style={{ fontSize:'2.2rem' }}>{hh}:{mm}</span>
        <span style={{ fontSize:'1.3rem',opacity:0.75,animation:'blink 1s step-end infinite' }}>:{ss}</span>
        <span style={{ fontSize:'0.8rem',marginLeft:'0.4rem',opacity:0.9 }}>{ampm}</span>
      </div>
      <div style={{ fontSize:'0.68rem',marginTop:'0.2rem',opacity:0.85 }}>{dateStr}</div>
      <style>{`@keyframes blink{50%{opacity:0.25}}`}</style>
    </div>
  );
}

/* ─── Category Config ────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'pre-metric', name: 'Pre-Metric', fullName: 'Pre-Metric Application', icon: '🏫',
    color: '#2563eb',
    activeGrad: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    topBar: 'linear-gradient(90deg,#3b82f6,#93c5fd)',
    panelGrad: 'linear-gradient(135deg,#1e40af 0%,#2563eb 60%,#3b82f6 100%)',
    pastelBg: 'rgba(59,130,246,0.08)',
    pastelBorder: 'rgba(59,130,246,0.25)',
    iconBg: 'rgba(59,130,246,0.12)',
    badgeBg: 'rgba(59,130,246,0.1)',
    glow: 'rgba(59,130,246,0.3)',
    shadow: '0 8px 20px rgba(59,130,246,0.3)',
    emptyMsg: 'No Pre-Metric files uploaded yet',
  },
  {
    id: 'post-metric', name: 'Post-Metric', fullName: 'Post-Metric Application', icon: '🎓',
    color: '#16a34a',
    activeGrad: 'linear-gradient(135deg, #22c55e 0%, #86efac 100%)',
    topBar: 'linear-gradient(90deg,#22c55e,#86efac)',
    panelGrad: 'linear-gradient(135deg,#14532d 0%,#15803d 60%,#22c55e 100%)',
    pastelBg: 'rgba(34,197,94,0.08)',
    pastelBorder: 'rgba(34,197,94,0.25)',
    iconBg: 'rgba(34,197,94,0.12)',
    badgeBg: 'rgba(34,197,94,0.1)',
    glow: 'rgba(34,197,94,0.3)',
    shadow: '0 8px 20px rgba(34,197,94,0.3)',
    emptyMsg: 'No Post-Metric files uploaded yet',
  },
  {
    id: 'hostel', name: 'Hostel', fullName: 'Hostel Attachments', icon: '🏠',
    color: '#ea580c',
    activeGrad: 'linear-gradient(135deg, #f97316 0%, #fdba74 100%)',
    topBar: 'linear-gradient(90deg,#f97316,#fdba74)',
    panelGrad: 'linear-gradient(135deg,#7c2d12 0%,#c2410c 60%,#f97316 100%)',
    pastelBg: 'rgba(249,115,22,0.08)',
    pastelBorder: 'rgba(249,115,22,0.25)',
    iconBg: 'rgba(249,115,22,0.12)',
    badgeBg: 'rgba(249,115,22,0.1)',
    glow: 'rgba(249,115,22,0.3)',
    shadow: '0 8px 20px rgba(249,115,22,0.3)',
    emptyMsg: 'No Hostel files uploaded yet',
  },
  {
    id: 'artifact', name: 'Artifact', fullName: 'Artifact Attachments', icon: '🗿',
    color: '#7c3aed',
    activeGrad: 'linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)',
    topBar: 'linear-gradient(90deg,#8b5cf6,#c4b5fd)',
    panelGrad: 'linear-gradient(135deg,#4c1d95 0%,#6d28d9 60%,#8b5cf6 100%)',
    pastelBg: 'rgba(139,92,246,0.08)',
    pastelBorder: 'rgba(139,92,246,0.25)',
    iconBg: 'rgba(139,92,246,0.12)',
    badgeBg: 'rgba(139,92,246,0.1)',
    glow: 'rgba(139,92,246,0.3)',
    shadow: '0 8px 20px rgba(139,92,246,0.3)',
    emptyMsg: 'No Artifact files uploaded yet',
  },
  {
    id: 'random', name: 'Random', fullName: 'Random Files', icon: '📂',
    color: '#0d9488',
    activeGrad: 'linear-gradient(135deg, #14b8a6 0%, #5eead4 100%)',
    topBar: 'linear-gradient(90deg,#14b8a6,#5eead4)',
    panelGrad: 'linear-gradient(135deg,#134e4a 0%,#0f766e 60%,#14b8a6 100%)',
    pastelBg: 'rgba(20,184,166,0.08)',
    pastelBorder: 'rgba(20,184,166,0.25)',
    iconBg: 'rgba(20,184,166,0.12)',
    badgeBg: 'rgba(20,184,166,0.1)',
    glow: 'rgba(20,184,166,0.3)',
    shadow: '0 8px 20px rgba(20,184,166,0.3)',
    emptyMsg: 'No Random files uploaded yet',
  },
];

const MAX_FILE_SIZE_MB = 200;
const MAX_FILE_SIZE_B  = MAX_FILE_SIZE_MB * 1024 * 1024;
const STORAGE_KEY      = 'dashboard_files_v2';
const STATUS_LABELS    = ['All', 'Active', 'Archived', 'Pending'];

const STATUS_CFG = {
  Active:   { bg:'rgba(34,197,94,0.12)',   color:'#16a34a', border:'rgba(34,197,94,0.3)',   icon:'✅' },
  Archived: { bg:'rgba(99,102,241,0.12)',  color:'#6366f1', border:'rgba(99,102,241,0.3)',  icon:'📦' },
  Pending:  { bg:'rgba(234,179,8,0.12)',   color:'#ca8a04', border:'rgba(234,179,8,0.3)',   icon:'⏳' },
};

const fmtSize = b  => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;
const fmtDate = d  => new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const catById = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];

/* ─── Section Panel ──────────────────────────────────────────────────────── */
function SectionPanel({ topBar, border, glow, emoji, title, subtitle, badge, badgeBg, badgeColor, action, children }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: `1.5px solid ${border}`,
      borderRadius: '1.1rem',
      overflow: 'hidden',
      boxShadow: `0 4px 20px ${glow}`,
      marginBottom: '2rem',
    }}>
      <div style={{ background: topBar, padding:'1rem 1.4rem', display:'flex', alignItems:'center', gap:'0.75rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(120deg,rgba(255,255,255,0.2) 0%,transparent 55%)',pointerEvents:'none' }}/>
        <span style={{ fontSize:'1.25rem', zIndex:1 }}>{emoji}</span>
        <div style={{ flex:1, zIndex:1 }}>
          <div style={{ fontWeight:800, color:'#fff', fontSize:'0.95rem' }}>{title}</div>
          {subtitle && <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.8)', marginTop:'1px' }}>{subtitle}</div>}
        </div>
        {badge !== undefined && (
          <span style={{ background:badgeBg, color:badgeColor, borderRadius:'2rem', padding:'0.2rem 0.8rem', fontSize:'0.75rem', fontWeight:800, zIndex:1 }}>{badge}</span>
        )}
        {action && <div style={{ zIndex:1 }}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

/* ─── Action Button ──────────────────────────────────────────────────────── */
function ActionBtn({ onClick, color, title, children }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background:`${color}15`, border:`1px solid ${color}35`, borderRadius:'0.45rem', padding:'0.4rem 0.5rem', cursor:'pointer', color, display:'flex', alignItems:'center', transition:'background 0.18s' }}
      onMouseEnter={e => e.currentTarget.style.background=`${color}28`}
      onMouseLeave={e => e.currentTarget.style.background=`${color}15`}
    >{children}</button>
  );
}

/* ─── Category File View ─────────────────────────────────────────────────── */
function CategoryFileView({ cat, files, onBack, onView, onToggleImportant, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const catFiles = files.filter(f => {
    if (f.category !== cat.id) return false;
    if (filterStatus !== 'All' && f.status !== filterStatus) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const thCell = {
    padding:'0.75rem 1rem', fontSize:'0.72rem', fontWeight:700,
    color:'var(--text-muted)', textAlign:'left', textTransform:'uppercase', letterSpacing:'0.06em',
    borderBottom:'1px solid var(--border)', background:'var(--bg-light)',
  };
  const tdCell = {
    padding:'0.9rem 1rem', fontSize:'0.88rem',
    color:'var(--text-dark)', borderBottom:'1px solid var(--border)',
  };

  return (
    <div style={{ animation: 'fadeSlideIn 0.25s ease' }}>
      <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }`}</style>

      {/* Category Hero Banner */}
      <div style={{
        background: cat.panelGrad,
        borderRadius: '1.2rem',
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        boxShadow: cat.shadow,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(120deg,rgba(255,255,255,0.12) 0%,transparent 55%)',pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
          <button
            onClick={onBack}
            style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', borderRadius:'0.6rem', padding:'0.45rem 0.85rem', cursor:'pointer', fontSize:'0.82rem', fontWeight:700, transition:'background 0.15s', zIndex:1 }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
          >
            <ArrowLeft size={15}/> All Categories
          </button>
          <div style={{ flex:1, zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.3rem' }}>
              <span style={{ fontSize:'2rem' }}>{cat.icon}</span>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#fff', margin:0 }}>{cat.fullName}</h1>
            </div>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.88rem', margin:0 }}>
              {catFiles.length} file{catFiles.length !== 1 ? 's' : ''} in this category
            </p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'0.85rem', padding:'0.75rem 1.25rem', zIndex:1 }}>
            <span style={{ fontSize:'1.8rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{catFiles.length}</span>
            <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.8)', marginTop:'2px' }}>Files</span>
          </div>
        </div>
      </div>

      {/* Search + Status Filter Bar */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:'200px', position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${cat.name} files…`}
            style={{ width:'100%', padding:'0.6rem 0.75rem 0.6rem 2.2rem', border:`1.5px solid ${cat.pastelBorder}`, borderRadius:'0.6rem', background:'var(--card-bg)', color:'var(--text-dark)', fontSize:'0.88rem', outline:'none', boxSizing:'border-box' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding:'0.6rem 0.85rem', border:`1.5px solid ${cat.pastelBorder}`, borderRadius:'0.6rem', background:'var(--card-bg)', color:'var(--text-dark)', fontSize:'0.85rem', fontWeight:600, outline:'none', cursor:'pointer' }}
        >
          {STATUS_LABELS.map(s => <option key={s} value={s}>Status: {s}</option>)}
        </select>
      </div>

      {/* Files Table */}
      <div style={{
        background: 'var(--card-bg)',
        border: `1.5px solid ${cat.pastelBorder}`,
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: `0 4px 20px ${cat.glow}`,
      }}>
        {/* Table header strip */}
        <div style={{ background: cat.topBar, padding:'0.85rem 1.4rem', display:'flex', alignItems:'center', gap:'0.6rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(120deg,rgba(255,255,255,0.18) 0%,transparent 55%)',pointerEvents:'none' }}/>
          <span style={{ fontSize:'1.1rem', zIndex:1 }}>{cat.icon}</span>
          <span style={{ fontWeight:800, color:'#fff', fontSize:'0.9rem', zIndex:1 }}>{cat.name} Files</span>
          <span style={{ marginLeft:'auto', background:'rgba(255,255,255,0.2)', color:'#fff', borderRadius:'2rem', padding:'0.15rem 0.7rem', fontSize:'0.75rem', fontWeight:800, zIndex:1 }}>
            {catFiles.length} entries
          </span>
        </div>

        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['File Name', 'Details', 'Status', 'Size', 'Upload Date', 'Actions'].map(h => (
                <th key={h} style={{ ...thCell, color: cat.color }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {catFiles.length === 0 ? (
              <tr><td colSpan="6" style={{ padding:'3.5rem', textAlign:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem' }}>
                  <div style={{ fontSize:'3.5rem', filter:'grayscale(0.2)' }}>{cat.icon}</div>
                  <div style={{ fontWeight:700, color: cat.color, fontSize:'1rem' }}>{cat.emptyMsg}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>
                    {search || filterStatus !== 'All' ? 'Try clearing your filters' : 'Upload a PDF to get started'}
                  </div>
                </div>
              </td></tr>
            ) : catFiles.map((f, idx) => {
              const st = STATUS_CFG[f.status] || STATUS_CFG.Active;
              return (
                <tr key={f.id}
                  style={{ background: idx%2===0 ? 'transparent' : cat.pastelBg, transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background=`${cat.glow}25`}
                  onMouseLeave={e => e.currentTarget.style.background= idx%2===0 ? 'transparent' : cat.pastelBg}
                >
                  <td style={tdCell}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                      <div style={{ background:cat.iconBg, padding:'0.4rem', borderRadius:'0.5rem', border:`1px solid ${cat.pastelBorder}` }}><FileText size={15} color={cat.color}/></div>
                      <div>
                        <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                          {f.name}
                          {f.important && <Star size={11} fill="#f59e0b" color="#f59e0b"/>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdCell, maxWidth:'180px' }}>
                    <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.4 }} title={f.details}>
                      {f.details || <span style={{opacity:0.5}}>-</span>}
                    </div>
                  </td>
                  <td style={tdCell}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.25rem 0.7rem', borderRadius:'2rem', fontSize:'0.76rem', fontWeight:700, background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>{st.icon} {f.status}</span>
                  </td>
                  <td style={{ ...tdCell, color:'var(--text-muted)', fontSize:'0.82rem' }}>{fmtSize(f.size)}</td>
                  <td style={{ ...tdCell, color: cat.color, fontWeight:600 }}>📅 {fmtDate(f.uploadDate)}</td>
                  <td style={tdCell}>
                    <div style={{ display:'flex', gap:'0.4rem' }}>
                      <ActionBtn onClick={() => onView(f)} color={cat.color} title="View"><Eye size={14}/></ActionBtn>
                      <ActionBtn onClick={() => onToggleImportant(f.id)} color={f.important ? '#f59e0b' : '#6366f1'} title={f.important ? 'Unpin' : 'Pin'}>
                        <Star size={14} fill={f.important ? 'currentColor' : 'none'}/>
                      </ActionBtn>
                      <ActionBtn onClick={() => onDelete(f.id)} color="#dc2626" title="Delete"><Trash2 size={14}/></ActionBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [files, setFiles] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(files)); }, [files]);

  const [showUpload, setShowUpload]     = useState(false);
  const [uploadCat, setUploadCat]       = useState('pre-metric');
  const [uploadStatus, setUploadStatus] = useState('Active');
  const [uploadDetails, setUploadDetails] = useState('');
  const [dragOver, setDragOver]         = useState(false);
  const [uploadError, setUploadError]   = useState('');
  const fileInputRef = useRef();

  // null = overview, otherwise a category id
  const [activeCat, setActiveCat]     = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterImportant, setFilterImportant] = useState(false);
  const [previewFile, setPreviewFile]   = useState(null);

  const countByCat     = id => files.filter(f => f.category === id).length;
  const importantCount = files.filter(f => f.important).length;
  const totalFiles     = files.length;

  const processFiles = rawFiles => {
    setUploadError('');
    for (const file of rawFiles) {
      if (file.type !== 'application/pdf') { setUploadError('Only PDF files are allowed.'); continue; }
      if (file.size > MAX_FILE_SIZE_B) { setUploadError(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB.`); continue; }
      const reader = new FileReader();
      reader.onload = e => setFiles(prev => [...prev, {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name:file.name, category:uploadCat, status:uploadStatus, details:uploadDetails,
        size:file.size, uploadDate:new Date().toISOString(),
        important:false, dataUrl:e.target.result,
      }]);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop      = e => { e.preventDefault(); setDragOver(false); processFiles([...e.dataTransfer.files]); };
  const handleFileInput = e => processFiles([...e.target.files]);
  const toggleImportant = id => setFiles(prev => prev.map(f => f.id === id ? {...f, important: !f.important} : f));
  const deleteFile      = id => { if (window.confirm('Delete this file?')) setFiles(prev => prev.filter(f => f.id !== id)); };

  const importantFiles = files.filter(f => f.important);

  /* Shared table styles */
  const thCell = {
    padding:'0.75rem 1rem', fontSize:'0.72rem', fontWeight:700,
    color:'var(--text-muted)', textAlign:'left', textTransform:'uppercase', letterSpacing:'0.06em',
    borderBottom:'1px solid var(--border)', background:'var(--bg-light)',
  };
  const tdCell = {
    padding:'0.9rem 1rem', fontSize:'0.88rem',
    color:'var(--text-dark)', borderBottom:'1px solid var(--border)',
  };
  const selStyle = {
    padding:'0.4rem 0.65rem', borderRadius:'0.5rem', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', outline:'none',
    background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.35)', color:'#fff',
  };

  /* Active category object */
  const activeCatObj = activeCat ? catById(activeCat) : null;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-light)', padding:'0 0 2rem', fontFamily:"'Inter','Segoe UI',sans-serif" }}>

      {/* ── Banner ── */}
      <div style={{
        background:'linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)',
        borderRadius:'1.2rem', padding:'1.75rem 2rem', marginBottom:'2rem',
        boxShadow:'0 10px 28px rgba(37,99,235,0.35)',
        display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', flexWrap:'wrap',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(120deg,rgba(255,255,255,0.1) 0%,transparent 60%)',pointerEvents:'none' }}/>
        <div style={{ zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem' }}>
            <div style={{ background:'rgba(255,255,255,0.2)', padding:'0.45rem', borderRadius:'0.65rem' }}><FolderOpen size={22} color="#fff"/></div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:800, margin:0, color:'#fff' }}>Dashboard Overview</h1>
          </div>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.9rem', margin:0 }}>Management system for all stored office files</p>
          {/* Quick stats */}
          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', flexWrap:'wrap' }}>
            {[['📁', totalFiles, 'Total Files'], ['⭐', importantCount, 'Pinned'], ['📂', CATEGORIES.length, 'Categories']].map(([em, val, lbl]) => (
              <div key={lbl} style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'rgba(255,255,255,0.12)', padding:'0.35rem 0.75rem', borderRadius:'0.5rem' }}>
                <span>{em}</span>
                <span style={{ fontWeight:800, color:'#fff' }}>{val}</span>
                <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.82rem' }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap', zIndex:1 }}>
          <LiveClock/>
          <button
            onClick={() => { setShowUpload(true); setUploadError(''); setUploadDetails(''); }}
            style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.8rem 1.5rem', background:'#fff', color:'#2563eb', border:'none', borderRadius:'0.75rem', cursor:'pointer', fontWeight:700, fontSize:'0.95rem', boxShadow:'0 4px 12px rgba(0,0,0,0.1)', transition:'transform 0.15s', whiteSpace:'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform=''}
          ><Upload size={18}/> Upload PDF</button>
        </div>
      </div>

      {/* ── Category Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1.1rem', marginBottom:'2.25rem' }}>
        {CATEGORIES.map(cat => {
          const active = activeCat === cat.id;
          const count  = countByCat(cat.id);
          return (
            <div key={cat.id}
              onClick={() => setActiveCat(active ? null : cat.id)}
              style={{
                background: active ? cat.activeGrad : cat.pastelBg,
                border: `1.5px solid ${active ? 'transparent' : cat.pastelBorder}`,
                borderRadius:'1rem', padding:0, cursor:'pointer', overflow:'hidden',
                boxShadow: active ? cat.shadow : '0 1px 4px rgba(0,0,0,0.06)',
                transition:'all 0.22s cubic-bezier(0.4,0,0.2,1)', position:'relative',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=cat.shadow; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.06)'; } }}
            >
              {active && <div style={{ position:'absolute',inset:0,background:'linear-gradient(120deg,rgba(255,255,255,0.18) 0%,transparent 55%)',pointerEvents:'none' }}/>}
              {!active && <div style={{ height:'4px', background:cat.topBar }}/>}
              <div style={{ padding:'1.2rem 1.3rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.9rem' }}>
                  <div style={{
                    background: active ? 'rgba(255,255,255,0.22)' : cat.iconBg,
                    border: active ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${cat.pastelBorder}`,
                    borderRadius:'0.65rem', padding:'0.55rem', display:'flex',
                  }}>
                    <span style={{ fontSize:'1.4rem', lineHeight:1 }}>{cat.icon}</span>
                  </div>
                  <span style={{
                    background: active ? 'rgba(255,255,255,0.25)' : cat.badgeBg,
                    color: active ? '#fff' : cat.color,
                    border: active ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${cat.pastelBorder}`,
                    padding:'0.18rem 0.65rem', borderRadius:'2rem', fontSize:'0.82rem', fontWeight:800,
                  }}>{count}</span>
                </div>
                <div style={{ fontWeight:800, fontSize:'0.95rem', color: active ? '#fff' : 'var(--text-dark)', marginBottom:'0.2rem' }}>{cat.name}</div>
                <div style={{ fontSize:'0.75rem', color: active ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}>{cat.fullName}</div>
                <div style={{ marginTop:'0.85rem', paddingTop:'0.65rem', borderTop: active ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${cat.pastelBorder}`, display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', background: active ? '#fff' : cat.color, boxShadow:`0 0 5px ${cat.glow}` }}/>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, color: active ? 'rgba(255,255,255,0.85)' : cat.color }}>
                    {active ? 'Viewing files ↓' : count === 0 ? 'No files yet' : `${count} file${count !== 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Category File View (when a category is selected) ── */}
      {activeCatObj && (
        <CategoryFileView
          cat={activeCatObj}
          files={files}
          onBack={() => setActiveCat(null)}
          onView={setPreviewFile}
          onToggleImportant={toggleImportant}
          onDelete={deleteFile}
        />
      )}

      {/* ── Overview sections (when no category selected) ── */}
      {!activeCat && (<>

        {/* ── Pinned Files ── */}
        <SectionPanel
          topBar="linear-gradient(135deg,#f59e0b 0%,#d97706 100%)"
          border="rgba(245,158,11,0.3)"
          glow="rgba(245,158,11,0.1)"
          emoji="📌" title="Pinned Important Files" subtitle="Files you've starred for quick access"
          badge={`${importantFiles.length} pinned`} badgeBg="rgba(255,255,255,0.9)" badgeColor="#92400e"
        >
          <div style={{ height:'2px', background:'linear-gradient(90deg,#fbbf24,#f59e0b,#d97706)' }}/>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['File Name','Details','Category','Status','Upload Date','Actions'].map(h => (
                  <th key={h} style={{ ...thCell, color:'#92400e' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {importantFiles.length === 0 ? (
                <tr><td colSpan="6" style={{ padding:'3rem', textAlign:'center' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
                    <div style={{ fontSize:'2.5rem' }}>📌</div>
                    <div style={{ fontWeight:700, color:'#d97706', fontSize:'0.95rem' }}>No pinned files yet</div>
                    <div style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>Click ⭐ on any file to pin it here</div>
                  </div>
                </td></tr>
              ) : importantFiles.map((f, idx) => {
                const cat = catById(f.category), st = STATUS_CFG[f.status] || STATUS_CFG.Active;
                return (
                  <tr key={f.id}
                    style={{ background: idx%2===0 ? 'rgba(251,191,36,0.04)' : 'transparent', transition:'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(251,191,36,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background= idx%2===0 ? 'rgba(251,191,36,0.04)' : 'transparent'}
                  >
                    <td style={tdCell}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                        <div style={{ background:cat.iconBg, padding:'0.4rem', borderRadius:'0.5rem', border:`1px solid ${cat.pastelBorder}` }}><FileText size={15} color={cat.color}/></div>
                        <div>
                          <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:'0.88rem' }}>{f.name}</div>
                          <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{fmtSize(f.size)}</div>
                        </div>
                        <Star size={12} fill="#f59e0b" color="#f59e0b"/>
                      </div>
                    </td>
                    <td style={{ ...tdCell, maxWidth:'160px' }}>
                      <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.4 }} title={f.details}>
                        {f.details || <span style={{opacity:0.5}}>-</span>}
                      </div>
                    </td>
                    <td style={tdCell}>
                      <span
                        onClick={() => setActiveCat(cat.id)}
                        style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.25rem 0.7rem', borderRadius:'2rem', fontSize:'0.76rem', fontWeight:700, background:cat.pastelBg, color:cat.color, border:`1px solid ${cat.pastelBorder}`, cursor:'pointer' }}
                      >{cat.icon} {cat.name}</span>
                    </td>
                    <td style={tdCell}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.25rem 0.7rem', borderRadius:'2rem', fontSize:'0.76rem', fontWeight:700, background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>{st.icon} {f.status}</span>
                    </td>
                    <td style={{ ...tdCell, color:'#92400e', fontWeight:600 }}>📅 {fmtDate(f.uploadDate)}</td>
                    <td style={tdCell}>
                      <div style={{ display:'flex', gap:'0.4rem' }}>
                        <ActionBtn onClick={() => setPreviewFile(f)} color={cat.color} title="View"><Eye size={14}/></ActionBtn>
                        <ActionBtn onClick={() => toggleImportant(f.id)} color="#d97706" title="Unpin"><StarOff size={14}/></ActionBtn>
                        <ActionBtn onClick={() => deleteFile(f.id)} color="#dc2626" title="Delete"><Trash2 size={14}/></ActionBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionPanel>

        {/* ── All Files ── */}
        <SectionPanel
          topBar="linear-gradient(135deg,#4f46e5 0%,#2563eb 60%,#0891b2 100%)"
          border="rgba(79,70,229,0.2)"
          glow="rgba(79,70,229,0.08)"
          emoji="📁" title="All Recent Files" subtitle="Browse and manage all uploaded documents"
          badge={`${files.length} entries`} badgeBg="rgba(255,255,255,0.9)" badgeColor="#3730a3"
          action={
            <div style={{ display:'flex', gap:'0.45rem', alignItems:'center' }}>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
                {STATUS_LABELS.map(s => <option key={s} value={s} style={{ background:'#1e293b' }}>Status: {s}</option>)}
              </select>
              <button onClick={() => setFilterImportant(!filterImportant)} style={{ ...selStyle, display:'flex', alignItems:'center', gap:'0.3rem', background: filterImportant ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.15)', border: filterImportant ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.35)' }}>
                <Star size={11} fill={filterImportant ? '#fbbf24' : 'none'}/> Pinned
              </button>
            </div>
          }
        >
          <div style={{ height:'2px', background:'linear-gradient(90deg,#4f46e5,#2563eb,#0891b2)' }}/>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['File Name','Details','Category','Status','Date Added','Actions'].map(h => (
                  <th key={h} style={{ ...thCell, color:'#4338ca' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = files.filter(f => {
                  if (filterStatus !== 'All' && f.status !== filterStatus) return false;
                  if (filterImportant && !f.important) return false;
                  return true;
                });
                return filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding:'3rem', textAlign:'center' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
                      <div style={{ fontSize:'2.5rem' }}>📁</div>
                      <div style={{ fontWeight:700, color:'#4f46e5', fontSize:'0.95rem' }}>No files found</div>
                      <div style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>Upload a PDF or adjust your filters</div>
                    </div>
                  </td></tr>
                ) : filtered.map((f, idx) => {
                  const cat = catById(f.category), st = STATUS_CFG[f.status] || STATUS_CFG.Active;
                  return (
                    <tr key={f.id}
                      style={{ background: idx%2===0 ? 'transparent' : 'rgba(79,70,229,0.025)', transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(79,70,229,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background= idx%2===0 ? 'transparent' : 'rgba(79,70,229,0.025)'}
                    >
                      <td style={tdCell}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                          <div style={{ background:cat.iconBg, padding:'0.4rem', borderRadius:'0.5rem', border:`1px solid ${cat.pastelBorder}` }}><FileText size={15} color={cat.color}/></div>
                          <div>
                            <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                              {f.name}
                              {f.important && <Star size={11} fill="#f59e0b" color="#f59e0b"/>}
                            </div>
                            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{fmtSize(f.size)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdCell, maxWidth:'160px' }}>
                        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.4 }} title={f.details}>
                          {f.details || <span style={{opacity:0.5}}>-</span>}
                        </div>
                      </td>
                      <td style={tdCell}>
                        <span
                          onClick={() => setActiveCat(cat.id)}
                          style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.25rem 0.7rem', borderRadius:'2rem', fontSize:'0.76rem', fontWeight:700, background:cat.pastelBg, color:cat.color, border:`1px solid ${cat.pastelBorder}`, cursor:'pointer' }}
                          title={`View all ${cat.name} files`}
                        >{cat.icon} {cat.name}</span>
                      </td>
                      <td style={tdCell}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.25rem 0.7rem', borderRadius:'2rem', fontSize:'0.76rem', fontWeight:700, background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>{st.icon} {f.status}</span>
                      </td>
                      <td style={{ ...tdCell, color:'#4338ca', fontWeight:600 }}>📅 {fmtDate(f.uploadDate)}</td>
                      <td style={tdCell}>
                        <div style={{ display:'flex', gap:'0.4rem' }}>
                          <ActionBtn onClick={() => setPreviewFile(f)} color={cat.color} title="View"><Eye size={14}/></ActionBtn>
                          <ActionBtn onClick={() => toggleImportant(f.id)} color={f.important ? '#f59e0b' : '#6366f1'} title={f.important ? 'Unpin' : 'Pin'}>
                            <Star size={14} fill={f.important ? 'currentColor' : 'none'}/>
                          </ActionBtn>
                          <ActionBtn onClick={() => deleteFile(f.id)} color="#dc2626" title="Delete"><Trash2 size={14}/></ActionBtn>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </SectionPanel>

      </>)}

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'var(--card-bg)', borderRadius:'1.25rem', width:'100%', maxWidth:500, boxShadow:'0 25px 50px rgba(0,0,0,0.25)', overflow:'hidden', border:'1px solid var(--border)' }}>
            <div style={{ padding:'1.25rem 1.5rem', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <Upload size={18} color="#fff"/>
                <h2 style={{ color:'#fff', margin:0, fontSize:'1.05rem', fontWeight:800 }}>Upload PDF File</h2>
              </div>
              <button onClick={() => setShowUpload(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16}/></button>
            </div>
            <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div>
                <label style={{ display:'block', fontSize:'0.78rem', fontWeight:800, color:'#2563eb', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>Category</label>
                <select value={uploadCat} onChange={e => setUploadCat(e.target.value)} style={{ width:'100%', padding:'0.65rem', border:'1.5px solid var(--border)', borderRadius:'0.55rem', background:'var(--card-bg)', color:'var(--text-dark)', fontSize:'0.9rem', fontWeight:600, outline:'none' }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.fullName}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'0.78rem', fontWeight:800, color:'#2563eb', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>Status</label>
                <select value={uploadStatus} onChange={e => setUploadStatus(e.target.value)} style={{ width:'100%', padding:'0.65rem', border:'1.5px solid var(--border)', borderRadius:'0.55rem', background:'var(--card-bg)', color:'var(--text-dark)', fontSize:'0.9rem', fontWeight:600, outline:'none' }}>
                  <option value="Active">✅ Active</option>
                  <option value="Archived">📦 Archived</option>
                  <option value="Pending">⏳ Pending</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'0.78rem', fontWeight:800, color:'#2563eb', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>Details / Description</label>
                <input type="text" value={uploadDetails} onChange={e => setUploadDetails(e.target.value)} placeholder="e.g. Student marks memo for sem 1" style={{ width:'100%', padding:'0.65rem', border:'1.5px solid var(--border)', borderRadius:'0.55rem', background:'var(--card-bg)', color:'var(--text-dark)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }}/>
              </div>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{ border:`2px dashed ${dragOver ? '#2563eb' : 'var(--border)'}`, borderRadius:'0.9rem', padding:'2.5rem 1.5rem', textAlign:'center', cursor:'pointer', background: dragOver ? 'rgba(37,99,235,0.06)' : 'var(--bg-light)', transition:'all 0.2s' }}
              >
                <Upload size={32} color={dragOver ? '#2563eb' : 'var(--text-muted)'} style={{ margin:'0 auto 0.65rem' }}/>
                <div style={{ fontWeight:700, color:'var(--text-dark)', marginBottom:'0.25rem' }}>Drop PDF files here or click to browse</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Only PDF files · Max {MAX_FILE_SIZE_MB} MB</div>
              </div>
              <input ref={fileInputRef} type="file" accept="application/pdf" multiple onChange={handleFileInput} style={{ display:'none' }}/>
              {uploadError && (
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.7rem', background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:'0.55rem', color:'#dc2626', fontSize:'0.82rem', fontWeight:600 }}>
                  <AlertTriangle size={14}/> {uploadError}
                </div>
              )}
              <div style={{ display:'flex', gap:'0.65rem', justifyContent:'flex-end' }}>
                <button onClick={() => setShowUpload(false)} style={{ padding:'0.65rem 1.3rem', background:'var(--bg-light)', border:'1px solid var(--border)', borderRadius:'0.55rem', cursor:'pointer', color:'var(--text-dark)', fontWeight:600, fontSize:'0.88rem' }}>Cancel</button>
                <button onClick={() => setShowUpload(false)} style={{ padding:'0.65rem 1.5rem', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', border:'none', borderRadius:'0.55rem', cursor:'pointer', color:'#fff', fontWeight:800, fontSize:'0.88rem', boxShadow:'0 4px 12px rgba(37,99,235,0.4)' }}>Done ✓</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PDF Preview ── */}
      {previewFile && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'var(--card-bg)', width:'100%', maxWidth:900, height:'90vh', borderRadius:'1rem', overflow:'hidden', display:'flex', flexDirection:'column', border:'1px solid var(--border)' }}>
            <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <FileText size={16} color="#2563eb"/>
                <span style={{ fontWeight:700, color:'var(--text-dark)' }}>{previewFile.name}</span>
                <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>({fmtSize(previewFile.size)})</span>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                <a href={previewFile.dataUrl} download={previewFile.name} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.4rem 0.85rem', background:'#2563eb', color:'#fff', borderRadius:'0.4rem', fontSize:'0.8rem', fontWeight:700, textDecoration:'none' }}>⬇️ Download</a>
                <button onClick={() => setPreviewFile(null)} style={{ background:'var(--bg-light)', border:'1px solid var(--border)', borderRadius:'50%', width:32, height:32, cursor:'pointer', color:'var(--text-dark)', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={15}/></button>
              </div>
            </div>
            <iframe src={previewFile.dataUrl} title={previewFile.name} style={{ flex:1, border:'none', width:'100%' }}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
