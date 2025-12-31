
import React, { useState } from 'react';
import { 
  generateECCKeyPair, 
  exportKey, 
  encryptFileECC, 
  decryptFileECC, 
  importPrivateKey 
} from '../utils/crypto';

type ToolTab = 'encrypt' | 'decrypt';

export const SecurityTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('encrypt');
  const [file, setFile] = useState<File | null>(null);
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [keys, setKeys] = useState<{ pub: string; priv: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onEncrypt = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const keyPair = await generateECCKeyPair();
      const pubStr = await exportKey(keyPair.publicKey, 'spki');
      const privStr = await exportKey(keyPair.privateKey, 'pkcs8');
      setKeys({ pub: pubStr, priv: privStr });
      const { encryptedBlob } = await encryptFileECC(file, keyPair.publicKey);
      downloadBlob(encryptedBlob, `${file.name}.enc`);
    } catch (err) {
      alert("加密失败，请重试。");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDecrypt = async () => {
    if (!file || !privateKeyInput) return;
    setIsProcessing(true);
    try {
      const privKey = await importPrivateKey(privateKeyInput);
      const encryptedData = await file.arrayBuffer();
      const decryptedBlob = await decryptFileECC(encryptedData, privKey);
      const originalName = file.name.replace('.enc', '') || 'decrypted_file';
      downloadBlob(decryptedBlob, originalName);
    } catch (err) {
      alert("解密失败！私钥不正确或文件已损坏。");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      {/* 核心卡片 */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-white overflow-hidden p-2">
        {/* 简洁切换栏 */}
        <div className="flex p-1.5 bg-slate-100/50 rounded-3xl border border-slate-200/50">
          {(['encrypt', 'decrypt'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setFile(null); setKeys(null); }}
              className={`flex-1 py-3.5 rounded-[1.25rem] text-sm font-bold transition-all duration-300 ${
                activeTab === tab 
                ? 'bg-white shadow-xl shadow-slate-200/50 text-indigo-600' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'encrypt' ? '加密文件' : '解密文件'}
            </button>
          ))}
        </div>

        <div className="px-6 py-8 space-y-6">
          {/* 上传区 */}
          <div className="relative group">
            <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className={`py-14 border-2 border-dashed rounded-[2rem] transition-all duration-500 flex flex-col items-center gap-4 ${
              file 
              ? 'bg-indigo-50/50 border-indigo-200 ring-4 ring-indigo-500/5' 
              : 'bg-slate-50/50 border-slate-100 group-hover:bg-slate-50 group-hover:border-slate-200'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                file ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 rotate-12' : 'bg-white shadow-sm text-slate-300'
              }`}>
                {file ? (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-base">
                  {file ? file.name : '点击或拖入文件'}
                </p>
                {!file && <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">支持任意文件类型</p>}
              </div>
            </div>
          </div>

          {activeTab === 'decrypt' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">输入您的私钥</label>
              <textarea 
                value={privateKeyInput}
                onChange={(e) => setPrivateKeyInput(e.target.value)}
                placeholder="在此粘贴 .pkcs8 私钥字符串..."
                className="w-full h-28 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-xs font-mono focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
              />
            </div>
          )}

          <button
            onClick={activeTab === 'encrypt' ? onEncrypt : onDecrypt}
            disabled={!file || isProcessing || (activeTab === 'decrypt' && !privateKeyInput)}
            className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest text-white shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
              activeTab === 'encrypt' 
              ? 'bg-slate-900 shadow-slate-900/20 hover:bg-black' 
              : 'bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-700'
            } disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                正在处理
              </>
            ) : (activeTab === 'encrypt' ? '加密并保存文件' : '验证私钥并解密')}
          </button>
        </div>
      </div>

      {/* 结果显示 - 优化后的私钥展示 */}
      {keys && activeTab === 'encrypt' && (
        <div className="bg-amber-500 rounded-[2.5rem] p-8 space-y-5 animate-in zoom-in-95 duration-500 shadow-2xl shadow-amber-500/20 border border-amber-400">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">极其重要：备份私钥</h4>
              <p className="text-[10px] opacity-90 mt-0.5">文件已加密，此私钥是恢复数据的唯一钥匙。</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-black/10 rounded-2xl blur-sm group-hover:blur-md transition-all" />
              <code className="relative block p-5 bg-black/20 rounded-2xl text-[10px] font-mono break-all text-white border border-white/10 leading-relaxed">
                {keys.priv}
              </code>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(keys.priv);
                alert('私钥已复制到剪贴板，请妥善保存！');
              }}
              className="w-full py-4 bg-white text-amber-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              点击复制私钥
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
