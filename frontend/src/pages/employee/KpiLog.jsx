import { useEffect, useMemo, useState } from 'react';
import { getToken } from '../../utils/authStorage';

export default function EmployeeKpiLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKpiId, setModalKpiId] = useState(null);
  const [kraFilter, setKraFilter] = useState('');
  const [assignedKras, setAssignedKras] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/kpi/logs', { headers: { Authorization: `Bearer ${getToken()}` } });
        const data = await res.json();
        if (!res.ok || data?.success !== true) throw new Error(data?.message || 'Failed to load KPI logs');
        setLogs(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        setError(e.message || 'Failed to load KPI logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    // Also fetch assigned KRAs for KRA filter options
    const fetchAssignedKras = async () => {
      try {
        const res = await fetch('http://localhost:3000/kpi/available', { headers: { Authorization: `Bearer ${getToken()}` } });
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        setAssignedKras(list);
      } catch (_) { setAssignedKras([]); }
    };
    fetchAssignedKras();
  }, []);

  // Updated renderChanges to have white text for the new background
  const renderChanges = (json) => {
    if (!json) return <span className="text-white/70">No details</span>;
    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      const keys = Object.keys(obj);
      if (!keys.length) return <span className="text-white/70">No details</span>;
      return (
        <ul className="list-disc pl-5 space-y-1 text-white/90">
          {keys.map((k) => {
            const v = obj[k];
            if (v && typeof v === 'object' && ('from' in v || 'to' in v)) {
              return <li key={k}><span className="font-medium text-white">{k}</span>: {String(v.from ?? 'null')} → {String(v.to ?? 'null')}</li>;
            }
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) {
              return <li key={k}><span className="font-medium text-white">{k}</span>: {String(v)}</li>;
            }
            return <li key={k}><span className="font-medium text-white">{k}</span>: {JSON.stringify(v)}</li>;
          })}
        </ul>
      );
    } catch {
      return <span className="text-red-400">Invalid</span>;
    }
  };

  const grouped = useMemo(() => {
    const byKpi = new Map();
    for (const l of logs) {
      if (!byKpi.has(l.kpi_id)) byKpi.set(l.kpi_id, []);
      byKpi.get(l.kpi_id).push(l);
    }
    // sort each group by version desc
    for (const arr of byKpi.values()) {
      arr.sort((a,b)=> (b.version||0) - (a.version||0));
    }
    return Array.from(byKpi.entries()).map(([kpi_id, arr]) => ({ kpi_id, entries: arr, latest: arr[0] }));
  }, [logs]);

  const kraOptions = useMemo(() => {
    const set = new Set();
    assignedKras.forEach(k => { if (k.name) set.add(String(k.name)); });
    return Array.from(set).sort();
  }, [assignedKras]);

  const groupedFiltered = useMemo(() => {
    if (!kraFilter) return grouped;
    return grouped.filter(g => String(g.latest?.kra_name || '') === String(kraFilter));
  }, [grouped, kraFilter]);

  return (
    <div 
      className="min-h-screen w-full"
      
    >
      <div className="p-4 sm:p-6">
        {/* Filter Bar Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h1 className="text-3xl text-white font-semibold">My KPI Log</h1>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-white/90">Filter by KRA</label>
              <select
                className="p-2 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                value={kraFilter}
                onChange={(e)=>setKraFilter(e.target.value)}
              >
                <option value="" className="text-black">All KRAs</option>
                {kraOptions.map(name => (
                  <option key={name} value={name} className="text-black">{name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Loading/Error/Empty States */}
        {loading && <div className="text-center text-white p-4">Loading...</div>}
        {error && (
          <div className="bg-red-500/30 text-red-100 border border-red-400 p-3 rounded-lg mb-3">
            {error}
          </div>
        )}
        {!loading && !error && !groupedFiltered.length && (
          <div className="text-white text-lg p-4 font-semibold text-center">
            No KPI logs found.
          </div>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 py-7 gap-4">
          {groupedFiltered.map(({ kpi_id, latest }) => (
            <div key={`card-${kpi_id}`} className="bg-white/2 mt-3 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div className="text-xl font-semibold text-white">{latest.kpi_name}</div>
                <div className="text-sm text-white text-left sm:text-right">
                  <div>Due: {latest.due_date ? new Date(latest.due_date).toLocaleDateString() : '-'}</div>
                </div>
              </div>
              <div className="text-sm text-white mb-3">
                KRA: {latest.kra_name} • Dept: {latest.dept || '-'}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3">
                <div className="text-sm text-white">
                  <div>Last Update By: <span className="text-white">{latest.updated_by}</span></div>
                  <div>At: {new Date(latest.updated_at).toLocaleString()}</div>
                </div>
                <div className="mt-3 flex justify-end">
                <button 
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  onClick={()=>{ setModalKpiId(kpi_id); setModalOpen(true); }}
                >
                  See Changes
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        {/* Modal */}
        {modalOpen && modalKpiId !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 backdrop-blur-md border border-white/20 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h3 className="text-xl font-semibold text-white">KPI Change History</h3>
                <button 
                  className="text-white/70 hover:text-white text-2xl font-bold transition-colors" 
                  onClick={()=>{ setModalOpen(false); setModalKpiId(null); }}
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-4">
                {(grouped.find(g => g.kpi_id === modalKpiId)?.entries || []).map((log) => (
                  <div 
                    key={`log-${log.kpi_id}-${log.version}-${log.updated_at}`} 
                    className="bg-white/10 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="px-2 py-0.5 text-white text-md font-medium rounded">
                         Version v{log.version}
                        </div>
                        <div className="text-sm text-white/80">
                          Updated by <span className="text-white font-medium">{log.updated_by}</span>
                        </div>
                      </div>
                      <div className="text-sm text-white/60 mt-1 sm:mt-0">
                       Updated at: {new Date(log.updated_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2 pl-1">
                      {renderChanges(log.changes)}
                    </div>
                    
                  </div>
                  
                ))}
                <div className='flex justify-end'>
                <div className='text-lg px-4 py-2 w-fit rounded bg-gray-600 hover:bg-gray-700' onClick={()=>{ setModalOpen(false); setModalKpiId(null); }}><button>Close</button></div>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}