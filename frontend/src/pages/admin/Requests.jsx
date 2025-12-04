import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/authStorage';
import { Eye } from 'lucide-react';

function RequestRow({ r, onOpen }) {
  // Styled for the new background
  return (
    <tr className="border-t border-white/20 bg-black/20 transition-colors">
      <td className="p-2 text-white">#{r.id}</td>
      <td className="p-2 text-white">{r.kra_name || '-'}</td>
      <td className="p-2 text-white">{r.dept || '-'}</td>
      <td className="p-2 text-white">{r.requester_role} / {r.requester_name}</td>
      <td className="p-2 text-white">{r.status}</td>
      <td className="p-2">
        <button
          className="px-2 py-1 border border-white/50 rounded text-white bg-blue-600 hover:bg-white/20 transition-colors"
          onClick={() => onOpen(r)}
        >
          <Eye className='w-6 h-6' />
        </button>
      </td>
    </tr>
  );
}

export default function AdminRequests() {
  const [reqType, setReqType] = useState('kpi'); // kpi | kra
  const [tab, setTab] = useState('requests'); // requests | approvals
  const [status, setStatus] = useState('Pending');
  const [list, setList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const fetchList = async () => {
    try {
      const params = {};
      if (tab === 'requests') params.status = status;
      else params.status = status;
      const url = reqType === 'kra' ? 'http://localhost:3000/requests/kra' : 'http://localhost:3000/requests';
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${getToken()}` }, params });
      setList(res.data?.data || []);
    } catch (_) {
      setList([]);
    }
  };

  useEffect(() => { fetchList(); }, [reqType, tab, status]);

  const openDetail = async (r) => {
    try {
      const url = reqType === 'kra' ? `http://localhost:3000/requests/kra/${r.id}` : `http://localhost:3000/requests/${r.id}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${getToken()}` } });
      setDetail(res.data?.data || r);
    } catch (_) {
      setDetail(r);
    }
  };

  const act = async (id, decision, comment = '') => {
    const path = decision === 'approve' ? 'approve' : 'reject';
    const body = decision === 'reject' ? { comment } : {};
    const url = reqType === 'kra' ? `http://localhost:3000/requests/kra/${id}/${path}` : `http://localhost:3000/requests/${id}/${path}`;
    await axios.post(url, body, { headers: { Authorization: `Bearer ${getToken()}` } });
    setDetail(null);
    fetchList();
  };

  const parsedChanges = (detail && detail.requested_changes) ? (() => { try { return JSON.parse(detail.requested_changes); } catch { return {}; } })() : {};

  return (
    // Wrapper div for background image
    <div
    >
      {/* Content container with padding */}
      <div className="min-h-screen p-4 md:p-8">


        {/* Filter/Tab bar with glassmorphism */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-4 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-white">Requests & Approvals</h1>
          <div className="flex items-center gap-3 p-3 mb-3">
            <label className="text-sm font-medium text-white/90">Type:</label>
            <select
              className="border border-white/50 rounded px-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
              value={reqType}
              onChange={(e) => { setReqType(e.target.value); setDetail(null); }}
            >
              <option className='text-black' value="kpi">KPI</option>
              <option className='text-black' value="kra">KRA</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-start p-3 sm:items-center gap-3">
            <button
              className={`px-3 py-2 rounded border border-white/50 text-white/90 transition-colors ${tab === 'requests' ? 'bg-blue-600 text-white font-semibold border-blue-700' : 'hover:bg-white/20'}`}
              onClick={() => { setTab('requests'); setStatus('Pending') }}
            >
              Requests
            </button>
            <button
              className={`px-3 py-2 rounded border border-white/50 text-white/90 transition-colors ${tab === 'approvals' ? 'bg-blue-600 text-white font-semibold border-blue-700' : 'hover:bg-white/20'}`}
              onClick={() => { setTab('approvals'); setStatus('Approved') }}
            >
              Approvals
            </button>
            <div className="ml-0 sm:ml-auto flex items-center gap-2">
              <select
                className="border border-white/50 rounded px-2 py-1  text-white focus:outline-none focus:ring-2 focus:ring-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {tab === 'requests' ? (
                  <>
                    <option className='text-black' value="Pending">Pending</option>
                    <option className='text-black' value="Approved">Approved</option>
                    <option className='text-black' value="Rejected">Rejected</option>
                  </>
                ) : (
                  <>
                    <option className='text-black' value="Approved">Approved</option>
                    <option className='text-black' value="Rejected">Rejected</option>
                  </>
                )}
              </select>
            </div>
          </div>
          {/* Table container with glassmorphism */}
          <div className="  backdrop-blur-sm border border-white/30 rounded-lg shadow-lg overflow-auto">
            <table className="min-w-full border border-white/20 text-left">
              <thead>
                <tr className="bg-white/20">
                  <th className="p-2 text-white/90">ID</th>
                  <th className="p-2 text-white/90">KRA</th>
                  <th className="p-2 text-white/90">Dept</th>
                  <th className="p-2 text-white/90">Requester</th>
                  <th className="p-2 text-white/90">Status</th>
                  <th className="p-2 text-white/90">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(r => <RequestRow key={r.id} r={r} onOpen={openDetail} />)}
              </tbody>
            </table>
            {list.length === 0 && (
              <div className="p-4 text-center text-white/80">No requests found.</div>
            )}
          </div>

          {/* Detail Modal */}
          {detail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Modal card with glassmorphism */}
              <div className="w-full max-w-2xl bg-gray-800 backdrop-blur-md border border-white/30 rounded-lg shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Request #{detail.id}</h3>
                  <button onClick={() => setDetail(null)} className="text-white/80 hover:text-white text-2xl font-bold">✕</button>
                </div>
                <div className="text-sm space-y-1 max-h-[70vh] overflow-y-auto">
                  {reqType === 'kpi' && (<div className="text-white/90"><b>KPI ID:</b> {detail.kpi_id}</div>)}
                  <div className="text-white/90"><b>KRA:</b> {detail.kra_name} (#{detail.kra_id})</div>
                  <div className="text-white/90"><b>Dept:</b> {detail.dept}</div>
                  <div className="text-white/90"><b>Requester:</b> {detail.requester_role} / {detail.requester_name}</div>
                  <div className="text-white/90"><b>Status:</b> {detail.status}</div>
                  <div className="text-white/90"><b>Reason:</b> {detail.request_comment || '-'}</div>
                  <div className="mt-2">
                    <b className="text-white">Requested Changes:</b>
                    <pre className="bg-black/30 p-2 rounded overflow-auto text-white/90 text-xs mt-1">
                      {JSON.stringify(parsedChanges, null, 2)}
                    </pre>
                  </div>
                </div>
                {detail.status === 'Pending' && (
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 rounded border border-red-400 bg-red-400 text-white hover:bg-red-600 transition-colors"
                      onClick={() => { setRejectComment(''); setRejectOpen(true); }}
                    >
                      Reject
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      onClick={() => act(detail.id, 'approve')}
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {rejectOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Modal card with glassmorphism */}
              <div className="w-full max-w-md bg-gray-800 backdrop-blur-md border border-white/30 rounded-lg shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Reject Request #{detail?.id}</h3>
                  <button onClick={() => setRejectOpen(false)} className="text-white/80 hover:text-white text-2xl font-bold">✕</button>
                </div>
                <div className="mb-3 text-sm text-white/90">Please provide a reason for rejection.</div>
                <textarea
                  className="w-full border border-white/50 rounded p-2 text-white bg-white/20 focus:outline-none focus:ring-2 focus:ring-white placeholder-white/70"
                  rows={4}
                  placeholder="Enter comment"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 rounded border border-white/50 text-white hover:bg-white/20 transition-colors"
                    onClick={() => setRejectOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-400 text-white hover:bg-red-600 transition-colors"
                    onClick={async () => { await act(detail.id, 'reject', rejectComment); setRejectOpen(false); }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}