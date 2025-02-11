import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { useEffect, useRef } from 'react';
import { AuroraText } from './aurora-text';

interface LatexAuroraProps {
  formula: string;
  className?: string;
}

export function LatexAurora({ formula, className }: LatexAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <AuroraText className={className}>
      <div ref={containerRef} />
    </AuroraText>
  );
}
