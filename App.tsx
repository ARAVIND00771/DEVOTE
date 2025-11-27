import React, { useState, useEffect } from 'react';
import { Screen, Candidate, Voter, Block } from './types';
import Sidebar from './components/Sidebar';
import VotingBooth from './components/VotingBooth';
import ResultsDashboard from './components/ResultsDashboard';
import ChainVisualizer from './components/ChainVisualizer';
import AdminPanel from './components/AdminPanel';
import * as API from './backend/api';
import { encryptData } from './backend/crypto';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.DASHBOARD);
  
  // App State (fetched from backend)
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentUser, setCurrentUser] = useState<Voter | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [cData, vData, bData] = await Promise.all([
      API.apiGetCandidates(),
      API.apiGetVoters(),
      API.apiGetChain()
    ]);
    
    setCandidates(cData);
    setVoters(vData);
    setBlocks(bData);
    
    // Set default user if not set
    if (!currentUser && vData.length > 0) {
      setCurrentUser(vData[0]);
    } else if (currentUser) {
      // Refresh current user state
      const updatedUser = vData.find(v => v.address === currentUser.address);
      if (updatedUser) setCurrentUser(updatedUser);
    }
    setLoading(false);
  };

  const handleVote = async (candidateId: number) => {
    if (!currentUser) return;

    // 1. Client-Side Encryption
    const votePayload = { candidateId: candidateId, timestamp: Date.now() };
    const encryptedVote = encryptData(votePayload);
    
    console.log(`[Frontend] Encrypting vote for Candidate #${candidateId}...`);
    console.log(`[Frontend] Ciphertext: ${encryptedVote}`);

    // 2. Send to Backend
    const result = await API.apiCastVote(currentUser.address, encryptedVote);
    
    if (result.success) {
      // 3. Refresh State
      await fetchData();
      setTimeout(() => setCurrentScreen(Screen.CHAIN), 500);
    } else {
      alert(result.message);
    }
  };

  const handleRegisterVoter = async (address: string) => {
    const result = await API.apiRegisterVoter(address);
    if (result.success) {
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleAddCandidate = async (name: string, party: string, avatar: string | null) => {
    const result = await API.apiAddCandidate(name, party, avatar);
    if (result.success) {
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleRemoveCandidate = async (id: number) => {
    // Removed window.confirm to ensure action always fires in simulation environment
    const result = await API.apiRemoveCandidate(id);
    if (result.success) {
      fetchData();
    }
  };

  const switchWallet = (address: string) => {
    const voter = voters.find(v => v.address === address);
    if (voter) setCurrentUser(voter);
  };

  if (loading && candidates.length === 0) {
    return <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading Blockchain...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar currentScreen={currentScreen} setScreen={setCurrentScreen} />
      
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6">
            <h1 className="font-semibold text-slate-200">
                {currentScreen === Screen.DASHBOARD && 'Election Overview'}
                {currentScreen === Screen.VOTE && 'Voting Booth'}
                {currentScreen === Screen.CHAIN && 'Blockchain Explorer'}
                {currentScreen === Screen.ADMIN && 'Administration'}
            </h1>
            
            <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500 hidden md:inline">Current Identity:</span>
                <select 
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none"
                    value={currentUser?.address || ''}
                    onChange={(e) => switchWallet(e.target.value)}
                >
                    {voters.length > 0 ? voters.map(v => (
                        <option key={v.address} value={v.address}>
                            {v.address} {v.hasVoted ? '(Voted)' : ''}
                        </option>
                    )) : <option>No Voters Registered</option>}
                </select>
                <div className={`w-2 h-2 rounded-full ${currentUser?.isRegistered ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
            {currentScreen === Screen.DASHBOARD && (
            <ResultsDashboard candidates={candidates} totalVotes={candidates.reduce((a,c) => a + c.voteCount, 0)} />
            )}
            {currentScreen === Screen.VOTE && (
            <VotingBooth 
                candidates={candidates} 
                onVote={handleVote} 
                currentUser={currentUser} 
            />
            )}
            {currentScreen === Screen.CHAIN && (
            <ChainVisualizer blocks={blocks} />
            )}
            {currentScreen === Screen.ADMIN && (
            <AdminPanel 
                voters={voters} 
                candidates={candidates}
                blocks={blocks}
                onRegisterVoter={handleRegisterVoter}
                onAddCandidate={handleAddCandidate}
                onRemoveCandidate={handleRemoveCandidate}
            />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;