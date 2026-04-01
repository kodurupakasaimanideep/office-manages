import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, GraduationCap } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const SECTION_COLORS = {
  OBC: { header: 'linear-gradient(135deg,#6366f1,#8b5cf6)', badge: '#ede9fe', badgeText: '#5b21b6', dot: '#8b5cf6', light: '#f5f3ff', border: '#c4b5fd' },
  BC:  { header: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',  badge: '#e0f2fe', badgeText: '#075985', dot: '#0ea5e9', light: '#f0f9ff', border: '#7dd3fc' }
};

function DonutChart({ completed, total, color }) {
  const strokeWidth = 10;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const offset = circumference - (pct / 100) * circumference;

  if (total === 0) return (
    <div style={{ width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>No Data</div>
  );
  return (
    <div style={{ position: 'relative', width: 96, height: 96 }}>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={strokeWidth} />
        <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 48 48)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{pct}%</span>
        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)' }}>done</span>
      </div>
    </div>
  );
}

const defaultForm = () => ({
  _id: null,
  college: '',
  sectionIncharge: '',
  completed: '',
  total: '',
  type: 'Fresh',
  lastDate: '',
  status: 'Pending',
});

function ScholarshipSection({ title, type, color, records, onAdd, onEdit, onDelete }) {
  const totalCount = records.reduce((s, r) => s + Number(r.total || 0), 0);
  const completedCount = records.reduce((s, r) => s + Number(r.completed || 0), 0);
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const collegeStats = records.reduce((acc, r) => {
    const col = r.college || 'Unknown';
    if (!acc[col]) acc[col] = { freshC:0, freshP:0, renC:0, renP:0 };
    const comp = Number(r.completed || 0);
    const tot = Number(r.total || 0);
    const pend = Math.max(0, tot - comp);
    if (r.type === 'Renewal') {
      acc[col].renC += comp; acc[col].renP += pend;
    } else {
      acc[col].freshC += comp; acc[col].freshP += pend;
    }
    return acc;
  }, {});

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: `2px solid ${color.border}`, marginBottom: '2rem' }}>
      {/* Section Header */}
      <div style={{ background: color.header, padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.8rem' }}>{records.length} record(s) — {completedCount}/{totalCount} completed</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <DonutChart completed={completedCount} total={totalCount} color="white" />
          <button onClick={onAdd} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '0.5rem', padding: '0.5rem 0.85rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ padding: '0.75rem 1.5rem', background: color.light, borderBottom: `1px solid ${color.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>
          <span style={{ fontWeight: 600 }}>Overall Progress</span>
          <span style={{ fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color.dot, transition: 'width 0.5s ease', borderRadius: '4px' }} />
        </div>
      </div>

      {/* College Breakdown Insights */}
      {Object.keys(collegeStats).length > 0 && (
        <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-light)', borderBottom: `1px solid ${color.border}`, display: 'flex', gap: '1rem', overflowX: 'auto' }}>
          <div style={{ display:'flex', gap:'1rem', paddingBottom:'0.25rem' }}>
            {Object.entries(collegeStats).map(([col, stats]) => {
               const totFresh = stats.freshC + stats.freshP;
               const totRen = stats.renC + stats.renP;
               return (
                 <div key={col} style={{ background: 'var(--card-bg)', border: `1.5px solid ${color.border}`, borderRadius: '0.75rem', padding: '0.85rem', minWidth: '240px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                   <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.9rem', marginBottom: '0.65rem', borderBottom: `1px dashed ${color.border}`, paddingBottom: '0.5rem', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap' }}>
                      🏢 {col}
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                     <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                       <div style={{ fontSize: '0.68rem', color: '#0369a1', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fresh ({totFresh})</div>
                       <div style={{ fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                         <span title="Completed"><span style={{color:'#166534', fontWeight:800}}>{stats.freshC}</span> ✔</span>
                         <span title="Pending"><span style={{color:'#b45309', fontWeight:800}}>{stats.freshP}</span> ⏳</span>
                       </div>
                     </div>
                     <div style={{ background: 'rgba(251, 146, 60, 0.08)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(251, 146, 60, 0.2)' }}>
                       <div style={{ fontSize: '0.68rem', color: '#9a3412', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Renewal ({totRen})</div>
                       <div style={{ fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                         <span title="Completed"><span style={{color:'#166534', fontWeight:800}}>{stats.renC}</span> ✔</span>
                         <span title="Pending"><span style={{color:'#b45309', fontWeight:800}}>{stats.renP}</span> ⏳</span>
                       </div>
                     </div>
                   </div>
                 </div>
               );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No {title} records yet. Click "Add" to get started.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: color.light }}>
                {['College', 'Section Incharge', 'Completed', 'Total', 'Type', 'Last Date', 'Status', 'Graph', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: `1px solid ${color.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const rowPct = Number(r.total) === 0 ? 0 : Math.round((Number(r.completed) / Number(r.total)) * 100);
                return (
                  <tr key={r._id} style={{ borderBottom: `1px solid ${color.border}` }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{r.college}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dark)', fontSize: '0.85rem' }}>{r.sectionIncharge}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem' }}>{r.completed}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{r.total}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: r.type === 'Fresh' ? '#dbeafe' : '#fef3c7', color: r.type === 'Fresh' ? '#1e40af' : '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{r.type}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{r.lastDate}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600, background: r.status === 'Completed' ? '#dcfce7' : r.status === 'In Progress' ? '#dbeafe' : '#ffedd5', color: r.status === 'Completed' ? '#166534' : r.status === 'In Progress' ? '#1e40af' : '#9a3412' }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '100px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${rowPct}%`, height: '100%', background: color.dot, borderRadius: '3px', transition: 'width 0.4s' }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: color.dot, minWidth: '28px' }}>{rowPct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => onEdit(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '2px' }} title="Edit"><Edit size={15} /></button>
                        <button onClick={() => onDelete(r._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }} title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const Scholarship = () => {
  const records = useQuery(api.scholarships.get) || [];
  const obcRecords = records.filter(r => r.section === 'OBC');
  const bcRecords = records.filter(r => r.section === 'BC');

  const addRecord = useMutation(api.scholarships.add);
  const updateRecord = useMutation(api.scholarships.update);
  const removeRecord = useMutation(api.scholarships.remove);

  const [modal, setModal] = useState({ open: false, section: null });
  const [form, setForm] = useState(defaultForm());

  const openAdd = (section) => { setForm({ ...defaultForm(), section }); setModal({ open: true, section }); };
  const openEdit = (section, r) => { setForm({ ...r, section }); setModal({ open: true, section }); };
  const closeModal = () => setModal({ open: false, section: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, section: modal.section };
    if (payload._id) {
      const { _id, ...rest } = payload;
      await updateRecord({ id: _id, ...rest });
    } else {
      const { _id, ...rest } = payload;
      await addRecord(rest);
    }
    closeModal();
  };

  const handleDelete = async (section, id) => {
    if (window.confirm('Delete this record?')) {
      await removeRecord({ id });
    }
  };

  const inputStyle = { width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: 'var(--card-bg)', color: 'var(--text-dark)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' };

  const sectionColor = modal.section ? SECTION_COLORS[modal.section] : SECTION_COLORS.OBC;

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>Scholarship Details</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage OBC and BC scholarship records per college section.</p>
      </div>

      <ScholarshipSection
        title="OBC Scholarship"
        type="OBC"
        color={SECTION_COLORS.OBC}
        records={obcRecords}
        onAdd={() => openAdd('OBC')}
        onEdit={(r) => openEdit('OBC', r)}
        onDelete={(id) => handleDelete('OBC', id)}
      />
      <ScholarshipSection
        title="BC Scholarship"
        type="BC"
        color={SECTION_COLORS.BC}
        records={bcRecords}
        onAdd={() => openAdd('BC')}
        onEdit={(r) => openEdit('BC', r)}
        onDelete={(id) => handleDelete('BC', id)}
      />

      {/* Modal */}
      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', width: '100%', maxWidth: '540px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: sectionColor.header }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{form._id ? 'Edit' : 'Add'} {modal.section} Scholarship</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>College Name</label>
                  <input type="text" name="college" value={form.college} onChange={handleChange} required style={inputStyle} placeholder="Enter college" />
                </div>
                <div>
                  <label style={labelStyle}>Section Incharge</label>
                  <input type="text" name="sectionIncharge" value={form.sectionIncharge} onChange={handleChange} required style={inputStyle} placeholder="Enter incharge name" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Completed</label>
                  <input type="number" name="completed" value={form.completed} onChange={handleChange} required min="0" style={inputStyle} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Total (How Many)</label>
                  <input type="number" name="total" value={form.total} onChange={handleChange} required min="0" style={inputStyle} placeholder="0" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Fresh or Renewal</label>
                  <select name="type" value={form.type} onChange={handleChange} required style={inputStyle}>
                    <option value="Fresh">Fresh</option>
                    <option value="Renewal">Renewal</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Last Date</label>
                  <input type="date" name="lastDate" value={form.lastDate} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} required style={inputStyle}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={closeModal} style={{ padding: '0.65rem 1.25rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-dark)', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: sectionColor.dot, color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>{form._id ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scholarship;
