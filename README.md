# DeVote ⚖️  
_A Decentralized Voting System Simulation_

DeVote is a **secure, blockchain-inspired voting simulation** built with **React, TypeScript, and Tailwind CSS**.  
It demonstrates how decentralized voting could work in practice — from **voter whitelisting** and **encrypted ballots** to an **immutable ledger** and **AI-powered election audit**.

> 🧪 **Disclaimer:** DeVote is an educational simulation — **not** a production-ready e-voting solution.

---

## 🔍 Overview

- 🛡️ **Client-side vote encryption** (simulated AES-style logic).
- 🔗 **Blockchain ledger** of vote blocks with chained hashes.
- 🧾 **Verifiable voting records** via a Chain Explorer.
- 📊 **Live election results** with tie detection and visualizations.
- 🤖 **AI Audit** powered by **Google Gemini** for anomaly detection.
- 🧑‍💼 **Admin Panel** for managing voters, candidates, and emergency resets.
- 💾 **LocalStorage persistence** so your “network” survives page reloads.

---

## 🧭 Table of Contents

1. [Core Features](#-core-features)
2. [App Screens](#-app-screens)
3. [Architecture](#-architecture)
4. [Security Model (Simulated)](#-security-model-simulated)
5. [AI Election Audit](#-ai-election-audit)
6. [Getting Started](#-getting-started)
7. [Project Structure](#-project-structure)
8. [Usage Guide](#-usage-guide)
9. [Roadmap](#-roadmap)
10. [Limitations & Disclaimer](#-limitations--disclaimer)
11. [License](#-license)

---

## ✨ Core Features

### 1. Secure Voting (Simulated E2E Encryption)

- Each vote is **encrypted on the client** before being sent to the simulated backend.
- Uses a **custom AES-like logic** to show how symmetric encryption might protect ballot secrecy.
- Vote data includes:
  - Voter identity (wallet address / ID)
  - Chosen candidate
  - Timestamp
  - Cryptographic hash linkage

> 🔐 Goal: Demonstrate the idea of **end-to-end encrypted ballots**, not to implement a real cryptosystem.

---

### 2. Blockchain-Style Ledger

- Every vote becomes a **block** in a chain:
  - `index`
  - `timestamp`
  - `encryptedVoteData`
  - `previousHash`
  - `hash`
- Blocks are **linked by hashes**, so tampering one block breaks the chain.
- A **Chain Explorer** lets you:
  - Inspect block details
  - Verify previous hashes
  - Visualize the integrity of the chain

---

### 3. Live Results & Analytics

- 🧮 **Real-time tally** of votes per candidate as new blocks are added.
- ⚖️ **Tie detection**: If multiple candidates share the same highest count, the UI clearly marks a **draw** scenario.
- 📈 Integrated charts (via **Recharts**) to show:
  - Vote distribution per candidate
  - Turnout trends during the simulation

---

### 4. Admin Panel & Governance

The Admin Panel simulates the **election commission**:

- ✅ **Voter Whitelisting**
  - Register valid voters using wallet addresses / unique IDs.
  - Only whitelisted voters can cast valid votes.
- 🗳️ **Candidate Management**
  - Add or remove candidates dynamically.
  - Each candidate can have:
    - Name
    - Party
    - Avatar / Icon
- 🧨 **Emergency Wipe**
  - Reset the **entire blockchain + state**.
  - Protected by an admin password: **`0077`**.
  - Use it to restart simulations or demos quickly.

---

### 5. Persistence Layer

- Uses **LocalStorage** as a mock “database”.
- Persists:
  - Blockchain (block list)
  - Voter registry
  - Candidate list
  - Current election state
- On reload, the app **restores the last known chain**, so your simulation is not lost.

---

## 🖥 App Screens

> _Screens / routes may vary based on your routing setup._

### 🏠 Dashboard

- High-level **overview of the election**:
  - Total votes
  - Turnout percentage (simulated)
  - Leading candidate(s)
- Charts & stats for quick understanding.

### 🧑‍💼 Admin Panel

- Manage:
  - **Voters** (whitelist registration)
  - **Candidates** (CRUD operations)
  - **Election Controls** (e.g. emergency wipe)
- Protected actions (e.g. wipe) require **password `0077`**.

### 🗳️ Voting Booth

- Voters:
  - Select their **identity** (wallet address) from a dropdown.
  - View the list of **available candidates**.
  - Cast an **encrypted vote**.
- UI simulates:
  - Network latency / processing delay
  - Encryption step progress

### 🔍 Chain Explorer

- Visual list or card layout of **blocks**.
- Click / expand a block to view:
  - Block index
  - Timestamp
  - Previous hash
  - Current hash
  - Encrypted vote payload
- Helps users understand how **immutability** works.

---

## 🧱 Architecture

### Frontend

- **React** + **TypeScript** SPA.
- **Tailwind CSS** for styling.
- **Lucide Icons** for clean iconography.
- **Recharts** for data visualizations.

### State & Data Flow

- Application state includes:
  - `voters[]`
  - `candidates[]`
  - `blocks[]` (blockchain)
  - `currentVoter`
  - `electionStats`
- Votes flow:
  1. Voter selects candidate.
  2. Vote is **encrypted**.
  3. A new **block** is created and chained to the previous.
  4. State & LocalStorage are updated.
  5. Tally + charts update.

### Backend Simulation

- There is **no real server** by default.
- A mock API layer:
  - Wraps LocalStorage operations.
  - Adds **simulated latency** (e.g. `setTimeout`) to feel like calling a real backend.
- Easy to swap with:
  - Real APIs
  - Smart contract calls
  - External databases

---

## 🛡 Security Model (Simulated)

DeVote is designed to **teach** security concepts:

- ❌ Not a production-ready cryptosystem.
- ✅ Demonstrates:
  - Why **client-side encryption** matters.
  - How **blockchains** ensure **integrity** via hashing.
  - Why **voter whitelisting** is essential.
  - How **auditability** is improved via transparent ledgers.

Common security-inspired elements:

- One vote per whitelisted identity.
- Immutable log of votes (no in-place edits).
- Tampering detection through hash mismatches.

---

## 🤖 AI Election Audit

DeVote integrates with **Google GenAI SDK (Gemini 2.5 Flash)** to analyze elections:

- Sends a **summary of results** (counts, turnout, maybe block stats) to Gemini.
- Gemini responds with:
  - Insights on **possible anomalies**.
  - Observations about **unusual patterns** (e.g. sudden spikes for a candidate).
  - A **natural language report** for non-technical stakeholders.

> ✨ Use this as a **teaching tool** to explore how AI might assist human auditors.

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** (LTS recommended)
- **npm** or **pnpm** or **yarn**
- (Optional) A **Google Gemini API key** for AI audits

---

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/devote.git
cd devote

# Install dependencies
npm install
# or
yarn
# or
pnpm install
