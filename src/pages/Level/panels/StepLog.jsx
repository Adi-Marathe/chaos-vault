import './StepLog.css';

/**
 * Step log showing recent actions, newest first. Shows last 6 entries.
 */
export default function StepLog({ log }) {
  const visible = log.slice(0, 6);

  return (
    <div className="steplog">
      <div className="steplog__header">
        <span className="mono steplog__title">📋 Conveyor Step Log</span>
        <span className="mono steplog__live">{'>_'}  Live</span>
      </div>
      <div className="steplog__body">
        {visible.length === 0 && (
          <p className="steplog__empty mono">Waiting for first action…</p>
        )}
        {visible.map((entry, i) => (
          <div
            key={entry.step}
            className={`steplog__entry ${i === 0 ? 'steplog__entry--latest' : ''}`}
          >
            <span className="steplog__prompt mono">{'>_'}</span>
            <span className="steplog__text mono">
              [Step {entry.step}] {entry.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
