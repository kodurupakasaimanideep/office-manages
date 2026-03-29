import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Sparkles, FileText, CheckCircle, Clock } from 'lucide-react';

const THEME = {
  primary:  '#6366f1',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  light:    '#eef2ff',
  border:   '#c7d2fe',
  accent:   '#818cf8',
  glow:     'rgba(99,102,241,0.2)'
};

const STATUS_MAP = {
  'Completed': { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  'Pending':   { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' }
};

const Schemes = () => {
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('schemes') || '[]'));
  useEffect(() => { localStorage.setItem('schemes', JSON.stringify(records)); }, [records]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', headOfSection: '', status: 'Pending', progress: 0 });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.id) { setRecords(records.map(r => r.id === form.id ? form : r)); } 
    else { setRecords([...records, { ...form, id: Date.now().toString() }]); }
    setIsModalOpen(false);
  };

  const deleteScheme = (id) => { if (window.confirm('Delete?')) setRecords(records.filter(r => r.id !== id)); };

  const inputStyle = { width: '100%', padding: '0.85rem', border: `2px solid ${THEME.border}`, borderRadius: '1rem', background: 'white', color: '#1e1b4b', outline: 'none', fontWeight: 600 };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ 
        background: THEME.gradient, 
        padding: '2rem 3rem', 
        borderRadius: '2rem', 
        color: 'white', 
        marginBottom: '2.5rem',
        boxShadow: `0 15px 35px ${THEME.glow}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FileText size={32} color="#c7d2fe" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Government Schemes</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500, maxWidth: '600px' }}>Tracking scheme disbursements and project progress across all departments.</p>
        </div>
        <div style={{ position: 'absolute', right: '-2rem', bottom: '-4rem', opacity: 0.1 }}>
          <Sparkles size={300} fill="white" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {records.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', background:'white', borderRadius:'2rem', border:`2.2px dashed ${THEME.border}`, gridColumn: '1/-1' }}>
            <h3 style={{ color: THEME.primary, fontWeight: 800 }}>No Active Schemes</h3>
            <p style={{ color: 'var(--text-muted)' }}>Click the button below to add your first government or internal scheme.</p>
            <button onClick={() => { setForm({ id: null, name: '', headOfSection: '', status: 'Pending', progress: 0 }); setIsModalOpen(true); }} style={{ padding: '0.8rem 2rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 900, cursor: 'pointer', marginTop: '1rem' }}>+ Create Scheme</button>
          </div>
        ) : (
          records.map((r, i) => (
            <div key={r.id} className="glass-card" style={{ 
              padding: '2rem', 
              borderRadius: '2rem', 
              border: `2px solid ${THEME.border}`, 
              boxShadow: `0 10px 30px ${THEME.glow}`,
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ 
                  padding: '0.4rem 1rem', 
                  borderRadius: '2rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 900, 
                  background: STATUS_MAP[r.status].bg, 
                  color: STATUS_MAP[r.status].color, 
                  border: `2px solid ${STATUS_MAP[r.status].border}`,
                  textTransform: 'uppercase'
                }}>{r.status}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setForm(r); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={16} /></button>
                  <button onClick={() => deleteScheme(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b' }}>{r.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 700, margin: '0 0 1.5rem 0' }}>{r.headOfSection}</p>
              
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 900, color: '#4338ca' }}>
                  <span>SCHEME PROGRESS</span>
                  <span>{r.progress}%</span>
                </div>
                <div style={{ height: '12px', background: '#eef2ff', borderRadius: '6px', overflow: 'hidden', border: '1px solid #c7d2fe' }}>
                  <div style={{ width: `${r.progress}%`, height: '100%', background: THEME.gradient, borderRadius: '6px', transition: 'width 0.8s' }} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {records.length > 0 && (
        <button onClick={() => { setForm({ id: null, name: '', headOfSection: '', status: 'Pending', progress: 0 }); setIsModalOpen(true); }} style={{ 
          position: 'fixed', bottom: '2rem', right: '2rem', 
          padding: '1.25rem 2.5rem', 
          background: THEME.gradient, 
          color: 'white', 
          border: 'none', 
          borderRadius: '2rem', 
          fontWeight: 900, 
          boxShadow: `0 10px 25px ${THEME.glow}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 100
        }}>
          <Plus size={24}/> New Scheme
        </button>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.4)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', width: '500px', background: 'white', border: `3px solid ${THEME.border}` }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 900, color: THEME.primary, display: 'flex', alignItems: 'center', gap: '0.6rem' }}><FileText size={28}/> {form.id ? 'Edit' : 'New'} Scheme Entry</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input placeholder="Scheme Name (e.g. Welfare Project)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
              <input placeholder="Head of Section" value={form.headOfSection} onChange={e => setForm({ ...form, headOfSection: e.target.value })} style={inputStyle} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: THEME.primary, marginBottom: '0.6rem' }}>PROGRESS PERCENTAGE</label>
                  <input type="number" placeholder="0-100" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} style={inputStyle} required min="0" max="100" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: THEME.primary, marginBottom: '0.6rem' }}>CURRENT STATUS</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                    <option value="Pending">⌛ Pending</option>
                    <option value="Completed">✅ Completed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 2, padding: '1.1rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '1.5rem', cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem' }}>Save Scheme</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1.1rem', border: `2.5px solid ${THEME.border}`, borderRadius: '1.5rem', cursor: 'pointer', fontWeight: 800, color: THEME.primary }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
