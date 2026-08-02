// The DoubleCheck app's own logo mark — two overlapping checkmarks.
export function DoubleCheckMark({
  className,
  size = 24,
  style,
}: {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={(size * 224) / 291}
      viewBox="0 0 291 224"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <path
        d="M179.054 7.55721C183.617 0.027452 193.229 -2.25846 200.53 2.44818C207.829 7.1557 210.046 17.0706 205.483 24.6013L84.6851 224L4.56603 141.355C-1.52201 135.075 -1.52201 124.896 4.56603 118.616C10.6541 112.336 20.5224 112.336 26.6104 118.616L79.0014 172.658L179.054 7.55721Z"
        fill="currentColor"
      />
      <path
        d="M262.218 7.51576C266.801 0.00173092 276.427 -2.25544 283.714 2.46955C290.998 7.1975 293.187 17.1265 288.606 24.6436L174.284 212.254C169.7 219.768 160.075 222.025 152.787 217.3C145.503 212.572 143.315 202.643 147.895 195.126L262.218 7.51576Z"
        fill="currentColor"
      />
    </svg>
  );
}
