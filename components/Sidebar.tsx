import React from 'react';
import { Screen } from '../types';
import { LayoutDashboard, Vote, ShieldCheck, Users } from 'lucide-react';

interface SidebarProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, setScreen }) => {
  const menuItems = [
    { id: Screen.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Screen.VOTE, label: 'Vote', icon: Vote },
    { id: Screen.CHAIN, label: 'Chain Explorer', icon: ShieldCheck },
    { id: Screen.ADMIN, label: 'Admin Panel', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <ShieldCheck className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          DeVote
        </span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
          <p className="font-semibold mb-1">Status: <span className="text-green-400">Connected</span></p>
          <p>Network: Local Sim</p>
          <p className="truncate mt-1 opacity-70">Block Height: #842</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;