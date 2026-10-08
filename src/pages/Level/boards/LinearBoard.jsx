import { motion } from 'framer-motion';
import './LinearBoard.css';

/**
 * Linear Search board: row of sealed crates with a lantern marker.
 * Opened crates show their value, found crate glows lime.
 */
export default function LinearBoard({ state, onAction, shake }) {
  const { crates, target, i, opened, done } = state;

  return (
    <div className={`linearboard ${shake ? 'linearboard--shake' : ''}`}>
      <div className="linearboard__header">
        <span className="linearboard__status mono">
          ● Warehouse Scanner · Target: <strong>{target}</strong>
        </span>
        <span className="linearboard__scan mono">
          Lantern at crate {i}
        </span>
      </div>

      <div className="linearboard__conveyor">
        <div className="linearboard__crates">
          {crates.map((value, idx) => {
            const isOpen = opened[idx];
            const isCurrent = idx === i;
            const isFound = isOpen && value === target;

            return (
              <motion.div
                key={value}
                className={[
                  'linearboard__crate',
                  isOpen ? 'linearboard__crate--open' : '',
                  isCurrent ? 'linearboard__crate--current' : '',
                  isFound ? 'linearboard__crate--found' : '',
                  idx < i && isOpen ? 'linearboard__crate--past' : '',
                ].filter(Boolean).join(' ')}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                {/* Lantern */}
                {isCurrent && !done && (
                  <motion.div
                    className="linearboard__lantern"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    🔦
                  </motion.div>
                )}

                <span className="linearboard__crate-idx mono">#{idx}</span>

                <div className="linearboard__crate-face">
                  {isOpen ? (
                    <span className="linearboard__crate-val">{value}</span>
                  ) : (
                    <span className="linearboard__crate-sealed">?</span>
                  )}
                </div>

                <span className="linearboard__crate-slot mono">
                  {isFound ? 'Found!' : isOpen ? 'Checked' : 'Sealed'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
