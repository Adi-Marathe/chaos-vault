import { motion, AnimatePresence } from 'framer-motion';
import './BubbleBoard.css';

/**
 * Bubble Sort board: dark conveyor on orange gradient.
 * The compared pair glows yellow with aqua pointer.
 * The sorted tail turns lime. Swaps animate via framer-motion layoutId.
 */
export default function BubbleBoard({ state, onAction, shake }) {
  const { a, j, pass, done } = state;
  const n = a.length;

  // Sorted tail: elements from n - pass onward are sorted
  const sortedFrom = n - pass;

  return (
    <div className={`bubbleboard ${shake ? 'bubbleboard--shake' : ''}`}>
      {/* Header */}
      <div className="bubbleboard__header">
        <span className="bubbleboard__status mono">● Conveyor Bay {pass + 1} · Steam Pressure: Optimal</span>
      </div>

      {/* Pass / scan indicators */}
      <div className="bubbleboard__indicators">
        <span className="bubbleboard__pill mono">Pass {pass + 1} of {n - 1}</span>
        {!done && (
          <span className="bubbleboard__pill bubbleboard__pill--active mono">
            Current Scan: Index [{j} ⇔ {j + 1}]
          </span>
        )}
      </div>

      {/* Comparison hint */}
      {!done && (
        <div className="bubbleboard__compare">
          <span className="mono bubbleboard__compare-label">⚡ Comparing: {a[j]}</span>
          <span className="mono bubbleboard__compare-vs">vs {a[j + 1]}</span>
          <span className={`mono bubbleboard__compare-result ${a[j] > a[j + 1] ? 'bubbleboard__compare-result--swap' : ''}`}>
            {a[j]} {a[j] > a[j + 1] ? '>' : '≤'} {a[j + 1]} · {a[j] > a[j + 1] ? 'Swap Required' : 'In Order'}
          </span>
        </div>
      )}

      {/* Conveyor belt */}
      <div className="bubbleboard__conveyor">
        <div className="bubbleboard__belt-header">
          <span className="mono bubbleboard__belt-label">● ● ●   Pneumatic Guide Track V2.4</span>
          <span className="mono bubbleboard__belt-speed">⚙ Motor Speed: 1.0x</span>
        </div>

        <div className="bubbleboard__tiles">
          <AnimatePresence mode="popLayout">
            {a.map((value, idx) => {
              const isActive = !done && (idx === j || idx === j + 1);
              const isLeft = !done && idx === j;
              const isRight = !done && idx === j + 1;
              const isSorted = idx >= sortedFrom;
              const isLocked = isSorted && !done;

              return (
                <motion.div
                  key={value}
                  layout
                  layoutId={`tile-${value}`}
                  className={[
                    'bubbleboard__tile',
                    isActive ? 'bubbleboard__tile--active' : '',
                    isSorted ? 'bubbleboard__tile--sorted' : '',
                    isLocked ? 'bubbleboard__tile--locked' : '',
                    done ? 'bubbleboard__tile--done' : '',
                  ].filter(Boolean).join(' ')}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <span className="bubbleboard__tile-idx mono">#{idx}</span>
                  <span className="bubbleboard__tile-val">{value}</span>
                  {isLeft && <span className="bubbleboard__tile-role mono">L-Key</span>}
                  {isRight && <span className="bubbleboard__tile-role mono">R-Key</span>}
                  <span className="bubbleboard__tile-slot mono">
                    {isActive ? 'Active' : isSorted ? 'Locked' : `Slot ${idx}`}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Belt track */}
        <div className="bubbleboard__track">
          <div className="bubbleboard__track-bar" />
          {a.map((_, idx) => (
            <div
              key={idx}
              className={`bubbleboard__track-dot ${idx >= sortedFrom ? 'bubbleboard__track-dot--sorted' : ''}`}
            />
          ))}
        </div>

        {/* Sorted tail label */}
        {pass > 0 && !done && (
          <div className="bubbleboard__sorted-label mono">
            ✓ Slots {sortedFrom}–{n - 1} Stable Invariant
          </div>
        )}
      </div>
    </div>
  );
}
