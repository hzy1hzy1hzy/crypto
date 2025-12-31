
import React, { useState, useEffect, useRef } from 'react';

export const NativeExport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const logs = [
    "> Checking environment dependencies...",
    "> Found Node.js v20.10.0",
    "> Found Android SDK at /usr/local/lib/android/sdk",
    "> Initializing Capacitor project...",
    "> Running: npm install @capacitor/core @capacitor/android",
    "> Configuring capacitor.config.json...",
    "> Syncing web assets to android platform...",
    "> Running: npx cap sync android",
    "> Generating Gradle wrapper...",
    "> Compiling debug resources...",
    "> Building Android Package (APK)...",
    "> Process 45% [==========----------]",
    "> Process 82% [==================--]",
    "> Build Successful: app-debug.apk generated in /android/app/build/outputs/apk/debug/",
  ];

  const startBuild = () => {
    setIsBuilding(true);
    setBuildLogs([]);
    let currentLogIndex = 0;

    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBuildLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsBuilding(false);
        alert("构建模拟完成！在真实环境下，此操作将调用本地 Android Studio 工具链生成 APK。");
      }
    }, 600);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [buildLogs]);

  return (
    <div className="mt-12 border-t border-slate-100 pt-8 max-w-2xl mx-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group"
      >
        <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          高级：部署为原生 APK / App (Capacitor)
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-6 bg-slate-900 rounded-[2rem] text-white animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-xs">通过自动化管道将此 Web 项目编译为 Android 安装包：</p>
            {!isBuilding && (
              <button 
                onClick={startBuild}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                开始自动化构建 APK
              </button>
            )}
          </div>

          {buildLogs.length > 0 ? (
            <div 
              ref={scrollRef}
              className="bg-black/40 rounded-xl p-4 font-mono text-[10px] h-48 overflow-y-auto custom-scrollbar border border-white/5"
            >
              {buildLogs.map((log, i) => (
                <div key={i} className={`${log.includes('Successful') ? 'text-emerald-400 font-bold' : 'text-slate-300'} mb-1`}>
                  {log}
                </div>
              ))}
              {isBuilding && <div className="animate-pulse inline-block w-2 h-3 bg-indigo-500 ml-1" />}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { step: '1', cmd: 'npm install @capacitor/cli @capacitor/android', label: '环境' },
                { step: '2', cmd: 'npx cap add android', label: '配置' },
                { step: '3', cmd: 'npx cap open android', label: '编译' }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="w-5 h-5 flex items-center justify-center bg-indigo-500 rounded-full text-[10px] font-bold">{item.step}</span>
                  <code className="text-[10px] font-mono text-emerald-400 flex-1">{item.cmd}</code>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <h5 className="text-[11px] font-bold text-indigo-300 uppercase mb-2">💡 专家提示</h5>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              由于浏览器安全限制，自动化构建需要您的本地环境配合。您可以点击下方按钮下载 <b>build_android.sh</b> 脚本，在本地终端运行即可完成全自动打包。
            </p>
            <button 
              className="mt-3 w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/30 transition-colors"
              onClick={() => {
                const script = `#!/bin/bash\nnpm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap add android\nnpx cap sync android\nnpx cap open android`;
                const blob = new Blob([script], { type: 'text/x-sh' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'build_android.sh';
                a.click();
              }}
            >
              下载本地自动构建脚本 (.sh)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
