"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type RevealContext = {
  /** False only while a scroll-driven hero is still below its reveal point. */
  revealed: boolean;
  setRevealed: (value: boolean) => void;
};

const Ctx = createContext<RevealContext>({
  revealed: true,
  setRevealed: () => {},
});

/**
 * Lets a scroll hero tell the header when to appear.
 *
 * Pages without a hero never touch it, so the header defaults to visible —
 * which is what every non-home page needs.
 */
export function HeaderRevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [revealed, setRevealedState] = useState(true);

  // Called from a rAF loop, so bail out when the value hasn't flipped —
  // React would otherwise re-render the header on every frame.
  const setRevealed = useCallback((value: boolean) => {
    setRevealedState((prev) => (prev === value ? prev : value));
  }, []);

  const value = useMemo(() => ({ revealed, setRevealed }), [revealed, setRevealed]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useHeaderReveal = () => useContext(Ctx);
