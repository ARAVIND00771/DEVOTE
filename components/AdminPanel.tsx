import React, { useState, useRef } from 'react';
import { Voter, Candidate, Block } from '../types';
import { UserPlus, ShieldAlert, Trash2, Users, UserMinus, User, Database, Download, Image as ImageIcon, Upload, Lock, X } from 'lucide-react';
import { apiResetDb } from '../backend/api';

interface AdminPanelProps {
  voters: Voter[];
  candidates: Candidate[];
  blocks: Block[];
  onRegisterVoter: (address: string) => void;
  onAddCandidate: (name: string, party: string, avatar: string | null) => void;
  onRemoveCandidate: (id: number) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ voters, candidates, blocks, onRegisterVoter, onAddCandidate, onRemoveCandidate }) => {
  const [activeTab, setActiveTab] = useState<'voters' | 'candidates' | 'database'>('voters');
  const [newAddress, setNewAddress] = useState('');
  
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [newCandidateAvatar, setNewCandidateAvatar] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.length > 5) {
      onRegisterVoter(newAddress);
      setNewAddress('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCandidateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCandidateName && newCandidateParty) {
      onAddCandidate(newCandidateName, newCandidateParty, newCandidateAvatar);
      // Reset form
      setNewCandidateName('');
      setNewCandidateParty('');
      setNewCandidateAvatar(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openResetModal = () => {
    setIsResetModalOpen(true);
    setResetPassword('');
    setResetError('');
  };

  const confirmReset = async () => {
    if (resetPassword === "0077") {
        await apiResetDb();
        window.location.reload(); 
    } else {
        setResetError("Incorrect Admin Password");
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ candidates, voters, chain: blocks }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'devote-ledger-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6 h-full overflow-y-auto max-w-5xl mx-auto flex flex-col relative">
      <div className="mb-6 flex items-center justify-between">
         <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
             <button 
                onClick={() => setActiveTab('voters')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === 'voters' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
             >
                <Users size={16} /> Voter Access
             </button>
             <button 
                onClick={() => setActiveTab('candidates')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === 'candidates' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
             >
                <User size={16} /> Manage Candidates
             </button>
             <button 
                onClick={() => setActiveTab('database')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === 'database' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
             >
                <Database size={16} /> Inspector
             </button>
         </div>
      </div>

      {activeTab === 'voters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Register New Voter</h3>
                    <form onSubmit={handleRegisterSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Wallet Address</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                placeholder="0x..."
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                            <button 
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <UserPlus size={18} /> Add
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                            Calls <code>registerVoter(address)</code> on the smart contract.
                        </p>
                    </form>
                </div>

                <div className="bg-red-950/30 border border-red-900/30 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="text-red-500" size={20} />
                        <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">Reset the entire simulation to its initial state. This action cannot be undone.</p>
                    <button 
                        onClick={openResetModal}
                        className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 size={18} /> Wipe Blockchain Database
                    </button>
                </div>
            </div>

            <div className="h-full">
                <h3 className="text-lg font-bold text-white mb-4">Registered Whitelist</h3>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950 text-slate-400 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 font-medium">Address</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {voters.map((voter) => (
                                <tr key={voter.address} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-3 font-mono text-slate-300">{voter.address}</td>
                                    <td className="px-6 py-3">
                                        {voter.hasVoted ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/50 text-green-400">
                                                Voted
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/50 text-yellow-400">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {voters.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                                        No voters registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'candidates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
           <div className="md:col-span-1">
             <h3 className="text-lg font-bold text-white mb-4">Add Candidate</h3>
             <form onSubmit={handleAddCandidateSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        required
                        value={newCandidateName}
                        onChange={(e) => setNewCandidateName(e.target.value)}
                        placeholder="e.g. Satoshi Nakamoto"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Party Affiliation</label>
                    <input 
                        type="text" 
                        required
                        value={newCandidateParty}
                        onChange={(e) => setNewCandidateParty(e.target.value)}
                        placeholder="e.g. Bitcoin Core"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Profile Picture</label>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                             {newCandidateAvatar ? (
                                <img src={newCandidateAvatar} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-600" />
                             ) : (
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 border-dashed">
                                    <ImageIcon className="text-slate-500" size={24} />
                                </div>
                             )}
                        </div>
                        <label className="flex-1 cursor-pointer">
                            <span className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700">
                                <Upload size={14} /> Choose Photo
                            </span>
                            <input 
                                type="file" 
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                  </div>
                  <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                      <UserPlus size={18} /> Register Candidate
                  </button>
                </div>
             </form>
           </div>

           <div className="md:col-span-2 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4">Active Candidates</h3>
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-1 overflow-y-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-950 text-slate-400 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 font-medium">Avatar</th>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Party</th>
                            <th className="px-6 py-3 font-medium text-center">Votes</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {candidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-slate-800/50 group">
                                <td className="px-6 py-3">
                                  <img src={candidate.avatar} alt={candidate.name} className="w-8 h-8 rounded-full bg-slate-800 object-cover" />
                                </td>
                                <td className="px-6 py-3 font-medium text-white">{candidate.name}</td>
                                <td className="px-6 py-3 text-slate-400">{candidate.party}</td>
                                <td className="px-6 py-3 text-center">
                                  <span className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded text-xs font-mono">
                                    {candidate.voteCount}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button 
                                      type="button"
                                      onClick={() => onRemoveCandidate(candidate.id)}
                                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                      title="Remove Candidate"
                                    >
                                        <UserMinus size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {candidates.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No active candidates.
                                </td>
                            </tr>
                        )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">System Database</h3>
                    <p className="text-sm text-slate-400">Raw JSON view of the current blockchain state stored in localStorage.</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700"
                >
                    <Download size={16} /> Export JSON
                </button>
            </div>
            
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden relative group">
                <div className="absolute top-4 right-4 bg-slate-800/80 px-2 py-1 rounded text-xs text-slate-400 font-mono">
                    READ ONLY
                </div>
                <pre className="font-mono text-xs text-green-400 overflow-auto h-full p-2 custom-scrollbar">
{JSON.stringify({
  _meta: {
    version: "2.1",
    timestamp: new Date().toISOString(),
    node: "LOCAL_SIM_NODE_1"
  },
  candidates,
  voters,
  chain: blocks
}, null, 2)}
                </pre>
            </div>
        </div>
      )}

      {/* Security Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-red-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-red-900/20 relative animate-in fade-in zoom-in duration-200">
                 <button onClick={() => setIsResetModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X size={20} />
                 </button>
                 
                 <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Security Check</h3>
                    <p className="text-slate-400 text-sm mt-2">
                        This action will permanently delete the entire blockchain ledger and reset all votes to defaults.
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Admin Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="password"
                                value={resetPassword}
                                onChange={(e) => setResetPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                placeholder="Enter Admin Password"
                                autoFocus
                            />
                        </div>
                        {resetError && <p className="text-red-400 text-xs mt-2 font-medium">{resetError}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button 
                            onClick={() => setIsResetModalOpen(false)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmReset}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20"
                        >
                            Confirm Wipe
                        </button>
                    </div>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;