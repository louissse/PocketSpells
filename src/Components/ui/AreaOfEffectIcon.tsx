interface AreaOfEffectIconProps {
  areaType: string;
  className?: string;
}

export default function AreaOfEffectIcon({
  areaType,
  className = "h-3 w-3 text-slate-700",
}: AreaOfEffectIconProps) {
  switch (areaType.toLowerCase()) {
    case "sphere":
      return (
        <svg
          className={className}
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke=""
            strokeWidth="4"
            fill="none"
          />
        </svg>
      );
    case "cube":
      return (
        <svg
          className={className}
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      );
    case "cone":
      return (
        <svg
          className={className}
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2 L22 22 L2 22 Z" strokeWidth="4" fill="none" />
        </svg>
      );
    case "line":
      return (
        <svg
          className={className}
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <line x1="2" y1="12" x2="22" y2="12" strokeWidth="4" />
        </svg>
      );
    case "cylinder":
      return (
        <svg
          className={className}
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <ellipse cx="12" cy="7" rx="10" ry="3" strokeWidth="4" fill="none" />
          <path
            d="M2 7v10c0 1.66 4.48 3 10 3s10-1.34 10-3V7"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      );
  }
}
