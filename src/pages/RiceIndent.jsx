import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const RiceIndent = () => {
  const [indents, setIndents] = useState(() => JSON.parse(localStorage.getItem('rice_indents') || '[]'));
  useEffect(() => localStorage.setItem('rice_indents', JSON.stringify(indents)), [indents]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, hostelName: '', pendingHostel: '', lastDate: '', status: 'Pending' });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.id) { 
      setIndents(indents.map(i => i.id === form.id ? { ...form } : i));
    } else { 
      setIndents([...indents, { ...form, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const deleteIndent = (id) => { if (window.confirm('Delete?')) setIndents(indents.filter(i => i.id !== id)); };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c8813a' }}>Rice Indents</h1>
        <button onClick={() => { setForm({ id: null, hostelName: '', pendingHostel: '', lastDate: '', status: 'Pending' }); setIsModalOpen(true); }} style={{ padding: '0.7rem 1.25rem', background: '#c8813a', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700 }}>+ New Indent</button>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#fffbeb' }}>{['Hostel', 'Pending Qty', 'Date', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#92400e' }}>{h}</th>)}</tr></thead>
          <tbody>
            {indents.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#92400e' }}>No offline data.</td></tr> :
              indents.map((i, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #fffbeb' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{i.hostelName}</td>
                  <td style={{ padding: '1rem' }}>{i.pendingHostel}</td>
                  <td style={{ padding: '1rem' }}>{i.lastDate}</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, background: '#ffedd5', color: '#9a3412' }}>{i.status}</span></td>
                  <td style={{ padding: '1rem' }}>
                    <button onClick={() => { setForm({ ...i }); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '0.5rem' }}><Edit size={14} /></button>
                    <button onClick={() => deleteIndent(i.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', width: '400px' }}>
            <h2>{form.id ? 'Edit' : 'Add'} Indent</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
              <input placeholder="Hostel Name" value={form.hostelName} onChange={e => setForm({ ...form, hostelName: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} required />
              <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#c8813a', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700 }}>Save Locally</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiceIndent;
