import './ProgressBar.css';

/**
 * Horizontal progress bar.
 * value: 0–100
 */
export default function ProgressBar({ value = 0, label, color = 'var(--lime)', className = '' }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`progressbar ${className}`}>
      {label && <span className="progressbar__label mono">{label}</span>}
      <div className="progressbar__track">
        <div
          className="progressbar__fill"
          style={{ width: `${clamped}%`, background: color }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
