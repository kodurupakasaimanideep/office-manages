import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Landmark, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';

const BankConfirmations = () => {
  const records = useQuery(api.bankConfirmations.getLabels) || [];
  const addRecord = useMutation(api.bankConfirmations.addLabel);
  const updateRecord = useMutation(api.bankConfirmations.updateLabel);
  const removeRecord = useMutation(api.bankConfirmations.removeLabel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, bankName: '', accountNumber: '', status: 'Pending', lastUpdated: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.id) { await updateRecord({ ...form, id: form.id }); } 
    else { await addRecord({ ...form }); }
    setIsModalOpen(false);
  };

  const deleteRecord = async (id) => { if (window.confirm('Delete?')) await removeRecord({ id }); };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1' }}>Bank Confirmations (Cloud)</h1>
        <button onClick={() => { setForm({ id: null, bankName: '', accountNumber: '', status: 'Pending', lastUpdated: '' }); setIsModalOpen(true); }} style={{ padding: '0.7rem 1.25rem', background: '#0369a1', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700 }}>+ Add Record</button>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e0f2fe', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f0f9ff' }}>{['Bank Name', 'A/C Number', 'Status', 'Last Update', 'Actions'].map(h => <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#0369a1' }}>{h}</th>)}</tr></thead>
          <tbody>
            {records.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#0369a1' }}>No cloud data.</td></tr> :
              records.map((r, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f9ff' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{r.bankName}</td>
                  <td style={{ padding: '1rem' }}>{r.accountNumber}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, background: '#dcfce7', color: '#166534' }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{r.lastUpdated}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <button onClick={() => { setForm({ ...r, id: r._id }); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={14} /></button>
                      <button onClick={() => deleteRecord(r._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', width: '400px' }}>
            <h2>Cloud {form.id ? 'Edit' : 'Add'} Confirmation</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
              <input placeholder="Bank Name" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} style={{ width: '100%', padding:'0.6rem', border:'1px solid #e0f2fe', borderRadius:'0.5rem' }} required />
              <input placeholder="A/C Number" value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} style={{ width: '100%', padding:'0.6rem', border:'1px solid #e0f2fe', borderRadius:'0.5rem' }} required />
              <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#0369a1', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700 }}>Save to Cloud</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankConfirmations;
