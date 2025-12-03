import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/authStorage';

import {Eye } from 'lucide-react';

function RequestRow({ r, onOpen }) {
  return (
    // Updated border color and text color
    <tr className="border-b border-white/20">
      <td className="px-3 py-2 text-sm text-white">#{r.id}</td>
      <td className="px-3 py-2 text-sm text-white">{r.kra_name || '-'}</td>
      <td className="px-3 py-2 text-sm text-white">{r.dept || '-'}</td>
      <td className="px-3 py-2 text-sm text-white">{r.requester_role} / {r.requester_name}</td>
      <td className="px-3 py-2 text-sm text-white">{r.status}</td>
      <td className="px-3 py-2 text-sm">
        {/* Updated button style */}
        <button 
          className="px-2 py-1 border border-white/50 rounded text-white bg-blue-600 hover:bg-white/20 transition-colors" 
          onClick={()=>onOpen(r)}
        >
          <Eye className='w-6 h-6' />
        </button>
      </td>
    </tr>
  );
}

export default function ManagerRequests() {
  const [reqType, setReqType] = useState('kpi'); // kpi | kra
  const [tab, setTab] = useState('inbox'); // inbox | my | approvals
  const [status, setStatus] = useState('Pending');
  const [list, setList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const fetchList = async () => {
    const params = { scope: tab === 'my' ? 'mine' : 'inbox' };
    if (tab === 'inbox') params.status = status; // Pending/Approved/Rejected
    if (tab === 'approvals') params.status = status; // Approved/Rejected
    if (tab === 'my' && status) params.status = status; // Optional filter for My Requests
    try {
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
    if (reqType === 'kra') return; // Managers do not approve KRA requests
    await axios.post(`http://localhost:3000/requests/${id}/${path}`, body, { headers: { Authorization: `Bearer ${getToken()}` } });
    setDetail(null);
    fetchList();
  };

  const parsedChanges = (detail && detail.requested_changes) ? (() => { try { return JSON.parse(detail.requested_changes); } catch { return {}; } })() : {};

  return (

    <div
      className="min-h-screen p-4 md:p-8"
    >
      {/* Main Frosted Glass Card */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg p-4 md:p-8 max-w-7xl mx-auto">
         <h1 className="text-3xl font-semibold text-white">Requests and Approvals</h1>
        <div className="flex items-center gap-3 p-3 mb-3">
          <label className="text-sm text-gray-100">Type:</label>
          <select 
            className="border border-white/30 rounded px-2 py-1 text-white" 
            value={reqType} 
            onChange={(e)=>{ setReqType(e.target.value); setDetail(null); setTab(e.target.value==='kra'?'my':'inbox'); setStatus(e.target.value==='kra'?'':'Pending'); }}
          >
            <option className='text-black' value="kpi">KPI</option>
            <option className='text-black' value="kra">KRA</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-2 rounded border border-white/50 text-white/90 transition-colors ${tab==='my'?'bg-blue-600 text-white font-semibold border-blue-700' : 'hover:bg-white/20'}`} 
              onClick={()=>{setTab('my'); setStatus(reqType==='kra'?'': '');}}
            >
              My Requests
            </button>
            {reqType === 'kpi' && (
              <>
                <button 
                  className={`px-3 py-2 rounded border border-white/50 text-white/90 transition-colors ${tab==='inbox'?'bg-blue-600 text-white font-semibold border-blue-700' : 'hover:bg-white/20'}`} 
                  onClick={()=>{setTab('inbox'); setStatus('Pending')}}
                >
                  Requests
                </button>
                <button 
                  className={`px-3 py-2 rounded border border-white/50 text-white/90 transition-colors ${tab==='approvals'?'bg-blue-600 text-white font-semibold border-blue-700' : 'hover:bg-white/20'}`} 
                  onClick={()=>{setTab('approvals'); setStatus('Approved')}}
                >
                  Approvals
                </button>
              </>
            )}
          </div>
          <div className="flex-1 min-w-[200px] flex items-center gap-2 justify-end">
            {reqType === 'kpi' ? (
              <select className="border border-white/30 rounded px-2 py-1 text-white" value={status} onChange={(e)=>setStatus(e.target.value)}>
                {tab==='inbox' ? (
                  <>
                    <option className='text-black'>Pending</option>
                    <option className='text-black'>Approved</option>
                    <option className='text-black'>Rejected</option>
                  </>
                ) : tab==='approvals' ? (
                  <>
                    <option className='text-black'>Approved</option>
                    <option className='text-black'>Rejected</option>
                  </>
                ) : (
                  <>
                    <option className='text-black' value="">All</option>
                    <option className='text-black'>Pending</option>
                    <option className='text-black'>Approved</option>
                    <option className='text-black'>Rejected</option>
                  </>
                )}
              </select>
            ) : (
              <select className="border border-white/30 rounded px-2 py-1 text-white" value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option className='text-black' value="">All</option>
                <option className='text-black'>Pending</option>
                <option className='text-black'>Approved</option>
                <option className='text-black'>Rejected</option>
              </select>
            )}
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
                <th className="px-3 py-2 font-semibold text-white">Requester</th>
                <th className="px-3 py-2 font-semibold text-white">Status</th>
                <th className="px-3 py-2 font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => <RequestRow key={r.id} r={r} onOpen={openDetail} />)}
            </tbody>
          </table>
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
                <div><b className="text-gray-200">Requester:</b> {detail.requester_role} / {detail.requester_name}</div>
                <div><b className="text-gray-200">Status:</b> {detail.status}</div>
                <div><b className="text-gray-200">Reason:</b> {detail.request_comment || '-'}</div>
                <div className="mt-2">
                  <b className="text-gray-200">Requested Changes:</b>
                  {/* Dark transparent <pre> block for readability */}
                  <pre className="bg-black/30 p-2 rounded overflow-auto text-gray-100 mt-1">{JSON.stringify(parsedChanges, null, 2)}</pre>
                </div>
              </div>
              {reqType === 'kpi' && tab === 'inbox' && detail.status === 'Pending' && (
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button className="px-4 py-2 rounded border border-red-400 bg-red-400 text-white hover:bg-red-600 transition-colors" onClick={()=>{ setRejectComment(''); setRejectOpen(true); }}>Reject</button>
                  <button className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors" onClick={()=>act(detail.id, 'approve')}>Approve</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 backdrop-blur-md rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Reject Request #{detail?.id}</h3>
                <button onClick={()=>setRejectOpen(false)} className="text-white text-2xl">✕</button>
              </div>
              <div className="mb-3 text-sm text-white">Please provide a reason for rejection.</div>
              {/* Usable textarea */}
              <textarea 
                className="w-full border border-white/50 rounded p-2 text-white bg-white/20 focus:outline-none focus:ring-2 focus:ring-white placeholder-white/70" 
                rows={4} 
                placeholder="Enter comment" 
                value={rejectComment} 
                onChange={(e)=>setRejectComment(e.target.value)} 
              />
              <div className="flex items-center justify-end gap-2 mt-4">
                <button className="px-4 py-2 rounded border border-white/50 text-white hover:bg-white/20 transition-colors" onClick={()=>setRejectOpen(false)}>Cancel</button>
                <button className="px-4 py-2 rounded bg-red-400 text-white hover:bg-red-600 transition-colors" onClick={async ()=>{ await act(detail.id, 'reject', rejectComment); setRejectOpen(false); }}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}