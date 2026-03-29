import React, { useState, useEffect, useRef } from 'react';
import { Upload, Star, StarOff, Eye, Trash2, X, FileText, AlertTriangle, FolderOpen, ArrowLeft, Search, Sparkles, TrendingUp, Calendar } from 'lucide-react';

/* ─── Standard Utilities & Statics ──────────────────────────── */
const MAX_FILE_SIZE_MB = 200;
const MAX_FILE_SIZE_B  = MAX_FILE_SIZE_MB * 1024 * 1024;

const CATEGORIES = [
  { id: 'pre-metric', fullName: 'Pre-Metric Scholarship', shortName: 'Pre-Metric', icon: '🎓', color: '#2563eb', gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
  { id: 'post-metric', fullName: 'Post-Metric Scholarship', shortName: 'Post-Metric', icon: '📜', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
  { id: 'hostel', fullName: 'Hostel Management', shortName: 'Hostel', icon: '🏠', color: '#059669', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
  { id: 'artifact', fullName: 'Artifacts', shortName: 'Artifacts', icon: '🏛️', color: '#db2777', gradient: 'linear-gradient(135deg, #db2777 0%, #c026d3 100%)' },
  { id: 'random', fullName: 'Random Artifacts', shortName: 'Random', icon: '📂', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
];

const catById = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];

const Dashboard = () => {
  const [files, setFiles] = useState(() => JSON.parse(localStorage.getItem('kps_dashboard_files') || '[]'));
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCat, setUploadCat] = useState('pre-metric');
  const [activeCat, setActiveCat] = useState(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    localStorage.setItem('kps_dashboard_files', JSON.stringify(files));
  }, [files]);

  const toggleImportant = (id) => {
    setFiles(files.map(f => f.id === id ? { ...f, important: !f.important } : f));
  };

  const deleteFile = (id) => {
    if (window.confirm('Delete this file?')) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  const handleUpload = (e) => {
    const rawFiles = [...e.target.files];
    setUploadError('');
    for (const file of rawFiles) {
      if (file.type !== 'application/pdf') { setUploadError('Only PDF allowed.'); continue; }
      if (file.size > MAX_FILE_SIZE_B) { setUploadError(`"${file.name}" is too big.`); continue; }
      const reader = new FileReader();
      reader.onload = (re) => {
        setFiles(prev => [...prev, {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          name: file.name,
          category: uploadCat,
          uploadDate: new Date().toISOString(),
          size: file.size,
          important: false,
          dataUrl: re.target.result,
          status: 'Completed'
        }]);
      };
      reader.readAsDataURL(file);
    }
    setShowUpload(false);
  };

  const activeCatObj = activeCat ? catById(activeCat) : null;
  const filteredFiles = activeCat ? files.filter(f => f.category === activeCat) : files;

  return (
    <div style={{ padding: '0' }}>
      {/* Premium Glass Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
        borderRadius: '2rem', 
        padding: '2.5rem 3rem', 
        marginBottom: '2.5rem', 
        color: 'white',
        boxShadow: '0 15px 35px rgba(37, 99, 235, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Sparkles size={32} color="#93c5fd" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>KPS Cloud Dashboard</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500, maxWidth: '600px' }}>Securely manage departmental files, scholarly records, and administrative artifacts.</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
            <button onClick={() => setShowUpload(true)} style={{ 
              padding: '0.9rem 2rem', 
              background: 'white', 
              color: '#2563eb', 
              border: 'none', 
              borderRadius: '1.25rem', 
              fontWeight: 900, 
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >+ Upload New PDF</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{files.length}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>FILES STORED</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', height: '2.5rem' }} />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{files.filter(f => f.important).length}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>PINNED FILES</div>
                </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '-2rem', top: '-1rem', opacity: 0.1 }}>
          <FolderOpen size={300} fill="white" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {CATEGORIES.map(c => (
          <div key={c.id} onClick={() => setActiveCat(c.id)} className="glass-card" style={{ 
            padding: '1.75rem', 
            borderRadius: '1.5rem', 
            border: `2.5px solid ${activeCat === c.id ? c.color : 'var(--border)'}`, 
            cursor: 'pointer', 
            textAlign: 'center',
            background: activeCat === c.id ? '#f0f7ff' : 'white',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{c.icon}</div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1e293b' }}>{c.shortName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.3rem' }}>{files.filter(f => f.category === c.id).length} Documents</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--border)', background: 'white' }}>
        <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={22} color={activeCatObj ? activeCatObj.color : '#64748b'} />
            <h3 style={{ margin: 0, fontWeight: 900, color: '#1e293b' }}>{activeCatObj ? activeCatObj.fullName : 'All Departmental Files'}</h3>
          </div>
          {activeCat && <button onClick={() => setActiveCat(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>Show All Records</button>}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                {['Document Name', 'Upload Date', 'Size', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1.1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No PDF documents matched your criteria.</td></tr> :
                filteredFiles.map((f, i) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : '#f8fbfc' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: catById(f.category).lightScale || '#eff6ff', padding: '0.5rem', borderRadius: '0.75rem', color: catById(f.category).color }}>
                                <FileText size={18} />
                            </div>
                            <span style={{ fontWeight: 800, color: '#1e293b' }}>{f.name}</span>
                        </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{new Date(f.uploadDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{(f.size / (1024 * 1024)).toFixed(2)} MB</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => toggleImportant(f.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: f.important ? '#f59e0b' : '#cbd5e1' }}><Star size={20} fill={f.important ? 'currentColor' : 'none'} /></button>
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3b82f6' }}><Eye size={20} /></button>
                        <button onClick={() => deleteFile(f.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', width: '480px', border: '3px solid var(--border)' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Upload size={28} color="#2563eb" /> Upload Document</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Target Category</label>
              <select value={uploadCat} onChange={e => setUploadCat(e.target.value)} style={{ width: '100%', padding: '0.85rem', background: '#f8fafc', border: '2.2px solid #e2e8f0', borderRadius: '1rem', outline: 'none', fontWeight: 700 }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
              </select>
            </div>
            <div style={{ padding: '2.5rem', border: '2.5px dashed #cbd5e1', borderRadius: '1.5rem', textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                <Upload size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
                <div style={{ fontWeight: 800, color: '#475569' }}>Drop PDF here or click to browse</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Maximum size 200MB</div>
                <input type="file" accept=".pdf" onChange={handleUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>
            {uploadError && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>⚠️ {uploadError}</div>}
            <button onClick={() => setShowUpload(false)} style={{ width: '100%', padding: '1rem', border: '2.2px solid #e2e8f0', borderRadius: '1.25rem', cursor: 'pointer', fontWeight: 800, color: '#64748b' }}>Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
