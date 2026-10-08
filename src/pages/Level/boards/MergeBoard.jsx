import { motion } from 'framer-motion';
import './MergeBoard.css';

/**
 * Merge Sort board: runs strip on top, two lanes with front pointers,
 * output lane filling with lime tiles.
 */
export default function MergeBoard({ state, onAction, shake }) {
  const { phase, runs, left, right, out, round, done, original, splitCount } = state;

  return (
    <div className={`mergeboard ${shake ? 'mergeboard--shake' : ''}`}>
      <div className="mergeboard__header">
        <span className="mergeboard__status mono">⚡ Divide & Conquer Recursion Tree</span>
        {phase === 'split' && (
          <span className="mergeboard__phase-pill mono">Split {splitCount} / 3</span>
        )}
        {phase === 'merge' && (
          <span className="mergeboard__phase-pill mergeboard__phase-pill--merge mono">
            Merge Round {round}
          </span>
        )}
      </div>

      {/* Runs strip */}
      <div className="mergeboard__runs-strip">
        {runs.map((run, ri) => (
          <div key={ri} className="mergeboard__run">
            {run.map((val) => (
              <motion.span
                key={val}
                className="mergeboard__run-tile mono"
                layout
                layoutId={`merge-${val}`}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                {val}
              </motion.span>
            ))}
          </div>
        ))}
      </div>

      {/* Merge area (only during merge phase) */}
      {phase === 'merge' && !done && (
        <div className="mergeboard__merge-area">
          {/* Left lane */}
          <div className="mergeboard__lane">
            <div className="mergeboard__lane-header">
              <span className="mono">● Lane A (Sorted)</span>
              <span className="mergeboard__lane-dir mono">Ascending</span>
            </div>
            <div className="mergeboard__lane-tiles">
              {left.map((val, i) => (
                <motion.div
                  key={val}
                  className={`mergeboard__lane-tile ${i === 0 ? 'mergeboard__lane-tile--head' : ''}`}
                  layout
                >
                  {i === 0 && <span className="mergeboard__head-label mono">↓ Head A</span>}
                  <span className="mergeboard__tile-val">{val}</span>
                </motion.div>
              ))}
              {left.length === 0 && <span className="mono mergeboard__empty">Empty</span>}
            </div>
          </div>

          {/* Right lane */}
          <div className="mergeboard__lane">
            <div className="mergeboard__lane-header">
              <span className="mono">● Lane B (Sorted)</span>
              <span className="mergeboard__lane-dir mono">Ascending</span>
            </div>
            <div className="mergeboard__lane-tiles">
              {right.map((val, i) => (
                <motion.div
                  key={val}
                  className={`mergeboard__lane-tile ${i === 0 ? 'mergeboard__lane-tile--head-b' : ''}`}
                  layout
                >
                  {i === 0 && <span className="mergeboard__head-label mono">↓ Head B</span>}
                  <span className="mergeboard__tile-val">{val}</span>
                </motion.div>
              ))}
              {right.length === 0 && <span className="mono mergeboard__empty">Empty</span>}
            </div>
          </div>
        </div>
      )}

      {/* Zipper junction */}
      {phase === 'merge' && !done && (
        <div className="mergeboard__junction mono">⚡ Zipper Interleave Junction ↓</div>
      )}

      {/* Output lane */}
      {phase === 'merge' && out.length > 0 && (
        <div className="mergeboard__output">
          <div className="mergeboard__output-header">
            <span className="mono">✓ Merged Output Stream</span>
            <span className="mono mergeboard__output-info">Monotonic Non-Decreasing</span>
          </div>
          <div className="mergeboard__output-tiles">
            {out.map((val, i) => (
              <motion.div
                key={val}
                className="mergeboard__output-tile"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                layout
              >
                <span className="mergeboard__tile-val">{val}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done && (
        <div className="mergeboard__done mono">✓ All runs merged — array is sorted!</div>
      )}
    </div>
  );
}
