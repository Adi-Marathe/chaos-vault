import { Link } from 'react-router-dom';
import { Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Stars from '../Stars/Stars';
import './LevelNode.css';

/**
 * A single level node on the world map.
 * States: cleared (lime check + stars), current (pulsing yellow), locked (grey padlock).
 */
export default function LevelNode({ level, stats, unlocked, isCurrent }) {
  const cleared = !!stats?.cleared;
  const bestStars = stats?.bestStars || 0;

  const stateClass = cleared
    ? 'levelnode--cleared'
    : isCurrent
      ? 'levelnode--current'
      : unlocked
        ? 'levelnode--open'
        : 'levelnode--locked';

  const inner = (
    <>
      <div className={`levelnode__circle ${stateClass}`}>
        {cleared ? (
          <Check size={16} strokeWidth={3} />
        ) : !unlocked ? (
          <Lock size={14} />
        ) : (
          <span className="levelnode__code mono">{level.code}</span>
        )}
      </div>
      {cleared && <Stars count={bestStars} total={3} size="sm" className="levelnode__stars" />}
      <span className="levelnode__label mono">{level.code}</span>
      {isCurrent && <span className="levelnode__status mono">Active</span>}
    </>
  );

  const tooltip = `${level.name} — ${level.algorithm}`;

  if (unlocked || cleared) {
    return (
      <motion.div className="levelnode" whileHover={{ scale: 1.08 }}>
        <Link
          to={`/play/${level.id}`}
          className="levelnode__link"
          title={tooltip}
          aria-label={`Play ${level.name}`}
        >
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="levelnode" title={tooltip}>
      <div className="levelnode__link levelnode__link--disabled">
        {inner}
      </div>
    </div>
  );
}
