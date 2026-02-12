import React, { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw, Clock } from 'lucide-react';

interface Props {
  isActive: boolean;
}

const getPosition = (t: number, i: number) => {
    const angle = (t * 0.5) + (i * 2);
    const radius = 30;
    const cx = 50;
    const cy = 50;
    return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
    };
};

export const TimeTravelVisualizer: React.FC<Props> = ({ isActive }) => {
  const [baseTime, setBaseTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
        setBaseTime(t => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isActive]);

  const frames = [0, 1, 2].map(offset => {
      const t = baseTime + offset;
      const points = [0, 1, 2].map(i => ({
          id: i,
          ...getPosition(t, i),
          color: ['#f472b6', '#c084fc', '#818cf8'][i] // Violet/Pink palette
      }));
      return { t, points };
  });

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Frame Binding</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
            Data is grouped into discrete time snapshots. 
            Useful for animations or comparing state at distinct moments.
          </p>
        </div>
        <button 
            onClick={() => setBaseTime(0)}
            className="p-2 bg-zinc-100 dark:bg-surface hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-border rounded-md transition-colors text-zinc-700 dark:text-zinc-300"
        >
            <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex-1 w-full bg-zinc-50 dark:bg-[#0c0c0e] rounded-md border border-border p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', color: 'var(--border-color)'}}></div>

         <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full z-10">
            {frames.map((frame, idx) => (
                <React.Fragment key={frame.t}>
                    {/* Frame Card */}
                    <div className="flex flex-col gap-3 flex-1 w-full max-w-[240px] animate-fade-in group">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Clock size={12}/> Frame</span>
                            <span className="text-zinc-700 dark:text-zinc-300">T = {frame.t}</span>
                        </div>
                        
                        <div className="aspect-square w-full bg-white dark:bg-surface border border-border rounded-md relative overflow-hidden shadow-lg transition-all duration-300 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-xl">
                            {/* Inner Grid */}
                             <div className="absolute inset-0" style={{ 
                                 backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)', 
                                 backgroundSize: '20px 20px',
                                 opacity: 0.5
                             }}></div>

                             {/* Points */}
                             {frame.points.map(p => (
                                 <div 
                                    key={p.id}
                                    className="absolute w-3 h-3 rounded-sm rotate-45 border border-white/20 transition-all duration-1000 ease-in-out shadow-sm"
                                    style={{
                                        left: `${p.x}%`,
                                        top: `${p.y}%`,
                                        backgroundColor: p.color,
                                        transform: 'translate(-50%, -50%) rotate(45deg)'
                                    }}
                                 />
                             ))}
                             
                             <div className="absolute bottom-2 right-2 text-[10px] text-zinc-400 dark:text-zinc-700 font-mono">
                                SNAPSHOT
                             </div>
                        </div>
                    </div>

                    {/* Connector */}
                    {idx < frames.length - 1 && (
                        <div className="hidden md:flex text-zinc-300 dark:text-zinc-700">
                            <ArrowRight size={20} />
                        </div>
                    )}
                </React.Fragment>
            ))}
         </div>
      </div>
    </div>
  );
};