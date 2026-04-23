'use client';

import { Activity, PlayCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/algorithms/categories';
import { useUserProgress } from '@/hooks/useUserProgress';

function formatIdToName(id: string) {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Home() {
  const { isMounted, progress, getSuggestedNext, completionPercentage, totalAlgorithms } =
    useUserProgress();

  if (!isMounted) {
    return <div className="h-full w-full bg-bg-primary" />;
  }

  const suggestedNext = getSuggestedNext();

  return (
    <div className="h-full w-full overflow-y-auto p-12 bg-bg-primary">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-medium mb-2">Welcome to AlgoLab</h1>
          <p className="text-text-muted">Master algorithms with interactive visualizations.</p>
        </header>

        {/* Up Next Section */}
        <section className="mb-8">
          <div className="bg-bg-secondary border border-border rounded-xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
                  Up Next
                </h2>
                <h3 className="text-2xl font-semibold mb-2">{suggestedNext.name}</h3>
                <p className="text-text-muted max-w-md mb-6">
                  Continue your learning journey with this recommended algorithm.
                </p>
                <Link
                  href={`/${suggestedNext.categoryId}/${suggestedNext.id}`}
                  className="inline-flex items-center gap-2 bg-text-primary text-bg-primary px-5 py-2.5 rounded-lg font-medium hover:bg-text-secondary transition-colors"
                >
                  <PlayCircle size={20} />
                  Start Lesson
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Progress & Recently Studied Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Progress */}
          <section className="lg:col-span-1">
            <div className="bg-bg-secondary border border-border rounded-xl p-6 h-full flex flex-col justify-center">
              <h2 className="text-sm font-semibold mb-4">Your Progress</h2>
              <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-light">{completionPercentage}%</span>
                <span className="text-text-muted text-sm">
                  {progress.completedAlgorithms.length} of {totalAlgorithms} completed
                </span>
              </div>
              <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </section>

          {/* Recently Studied */}
          {progress.recentlyStudied.length > 0 && (
            <section className="lg:col-span-2">
              <div className="bg-bg-secondary border border-border rounded-xl p-6 h-full">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-text-muted" />
                  Recently Studied
                </h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {progress.recentlyStudied.map((id) => {
                    // For Phase 1 we fallback to sorting category for the link
                    // Full mapping will be added when registry is complete
                    return (
                      <Link
                        key={id}
                        href={`/sorting/${id}`}
                        className="shrink-0 w-48 bg-bg-tertiary border border-border hover:border-text-muted rounded-lg p-4 transition-colors group"
                      >
                        <h3 className="font-medium text-sm mb-1 group-hover:text-accent transition-colors">
                          {formatIdToName(id)}
                        </h3>
                        <p className="text-xs text-text-muted">Resume lesson</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-medium mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => {
              const hasAlgorithms = !!cat.defaultAlgorithmId;
              const href = hasAlgorithms ? `/${cat.id}/${cat.defaultAlgorithmId}` : '#';

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`bg-bg-secondary border border-border p-6 rounded-xl transition-all flex items-start gap-4 group ${!hasAlgorithms ? 'opacity-60 cursor-not-allowed' : 'hover:border-text-muted hover:shadow-lg'}`}
                >
                  <div
                    className={`p-3 bg-bg-tertiary rounded-lg transition-colors ${hasAlgorithms ? 'group-hover:bg-accent/10' : ''}`}
                  >
                    <Activity
                      className={`transition-colors ${hasAlgorithms ? 'text-text-muted group-hover:text-accent' : 'text-text-muted/40'}`}
                      size={24}
                    />
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
