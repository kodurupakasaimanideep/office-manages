import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Landmark } from 'lucide-react';

const defaultForm = () => ({
  _id: null,
  college: '',
  sectionIncharge: '',
  lastDate: '',
  progress: 0,
  status: 'Pending',
});

const BankConfirmations = () => {
  const [records, setRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bank_confirmations') || '[]'); } catch { return []; }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm());

  useEffect(() => { localStorage.setItem('bank_confirmations', JSON.stringify(records)); }, [records]);

  const completedCount = records.filter(r => r.status === 'Completed').length;
  const pendingCount = records.filter(r => r.status === 'Pending').length;
  const total = records.length;
  const avgProgress = total === 0 ? 0 : Math.round(records.reduce((s, r) => s + Number(r.progress || 0), 0) / total);

  // Donut chart
  const stroke = 10;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const completedPct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const offset = circ - (completedPct / 100) * circ;

  const openAdd = () => { setForm(defaultForm()); setIsModalOpen(true); };
  const openEdit = (r) => { setForm({ ...r }); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (form._id) {
      setRecords(prev => prev.map(r => r._id === form._id ? { ...form } : r));
    } else {
      setRecords(prev => [...prev, { ...form, _id: Date.now().toString() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) setRecords(prev => prev.filter(r => r._id !== id));
  };

  const inputStyle = { width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: 'var(--card-bg)', color: 'var(--text-dark)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>Bank Confirmations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track bank confirmation status across colleges.</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.1rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          <Plus size={16} /> Add Record
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Donut card */}
        <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', padding: '1.5rem', border: '2px solid #7dd3fc', boxShadow: '0 4px 16px rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>Overall Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#22c55e' }} />
                <span style={{ color: 'var(--text-dark)' }}>Completed: {completedCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f97316' }} />
                <span style={{ color: 'var(--text-dark)' }}>Pending: {pendingCount}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Total: {total}</div>
            </div>
          </div>
          <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
            {total === 0 ? (
              <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.75rem', textAlign: 'center' }}>No Data</div>
            ) : (
              <>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="#22c55e" strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>{completedPct}%</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>done</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Avg progress card */}
        <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', padding: '1.5rem', border: '2px solid #c4b5fd', boxShadow: '0 4px 16px rgba(139,92,246,0.08)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-dark)' }}>Average Progress</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
            <span>All Records</span>
            <span style={{ fontWeight: 700, color: '#8b5cf6' }}>{avgProgress}%</span>
          </div>
          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: `${avgProgress}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.4s', borderRadius: '5px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: '#f0fdf4', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Completed</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#166534' }}>{completedCount}</div>
            </div>
            <div style={{ background: '#fff7ed', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600 }}>Pending</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#9a3412' }}>{pendingCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'linear-gradient(90deg,#0ea5e9,#6366f1)' }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: 700 }}>Bank Confirmation Records</h3>
        </div>
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No bank confirmation records yet. Click "Add Record" above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['College', 'Section Incharge', 'Last Date', 'Progress', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', textAlign: 'left', background: 'var(--card-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{r.college}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dark)', fontSize: '0.85rem' }}>{r.sectionIncharge}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{r.lastDate}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
                        <div style={{ flex: 1, height: '7px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${Number(r.progress) || 0}%`, height: '100%', background: Number(r.progress) >= 100 ? '#22c55e' : '#0ea5e9', borderRadius: '3px', transition: 'width 0.4s' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0ea5e9', minWidth: '32px' }}>{r.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600, background: r.status === 'Completed' ? '#dcfce7' : r.status === 'In Progress' ? '#dbeafe' : '#ffedd5', color: r.status === 'Completed' ? '#166534' : r.status === 'In Progress' ? '#1e40af' : '#9a3412' }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }} title="Edit"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(r._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{form._id ? 'Edit' : 'Add'} Bank Confirmation</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>College Name</label>
                <input type="text" name="college" value={form.college} onChange={handleChange} required style={inputStyle} placeholder="Enter college name" />
              </div>
              <div>
                <label style={labelStyle}>Section Incharge</label>
                <input type="text" name="sectionIncharge" value={form.sectionIncharge} onChange={handleChange} required style={inputStyle} placeholder="Enter incharge name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Last Date</label>
                  <input type="date" name="lastDate" value={form.lastDate} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Progress (%)</label>
                  <input type="number" name="progress" value={form.progress} onChange={handleChange} min="0" max="100" required style={inputStyle} />
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
                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>{form._id ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankConfirmations;
