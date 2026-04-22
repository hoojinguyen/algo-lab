"use client";

import { Search, Settings, ArrowDownUp, Activity } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      {/* Icon Rail (48px) */}
      <nav className="w-12 border-r border-border flex flex-col items-center py-4 bg-bg-secondary z-20">
        <Link href="/" className="w-8 h-8 bg-text-primary rounded-md flex items-center justify-center mb-8">
          <Activity size={18} className="text-bg-primary" />
        </Link>
        
        <div className="flex flex-col gap-4 flex-1">
          <button 
            className={`p-2 rounded-md transition-colors ${activeCategory === 'sorting' ? 'text-accent bg-bg-tertiary' : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'}`}
            onClick={() => setActiveCategory(activeCategory === 'sorting' ? null : 'sorting')}
            title="Sorting"
          >
            <ArrowDownUp size={20} strokeWidth={1.75} />
          </button>
          <button 
            className={`p-2 rounded-md transition-colors ${activeCategory === 'searching' ? 'text-accent bg-bg-tertiary' : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'}`}
            onClick={() => setActiveCategory(activeCategory === 'searching' ? null : 'searching')}
            title="Searching"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <button className="p-2 text-text-muted hover:text-text-primary">
            <Search size={20} strokeWidth={1.75} />
          </button>
          <button className="p-2 text-text-muted hover:text-text-primary">
            <Settings size={20} strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      {/* Slide Panel (200px) */}
      {activeCategory && (
        <aside className="w-[200px] border-r border-border bg-bg-secondary flex flex-col z-10 transition-all duration-200">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold capitalize">{activeCategory}</h2>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
            <Link 
              href={`/${activeCategory}/bubble-sort`}
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md block"
            >
              Bubble Sort
            </Link>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
