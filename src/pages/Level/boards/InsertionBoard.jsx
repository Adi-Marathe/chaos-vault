import { motion, AnimatePresence } from 'framer-motion';
import './InsertionBoard.css';

/**
 * Insertion Sort board: card table per design/06-play-insertion.png.
 * Face-down pile showing count, sorted hand row,
 * the drawn card lifted in yellow.
 */
export default function InsertionBoard({ state, onAction, shake }) {
  const { a, k, p, done } = state;
  const n = a.length;
  const remaining = n - k;
  const drawnCard = !done ? a[p] : null;

  return (
    <div className={`insboard ${shake ? 'insboard--shake' : ''}`}>
      <div className="insboard__header">
        <span className="insboard__status mono">
          ● Table · Sorted Sub-Array Carpet
        </span>
        <span className="insboard__invariant mono">
          Invariant: Hand[0..{k - 1}] Ordered
        </span>
      </div>

      {/* Drawn card + deck */}
      <div className="insboard__draw-area">
        {/* Drawn card */}
        {!done && (
          <div className="insboard__drawn">
            <span className="insboard__drawn-label mono">Drawn Card: {drawnCard}</span>
            <motion.div
              className="insboard__drawn-card"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <span className="insboard__drawn-key mono">Key</span>
              <span className="insboard__drawn-val">{drawnCard}</span>
            </motion.div>
          </div>
        )}

        {/* Deck */}
        <div className="insboard__deck">
          <div className="insboard__deck-face">
            <span className="insboard__deck-icon">🃏</span>
            <span className="insboard__deck-label mono">Draw</span>
            <span className="insboard__deck-count">{remaining} Left</span>
          </div>
          <span className="insboard__deck-title mono">Vault Deck</span>
        </div>
      </div>

      {/* Hand / conveyor */}
      <div className="insboard__conveyor">
        <div className="insboard__cards">
          <AnimatePresence mode="popLayout">
            {a.slice(0, k).map((value, idx) => {
              const isSorted = idx < p || (done);
              const isDrawn = idx === p && !done;
              const isTarget = !done && p > 0 && idx === p - 1; // left neighbour

              return (
                <motion.div
                  key={value}
                  className={[
                    'insboard__card',
                    isSorted && !isDrawn ? 'insboard__card--sorted' : '',
                    isDrawn ? 'insboard__card--drawn' : '',
                    isTarget ? 'insboard__card--target' : '',
                    done ? 'insboard__card--done' : '',
                  ].filter(Boolean).join(' ')}
                  layout
                  layoutId={`ins-card-${value}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <span className="insboard__card-idx mono">#{idx}</span>
                  <span className="insboard__card-val">{value}</span>
                  <span className="insboard__card-slot mono">
                    {isDrawn ? 'Comparing' : done ? 'Sorted' : `cards[${idx}]`}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Hint about current comparison */}
      {!done && p > 0 && (
        <div className="insboard__compare mono">
          Compare drawn card {a[p]} with left card {a[p - 1]}:
          {a[p - 1] > a[p]
            ? ` ${a[p - 1]} > ${a[p]} → slide left`
            : ` ${a[p - 1]} ≤ ${a[p]} → place here`}
        </div>
      )}
      {!done && p === 0 && (
        <div className="insboard__compare mono">
          Card {a[p]} is at the leftmost position → place here
        </div>
      )}
    </div>
  );
}
