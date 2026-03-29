import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { History, Clock, CheckCircle, Zap, Sparkles, Edit, Trash2 } from 'lucide-react';

const PendingRecords = () => {
  const records = useQuery(api.pendingRecords.get) || [];
  const addRecord = useMutation(api.pendingRecords.add);
  const updateRecord = useMutation(api.pendingRecords.update);
  const removeRecord = useMutation(api.pendingRecords.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, recordName: '', nameOfWork: '', staffName: '', summary: '', lastDate: '', status: 'Pending', workPending: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.id) { await updateRecord({ ...form, id: form.id }); } 
    else { await addRecord({ ...form }); }
    setIsModalOpen(false);
  };

  const deleteRecord = async (id) => { if (window.confirm('Delete?')) await removeRecord({ id }); };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ background: 'linear-gradient(135deg, #f97316 0%, #d97706 100%)', padding: '2rem', borderRadius: '1.5rem', color: 'white', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Work Progress Dashboard (Cloud)</h1>
        <button onClick={() => { setForm({ id: null, recordName: '', nameOfWork: '', staffName: '', summary: '', lastDate: '', status: 'Pending', workPending: '' }); setIsModalOpen(true); }} 
          style={{ marginTop: '1.5rem', padding: '0.8rem 1.75rem', background: 'white', color: '#f97316', border: 'none', borderRadius: '0.75rem', fontWeight: 800 }}>+ Add Record</button>
      </div>

      <div className="glass-card" style={{ borderRadius: '1.25rem', overflow: 'hidden', border: `2px solid #fed7aa` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#fff7ed' }}>{['Work Name', 'Staff', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 900, color: '#92400e' }}>{h}</th>)}</tr></thead>
          <tbody>
            {records.length === 0 ? <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#92400e' }}>No cloud records.</td></tr> :
              records.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #fed7aa`, background: i % 2 === 0 ? 'white' : '#fffcf8' }}>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700 }}>{r.nameOfWork}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>{r.staffName}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{ padding: '0.4rem 0.85rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, background: '#fffbeb', color: '#f59e0b' }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <button onClick={() => { setForm({ ...r, id: r._id }); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '0.75rem' }}><Edit size={16} /></button>
                    <button onClick={() => deleteRecord(r._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', width: '450px', border: `2px solid #fed7aa`, background: 'white' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 900, color: '#f97316' }}>{form.id ? 'Edit' : 'Add'} Cloud Record</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="Work Name" value={form.nameOfWork} onChange={e => setForm({ ...form, nameOfWork: e.target.value })} style={{ width:'100%', padding:'0.75rem', border:'1.5px solid #fed7aa', borderRadius:'0.6rem' }} required />
              <input placeholder="Staff Name" value={form.staffName} onChange={e => setForm({ ...form, staffName: e.target.value })} style={{ width:'100%', padding:'0.75rem', border:'1.5px solid #fed7aa', borderRadius:'0.6rem' }} required />
              <button type="submit" style={{ width:'100%', padding:'0.9rem', background:'linear-gradient(135deg, #f97316 0%, #d97706 100%)', color:'white', border:'none', borderRadius:'0.75rem', fontWeight:800 }}>Save to Cloud</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRecords;
