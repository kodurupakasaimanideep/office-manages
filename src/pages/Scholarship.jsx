import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, GraduationCap, Sparkles, Filter, ChevronRight, Search } from 'lucide-react';

const SECTION_COLORS = {
  OBC: { 
    header: 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
    badge: '#ede9fe', 
    badgeText: '#5b21b6', 
    dot: '#8b5cf6', 
    light: '#f5f3ff', 
    border: '#c4b5fd',
    glow: 'rgba(99,102,241,0.15)'
  },
  BC:  { 
    header: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',  
    badge: '#e0f2fe', 
    badgeText: '#075985', 
    dot: '#0ea5e9', 
    light: '#f0f9ff', 
    border: '#7dd3fc',
    glow: 'rgba(14,165,233,0.15)'
  }
};

function DonutChart({ completed, total, color }) {
  const strokeWidth = 10;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const offset = circumference - (pct / 100) * circumference;

  if (total === 0) return <div style={{ width: 96, height: 96, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.6)', fontSize:'0.75rem'}}>No Data</div>;
  return (
    <div style={{ position:'relative', width: 96, height: 96 }}>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={strokeWidth} />
        <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 48 48)" style={{ transition:'stroke-dashoffset 0.5s ease-in-out' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:'1.1rem', fontWeight:'900', color:'white' }}>{pct}%</span>
        <span style={{ fontSize:'0.55rem', fontWeight: 700, color:'rgba(255,255,255,0.85)', letterSpacing: '0.05em' }}>DONE</span>
      </div>
    </div>
  );
}

function ScholarshipSection({ title, type, color, records, onAdd, onEdit, onDelete }) {
  const totalCount = records.reduce((s, r) => s + Number(r.total || 0), 0);
  const completedCount = records.reduce((s, r) => s + Number(r.completed || 0), 0);

  return (
    <div className="glass-card" style={{ borderRadius:'1.5rem', overflow:'hidden', border:`2px solid ${color.border}`, boxShadow:`0 10px 30px ${color.glow}`, marginBottom:'2.5rem' }}>
      <div style={{ background:color.header, padding:'1.5rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', color: 'white' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ background:'rgba(255,255,255,0.25)', padding:'0.75rem', borderRadius:'1rem', display:'flex', alignItems:'center' }}><GraduationCap size={24}/></div>
          <div>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, margin:0 }}>{title}</h2>
            <div style={{ fontSize:'0.85rem', opacity:0.85, fontWeight:600, marginTop: '0.2rem' }}>{records.length} College Records Tracking</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{completedCount}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8 }}>TOTAL COMPLETED</div>
          </div>
          <DonutChart completed={completedCount} total={totalCount} color="white" />
          <button onClick={onAdd} style={{ background:'white', color:color.dot, border:'none', borderRadius:'0.75rem', padding:'0.7rem 1.25rem', cursor:'pointer', fontWeight:800, fontSize:'0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>+ Add Record</button>
        </div>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:color.light }}>{['College Name','Incharge','Completed','Total','Type','Last Date','Status','Actions'].map(h => <th key={h} style={{ padding:'1.1rem 1.5rem', fontSize:'0.72rem', fontWeight:800, color:color.badgeText, borderBottom:`1.5px solid ${color.border}`, textAlign:'left', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>)}</tr></thead>
          <tbody>
            {records.length === 0 ? <tr><td colSpan="8" style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', fontStyle: 'italic' }}>No records categorized under {title}.</td></tr> : (
              records.map((r, i) => (
                <tr key={r.id} style={{ borderBottom:`1px solid ${color.border}`, background: i%2===0 ? 'white' : color.light }}>
                  <td style={{ padding:'1.25rem 1.5rem', fontWeight:700, color: '#1e293b' }}>{r.college}</td>
                  <td style={{ padding:'1.25rem 1.5rem', fontWeight:600 }}>{r.sectionIncharge}</td>
                  <td style={{ padding:'1.25rem 1.5rem', fontWeight:800, color: color.badgeText }}>{r.completed}</td>
                  <td style={{ padding:'1.25rem 1.5rem', fontWeight:800, color: 'var(--text-muted)' }}>{r.total}</td>
                  <td style={{ padding:'1.25rem 1.5rem' }}><span style={{ padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, background: color.badge, color: color.badgeText }}>{r.type}</span></td>
                  <td style={{ padding:'1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>{r.lastDate}</td>
                  <td style={{ padding:'1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.status === 'Completed' ? '#10b981' : '#f59e0b' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{r.status}</span>
                    </div>
                  </td>
                  <td style={{ padding:'1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => onEdit(r)} style={{ border:'none', background:'none', cursor:'pointer', color:'#3b82f6' }}><Edit size={16}/></button>
                      <button onClick={() => onDelete(r.id)} style={{ border:'none', background:'none', cursor:'pointer', color:'#ef4444' }}><Trash2 size={16}/></button>
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
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('scholarships') || '[]'));
  useEffect(() => { localStorage.setItem('scholarships', JSON.stringify(data)); }, [data]);

  const [modal, setModal] = useState({ open: false, section: null });
  const [form, setForm] = useState({ id: null, college: '', sectionIncharge: '', completed: '', total: '', type: 'Fresh', lastDate: '', status: 'Pending' });

  const obcRecords = data.filter(r => r.section === 'OBC');
  const bcRecords = data.filter(r => r.section === 'BC');

  const openAdd = (section) => { setForm({ id: null, college: '', sectionIncharge: '', completed: '', total: '', type: 'Fresh', lastDate: '', status: 'Pending', section }); setModal({ open: true, section }); };
  const openEdit = (section, r) => { setForm({ ...r, section }); setModal({ open: true, section }); };
  const closeModal = () => setModal({ open: false, section: null });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.id) { setData(data.map(r => r.id === form.id ? form : r)); } 
    else { setData([...data, { ...form, id: Date.now().toString() }]); }
    closeModal();
  };

  const handleDelete = (id) => { if (window.confirm('Delete record?')) setData(data.filter(r => r.id !== id)); };

  const inputStyle = { width: '100%', padding:'0.75rem', border:'1.5px solid #e2e8f0', borderRadius:'0.75rem', background:'white', color:'#1e293b', outline: 'none' };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Sparkles size={20} color="#f59e0b" />
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Scholarship Analytics</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Real-time monitoring of OBC and BC scholarship disbursements.</p>
      </div>

      <ScholarshipSection title="OBC Scholarship Records" type="OBC" color={SECTION_COLORS.OBC} records={obcRecords} onAdd={() => openAdd('OBC')} onEdit={(r) => openEdit('OBC', r)} onDelete={handleDelete} />
      <ScholarshipSection title="BC Scholarship Records" type="BC" color={SECTION_COLORS.BC} records={bcRecords} onAdd={() => openAdd('BC')} onEdit={(r) => openEdit('BC', r)} onDelete={handleDelete} />

      {modal.open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15, 23, 42, 0.4)', backdropFilter:'blur(10px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="glass-card" style={{ background:'white', padding:'2.5rem', borderRadius:'2rem', width:'480px', border: `2px solid ${SECTION_COLORS[modal.section].border}` }}>
            <h2 style={{ marginBottom:'1.5rem', fontWeight: 900, color: SECTION_COLORS[modal.section].dot }}>{form.id ? 'Edit' : 'Add New'} {modal.section} Entry</h2>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>College Details</label>
                <input placeholder="College Name" value={form.college} onChange={e => setForm({...form, college:e.target.value})} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Assigned Incharge</label>
                <input placeholder="Incharge Name" value={form.sectionIncharge} onChange={e => setForm({...form, sectionIncharge:e.target.value})} style={inputStyle} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Counts</label>
                  <input type="number" placeholder="Completed" value={form.completed} onChange={e => setForm({...form, completed:e.target.value})} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'transparent', marginBottom: '0.5rem' }}>_</label>
                  <input type="number" placeholder="Total" value={form.total} onChange={e => setForm({...form, total:e.target.value})} style={inputStyle} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Type & Dates</label>
                  <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} style={inputStyle}>
                    <option value="Fresh">Fresh</option>
                    <option value="Renewal">Renewal</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'transparent', marginBottom: '0.5rem' }}>_</label>
                  <input type="date" value={form.lastDate} onChange={e => setForm({...form, lastDate:e.target.value})} style={inputStyle} required />
                </div>
              </div>
              <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
                <button type="submit" style={{ flex:2, padding:'1rem', background:SECTION_COLORS[modal.section].header, color:'white', border:'none', borderRadius:'1rem', cursor:'pointer', fontWeight:900, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>Confirm & Save</button>
                <button type="button" onClick={closeModal} style={{ flex:1, padding:'1rem', border:'1.5px solid #e2e8f0', borderRadius:'1rem', cursor:'pointer', fontWeight:700 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scholarship;
