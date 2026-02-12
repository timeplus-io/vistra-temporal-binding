import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface Props {
  isActive: boolean;
}

export const AppendVisualizer: React.FC<Props> = ({ isActive }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastAddTimeRef = useRef<number>(0);

  // Using colors that work well in both modes (dark enough for light mode, bright enough for dark mode)
  // Or standard tailwind colors that we can control via style.
  const colors = ['#0ea5e9', '#06b6d4', '#3b82f6']; 

  const animate = (time: number) => {
    if (isPaused) return;

    setParticles(prev => {
      const moved = prev
        .map(p => ({ ...p, x: p.x - 0.15 }))
        .filter(p => p.x > -5);
      
      return moved;
    });

    if (time - lastAddTimeRef.current > 800) {
      const newParticle: Particle = {
        id: crypto.randomUUID(),
        x: 105,
        y: 20 + Math.random() * 60,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setParticles(prev => [...prev, newParticle]);
      lastAddTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, isPaused]);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Axis Binding</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
            Data flows continuously through a fixed time window. 
            Often used for line charts where history is preserved on the X-axis.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-surface hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-border rounded-md transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button 
            onClick={() => setParticles([])}
            className="p-2 bg-zinc-100 dark:bg-surface hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-border rounded-md transition-colors text-zinc-700 dark:text-zinc-300"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full bg-zinc-50 dark:bg-[#0c0c0e] rounded-md border border-border relative overflow-hidden shadow-sm transition-colors duration-300">
        {/* Grid Background */}
        <div className="absolute inset-0" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(120,120,120,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Labels */}
        <div className="absolute top-0 left-0 w-full h-8 bg-zinc-100/50 dark:bg-surface/50 border-b border-border flex items-center px-4 justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Past (t-5min)</span>
            <span>Live (t-now)</span>
        </div>

        {/* Enter/Exit Indicators */}
        <div className="absolute bottom-6 left-6 text-xs font-mono text-zinc-500 dark:text-zinc-600 flex items-center gap-2">
             <ArrowLeft size={14}/> <span>Exiting Window</span>
        </div>
        <div className="absolute bottom-6 right-6 text-xs font-mono text-sky-600 dark:text-sky-500 flex items-center gap-2 animate-pulse">
             <span>Incoming Stream</span> <ArrowRight size={14}/>
        </div>

        {/* Particles (Now Bigger: w-4 h-4) */}
        {particles.map(p => (
            <div
                key={p.id}
                className="absolute w-4 h-4 rounded-full shadow-md shadow-sky-500/20 dark:shadow-sky-500/50 border border-white/20"
                style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    backgroundColor: p.color,
                    opacity: p.x < 10 ? p.x / 10 : 1,
                }}
            />
        ))}


        {/* Current Time Cursor */}
        <div className="absolute top-8 bottom-0 right-[5%] w-px bg-sky-500/50 border-r border-dashed border-sky-500"></div>
      </div>
    </div>
  );
};