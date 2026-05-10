import type { EasingType } from './types';

/**
 * SVG keyframe icon that visually communicates the easing type.
 *
 * Shapes follow the After Effects convention:
 *   ● Circle      — Auto / Easy Ease (smooth)
 *   ◇ Diamond     — Linear (constant rate)
 *   ◻ Square      — Hold (step function)
 *   ◇ w/ dots     — Custom (manual handles)
 *   ●◇ Half       — Ease In / Ease Out (asymmetric)
 */
export function KeyframeIcon({
  type,
  size = 10,
  fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = 1.5,
  selected = false,
  onPlayhead = false,
  className = '',
}: {
  type: EasingType;
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selected?: boolean;
  onPlayhead?: boolean;
  className?: string;
}) {
  const half = size / 2;

  // Selection/playhead overrides
  const effectiveFill = selected ? fill : onPlayhead ? '#3b82f6' : fill;
  const effectiveStroke = selected ? stroke : onPlayhead ? '#3b82f6' : stroke;
  const sw = selected || onPlayhead ? 2 : strokeWidth;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {/* Selection ring */}
      {selected && (
        <circle
          cx={half}
          cy={half}
          r={half + 3}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2}
        />
      )}

      {type === 'auto' || type === 'easyEase' ? (
        /* ● Circle — Auto / Easy Ease */
        <circle
          cx={half}
          cy={half}
          r={half * 0.8}
          fill={effectiveFill}
          stroke={effectiveStroke}
          strokeWidth={sw}
        />
      ) : type === 'linear' ? (
        /* ◇ Diamond — Linear */
        <polygon
          points={`${half},${half * 0.15} ${size * 0.85},${half} ${half},${size * 0.85} ${size * 0.15},${half}`}
          fill={effectiveFill}
          stroke={effectiveStroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      ) : type === 'hold' ? (
        /* ◻ Square — Hold */
        <rect
          x={size * 0.2}
          y={size * 0.2}
          width={size * 0.6}
          height={size * 0.6}
          fill={effectiveFill}
          stroke={effectiveStroke}
          strokeWidth={sw}
          rx={1}
        />
      ) : type === 'easeIn' ? (
        /* ●◇ Circle left, diamond right — Ease In */
        <g>
          {/* Left half: circle */}
          <path
            d={`M ${half} ${size * 0.15} A ${half * 0.85} ${half * 0.85} 0 0 0 ${half} ${size * 0.85}`}
            fill={effectiveFill}
            stroke={effectiveStroke}
            strokeWidth={sw}
          />
          {/* Right half: diamond point */}
          <path
            d={`M ${half} ${size * 0.15} L ${size * 0.85} ${half} L ${half} ${size * 0.85}`}
            fill={effectiveFill}
            stroke={effectiveStroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      ) : type === 'easeOut' ? (
        /* ◇● Diamond left, circle right — Ease Out */
        <g>
          {/* Left half: diamond point */}
          <path
            d={`M ${half} ${size * 0.15} L ${size * 0.15} ${half} L ${half} ${size * 0.85}`}
            fill={effectiveFill}
            stroke={effectiveStroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* Right half: circle */}
          <path
            d={`M ${half} ${size * 0.15} A ${half * 0.85} ${half * 0.85} 0 0 1 ${half} ${size * 0.85}`}
            fill={effectiveFill}
            stroke={effectiveStroke}
            strokeWidth={sw}
          />
        </g>
      ) : (
        /* ◇ Diamond with handle dots — Custom */
        <g>
          <polygon
            points={`${half},${half * 0.15} ${size * 0.85},${half} ${half},${size * 0.85} ${size * 0.15},${half}`}
            fill={effectiveFill}
            stroke={effectiveStroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* Small handle indicator dots */}
          <circle cx={size * 0.15} cy={half} r={1.5} fill={effectiveStroke} />
          <circle cx={size * 0.85} cy={half} r={1.5} fill={effectiveStroke} />
        </g>
      )}
    </svg>
  );
}
