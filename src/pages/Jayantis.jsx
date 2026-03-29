import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PartyPopper, Sparkles, MapPin, Edit, Trash2 } from 'lucide-react';

const THEME = {
  primary: '#d97706',
  gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  saffron: '#f97316',
  light: '#fffbeb',
  border: '#fde68a'
};

const Jayantis = () => {
  const events = useQuery(api.jayantis.get) || [];
  const addEvent = useMutation(api.jayantis.add);
  const updateEvent = useMutation(api.jayantis.update);
  const removeEvent = useMutation(api.jayantis.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, eventName: '', date: '', place: '', amount: 0 });

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    if (form.id) { await updateEvent({ ...payload, id: form.id }); } 
    else { await addEvent({ ...payload }); }
    setIsModalOpen(false);
  };

  const deleteRecord = async (id) => { if (window.confirm('Delete?')) await removeEvent({ id }); };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ 
        background: THEME.gradient, padding: '2.5rem 3rem', borderRadius: '2rem', 
        color: 'white', marginBottom: '2.5rem', boxShadow: '0 15px 35px rgba(180,83,9,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <PartyPopper size={32} color="#fef3c7" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Celebrations (Cloud)</h1>
        </div>
        <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>Syncing cultural event data across all office devices.</p>
        <button onClick={() => { setForm({ id: null, eventName: '', date: '', place: '', amount: 0 }); setIsModalOpen(true); }} style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: 'white', color: '#d97706', border: 'none', borderRadius: '1rem', fontWeight: 800 }}>+ Add Celebration</button>
      </div>

      <div className="glass-card" style={{ borderRadius: '1.5rem', overflow: 'hidden', border: `2px solid ${THEME.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#fffbeb' }}>{['Event Name', 'Date & Venue', 'Expenditure (₹)', 'Actions'].map(h => <th key={h} style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 900, color: '#92400e' }}>{h}</th>)}</tr></thead>
          <tbody>
            {events.length === 0 ? <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#92400e' }}>No cloud data available.</td></tr> :
              events.map((e, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${THEME.border}`, background: index % 2 === 0 ? 'white' : '#fffcf1' }}>
                  <td style={{ padding: '1.5rem 2rem', fontWeight: 800 }}>{e.eventName}</td>
                  <td style={{ padding: '1.5rem 2rem' }}>{e.date} • {e.place}</td>
                  <td style={{ padding: '1.5rem 2rem' }}>₹{Number(e.amount).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => { setForm({ ...e, id: e._id }); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={20} /></button>
                      <button onClick={() => deleteRecord(e._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(69,26,3,0.3)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', width: '500px', background: 'white', border: `2px solid ${THEME.border}` }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 900, color: THEME.primary }}>Cloud {form.id ? 'Edit' : 'Add'} Celebration</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input placeholder="Event Name" value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} style={{ width: '100%', padding:'0.85rem', border:'2px solid #fde68a', borderRadius:'0.75rem' }} required />
              <input type="number" placeholder="Total Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ width: '100%', padding:'0.85rem', border:'2px solid #fde68a', borderRadius:'0.75rem' }} required />
              <button type="submit" style={{ width: '100%', padding: '1rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 900 }}>Save to Cloud</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jayantis;
