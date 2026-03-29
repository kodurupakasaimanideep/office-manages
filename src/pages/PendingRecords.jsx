import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, History, Clock, CheckCircle, AlertTriangle, User, Calendar, FileText, Zap, Sparkles } from 'lucide-react';

const THEME = {
  primary: '#f97316',
  gradient: 'linear-gradient(135deg, #f97316 0%, #d97706 100%)',
  light: '#fff7ed',
  border: '#fed7aa',
  accent: '#fbbf24'
};

const STATUS_STYLE = {
  Pending:     { icon: Clock, color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
  'In Progress': { icon: Zap, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  Completed:   { icon: CheckCircle, color: '#10b981', bg: '#ecfdf5', border: '#6ee7b7' },
};

const PendingRecords = () => {
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('pending_records') || '[]'));
  useEffect(() => { localStorage.setItem('pending_records', JSON.stringify(records)); }, [records]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ id: null, recordName: '', nameOfWork: '', staffName: '', summary: '', lastDate: '', status: 'Pending', workPending: '' });

  const completedCount = records.filter(r => r.status === 'Completed').length;
  const pendingCount = records.filter(r => r.status === 'Pending').length;
  const total = records.length;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const handleSave = (e) => {
    e.preventDefault();
    if (formState.id) {
      setRecords(records.map(r => r.id === formState.id ? formState : r));
    } else {
      setRecords([...records, { ...formState, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const deleteRecord = (id) => { if (window.confirm('Delete?')) setRecords(records.filter(r => r.id !== id)); };

  const inputStyle = { width: '100%', padding: '0.75rem', border: '1.5px solid #fed7aa', borderRadius: '0.6rem', background: 'white', color: '#1e293b', outline: 'none' };

  return (
    <div style={{ padding: '0' }}>
      {/* Premium Festival Header */}
      <div style={{ 
        background: THEME.gradient, 
        padding: '2rem', 
        borderRadius: '1.5rem', 
        color: 'white', 
        marginBottom: '2rem',
        boxShadow: '0 10px 25px rgba(249,115,22,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Sparkles size={24} color="#fef3c7" />
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Work Progress Dashboard</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 500 }}>{total} total assignments tracked</p>
          <button onClick={() => { setFormState({ id: null, recordName: '', nameOfWork: '', staffName: '', summary: '', lastDate: '', status: 'Pending', workPending: '' }); setIsModalOpen(true); }} 
            style={{ 
              marginTop: '1.5rem', 
              padding: '0.8rem 1.75rem', 
              background: 'white', 
              color: THEME.primary, 
              border: 'none', 
              borderRadius: '0.75rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            Add New Record
          </button>
        </div>
        <div style={{ position: 'absolute', right: '-2rem', top: '-1rem', opacity: 0.1 }}>
          <History size={200} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: `2px solid ${THEME.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 800, color: THEME.primary }}>OVERALL PROGRESS</span>
            <span style={{ fontWeight: 800, color: THEME.primary }}>{pct}%</span>
          </div>
          <div style={{ height: '14px', background: '#feedd5', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: THEME.gradient, borderRadius: '7px', transition: 'width 0.8s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>{completedCount}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMPLETED</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>PENDING</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: THEME.primary }}>{total}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ borderRadius: '1.25rem', overflow: 'hidden', border: `2px solid ${THEME.border}` }}>
        <div style={{ padding: '1.25rem 1.5rem', background: THEME.light, borderBottom: `2px solid ${THEME.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <History size={20} color={THEME.primary} />
          <h3 style={{ margin: 0, fontWeight: 800, color: THEME.primary, letterSpacing: '0.05em' }}>WORK LOG</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fff7ed' }}>
                {['Work Name', 'Staff', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 900, color: '#92400e', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#92400e', fontStyle: 'italic' }}>No work records found.</td></tr> :
                records.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${THEME.border}`, background: i % 2 === 0 ? 'white' : '#fffcf8' }}>
                    <td style={{ padding: '1.25rem 1rem', fontWeight: 700 }}>{r.nameOfWork}</td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '28px', height: '28px', background: THEME.light, color: THEME.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{r.staffName?.charAt(0)}</div>
                        {r.staffName}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ padding: '0.4rem 0.85rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, background: STATUS_STYLE[r.status].bg, color: STATUS_STYLE[r.status].color, border: `1px solid ${STATUS_STYLE[r.status].border}` }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{r.lastDate}</td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <button onClick={() => { setFormState(r); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '0.75rem' }}><Edit size={16} /></button>
                      <button onClick={() => deleteRecord(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', width: '450px', border: `2px solid ${THEME.border}`, background: 'white' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 900, color: THEME.primary, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={24}/> {formState.id ? 'Edit' : 'Add'} Record</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="Work Name" value={formState.nameOfWork} onChange={e => setFormState({ ...formState, nameOfWork: e.target.value })} style={inputStyle} required />
              <input placeholder="Staff Name" value={formState.staffName} onChange={e => setFormState({ ...formState, staffName: e.target.value })} style={inputStyle} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="date" value={formState.lastDate} onChange={e => setFormState({ ...formState, lastDate: e.target.value })} style={inputStyle} required />
                <select value={formState.status} onChange={e => setFormState({ ...formState, status: e.target.value })} style={inputStyle}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.9rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 800 }}>Save Changes</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.9rem', border: `1.5px solid ${THEME.border}`, borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRecords;
