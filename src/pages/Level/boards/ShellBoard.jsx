import { motion } from 'framer-motion';
import './ShellBoard.css';

const LANE_COLORS = ['var(--yellow)', 'var(--sky)', 'var(--violet)', 'var(--zone-mint)'];
const LANE_NAMES = ['Yel', 'Aqua', 'Lilac', 'Mint'];

/**
 * Shell Sort board: 8 tiles in a row, tiles in the same lane share a colour,
 * active tile lifted, partner outlined, gap stepper.
 */
export default function ShellBoard({ state, onAction, shake }) {
  const { a, gaps, gi, i, p, done } = state;
  const n = a.length;
  const currentGap = gaps[gi] || 1;
  const partnerIdx = p - currentGap;

  return (
    <div className={`shellboard ${shake ? 'shellboard--shake' : ''}`}>
      <div className="shellboard__header">
        {/* Gap stepper */}
        <div className="shellboard__gaps">
          <span className="shellboard__gap-label mono">Stride Pass:</span>
          {gaps.map((g, idx) => (
            <span
              key={g}
              className={`shellboard__gap-chip mono ${
                idx < gi ? 'shellboard__gap-chip--done' : ''
              } ${idx === gi ? 'shellboard__gap-chip--active' : ''} ${
                idx > gi ? 'shellboard__gap-chip--locked' : ''
              }`}
            >
              {idx < gi && '✓ '}Gap: {g}
              {idx === gi && ' [Active]'}
              {idx > gi && ' [Locked]'}
            </span>
          ))}
        </div>

        {/* Sub-lanes legend */}
        {!done && (
          <div className="shellboard__lanes-legend">
            <span className="mono shellboard__lanes-label">Sub-Lanes:</span>
            {Array.from({ length: currentGap }).map((_, li) => (
              <span
                key={li}
                className="shellboard__lane-chip mono"
                style={{ background: LANE_COLORS[li % LANE_COLORS.length] }}
              >
                #{li + 1} {LANE_NAMES[li % LANE_NAMES.length]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stride state */}
      <div className="shellboard__stride mono">
        <span className="shellboard__stride-icon">🚀</span>
        Stride State  <strong>h = {currentGap}</strong>
      </div>

      {/* Tiles */}
      <div className="shellboard__conveyor">
        {/* Index labels */}
        <div className="shellboard__idx-row">
          {a.map((_, idx) => (
            <span
              key={idx}
              className={`shellboard__idx mono ${idx === p ? 'shellboard__idx--active' : ''} ${
                idx === partnerIdx && !done ? 'shellboard__idx--partner' : ''
              }`}
            >
              #{idx}
              {idx === p && !done && ' ▼'}
            </span>
          ))}
        </div>

        {/* Arcs / lane connections */}
        {!done && currentGap > 1 && (
          <div className="shellboard__arcs">
            {a.map((_, idx) => {
              if (idx + currentGap < n) {
                const laneIdx = idx % currentGap;
                return (
                  <div
                    key={idx}
                    className="shellboard__arc"
                    style={{
                      left: `${(idx / n) * 100 + (50 / n)}%`,
                      width: `${(currentGap / n) * 100}%`,
                      borderColor: LANE_COLORS[laneIdx % LANE_COLORS.length],
                    }}
                  />
                );
              }
              return null;
            })}
          </div>
        )}

        <div className="shellboard__tiles">
          {a.map((value, idx) => {
            const laneIdx = idx % currentGap;
            const isActive = idx === p && !done;
            const isPartner = idx === partnerIdx && !done;
            const laneColor = LANE_COLORS[laneIdx % LANE_COLORS.length];

            return (
              <motion.div
                key={value}
                className={[
                  'shellboard__tile',
                  isActive ? 'shellboard__tile--active' : '',
                  isPartner ? 'shellboard__tile--partner' : '',
                  done ? 'shellboard__tile--done' : '',
                ].filter(Boolean).join(' ')}
                style={{ '--lane-color': laneColor }}
                layout
                layoutId={`shell-${value}`}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <span className="shellboard__tile-val">{value}</span>
                {isActive && <span className="shellboard__tile-role mono">Cmp_A</span>}
                {isPartner && <span className="shellboard__tile-role mono">Cmp_B</span>}
              </motion.div>
            );
          })}
        </div>

        {/* Lane labels */}
        <div className="shellboard__lane-labels">
          {a.map((_, idx) => {
            const laneIdx = idx % currentGap;
            return (
              <span
                key={idx}
                className="shellboard__lane-label mono"
                style={{ color: LANE_COLORS[laneIdx % LANE_COLORS.length] }}
              >
                Lane {laneIdx + 1}
              </span>
            );
          })}
        </div>
      </div>

      {/* Comparison hint */}
      {!done && partnerIdx >= 0 && (
        <div className="shellboard__hint mono">
          🔍 Gap = {currentGap}. Comparing index #{p} ({a[p]}) with index #{partnerIdx} ({a[partnerIdx]}).
          {a[partnerIdx] > a[p]
            ? ` Since ${a[partnerIdx]} > ${a[p]}, jump back!`
            : ` Since ${a[partnerIdx]} ≤ ${a[p]}, place it.`}
        </div>
      )}
      {!done && partnerIdx < 0 && (
        <div className="shellboard__hint mono">
          🔍 Position {p} is at the start of its lane — place it.
        </div>
      )}
    </div>
  );
}
