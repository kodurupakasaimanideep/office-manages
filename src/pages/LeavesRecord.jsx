import React, { useState } from 'react';
import { Edit, Trash2, Leaf, PlusCircle } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/* ─── Leave Type Theming ────────────────────────────────────── */
const LEAVE_THEMES = {
  'Sick Leave':    { gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', light: '#fef2f2', border: '#fca5a5', color: '#dc2626', glow: 'rgba(239,68,68,0.2)',   icon: '🤒' },
  'Casual Leave':  { gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', light: '#eff6ff', border: '#93c5fd', color: '#2563eb', glow: 'rgba(59,130,246,0.2)',  icon: '☀️' },
  'Earned Leave':  { gradient: 'linear-gradient(135deg,#10b981,#059669)', light: '#d1fae5', border: '#6ee7b7', color: '#059669', glow: 'rgba(16,185,129,0.2)',  icon: '🌿' },
  'Unpaid Leave':  { gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', light: '#ede9fe', border: '#c4b5fd', color: '#7c3aed', glow: 'rgba(139,92,246,0.2)',  icon: '⚠️' },
};

const STATUS_THEME = {
  Approved: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7', icon: '✅' },
  Pending:  { bg: '#fef3c7', color: '#92400e', border: '#fcd34d', icon: '⏳' },
  Rejected: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', icon: '❌' },
};

const HEADER_GRADIENT = 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)';
const HEADER_GLOW     = 'rgba(34,197,94,0.25)';

const getLeaveTheme = t => LEAVE_THEMES[t] || LEAVE_THEMES['Casual Leave'];

const LeavesRecord = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [year, setYear] = useState('2026');

  const rawLeaves = useQuery(api.leavesRecords.get) || [];
  const leaves = rawLeaves.map(l => ({ ...l, id: l._id }));
  const addLeave = useMutation(api.leavesRecords.add);
  const updateLeave = useMutation(api.leavesRecords.update);
  const removeLeave = useMutation(api.leavesRecords.remove);

  const [formState, setFormState] = useState({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' });

  const handleEdit = leave => {
    setActiveTab('post');
    setFormState({ id: leave.id, type: leave.type, startDate: leave.startDate, endDate: leave.endDate, days: leave.days, reason: leave.reason });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this leave record?')) {
      await removeLeave({ id });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    if (formState.id) {
      const { id, ...rest } = formState;
      await updateLeave({ id, ...rest });
    } else {
      const { id, ...rest } = formState;
      await addLeave({ ...rest, status: 'Pending' });
    }
    setFormState({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' });
    setActiveTab('summary');
  };

  const totalLeavesUsed = leaves.reduce((sum, l) => sum + parseInt(l.days || 0), 0);
  const totalLimit = 30;
  const remaining = Math.max(0, totalLimit - totalLeavesUsed);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const leavesThisMonth  = leaves.reduce((sum, l) => {
    if (!l.startDate) return sum;
    const d = new Date(l.startDate), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      ? sum + parseInt(l.days || 0) : sum;
  }, 0);

  // counts per type
  const typeCounts = Object.keys(LEAVE_THEMES).map(t => ({
    type: t, count: leaves.filter(l => l.type === t).reduce((s, l) => s + parseInt(l.days || 0), 0)
  }));

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.9rem',
    border: '1.5px solid #bbf7d0', borderRadius: '0.6rem',
    background: 'white', color: '#14532d', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: 0 }}>

      {/* ── Banner Header ── */}
      <div style={{
        background: HEADER_GRADIENT, borderRadius: '1.25rem', padding: '1.5rem 2rem',
        marginBottom: '1.75rem', boxShadow: `0 8px 32px ${HEADER_GLOW}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <Leaf size={22} color="rgba(255,255,255,0.9)" />
            <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.7rem', margin: 0 }}>Leaves Record</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', margin: 0 }}>
            Manage your leaves and view history.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'white', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{totalLeavesUsed}</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem' }}>Days Used / {totalLimit} Limit</div>
        </div>
      </div>

      {/* ── Leave type mini-chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {typeCounts.map(({ type, count }) => {
          const th = getLeaveTheme(type);
          return (
            <div key={type} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '2rem',
              background: th.light, border: `1.5px solid ${th.border}`,
              fontSize: '0.82rem', fontWeight: 700, color: th.color,
              boxShadow: `0 2px 8px ${th.glow}`,
            }}>
              <span>{th.icon}</span> {type}: <strong>{count}d</strong>
            </div>
          );
        })}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #bbf7d0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['summary','post'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'post') setFormState({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' });
              }}
              style={{
                background: 'none', border: 'none', padding: '0.5rem 0',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                color: activeTab === tab ? '#16a34a' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '3px solid #16a34a' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'summary' ? '📋 View Leaves Summary' : '➕ Post New Leave'}
            </button>
          ))}
        </div>
        {activeTab === 'summary' && (
          <div style={{ marginBottom: '0.5rem' }}>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: '1.5px solid #bbf7d0', outline: 'none', cursor: 'pointer', background: 'white', color: '#14532d', fontWeight: 600 }}>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'summary' ? (
        <>
          {/* ── Summary Cards ── */}
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { label: `Total Leaves Taken (${year})`, value: totalLeavesUsed, sub: `Days in ${year}`,      gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', glow: 'rgba(59,130,246,0.25)',  icon: '📅' },
              { label: 'Remaining Leaves',              value: remaining,       sub: `Out of ${totalLimit}`, gradient: 'linear-gradient(135deg,#10b981,#065f46)', glow: 'rgba(16,185,129,0.25)', icon: '🌿' },
              { label: `This Month (${currentMonthName})`, value: leavesThisMonth, sub: 'Days this month',   gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', glow: 'rgba(245,158,11,0.25)',  icon: '☀️' },
            ].map(card => (
              <div key={card.label} style={{
                flex: 1, minWidth: 160,
                background: card.gradient, borderRadius: '1.1rem', padding: '1.4rem 1.6rem',
                boxShadow: `0 4px 20px ${card.glow}`, color: 'white',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{card.icon}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: 600, marginBottom: '0.3rem' }}>{card.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.2rem' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Usage Analysis ── */}
          <div style={{
            background: 'var(--card-bg)', padding: '1.75rem', borderRadius: '1.25rem',
            border: '2px solid #bbf7d0', boxShadow: '0 4px 24px rgba(34,197,94,0.12)', marginBottom: '2rem',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              📊 Leave Usage Analysis
            </h3>

            {/* Yearly quota bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.45rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--text-dark)' }}>📅 Yearly Quota ({year})</span>
                <span style={{ color: '#2563eb' }}>{totalLeavesUsed} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {totalLimit} Days Used</span></span>
              </div>
              <div style={{ width: '100%', height: 10, background: '#dbeafe', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((totalLeavesUsed / totalLimit) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg,#3b82f6,#1d4ed8)', borderRadius: 5, transition: 'width 0.5s' }} />
              </div>
            </div>

            {/* Per leave type bars */}
            {typeCounts.map(({ type, count }) => {
              const th  = getLeaveTheme(type);
              const pct = Math.min((count / totalLimit) * 100, 100);
              return (
                <div key={type} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-dark)' }}>{th.icon} {type}</span>
                    <span style={{ color: th.color }}>{count}d</span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: th.light, borderRadius: 4, overflow: 'hidden', border: `1px solid ${th.border}` }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: th.gradient, borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Leaves Table ── */}
          <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', overflow: 'hidden', border: '2px solid #bbf7d0', boxShadow: '0 4px 20px rgba(34,197,94,0.1)' }}>
            <div style={{ padding: '1rem 1.5rem', background: HEADER_GRADIENT, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Leaf size={16} color="white" />
                <h3 style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Recent Leaves</h3>
              </div>
              <button onClick={() => { setActiveTab('post'); setFormState({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' }); }} style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.9rem',
                background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '0.5rem', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
              }}>
                <PlusCircle size={13} /> Add Leave
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f0fdf4' }}>
                    {['Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #bbf7d0', textAlign: 'left', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 ? (
                    <tr><td colSpan="7"><div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No leaves recorded yet.</div></td></tr>
                  ) : (
                    leaves.map((leave, idx) => {
                      const th  = getLeaveTheme(leave.type);
                      const sth = STATUS_THEME[leave.status] || STATUS_THEME.Pending;
                      return (
                        <tr key={leave.id} style={{ borderBottom: '1px solid #bbf7d0', background: idx % 2 === 0 ? 'transparent' : 'rgba(34,197,94,0.03)' }}>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                              padding: '4px 10px', borderRadius: '1rem', fontSize: '0.82rem', fontWeight: 700,
                              background: th.light, color: th.color, border: `1.5px solid ${th.border}`,
                              boxShadow: `0 2px 6px ${th.glow}`,
                            }}>
                              {th.icon} {leave.type}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)' }}>📅 {leave.startDate}</td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)' }}>🗓 {leave.endDate}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ background: th.light, color: th.color, border: `1.5px solid ${th.border}`, padding: '3px 10px', borderRadius: '1rem', fontSize: '0.82rem', fontWeight: 800 }}>
                              {leave.days}d
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {leave.reason}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                              padding: '4px 10px', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 700,
                              background: sth.bg, color: sth.color,
                              border: `1.5px solid ${sth.border}`,
                            }}>
                              {sth.icon} {leave.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button onClick={() => handleEdit(leave)} style={{ background: th.light, border: `1px solid ${th.border}`, borderRadius: '0.4rem', padding: '0.35rem 0.5rem', cursor: 'pointer', color: th.color }}>
                                <Edit size={14} />
                              </button>
                              <button onClick={() => handleDelete(leave.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.4rem', padding: '0.35rem 0.5rem', cursor: 'pointer', color: '#ef4444' }}>
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
        </>
      ) : (
        /* ── Leave Form ── */
        <div style={{
          background: 'var(--card-bg)', borderRadius: '1.25rem', overflow: 'hidden',
          border: '2px solid #bbf7d0', boxShadow: '0 4px 24px rgba(34,197,94,0.15)', maxWidth: 620,
        }}>
          <div style={{ padding: '1rem 1.5rem', background: HEADER_GRADIENT, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Leaf size={16} color="white" />
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
              {formState.id ? '✏️ Edit Leave' : '➕ Post New Leave'}
            </h2>
          </div>

          <form onSubmit={handleSave} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Leave Type</label>
              <select name="type" value={formState.type} onChange={handleChange} required style={inputStyle}>
                {Object.entries(LEAVE_THEMES).map(([t, th]) => <option key={t} value={t}>{th.icon} {t}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Start Date</label>
                <input type="date" name="startDate" value={formState.startDate} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>End Date</label>
                <input type="date" name="endDate" value={formState.endDate} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Number of Days</label>
              <input type="number" name="days" value={formState.days} onChange={handleChange} required min="1" style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reason for Leave</label>
              <textarea name="reason" value={formState.reason} onChange={handleChange} required style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Write why you are taking leave..." />
            </div>

            {/* Preview badge */}
            {formState.type && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: getLeaveTheme(formState.type).light, border: `1.5px solid ${getLeaveTheme(formState.type).border}`, borderRadius: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{getLeaveTheme(formState.type).icon}</span>
                <span style={{ fontWeight: 700, color: getLeaveTheme(formState.type).color, fontSize: '0.85rem' }}>{formState.type} — {formState.days || 1} day(s)</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => { setActiveTab('summary'); setFormState({ id: null, type: 'Sick Leave', startDate: '', endDate: '', days: 1, reason: '' }); }} style={{ padding: '0.7rem 1.4rem', border: '1.5px solid #bbf7d0', background: 'white', color: '#16a34a', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: '0.7rem 1.6rem', background: HEADER_GRADIENT, color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}>
                {formState.id ? '✅ Update Leave' : '📤 Submit Leave'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeavesRecord;
