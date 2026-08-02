// An original, generic apple-fruit silhouette (not traced from any company's
// logo file) used as a placeholder for "this is the menu bar corner" in the
// simulated macOS chrome.
export function AppleGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.2 8.3c-1.5-.1-2.7.8-3.5.8-.8 0-2-.8-3.3-.8-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.9 1.2 1.9 2.6 3.3 2.5 1.3 0 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.1-2.5.7-1 1.1-2 1.4-3.1-3.5-1.3-4-6.1-.2-8-1.1-1.4-2.6-1.4-4.8-1.5z" />
      <path d="M13.7 4.7c.7-.9 1.2-2.1.9-3.4-1.2.1-2.6.9-3.4 1.8-.7.8-1.2 2-1 3.2 1.2.1 2.6-.7 3.5-1.6z" />
    </svg>
  );
}
