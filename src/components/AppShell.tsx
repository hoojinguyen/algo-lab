'use client';

import { CommandPalette } from '@/components/ui/CommandPalette';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {children}
          <CommandPalette />
        </main>
      </div>
    </div>
  );
}
