
import React from 'react';
// Fix: Import MiniProgramProject instead of the non-existent NativeProject
import { MiniProgramProject } from '../types';

interface CodeOutputProps {
  // Fix: Use MiniProgramProject as the project type
  project: MiniProgramProject | null;
  selectedPageIndex: number;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ project, selectedPageIndex }) => {
  const file = project?.files[selectedPageIndex] || null;

  if (!project || !file) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 rounded-[2.5rem] border border-slate-800">
        <p className="text-xs uppercase tracking-widest font-bold">Waiting for Native App Generation</p>
      </div>
    );
  }

  const handleDownload = () => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title}_native_project.json`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between px-8 py-5 bg-slate-800/50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-4 text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            {file.path}
          </span>
        </div>
        <button 
          onClick={handleDownload}
          className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-bold border border-indigo-500/20 transition-all"
        >
          导出完整工程
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
          <code>{file.content}</code>
        </pre>
      </div>

      <div className="px-8 py-5 bg-slate-800/30 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 font-bold uppercase">Language: {file.language}</span>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(file.content);
            alert('代码已复制');
          }}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95"
        >
          复制代码
        </button>
      </div>
    </div>
  );
};
