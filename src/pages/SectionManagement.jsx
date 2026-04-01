import React, { useState } from 'react';
import { Users, Edit, Trash2, Upload, Plus, X, FileText, Eye, Building2 } from 'lucide-react';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/* ─── Premium Color Palette ─────────────────────────────────── */
const PALETTES = [
  { 
    id: 'purple',
    header: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
    border: '#c4b5fd', 
    text: '#5b21b6', 
    light: '#f5f3ff',
    badge: '#ede9fe',
    shadow: 'rgba(99, 102, 241, 0.15)'
  },
  { 
    id: 'cyan',
    header: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', 
    border: '#bae6fd', 
    text: '#0369a1', 
    light: '#f0f9ff',
    badge: '#e0f2fe',
    shadow: 'rgba(14, 165, 233, 0.15)'
  },
  { 
    id: 'green',
    header: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
    border: '#bbf7d0', 
    text: '#065f46', 
    light: '#f0fdf4',
    badge: '#d1fae5',
    shadow: 'rgba(16, 185, 129, 0.15)'
  },
  { 
    id: 'amber',
    header: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
    border: '#fde68a', 
    text: '#92400e', 
    light: '#fffbeb',
    badge: '#fef3c7',
    shadow: 'rgba(245, 158, 11, 0.15)'
  },
  { 
    id: 'rose',
    header: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', 
    border: '#fecdd3', 
    text: '#9f1239', 
    light: '#fff1f2',
    badge: '#ffe4e6',
    shadow: 'rgba(244, 63, 94, 0.15)'
  }
];

const SectionManagement = () => {
  const sections = useQuery(api.sections.get) || [];
  const addSection = useMutation(api.sections.add);
  const updateSection = useMutation(api.sections.update);
  const removeSection = useMutation(api.sections.remove);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', head: '', members: '', description: '' });

  const handleAddClick = () => { 
    setFormData({ id: null, name: '', head: '', members: '', description: '' }); 
    setIsFormOpen(true); 
  };
  
  const handleEditClick = (section) => { 
    setFormData({ 
      id: section._id, 
      name: section.name, 
      head: section.head, 
      members: section.members, 
      description: section.description 
    }); 
    setIsFormOpen(true); 
  };
  
  const handleDeleteClick = async (id) => {
    if (window.confirm('Delete this section permanently?')) {
      await removeSection({ id });
    }
  };

  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ ...prev, [name]: value })); 
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      head: formData.head,
      members: formData.members,
      description: formData.description
    };
    if (formData.id) {
      await updateSection({ id: formData.id, ...payload });
    } else {
      await addSection(payload);
    }
    setIsFormOpen(false);
  };

  const handleFileUpload = async (e, sectionId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Simulate upload - in a real app, this would upload to storage and get a URL
    const section = sections.find(s => s._id === sectionId);
    const newFiles = [...(section.files || []), file.name];
    await updateSection({ id: sectionId, files: newFiles });
    
    alert(`Document "${file.name}" linked successfully!`);
    e.target.value = null;
  };

  const handleDeleteFile = async (sectionId, fileIndex) => {
    if (window.confirm("Delete this document?")) {
      const section = sections.find(s => s._id === sectionId);
      const newFiles = [...(section.files || [])];
      newFiles.splice(fileIndex, 1);
      await updateSection({ id: sectionId, files: newFiles });
    }
  };

  const handleViewFile = (fileName) => alert(`Viewing document: ${fileName}`);

  const inputStyle = { 
    width: '100%', 
    padding: '0.85rem 1rem', 
    borderRadius: '0.75rem', 
    border: '1.5px solid var(--border)', 
    outline: 'none', 
    background: 'var(--card-bg)', 
    color: 'var(--text-dark)', 
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  if (isFormOpen) {
    return (
      <div style={{ padding: '0', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
              {formData.id ? 'Edit Section' : 'Create New Section'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              Define roles and responsibilities for this department.
            </p>
          </div>
          <button onClick={() => setIsFormOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-dark)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'rotate(90deg)'} onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'var(--card-bg)', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1.5px solid var(--border)' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Section Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} placeholder="e.g. Scholarship" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Head of Section</label>
                <input type="text" name="head" value={formData.head} onChange={handleInputChange} required style={inputStyle} placeholder="e.g. K Suresh" />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Members</label>
              <input type="text" name="members" value={formData.members} onChange={handleInputChange} required style={inputStyle} placeholder="e.g. 5 Staff Members" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Section Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Detail the core functions of this section..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '0.85rem 2rem', borderRadius: '0.75rem', border: '1.5px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', fontWeight: 700, color: 'var(--text-dark)', transition: 'all 0.2s' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontWeight: 800 }}>{formData.id ? 'Update Section' : 'Create Section'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em', margin: 0 }}>Section Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>Organize office departments, members, and essential documents.</p>
        </div>
        <button onClick={handleAddClick} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.5rem', fontWeight: 800 }}>
          <Plus size={20} /> Add New Section
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
        {sections.map((section, idx) => {
          const palette = PALETTES[idx % PALETTES.length];
          return (
            <div key={section._id}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: `0 12px 30px ${palette.shadow}`,
                border: `1.5px solid ${palette.border}`,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 50px ${palette.shadow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 12px 30px ${palette.shadow}`; }}
            >
              {/* Header Block */}
              <div style={{ background: palette.header, padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.65rem', borderRadius: '0.85rem', color: 'white', display: 'flex' }}>
                    <Users size={22} strokeWidth={2.5} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>{section.name}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditClick(section)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0.6rem', cursor: 'pointer', color: 'white', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Edit Section">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDeleteClick(section._id)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0.6rem', cursor: 'pointer', color: 'white', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Delete Section">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Information Body */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                
                {/* Statistics Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: palette.light, borderRadius: '0.85rem', border: `1.2px solid ${palette.border}60` }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Head of Section</span>
                    <span style={{ fontWeight: 800, color: palette.text, fontSize: '0.95rem' }}>{section.head || 'Not Assigned'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: palette.light, borderRadius: '0.85rem', border: `1.2px solid ${palette.border}60` }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Members</span>
                    <span style={{ fontWeight: 800, color: palette.text, fontSize: '0.95rem' }}>{section.members || '0 Members'}</span>
                  </div>
                </div>

                {/* Description Box */}
                <div style={{ 
                  padding: '1rem', 
                  background: 'var(--bg-light)', 
                  borderRadius: '0.85rem', 
                  border: `1.2px dashed ${palette.border}80`, 
                  fontSize: '0.9rem', 
                  color: 'var(--text-muted)', 
                  lineHeight: '1.6',
                  fontStyle: section.description ? 'normal' : 'italic'
                }}>
                  {section.description || 'No description provided for this section.'}
                </div>

                {/* Files Section List */}
                {section.files && section.files.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: palette.text, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={12} /> Stored Documents ({section.files.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {section.files.map((file, fidx) => (
                        <div key={fidx} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          fontSize: '0.85rem', 
                          color: 'var(--text-dark)', 
                          background: 'white', 
                          padding: '0.65rem 0.85rem', 
                          borderRadius: '0.75rem', 
                          border: `1px solid var(--border)`,
                          boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                            <FileText size={15} style={{ flexShrink: 0, color: palette.text }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{file}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button onClick={() => handleViewFile(file)} style={{ background: palette.badge, border: 'none', cursor: 'pointer', color: palette.text, padding: '4px', borderRadius: '6px', display: 'flex' }} title="View">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => handleDeleteFile(section._id, fidx)} style={{ background: '#fee2e2', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px', borderRadius: '6px', display: 'flex' }} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Upload Section */}
              <div style={{ padding: '1.25rem 1.75rem', borderTop: `1.5px dotted ${palette.border}`, background: 'rgba(255,255,255,0.3)' }}>
                <input type="file" id={`file-upload-${section._id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, section._id)} />
                <button
                  onClick={() => document.getElementById(`file-upload-${section._id}`).click()}
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.65rem', 
                    background: 'transparent', 
                    border: `1.8px solid ${palette.border}`, 
                    color: palette.text, 
                    padding: '0.85rem', 
                    borderRadius: '1rem', 
                    fontWeight: 800, 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    fontSize: '0.9rem',
                    boxShadow: `0 4px 12px ${palette.shadow}`
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = palette.light; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Upload size={18} strokeWidth={2.5} /> Upload Documents
                </button>
              </div>
            </div>
          );
        })}
        
        {sections.length === 0 && (
          <div style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            color: 'var(--text-muted)', 
            background: 'var(--card-bg)', 
            borderRadius: '2rem', 
            border: '2px dashed var(--border)', 
            gridColumn: '1 / -1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{ background: 'var(--bg-light)', padding: '2rem', borderRadius: '2rem' }}>
              <Building2 size={64} style={{ opacity: 0.2 }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>No Sections Configured</h2>
              <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem' }}>Get started by creating your first department or office section using the "Add New Section" button above.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionManagement;
