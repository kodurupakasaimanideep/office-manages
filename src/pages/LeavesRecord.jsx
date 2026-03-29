import React, { useState, useEffect } from 'react';
import { Leaf, Edit, Trash2 } from 'lucide-react';

const LeavesRecord = () => {
  const [leaves, setLeaves] = useState(() => JSON.parse(localStorage.getItem('leaves_records') || '[]'));
  useEffect(() => localStorage.setItem('leaves_records', JSON.stringify(leaves)), [leaves]);

  const [activeTab, setActiveTab] = useState('summary');
  const [form, setForm] = useState({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' });

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { ...form, days: Number(form.days), status: 'Pending' };
    if (form.id) { 
      setLeaves(leaves.map(l => l.id === form.id ? { ...payload } : l));
    } else { 
      setLeaves([...leaves, { ...payload, id: Date.now().toString() }]);
    }
    setForm({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' });
    setActiveTab('summary');
  };

  const deleteLeave = (id) => { if (window.confirm('Delete?')) setLeaves(leaves.filter(l => l.id !== id)); };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '2rem 3rem', borderRadius: '2rem', color: 'white', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Attendance (Offline)</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>Tracking employee leaves locally.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('summary')} style={{ padding:'0.5rem 1rem', background: activeTab === 'summary' ? '#10b981' : 'white', color: activeTab === 'summary' ? 'white' : '#10b981', borderRadius: '1rem', border: '1.5px solid #10b981', fontWeight: 800 }}>Summary</button>
        <button onClick={() => setActiveTab('post')} style={{ padding:'0.5rem 1rem', background: activeTab === 'post' ? '#10b981' : 'white', color: activeTab === 'post' ? 'white' : '#10b981', borderRadius: '1rem', border: '1.5px solid #10b981', fontWeight: 800 }}>Application</button>
      </div>

      {activeTab === 'summary' ? (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', border: `2.2px solid #6ee7b7`, background: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#ecfdf5' }}>{['Type', 'Start', 'End', 'Days', 'Actions'].map(h => <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 900, color: '#064e3b' }}>{h}</th>)}</tr></thead>
            <tbody>
              {leaves.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#064e3b' }}>No offline records.</td></tr> :
                leaves.map((l, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ecfdf5' }}>
                    <td style={{ padding:'1rem', fontWeight:800 }}>{l.type}</td>
                    <td style={{ padding:'1rem' }}>{l.startDate}</td>
                    <td style={{ padding:'1rem' }}>{l.endDate}</td>
                    <td style={{ padding:'1rem', fontWeight:800 }}>{l.days}d</td>
                    <td style={{ padding:'1rem' }}>
                      <button onClick={() => { setForm({ ...l }); setActiveTab('post'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '0.5rem' }}><Edit size={16}/></button>
                      <button onClick={() => deleteLeave(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ maxWidth: '400px', background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '2px solid #6ee7b7' }}>
          <h2 style={{ color: '#10b981' }}>New Application</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} style={{ width: '100%', padding:'0.75rem', borderRadius:'0.75rem', border:'1.5px solid #6ee7b7' }} required />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} style={{ width: '100%', padding:'0.75rem', borderRadius:'0.75rem', border:'1.5px solid #6ee7b7' }} required />
            <input type="number" placeholder="Days" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} style={{ width: '100%', padding:'0.75rem', borderRadius:'0.75rem', border:'1.5px solid #6ee7b7' }} required />
            <button type="submit" style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 900 }}>Save Locally</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeavesRecord;
