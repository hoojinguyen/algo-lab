"use client";

import { Activity } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/algorithms/categories';

export default function Home() {
  return (
    <div className="h-full w-full overflow-y-auto p-12 bg-bg-primary">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-medium mb-2">Welcome to AlgoLab</h1>
          <p className="text-text-muted">Master algorithms with interactive visualizations.</p>
        </header>

        <section className="mb-12">
          <div className="bg-bg-secondary border border-border rounded-xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold mb-1">Your Progress</h2>
              <p className="text-text-muted text-sm">0 of 55 completed</p>
            </div>
            <div className="w-64 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div className="h-full bg-accent w-0"></div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => {
              const hasAlgorithms = !!cat.defaultAlgorithmId;
              const href = hasAlgorithms ? `/${cat.id}/${cat.defaultAlgorithmId}` : '#';
              
              return (
                <Link 
                  key={cat.id}
                  href={href}
                  className={`bg-bg-secondary border border-border p-6 rounded-xl transition-all flex items-start gap-4 group ${!hasAlgorithms ? 'opacity-60 cursor-not-allowed' : 'hover:border-text-muted hover:shadow-lg'}`}
                >
                  <div className={`p-3 bg-bg-tertiary rounded-lg transition-colors ${hasAlgorithms ? 'group-hover:bg-accent/10' : ''}`}>
                    <Activity className={`transition-colors ${hasAlgorithms ? 'text-text-muted group-hover:text-accent' : 'text-text-muted/40'}`} size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{cat.name}</h3>
                      {!hasAlgorithms && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted/60 bg-bg-tertiary px-2 py-0.5 rounded border border-border">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-text-muted text-sm line-clamp-2">{cat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
