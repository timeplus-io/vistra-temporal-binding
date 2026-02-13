import React, { useEffect, useRef } from 'react';

export const Home: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const srcRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    const drawLines = () => {
        const svg = svgRef.current;
        const srcEl = srcRef.current;
        const targetEl = targetRef.current;

        if (!svg || !srcEl || !targetEl) return;

        // Clear existing lines by removing all child nodes
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Helper to get coordinates relative to the SVG container
        const getPoint = (element: Element, type: 'left' | 'right') => {
            const rect = element.getBoundingClientRect();
            const containerRect = svg.getBoundingClientRect();
            return {
                x: (type === 'right' ? rect.right : rect.left) - containerRect.left,
                y: (rect.top + rect.height / 2) - containerRect.top
            };
        };

        const start = getPoint(srcEl, 'right');
        const tRect = targetEl.getBoundingClientRect();
        const cRect = svg.getBoundingClientRect();
        const end = {
            x: tRect.left - cRect.left,
            y: tRect.top - cRect.top
        };

        // Bezier Curve Logic
        const cp1 = { x: start.x + (end.x - start.x) * 0.6, y: start.y };
        const cp2 = { x: start.x + (end.x - start.x) * 0.4, y: end.y };

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;

        path.setAttribute("d", d);
        path.setAttribute("class", "fill-none stroke-pink-500 stroke-2 opacity-80");
        svg.appendChild(path);

        // Start Circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(start.x));
        circle.setAttribute("cy", String(start.y));
        circle.setAttribute("r", "3");
        circle.setAttribute("fill", "#D53F8C");
        svg.appendChild(circle);

        // End Circle
        const circleEnd = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circleEnd.setAttribute("cx", String(end.x));
        circleEnd.setAttribute("cy", String(end.y));
        circleEnd.setAttribute("r", "3");
        circleEnd.setAttribute("fill", "#D53F8C");
        svg.appendChild(circleEnd);
    };

    useEffect(() => {
        if (!isActive) return;

        // Initial draw
        // Small timeout to ensure DOM is fully laid out
        const timer = setTimeout(drawLines, 100);

        const handleResize = () => {
            drawLines();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive]);


    if (!isActive) return null;

    return (
        <div className="w-full max-w-[1000px] mx-auto min-h-full flex flex-col items-center justify-center py-10">
            <header className="mb-10 relative text-center max-w-[700px] mx-auto">
                <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4 tracking-tight">
                    Extending the Grammar of <span className="text-pink-500">Graphics</span><br />
                    with <span className="text-pink-500">Temporal Binding</span>
                </h1>

                <div className="h-10 w-full relative mb-6 flex items-center justify-center">
                    <div className="absolute w-full h-px bg-zinc-300 dark:bg-zinc-700 top-1/2"></div>
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-pink-500 flex items-center justify-center relative z-10">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-pink-500 ml-0.5"></div>
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-zinc-900 dark:text-zinc-300 mb-8">
                    Temporal Binding introduces <strong className="font-semibold text-zinc-800 dark:text-zinc-200">streaming data capabilities</strong> to the Grammar of Graphics, enabling new dynamic visualizations that evolve over time.
                </p>
            </header>

            <div className="flex justify-between relative gap-16 w-full max-w-[1000px] lg:flex-row flex-col">
                {/* Canvas for connecting lines */}
                <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden lg:block"></svg>

                {/* Left Column: Standard Layers */}
                <div className="flex flex-col gap-3 w-full lg:w-[35%] z-10">
                    {/* Layer Items */}
                    {[
                        { id: '01', name: 'Data', iconPath: "M12 2C6.48 2 2 4.02 2 6.5S6.48 11 12 11s10-2.02 10-4.5S17.52 2 12 2zm0 13c-5.52 0-10-2.02-10-4.5V11c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5V6.5c0 2.48-4.48 4.5-10 4.5zm0 7c-5.52 0-10-2.02-10-4.5V18c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v-3.5c0 2.48-4.48 4.5-10 4.5z" },
                        { id: '02', name: 'Aesthetics', iconPath: "M7 14c-1.66 0-3 1.34-3 3 0 1.31 1.16 2.62 2.23 3.25.12.07.28-.04.23-.17-.46-1.12.35-2.08 1.54-2.08h.5c.83 0 1.5-.67 1.5-1.5V14H7zM20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z" },
                        { id: '03', name: 'Geometries', iconPath: "M12 2L2 22h20L12 2zm0 3.5L18.5 19H5.5L12 5.5z" },
                        { id: '04', name: 'Facets', iconPath: "M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" },
                        { id: '05', name: 'Statistics', iconPath: "M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z" },
                        { id: '06', name: 'Coordinates', iconPath: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
                    ].map((layer) => (
                        <div key={layer.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 px-4 flex items-center gap-3 relative h-12 transition-transform duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:translate-x-1 overflow-hidden group">
                            <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-sm bg-zinc-400 dark:bg-zinc-600"></div>
                            <span className="font-sans text-xs text-zinc-500 dark:text-zinc-400 font-normal min-w-[18px]">{layer.id}</span>
                            <span className="w-4 h-4 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d={layer.iconPath} /></svg>
                            </span>
                            <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{layer.name}</span>
                        </div>
                    ))}

                    {/* NEW ADDED LAYER: TEMPORAL BINDING */}
                    <div ref={srcRef} className="bg-pink-50 dark:bg-pink-900/10 border border-pink-500 rounded p-2 px-4 flex items-center gap-3 relative h-12 shadow-[0_0_0_1px_rgba(213,63,140,0.1)]">
                        <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-sm bg-pink-500"></div>
                        <span className="font-sans text-xs text-pink-500 font-semibold min-w-[18px]">07</span>
                        <span className="w-4 h-4 text-pink-500 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
                        </span>
                        <span className="font-semibold text-sm text-pink-500">Temporal Binding</span>
                        {/* Anchor for SVG line */}
                        <div className="absolute right-0 top-1/2 w-px h-px"></div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 px-4 flex items-center gap-3 relative h-12 transition-transform duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:translate-x-1 overflow-hidden group">
                        <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-sm bg-zinc-400 dark:bg-zinc-600"></div>
                        <span className="font-sans text-xs text-zinc-500 dark:text-zinc-400 font-normal min-w-[18px]">08</span>
                        <span className="w-4 h-4 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" /></svg>
                        </span>
                        <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">Theme</span>
                    </div>
                </div>

                {/* Right Column: Temporal Binding Extension */}
                <div className="w-full lg:w-[60%] z-10 bg-white dark:bg-zinc-900 border border-pink-500 shadow-sm rounded p-6 flex flex-col gap-4 relative">
                    <div ref={targetRef} className="absolute left-[-1px] top-[45px] w-px h-px"></div> {/* Connection Target */}

                    <div className="flex items-center gap-3 mb-2 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                        <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white">
                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 m-0">
                                Temporal Binding <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm uppercase font-semibold tracking-wider">New Layer</span>
                            </h3>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-900 dark:text-zinc-300 mb-2">Defines <strong className="font-semibold text-zinc-800 dark:text-zinc-200">when</strong> data appears, is, and disappears on the canvas.</p>

                    {/* Sub Card 1: Axis Bound */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-4 flex gap-4 items-center relative transition-colors duration-200 hover:border-zinc-400 dark:hover:border-zinc-500">
                        <div className="w-[100px] h-[48px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded flex items-center justify-center shrink-0 p-0.5">
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                                <line x1="10" y1="50" x2="90" y2="50" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1" />
                                <line x1="10" y1="10" x2="10" y2="50" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1" />
                                <path d="M10 45 Q 30 40, 50 30 T 90 10" strokeLinecap="round" fill="none" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.5" />
                                <circle cx="50" cy="30" r="3" className="fill-pink-500 stroke-white dark:stroke-zinc-800 stroke-[1px]" />
                                <circle cx="90" cy="10" r="3" className="fill-pink-500 stroke-white dark:stroke-zinc-800 stroke-[1px]" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-zinc-800 dark:text-zinc-200 mb-1 text-xs font-semibold">Axis-Bound</h4>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-snug m-0">Time mapped to a visual axis with sliding window.</p>
                        </div>
                    </div>

                    {/* Sub Card 2: Frame Bound */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-4 flex gap-4 items-center relative transition-colors duration-200 hover:border-zinc-400 dark:hover:border-zinc-500">
                        <div className="w-[100px] h-[48px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded flex items-center justify-center shrink-0 p-0.5">
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                                {/* Frame 1 */}
                                <rect x="5" y="15" width="22" height="22" rx="2" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" />
                                <text x="5" y="12" className="text-[5px] fill-zinc-400 font-semibold" style={{ fontSize: '5px' }}>T=3</text>
                                <path d="M9 25 L12 22 L15 25 L12 28 Z" fill="#D53F8C" />
                                <path d="M20 18 L23 15 L26 18 L23 21 Z" fill="#514E58" />
                                <path d="M30 26 H34 M32 24 L34 26 L32 28" className="stroke-zinc-400" strokeWidth="1" fill="none" />

                                {/* Frame 2 */}
                                <rect x="37" y="15" width="22" height="22" rx="2" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" />
                                <text x="37" y="12" className="text-[5px] fill-zinc-400 font-semibold" style={{ fontSize: '5px' }}>T=4</text>
                                <path d="M47 20 L50 17 L53 20 L50 23 Z" fill="#D53F8C" />
                                <path d="M42 28 L45 25 L48 28 L45 31 Z" fill="#514E58" />
                                <path d="M62 26 H66 M64 24 L66 26 L64 28" className="stroke-zinc-400" strokeWidth="1" fill="none" />

                                {/* Frame 3 */}
                                <rect x="69" y="15" width="22" height="22" rx="2" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" />
                                <text x="69" y="12" className="text-[5px] fill-zinc-400 font-semibold" style={{ fontSize: '5px' }}>T=5</text>
                                <path d="M80 15 L83 12 L86 15 L83 18 Z" fill="#D53F8C" />
                                <path d="M75 25 L78 22 L81 25 L78 28 Z" fill="#514E58" />

                                <text x="60" y="55" className="text-[5px] fill-zinc-300 dark:fill-zinc-600 font-semibold" style={{ fontSize: '5px' }}>SNAPSHOT</text>
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-zinc-800 dark:text-zinc-200 mb-1 text-xs font-semibold">Frame-Bound</h4>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-snug m-0">Time controls playback of complete snapshots.</p>
                        </div>
                    </div>

                    {/* Sub Card 3: Key Bound */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-4 flex gap-4 items-center relative transition-colors duration-200 hover:border-zinc-400 dark:hover:border-zinc-500">
                        <div className="w-[100px] h-[48px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded flex items-center justify-center shrink-0 p-0.5">
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                                {/* Frame 1 */}
                                <rect x="2" y="15" width="25" height="25" rx="2" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" />
                                <rect x="5" y="30" width="4" height="8" fill="#514E58" />
                                <rect x="11" y="25" width="4" height="13" fill="#514E58" />
                                <rect x="17" y="28" width="4" height="10" fill="#514E58" />
                                <path d="M30 26 H33 M31 24 L33 26 L31 28" className="stroke-zinc-400" strokeWidth="1" fill="none" />

                                {/* Frame 2 */}
                                <rect x="36" y="15" width="25" height="25" rx="2" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" />
                                <rect x="39" y="30" width="4" height="8" fill="#514E58" />
                                <rect x="45" y="20" width="4" height="18" fill="#D53F8C" />
                                <rect x="51" y="28" width="4" height="10" fill="#514E58" />
                                <text x="36" y="52" className="text-[5px] fill-zinc-400 font-semibold" style={{ fontSize: '5px' }}>Key B Upd</text>
                                <path d="M64 26 H67 M65 24 L67 26 L65 28" className="stroke-zinc-400" strokeWidth="1" fill="none" />

                                {/* Frame 3 */}
                                <rect x="70" y="15" width="25" height="25" rx="2" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" />
                                <rect x="73" y="28" width="4" height="10" fill="#D53F8C" />
                                <rect x="79" y="20" width="4" height="18" fill="#514E58" />
                                <rect x="85" y="28" width="4" height="10" fill="#514E58" />
                                <text x="70" y="52" className="text-[5px] fill-zinc-400 font-semibold" style={{ fontSize: '5px' }}>Key A Upd</text>
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-zinc-800 dark:text-zinc-200 mb-1 text-xs font-semibold">Key-Bound</h4>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-snug m-0">Latest value maintained per entity key.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
