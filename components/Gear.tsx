
import React from 'react';
import { GearConfig } from '../types';

interface GearProps {
  config: GearConfig;
  currentRotation: number;
  onHover: (id: string | null) => void;
  isActive: boolean;
}

const Gear: React.FC<GearProps> = ({ config, currentRotation, onHover, isActive }) => {
  const { teeth, radius, color, label, position } = config;
  const rotation = currentRotation * config.speedRatio;

  // Generate gear path
  const points: string[] = [];
  const toothDepth = 8;
  const toothWidth = (2 * Math.PI * radius) / teeth / 2;

  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * 2 * Math.PI;
    const nextAngle = ((i + 0.5) / teeth) * 2 * Math.PI;
    
    // Outer tooth point
    const rOuter = radius + toothDepth;
    const x1 = rOuter * Math.cos(angle);
    const y1 = rOuter * Math.sin(angle);
    
    const x2 = rOuter * Math.cos(nextAngle);
    const y2 = rOuter * Math.sin(nextAngle);

    // Inner tooth point
    const rInner = radius - toothDepth;
    const angleInner = ((i + 0.5) / teeth) * 2 * Math.PI;
    const angleInnerNext = ((i + 1) / teeth) * 2 * Math.PI;
    
    const x3 = rInner * Math.cos(angleInner);
    const y3 = rInner * Math.sin(angleInner);
    
    const x4 = rInner * Math.cos(angleInnerNext);
    const y4 = rInner * Math.sin(angleInnerNext);

    if (i === 0) points.push(`M ${x1} ${y1}`);
    points.push(`L ${x2} ${y2}`);
    points.push(`L ${x3} ${y3}`);
    points.push(`L ${x4} ${y4}`);
  }

  return (
    <g 
      transform={`translate(${position.x}, ${position.y}) rotate(${rotation})`}
      className="cursor-pointer transition-all duration-300"
      onMouseEnter={() => onHover(config.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Gear Shadow */}
      <path 
        d={points.join(' ') + ' Z'} 
        fill="rgba(0,0,0,0.1)" 
        transform="translate(4, 4)"
      />
      {/* Main Gear */}
      <path 
        d={points.join(' ') + ' Z'} 
        fill={color}
        stroke="white"
        strokeWidth="2"
        className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
      />
      {/* Center hole */}
      <circle r={radius / 4} fill="#f0f9ff" stroke="white" strokeWidth="2" />
      
      {/* Spoke lines */}
      {[0, 90, 180, 270].map(deg => (
        <line 
          key={deg} 
          x1="0" y1="0" 
          x2={radius * 0.7 * Math.cos(deg * Math.PI / 180)} 
          y2={radius * 0.7 * Math.sin(deg * Math.PI / 180)} 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
      ))}

      {/* Label (static relative to gear center rotation) */}
      <g transform={`rotate(${-rotation})`}>
         <rect x="-25" y="-10" width="50" height="20" rx="10" fill="white" fillOpacity="0.8" />
         <text 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-[10px] font-bold font-kids select-none"
            fill="#333"
          >
            {label}
          </text>
      </g>
    </g>
  );
};

export default Gear;
