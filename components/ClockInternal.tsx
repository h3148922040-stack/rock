
import React, { useState, useEffect, useRef } from 'react';
import Gear from './Gear';
import { GEAR_CONFIGS } from '../constants';
import { GearConfig } from '../types';

interface ClockInternalProps {
  speedMultiplier: number;
  viewMode: 'surface' | 'internal';
  onGearSelect: (gear: GearConfig | null) => void;
  onDisassemble: (gear: GearConfig) => void;
}

const ClockInternal: React.FC<ClockInternalProps> = ({ speedMultiplier, viewMode, onGearSelect, onDisassemble }) => {
  const [rotation, setRotation] = useState(0);
  const [disassembledGearId, setDisassembledGearId] = useState<string | null>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;
      setRotation(prev => (prev + 0.006 * deltaTime * speedMultiplier) % 360000);
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [speedMultiplier]);

  const handleGearClick = (gear: GearConfig) => {
    if (viewMode === 'surface') return; // 表盘模式下不允许拆解
    if (disassembledGearId === gear.id) return;
    
    setDisassembledGearId(gear.id);
    onDisassemble(gear);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisassembledGearId(null);
    }, 8000);
  };

  // 生成刻度
  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6) * Math.PI / 180;
      const isHour = i % 5 === 0;
      const rInner = isHour ? 170 : 180;
      const rOuter = 190;
      ticks.push(
        <line
          key={i}
          x1={rInner * Math.sin(angle)}
          y1={-rInner * Math.cos(angle)}
          x2={rOuter * Math.sin(angle)}
          y2={-rOuter * Math.cos(angle)}
          stroke={isHour ? "#334155" : "#94a3b8"}
          strokeWidth={isHour ? 3 : 1}
        />
      );

      if (isHour) {
        const hour = i / 5 === 0 ? 12 : i / 5;
        const rText = 150;
        ticks.push(
          <text
            key={`text-${i}`}
            x={rText * Math.sin(angle)}
            y={-rText * Math.cos(angle) + 6}
            textAnchor="middle"
            className="text-xl font-kids fill-slate-700 select-none"
          >
            {hour}
          </text>
        );
      }
    }
    return ticks;
  };

  return (
    <div className="relative w-full h-[500px] bg-white rounded-3xl shadow-inner overflow-hidden border-8 border-yellow-400">
      <svg 
        viewBox="-200 -200 400 400" 
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="clockBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle r="190" fill="url(#clockBg)" />
        
        {/* The Gears */}
        <g className="transition-opacity duration-500" style={{ opacity: viewMode === 'surface' ? 0.15 : 1 }}>
          {[...GEAR_CONFIGS].reverse().map(gear => {
            const isDisassembled = disassembledGearId === gear.id;
            
            if (isDisassembled) {
              return (
                <g key={`placeholder-${gear.id}`} transform={`translate(${gear.position.x}, ${gear.position.y})`}>
                  <circle 
                    r={gear.radius} 
                    fill="none" 
                    stroke={gear.color} 
                    strokeWidth="2" 
                    strokeDasharray="6 4" 
                    className="animate-pulse"
                    opacity="0.3"
                  />
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="24" filter="url(#glow)">🔍</text>
                </g>
              );
            }

            return (
              <g key={gear.id} onClick={() => handleGearClick(gear)}>
                <Gear 
                  config={gear}
                  currentRotation={rotation}
                  onHover={(id) => onGearSelect(id ? GEAR_CONFIGS.find(g => g.id === id) || null : null)}
                  isActive={true}
                />
              </g>
            );
          })}
        </g>

        {/* Clock Surface (Numbers & Ticks) */}
        <g className="transition-opacity duration-500" style={{ opacity: viewMode === 'surface' ? 1 : 0.2 }}>
           {renderTicks()}
        </g>

        {/* Pin and Hands */}
        <circle r="8" fill="#475569" stroke="white" strokeWidth="2" />
        
        {/* 时针 */}
        <g transform={`rotate(${rotation * (1/60 * 1/12)})`}>
          <line x1="0" y1="0" x2="0" y2="-100" stroke="#10b981" strokeWidth={viewMode === 'surface' ? 8 : 6} strokeLinecap="round" className="transition-all" />
        </g>
        {/* 分针 */}
        <g transform={`rotate(${rotation * (1/60)})`}>
          <line x1="0" y1="0" x2="0" y2="-140" stroke="#3b82f6" strokeWidth={viewMode === 'surface' ? 6 : 4} strokeLinecap="round" className="transition-all" />
        </g>
        {/* 秒针 */}
        <g transform={`rotate(${rotation})`}>
          <line x1="0" y1="0" x2="0" y2="-160" stroke="#ef4444" strokeWidth={viewMode === 'surface' ? 3 : 2} strokeLinecap="round" className="transition-all" />
          <circle r="4" fill="#ef4444" />
        </g>
      </svg>
      
      {disassembledGearId && viewMode === 'internal' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce">
          💡 观察：{GEAR_CONFIGS.find(g => g.id === disassembledGearId)?.name} 已被拆解！
        </div>
      )}

      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded-xl text-[10px] font-bold text-slate-500 shadow-sm border border-slate-100">
        {viewMode === 'surface' ? '当前：表盘模式' : '当前：内部模式（点击齿轮拆解）'}
      </div>
    </div>
  );
};

export default ClockInternal;
