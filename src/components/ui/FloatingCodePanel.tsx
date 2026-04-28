'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Maximize2, GripHorizontal, X } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { clsx } from 'clsx';

interface FloatingCodePanelProps {
  code: string;
  activeLine?: number;
  isVisible: boolean;
  onClose?: () => void;
}

export function FloatingCodePanel({
  code,
  activeLine,
  isVisible,
  onClose,
}: FloatingCodePanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          drag
          dragMomentum={false}
          className="fixed bottom-32 left-8 z-50 w-80 pointer-events-auto"
        >
          <div className="bg-bg-primary/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header / Drag Handle */}
            <div className="px-4 py-2 bg-bg-tertiary/50 border-b border-border flex items-center justify-between cursor-grab active:cursor-grabbing group">
              <div className="flex items-center gap-2">
                <GripHorizontal
                  size={14}
                  className="text-muted group-hover:text-text-primary transition-colors"
                />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  Code Companion
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-border rounded transition-colors text-muted hover:text-text-primary"
                >
                  {isMinimized ? <Maximize2 size={12} /> : <Minus size={12} />}
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-error/10 rounded transition-colors text-muted hover:text-error"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <motion.div
              animate={{ height: isMinimized ? 0 : 'auto', opacity: isMinimized ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CodeBlock code={code} activeLine={activeLine} compact={true} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
