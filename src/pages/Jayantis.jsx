import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Receipt, Calendar, MapPin, Package, IndianRupee, PartyPopper, Eye, Sparkles, Star } from 'lucide-react';

const THEME = {
  primary: '#d97706',
  gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  saffron: '#f97316',
  light: '#fffbeb',
  border: '#fde68a',
  glow: 'rgba(217,119,6,0.2)'
};

const Jayantis = () => {
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('jayantis') || '[]'));
  useEffect(() => { localStorage.setItem('jayantis', JSON.stringify(events)); }, [events]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, eventName: '', date: '', place: '', amount: 0 });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.id) { setEvents(events.map(e => e.id === form.id ? form : e)); } 
    else { setEvents([...events, { ...form, id: Date.now().toString() }]); }
    setIsModalOpen(false);
  };

  const deleteEvent = (id) => { if (window.confirm('Delete event?')) setEvents(events.filter(e => e.id !== id)); };

  const inputStyle = { width: '100%', padding:'0.85rem 1rem', border:'2px solid #fde68a', borderRadius:'0.75rem', background:'white', color:'#451a03', outline: 'none', fontWeight: 600, fontSize: '0.95rem' };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ 
        background: THEME.gradient, 
        padding: '2.5rem 3rem', 
        borderRadius: '2rem', 
        color: 'white', 
        marginBottom: '2.5rem',
        boxShadow: '0 15px 35px rgba(180,83,9,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <PartyPopper size={32} color="#fef3c7" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Cultural Celebrations</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500, maxWidth: '600px' }}>Tracking expenditures and event details for departmental Jayantis and festivals.</p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{events.length}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>EVENTS TRACKED</div>
            </div>
            <div style={{ width: '2px', background: 'rgba(255,255,255,0.2)', height: '4rem' }} />
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹{events.reduce((s,e) => s + Number(e.amount || 0), 0).toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>TOTAL EXPENDITURE</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '-4rem', top: '-2rem', opacity: 0.1 }}>
          <Star size={300} fill="white" />
        </div>
      </div>

      <div className="glass-card" style={{ borderRadius: '1.5rem', overflow: 'hidden', border: `2px solid ${THEME.border}`, boxShadow: `0 10px 30px ${THEME.glow}` }}>
        <div style={{ padding: '1.5rem 2rem', background: THEME.light, borderBottom: `2px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={20} color={THEME.primary} />
            <h3 style={{ margin: 0, fontWeight: 900, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Event Registry</h3>
          </div>
          <button onClick={() => { setForm({ id: null, eventName: '', date: '', place: '', amount: 0 }); setIsModalOpen(true); }} style={{ 
            padding: '0.75rem 1.5rem', 
            background: THEME.gradient, 
            color: 'white', 
            border: 'none', 
            borderRadius: '1rem', 
            fontWeight: 800, 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(180,83,9,0.2)'
          }}>+ Add Celebration</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fffbeb' }}>
                {['Event Name', 'Date & Venue', 'Expenditure (₹)', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 900, color: '#92400e', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#92400e', fontStyle: 'italic' }}>No celebrations recorded yet.</td></tr> :
                events.map((e, index) => (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${THEME.border}`, background: index % 2 === 0 ? 'white' : '#fffcf1' }}>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '1rem', color: THEME.primary }}><PartyPopper size={24} /></div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#451a03' }}>{e.eventName}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e' }}>{e.date}</div>
                      <div style={{ fontSize: '0.8rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}><MapPin size={12} /> {e.place}</div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: THEME.primary }}>₹{Number(e.amount).toLocaleString('en-IN')}</div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => { setForm(e); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={20} /></button>
                        <button onClick={() => deleteEvent(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(69,26,3,0.3)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', width: '500px', background: 'white', border: `2px solid ${THEME.border}` }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 900, color: THEME.primary, display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Sparkles size={28}/> {form.id ? 'Modify' : 'Schedule'} Event</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#92400e', marginBottom: '0.6rem', textTransform: 'uppercase' }}>General Information</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input placeholder="Event Name (e.g. Ambedkar Jayanti)" value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} style={inputStyle} required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} required />
                    <input placeholder="Venue/Place" value={form.place} onChange={e => setForm({ ...form, place: e.target.value })} style={inputStyle} required />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#92400e', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Financial Details</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" placeholder="Total Expenditure Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ ...inputStyle, paddingLeft: '2.5rem' }} required />
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: THEME.primary }}>₹</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 2, padding: '1rem', background: THEME.gradient, color: 'white', border: 'none', borderRadius: '1rem', cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem' }}>Record Event</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', border: `2px solid ${THEME.border}`, borderRadius: '1rem', cursor: 'pointer', fontWeight: 800, color: '#92400e' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jayantis;
