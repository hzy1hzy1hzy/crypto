
import React from 'react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">如何预览和导出项目？</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">1</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">实时架构预览</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">右侧的手机模型展示了 AI 生成的初步 UI 布局与组件结构。您可以点击左侧文件树切换查看不同模块。</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">2</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">复制代码与导出</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">您可以直接复制代码，或点击“导出完整工程”下载包含 Capacitor 配置的 JSON 包。</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">3</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">本地原生编译</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">使用 <b>Capacitor CLI</b> 将代码同步至 iOS 或 Android 工程。在左侧控制栏底部可以找到自动化构建脚本。</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">4</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">下载 Capacitor 配置</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">点击“capacitor.config.json”文件可以查看 App 的原生包名与运行时设置，确保与您的原生环境一致。</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
          >
            开始探索
          </button>
        </div>
      </div>
    </div>
  );
};