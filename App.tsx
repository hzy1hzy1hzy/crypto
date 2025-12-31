
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SecurityTools } from './components/SecurityTools';
import { NativeExport } from './components/NativeExport';
import { GuideModal } from './components/GuideModal';

const App: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.493 0 .893.4.893.891 0 .496-.4.895-.893.895a.892.892 0 110-1.786zm5.065 0c.493 0 .893.4.893.891 0 .496-.4.895-.893.895a.891.891 0 110-1.786z" />
            </svg>
            使用指南
          </button>
        </div>
        
        <SecurityTools />
        
        <NativeExport />

        {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      </div>
    </Layout>
  );
};

export default App;
