
import React from 'react';
import { MiniProgramProject, ProjectFile } from '../types';

interface PreviewFrameProps {
  project: MiniProgramProject | null;
  selectedFile: ProjectFile | null;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ project, selectedFile }) => {
  return (
    <div className="relative w-[340px] h-[680px] bg-[#1a1a1a] rounded-[3.5rem] p-[12px] shadow-2xl border-[4px] border-[#333]">
      {/* 听筒/前置摄像头 */}
      <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-3xl z-30" />
      
      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col relative">
        {/* 微信顶部导航栏 */}
        <div className="pt-10 pb-2 px-4 flex items-center justify-between border-b border-gray-50 bg-white">
          <div className="flex items-center gap-1">
             <span className="text-[12px] font-bold text-gray-900">9:41</span>
          </div>
          <div className="flex-1 text-center truncate px-12">
            <span className="text-[13px] font-bold text-gray-800">
              {project?.title || '预览小程序'}
            </span>
          </div>
          {/* 模拟胶囊按钮 */}
          <div className="wechat-capsule">
            <div className="w-1 h-1 bg-white rounded-full opacity-60" />
            <div className="w-3.5 h-3.5 border-2 border-white/60 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full opacity-60" />
            </div>
            <div className="w-[1px] h-4 bg-white/20" />
            <div className="w-3.5 h-3.5 border-2 border-white/60 rounded-full flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
            </div>
          </div>
        </div>

        {/* 小程序页面内容模拟 */}
        <div className="flex-1 overflow-y-auto bg-[#F7F7F7] flex flex-col">
          {!project ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">输入你的想法，AI 将在这里构建小程序界面</p>
            </div>
          ) : (
            <div className="p-4 space-y-4 animate-in fade-in duration-500">
               {/* 模拟第一个生成的页面 UI */}
               <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-wechat-green/10 rounded-full flex items-center justify-center text-wechat-green">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">模块解析成功</h4>
                      <p className="text-[10px] text-gray-400 tracking-tight">Component Rendering...</p>
                    </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <div className="h-2.5 bg-gray-200 rounded-full w-2/3 animate-pulse" />
                 <div className="h-2.5 bg-gray-200 rounded-full w-full animate-pulse" />
                 <div className="h-2.5 bg-gray-200 rounded-full w-1/2 animate-pulse" />
               </div>

               <div className="grid grid-cols-2 gap-3 mt-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-square bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[10px] text-gray-300">
                     WeUI Card
                   </div>
                 ))}
               </div>

               <button className="w-full bg-wechat-green text-white py-3 rounded-md text-sm font-bold shadow-lg shadow-green-500/10 active:opacity-90 transition-opacity">
                 模拟点击交互
               </button>
            </div>
          )}
        </div>

        {/* 模拟 TabBar */}
        <div className="h-14 bg-white border-t border-gray-100 flex items-center justify-around px-6 shrink-0">
          <div className="flex flex-col items-center gap-1">
             <div className="w-5 h-5 bg-wechat-green rounded-md" />
             <span className="text-[9px] font-medium text-wechat-green">首页</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-30">
             <div className="w-5 h-5 bg-gray-400 rounded-md" />
             <span className="text-[9px] font-medium text-gray-600">我的</span>
          </div>
        </div>
      </div>
    </div>
  );
};
