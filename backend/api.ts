import { db } from './store';
import { generateHash, decryptData } from './crypto';
import { Block, Candidate, Voter } from '../types';

// --- API Methods ---

export const apiGetCandidates = async (): Promise<Candidate[]> => {
  return db.candidates.map(c => ({ ...c }));
};

export const apiGetVoters = async (): Promise<Voter[]> => {
  return db.voters.map(v => ({ ...v }));
};

export const apiGetChain = async (): Promise<Block[]> => {
  return db.chain.map(b => ({ 
      ...b, 
      data: { ...b.data } 
  }));
};

export const apiRegisterVoter = async (address: string): Promise<{ success: boolean; message: string }> => {
  const exists = db.voters.find(v => v.address === address);
  if (exists) {
    return { success: false, message: "Voter already registered" };
  }
  
  db.voters.push({ address, hasVoted: false, isRegistered: true });
  db.save(); // PERSIST CHANGE
  return { success: true, message: "Voter registered successfully" };
};

export const apiAddCandidate = async (name: string, party: string, avatar: string | null): Promise<{ success: boolean; message: string }> => {
  const newId = db.candidates.length > 0 ? Math.max(...db.candidates.map(c => c.id)) + 1 : 0;
  // Use provided avatar or generate a random one
  const finalAvatar = avatar || `https://picsum.photos/200/200?random=${Date.now()}`;

  const newCandidate: Candidate = {
    id: newId,
    name,
    party,
    voteCount: 0,
    avatar: finalAvatar
  };
  db.candidates.push(newCandidate);
  db.save();
  return { success: true, message: "Candidate added successfully" };
};

export const apiRemoveCandidate = async (id: number): Promise<{ success: boolean; message: string }> => {
  db.candidates = db.candidates.filter(c => c.id !== id);
  db.save();
  return { success: true, message: "Candidate removed successfully" };
};

export const apiCastVote = async (
  voterAddress: string, 
  encryptedVote: string
): Promise<{ success: boolean; message: string; block?: Block }> => {
  
  // 1. Authenticate & Validate
  const voterIndex = db.voters.findIndex(v => v.address === voterAddress);
  if (voterIndex === -1) return { success: false, message: "Not registered" };
  if (db.voters[voterIndex].hasVoted) return { success: false, message: "Already voted" };

  // 2. Decrypt to Update Tally (Internal Backend Process)
  const decrypted = decryptData(encryptedVote);
  if (!decrypted || typeof decrypted.candidateId !== 'number') {
    return { success: false, message: "Invalid vote data (Decryption failed)" };
  }

  // 3. Update Database State
  db.voters[voterIndex].hasVoted = true;
  
  const candidateIndex = db.candidates.findIndex(c => c.id === decrypted.candidateId);
  if (candidateIndex !== -1) {
    db.candidates[candidateIndex].voteCount++;
  }

  // 4. Mine Block
  const prevBlock = db.chain[db.chain.length - 1];
  const newBlockData = { 
      voterHash: generateHash(voterAddress), 
      encryptedVote: encryptedVote 
  };
  
  const newHash = generateHash(prevBlock.hash + new Date().toISOString() + JSON.stringify(newBlockData));

  const newBlock: Block = {
    index: prevBlock.index + 1,
    timestamp: new Date().toISOString(),
    data: newBlockData,
    previousHash: prevBlock.hash,
    hash: newHash,
  };

  db.chain.push(newBlock);
  db.save(); // PERSIST CHANGE

  return { success: true, message: "Vote cast successfully", block: newBlock };
};

export const apiAuditResults = async (): Promise<{ valid: boolean, message: string, calculatedTally: Record<number, number> }> => {
  const tally: Record<number, number> = {};
  let isValid = true;
  let message = "Blockchain Integrity Verified";

  for (let i = 0; i < db.chain.length; i++) {
    const currentBlock = db.chain[i];
    
    if (i > 0) {
        const prevBlock = db.chain[i - 1];
        if (currentBlock.previousHash !== prevBlock.hash) {
            isValid = false;
            message = `Broken Chain Link at Block #${currentBlock.index}`;
            break;
        }

        const recalculatedHash = generateHash(
            prevBlock.hash + 
            currentBlock.timestamp + 
            JSON.stringify(currentBlock.data)
        );

        if (recalculatedHash !== currentBlock.hash) {
            isValid = false;
            message = `Data Tampering detected at Block #${currentBlock.index}`;
            break;
        }
    }

    if (currentBlock.index > 0) {
        const decrypted = decryptData(currentBlock.data.encryptedVote);
        if (decrypted) {
            const id = decrypted.candidateId;
            tally[id] = (tally[id] || 0) + 1;
        }
    }
  }
  
  return { valid: isValid, message, calculatedTally: tally };
};

// New method to reset the system
export const apiResetDb = async (): Promise<void> => {
    db.reset();
};