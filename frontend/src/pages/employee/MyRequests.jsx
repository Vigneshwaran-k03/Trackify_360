import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/authStorage';
import { Eye } from 'lucide-react';
function RequestRow({ r, onOpen }) {
  return (
    <tr className="border-b border-white/20">
      <td className="px-3 py-2 text-sm text-white">#{r.id}</td>
      <td className="px-3 py-2 text-sm text-white">{r.kra_name || '-'}</td>
      <td className="px-3 py-2 text-sm text-white">{r.dept || '-'}</td>
      <td className="px-3 py-2 text-sm text-white">{r.status}</td>
      <td className="px-3 py-2 text-sm">
        <button 
          className="px-2 py-1 border border-white/50 rounded text-white bg-blue-600 hover:bg-white/20 transition-colors" 
          onClick={()=>onOpen(r)}
        >
          <Eye className='w-5 h-5' />
        </button>
      </td>
    </tr>
  );
}

export default function EmployeeMyRequests() {
  const [status, setStatus] = useState(''); // All default
  const [list, setList] = useState([]);
  const [detail, setDetail] = useState(null);

  const fetchList = async () => {
    const params = { scope: 'mine' };
    if (status) params.status = status;
    try {
      const res = await axios.get('http://localhost:3000/requests', { headers: { Authorization: `Bearer ${getToken()}` }, params });
      setList(res.data?.data || []);
    } catch (_) {
      setList([]);
    }
  };

  useEffect(() => { fetchList(); }, [status]);

  const openDetail = async (r) => {
    try {
      const res = await axios.get(`http://localhost:3000/requests/${r.id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setDetail(res.data?.data || r);
    } catch (_) {
      setDetail(r);
    }
  };

  const parsedChanges = (detail && detail.requested_changes) ? (() => { try { return JSON.parse(detail.requested_changes); } catch { return {}; } })() : {};

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Main Frosted Glass Card */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg p-4 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-6">My Requests</h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
          <div className="flex-1 min-w-[200px] flex items-center gap-2">
            <label className="text-sm text-white">Status:</label>
            <select 
              className="border border-white/30 rounded px-2 py-1 text-white" 
              value={status} 
              onChange={(e)=>setStatus(e.target.value)}
            >
              <option className='text-black' value="">All</option>
              <option className='text-black' value="Pending">Pending</option>
              <option className='text-black' value="Approved">Approved</option>
              <option className='text-black' value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

          {/* Table container with a semi-transparent dark background for contrast */}
          <div className="bg-black/20 rounded-lg shadow-inner overflow-auto">
            <table className="min-w-full">
              <thead>
                {/* Table header with semi-transparent white background */}
                <tr className="bg-white/20 text-left text-sm">
                  <th className="px-3 py-2 font-semibold text-white">ID</th>
                  <th className="px-3 py-2 font-semibold text-white">KRA</th>
                  <th className="px-3 py-2 font-semibold text-white">Dept</th>
                  <th className="px-3 py-2 font-semibold text-white">Status</th>
                  <th className="px-3 py-2 font-semibold text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 ? (
                  list.map(r => <RequestRow key={r.id} r={r} onOpen={openDetail} />)
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-white/70">
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gray-800 backdrop-blur-md rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Request #{detail.id}</h3>
                <button onClick={()=>setDetail(null)} className="text-white text-2xl">✕</button>
              </div>
              <div className="text-sm space-y-1 text-white">
                <div><b className="text-gray-200">KPI ID:</b> {detail.kpi_id}</div>
                <div><b className="text-gray-200">KRA:</b> {detail.kra_name} (#{detail.kra_id})</div>
                <div><b className="text-gray-200">Dept:</b> {detail.dept}</div>
                <div><b className="text-gray-200">Status:</b> {detail.status}</div>
                <div><b className="text-gray-200">Your Reason:</b> {detail.request_comment || '-'}</div>
                <div className="mt-2">
                  <b className="text-gray-200">Requested Changes:</b>
                  <pre className="bg-black/30 p-2 rounded overflow-auto text-gray-100 mt-1">
                    {JSON.stringify(parsedChanges, null, 2)}
                  </pre>
                </div>
                {detail.status !== 'Pending' && detail.decision_comment && (
                  <div className="mt-2"><b className="text-gray-200">Decision Comment:</b> {detail.decision_comment}</div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button 
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors" 
                  onClick={()=>setDetail(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}