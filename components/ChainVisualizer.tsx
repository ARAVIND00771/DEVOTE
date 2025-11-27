import React from 'react';
import { Block } from '../types';
import { Clock, Database, Hash, Lock } from 'lucide-react';

interface ChainVisualizerProps {
  blocks: Block[];
}

const ChainVisualizer: React.FC<ChainVisualizerProps> = ({ blocks }) => {
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Blockchain Ledger</h2>
        <p className="text-slate-400">
          Visualize the immutable chain of votes. Data is encrypted to ensure voter privacy.
        </p>
      </div>

      <div className="flex flex-col gap-4 relative">
        <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-800 -z-10"></div>
        
        {blocks.map((block, i) => (
          <div key={block.hash} className="flex gap-6 items-start group">
            <div className="relative pt-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 shadow-xl z-10 bg-slate-900 transition-colors ${
                i === 0 ? 'border-green-500 text-green-500' : 'border-indigo-500 text-indigo-500'
              }`}>
                <Database size={24} />
              </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Block #{block.index}
                    {i === 0 && <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">GENESIS</span>}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Clock size={12} />
                    {new Date(block.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                  <span className="text-slate-500 block mb-1">Previous Hash</span>
                  <span className="text-orange-400 break-all">{block.previousHash}</span>
                </div>
                
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                   <span className="text-slate-500 block mb-1">Data Payload</span>
                   <div className="text-slate-300 mb-1">
                      Voter Hash: <span className="text-cyan-400">{block.data.voterHash.substring(0, 16)}...</span>
                   </div>
                   <div className="text-slate-300 flex items-center gap-2">
                      <Lock size={10} className="text-purple-400" />
                      Vote Data: <span className="text-purple-400 break-all">{block.data.encryptedVote}</span>
                   </div>
                </div>

                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                  <span className="text-slate-500 block mb-1 flex items-center gap-1">
                    <Hash size={10} /> Block Hash
                  </span>
                  <span className="text-green-400 break-all">{block.hash}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChainVisualizer;