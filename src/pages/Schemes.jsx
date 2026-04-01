import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Sparkles } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/* ─── Schemes Colour Palette ─────────────────────────────────── */
const THEME = {
  primary:  '#6366f1',    // indigo
  secondary:'#4f46e5',
  accent:   '#818cf8',
  light:    '#eef2ff',
  border:   '#c7d2fe',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)',
  glow:     'rgba(99,102,241,0.25)',
};

const STATUS_STYLES = {
  Completed: {
    bg: 'linear-gradient(135deg,#059669,#065f46)',
    badge: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    glow: 'rgba(5,150,105,0.2)',
    icon: '✅',
  },
  Pending: {
    bg: 'linear-gradient(135deg,#d97706,#b45309)',
    badge: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
    glow: 'rgba(217,119,6,0.2)',
    icon: '⏳',
  },
};

const Schemes = () => {
  const records = useQuery(api.schemes.get) || [];
  const addRecord = useMutation(api.schemes.add);
  const updateRecord = useMutation(api.schemes.update);
  const deleteRecord = useMutation(api.schemes.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    _id: null, name: '', headOfSection: '', description: '',
    announceDate: '', lastDate: '', status: 'Pending', progress: 0
  });

  const completedCount = records.filter(r => r.status === 'Completed').length;
  const pendingCount   = records.filter(r => r.status === 'Pending').length;
  const total          = records.length;
  const completedPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const pendingPercent   = total === 0 ? 0 : Math.round((pendingCount   / total) * 100);

  const strokeWidth = 14;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashCompleted = circumference - (completedPercent / 100) * circumference;
  const dashPending   = circumference - (pendingPercent   / 100) * circumference;

  const openModal = (record = null) => {
    setFormState(record ? {
      _id: record._id, name: record.name, headOfSection: record.headOfSection,
      description: record.description, announceDate: record.announceDate,
      lastDate: record.lastDate, status: record.status, progress: record.progress || 0
    } : {
      _id: null, name: '', headOfSection: '', description: '',
      announceDate: '', lastDate: '', status: 'Pending', progress: 0
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
      name: formState.name, headOfSection: formState.headOfSection,
      description: formState.description, announceDate: formState.announceDate,
      lastDate: formState.lastDate, status: formState.status,
      progress: parseInt(formState.progress) || 0,
    };
    if (formState._id) await updateRecord({ id: formState._id, ...payload });
    else await addRecord(payload);
    closeModal();
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this scheme?')) await deleteRecord({ id });
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.9rem',
    border: '1.5px solid #c7d2fe', borderRadius: '0.6rem',
    background: 'white', color: '#1e1b4b', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ padding: 0 }}>

      {/* ── Page Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '1.75rem',
        background: THEME.gradient,
        borderRadius: '1.25rem', padding: '1.5rem 2rem',
        boxShadow: `0 8px 32px ${THEME.glow}`,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <Sparkles size={22} color="rgba(255,255,255,0.85)" />
            <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.7rem', margin: 0 }}>Schemes Management</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', margin: 0 }}>
            Track and manage government or internal schemes.
          </p>
        </div>
        <button onClick={() => openModal()} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.7rem 1.4rem',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
          color: 'white', border: '1.5px solid rgba(255,255,255,0.4)',
          borderRadius: '0.7rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'background 0.2s',
        }}>
          <Plus size={16} /> Add Scheme
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Donut Chart Card */}
        <div style={{
          background: 'var(--card-bg)', borderRadius: '1.25rem', padding: '1.75rem',
          border: `2px solid ${THEME.border}`,
          boxShadow: `0 4px 24px ${THEME.glow}`,
          display: 'flex', alignItems: 'center', gap: '2rem',
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem' }}>
              📊 Schemes Status
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Visual breakdown of progress
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: `Completed (${completedCount})`, color: '#059669', icon: '✅' },
                { label: `Pending (${pendingCount})`,     color: '#d97706', icon: '⏳' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600 }}>
                  <span>{item.icon}</span>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ color: 'var(--text-dark)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
            <svg width="150" height="150" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#059669" strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={dashCompleted}
                strokeLinecap="round" transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#d97706" strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={dashPending}
                strokeLinecap="round" transform={`rotate(${(completedPercent / 100) * 360 - 90} 60 60)`}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: THEME.primary }}>{total}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div style={{
          background: 'var(--card-bg)', borderRadius: '1.25rem', padding: '1.75rem',
          border: `2px solid ${THEME.border}`,
          boxShadow: `0 4px 24px ${THEME.glow}`,
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: THEME.primary, marginBottom: '1.25rem' }}>📈 Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Total Schemes', value: total,             bg: THEME.light,   color: THEME.primary,  border: THEME.border   },
              { label: 'Completed Rate',value: `${completedPercent}%`, bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
            ].map(s => (
              <div key={s.label} style={{ padding: '1rem', background: s.bg, borderRadius: '0.85rem', border: `1.5px solid ${s.border}` }}>
                <div style={{ fontSize: '0.78rem', color: s.color, fontWeight: 700, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--text-dark)' }}>📊 Progress Tracker</span>
              <span style={{ color: THEME.primary }}>{completedPercent}%</span>
            </div>
            <div style={{ height: 10, background: '#e0e7ff', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${completedPercent}%`, height: '100%', background: THEME.gradient, borderRadius: 5, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Per-status summary chips ── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_STYLES).map(([status, s]) => (
          <div key={status} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.1rem', borderRadius: '2rem',
            background: s.badge.bg, border: `1.5px solid ${s.badge.border}`,
            fontSize: '0.85rem', fontWeight: 700, color: s.badge.color,
            boxShadow: `0 2px 8px ${s.glow}`,
          }}>
            <span>{s.icon}</span> {status}: {records.filter(r => r.status === status).length}
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={{
        background: 'var(--card-bg)', borderRadius: '1.25rem', overflow: 'hidden',
        border: `2px solid ${THEME.border}`,
        boxShadow: `0 4px 20px ${THEME.glow}`,
      }}>
        {/* Table header strip */}
        <div style={{ padding: '1rem 1.5rem', background: THEME.gradient, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={16} color="white" />
          <h3 style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>All Schemes</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: THEME.light }}>
                {['Scheme Name', 'Head of Section', 'Announce Date', 'Last Date', 'Progress', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800,
                    color: THEME.secondary, textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: `2px solid ${THEME.border}`, textAlign: 'left', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
                      <p style={{ fontStyle: 'italic' }}>No schemes recorded yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record, idx) => {
                  const s = STATUS_STYLES[record.status] || STATUS_STYLES.Pending;
                  const prog = record.progress || 0;
                  return (
                    <tr key={record._id} style={{
                      borderBottom: `1px solid ${THEME.border}`,
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.03)',
                      transition: 'background 0.2s',
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{record.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.description}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '3px 9px', borderRadius: '1rem', background: THEME.light, color: THEME.primary, fontSize: '0.82rem', fontWeight: 600, border: `1px solid ${THEME.border}` }}>
                          {record.headOfSection}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)' }}>📅 {record.announceDate}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)' }}>🗓 {record.lastDate}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 64, height: 7, background: '#e0e7ff', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${prog}%`, height: '100%', background: prog === 100 ? '#059669' : THEME.gradient, borderRadius: 4, transition: 'width 0.4s ease' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.primary }}>{prog}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          padding: '4px 10px', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 700,
                          background: s.badge.bg, color: s.badge.color,
                          border: `1.5px solid ${s.badge.border}`,
                          boxShadow: `0 2px 6px ${s.glow}`,
                        }}>
                          {s.icon} {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => openModal(record)} style={{
                            background: THEME.light, border: `1px solid ${THEME.border}`,
                            borderRadius: '0.4rem', padding: '0.35rem 0.5rem',
                            cursor: 'pointer', color: THEME.primary,
                          }} title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(record._id)} style={{
                            background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: '0.4rem', padding: '0.35rem 0.5rem',
                            cursor: 'pointer', color: '#ef4444',
                          }} title="Delete">
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', width: '100%', maxWidth: 600, boxShadow: '0 30px 60px rgba(99,102,241,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: THEME.gradient, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '1.25rem 1.25rem 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={18} color="white" />
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  {formState._id ? 'Edit Scheme' : 'Add New Scheme'}
                </h2>
              </div>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Scheme Name</label>
                  <input type="text" name="name" value={formState.name} onChange={handleChange} required style={inputStyle} placeholder="Enter scheme name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Head of Section</label>
                  <input type="text" name="headOfSection" value={formState.headOfSection} onChange={handleChange} required style={inputStyle} placeholder="Enter head name" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</label>
                <textarea name="description" value={formState.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Enter scheme description" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Announce Date</label>
                  <input type="date" name="announceDate" value={formState.announceDate} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Last Date</label>
                  <input type="date" name="lastDate" value={formState.lastDate} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</label>
                  <select name="status" value={formState.status} onChange={handleChange} required style={{ ...inputStyle }}>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Completed">✅ Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: THEME.primary, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Progress (%)</label>
                  <input type="number" name="progress" value={formState.progress} onChange={handleChange} min="0" max="100" required style={inputStyle} />
                </div>
              </div>

              <div style={{ background: THEME.light, border: `1.5px solid ${THEME.border}`, borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: THEME.primary, fontWeight: 600 }}>
                📊 Progress Preview:
                <div style={{ marginTop: '0.4rem', height: 8, background: '#e0e7ff', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${formState.progress || 0}%`, height: '100%', background: THEME.gradient, borderRadius: 4, transition: 'width 0.3s' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={closeModal} style={{ padding: '0.65rem 1.25rem', border: '1.5px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-dark)', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.5rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 800, boxShadow: `0 4px 12px ${THEME.glow}` }}>
                  {formState._id ? 'Update Scheme' : 'Save Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
