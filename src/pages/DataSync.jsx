import React, { useState, useEffect } from 'react';
import { CloudUpload, CheckCircle, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from 'react-router-dom';

const DataSync = () => {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [localData, setLocalData] = useState({});

  // Mutations
  const addPendingRecord = useMutation(api.pendingRecords.add);
  const addRiceIndent = useMutation(api.riceIndents.add);
  const addScholarship = useMutation(api.scholarships.add);
  const addScheme = useMutation(api.schemes.add);
  const addBankConfirmation = useMutation(api.bankConfirmations.add);
  const addJayanti = useMutation(api.jayantis.add);
  const addDashboardFile = useMutation(api.dashboardFiles.add);
  const addSection = useMutation(api.sections.add);
  const addLeave = useMutation(api.leavesRecords.add);

  useEffect(() => {
    const data = {};
    const keys = [
      'records', 'leaves', 'scholarships', 'scholarship_obc', 'scholarship_bc',
      'bankConfirmations', 'bank_confirmations', 'jayantis', 'jayantis_events',
      'sections', 'riceIndents', 'schemes', 'dashboard_files', 'dashboard_files_v2'
    ];
    keys.forEach(key => {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          data[key] = JSON.parse(val);
        } catch (e) {
          data[key] = val;
        }
      }
    });
    setLocalData(data);
  }, []);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setStatus('syncing');
    setProgress(0);
    addLog('Starting full synchronization to Convex...');

    const keys = Object.keys(localData);
    let totalItems = 0;
    keys.forEach(k => { if(Array.isArray(localData[k])) totalItems += localData[k].length; });

    if (totalItems === 0) {
      addLog('No local data found to sync.', 'warning');
      setStatus('done');
      setSyncing(false);
      return;
    }

    let processed = 0;

    try {
      // 1. Pending Records
      if (localData.records) {
        addLog(`Syncing ${localData.records.length} Pending Records...`);
        for (const r of localData.records) {
          await addPendingRecord({
            recordName: r.recordName || r.name || 'Untitled',
            nameOfWork: r.nameOfWork || '',
            staffName: r.staffName || '',
            summary: r.summary || '',
            lastDate: r.lastDate || '',
            status: r.status || 'Pending',
            workPending: r.workPending || ''
          });
          processed++;
          setProgress(Math.round((processed / totalItems) * 100));
        }
        localStorage.removeItem('records');
      }

      // 2. Jayantis
      const jayantiKey = localData.jayantis_events ? 'jayantis_events' : (localData.jayantis ? 'jayantis' : null);
      if (jayantiKey) {
        const events = localData[jayantiKey];
        addLog(`Syncing ${events.length} Jayanti Events...`);
        for (const e of events) {
          await addJayanti({
            eventName: e.eventName || e.name || 'Untitled',
            date: e.date || '',
            place: e.place || '',
            items: (e.items || []).map(i => ({ name: i.name, amount: i.amount.toString() })),
            totalAmount: Number(e.totalAmount || 0)
          });
          processed++;
          setProgress(Math.round((processed / totalItems) * 100));
        }
        localStorage.removeItem(jayantiKey);
      }

      // 3. Bank Confirmations
      const bankKey = localData.bank_confirmations ? 'bank_confirmations' : (localData.bankConfirmations ? 'bankConfirmations' : null);
      if (bankKey) {
        const banks = localData[bankKey];
        addLog(`Syncing ${banks.length} Bank Confirmations...`);
        for (const b of banks) {
          await addBankConfirmation({
            college: b.college || '',
            sectionIncharge: b.sectionIncharge || '',
            lastDate: b.lastDate || '',
            progress: Number(b.progress || 0),
            status: b.status || 'Pending'
          });
          processed++;
          setProgress(Math.round((processed / totalItems) * 100));
        }
        localStorage.removeItem(bankKey);
      }

      // 4. Scholarships
      const scholarshipKeys = ['scholarships', 'scholarship_obc', 'scholarship_bc'];
      for (const skey of scholarshipKeys) {
        if (localData[skey] && Array.isArray(localData[skey])) {
          addLog(`Syncing ${localData[skey].length} Scholarship records (${skey})...`);
          for (const s of localData[skey]) {
            await addScholarship({
              college: s.college || '',
              sectionIncharge: s.sectionIncharge || '',
              completed: s.completed?.toString() || '0',
              total: s.total?.toString() || '0',
              type: s.type || 'Fresh',
              lastDate: s.lastDate || '',
              status: s.status || 'Pending',
              section: s.section || (skey.includes('obc') ? 'OBC' : 'BC')
            });
            processed++;
            setProgress(Math.round((processed / totalItems) * 100));
          }
          localStorage.removeItem(skey);
        }
      }

      // 5. Rice Indents
      if (localData.riceIndents) {
        addLog(`Syncing ${localData.riceIndents.length} Rice Indents...`);
        for (const i of localData.riceIndents) {
          await addRiceIndent({
            hostelName: i.hostelName || '',
            inchargeName: i.inchargeName || '',
            riceQuantity: i.riceQuantity || '',
            indentDate: i.indentDate || '',
            status: i.status || 'Pending'
          });
          processed++;
          setProgress(Math.round((processed / totalItems) * 100));
        }
        localStorage.removeItem('riceIndents');
      }

      // 6. Schemes
      if (localData.schemes) {
        addLog(`Syncing ${localData.schemes.length} Schemes...`);
        for (const s of localData.schemes) {
          await addScheme({
            name: s.name || '',
            headOfSection: s.headOfSection || '',
            description: s.description || '',
            announceDate: s.announceDate || '',
            lastDate: s.lastDate || '',
            status: s.status || 'Pending',
            progress: Number(s.progress || 0)
          });
          processed++;
          setProgress(Math.round((processed / totalItems) * 100));
        }
        localStorage.removeItem('schemes');
      }

      // 7. Dashboard Files
      const fileKeys = ['dashboard_files', 'dashboard_files_v2'];
      for (const fkey of fileKeys) {
        if (localData[fkey] && Array.isArray(localData[fkey])) {
          addLog(`Syncing ${localData[fkey].length} Dashboard Files (${fkey})...`);
          for (const f of localData[fkey]) {
            await addDashboardFile({
              idLocal: f.id || f.idLocal || Date.now().toString(),
              name: f.name || 'Untitled',
              category: f.category || 'random',
              status: f.status || 'Active',
              details: f.details || '',
              size: Number(f.size || 0),
              uploadDate: f.uploadDate || new Date().toISOString(),
              important: !!f.important,
              dataUrl: f.dataUrl || ''
            });
            processed++;
            setProgress(Math.round((processed / totalItems) * 100));
          }
          localStorage.removeItem(fkey);
        }
      }

      // 8. Sections
      if (localData.sections) {
        addLog(`Syncing ${localData.sections.length} Sections...`);
        for (const s of localData.sections) {
          await addSection({
            name: s.name || '',
            headOfSection: s.headOfSection || '',
            members: s.members || '0',
            description: s.description || '',
            files: (s.files || []).map(f => ({ name: f.name, url: f.url }))
          });
          processed++;
          setProgress(Math.round((processed / totalItems) * 100));
        }
        localStorage.removeItem('sections');
      }

      // 9. Leaves
      if (localData.leaves) {
        // Leaves might be an object or array depending on legacy
        const leaves = Array.isArray(localData.leaves) ? localData.leaves : [localData.leaves];
        addLog(`Syncing ${leaves.length} Leaves Records...`);
        for (const l of leaves) {
          // Normalize legacy leave data
          await addLeave({
            employeeName: l.employeeName || l.name || 'Unknown',
            designation: l.designation || '',
            leaveType: l.leaveType || 'Casual',
            startDate: l.startDate || '',
            endDate: l.endDate || '',
            totalDays: Number(l.totalDays || 1),
            reason: l.reason || '',
            status: l.status || 'Approved'
          });
          processed++;
          setProgress(Math.round((processed / totalItems) * 100));
        }
        localStorage.removeItem('leaves');
      }

      setStatus('done');
      addLog('All data synchronized successfully!', 'success');
      setLocalData({}); // Clear internal state
      setTimeout(() => navigate('/dashboard'), 3000);

    } catch (err) {
      console.error(err);
      addLog(`Error during sync: ${err.message}`, 'error');
      setStatus('error');
    } finally {
      setSyncing(false);
    }
  };

  const localKeys = Object.keys(localData).filter(k => Array.isArray(localData[k]) && localData[k].length > 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'none', border:'none', color:'var(--primary)', cursor:'pointer', fontWeight:600, marginBottom:'1.5rem' }}>
        <ArrowLeft size={18}/> Back to Dashboard
      </button>

      <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', padding: '2.5rem', border: '2px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', width: '80px', height: '80px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
            <CloudUpload size={40} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Total Website Sync</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Move all your local browser data to the Convex cloud backend.</p>
        </div>

        {status === 'idle' && (
          <>
            <div style={{ background: 'var(--bg-light)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#f59e0b" /> Local Data Found
              </h3>
              {localKeys.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic' }}>No local data found. Your website is already fully synced!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                  {localKeys.map(key => (
                    <div key={key} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '0.6rem', padding: '0.75rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{localData[key].length}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{key.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSync}
              disabled={localKeys.length === 0}
              style={{ width: '100%', padding: '1.2rem', background: localKeys.length === 0 ? '#94a3b8' : 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 800, fontSize: '1.1rem', cursor: localKeys.length === 0 ? 'not-allowed' : 'pointer', boxShadow: localKeys.length === 0 ? 'none' : '0 4px 15px rgba(99,102,241,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => !syncing && localKeys.length > 0 && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !syncing && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Sync Everything to Cloud
            </button>
          </>
        )}

        {(status === 'syncing' || status === 'done' || status === 'error') && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '2rem' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: status === 'error' ? '#ef4444' : 'linear-gradient(90deg, #6366f1, #22c55e)', transition: 'width 0.3s ease' }} />
            </div>

            <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '1.25rem', height: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', border: '2px solid #334155' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: log.type === 'error' ? '#f87171' : log.type === 'success' ? '#4ade80' : log.type === 'warning' ? '#fbbf24' : '#e2e8f0', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                  <span style={{ opacity: 0.5 }}>[{log.time}]</span> {log.msg}
                </div>
              ))}
            </div>

            {status === 'done' && (
              <div style={{ marginTop: '2rem', textAlign: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '1rem', padding: '1.5rem', color: '#166534' }}>
                <CheckCircle size={32} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Synchronization Complete!</div>
                <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSync;
