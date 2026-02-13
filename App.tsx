import React, { useState, useEffect } from 'react';
import { BindingMode } from './types';
import { AppendVisualizer } from './components/AppendVisualizer';
import { LatestVisualizer } from './components/LatestVisualizer';
import { TimeTravelVisualizer } from './components/TimeTravelVisualizer';
import { Home } from './components/Home';
import { ArrowRightLeft, Film, Database, Moon, Sun, LayoutGrid } from 'lucide-react';
import logo from './assets/timeplus-vistral_logo_pink.svg';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<BindingMode>(BindingMode.HOME);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system preference or default to dark
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const renderVisualizer = () => {
    switch (activeMode) {
      case BindingMode.HOME:
        return <Home isActive={activeMode === BindingMode.HOME} />;
      case BindingMode.AXIS:
        return <AppendVisualizer isActive={activeMode === BindingMode.AXIS} />;
      case BindingMode.KEY:
        return <LatestVisualizer isActive={activeMode === BindingMode.KEY} />;
      case BindingMode.FRAME:
        return <TimeTravelVisualizer isActive={activeMode === BindingMode.FRAME} />;
      default:
        return null;
    }
  };

  const NavItem = ({ mode, icon: Icon, label, subLabel }: { mode: BindingMode, icon: any, label: string, subLabel: string }) => (
    <button
      onClick={() => setActiveMode(mode)}
      className={`group w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-l-2 ${activeMode === mode
        ? 'bg-zinc-100 dark:bg-surface border-[#D53F8C] text-zinc-900 dark:text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
        : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
        }`}
    >
      <Icon size={18} className={activeMode === mode ? 'text-[#D53F8C]' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'} />
      <div className="flex flex-col items-start">
        <span className="leading-none">{label}</span>
        <span className="text-[10px] opacity-70 mt-1 font-mono">{subLabel}</span>
      </div>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-zinc-800 dark:text-zinc-200 font-sans selection:bg-primary/20 transition-colors duration-300">

      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-border bg-zinc-50 dark:bg-[#0c0c0e] transition-colors duration-300">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Vistral Logo" className="h-8" />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          <div className="px-4 pb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Temporal Bindings</h3>
          </div>
          <NavItem
            mode={BindingMode.HOME}
            icon={LayoutGrid}
            label="Home"
            subLabel="Infographic Overview"
          />
          <NavItem
            mode={BindingMode.AXIS}
            icon={ArrowRightLeft}
            label="Axis Binding"
            subLabel="Case 1: Stream"
          />
          <NavItem
            mode={BindingMode.FRAME}
            icon={Film}
            label="Frame Binding"
            subLabel="Case 2: Snapshots"
          />
          <NavItem
            mode={BindingMode.KEY}
            icon={Database}
            label="Key-based Updates"
            subLabel="Case 3: Mutable State"
          />
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="text-[14px] text-zinc-500 dark:text-zinc-600 space-y-2">
            <p>
              <a href="https://github.com/timeplus-io/vistral" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Vistral</a> is a streaming data visualization library open sourced by <a href="https://timeplus.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors"> Timeplus </a>, based on the Grammar of Graphics.
            </p>
            <p>
              Check out our open source SQL pipeline engine: <a href="https://github.com/timeplus-io/proton/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-900 dark:hover:text-zinc-400">Timeplus Proton</a>
            </p>
            <p>
              Want to contribute an idea or connect with our team? Join our community on <a href="https://timeplus.com/slack" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-900 dark:hover:text-zinc-400">Slack</a>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative transition-colors duration-300">
        <div className="flex-1 p-6 lg:p-10 overflow-auto flex flex-col">
          {renderVisualizer()}
        </div>
      </main>

    </div>
  );
};

export default App;