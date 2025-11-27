export enum Screen {
  DASHBOARD = 'DASHBOARD',
  VOTE = 'VOTE',
  CHAIN = 'CHAIN',
  ADMIN = 'ADMIN'
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  voteCount: number;
  avatar: string;
}

export interface Voter {
  address: string;
  hasVoted: boolean;
  isRegistered: boolean;
}

export interface Block {
  index: number;
  timestamp: string;
  data: {
    voterHash: string;
    encryptedVote: string; // Changed from candidateId to encrypted string
  };
  previousHash: string;
  hash: string;
}

export interface AuthState {
  isConnected: boolean;
  walletAddress: string | null;
  isAdmin: boolean;
}