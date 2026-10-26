import Link from "next/link";
import type { ReactNode } from "react";
import { TeX } from "./TeX";

/**
 * Renders the small inline markup allowed in content strings:
 *   **bold**   `code`   [label](url)   $math$
 * Everything else is plain text, so content can never inject HTML.
 */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\$[^$]+\$)/g;

export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  const out: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**")) {
      out.push(<strong key={i}>{part.slice(2, -2)}</strong>);
    } else if (part.startsWith("`") && part.endsWith("`")) {
      out.push(
        <code key={i} className="inline-code">
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      out.push(<TeX key={i} tex={part.slice(1, -1)} />);
    } else if (part.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
      if (m) {
        out.push(<SmartLink key={i} href={m[2]}>{m[1]}</SmartLink>);
      } else {
        out.push(part);
      }
    } else {
      out.push(part);
    }
  });
  return <>{out}</>;
}

/** Internal links use client navigation; external ones open safely in a new tab. */
export function SmartLink({ href, children, className = "link" }: { href: string; children: ReactNode; className?: string }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
