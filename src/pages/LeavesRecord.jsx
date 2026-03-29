import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Leaf, PlusCircle, CheckCircle, Clock, XCircle, BarChart, Sparkles, User, Calendar } from 'lucide-react';

const THEME = {
  primary: '#10b981',
  gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  light: '#ecfdf5',
  border: '#6ee7b7',
  accent: '#14b8a6',
  glow: 'rgba(16,185,129,0.15)'
};

const LEAVE_TYPES = {
  'Sick Leave':    { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' },
  'Casual Leave':  { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Earned Leave':  { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' }
};

const LeavesRecord = () => {
  const [leaves, setLeaves] = useState(() => JSON.parse(localStorage.getItem('leaves_records') || '[]'));
  useEffect(() => { localStorage.setItem('leaves_records', JSON.stringify(leaves)); }, [leaves]);

  const [activeTab, setActiveTab] = useState('summary');
  const [form, setForm] = useState({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.id) { setLeaves(leaves.map(l => l.id === form.id ? form : l)); } 
    else { setLeaves([...leaves, { ...form, id: Date.now().toString(), status: 'Pending' }]); }
    setForm({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' });
    setActiveTab('summary');
  };

  const deleteLeave = (id) => { if (window.confirm('Delete?')) setLeaves(leaves.filter(l => l.id !== id)); };

  const inputStyle = { width: '100%', padding: '0.85rem', border: `2.2px solid ${THEME.border}`, borderRadius: '1rem', background: 'white', color: '#064e3b', outline: 'none', fontWeight: 600 };

  const totalUsed = leaves.reduce((s,l) => s + Number(l.days), 0);
  const totalLimit = 25;
  const pctUsed = Math.min((totalUsed / totalLimit) * 100, 100);

  return (
    <div style={{ padding: '0' }}>
      <div style={{ 
        background: THEME.gradient, 
        padding: '2rem 3rem', 
        borderRadius: '2rem', 
        color: 'white', 
        marginBottom: '2.5rem',
        boxShadow: `0 12px 30px ${THEME.glow}`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Leaf size={32} color="#6ee7b7" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Attendance &amp; Leaves</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500, maxWidth: '600px' }}>Tracking employee presence and leave balances with a clean, efficient overview.</p>
        </div>
        <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>{totalUsed}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase' }}>DAYS UTILIZED / {totalLimit} QUOTA</div>
        </div>
        <div style={{ position: 'absolute', right: '-3rem', top: '-1rem', opacity: 0.1 }}>
          <Calendar size={250} fill="white" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <button onClick={() => setActiveTab('summary')} style={{ 
          padding: '0.75rem 2rem', 
          borderRadius: '1.5rem', 
          border: 'none', 
          background: activeTab === 'summary' ? THEME.gradient : 'white', 
          color: activeTab === 'summary' ? 'white' : THEME.primary, 
          fontWeight: 900, 
          cursor: 'pointer',
          boxShadow: activeTab === 'summary' ? `0 6px 15px ${THEME.glow}` : '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.3s'
        }}>View Summary</button>
        <button onClick={() => setActiveTab('post')} style={{ 
          padding: '0.75rem 2rem', 
          borderRadius: '1.5rem', 
          border: 'none', 
          background: activeTab === 'post' ? THEME.gradient : 'white', 
          color: activeTab === 'post' ? 'white' : THEME.primary, 
          fontWeight: 900, 
          cursor: 'pointer',
          boxShadow: activeTab === 'post' ? `0 6px 15px ${THEME.glow}` : '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.3s'
        }}>Apply For Leave</button>
      </div>

      {activeTab === 'summary' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', border: `2.2px solid ${THEME.border}`, background: 'white' }}>
            <h3 style={{ margin: '0 0 2rem 0', fontWeight: 900, color: THEME.primary, display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Clock size={24}/> RECENT RECORDS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {leaves.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '2rem' }}>No leave applications on file.</div>
              ) : (
                leaves.map(l => (
                  <div key={l.id} style={{ 
                    padding: '1.25rem', 
                    borderRadius: '1.25rem', 
                    background: '#f0fdf4', 
                    border: `1.5px solid ${THEME.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <div style={{ 
                        padding: '0.4rem 1rem', 
                        borderRadius: '2rem', 
                        fontSize: '0.72rem', 
                        fontWeight: 900, 
                        background: LEAVE_TYPES[l.type].bg, 
                        color: LEAVE_TYPES[l.type].color, 
                        border: `2px solid ${LEAVE_TYPES[l.type].border}`,
                        textTransform: 'uppercase'
                      }}>{l.type}</div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#064e3b' }}>{l.startDate} → {l.endDate}</div>
                        <div style={{ fontSize: '0.8rem', color: THEME.primary, fontWeight: 700 }}>{l.days} Day Application</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#92400e' }}>⌛ {l.status}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => { setForm(l); setActiveTab('post'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={16}/></button>
                          <button onClick={() => deleteLeave(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16}/></button>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', border: `2.2px solid ${THEME.border}`, background: 'white' }}>
            <h3 style={{ margin: '0 0 2rem 0', fontWeight: 900, color: THEME.primary, display: 'flex', alignItems: 'center', gap: '0.6rem' }}><BarChart size={24}/> QUOTA UTILIZATION</h3>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
               <div style={{ fontSize: '4.5rem', fontWeight: 900, color: THEME.primary, lineHeight: 1 }}>{totalUsed}</div>
               <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)' }}>DAYS USED OUT OF {totalLimit}</div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 900, color: THEME.primary }}>
                <span>ANNUAL CAPACITY</span>
                <span>{Math.round(pctUsed)}%</span>
              </div>
              <div style={{ height: '24px', background: '#ecfdf5', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${THEME.border}` }}>
                <div style={{ width: `${pctUsed}%`, height: '100%', background: THEME.gradient, borderRadius: '12px', transition: 'width 1s' }} />
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>Your remaining balance for the current fiscal year is <strong>{totalLimit - totalUsed} days</strong>.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', borderRadius: '2rem', border: `2.5px solid ${THEME.border}`, background: 'white', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '2rem', fontWeight: 900, color: THEME.primary, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><PlusCircle size={32}/> Submit Application</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: THEME.primary, marginBottom: '0.6rem', textTransform: 'uppercase' }}>LEAVE CATEGORY</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="Sick Leave">Sick Leave 🤒</option>
                <option value="Casual Leave">Casual Leave ☀️</option>
                <option value="Earned Leave">Earned Leave 🌿</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: THEME.primary, marginBottom: '0.6rem', textTransform: 'uppercase' }}>START DATE</label>
                <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: THEME.primary, marginBottom: '0.6rem', textTransform: 'uppercase' }}>END DATE</label>
                <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} style={inputStyle} required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: THEME.primary, marginBottom: '0.6rem', textTransform: 'uppercase' }}>DURATION (DAYS)</label>
              <input type="number" placeholder="Number of days" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} style={inputStyle} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: THEME.primary, marginBottom: '0.6rem', textTransform: 'uppercase' }}>JUSTIFICATION / REASON</label>
              <textarea placeholder="Provide details for the leave request..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ ...inputStyle, minHeight: 120, resize: 'none' }} required />
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem' }}>
              <button type="submit" style={{ flex: 2, padding: '1.1rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '1.5rem', cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem', boxShadow: `0 8px 16px ${THEME.glow}` }}>{form.id ? 'Update Application' : 'Submit Request'}</button>
              <button type="button" onClick={() => setActiveTab('summary')} style={{ flex: 1, padding: '1.1rem', border: `2.5px solid ${THEME.border}`, borderRadius: '1.5rem', cursor: 'pointer', fontWeight: 800, color: THEME.primary }}>Discard</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeavesRecord;
