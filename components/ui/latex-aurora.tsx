import React, { useEffect, useRef } from 'react'; // Add React import
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';

// Custom hook to detect small devices (sm: max-width: 640px)
function useIsSmallDevice(threshold: number = 640) {
  const [isSmall, setIsSmall] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${threshold}px)`);
    setIsSmall(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [threshold]);
  return isSmall;
}

interface LatexAuroraProps {
  formula: string;
  className?: string;
}

export function LatexAurora({ formula, className }: LatexAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSmallDevice = useIsSmallDevice(); // Use the custom hook

  useEffect(() => {
    if (containerRef.current) {
      try {
        KaTeX.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: true,
          trust: true,
          macros: {
            "\\dx": "\\,dx"  // Define dx macro for better integral spacing
          }
        });
      } catch (e) {
        console.error('LaTeX rendering error:', e);
        if (containerRef.current) {
          containerRef.current.textContent = formula;
        }
      }
    }
  }, [formula]);

  return (
    <div className={`relative block w-full ${className}`}>
      <div 
        ref={containerRef} 
        className={`min-w-full ${isSmallDevice ? 'max-w-[100vw] px-2 py-1' : ''} whitespace-nowrap`} 
      />
      {/* Aurora Overlay */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-lighten dark:mix-blend-darken">
        <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]" />
        <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]" />
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]" />
      </span>
    </div>
  );
}
