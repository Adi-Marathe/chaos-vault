import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, RotateCcw } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { getLevelsForZone } from '../../data/levels';
import LevelNode from '../LevelNode/LevelNode';
import Tag from '../Tag/Tag';
import Button from '../Button/Button';
import './ZoneCard.css';

/* ── Small SVG illustrations per zone ── */
function BootCampIllustration() {
  return (
    <div className="zonecard__illus">
      <svg width="160" height="70" viewBox="0 0 160 70" fill="none">
        {/* Three tutorial crates */}
        <rect x="15" y="25" width="34" height="34" rx="6" stroke="currentColor" strokeWidth="2.5" fill="rgba(255,255,255,0.15)" />
        <rect x="63" y="25" width="34" height="34" rx="6" stroke="currentColor" strokeWidth="2.5" fill="rgba(255,255,255,0.15)" />
        <rect x="111" y="25" width="34" height="34" rx="6" stroke="currentColor" strokeWidth="2.5" fill="rgba(255,255,255,0.15)" />
        {/* Lantern glow above middle crate */}
        <circle cx="80" cy="18" r="7" fill="rgba(255,216,74,0.5)" />
        <circle cx="80" cy="18" r="3" fill="rgba(255,216,74,0.9)" />
      </svg>
    </div>
  );
}

function SeekerWoodsIllustration() {
  return (
    <div className="zonecard__illus">
      <svg width="160" height="70" viewBox="0 0 160 70" fill="none">
        {/* Radar / target icon */}
        <circle cx="80" cy="35" r="28" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.12)" />
        <circle cx="80" cy="35" r="16" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.08)" />
        <circle cx="80" cy="35" r="5" fill="var(--lime)" />
        {/* Radar ping */}
        <circle cx="80" cy="14" r="3" fill="var(--yellow)" />
      </svg>
    </div>
  );
}

function SortingFoundryIllustration() {
  const nums = [6, 3, 8, 1];
  return (
    <div className="zonecard__illus zonecard__illus--tiles">
      {nums.map((n, i) => (
        <motion.div
          key={n}
          className="zonecard__tile"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.15, ease: 'easeInOut' }}
        >
          {n}
        </motion.div>
      ))}
    </div>
  );
}

function DividePeaksIllustration() {
  return (
    <div className="zonecard__illus">
      <svg width="160" height="70" viewBox="0 0 160 70" fill="none">
        {/* Merge split: bracket arrays */}
        <text x="28" y="28" fill="var(--cream)" fontFamily="var(--font-mono)" fontSize="11">[12][4][9][2]</text>
        <text x="35" y="52" fill="var(--cream)" fontFamily="var(--font-mono)" fontSize="11">[4][12]  [2][9]</text>
      </svg>
    </div>
  );
}

function DigitDocksIllustration() {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="zonecard__illus zonecard__illus--docks">
      <div className="zonecard__dock-row">
        {nums.slice(0, 5).map((n) => (
          <span key={n} className="zonecard__dock-cell">{n}</span>
        ))}
      </div>
      <div className="zonecard__dock-row">
        {nums.slice(5).map((n) => (
          <span key={n} className="zonecard__dock-cell">{n}</span>
        ))}
      </div>
    </div>
  );
}

function ChaosCoreIllustration() {
  return (
    <div className="zonecard__illus">
      <svg width="160" height="70" viewBox="0 0 160 70" fill="none">
        <circle cx="80" cy="35" r="22" stroke="var(--violet)" strokeWidth="2.5" fill="rgba(109,90,245,0.15)" />
        <circle cx="80" cy="35" r="10" stroke="var(--violet)" strokeWidth="2" fill="rgba(109,90,245,0.25)" />
        <circle cx="80" cy="35" r="3" fill="var(--violet)" />
      </svg>
    </div>
  );
}

const illustrations = {
  'boot-camp': BootCampIllustration,
  'seeker-woods': SeekerWoodsIllustration,
  'sorting-foundry': SortingFoundryIllustration,
  'divide-peaks': DividePeaksIllustration,
  'digit-docks': DigitDocksIllustration,
  'chaos-core': ChaosCoreIllustration,
};

/* ── Zone status derivation ── */
function useZoneStatus(zone, zoneLevels, isUnlocked, getStats) {
  return useMemo(() => {
    if (zone.status === 'soon') return 'soon';
    if (zoneLevels.length === 0) return 'soon';

    const firstLevel = zoneLevels[0];
    const isFirstUnlocked = isUnlocked(firstLevel.id);
    if (!isFirstUnlocked) return 'locked';

    const allCleared = zoneLevels.every((l) => getStats(l.id)?.cleared);
    if (allCleared) return 'cleared';

    const anyCleared = zoneLevels.some((l) => getStats(l.id)?.cleared);
    if (anyCleared) return 'in-progress';

    return 'open';
  }, [zone, zoneLevels, isUnlocked, getStats]);
}

/* ── Status pill variant mapping ── */
function statusPill(status) {
  switch (status) {
    case 'cleared':
      return { label: 'Cleared', variant: 'lime' };
    case 'in-progress':
      return { label: 'Current Focus', variant: 'yellow' };
    case 'open':
      return { label: 'Ready to Unlock', variant: 'default' };
    case 'locked':
      return { label: 'Locked', variant: 'slate' };
    case 'soon':
    default:
      return { label: 'Soon', variant: 'slate' };
  }
}

/* ── Connector line between nodes ── */
function NodeConnector({ cleared }) {
  return (
    <div className={`zonecard__connector ${cleared ? 'zonecard__connector--cleared' : ''}`} />
  );
}

/* ── Main ZoneCard ── */
export default function ZoneCard({ zone, index }) {
  const { isUnlocked, getStats } = useProgress();
  const zoneLevels = useMemo(() => getLevelsForZone(zone.id), [zone.id]);
  const status = useZoneStatus(zone, zoneLevels, isUnlocked, getStats);

  const pill = statusPill(status);
  const Illustration = illustrations[zone.id];

  /* Find current (first uncleared unlocked) level and next level to play */
  const currentLevel = useMemo(() => {
    return zoneLevels.find((l) => isUnlocked(l.id) && !getStats(l.id)?.cleared) || null;
  }, [zoneLevels, isUnlocked, getStats]);

  const nextPlayable = useMemo(() => {
    if (status === 'cleared') return zoneLevels[0]; // replay first
    return currentLevel || zoneLevels[0];
  }, [status, currentLevel, zoneLevels]);

  /* Button label & link */
  let btnLabel, btnIcon, btnTo;
  if (status === 'soon') {
    btnLabel = 'Coming Soon';
    btnIcon = <Lock size={14} />;
    btnTo = null;
  } else if (status === 'locked') {
    btnLabel = 'Locked';
    btnIcon = <Lock size={14} />;
    btnTo = null;
  } else if (status === 'cleared') {
    btnLabel = 'Replay zone';
    btnIcon = <RotateCcw size={14} />;
    btnTo = `/play/${nextPlayable.id}`;
  } else if (status === 'in-progress') {
    btnLabel = `Continue stage ${currentLevel?.code || ''}`;
    btnIcon = <ArrowRight size={14} />;
    btnTo = `/play/${nextPlayable.id}`;
  } else {
    btnLabel = 'Enter zone';
    btnIcon = <ArrowRight size={14} />;
    btnTo = `/play/${nextPlayable.id}`;
  }

  const panelBg = zone.gradient || zone.color;
  const isDark = !!zone.darkText;
  const isDisabled = status === 'soon' || status === 'locked';

  /* Panel status label (bottom of the illustration) */
  const panelLabel = useMemo(() => {
    switch (zone.id) {
      case 'boot-camp': {
        const ct = zoneLevels.filter((l) => getStats(l.id)?.cleared).length;
        return `${ct} / ${zoneLevels.length} stages aced`;
      }
      case 'seeker-woods': return '● Active Radar Expedition';
      case 'sorting-foundry': return 'Piston Packets Ready';
      case 'divide-peaks': return `Gate Elevation 2,400m`;
      case 'digit-docks': return 'Harbor Gantries Secured';
      case 'chaos-core': return 'Core Critical State';
      default: return '';
    }
  }, [zone.id, zoneLevels, getStats]);

  return (
    <motion.div
      className="zonecard"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={!isDisabled ? { y: -4 } : undefined}
    >
      {/* Panel illustration */}
      <div
        className={`zonecard__panel ${isDark ? 'zonecard__panel--dark' : ''}`}
        style={{ background: panelBg }}
      >
        {Illustration && <Illustration />}
        <span className="zonecard__panel-label mono">{panelLabel}</span>
      </div>

      {/* Info section */}
      <div className="zonecard__info">
        <div className="zonecard__header">
          <span className="zonecard__zone-label mono">Zone {zone.zone + 1}</span>
          <Tag variant={pill.variant}>{pill.label}</Tag>
        </div>

        <h3 className="zonecard__name">{zone.name}</h3>

        <p className="zonecard__algo">
          <span className="mono" style={{ fontSize: '0.7rem' }}>{'>_'}  {zone.algorithms}</span>
          {' '}
          <Tag variant="default">{zone.difficulty}</Tag>
        </p>

        <p className="zonecard__desc">{zone.description}</p>

        {/* Level nodes */}
        {zoneLevels.length > 0 && (
          <div className="zonecard__nodes">
            {zoneLevels.map((level, i) => {
              const stats = getStats(level.id);
              const unlocked = isUnlocked(level.id);
              const isCurrent = !!(unlocked && !stats?.cleared && (!currentLevel || currentLevel.id === level.id) && status !== 'cleared');
              return (
                <div key={level.id} className="zonecard__node-group">
                  {i > 0 && <NodeConnector cleared={!!getStats(zoneLevels[i - 1].id)?.cleared} />}
                  <LevelNode
                    level={level}
                    stats={stats}
                    unlocked={unlocked}
                    isCurrent={isCurrent && currentLevel?.id === level.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="zonecard__action">
        <Button
          to={btnTo}
          variant="zone"
          zoneColor={zone.color}
          disabled={isDisabled}
          className="zonecard__btn"
        >
          {btnLabel} {btnIcon}
        </Button>
      </div>
    </motion.div>
  );
}
