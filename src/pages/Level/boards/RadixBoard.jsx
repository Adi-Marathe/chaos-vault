import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './RadixBoard.css';

const PASS_LABELS = ['', 'Ones Digit (10⁰)', 'Tens Digit (10¹)', 'Hundreds Digit (10²)'];
const PASS_SHORT = ['', 'ones', 'tens', 'hundreds'];

function getDigit(num, pass) {
  const exp = Math.pow(10, pass - 1);
  return Math.floor(num / exp) % 10;
}

function highlightDigit(num, pass) {
  const s = String(num);
  // pass 1 = last char, pass 2 = second-to-last, pass 3 = first
  const idx = s.length - pass;
  if (idx < 0 || idx >= s.length) return { before: s, digit: '', after: '' };
  return {
    before: s.slice(0, idx),
    digit: s[idx],
    after: s.slice(idx + 1),
  };
}

/**
 * Radix Sort board: conveyor belt with current parcel and digit highlighted,
 * ten bins 0-9, pass label, collect button, locked compare button.
 */
export default function RadixBoard({ state, onAction, shake }) {
  const { queue, bins, pass, phase, done } = state;
  const currentParcel = phase === 'drop' && queue.length > 0 ? queue[0] : null;

  const handleDrop = (bin) => {
    if (phase !== 'drop' || !currentParcel) return;
    onAction({ type: 'drop', bin });
  };

  // Keyboard 0-9 for dropping
  useEffect(() => {
    if (phase !== 'drop' || done) return;
    const handler = (e) => {
      const digit = parseInt(e.key, 10);
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        e.preventDefault();
        handleDrop(digit);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, done, currentParcel]);

  const passLabel = pass <= 3 ? PASS_LABELS[pass] : 'Done';
  const displayPass = Math.min(pass, 3);

  return (
    <div className={`radixboard ${shake ? 'radixboard--shake' : ''}`}>
      {/* Header */}
      <div className="radixboard__header">
        <span className="radixboard__pass-pill mono">
          Pass {displayPass} of 3 · {passLabel}
        </span>
        <span className="radixboard__mode mono">Bucket Mode: Stable FIFO</span>
      </div>

      {/* Parcel conveyor */}
      <div className="radixboard__conveyor">
        <h3 className="radixboard__conveyor-title">⇄ Pneumatic Parcel Conveyor</h3>
        <div className="radixboard__parcels">
          {queue.map((val, idx) => {
            const isActive = idx === 0 && phase === 'drop';
            const parts = isActive ? highlightDigit(val, pass) : null;

            return (
              <motion.div
                key={`${val}-${idx}`}
                className={`radixboard__parcel ${isActive ? 'radixboard__parcel--active' : ''}`}
                layout
              >
                {isActive && <span className="radixboard__parcel-label mono">Active Target</span>}
                <span className="radixboard__parcel-id mono">P#{String(idx + 1).padStart(2, '0')}</span>
                <span className="radixboard__parcel-val">
                  {isActive ? (
                    <>
                      {parts.before}
                      <span className="radixboard__parcel-digit">{parts.digit}</span>
                      {parts.after}
                    </>
                  ) : (
                    val
                  )}
                </span>
              </motion.div>
            );
          })}
          {queue.length === 0 && phase === 'drop' && (
            <span className="mono radixboard__empty">All parcels distributed</span>
          )}
        </div>
      </div>

      {/* Bins */}
      <div className="radixboard__bins-section">
        <h3 className="radixboard__bins-title">🗃 Digital Sorting Bins [0 .. 9]</h3>
        <div className="radixboard__bins">
          {bins.map((bin, i) => {
            const isTarget = currentParcel != null && getDigit(currentParcel, pass) === i;
            return (
              <button
                key={i}
                className={`radixboard__bin ${isTarget ? 'radixboard__bin--target' : ''}`}
                onClick={() => handleDrop(i)}
                disabled={phase !== 'drop' || done}
              >
                <span className="radixboard__bin-num">{i}</span>
                <div className="radixboard__bin-items">
                  {bin.map((val, j) => (
                    <span key={`${val}-${j}`} className="radixboard__bin-item mono">
                      [{val}]
                    </span>
                  ))}
                </div>
                <span className="radixboard__bin-count mono">
                  {bin.length > 0 ? `${bin.length} item${bin.length > 1 ? 's' : ''}` : 'Empty'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="radixboard__actions">
        {phase === 'drop' && currentParcel != null && (
          <span className="radixboard__drop-hint mono">
            ⌨ Press [0-9] to Drop Parcel
          </span>
        )}

        {/* Locked compare button */}
        <button className="radixboard__compare-btn" disabled title="Locked: radix never compares">
          🔒 Compare Items
        </button>
      </div>
    </div>
  );
}
