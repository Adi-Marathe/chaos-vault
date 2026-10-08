import { motion } from 'framer-motion';
import './BinaryBoard.css';

/**
 * Binary Search board: navy panel with aqua dome,
 * tile numbers, LOW/HIGH chips, eliminated tiles greyed with strike,
 * speech bubble after each probe. Click a tile to probe.
 */
export default function BinaryBoard({ state, onAction, shake }) {
  const { a, target, lo, hi, probed, done } = state;
  const mid = Math.floor((lo + hi) / 2);

  const handleProbe = (idx) => {
    if (done) return;
    onAction({ type: 'probe', index: idx });
  };

  // Find the last probed info for speech bubble
  const lastProbedIdx = probed.findLastIndex((p) => p);

  return (
    <div className={`binaryboard ${shake ? 'binaryboard--shake' : ''}`}>
      {/* Header */}
      <div className="binaryboard__header">
        <span className="binaryboard__status mono">
          ● Chamber · Kinetic Partition
        </span>
        <span className="binaryboard__target mono">
          Secret Target: <strong>{target}</strong>
        </span>
      </div>

      {/* Range indicator */}
      <div className="binaryboard__range mono">
        Sector Scanner: Active Range [MID = IDX {mid}]
      </div>

      {/* Conveyor */}
      <div className="binaryboard__conveyor">
        {/* Index row */}
        <div className="binaryboard__idx-row">
          {a.map((_, idx) => {
            const isLow = idx === lo;
            const isHigh = idx === hi;
            const isMid = idx === mid && !done;
            const isEliminated = idx < lo || idx > hi;

            return (
              <div
                key={idx}
                className={`binaryboard__idx ${isEliminated ? 'binaryboard__idx--elim' : ''} ${isMid ? 'binaryboard__idx--mid' : ''}`}
              >
                #{idx}
                {isLow && !done && <span className="binaryboard__chip binaryboard__chip--low mono">Low</span>}
                {isHigh && !done && <span className="binaryboard__chip binaryboard__chip--high mono">High</span>}
              </div>
            );
          })}
        </div>

        {/* Tiles */}
        <div className="binaryboard__tiles">
          {a.map((value, idx) => {
            const isEliminated = idx < lo || idx > hi;
            const isMid = idx === mid && !done;
            const isProbed = probed[idx];
            const isTarget = done && value === target;

            return (
              <motion.button
                key={value}
                className={[
                  'binaryboard__tile',
                  isEliminated ? 'binaryboard__tile--eliminated' : '',
                  isMid ? 'binaryboard__tile--mid' : '',
                  isProbed ? 'binaryboard__tile--probed' : '',
                  isTarget ? 'binaryboard__tile--found' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleProbe(idx)}
                disabled={done || isEliminated}
                whileHover={!done && !isEliminated ? { scale: 1.08 } : undefined}
                whileTap={!done && !isEliminated ? { scale: 0.95 } : undefined}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <span className="binaryboard__tile-val">{value}</span>
                {isMid && <span className="binaryboard__tile-label mono">Mid: {value}</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Eliminated / active labels */}
        <div className="binaryboard__labels">
          {lo > 0 && (
            <span className="binaryboard__elim-label mono">
              [ Eliminated Half: ≤ {a[lo - 1]} ]
            </span>
          )}
          <span className="binaryboard__active-label mono" style={{ marginLeft: 'auto' }}>
            [{lo} .. {hi}] Active Sub
          </span>
        </div>
      </div>
    </div>
  );
}
