import React, { useState } from 'react';
import { Users, Edit, Trash2, Upload, Plus, X, FileText, Eye } from 'lucide-react';

// Beautiful color palette for section cards
const CARD_PALETTES = [
  { border: '#6366f1', header: 'linear-gradient(135deg,#6366f1,#8b5cf6)', light: '#f5f3ff' },
  { border: '#0ea5e9', header: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', light: '#f0f9ff' },
  { border: '#10b981', header: 'linear-gradient(135deg,#10b981,#34d399)', light: '#ecfdf5' },
  { border: '#f59e0b', header: 'linear-gradient(135deg,#f59e0b,#fbbf24)', light: '#fffbeb' },
  { border: '#ef4444', header: 'linear-gradient(135deg,#ef4444,#f87171)', light: '#fef2f2' },
  { border: '#ec4899', header: 'linear-gradient(135deg,#ec4899,#f9a8d4)', light: '#fdf2f8' },
];

const SectionManagement = () => {
  const [sections, setSections] = useState([
    { id: '1', name: 'Scholarship', head: 'K Suresh', members: '1 Staff', description: 'for doing sclolar ship' },
    { id: '2', name: 'Test Section Name', head: 'Test Head', members: '5 Staff', description: 'Test Description for section.' },
    { id: '3', name: 'IT DeptIT Dept', head: 'RaviRavi', members: '55 Staff', description: 'IT Department' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', head: '', members: '', description: '' });

  const handleAddClick = () => { setFormData({ id: null, name: '', head: '', members: '', description: '' }); setIsFormOpen(true); };
  const handleEditClick = (section) => { setFormData({ ...section }); setIsFormOpen(true); };
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) setSections(sections.filter(s => s.id !== id));
  };
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      setSections(prev => prev.map(s => s.id === formData.id ? { ...s, ...formData } : s));
    } else {
      setSections([...sections, { ...formData, id: Date.now().toString(), files: [] }]);
    }
    setIsFormOpen(false);
  };
  const handleFileUpload = (e, sectionId) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 200 * 1024) { alert("File size exceeds 200KB limit."); e.target.value = null; return; }
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, files: [...(s.files || []), file.name] } : s));
    alert(`Document "${file.name}" uploaded successfully!`);
    e.target.value = null;
  };
  const handleDeleteFile = (sectionId, fileIndex) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setSections(prev => prev.map(s => {
        if (s.id === sectionId) { const newFiles = [...s.files]; newFiles.splice(fileIndex, 1); return { ...s, files: newFiles }; }
        return s;
      }));
    }
  };
  const handleEditFile = (sectionId, fileIndex, currentName) => {
    const newName = window.prompt("Edit file name:", currentName);
    if (newName && newName.trim() !== "") {
      setSections(prev => prev.map(s => {
        if (s.id === sectionId) { const newFiles = [...s.files]; newFiles[fileIndex] = newName.trim(); return { ...s, files: newFiles }; }
        return s;
      }));
    }
  };
  const handleViewFile = (fileName) => alert(`Viewing file contents for: ${fileName}`);

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-dark)', boxSizing: 'border-box' };

  if (isFormOpen) {
    return (
      <div style={{ padding: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{formData.id ? 'Edit Section' : 'Add New Section'}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Fill details to manage sections.</p>
          </div>
          <button onClick={() => setIsFormOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-dark)' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)', maxWidth: '600px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Section Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} placeholder="e.g. IT Department" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Head of the Department</label>
              <input type="text" name="head" value={formData.head} onChange={handleInputChange} required style={inputStyle} placeholder="e.g. John Doe" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Total Members</label>
              <input type="text" name="members" value={formData.members} onChange={handleInputChange} required style={inputStyle} placeholder="e.g. 5 Staff" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>What the section is (Description)</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Brief description about the section..." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', fontWeight: 500, color: 'var(--text-dark)' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>{formData.id ? 'Save Changes' : 'Add Section'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>Section Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Organize office departments and members.</p>
        </div>
        <button onClick={handleAddClick} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}>
          <Plus size={18} /> Add New Section
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {sections.map((section, idx) => {
          const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
          return (
            <div key={section.id}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '1.1rem',
                overflow: 'hidden',
                boxShadow: `0 4px 20px ${palette.border}25`,
                border: `2px solid ${palette.border}`,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${palette.border}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${palette.border}25`; }}
            >
              {/* Gradient header */}
              <div style={{ background: palette.header, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.25)', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}>
                    <Users size={18} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'white' }}>{section.name}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => handleEditClick(section)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0.4rem', cursor: 'pointer', color: 'white', padding: '4px 6px', display: 'flex' }} title="Edit">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDeleteClick(section.id)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0.4rem', cursor: 'pointer', color: 'white', padding: '4px 6px', display: 'flex' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: palette.light, borderRadius: '0.5rem', border: `1px solid ${palette.border}30` }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Head of Section</span>
                  <span style={{ fontWeight: 700, color: palette.border, fontSize: '0.9rem' }}>{section.head}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: palette.light, borderRadius: '0.5rem', border: `1px solid ${palette.border}30` }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Total Members</span>
                  <span style={{ fontWeight: 700, color: palette.border, fontSize: '0.9rem' }}>{section.members}</span>
                </div>
                <div style={{ padding: '0.5rem 0.75rem', background: palette.light, borderRadius: '0.5rem', border: `1px solid ${palette.border}30`, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {section.description}
                </div>
              </div>

              {/* File section */}
              <div style={{ padding: '1rem 1.25rem', borderTop: `2px dashed ${palette.border}50`, background: 'var(--card-bg)' }}>
                {section.files && section.files.length > 0 && (
                  <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: palette.border, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>📎 Uploaded Files</div>
                    {section.files.map((file, fidx) => (
                      <div key={fidx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', background: palette.light, padding: '0.3rem 0.6rem', borderRadius: '0.375rem', border: `1px solid ${palette.border}30` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <FileText size={13} style={{ flexShrink: 0, color: palette.border }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{file}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                          <button onClick={() => handleViewFile(file)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '2px' }} title="View"><Eye size={13} /></button>
                          <button onClick={() => handleEditFile(section.id, fidx, file)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '2px' }} title="Edit"><Edit size={13} /></button>
                          <button onClick={() => handleDeleteFile(section.id, fidx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }} title="Delete"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" id={`file-upload-${section.id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, section.id)} />
                <button
                  onClick={() => document.getElementById(`file-upload-${section.id}`).click()}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: palette.light, border: `1.5px dashed ${palette.border}`, color: palette.border, padding: '0.6rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem' }}
                >
                  <Upload size={15} /> Upload Documents
                </button>
              </div>
            </div>
          );
        })}
        {sections.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: '1rem', border: '1px solid var(--border)', gridColumn: '1 / -1' }}>
            No sections available. Add a new section to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionManagement;
