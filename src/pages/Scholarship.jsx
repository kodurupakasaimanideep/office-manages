import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GraduationCap, Sparkles, Edit, Trash2 } from 'lucide-react';

const SECTION_COLORS = {
  OBC: { header: 'linear-gradient(135deg,#6366f1,#8b5cf6)', badge: '#ede9fe', badgeText: '#5b21b6', dot: '#8b5cf6', light: '#f5f3ff', border: '#c4b5fd' },
  BC:  { header: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',  badge: '#e0f2fe', badgeText: '#075985', dot: '#0ea5e9', light: '#f0f9ff', border: '#7dd3fc' }
};

function ScholarshipSection({ title, type, color, records, onAdd, onEdit, onDelete }) {
  const completedCount = records.reduce((s, r) => s + Number(r.completed || 0), 0);
  return (
    <div className="glass-card" style={{ borderRadius:'1.5rem', overflow:'hidden', border:`2px solid ${color.border}`, marginBottom:'2.5rem' }}>
      <div style={{ background:color.header, padding:'1.5rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', color: 'white' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <GraduationCap size={24}/>
          <div>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, margin:0 }}>{title}</h2>
            <div style={{ fontSize:'0.85rem', opacity:0.85, fontWeight:600 }}>{completedCount} Completed Globally</div>
          </div>
        </div>
        <button onClick={onAdd} style={{ background:'white', color:color.dot, border:'none', borderRadius:'0.75rem', padding:'0.7rem 1.25rem', cursor:'pointer', fontWeight:800 }}>+ Add Record</button>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:color.light }}>{['College Name','Incharge','Completed','Total','Actions'].map(h => <th key={h} style={{ padding:'1.1rem 1.5rem', fontSize:'0.72rem', fontWeight:800, color:color.badgeText, borderBottom:`1.5px solid ${color.border}`, textAlign:'left' }}>{h}</th>)}</tr></thead>
          <tbody>
            {records.length === 0 ? <tr><td colSpan="5" style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>No cloud records found.</td></tr> : (
              records.map((r, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${color.border}`, background: i%2===0 ? 'white' : color.light }}>
                  <td style={{ padding:'1.25rem 1.5rem', fontWeight:700 }}>{r.college}</td>
                  <td style={{ padding:'1.25rem 1.5rem' }}>{r.sectionIncharge}</td>
                  <td style={{ padding:'1.25rem 1.5rem', fontWeight:800, color: color.badgeText }}>{r.completed}</td>
                  <td style={{ padding:'1.25rem 1.5rem', fontWeight:800, color: 'var(--text-muted)' }}>{r.total}</td>
                  <td style={{ padding:'1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => onEdit(r)} style={{ border:'none', background:'none', cursor:'pointer', color:'#3b82f6' }}><Edit size={16}/></button>
                      <button onClick={() => onDelete(r._id)} style={{ border:'none', background:'none', cursor:'pointer', color:'#ef4444' }}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))
            )}</tbody>
          </table>
      </div>
    </div>
  );
}

const Scholarship = () => {
  const records = useQuery(api.scholarships.get) || [];
  const addRecord = useMutation(api.scholarships.add);
  const updateRecord = useMutation(api.scholarships.update);
  const removeRecord = useMutation(api.scholarships.remove);

  const [modal, setModal] = useState({ open: false, section: null });
  const [form, setForm] = useState({ id: null, college: '', sectionIncharge: '', completed: '', total: '', type: 'Fresh', lastDate: '', status: 'Pending' });

  const obc = records.filter(r => r.section === 'OBC');
  const bc = records.filter(r => r.section === 'BC');

  const openAdd = (section) => { setForm({ id: null, college: '', sectionIncharge: '', completed: '', total: '', type: 'Fresh', lastDate: '', status: 'Pending', section }); setModal({ open: true, section }); };
  const openEdit = (section, r) => { setForm({ ...r, id: r._id, section }); setModal({ open: true, section }); };
  const closeModal = () => setModal({ open: false, section: null });

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.id) { await updateRecord({ ...form, id: form.id }); } 
    else { await addRecord({ ...form }); }
    closeModal();
  };

  const handleDelete = async (id) => { if (window.confirm('Delete record?')) await removeRecord({ id }); };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#1e293b' }}>Scholarship Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Global cloud monitoring of scholarship disbursements.</p>
      </div>

      <ScholarshipSection title="OBC Scholarship Records" type="OBC" color={SECTION_COLORS.OBC} records={obc} onAdd={() => openAdd('OBC')} onEdit={(r) => openEdit('OBC', r)} onDelete={handleDelete} />
      <ScholarshipSection title="BC Scholarship Records" type="BC" color={SECTION_COLORS.BC} records={bc} onAdd={() => openAdd('BC')} onEdit={(r) => openEdit('BC', r)} onDelete={handleDelete} />

      {modal.open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15, 23, 42, 0.4)', backdropFilter:'blur(10px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="glass-card" style={{ background:'white', padding:'2.5rem', borderRadius:'2rem', width:'480px', border: `2px solid ${SECTION_COLORS[modal.section].border}` }}>
            <h2 style={{ marginBottom:'1.5rem', fontWeight: 900, color: SECTION_COLORS[modal.section].dot }}>Cloud {form.id ? 'Edit' : 'Add'} Entry</h2>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <input placeholder="College Name" value={form.college} onChange={e => setForm({...form, college:e.target.value})} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.75rem', border:'1px solid #e2e8f0' }} required />
              <input placeholder="Incharge" value={form.sectionIncharge} onChange={e => setForm({...form, sectionIncharge:e.target.value})} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.75rem', border:'1px solid #e2e8f0' }} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="number" placeholder="Completed" value={form.completed} onChange={e => setForm({...form, completed:e.target.value})} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.75rem', border:'1px solid #e2e8f0' }} required />
                <input type="number" placeholder="Total" value={form.total} onChange={e => setForm({...form, total:e.target.value})} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.75rem', border:'1px solid #e2e8f0' }} required />
              </div>
              <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
                <button type="submit" style={{ flex:2, padding:'1rem', background:SECTION_COLORS[modal.section].header, color:'white', border:'none', borderRadius:'1rem', cursor:'pointer', fontWeight:900 }}>Save to Cloud</button>
                <button type="button" onClick={closeModal} style={{ flex:1, padding:'1rem', border:'1.5px solid #e2e8f0', borderRadius:'1rem', cursor:'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scholarship;
