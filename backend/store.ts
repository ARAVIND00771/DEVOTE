import { Block, Candidate, Voter } from '../types';
import { generateHash, encryptData } from './crypto';

const DB_KEY = 'DEVOTE_DB_V3'; // Bumped version to force fresh init with fixed data

// Singleton Store with Persistence
class Store {
  candidates: Candidate[];
  voters: Voter[];
  chain: Block[];

  constructor() {
    // Try to load existing database from LocalStorage
    if (!this.load()) {
      console.log("Initializing new Blockchain Database...");
      this.initDefaults();
      this.save();
    } else {
      console.log("Loaded Blockchain Database from Storage.");
    }
  }

  // Load from LocalStorage
  private load(): boolean {
    try {
      const saved = localStorage.getItem(DB_KEY);
      if (!saved) return false;
      
      const parsed = JSON.parse(saved);
      // Basic schema validation
      if (!parsed.candidates || !parsed.voters || !parsed.chain) return false;

      this.candidates = parsed.candidates;
      this.voters = parsed.voters;
      this.chain = parsed.chain;
      return true;
    } catch (e) {
      console.warn("Database corrupted, resetting to defaults.");
      return false;
    }
  }

  // Save to LocalStorage
  save() {
    localStorage.setItem(DB_KEY, JSON.stringify({
      candidates: this.candidates,
      voters: this.voters,
      chain: this.chain
    }));
  }

  // Reset Database
  reset() {
    this.initDefaults();
    this.save();
  }

  private initDefaults() {
    this.candidates = [];
    this.voters = [];

    // Initialize Genesis Block
    const genesisData = { voterHash: "GENESIS_BLOCK", encryptedVote: "0x000000" };
    // Capture timestamp to ensure consistency
    const genesisTimestamp = new Date().toISOString(); 
    const genesisHash = generateHash("0" + genesisTimestamp + JSON.stringify(genesisData));
    
    const genesisBlock: Block = {
      index: 0,
      timestamp: genesisTimestamp,
      data: genesisData,
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      hash: genesisHash,
    };

    this.chain = [genesisBlock];
  }
}

export const db = new Store();