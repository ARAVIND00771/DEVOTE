import React, { useState } from 'react';
import { Candidate, Voter } from '../types';
import { CheckCircle2, Lock, Shield } from 'lucide-react';

interface VotingBoothProps {
  candidates: Candidate[];
  onVote: (candidateId: number) => void;
  currentUser: Voter | null;
}

const VotingBooth: React.FC<VotingBoothProps> = ({ candidates, onVote, currentUser }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (selectedId === null) return;
    setIsVoting(true);
    // Simulate network delay
    setTimeout(() => {
      onVote(selectedId);
      setIsVoting(false);
      setSelectedId(null);
    }, 1500);
  };

  if (!currentUser?.isRegistered) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Not Registered</h2>
        <p className="text-slate-400 max-w-md">
          Your wallet address is not registered in the smart contract whitelist. 
          Please contact the election administrator.
        </p>
      </div>
    );
  }

  if (currentUser?.hasVoted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Vote Casted Successfully</h2>
        <p className="text-slate-400 max-w-md">
          Your vote has been recorded on the blockchain. You cannot vote again.
          Verify your transaction in the Chain Explorer.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Cast Your Vote</h2>
            <p className="text-slate-400">Select a candidate securely. This action is irreversible.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            <Shield size={12} />
            End-to-End Encrypted
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            onClick={() => setSelectedId(candidate.id)}
            className={`cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
              selectedId === candidate.id
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 bg-slate-900 hover:border-slate-600'
            }`}
          >
            <div className="p-6 flex items-start gap-4">
              <img 
                src={candidate.avatar} 
                alt={candidate.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
              />
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {candidate.name}
                </h3>
                <span className="inline-block px-2 py-1 mt-2 rounded text-xs font-semibold bg-slate-800 text-slate-300">
                  {candidate.party}
                </span>
              </div>
              {selectedId === candidate.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleVote}
          disabled={selectedId === null || isVoting}
          className={`px-8 py-3 rounded-lg font-bold text-white transition-all transform ${
            selectedId === null || isVoting
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isVoting ? 'Encrypting & Confirming...' : 'Submit Vote to Blockchain'}
        </button>
      </div>
    </div>
  );
};

export default VotingBooth;