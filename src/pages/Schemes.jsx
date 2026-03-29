import React, { useState, useEffect } from 'react';
import { FileText, Edit, Trash2 } from 'lucide-react';

const STATUS_MAP = {
  'Completed': { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  'Pending':   { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' }
};

const Schemes = () => {
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('schemes') || '[]'));
  useEffect(() => localStorage.setItem('schemes', JSON.stringify(records)), [records]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', headOfSection: '', status: 'Pending', progress: 0 });

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { ...form, progress: Number(form.progress) };
    if (form.id) { 
      setRecords(records.map(r => r.id === form.id ? { ...payload } : r));
    } else { 
      setRecords([...records, { ...payload, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const deleteScheme = (id) => { if (window.confirm('Delete?')) setRecords(records.filter(r => r.id !== id)); };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '2rem 3rem', borderRadius: '2rem', 
        color: 'white', marginBottom: '2.5rem', boxShadow: `0 15px 35px rgba(99,102,241,0.2)`
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Government Schemes</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>Secure offline monitoring of welfare programs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {records.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', background:'white', borderRadius:'2rem', border:`2.2px dashed #c7d2fe`, gridColumn: '1/-1' }}>
            <h3 style={{ color: '#6366f1', fontWeight: 800 }}>No Schemes Discovered</h3>
            <button onClick={() => { setForm({ id: null, name: '', headOfSection: '', status: 'Pending', progress: 0 }); setIsModalOpen(true); }} style={{ padding: '0.8rem 2rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 900, cursor: 'pointer', marginTop: '1rem' }}>+ Create Local Scheme</button>
          </div>
        ) : (
          records.map((r, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', borderRadius: '2rem', border: `2px solid #c7d2fe`, background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 900, background: STATUS_MAP[r.status].bg, color: STATUS_MAP[r.status].color, border: `2px solid ${STATUS_MAP[r.status].border}`, textTransform: 'uppercase' }}>{r.status}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setForm({ ...r }); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={16} /></button>
                  <button onClick={() => deleteScheme(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>{r.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 700, margin: '0 0 1.5rem 0' }}>{r.headOfSection}</p>
              <div style={{ height: '12px', background: '#eef2ff', borderRadius: '6px', overflow: 'hidden', border: '1px solid #c7d2fe' }}>
                <div style={{ width: `${r.progress}%`, height: '100%', background: '#6366f1', borderRadius: '6px', transition: 'width 0.8s' }} />
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.4)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', width: '500px', background: 'white', border: `3px solid #c7d2fe` }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 900, color: '#6366f1' }}>{form.id ? 'Edit' : 'New'} Scheme</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input placeholder="Scheme Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '0.85rem', border: `2px solid #c7d2fe`, borderRadius: '1rem' }} required />
              <input type="number" placeholder="Progress %" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} style={{ width: '100%', padding: '0.85rem', border: `2px solid #c7d2fe`, borderRadius: '1rem' }} required />
              <button type="submit" style={{ width: '100%', padding: '1.1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '1.5rem', cursor: 'pointer', fontWeight: 900 }}>Save Locally</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
