import './ExplainBox.css';

/**
 * Mono-styled explanation box (used for algorithm rules, pseudo-code hints).
 */
export default function ExplainBox({ children, className = '' }) {
  return (
    <div className={`explainbox ${className}`}>
      <span className="explainbox__prompt mono">{'>_'}</span>
      <div className="explainbox__content">{children}</div>
    </div>
  );
}
