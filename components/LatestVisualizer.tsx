import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Terminal } from 'lucide-react';

interface Props {
    isActive: boolean;
}

interface RowData {
    key: string;
    value: number;
    lastUpdated: number;
    highlight: boolean;
}

const INITIAL_DATA: RowData[] = [
    { key: 'CPU_USAGE', value: 45, lastUpdated: 0, highlight: false },
    { key: 'MEM_USAGE', value: 62, lastUpdated: 0, highlight: false },
    { key: 'NET_IO', value: 120, lastUpdated: 0, highlight: false },
];

export const LatestVisualizer: React.FC<Props> = ({ isActive }) => {
    const [data, setData] = useState<RowData[]>(INITIAL_DATA);
    const [incomingUpdate, setIncomingUpdate] = useState<{ key: string, value: number } | null>(null);

    useEffect(() => {
        if (!isActive) return;

        let step = 0;
        const interval = setInterval(() => {
            const targetKey = ['CPU_USAGE', 'MEM_USAGE', 'NET_IO'][step % 3];
            const newValue = Math.floor(Math.random() * 90) + 10;

            setIncomingUpdate({ key: targetKey, value: newValue });

            setTimeout(() => {
                setData(prev => prev.map(row => {
                    if (row.key === targetKey) {
                        return {
                            ...row,
                            value: newValue,
                            lastUpdated: Date.now(),
                            highlight: true
                        };
                    }
                    return { ...row, highlight: false };
                }));
                setIncomingUpdate(null);
            }, 800);

            step++;
        }, 2000);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Key-based Updates</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
                    Data updates mutate specific entities in place based on a unique Key.
                    The visualization reflects the "Latest" state.
                </p>
            </div>

            <div className="flex-1 w-full bg-zinc-50 dark:bg-[#0c0c0e] rounded-md border border-border flex flex-col md:flex-row items-center justify-center p-8 gap-12 relative overflow-hidden transition-colors duration-300">

                {/* Incoming Stream Line (Abstract) */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800 to-transparent"></div>

                {/* Database State Table (Left Side now) */}
                <div className="w-full max-w-sm bg-white dark:bg-surface border border-border rounded-md overflow-hidden shadow-2xl z-10 flex flex-col transition-colors duration-300">
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 px-4 py-2 border-b border-border flex justify-between items-center transition-colors">
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                            <Terminal size={12} />
                            Current State
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                        </div>
                    </div>
                    <div className="divide-y divide-border">
                        {data.map(row => (
                            <div
                                key={row.key}
                                className={`
                            group flex justify-between items-center px-5 py-4 transition-colors duration-300
                            ${row.highlight ? 'bg-pink-500/10 dark:bg-pink-500/20' : 'hover:bg-zinc-50 dark:hover:bg-white/5'}
                        `}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 font-mono">{row.key}</span>
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">ID: {row.key.substring(0, 3)}...</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`font-mono text-lg font-bold transition-all duration-300 ${row.highlight ? 'text-pink-600 dark:text-pink-400 scale-110' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                        {row.value}
                                    </span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${row.highlight ? 'bg-pink-500' : 'bg-transparent'} transition-colors duration-500`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 px-4 py-2 border-t border-border text-[10px] text-zinc-500 dark:text-zinc-600 text-center font-mono transition-colors">
                        Mutating state in-place
                    </div>
                </div>

                <div className="hidden md:block text-zinc-400 dark:text-zinc-700">
                    <ArrowLeft size={24} />
                </div>

                {/* The Incoming Event (Right Side now) */}
                <div className="relative h-24 w-64 flex items-center justify-center z-10">
                    <div className={`
                    bg-white dark:bg-surface border border-zinc-200 dark:border-zinc-700 rounded-md px-4 py-3 shadow-xl flex items-center gap-3
                    transition-all duration-500 ease-in-out
                    ${incomingUpdate ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}
               `}>
                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase">Update Event</span>
                            <div className="flex items-center gap-2 font-mono text-sm">
                                <span className="text-zinc-800 dark:text-zinc-300">{incomingUpdate?.key}</span>
                                <ArrowRight size={12} className="text-zinc-400 dark:text-zinc-600" />
                                <span className="text-pink-600 dark:text-pink-400 font-bold">{incomingUpdate?.value}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};