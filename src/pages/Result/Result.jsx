import { useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, ArrowRight, Clock, Heart, Zap, Target, Trophy } from 'lucide-react';
import { getLevel, getLevelIndex, levels } from '../../data/levels';
import { getZone } from '../../data/zones';
import { getEngine } from '../../algorithms/index';
import { useProgress } from '../../hooks/useProgress';
import Tag from '../../components/Tag/Tag';
import Button from '../../components/Button/Button';
import ExplainBox from '../../components/ExplainBox/ExplainBox';
import './Result.css';

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function DeltaChip({ value, label, invert = false }) {
  // invert = true means lower is better (time, mistakes)
  const isGood = invert ? value <= 0 : value >= 0;
  const sign = value > 0 ? '+' : '';
  return (
    <span className={`result__delta ${isGood ? 'result__delta--good' : 'result__delta--bad'}`}>
      {sign}{value} {label}
    </span>
  );
}

export default function Result() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { progress, getStats } = useProgress();
  const confettiFired = useRef(false);

  const level = getLevel(levelId);
  const lastResult = progress.lastResult;

  // Redirect if no valid result
  useEffect(() => {
    if (!level || !lastResult || lastResult.levelId !== levelId) {
      navigate('/map', { replace: true });
    }
  }, [level, lastResult, levelId, navigate]);

  if (!level || !lastResult || lastResult.levelId !== levelId) return null;

  const zone = getZone(level.zone);
  const engine = getEngine(level.algorithm);
  const stats = getStats(levelId);
  const levelIdx = getLevelIndex(levelId);
  const nextLevelData = levelIdx + 1 < levels.length ? levels[levelIdx + 1] : null;

  const { stars, timeSec, mistakes, moves, parMoves, heartsLeft, firstClear, starsGained } = lastResult;

  // Confetti on mount when stars >= 2
  useEffect(() => {
    if (confettiFired.current) return;
    if (stars >= 2) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        confettiFired.current = true;
        const end = Date.now() + 1200;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60 + Math.random() * 60,
            spread: 60,
            origin: { x: Math.random(), y: 0.5 + Math.random() * 0.3 },
            colors: ['#A6F04A', '#FFD84A', '#7B61FF', '#4ADEDB'],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }
    }
  }, [stars]);

  // Time vs par delta
  const timeDelta = timeSec - level.parSeconds;
  // Best time
  const bestTime = stats?.bestTimeSec ?? timeSec;

  // Coins earned
  const coinsEarned = starsGained * 10;

  // Star pop animation variants
  const starVariant = {
    hidden: { scale: 0, rotate: -30, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15,
        delay: 0.3 + i * 0.25,
      },
    }),
  };

  return (
    <div className="result">
      <div className="result__container">
        {/* ── Hero card ── */}
        <div className="result__hero">
          <Tag variant="lime">● Stage {level.code} Cleared · {zone?.name}</Tag>

          <h1 className="result__title">Stage cleared! {level.name}</h1>
          <p className="result__subtitle">
            {level.mission}
          </p>

          {/* Stars */}
          <div className="result__stars-row">
            <div className="result__stars">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className={`result__star ${i < stars ? 'result__star--earned' : 'result__star--empty'}`}
                  custom={i}
                  variants={starVariant}
                  initial="hidden"
                  animate="visible"
                >
                  ★
                </motion.span>
              ))}
            </div>
            <div className="result__stars-info">
              <span className="result__stars-count">{stars} / 3 Stars Earned</span>
              {stars < 3 && (
                <span className="mono result__stars-hint">
                  {stars === 1
                    ? 'No mistakes for 2 stars'
                    : 'Under par time for 3 stars'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stat tiles ── */}
        <div className="result__stats-section">
          <h3 className="mono result__stats-title">{'>'} Run Telemetry & Resource Efficiency</h3>

          <div className="result__stats-grid">
            <div className="result__stat">
              <span className="mono result__stat-label">Moves</span>
              <span className="result__stat-value">{moves}</span>
              <DeltaChip value={moves - parMoves} label={`Par: ${parMoves}`} invert />
            </div>

            <div className="result__stat">
              <span className="mono result__stat-label">Time</span>
              <span className="result__stat-value">{formatTime(timeSec)}</span>
              <DeltaChip
                value={timeDelta}
                label={`${Math.abs(timeDelta)}s vs Par`}
                invert
              />
            </div>

            <div className="result__stat">
              <span className="mono result__stat-label">Mistakes</span>
              <span className="result__stat-value result__stat-value--mistakes">
                {mistakes}
              </span>
              <span className={`result__delta ${mistakes === 0 ? 'result__delta--good' : 'result__delta--bad'}`}>
                {mistakes === 0 ? 'Flawless' : `${3 - heartsLeft} Heart${3 - heartsLeft !== 1 ? 's' : ''} Lost`}
              </span>
            </div>

            <div className="result__stat">
              <span className="mono result__stat-label">Hearts Left</span>
              <span className="result__stat-value">
                {'♥'.repeat(heartsLeft)}{'♡'.repeat(3 - heartsLeft)}
              </span>
              <span className="result__delta result__delta--good">
                {heartsLeft}/3
              </span>
            </div>

            <div className="result__stat">
              <span className="mono result__stat-label">Best Time</span>
              <span className="result__stat-value">{formatTime(bestTime)}</span>
              {timeSec <= bestTime && timeSec < (stats?.bestTimeSec ?? Infinity) ? (
                <span className="result__delta result__delta--good">New Best!</span>
              ) : (
                <span className="result__delta">Record: {formatTime(bestTime)}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── What you learned ── */}
        {engine && (
          <div className="result__learned">
            <div className="result__learned-header mono">
              <span>📖 Algo Rulebook · Codec Note</span>
              {engine.meta.learned.includes('O(') && (
                <Tag variant="violet">Complexity Noted</Tag>
              )}
            </div>
            <ExplainBox>
              {engine.meta.learned}
            </ExplainBox>
          </div>
        )}

        {/* ── Rewards row ── */}
        <div className="result__rewards">
          <h3 className="mono result__rewards-title">🏆 Loot & Unlocks Collected</h3>
          <div className="result__rewards-row">
            {coinsEarned > 0 && (
              <div className="result__reward result__reward--coins">
                <span className="result__reward-icon">💰</span>
                <span className="result__reward-value">+{coinsEarned} Coins</span>
                <span className="result__reward-sub mono">Stage Bounty</span>
              </div>
            )}
            {coinsEarned === 0 && (
              <div className="result__reward result__reward--no-coins">
                <span className="result__reward-icon">💰</span>
                <span className="result__reward-value">+0 Coins</span>
                <span className="result__reward-sub mono">Already earned</span>
              </div>
            )}
            {(starsGained > 0 || firstClear) && (
              <div className="result__reward result__reward--best">
                <span className="result__reward-icon">🌟</span>
                <span className="result__reward-value">New Best!</span>
                <span className="result__reward-sub mono">
                  {firstClear ? 'First clear' : `+${starsGained} star${starsGained !== 1 ? 's' : ''}`}
                </span>
              </div>
            )}
            {firstClear && nextLevelData && (
              <div className="result__reward result__reward--unlock">
                <span className="result__reward-icon">🔓</span>
                <span className="result__reward-value">Next Unlocked</span>
                <span className="result__reward-sub mono">{nextLevelData.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="result__actions">
          <Link to="/map" className="result__action-link mono">
            <ArrowLeft size={16} /> Back to Map
          </Link>

          <Button variant="secondary" to={`/play/${levelId}`}>
            <RotateCcw size={16} /> Retry with new seed
          </Button>

          {nextLevelData ? (
            <Button variant="primary" to={`/play/${nextLevelData.id}`}>
              Next stage <ArrowRight size={16} />
            </Button>
          ) : (
            <div className="result__final">
              <Button variant="primary" to="/map">
                Back to map <ArrowRight size={16} />
              </Button>
              <span className="mono result__final-hint">More zones coming soon</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
