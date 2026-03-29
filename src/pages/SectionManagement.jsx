import React, { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Plus, X } from 'lucide-react';

const CARD_PALETTES = [
  { border: '#6366f1', header: 'linear-gradient(135deg,#6366f1,#8b5cf6)', light: '#f5f3ff' },
  { border: '#0ea5e9', header: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', light: '#f0f9ff' },
  { border: '#10b981', header: 'linear-gradient(135deg,#10b981,#34d399)', light: '#ecfdf5' },
];

const SectionManagement = () => {
  const [sections, setSections] = useState(() => JSON.parse(localStorage.getItem('sections') || '[]'));
  useEffect(() => localStorage.setItem('sections', JSON.stringify(sections)), [sections]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', head: '', members: '', description: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) { 
      setSections(sections.map(s => s.id === formData.id ? { ...formData } : s));
    } else { 
      setSections([...sections, { ...formData, id: Date.now().toString() }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id) => { if (window.confirm('Delete?')) setSections(sections.filter(s => s.id !== id)); };

  if (isFormOpen) {
    return (
      <div style={{ padding: '2rem', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
        <h2 style={{ color: '#6366f1' }}>Offline Section Entry</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} required />
          <input placeholder="Head" value={formData.head} onChange={e => setFormData({ ...formData, head: e.target.value })} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} required />
          <input placeholder="Members" value={formData.members} onChange={e => setFormData({ ...formData, members: e.target.value })} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} required />
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minHeight: '100px' }} required />
          <button type="submit" style={{ padding: '1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 900 }}>Save Locally</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Section Management</h1>
        <button onClick={() => { setFormData({ id: null, name: '', head: '', members: '', description: '' }); setIsFormOpen(true); }} style={{ padding: '0.75rem 1.25rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 800 }}>+ Add New Section</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {sections.length === 0 ? <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>No sections found in browser storage.</div> :
          sections.map((section, idx) => {
            const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
            return (
              <div key={idx} style={{ background: 'white', borderRadius: '1.1rem', overflow: 'hidden', border: `2px solid ${palette.border}`, boxShadow: `0 4px 20px ${palette.border}25` }}>
                <div style={{ background: palette.header, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontWeight: 700, color: 'white' }}>{section.name}</h3>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => { setFormData({ ...section }); setIsFormOpen(true); }} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0.4rem', cursor: 'pointer', color: 'white' }}><Edit size={14} /></button>
                    <button onClick={() => handleDelete(section.id)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0.4rem', cursor: 'pointer', color: 'white' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.9rem', color: palette.border, fontWeight: 800 }}>Head: {section.head}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{section.description}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SectionManagement;
