import { motion } from 'framer-motion';
import './SelectionBoard.css';

/**
 * Selection Sort board: conveyor layout with crane arm above unsorted zone.
 * Click a tile to pick it. Sorted zone is lime and not clickable.
 */
export default function SelectionBoard({ state, onAction, shake }) {
  const { a, i, done } = state;
  const n = a.length;

  const handlePick = (idx) => {
    if (done || idx < i) return;
    onAction({ type: 'pick', index: idx });
  };

  // Find minimum in unsorted zone for highlighting
  let minIdx = i;
  for (let j = i + 1; j < n; j++) {
    if (a[j] < a[minIdx]) minIdx = j;
  }

  return (
    <div className={`selboard ${shake ? 'selboard--shake' : ''}`}>
      <div className="selboard__header">
        <span className="selboard__status mono">● Crane Bay · Selection Mode</span>
        <span className="selboard__pass mono">Sorted: {i} / {n}</span>
      </div>

      <div className="selboard__indicators">
        <span className="selboard__pill mono">Round {i + 1} of {n - 1}</span>
        {!done && (
          <span className="selboard__pill selboard__pill--active mono">
            Find minimum in [{i}..{n - 1}]
          </span>
        )}
      </div>

      <div className="selboard__conveyor">
        <div className="selboard__belt-header">
          <span className="mono selboard__belt-label">● ● ● Crane Selection Track</span>
        </div>

        {/* Crane arm */}
        {!done && (
          <div className="selboard__crane">
            <div className="selboard__crane-arm" />
            <span className="selboard__crane-label mono">
              ↓ Pick the smallest tile
            </span>
          </div>
        )}

        {/* Bracket for unsorted zone */}
        <div className="selboard__zones">
          {i > 0 && (
            <div className="selboard__zone-label selboard__zone-label--sorted mono">
              Sorted [{0}..{i - 1}]
            </div>
          )}
          {!done && (
            <div className="selboard__zone-label selboard__zone-label--unsorted mono">
              Unsorted [{i}..{n - 1}]
            </div>
          )}
        </div>

        <div className="selboard__tiles">
          {a.map((value, idx) => {
            const isSorted = idx < i;
            const isUnsorted = idx >= i;
            const isClickable = isUnsorted && !done;

            return (
              <motion.button
                key={value}
                className={[
                  'selboard__tile',
                  isSorted ? 'selboard__tile--sorted' : '',
                  done ? 'selboard__tile--done' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handlePick(idx)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.08, y: -4 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
                layout
                layoutId={`sel-tile-${value}`}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <span className="selboard__tile-idx mono">#{idx}</span>
                <span className="selboard__tile-val">{value}</span>
                <span className="selboard__tile-slot mono">
                  {isSorted ? 'Sorted' : done ? 'Sorted' : `Slot ${idx}`}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
