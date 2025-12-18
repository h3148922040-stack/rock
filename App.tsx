
import React, { useState } from 'react';
import ClockInternal from './components/ClockInternal';
import ChatBox from './components/ChatBox';
import { GearConfig, ChatMessage } from './types';
import { askClockQuestion } from './services/geminiService';

const App: React.FC = () => {
  const [speed, setSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<'surface' | 'internal'>('internal');
  const [selectedGear, setSelectedGear] = useState<GearConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '嗨！我是钟表爷爷。试着点击左边的齿轮，我会帮你把它们“拆出来”仔细瞧瞧，并告诉你它们的秘密哦！你也可以点击右上角的开关，看看时钟的外壳。' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsAiLoading(true);
    const answer = await askClockQuestion(text);
    setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    setIsAiLoading(false);
  };

  const handleGearDisassemble = async (gear: GearConfig) => {
    const question = `请告诉我${gear.name}在时钟里的具体作用是什么？它为什么很重要？`;
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-kids text-blue-600 mb-2 drop-shadow-sm">
          小小钟表匠 🕰️
        </h1>
        <p className="text-slate-500 font-medium">探索时钟内部的“齿轮王国”</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left Side: Simulation */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative group">
            <ClockInternal 
              speedMultiplier={speed} 
              viewMode={viewMode}
              onGearSelect={setSelectedGear}
              onDisassemble={handleGearDisassemble}
            />
            
            {/* View Toggle Button */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`text-xs font-bold ${viewMode === 'surface' ? 'text-blue-600' : 'text-slate-400'}`}>外壳</span>
              <button 
                onClick={() => setViewMode(prev => prev === 'surface' ? 'internal' : 'surface')}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${viewMode === 'internal' ? 'bg-blue-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${viewMode === 'internal' ? 'translate-x-7' : ''}`} />
              </button>
              <span className={`text-xs font-bold ${viewMode === 'internal' ? 'text-blue-600' : 'text-slate-400'}`}>内部</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-600">快慢魔法棒 (速度: {speed}x)</label>
                <button 
                  onClick={() => setSpeed(1)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-slate-500"
                >
                  重置速度
                </button>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>暂停</span>
                <span>正常</span>
                <span>疯狂加速</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSpeed(prev => Math.max(0, prev - 1))}
                className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-xl"
              >
                🐢
              </button>
              <button 
                onClick={() => setSpeed(prev => Math.min(100, prev + 5))}
                className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-xl"
              >
                🚀
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Information & Chat */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-[700px] lg:h-auto">
          {/* Info Card */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100 h-1/3 overflow-hidden flex flex-col">
            <h2 className="text-xl font-kids text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔍</span> 
              {selectedGear ? '齿轮档案' : '发现秘密'}
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              {selectedGear ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: selectedGear.color }}
                    />
                    <h3 className="font-bold text-lg text-slate-700">{selectedGear.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                      {selectedGear.teeth} 颗牙齿
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedGear.description}
                  </p>
                  <p className="mt-2 text-[10px] text-blue-500 font-bold uppercase tracking-wider">切换到“内部”模式并点击齿轮拆解</p>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <p className="text-sm italic">“切换模式来看看时钟的秘密吧！”</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Chat */}
          <div className="flex-1">
            <ChatBox 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isAiLoading} 
            />
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-slate-400 text-xs pb-8">
        <p>© 2024 小小钟表匠科普工坊 - 寓教于乐，探索科学</p>
      </footer>
    </div>
  );
};

export default App;
