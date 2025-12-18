
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-200">
      <div className="bg-blue-500 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
             <span className="text-xl">👴</span>
           </div>
           <h3 className="font-kids text-lg">钟表爷爷在线</h3>
        </div>
        {isLoading && (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150"></div>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-blue-50/30 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-blue-100 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl shadow-sm text-sm text-slate-400 flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
               爷爷正在找零件，请稍等...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-blue-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="问问钟表爷爷..."
          className="flex-1 px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-md active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
