import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Zap } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/* ─── Pending Records Colour Palette ─────────────────────────── */
const THEME = {
  primary:  '#ec4899',    // hot pink — vibrant & unique
  secondary:'#be185d',
  accent:   '#f9a8d4',
  light:    '#fdf2f8',
  border:   '#f9a8d4',
  gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #9d174d 100%)',
  glow:     'rgba(236,72,153,0.22)',
};

const STATUS_STYLE = {
  Completed: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7', glow: 'rgba(5,150,105,0.2)',   icon: '✅' },
  Pending:   { bg: '#fef3c7', color: '#92400e', border: '#fcd34d', glow: 'rgba(245,158,11,0.2)',   icon: '⏳' },
};

const CATEGORY_COLORS = [
  { color: '#ec4899', pendingBg: '#fce7f3', glow: 'rgba(236,72,153,0.2)',  gradient: 'linear-gradient(135deg,#ec4899,#be185d)', icon: '📋' },
  { color: '#f59e0b', pendingBg: '#fef3c7', glow: 'rgba(245,158,11,0.2)',  gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', icon: '🍚' },
  { color: '#10b981', pendingBg: '#d1fae5', glow: 'rgba(16,185,129,0.2)',  gradient: 'linear-gradient(135deg,#10b981,#065f46)', icon: '🎓' },
  { color: '#8b5cf6', pendingBg: '#ede9fe', glow: 'rgba(139,92,246,0.2)',  gradient: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', icon: '🗂️' },
];

const PendingRecords = () => {
  const records     = useQuery(api.pendingRecords.get) || [];
  const riceIndents = useQuery(api.riceIndents.get)    || [];
  const schemes     = useQuery(api.schemes.get)        || [];

  const obcRecords = (() => { try { return JSON.parse(localStorage.getItem('scholarship_obc') || '[]'); } catch { return []; } })();
  const bcRecords  = (() => { try { return JSON.parse(localStorage.getItem('scholarship_bc')  || '[]'); } catch { return []; } })();
  const scholarshipCompleted = [...obcRecords, ...bcRecords].filter(r => r.status === 'Completed').length;
  const scholarshipPending   = [...obcRecords, ...bcRecords].filter(r => r.status === 'Pending').length;
  const scholarshipTotal     = obcRecords.length + bcRecords.length;

  const addRecord    = useMutation(api.pendingRecords.add);
  const updateRecord = useMutation(api.pendingRecords.update);
  const deleteRecord = useMutation(api.pendingRecords.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState]     = useState({
    _id: null, recordName: '', nameOfWork: '', staffName: '',
    summary: '', lastDate: '', status: 'Pending', workPending: ''
  });

  const completedCount   = records.filter(r => r.status === 'Completed').length;
  const pendingCount     = records.filter(r => r.status === 'Pending').length;
  const total            = records.length;
  const completedPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const pendingPercent   = total === 0 ? 0 : Math.round((pendingCount   / total) * 100);

  const allItems = [...records, ...riceIndents, ...schemes];
  const officeTotal         = allItems.length;
  const officeCompleted     = allItems.filter(r => r.status === 'Completed').length;
  const officePending       = allItems.filter(r => r.status === 'Pending').length;
  const officeCompletedPct  = officeTotal === 0 ? 0 : Math.round((officeCompleted / officeTotal) * 100);
  const officePendingPct    = officeTotal === 0 ? 0 : Math.round((officePending   / officeTotal) * 100);

  const strokeWidth = 14;
  const radius      = 50;
  const circumference = 2 * Math.PI * radius;
  const dashCompleted = circumference - (officeCompletedPct / 100) * circumference;
  const dashPending   = circumference - (officePendingPct   / 100) * circumference;

  const categories = [
    { label: 'Pending Records', completed: records.filter(r => r.status === 'Completed').length, pendingCount: records.filter(r => r.status === 'Pending').length, total: records.length,  ...CATEGORY_COLORS[0] },
    { label: 'Rice Indent',     completed: riceIndents.filter(r => r.status === 'Completed').length, pendingCount: riceIndents.filter(r => r.status === 'Pending').length, total: riceIndents.length, ...CATEGORY_COLORS[1] },
    { label: 'Scholarship',     completed: scholarshipCompleted, pendingCount: scholarshipPending, total: scholarshipTotal, ...CATEGORY_COLORS[2] },
    { label: 'Schemes',         completed: schemes.filter(r => r.status === 'Completed').length, pendingCount: schemes.filter(r => r.status === 'Pending').length, total: schemes.length, ...CATEGORY_COLORS[3] },
  ];

  const openModal = (record = null) => {
    setFormState(record ? {
      _id: record._id, recordName: record.recordName || '', nameOfWork: record.nameOfWork || '',
      staffName: record.staffName || '', summary: record.summary || '', lastDate: record.lastDate || '',
      status: record.status || 'Pending', workPending: record.workPending || ''
    } : {
      _id: null, recordName: '', nameOfWork: '', staffName: '',
      summary: '', lastDate: '', status: 'Pending', workPending: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    const payload = {
      recordName: formState.recordName, nameOfWork: formState.nameOfWork || '',
      staffName: formState.staffName,  summary: formState.summary,
      lastDate: formState.lastDate,    status: formState.status,
      workPending: formState.workPending || ''
    };
    if (formState._id) await updateRecord({ id: formState._id, ...payload });
    else await addRecord(payload);
    closeModal();
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this record?')) await deleteRecord({ id });
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.9rem',
    border: '1.5px solid #f9a8d4', borderRadius: '0.6rem',
    background: 'white', color: '#831843', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: 0 }}>

      {/* ── Page Header ── */}
      <div style={{
        background: THEME.gradient, borderRadius: '1.25rem', padding: '1.5rem 2rem',
        marginBottom: '1.75rem', boxShadow: `0 8px 32px ${THEME.glow}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <Zap size={22} color="rgba(255,255,255,0.9)" />
            <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.7rem', margin: 0 }}>Pending Records</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', margin: 0 }}>
            Manage and track outstanding documentation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'white', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{officePending}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem' }}>Total Pending</div>
          </div>
          <button onClick={() => openModal()} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem',
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
            color: 'white', border: '1.5px solid rgba(255,255,255,0.4)',
            borderRadius: '0.7rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
          }}>
            <Plus size={16} /> Add Record
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Donut: Office-wide status */}
        <div style={{
          background: 'var(--card-bg)', borderRadius: '1.25rem', padding: '1.75rem',
          border: `2px solid ${THEME.border}`,
          boxShadow: `0 4px 24px ${THEME.glow}`,
          display: 'flex', alignItems: 'center', gap: '1.5rem',
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: THEME.primary, marginBottom: '0.3rem' }}>🏢 Total Office Status</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.1rem' }}>
              Pending Records · Rice Indent · Scholarship · Schemes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {[
                { label: `Completed: ${officeCompleted} (${officeCompletedPct}%)`, color: '#059669', icon: '✅' },
                { label: `Pending: ${officePending} (${officePendingPct}%)`,       color: '#ef4444', icon: '⏳' },
                { label: `Total: ${officeTotal}`,                                   color: 'var(--text-muted)', icon: '📦' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.83rem', fontWeight: 600 }}>
                  <span>{item.icon}</span>
                  <span style={{ color: 'var(--text-dark)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
            <svg width="130" height="130" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#059669" strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={dashCompleted}
                strokeLinecap="round" transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#ef4444" strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={dashPending}
                strokeLinecap="round" transform={`rotate(${(officeCompletedPct / 100) * 360 - 90} 60 60)`}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: THEME.primary }}>{officeCompletedPct}%</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>DONE</span>
            </div>
          </div>
        </div>

        {/* Bar chart: per category */}
        <div style={{
          background: 'var(--card-bg)', borderRadius: '1.25rem', padding: '1.75rem',
          border: `2px solid ${THEME.border}`,
          boxShadow: `0 4px 24px ${THEME.glow}`,
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: THEME.primary, marginBottom: '1.25rem' }}>📊 Work Progress Overview</h2>
          {categories.map(cat => {
            const pct = cat.total === 0 ? 0 : Math.round((cat.completed / cat.total) * 100);
            return (
              <div key={cat.label} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{cat.icon}</span>{cat.label}
                  </span>
                  <span style={{ color: cat.color }}>{pct}% · {cat.pendingCount} pending ⏳</span>
                </div>
                <div style={{ width: '100%', height: 9, background: cat.pendingBg, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cat.gradient, borderRadius: 5, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
          <div style={{
            marginTop: '1rem', padding: '0.7rem 1rem', background: THEME.light,
            borderRadius: '0.65rem', border: `1.5px solid ${THEME.border}`,
            display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700,
          }}>
            <span style={{ color: 'var(--text-muted)' }}>⚡ This section: {completedPercent}% done</span>
            <span style={{ color: pendingCount > 0 ? THEME.primary : '#059669' }}>{pendingCount} pending here</span>
          </div>
        </div>
      </div>

      {/* ── Category Status Chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <div key={cat.label} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.45rem 1rem', borderRadius: '2rem',
            background: cat.pendingBg, border: `1.5px solid ${cat.color}22`,
            fontSize: '0.82rem', fontWeight: 700, color: cat.color,
            boxShadow: `0 2px 8px ${cat.glow}`,
          }}>
            {cat.icon} {cat.label}: {cat.total}
          </div>
        ))}
      </div>

      {/* ── Records Table ── */}
      <div style={{
        background: 'var(--card-bg)', borderRadius: '1.25rem', overflow: 'hidden',
        border: `2px solid ${THEME.border}`,
        boxShadow: `0 4px 20px ${THEME.glow}`,
      }}>
        <div style={{ padding: '1rem 1.5rem', background: THEME.gradient, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} color="white" />
            <h3 style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>All Pending Records</h3>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: THEME.light }}>
                {['Record Name', 'Name of Work', 'Staff Name', 'Work Pending', 'Summary', 'Last Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: THEME.secondary, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${THEME.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
                      <p style={{ fontStyle: 'italic' }}>No records formulated here yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record, idx) => {
                  const s = STATUS_STYLE[record.status] || STATUS_STYLE.Pending;
                  return (
                    <tr key={record._id} style={{ borderBottom: `1px solid ${THEME.border}`, background: idx % 2 === 0 ? 'transparent' : 'rgba(236,72,153,0.03)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>{record.recordName}</td>
                      <td style={{ padding: '1rem' }}>
                        {record.nameOfWork ? (
                          <span style={{ padding: '3px 9px', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 700, background: THEME.light, color: THEME.secondary, border: `1px solid ${THEME.border}` }}>
                            {record.nameOfWork}
                          </span>
                        ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-dark)', fontSize: '0.88rem' }}>{record.staffName}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '3px 9px', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, background: '#fce7f3', color: THEME.primary, border: `1px solid ${THEME.border}` }}>
                          {record.workPending || 'Unspecified'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-dark)', fontSize: '0.85rem' }}>
                        {record.summary}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-dark)', fontSize: '0.85rem' }}>📅 {record.lastDate}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          padding: '4px 10px', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 700,
                          background: s.bg, color: s.color, border: `1.5px solid ${s.border}`,
                          boxShadow: `0 2px 6px ${s.glow}`,
                        }}>
                          {s.icon} {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => openModal(record)} style={{ background: THEME.light, border: `1px solid ${THEME.border}`, borderRadius: '0.4rem', padding: '0.35rem 0.5rem', cursor: 'pointer', color: THEME.primary }}>
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(record._id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.4rem', padding: '0.35rem 0.5rem', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(131,24,67,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', width: '100%', maxWidth: 560, boxShadow: `0 30px 60px ${THEME.glow}`, maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: THEME.gradient, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '1.25rem 1.25rem 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Zap size={18} color="white" />
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  {formState._id ? 'Edit Record' : 'Add New Record'}
                </h2>
              </div>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Record Name',            name: 'recordName',  required: true,  placeholder: 'Enter record name' },
                { label: 'Name of Work',           name: 'nameOfWork',  required: false, placeholder: 'e.g. File clearance, Audit review' },
                { label: 'Staff Name',             name: 'staffName',   required: true,  placeholder: 'Enter staff name' },
                { label: 'What work is pending?',  name: 'workPending', required: false, placeholder: 'e.g. Need signature, document review' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                  <input type="text" name={f.name} value={formState[f.name]} onChange={handleChange} required={f.required} style={inputStyle} placeholder={f.placeholder} />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Summary</label>
                <textarea name="summary" value={formState.summary} onChange={handleChange} required style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Enter record summary" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Last Date</label>
                  <input type="date" name="lastDate" value={formState.lastDate} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</label>
                  <select name="status" value={formState.status} onChange={handleChange} required style={{ ...inputStyle }}>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Completed">✅ Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button type="button" onClick={closeModal} style={{ padding: '0.65rem 1.25rem', border: '1.5px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-dark)', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.5rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 800, boxShadow: `0 4px 12px ${THEME.glow}` }}>
                  {formState._id ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRecords;
