"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useSearchContext } from '@/contexts/SearchContext';
import { useKeyPress } from '@/hooks/useKeyPress';
import { useSearch } from '@/hooks/useSearch';

export function CommandPalette() {
  const { isOpen, closeSearch, toggleSearch } = useSearchContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { results, groupedResults } = useSearch(query);

  useKeyPress('k', (e) => {
    e.preventDefault();
    toggleSearch();
  }, true);

  useKeyPress('escape', () => {
    if (isOpen) closeSearch();
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        router.push(`/${selected.category}/${selected.id}`);
        closeSearch();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeSearch}
      />
      <div className="relative w-full max-w-2xl bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 border-b border-border">
          <Search size={20} className="text-text-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent py-4 outline-none text-text-primary placeholder:text-text-muted"
            placeholder="Search algorithms, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="text-xs text-text-muted flex gap-1 font-mono bg-bg-tertiary px-2 py-1 rounded border border-border">
            <span>ESC</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
          {query.trim() !== '' && results.length === 0 && (
            <div className="p-8 text-center text-text-muted">
              No algorithms found for "{query}"
            </div>
          )}

          {Object.entries(groupedResults).map(([category, items]) => (
            <div key={category} className="mb-4 last:mb-0">
              <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {category}
              </div>
              <div className="flex flex-col gap-1">
                {items.map((algo) => {
                  const globalIndex = results.indexOf(algo);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <div
                      key={algo.id}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-bg-tertiary border-l-2 border-accent text-text-primary' 
                          : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary border-l-2 border-transparent'
                      }`}
                      onClick={() => {
                        router.push(`/${algo.category}/${algo.id}`);
                        closeSearch();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <span className="font-medium">{algo.name}</span>
                      <div className="flex gap-2">
                        {algo.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-bg-primary border border-border rounded text-text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
