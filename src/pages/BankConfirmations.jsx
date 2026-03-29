import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Landmark } from 'lucide-react';

const defaultForm = () => ({ id: null, college: '', sectionIncharge: '', lastDate: '', progress: 0, status: 'Pending' });

const BankConfirmations = () => {
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('bank_confirmations') || '[]'));
  useEffect(() => { localStorage.setItem('bank_confirmations', JSON.stringify(records)); }, [records]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm());

  const handleSave = (e) => {
    e.preventDefault();
    if (form.id) {
      setRecords(records.map(r => r.id === form.id ? form : r));
    } else {
      setRecords([...records, { ...form, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const deleteRecord = (id) => { if (window.confirm('Delete?')) setRecords(records.filter(r => r.id !== id)); };

  const inputStyle = { width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: 'white', color: '#1e293b' };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Bank Confirmations</h1>
        <button onClick={() => { setForm(defaultForm()); setIsModalOpen(true); }} style={{ padding: '0.7rem 1.25rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>Add Record</button>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f0f9ff' }}>{['College', 'Incharge', 'Status', 'Progress', 'Actions'].map(h => <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#0369a1' }}>{h}</th>)}</tr></thead>
          <tbody>
            {records.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#0369a1' }}>No bank confirmation records yet.</td></tr> :
              records.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f0f9ff' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{r.college}</td>
                  <td style={{ padding: '1rem' }}>{r.sectionIncharge}</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, background: r.status === 'Completed' ? '#dcfce7' : '#ffedd5', color: r.status === 'Completed' ? '#166534' : '#9a3412' }}>{r.status}</span></td>
                  <td style={{ padding: '1rem' }}>{r.progress}%</td>
                  <td style={{ padding: '1rem' }}>
                    <button onClick={() => { setForm(r); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '0.5rem' }}><Edit size={14} /></button>
                    <button onClick={() => deleteRecord(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', width: '400px' }}>
            <h2 style={{ marginBottom: '1rem' }}>{form.id ? 'Edit' : 'Add'} Record</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input placeholder="College" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} style={inputStyle} required />
              <input placeholder="Incharge" value={form.sectionIncharge} onChange={e => setForm({ ...form, sectionIncharge: e.target.value })} style={inputStyle} required />
              <input type="number" placeholder="Progress %" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} style={inputStyle} required />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}><option value="Pending">Pending</option><option value="Completed">Completed</option></select>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.6rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 700 }}>Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankConfirmations;
