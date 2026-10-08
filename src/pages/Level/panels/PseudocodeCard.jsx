import './PseudocodeCard.css';

/**
 * Pseudocode display with the current line highlighted.
 */
export default function PseudocodeCard({ pseudocode, activeLine = -1, engineName }) {
  return (
    <div className="pseudocode">
      <div className="pseudocode__header">
        <span className="mono pseudocode__title">⚙ Engine: {engineName}</span>
        <span className="pseudocode__status">●</span>
      </div>
      <div className="pseudocode__body">
        {pseudocode.map((line, i) => (
          <div
            key={i}
            className={`pseudocode__line ${i === activeLine ? 'pseudocode__line--active' : ''}`}
          >
            <span className="pseudocode__line-num mono">{i + 1}:</span>
            <span className="pseudocode__line-text">{i === activeLine ? '→ ' : '  '}{line}</span>
          </div>
        ))}
      </div>
      <div className="pseudocode__footer mono">
        <span>Active Pointer: j = {activeLine >= 0 ? activeLine : '—'}</span>
      </div>
    </div>
  );
}
