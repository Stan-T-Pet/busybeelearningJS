import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";

export default function RenderMath({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !children) return null;

  const isWrapped =
    typeof children === "string" &&
    (children.trim().startsWith("\\(") || children.trim().startsWith("\\["));

  const content =
    typeof children === "string" && !isWrapped
      ? `\\( ${children.trim()} \\)`
      : children;

  return <MathJax inline dynamic>{content}</MathJax>;
}
