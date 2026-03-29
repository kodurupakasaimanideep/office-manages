import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Upload, Star, Eye, Trash2, FileText, FolderOpen, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'pre-metric', fullName: 'Pre-Metric Scholarship', shortName: 'Pre-Metric', icon: '🎓', color: '#2563eb' },
  { id: 'post-metric', fullName: 'Post-Metric Scholarship', shortName: 'Post-Metric', icon: '📜', color: '#7c3aed' },
  { id: 'hostel', fullName: 'Hostel Management', shortName: 'Hostel', icon: '🏠', color: '#059669' },
  { id: 'artifact', fullName: 'Artifacts', shortName: 'Artifacts', icon: '🏛️', color: '#db2777' },
  { id: 'random', fullName: 'Random Artifacts', shortName: 'Random', icon: '📂', color: '#6366f1' },
];

const Dashboard = () => {
  const files = useQuery(api.dashboard.getFiles) || [];
  const addFile = useMutation(api.dashboard.addFile);
  const updateFile = useMutation(api.dashboard.updateFile);
  const removeFile = useMutation(api.dashboard.deleteFile);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadCat, setUploadCat] = useState('pre-metric');
  const [activeCat, setActiveCat] = useState(null);

  const toggleImportant = async (id, current) => {
    await updateFile({ id, important: !current });
  };

  const deleteFile = async (id) => {
    if (window.confirm('Delete this file?')) {
      await removeFile({ id });
    }
  };

  const handleUpload = (e) => {
    const rawFiles = [...e.target.files];
    for (const file of rawFiles) {
      if (file.type !== 'application/pdf') continue;
      const reader = new FileReader();
      reader.onload = async (re) => {
        await addFile({
          name: file.name,
          category: uploadCat,
          uploadDate: new Date().toISOString(),
          size: file.size,
          important: false,
          dataUrl: re.target.result,
          status: 'Completed'
        });
      };
      reader.readAsDataURL(file);
    }
    setShowUpload(false);
  };

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredFiles = activeCat ? files.filter(f => f.category === activeCat) : files;

  return (
    <div style={{ padding: '0' }}>
      {/* Premium Glass Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
        borderRadius: '2rem', padding: '2.5rem 3rem', marginBottom: '2.5rem', color: 'white',
        boxShadow: '0 15px 35px rgba(37, 99, 235, 0.3)', position: 'relative', overflow: 'hidden',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Sparkles size={32} color="#93c5fd" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>KPS Cloud Dashboard</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>Securely manage departmental files with real-time cloud sync.</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
            <button onClick={() => setShowUpload(true)} style={{ padding: '0.9rem 2rem', background: 'white', color: '#2563eb', border: 'none', borderRadius: '1.25rem', fontWeight: 900, cursor: 'pointer' }}>+ Upload PDF</button>
          </div>
        </div>

        {/* Beautiful Real-time Clock */}
        <div style={{ 
          position: 'relative', zIndex: 1, textAlign: 'right', 
          background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', 
          padding: '1.5rem 2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '1px', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.25rem' }}>
            {time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div style={{ position: 'absolute', right: '-2rem', top: '-1rem', opacity: 0.1 }}>
            <FolderOpen size={300} fill="white" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {CATEGORIES.map(c => (
          <div key={c.id} onClick={() => setActiveCat(c.id)} className="glass-card" style={{ 
            padding: '1.75rem', borderRadius: '1.5rem', border: `2.5px solid ${activeCat === c.id ? c.color : 'var(--border)'}`, 
            cursor: 'pointer', textAlign: 'center', background: activeCat === c.id ? '#f0f7ff' : 'white'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{c.icon}</div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1e293b' }}>{c.shortName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{files.filter(f => f.category === c.id).length} Saved</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--border)', background: 'white' }}>
        <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontWeight: 900 }}>{activeCat ? 'Categorized Files' : 'All Departmental Files'}</h3>
          {activeCat && <button onClick={() => setActiveCat(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 800 }}>Show All</button>}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f1f5f9' }}>{['Document Name', 'Upload Date', 'Size', 'Actions'].map(h => <th key={h} style={{ padding: '1.1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredFiles.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No cloud files found.</td></tr> :
              filteredFiles.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : '#f8fbfc' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800 }}>{f.name}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>{new Date(f.uploadDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>{(f.size / (1024 * 1024)).toFixed(2)} MB</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => toggleImportant(f._id, f.important)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: f.important ? '#f59e0b' : '#cbd5e1' }}><Star size={20} fill={f.important ? 'currentColor' : 'none'} /></button>
                      <button onClick={() => deleteFile(f._id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', width: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>Cloud Upload</h2>
            <select value={uploadCat} onChange={e => setUploadCat(e.target.value)} style={{ width: '100%', padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', marginBottom: '1rem' }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
            </select>
            <input type="file" accept=".pdf" onChange={handleUpload} style={{ width: '100%', padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '1rem', marginBottom: '1.5rem' }} />
            <button onClick={() => setShowUpload(false)} style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '1rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
