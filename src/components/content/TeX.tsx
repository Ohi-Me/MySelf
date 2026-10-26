import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Server-rendered math. KaTeX runs at build time and ships HTML plus MathML
 * (read by screen readers); no JavaScript reaches the browser.
 */
export function TeX({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    strict: "ignore",
    output: "htmlAndMathml",
  });
  if (display) return <div className="py-1" dangerouslySetInnerHTML={{ __html: html }} />;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
