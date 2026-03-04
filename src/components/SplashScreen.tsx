import { useEffect, useRef, useState } from "react";

type SplashPhase = "visible" | "transitioning" | "done";

interface SplashScreenProps {
  onDone: () => void;
}

const SPLASH_DURATION = 1800; // ms before transition starts
const TRANSITION_DURATION = 900; // ms for the full animation to complete

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<SplashPhase>("visible");
  const [logoRect, setLogoRect] = useState<DOMRect | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      // Snapshot the logo's exact position before switching to fixed
      if (logoRef.current) {
        setLogoRect(logoRef.current.getBoundingClientRect());
      }
      setPhase("transitioning");
      onDone();
    }, SPLASH_DURATION);

    const doneTimer = setTimeout(() => {
      setPhase("done");
    }, SPLASH_DURATION + TRANSITION_DURATION);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  if (phase === "done") return null;

  const isTransitioning = phase === "transitioning";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-50 ${
        isTransitioning ? "splash-overlay-animate" : ""
      }`}
    >
      {/* Wrapper reserves space in flow so text never reflows */}
      <div className="relative mb-12 h-16 w-16 shrink-0">
        {!isTransitioning && (
          <div
            ref={logoRef}
            className="absolute inset-0 animate-pulse rounded-full bg-linear-to-br from-rose-400 to-pink-600"
          />
        )}
      </div>

      {/* Logo detaches to fixed using the snapshotted rect, then animates to corner */}
      {isTransitioning && logoRect && (
        <div
          className="splash-logo-animate fixed rounded-full bg-linear-to-br from-rose-400 to-pink-600"
          style={{
            top: logoRect.top,
            left: logoRect.left,
            width: logoRect.width,
            height: logoRect.height,
          }}
        />
      )}

      <div className="flex flex-col items-center">
        <h1 className="text-8xl font-semibold tracking-tight">Pocket Spells</h1>
        <h2 className="mt-6 text-2xl font-medium text-stone-500">
          Every spell, right in your pocket
        </h2>
        <p className="mt-2 text-base text-stone-400">A DnD 5e spell tracker</p>
      </div>
    </div>
  );
}
