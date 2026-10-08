import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Pause, Play, RotateCcw, Lock } from 'lucide-react';
import { getLevel } from '../../data/levels';
import { getZone } from '../../data/zones';
import { getEngine } from '../../algorithms/index';
import { useProgress } from '../../hooks/useProgress';
import { useLevelGame } from '../../hooks/useLevelGame';
import { useTimer } from '../../hooks/useTimer';
import Hearts from '../../components/Hearts/Hearts';
import Stars from '../../components/Stars/Stars';
import Tag from '../../components/Tag/Tag';
import Button from '../../components/Button/Button';
import ExplainBox from '../../components/ExplainBox/ExplainBox';
import { ToastContainer, useToast } from '../../components/Toast/Toast';
import MissionCard from './panels/MissionCard';
import PseudocodeCard from './panels/PseudocodeCard';
import StepLog from './panels/StepLog';
import ActionBar from './panels/ActionBar';
import BubbleBoard from './boards/BubbleBoard';
import LinearBoard from './boards/LinearBoard';
import BinaryBoard from './boards/BinaryBoard';
import SelectionBoard from './boards/SelectionBoard';
import InsertionBoard from './boards/InsertionBoard';
import MergeBoard from './boards/MergeBoard';
import ShellBoard from './boards/ShellBoard';
import RadixBoard from './boards/RadixBoard';
import './Level.css';

/* Board registry – maps algorithm id to board component */
const boards = {
  bubble: BubbleBoard,
  linear: LinearBoard,
  binary: BinaryBoard,
  selection: SelectionBoard,
  insertion: InsertionBoard,
  merge: MergeBoard,
  shell: ShellBoard,
  radix: RadixBoard,
};

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function Level() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const level = getLevel(levelId);
  const { isUnlocked, recordResult, recordFail } = useProgress();

  /* If unknown or locked, redirect to /map */
  useEffect(() => {
    if (!level) {
      navigate('/map', { replace: true });
    } else if (!isUnlocked(level.id)) {
      navigate('/map', { replace: true });
    }
  }, [level, isUnlocked, navigate]);

  if (!level) return null;

  const engine = getEngine(level.algorithm);
  const zone = getZone(level.zone);

  /* Engine not yet registered → "Coming soon" */
  if (!engine) {
    return (
      <div className="level">
        <div className="level__container level__coming-soon">
          <h2>Coming Soon</h2>
          <p className="mono">The {level.algorithm} engine is not yet implemented.</p>
          <Button to="/map" variant="primary">
            <ArrowLeft size={16} /> Back to map
          </Button>
        </div>
      </div>
    );
  }

  return <LevelInner level={level} engine={engine} zone={zone} />;
}

/**
 * Inner component rendered only when engine is available.
 * Separated so hooks are called unconditionally.
 */
function LevelInner({ level, engine, zone }) {
  const navigate = useNavigate();
  const { recordResult, recordFail } = useProgress();
  const game = useLevelGame(engine);
  const timer = useTimer();
  const { toasts, show: showToast, dismiss } = useToast(2500);
  const [shake, setShake] = useState(false);
  const [winGlow, setWinGlow] = useState(false);
  const winProcessed = useRef(false);

  const Board = boards[engine.meta.id] || null;

  /* Get the active pseudocode line from the latest log entry */
  const activeLine = game.log.length > 0 ? game.log[0].line : -1;

  /* Show toasts from game state */
  useEffect(() => {
    if (game.toast) {
      showToast(game.toast.message, game.toast.type);
      if (game.toast.type === 'error') {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      game.clearToast();
    }
  }, [game.toast]);

  /* Handle winning */
  useEffect(() => {
    if (game.status === 'won' && !winProcessed.current) {
      winProcessed.current = true;
      timer.pause();
      setWinGlow(true);

      // Compute stars
      const stars =
        game.mistakes === 0 && timer.seconds <= level.parSeconds
          ? 3
          : game.mistakes === 0
            ? 2
            : 1;

      // Record result
      recordResult({
        levelId: level.id,
        stars,
        timeSec: timer.seconds,
        mistakes: game.mistakes,
        moves: game.moves,
        parMoves: game.parMoves,
        heartsLeft: game.hearts,
      });

      // Navigate to result after glow
      setTimeout(() => {
        navigate(`/result/${level.id}`);
      }, 900);
    }
  }, [game.status]);

  /* Handle losing */
  const handleRetry = useCallback(() => {
    winProcessed.current = false;
    game.restart();
    timer.reset();
  }, [game, timer]);

  const handleBackToMap = useCallback(() => {
    navigate('/map');
  }, [navigate]);

  /* Briefing Start */
  const handleStart = useCallback(() => {
    game.start();
    timer.start();
  }, [game, timer]);

  /* Pause / Resume */
  const handlePause = useCallback(() => {
    game.pause();
    timer.pause();
  }, [game, timer]);

  const handleResume = useCallback(() => {
    game.resume();
    timer.start();
  }, [game, timer]);

  /* Handle fail */
  useEffect(() => {
    if (game.status === 'lost') {
      timer.pause();
      recordFail(level.id);
    }
  }, [game.status]);

  const isPlaying = game.status === 'playing';

  return (
    <div className="level">
      <div className="level__container">
        {/* ── HUD ── */}
        <div className="level__hud">
          <div className="level__hud-left">
            <Link to="/map" className="level__back mono">
              <ArrowLeft size={16} /> Sector Map
            </Link>
            <Tag variant="violet">⚡ Stage {level.code} · {zone?.name}</Tag>
          </div>
          <h2 className="level__hud-title">
            {level.name} <Tag variant="yellow">{level.algorithm}</Tag>
          </h2>
          <div className="level__hud-right">
            {/* Star goals */}
            <div className="level__hud-stars">
              <Stars count={0} total={3} size="sm" />
              <span className="mono level__hud-stars-label">
                {game.mistakes === 0 && timer.seconds <= level.parSeconds
                  ? '3/3'
                  : game.mistakes === 0
                    ? '2/3'
                    : '1/3'}{' '}
                Stars
              </span>
            </div>

            {/* Timer */}
            <div className="level__hud-timer mono">
              <Clock size={14} /> {formatTime(timer.seconds)}
            </div>

            {/* Hearts */}
            <Hearts total={3} remaining={game.hearts} />

            {/* Moves counter */}
            <div className="level__hud-moves mono">
              ⇄ Swaps: {game.moves} / {game.parMoves}
            </div>

            {/* Pause */}
            {isPlaying && (
              <button className="level__hud-pause" onClick={handlePause} aria-label="Pause">
                <Pause size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ── Main play area ── */}
        <div className="level__play">
          {/* Board column */}
          <div className="level__board-col">
            {Board ? (
              <Board state={game.game} onAction={game.act} shake={shake} />
            ) : (
              <div className="level__no-board mono">Board not available</div>
            )}
            <ActionBar
              actions={engine.meta.actions}
              onAction={game.act}
              disabled={!isPlaying}
            />
          </div>

          {/* Right column */}
          <div className="level__right-col">
            <MissionCard
              level={level}
              engine={engine}
              moves={game.moves}
              parMoves={game.parMoves}
              seconds={timer.seconds}
            />
            <PseudocodeCard
              pseudocode={engine.meta.pseudocode}
              activeLine={activeLine}
              engineName={engine.meta.name}
            />
            <StepLog log={game.log} />
          </div>
        </div>

        {/* ── Overlays ── */}
        <AnimatePresence>
          {/* Briefing overlay */}
          {game.status === 'briefing' && (
            <motion.div
              className="level__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="level__briefing"
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: -20 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div className="level__briefing-header">
                  <span className="mono level__briefing-stage">
                    Stage {level.code} · {zone?.name}
                  </span>
                  <Tag variant="yellow">⇄ {level.difficulty} · Conveyor Swap</Tag>
                </div>

                <h1 className="level__briefing-title">{level.name}</h1>
                <Tag variant="violet">⚡ Algorithm: {level.algorithm}</Tag>

                <p className="level__briefing-mission">{level.mission}</p>

                {/* Action chips */}
                <div className="level__briefing-section">
                  <span className="mono level__briefing-label">Allowed Actions:</span>
                  <div className="level__briefing-chips">
                    {engine.meta.actions.map((a) => (
                      <span key={a.type} className="level__briefing-chip mono">
                        {a.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="level__briefing-stats">
                  <div className="level__briefing-stat">
                    <span className="mono level__briefing-stat-label">Moves Max</span>
                    <span className="level__briefing-stat-value">{game.parMoves}</span>
                    <span className="mono level__briefing-stat-sub">Moves</span>
                  </div>
                  <div className="level__briefing-stat">
                    <span className="mono level__briefing-stat-label">Par Time</span>
                    <span className="level__briefing-stat-value">
                      <Clock size={14} /> {formatTime(level.parSeconds)}
                    </span>
                    <span className="mono level__briefing-stat-sub">Standard Speed</span>
                  </div>
                  <div className="level__briefing-stat">
                    <span className="mono level__briefing-stat-label">Hull Integrity</span>
                    <span className="level__briefing-stat-value">♥♥♥</span>
                    <span className="mono level__briefing-stat-sub">3 Hearts Total</span>
                  </div>
                </div>

                {/* Star goals */}
                <div className="level__briefing-goals">
                  <div className="level__briefing-goal">
                    <span className="level__briefing-goal-star">★</span>
                    <span>Clear the stage in any valid sequence</span>
                    <span className="mono">1 Star</span>
                  </div>
                  <div className="level__briefing-goal">
                    <span className="level__briefing-goal-star level__briefing-goal-star--2">★★</span>
                    <span>Zero mistakes (no wrong moves)</span>
                    <span className="mono">2 Stars</span>
                  </div>
                  <div className="level__briefing-goal">
                    <span className="level__briefing-goal-star level__briefing-goal-star--3">★★★</span>
                    <span>No mistakes and under {formatTime(level.parSeconds)}</span>
                    <span className="mono">3 Stars</span>
                  </div>
                </div>

                {/* Concept */}
                <ExplainBox>{engine.meta.concept}</ExplainBox>

                {/* Buttons */}
                <div className="level__briefing-actions">
                  <Button variant="primary" onClick={handleStart}>
                    Start Learning →
                  </Button>
                  <Button variant="link" to="/map">
                    Back to map
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Pause overlay */}
          {game.status === 'paused' && (
            <motion.div
              className="level__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="level__pause">
                <h2>Paused</h2>
                <p className="mono">Timer stopped at {formatTime(timer.seconds)}</p>
                <div className="level__pause-actions">
                  <Button variant="primary" onClick={handleResume}>
                    <Play size={16} /> Resume
                  </Button>
                  <Button variant="link" to="/map">
                    Back to map
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lost overlay */}
          {game.status === 'lost' && (
            <motion.div
              className="level__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="level__lost">
                <h2>🔒 Vault Locked</h2>
                <p>All hearts lost. The vault seals shut.</p>
                <div className="level__lost-actions">
                  <Button variant="primary" onClick={handleRetry}>
                    Retry with new seed
                  </Button>
                  <Button variant="link" onClick={handleBackToMap}>
                    Back to map
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast container */}
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </div>
    </div>
  );
}
