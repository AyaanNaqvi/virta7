import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface BackgroundVideoContextValue {
  suppressed: boolean;
  suppressBackgroundVideo: () => void;
  releaseBackgroundVideo: () => void;
}

const BackgroundVideoContext = createContext<BackgroundVideoContextValue | null>(null);

// Lets a screen with its own video (e.g. the greeting intro) tell
// AppBackground to pause its currently-playing video while that other video
// is on screen. Android WebView can only decode a couple of videos at once
// before rendering starts corrupting — a count rather than a plain boolean
// so overlapping callers (unlikely today, but cheap to support) don't step
// on each other releasing too early.
export function BackgroundVideoProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const suppressBackgroundVideo = useCallback(() => setCount((c) => c + 1), []);
  const releaseBackgroundVideo = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);

  return (
    <BackgroundVideoContext.Provider value={{ suppressed: count > 0, suppressBackgroundVideo, releaseBackgroundVideo }}>
      {children}
    </BackgroundVideoContext.Provider>
  );
}

export function useBackgroundVideoControl(): BackgroundVideoContextValue {
  const ctx = useContext(BackgroundVideoContext);
  if (!ctx) throw new Error('useBackgroundVideoControl must be used within BackgroundVideoProvider');
  return ctx;
}
