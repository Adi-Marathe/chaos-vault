import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, Lock, RotateCcw } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { zones } from '../../data/zones';
import { TOTAL_LEVELS } from '../../data/levels';
import ZoneCard from '../../components/ZoneCard/ZoneCard';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Tag from '../../components/Tag/Tag';
import './WorldMap.css';

export default function WorldMap() {
  const { clearedCount, totalStars, nextLevel, resetProgress } = useProgress();
  const [showConfirm, setShowConfirm] = useState(false);
  const [unlockAll, setUnlockAll] = useState(false);

  const pct = Math.round((clearedCount / TOTAL_LEVELS) * 100);

  /* Dev-only: press U to toggle unlock-all */
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const handler = (e) => {
      if (e.key === 'u' || e.key === 'U') {
        setUnlockAll((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleReset = useCallback(() => {
    resetProgress();
    setShowConfirm(false);
  }, [resetProgress]);

  return (
    <div className="worldmap">
      <div className="worldmap__container">

        {/* ── Navy hero card ── */}
        <motion.section
          className="worldmap__hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="worldmap__hero-left">
            <span className="worldmap__hero-eyebrow mono">● World Map • Sector Navigator</span>
            <h1 className="worldmap__hero-title">Pick your zone</h1>
            <p className="worldmap__hero-sub">
              Each zone houses a family of mechanical algorithms. Master elementary search before breaching complex recursion.
            </p>
          </div>

          {/* Stat card */}
          <div className="worldmap__stat-card">
            <Star size={28} className="worldmap__stat-star" />
            <div className="worldmap__stat-nums">
              <span className="worldmap__stat-big mono">{clearedCount} / {TOTAL_LEVELS}</span>
              <span className="worldmap__stat-label mono">Stages Cleared</span>
            </div>
          </div>
        </motion.section>

        {/* ── Progress strip ── */}
        <motion.div
          className="worldmap__progress-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="worldmap__progress-left">
            <Trophy size={18} className="worldmap__progress-icon" />
            <span className="worldmap__progress-label mono">Overall Campaign Progress</span>
          </div>

          <div className="worldmap__progress-bar">
            <ProgressBar value={pct} color="var(--lime)" />
          </div>

          <span className="worldmap__progress-pct mono">{pct}%</span>

          <div className="worldmap__progress-right">
            <span className="worldmap__progress-next-label mono">Suggested next:</span>
            {nextLevel ? (
              <Tag variant="slate">
                {nextLevel.code} {nextLevel.name} <ArrowRight size={12} />
              </Tag>
            ) : (
              <Tag variant="lime">All cleared!</Tag>
            )}
          </div>
        </motion.div>

        {/* ── Zone grid ── */}
        <div className="worldmap__grid">
          {zones.map((zone, i) => (
            <ZoneCard key={zone.id} zone={zone} index={i} />
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="worldmap__footer">
          <div className="worldmap__footer-left">
            {/* Reset progress */}
            {!showConfirm ? (
              <button
                className="worldmap__reset-btn mono"
                onClick={() => setShowConfirm(true)}
              >
                <RotateCcw size={13} /> Reset progress
              </button>
            ) : (
              <div className="worldmap__confirm">
                <span className="mono">Erase all progress?</span>
                <button className="worldmap__confirm-yes mono" onClick={handleReset}>
                  Yes, reset
                </button>
                <button className="worldmap__confirm-no mono" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="worldmap__footer-right mono">
            {import.meta.env.DEV && (
              <span className="worldmap__dev-hint">
                DEV: Press U to {unlockAll ? 'lock' : 'unlock'} all
              </span>
            )}
          </div>
        </footer>

        {/* Footer links */}
        <div className="worldmap__footer-links">
          <div className="worldmap__footer-links-left mono">
            <span>⊙</span>
            © 2025 Chaos Vault · Algorithmic Playground
          </div>
          <div className="worldmap__footer-links-right mono">
            <span>{'>_'}  Rulebook</span>
            <span>Patch Notes</span>
            <span>OST & Credits</span>
          </div>
        </div>
      </div>
    </div>
  );
}
