import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Receipt, Calendar, MapPin, Package, IndianRupee, PartyPopper, Eye } from 'lucide-react';

/* ─── Colour Palette for Jayantis ─────────────────────────────── */
const THEME = {
  primary:    '#d97706',   // warm amber
  secondary:  '#b45309',
  accent:     '#fbbf24',
  saffron:    '#f59e0b',
  deep:       '#78350f',
  light:      '#fffbeb',
  border:     '#fcd34d',
  gradient:   'linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)',
  cardBg:     'var(--card-bg)',
};

/* ─── Default Form ─────────────────────────────────────────────── */
const defaultEvent = () => ({
  _id: null,
  eventName: '',
  date: '',
  place: '',
  items: [],          // [{ name, amount }]
  totalAmount: 0,
});

const defaultItem = () => ({ name: '', amount: '' });

/* ─── Bill Modal ───────────────────────────────────────────────── */
function BillModal({ event, onClose }) {
  const total = event.items.reduce((s, i) => s + Number(i.amount || 0), 0);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', width: '100%', maxWidth: '480px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        {/* Bill Header */}
        <div style={{ background: THEME.gradient, padding: '1.5rem', textAlign: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🪔</div>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{event.eventName}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0', fontSize: '0.82rem' }}>📅 {event.date} &nbsp;|&nbsp; 📍 {event.place}</p>
        </div>

        {/* Bill Receipt styling */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ borderTop: '2px dashed var(--border)', borderBottom: '2px dashed var(--border)', padding: '1rem 0', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ flex: 1 }}>Item</span>
              <span>Amount (₹)</span>
            </div>
            {event.items.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>No items added</div>
            ) : (
              event.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', fontSize: '0.9rem', borderBottom: i < event.items.length - 1 ? '1px dotted var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--text-dark)' }}>{item.name}</span>
                  <span style={{ fontWeight: 600, color: THEME.primary }}>₹{Number(item.amount || 0).toLocaleString('en-IN')}</span>
                </div>
              ))
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>TOTAL AMOUNT</span>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: THEME.primary }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Item Entry Form Inside Event Modal ───────────────────────── */
function ItemsEditor({ items, onChange }) {
  const addItem = () => onChange([...items, defaultItem()]);
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item);
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>Items Required</label>
        <button type="button" onClick={addItem} style={{ background: THEME.saffron, color: 'white', border: 'none', borderRadius: '0.4rem', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Plus size={12} /> Add Item
        </button>
      </div>
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1px dashed var(--border)', borderRadius: '0.5rem' }}>
          No items yet. Click "Add Item" above.
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <input
            type="text"
            placeholder="Item name"
            value={item.name}
            onChange={e => updateItem(i, 'name', e.target.value)}
            style={{ flex: 2, padding: '0.5rem 0.65rem', border: '1px solid var(--border)', borderRadius: '0.4rem', fontSize: '0.85rem', background: 'var(--card-bg)', color: 'var(--text-dark)' }}
          />
          <input
            type="number"
            placeholder="₹ Amount"
            value={item.amount}
            onChange={e => updateItem(i, 'amount', e.target.value)}
            min="0"
            style={{ flex: 1, padding: '0.5rem 0.65rem', border: '1px solid var(--border)', borderRadius: '0.4rem', fontSize: '0.85rem', background: 'var(--card-bg)', color: 'var(--text-dark)' }}
          />
          <button type="button" onClick={() => removeItem(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: '0.4rem', color: '#ef4444', cursor: 'pointer', padding: '0 0.5rem' }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Jayantis Page ───────────────────────────────────────── */
const Jayantis = () => {
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jayantis_events') || '[]'); } catch { return []; }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultEvent());
  const [viewBill, setViewBill] = useState(null);

  useEffect(() => { localStorage.setItem('jayantis_events', JSON.stringify(events)); }, [events]);

  // Summary stats
  const thisMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const eventsThisMonth = events.filter(e => e.date && e.date.startsWith(thisMonth)).length;
  const totalExpenditure = events.reduce((s, e) => s + Number(e.totalAmount || 0), 0);

  const openAdd = () => { setForm(defaultEvent()); setIsModalOpen(true); };
  const openEdit = (evt) => { setForm({ ...evt, items: evt.items ? [...evt.items.map(i => ({ ...i }))] : [] }); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleItemsChange = (items) => {
    const total = items.reduce((s, i) => s + Number(i.amount || 0), 0);
    setForm(prev => ({ ...prev, items, totalAmount: total }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const total = form.items.reduce((s, i) => s + Number(i.amount || 0), 0);
    const payload = { ...form, totalAmount: total };
    if (form._id) {
      setEvents(prev => prev.map(ev => ev._id === form._id ? payload : ev));
    } else {
      setEvents(prev => [...prev, { ...payload, _id: Date.now().toString() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this event?')) setEvents(prev => prev.filter(e => e._id !== id));
  };

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.75rem',
    border: '1px solid var(--border)', borderRadius: '0.5rem',
    background: 'var(--card-bg)', color: 'var(--text-dark)',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' };

  return (
    <div style={{ padding: 0 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🪔</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: THEME.primary, margin: 0 }}>Jayantis</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage festive events, items, expenditure and bills.</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '0.65rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(217,119,6,0.35)' }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Events', value: events.length, icon: '🎉', bg: 'linear-gradient(135deg,#d97706,#b45309)', glow: 'rgba(217,119,6,0.25)' },
          { label: 'Events This Month', value: eventsThisMonth, icon: '📅', bg: 'linear-gradient(135deg,#7c3aed,#5b21b6)', glow: 'rgba(124,58,237,0.2)' },
          { label: 'Total Expenditure', value: `₹${totalExpenditure.toLocaleString('en-IN')}`, icon: '💰', bg: 'linear-gradient(135deg,#059669,#065f46)', glow: 'rgba(5,150,105,0.2)' },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: '1rem', padding: '1.25rem 1.5rem', boxShadow: `0 4px 20px ${stat.glow}`, color: 'white' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Events Table ── */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', overflow: 'hidden', border: `2px solid ${THEME.border}`, boxShadow: '0 4px 16px rgba(217,119,6,0.08)' }}>
        {/* Table Header */}
        <div style={{ padding: '1rem 1.5rem', background: THEME.gradient, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <PartyPopper size={18} color="white" />
          <h3 style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: 700 }}>Event Details</h3>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🪔</div>
            <p style={{ fontStyle: 'italic' }}>No events yet. Click "Add Event" to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: THEME.light }}>
                  {['Event Name', 'Date', 'Place', 'Items Required', 'Amount (₹)', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: THEME.secondary, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `2px solid ${THEME.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((evt, idx) => {
                  const itemNames = evt.items && evt.items.length > 0
                    ? evt.items.map(i => i.name).filter(Boolean).join(', ')
                    : '—';
                  return (
                    <tr key={evt._id} style={{ borderBottom: `1px solid ${THEME.border}`, background: idx % 2 === 0 ? 'transparent' : 'rgba(251,191,36,0.04)' }}>
                      {/* Event Name */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '1rem' }}>🎊</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{evt.eventName}</span>
                        </div>
                      </td>
                      {/* Date */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={13} color={THEME.primary} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{evt.date || '—'}</span>
                        </div>
                      </td>
                      {/* Place */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} color={THEME.primary} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{evt.place || '—'}</span>
                        </div>
                      </td>
                      {/* Items */}
                      <td style={{ padding: '0.9rem 1rem', maxWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                          <Package size={13} color={THEME.primary} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-dark)', wordBreak: 'break-word' }}>
                            {itemNames}
                            {evt.items && evt.items.length > 0 && (
                              <span style={{ marginLeft: '0.3rem', background: THEME.border, color: THEME.deep, borderRadius: '10px', padding: '1px 6px', fontSize: '0.72rem', fontWeight: 700 }}>
                                {evt.items.length}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      {/* Amount */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: THEME.primary, fontSize: '0.95rem' }}>₹{Number(evt.totalAmount || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => setViewBill(evt)} title="View Bill" style={{ background: '#fffbeb', border: `1px solid ${THEME.border}`, borderRadius: '0.4rem', padding: '0.35rem 0.5rem', cursor: 'pointer', color: THEME.primary, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: 600 }}>
                            <Eye size={13} /> Bill
                          </button>
                          <button onClick={() => openEdit(evt)} title="Edit" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.4rem', padding: '0.35rem 0.45rem', cursor: 'pointer', color: '#3b82f6' }}>
                            <Edit size={13} />
                          </button>
                          <button onClick={() => handleDelete(evt._id)} title="Delete" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.4rem', padding: '0.35rem 0.45rem', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', width: '100%', maxWidth: '580px', boxShadow: '0 30px 60px rgba(0,0,0,0.25)', maxHeight: '92vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', background: THEME.gradient, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '1.25rem 1.25rem 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🪔</span>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{form._id ? 'Edit Event' : 'Add New Event'}</h2>
              </div>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Event Name */}
              <div>
                <label style={labelStyle}>Event / Jayanti Name</label>
                <input type="text" name="eventName" value={form.eventName} onChange={handleChange} required style={inputStyle} placeholder="e.g. Ganesh Utsav, Ambedkar Jayanti" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Date */}
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
                </div>
                {/* Place */}
                <div>
                  <label style={labelStyle}>Place / Venue</label>
                  <input type="text" name="place" value={form.place} onChange={handleChange} required style={inputStyle} placeholder="e.g. Main Hall, Amphitheatre" />
                </div>
              </div>

              {/* Items */}
              <ItemsEditor items={form.items} onChange={handleItemsChange} />

              {/* Total (readonly) */}
              <div style={{ background: THEME.light, border: `2px solid ${THEME.border}`, borderRadius: '0.65rem', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: THEME.deep, fontSize: '0.9rem' }}>Total Expenditure</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: THEME.primary }}>₹{form.items.reduce((s, i) => s + Number(i.amount || 0), 0).toLocaleString('en-IN')}</span>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={closeModal} style={{ padding: '0.65rem 1.25rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-dark)', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.5rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(217,119,6,0.3)' }}>{form._id ? 'Update Event' : 'Save Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bill View Modal ── */}
      {viewBill && <BillModal event={viewBill} onClose={() => setViewBill(null)} />}
    </div>
  );
};

export default Jayantis;
