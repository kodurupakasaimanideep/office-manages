import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, AlertCircle, X, Clock, Wheat, CheckCircle2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/* ─── Rice Indent Theme Palette ─────────────────────────────────────────── */
const THEME = {
  primary:   '#c8813a',   // warm amber / rice-husk gold
  secondary: '#7c6f3e',   // deep grain brown
  accent:    '#e0a83b',   // bright harvest gold
  pending:   '#d97706',   // amber-600
  approved:  '#15803d',   // green-700
  danger:    '#b91c1c',
  bg1:       'linear-gradient(135deg, #3b2a14 0%, #1e1408 100%)',
  cardGlow:  '0 0 0 1.5px rgba(200,129,58,0.35), 0 8px 32px rgba(0,0,0,0.45)',
};



/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, gradA, gradB, accent }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${gradA} 0%, ${gradB} 100%)`,
      borderRadius: '1rem',
      padding: '1.4rem 1.6rem',
      color: '#fff',
      boxShadow: `0 0 0 1.5px ${accent}55, 0 10px 30px rgba(0,0,0,0.35)`,
      display: 'flex', alignItems: 'center', gap: '1rem',
      position: 'relative', overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 0 0 2px ${accent}99, 0 16px 40px rgba(0,0,0,0.4)`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 0 0 1.5px ${accent}55, 0 10px 30px rgba(0,0,0,0.35)`; }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.18)',
        padding: '0.75rem', borderRadius: '0.75rem',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
        backdropFilter: 'blur(4px)',
      }}>
        <Icon size={26} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85, letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
      </div>
      {/* decorative circle */}
      <div style={{
        position: 'absolute', right: '-1rem', top: '-1rem',
        width: '5rem', height: '5rem',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const RiceIndent = () => {
  const { searchQuery } = useOutletContext() || { searchQuery: '' };

  const indents    = useQuery(api.riceIndents.get) || [];
  const addIndent  = useMutation(api.riceIndents.add);
  const updateIndent = useMutation(api.riceIndents.update);
  const deleteIndent = useMutation(api.riceIndents.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    _id: null,
    hostelName: '',
    pendingHostel: '',
    description: '',
    lastDate: '',
    status: 'Pending'
  });

  const totalIndents    = indents.length;
  const pendingIndents  = indents.filter(i => i.status === 'Pending').length;
  const approvedIndents = indents.filter(i => i.status === 'Approved').length;
  const approvedPercent = totalIndents === 0 ? 0 : Math.round((approvedIndents / totalIndents) * 100);
  const pendingPercent  = totalIndents === 0 ? 0 : Math.round((pendingIndents  / totalIndents) * 100);

  const openModal = (indent = null) => {
    if (indent) {
      setFormState(indent);
    } else {
      setFormState({ _id: null, hostelName: '', pendingHostel: '', description: '', lastDate: '', status: 'Pending' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      hostelName:   formState.hostelName,
      pendingHostel: formState.pendingHostel,
      description:  formState.description,
      lastDate:     formState.lastDate,
      status:       formState.status,
    };
    if (formState._id) {
      await updateIndent({ id: formState._id, ...payload });
    } else {
      await addIndent(payload);
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this indent?')) {
      await deleteIndent({ id });
    }
  };

  const filteredIndents = indents.filter(indent => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      indent.fileName?.toLowerCase().includes(q)     ||
      indent.hostelName?.toLowerCase().includes(q)   ||
      indent.pendingHostel?.toLowerCase().includes(q)||
      indent.description?.toLowerCase().includes(q)  ||
      indent.status?.toLowerCase().includes(q)
    );
  });

  /* ── Styles ──────────────────────────────────────────────────────────── */
  const pageWrap = {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '0 0 2rem',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  const headerBanner = {
    background: 'linear-gradient(135deg, #2d1b0e 0%, #4a2e10 50%, #2d1b0e 100%)',
    borderRadius: '1.25rem',
    padding: '1.8rem 2rem',
    marginBottom: '1.75rem',
    border: '1.5px solid rgba(200,129,58,0.4)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    position: 'relative',
    overflow: 'hidden',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: THEME.accent,
    marginBottom: '0.4rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid rgba(200,129,58,0.35)',
    color: 'var(--text-dark)',
    padding: '0.7rem 0.85rem',
    width: '100%',
    borderRadius: '0.5rem',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={pageWrap}>

      {/* ── Page Header Banner ─── */}
      <div style={headerBanner}>
        {/* left decorative grain lines */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
          background: `linear-gradient(to bottom, ${THEME.primary}, ${THEME.accent}, ${THEME.primary})`,
          borderRadius: '1rem 0 0 1rem',
        }} />

        <div style={{ paddingLeft: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <Wheat size={22} color={THEME.accent} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0,
              background: `linear-gradient(90deg, ${THEME.accent}, #fff)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Rice Indent Management
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0 }}>
            Track &amp; manage rice indent requests across all hostels
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => openModal()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem 1.3rem',
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accent} 100%)`,
              color: '#1a0f05',
              border: 'none', borderRadius: '0.75rem',
              cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
              boxShadow: `0 4px 16px rgba(200,129,58,0.45)`,
              transition: 'transform 0.15s, box-shadow 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            <Plus size={18} /> New Request
          </button>
        </div>
      </div>

      {/* ── Stat Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <StatCard icon={Wheat}        label="TOTAL INDENTS"    value={totalIndents}    gradA="#3b2a14" gradB="#7c4a14" accent={THEME.primary} />
        <StatCard icon={AlertCircle}  label="PENDING"          value={pendingIndents}  gradA="#78350f" gradB="#b45309" accent="#d97706" />
        <StatCard icon={CheckCircle2} label="APPROVED"         value={approvedIndents} gradA="#14532d" gradB="#15803d" accent="#22c55e" />
        <StatCard icon={Building2}    label="COMPLETION RATE"  value={`${approvedPercent}%`} gradA="#1e3a5f" gradB="#1d4ed8" accent="#60a5fa" />
      </div>

      {/* ── Approval Progress Bar ─── */}
      <div style={{
        background: 'var(--card-bg)',
        padding: '1.5rem 1.75rem',
        borderRadius: '1rem',
        border: '1.5px solid rgba(200,129,58,0.25)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        marginBottom: '1.75rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
            📊 Approval Progress
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {approvedIndents} Approved / {pendingIndents} Pending / {totalIndents} Total
          </span>
        </div>

        <div style={{ width: '100%', height: '14px', background: 'rgba(0,0,0,0.12)', borderRadius: '7px', overflow: 'hidden', display: 'flex' }}>
          <div style={{
            width: `${approvedPercent}%`, height: '100%',
            background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)',
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 8px rgba(34,197,94,0.6)',
          }} />
          <div style={{
            width: `${pendingPercent}%`, height: '100%',
            background: 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)',
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 8px rgba(217,119,6,0.5)',
          }} />
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.85rem', fontSize: '0.78rem' }}>
          {[['#22c55e','Approved',approvedPercent+'%'],['#d97706','Pending',pendingPercent+'%']].map(([col,lbl,pct]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col, boxShadow: `0 0 6px ${col}` }} />
              <span>{lbl}</span>
              <span style={{ fontWeight: 700, color: col }}>{pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table ─── */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '1rem',
        border: '1.5px solid rgba(200,129,58,0.25)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}>
        {/* table header strip */}
        <div style={{
          background: 'linear-gradient(90deg, #2d1b0e 0%, #3d2410 100%)',
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          borderBottom: '1.5px solid rgba(200,129,58,0.3)',
        }}>
          <Wheat size={18} color={THEME.accent} />
          <span style={{ fontWeight: 700, color: THEME.accent, letterSpacing: '0.05em', fontSize: '0.9rem' }}>
            INDENT RECORDS
          </span>
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(200,129,58,0.18)',
            border: '1px solid rgba(200,129,58,0.4)',
            color: THEME.accent,
            borderRadius: '50px',
            padding: '2px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            {filteredIndents.length} entries
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(200,129,58,0.06)' }}>
              {['HOSTEL NAME', 'PENDING HOSTEL', 'DESCRIPTION', 'LAST DATE', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} style={{
                  padding: '0.85rem 1rem',
                  fontSize: '0.7rem',
                  color: THEME.primary,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textAlign: 'left',
                  borderBottom: '1px solid rgba(200,129,58,0.2)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredIndents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Wheat size={40} color="rgba(200,129,58,0.3)" />
                    <span>No rice indents found.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredIndents.map((indent, idx) => (
                <tr key={indent._id}
                  style={{
                    borderBottom: '1px solid rgba(200,129,58,0.12)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(200,129,58,0.03)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,129,58,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(200,129,58,0.03)'}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.88rem' }}>{indent.hostelName}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dark)', fontSize: '0.85rem' }}>{indent.pendingHostel}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '180px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{indent.description}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dark)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} color="var(--text-muted)" />
                      {indent.lastDate}
                    </div>
                  </td>
                  {/* STATUS BADGE */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      padding: '4px 14px',
                      borderRadius: '50px',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      ...(indent.status === 'Approved'
                        ? { background: 'rgba(21,128,61,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }
                        : { background: 'rgba(217,119,6,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' })
                    }}>
                      {indent.status === 'Approved' ? '✔ ' : '⏳ '}{indent.status}
                    </span>
                  </td>
                  {/* ACTIONS */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openModal(indent)}
                        style={{
                          background: 'rgba(200,129,58,0.12)',
                          border: '1px solid rgba(200,129,58,0.35)',
                          borderRadius: '0.4rem',
                          padding: '5px 8px',
                          cursor: 'pointer', color: THEME.primary,
                          transition: 'background 0.15s',
                          display: 'flex', alignItems: 'center',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,129,58,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,129,58,0.12)'}
                        title="Edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(indent._id)}
                        style={{
                          background: 'rgba(185,28,28,0.1)',
                          border: '1px solid rgba(185,28,28,0.3)',
                          borderRadius: '0.4rem',
                          padding: '5px 8px',
                          cursor: 'pointer', color: '#f87171',
                          transition: 'background 0.15s',
                          display: 'flex', alignItems: 'center',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(185,28,28,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(185,28,28,0.1)'}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ─── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            background: 'linear-gradient(160deg, #1e1208 0%, #2d1b0e 100%)',
            padding: '2rem',
            borderRadius: '1.25rem',
            width: '100%', maxWidth: '540px',
            boxShadow: `0 0 0 1.5px rgba(200,129,58,0.4), 0 30px 60px rgba(0,0,0,0.6)`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* accent top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent}, ${THEME.primary})`,
            }} />

            {/* modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Wheat size={20} color={THEME.accent} />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {formState._id ? 'Edit Rice Indent' : 'New Rice Indent'}
                </h2>
              </div>
              <button onClick={closeModal} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.4rem', padding: '4px 6px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
                display: 'flex', alignItems: 'center',
              }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* HOSTEL NAME */}
                <div>
                  <label style={labelStyle}>Hostel Name</label>
                  <input
                    type="text" name="hostelName" value={formState.hostelName}
                    onChange={handleChange} required style={inputStyle}
                    placeholder="Enter hostel name"
                    onFocus={e => { e.target.style.borderColor = THEME.accent; e.target.style.boxShadow = `0 0 0 3px rgba(224,168,59,0.2)`; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(200,129,58,0.35)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                {/* PENDING HOSTEL */}
                <div>
                  <label style={labelStyle}>Pending Qty</label>
                  <input
                    type="text" name="pendingHostel" value={formState.pendingHostel}
                    onChange={handleChange} required style={inputStyle}
                    placeholder="e.g. 50kg"
                    onFocus={e => { e.target.style.borderColor = THEME.accent; e.target.style.boxShadow = `0 0 0 3px rgba(224,168,59,0.2)`; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(200,129,58,0.35)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description" value={formState.description}
                  onChange={handleChange} required
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  placeholder="Enter description"
                  onFocus={e => { e.target.style.borderColor = THEME.accent; e.target.style.boxShadow = `0 0 0 3px rgba(224,168,59,0.2)`; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(200,129,58,0.35)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* LAST DATE */}
                <div>
                  <label style={labelStyle}>Last Date</label>
                  <input
                    type="date" name="lastDate" value={formState.lastDate}
                    onChange={handleChange} required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = THEME.accent; e.target.style.boxShadow = `0 0 0 3px rgba(224,168,59,0.2)`; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(200,129,58,0.35)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                {/* STATUS */}
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    name="status" value={formState.status}
                    onChange={handleChange} required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = THEME.accent; e.target.style.boxShadow = `0 0 0 3px rgba(224,168,59,0.2)`; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(200,129,58,0.35)'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Approved">✔ Approved</option>
                  </select>
                </div>
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={closeModal} style={{
                  padding: '0.7rem 1.4rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '0.6rem',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600, fontSize: '0.9rem',
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  padding: '0.7rem 1.6rem',
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accent} 100%)`,
                  border: 'none',
                  borderRadius: '0.6rem',
                  cursor: 'pointer',
                  color: '#1a0f05',
                  fontWeight: 800, fontSize: '0.9rem',
                  boxShadow: `0 4px 16px rgba(200,129,58,0.45)`,
                  transition: 'transform 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  {formState._id ? '✔ Update Request' : '+ Save Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiceIndent;
