'use client';

import { useEffect } from 'react';

export function useKeyPress(
  key: string,
  callback: (e: KeyboardEvent) => void,
  metaKey: boolean = false
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the pressed key matches
      if (event.key.toLowerCase() === key.toLowerCase()) {
        // If metaKey is required, ensure either ctrlKey or metaKey (Cmd on Mac) is pressed
        if (metaKey && !(event.metaKey || event.ctrlKey)) {
          return;
        }
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, metaKey]);
}
