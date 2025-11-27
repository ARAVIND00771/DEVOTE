import React, { useState } from 'react';
import { Candidate } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, RefreshCcw, ShieldCheck, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { apiAuditResults } from '../backend/api';

interface ResultsDashboardProps {
  candidates: Candidate[];
  totalVotes: number;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ candidates, totalVotes }) => {
  const [integrityStatus, setIntegrityStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  const [integrityMessage, setIntegrityMessage] = useState('');
  const [showWinner, setShowWinner] = useState(false);

  const handleIntegrityCheck = async () => {
    setIntegrityStatus('verifying');
    // Simulate slight delay for dramatic effect
    setTimeout(async () => {
        const result = await apiAuditResults();
        setIntegrityStatus(result.valid ? 'valid' : 'invalid');
        setIntegrityMessage(result.message);
    }, 1000);
  };

  const getResult = () => {
    if (candidates.length === 0) return { type: 'empty', data: null };
    
    // Find highest vote count
    const maxVotes = Math.max(...candidates.map(c => c.voteCount));
    
    if (maxVotes === 0) return { type: 'empty', data: null };

    // Find all candidates with that vote count
    const winners = candidates.filter(c => c.voteCount === maxVotes);

    if (winners.length === 1) {
        return { type: 'winner', data: winners[0] };
    } else {
        return { type: 'draw', data: winners };
    }
  };

  const result = getResult();
  const colors = ['#818cf8', '#2dd4bf', '#f472b6', '#fbbf24'];

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Live Election Results</h2>
          <p className="text-slate-400">Real-time data fetched from the blockchain.</p>
        </div>
        <div className="flex items-center gap-4">
            <button
                onClick={handleIntegrityCheck}
                disabled={integrityStatus === 'verifying'}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border ${
                    integrityStatus === 'valid' 
                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                        : integrityStatus === 'invalid'
                        ? 'bg-red-500/10 border-red-500/50 text-red-400'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                }`}
            >
                {integrityStatus === 'idle' && <><ShieldCheck size={18} /> Verify Chain Integrity</>}
                {integrityStatus === 'verifying' && <><RefreshCcw className="animate-spin" size={18} /> Verifying...</>}
                {integrityStatus === 'valid' && <><CheckCircle size={18} /> Ledger Verified</>}
                {integrityStatus === 'invalid' && <><AlertTriangle size={18} /> Tampering Detected</>}
            </button>
            <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-sm block">Total Votes</span>
                <span className="text-2xl font-bold text-white">{totalVotes}</span>
            </div>
        </div>
      </div>

      {integrityMessage && integrityStatus !== 'idle' && (
        <div className={`mb-6 p-3 rounded-lg text-sm border ${
            integrityStatus === 'valid' ? 'bg-green-900/20 border-green-900/50 text-green-200' : 'bg-red-900/20 border-red-900/50 text-red-200'
        }`}>
            <strong>System Report:</strong> {integrityMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={candidates}>
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{fill: '#334155', opacity: 0.4}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="voteCount" radius={[4, 4, 0, 0]}>
                {candidates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-amber-600"></div>
          
          {result.type === 'draw' ? (
              <Users className={`w-16 h-16 mb-4 ${showWinner ? 'text-yellow-400' : 'text-slate-700'}`} />
          ) : (
              <Trophy className={`w-16 h-16 mb-4 ${showWinner ? 'text-yellow-400' : 'text-slate-700'}`} />
          )}
          
          <h3 className="text-xl font-bold text-white mb-2">
            {result.type === 'draw' ? 'Election Draw' : 'Election Winner'}
          </h3>
          
          {!showWinner ? (
             <button 
                onClick={() => setShowWinner(true)}
                className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
             >
                Reveal Result
             </button>
          ) : (
             <div className="animate-in fade-in zoom-in duration-500 w-full flex flex-col items-center">
                {result.type === 'winner' && (
                    <>
                        <img 
                            src={(result.data as Candidate).avatar} 
                            alt="Winner" 
                            className="w-20 h-20 rounded-full border-4 border-yellow-500 mx-auto mb-3 object-cover shadow-lg shadow-yellow-500/20" 
                        />
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 truncate w-full">
                            {(result.data as Candidate).name}
                        </div>
                        <div className="text-slate-400 mt-1">{(result.data as Candidate).party}</div>
                        <div className="mt-4 text-3xl font-black text-white">
                            {(result.data as Candidate).voteCount} <span className="text-sm font-normal text-slate-500">Votes</span>
                        </div>
                    </>
                )}

                {result.type === 'draw' && (
                    <>
                        <div className="text-amber-400 font-bold mb-3">
                            {(result.data as Candidate[]).length}-Way Tie!
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mb-4 w-full max-h-40 overflow-y-auto custom-scrollbar">
                             {(result.data as Candidate[]).map((c) => (
                                <div key={c.id} className="flex flex-col items-center bg-slate-800/50 p-2 rounded-lg min-w-[80px]">
                                    <img src={c.avatar} className="w-12 h-12 rounded-full border-2 border-slate-600 mb-1 object-cover" />
                                    <span className="text-xs text-slate-300 max-w-[80px] truncate">{c.name}</span>
                                </div>
                             ))}
                        </div>
                        <div className="text-3xl font-black text-white">
                              {(result.data as Candidate[])[0].voteCount} <span className="text-sm font-normal text-slate-500">Votes Each</span>
                        </div>
                    </>
                )}

                {result.type === 'empty' && (
                    <p className="text-slate-400">No votes cast yet.</p>
                )}

                <button 
                    onClick={() => setShowWinner(false)}
                    className="mt-6 text-xs text-slate-500 hover:text-white underline"
                >
                    Hide
                </button>
             </div>
          )}
       </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {candidates.map((candidate, i) => (
            <div key={candidate.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <h4 className="font-bold text-white">{candidate.name}</h4>
                    <p className="text-sm text-slate-400">{candidate.voteCount} Votes</p>
                </div>
                <div className="ml-auto text-xl font-bold" style={{ color: colors[i % colors.length] }}>
                    {totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(0) : 0}%
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDashboard;