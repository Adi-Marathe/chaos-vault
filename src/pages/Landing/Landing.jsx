import { motion } from 'framer-motion';
import { Play, ArrowRight, Swords, Search, FlaskConical, CalendarDays } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { TOTAL_LEVELS, levels } from '../../data/levels';
import { getZone } from '../../data/zones';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Tag from '../../components/Tag/Tag';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import ExplainBox from '../../components/ExplainBox/ExplainBox';
import { useToast, ToastContainer } from '../../components/Toast/Toast';
import './Landing.css';

/* ── Animation variants ── */
const stagger = {
  animate: { transition: { staggerChildren: 0.10 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
};

const floatTile = (delay) => ({
  animate: {
    y: [0, -6, 0],
    transition: { repeat: Infinity, duration: 2.6, delay, ease: 'easeInOut' },
  },
});

/* ── Step cards data ── */
const steps = [
  {
    num: 1,
    title: 'Perform the algorithm',
    body: 'Pick elements, compare weights, and trigger swaps with hands-on mechanical rules. No automated magic runs behind the curtain.',
  },
  {
    num: 2,
    title: 'Get instant feedback',
    body: "The vault reacts in real-time. Correct moves reinforce why; wrong moves explain the invariant you broke before state collapses.",
  },
  {
    num: 3,
    title: 'Earn stars, unlock zones',
    body: 'Beat par move counts and speed thresholds to earn gold stars and unlock deeper vault sectors, bonus codexes, and tournament seeds.',
  },
];

/* ── Mode cards data ── */
const modes = [
  {
    icon: Swords,
    tag: 'Ranked',
    name: 'Arena',
    color: '#FFC4C4', // slightly deeper coral/pink
    body: 'Speed run sorting against time. Execute swaps with maximum mechanical APM before the timer crashes.',
    footer: ['Leaderboard: Active', 'Enter →'],
  },
  {
    icon: Search,
    tag: 'Logic',
    name: 'Detective',
    color: '#CDE1FF', // slightly deeper blue
    body: 'Find the faulty invariant in pre-scrambled arrays. Inspect intermediate steps to catch where logic drifted.',
    footer: ['18 Case Files', 'Investigate →'],
  },
  {
    icon: FlaskConical,
    tag: 'Sandbox',
    name: 'Lab',
    color: '#DCCBFF', // slightly deeper lavender
    body: 'Interactive sandbox with custom array inputs, worst-case generators, and step-by-step memory meters.',
    footer: ['Free Tinker', 'Open Lab →'],
  },
  {
    icon: CalendarDays,
    tag: 'Daily #419',
    name: 'Daily',
    color: '#FFE082', // slightly deeper yellow
    body: 'Fresh handcrafted puzzle every 24 hours. Compete for global minimal-move ranks and daily streak badges.',
    footer: ['Resets in 7h 14m', 'Solve →'],
  },
];

/* ── Up-next card dome illustration for binary search ── */
function BinaryDome() {
  return (
    <div className="landing__dome">
      <div className="landing__dome-row">
        <motion.div className="landing__dome-box landing__dome-box--label" {...floatTile(0)}>LOW</motion.div>
        <motion.div className="landing__dome-box landing__dome-box--mid" {...floatTile(0.15)}>MID</motion.div>
        <motion.div className="landing__dome-box landing__dome-box--label" {...floatTile(0.3)}>HIGH</motion.div>
      </div>
    </div>
  );
}

/* ── Up-next card: row of five numbered tiles ── */
function NumberTiles({ zoneColor }) {
  const nums = [37, 12, 84, 5, 61];
  return (
    <div className="landing__tiles">
      {nums.map((n, i) => (
        <motion.div
          key={n}
          className="landing__tile"
          style={{ background: zoneColor }}
          {...floatTile(i * 0.12)}
        >
          {n}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Test Comparison Engine Illustration ── */
function TestComparisonEngine() {
  return (
    <motion.div className="landing__engine" variants={fadeUp}>
      <div className="landing__engine-header mono">
        <span className="landing__engine-title">{'>_'} TEST COMPARISON ENGINE</span>
        <span className="landing__engine-hint">Swap items to check partition</span>
      </div>
      <div className="landing__engine-body">
        <div className="landing__engine-array">
          <div className="landing__engine-node">14</div>
          <span className="landing__engine-op">{'≤'}</span>
          <div className="landing__engine-node landing__engine-node--pivot">29 [PIVOT]</div>
          <span className="landing__engine-op">{'≤'}</span>
          <div className="landing__engine-node">52</div>
          <div className="landing__engine-node">88</div>
        </div>
        <div className="landing__engine-status mono">
          Partition Valid
        </div>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const { clearedCount, nextLevel, coins } = useProgress();
  const { toasts, show, dismiss } = useToast(3500);
  const allCleared = clearedCount >= TOTAL_LEVELS;

  /* CTA logic */
  const primaryLabel = clearedCount === 0 ? 'Start stage 1-1' : 'Continue';
  const primaryTo = allCleared
    ? '/map'
    : nextLevel
      ? `/play/${nextLevel.id}`
      : '/map';

  /* Up-next card data */
  const upNext = nextLevel || levels[0];
  const upNextZone = getZone(upNext.zone);
  const isBinary = upNext.algorithm === 'Binary Search';
  const clearedPct = Math.round((clearedCount / TOTAL_LEVELS) * 100);

  return (
    <div className="landing">
      <div className="landing__container">

        {/* ── Hero section ── */}
        <motion.section
          className="landing__hero"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <div className="landing__hero-left">
            <motion.div variants={fadeUp}>
              <Tag variant="lime">● Algorithm Puzzle-RPG</Tag>
            </motion.div>

            <motion.h1 className="landing__headline" variants={fadeUp}>
              Beat the chaos, one algorithm at a time.
            </motion.h1>

            <motion.p className="landing__subhead" variants={fadeUp}>
              Eight classic search and sort algorithms. You perform every step yourself and the vault checks each move with kinetic mechanical feedback.
            </motion.p>

            <motion.div className="landing__ctas" variants={fadeUp}>
              <Button to={primaryTo} variant="primary">
                <Play size={16} /> {primaryLabel}
              </Button>
              <Button to="/map" variant="link">
                View world map <ArrowRight size={14} />
              </Button>
            </motion.div>

            <TestComparisonEngine />
          </div>

          {/* Up-next card */}
          <motion.div className="landing__hero-right" variants={fadeUp}>
            <Card className="landing__upnext">
              {/* Dome illustration area */}
              <div
                className="landing__upnext-dome"
                style={{ background: upNextZone?.color || 'var(--zone-slate-navy)' }}
              >
                <span className="landing__upnext-code mono">{upNext.code}</span>
                {isBinary ? <BinaryDome /> : <NumberTiles zoneColor={upNextZone?.color} />}
              </div>

              {/* Info */}
              <div className="landing__upnext-info">
                <div className="landing__upnext-header">
                  <span className="mono" style={{ color: 'var(--slate)', fontSize: '0.7rem' }}>
                    Up Next • Zone {upNextZone?.zone}
                  </span>
                  <Tag>{upNext.difficulty}</Tag>
                </div>
                <h3 className="landing__upnext-name">{upNext.name}</h3>
                <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--slate)' }}>
                  {upNext.algorithm} • O(log n)
                </p>
                <p className="landing__upnext-mission">{upNext.mission}</p>

                <ExplainBox>
                  Rule: Maintain Left ≤ Right invariant across recursive branches.
                </ExplainBox>

                <div className="landing__upnext-progress">
                  <span className="mono" style={{ fontSize: '0.7rem' }}>Vault Cleared:</span>
                  <span className="mono" style={{ fontSize: '0.7rem' }}>{clearedCount} of {TOTAL_LEVELS * 3} stages</span>
                </div>
                <ProgressBar value={clearedPct} color="var(--lime)" />
              </div>
            </Card>
          </motion.div>
        </motion.section>

        {/* ── Carousel dots placeholder ── */}
        <div className="landing__dots">
          <span className="landing__dot landing__dot--active" />
          <span className="landing__dot" />
          <span className="landing__dot" />
        </div>

        {/* ── How it works ── */}
        <motion.section
          className="landing__how"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="mono landing__section-label">{'>'}_  How Chaos Vault works</p>
          <h2 className="landing__section-title">Direct kinetic intuition over dry syntax.</h2>

          <div className="landing__steps">
            {steps.map((s) => (
              <Card key={s.num} className="landing__step-card">
                <span className="landing__step-num">{s.num}</span>
                <div>
                  <h3 className="landing__step-title">{s.title}</h3>
                  <p className="landing__step-body">{s.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* ── Game Modes ── */}
        <motion.section
          className="landing__modes"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="landing__modes-header">
            <div>
              <p className="mono landing__section-label">Explore Challenges</p>
              <h2 className="landing__section-title">Game Modes</h2>
            </div>
            <span className="mono landing__modes-link">Full Mode Compendium →</span>
          </div>

          <div className="landing__modes-grid">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <Card key={m.name} className="landing__mode-card">
                  <div className="landing__mode-top" style={{ background: m.color }}>
                    <span className="landing__mode-icon">
                      <Icon size={20} />
                    </span>
                    <Tag>{m.tag}</Tag>
                  </div>
                  <div className="landing__mode-content">
                    <h3 className="landing__mode-name">{m.name}</h3>
                    <p className="landing__mode-body">{m.body}</p>
                    <div className="landing__mode-footer mono">
                      <span>{m.footer[0]}</span>
                      <span 
                        className="landing__mode-action"
                        onClick={() => show("This module is currently sealed. Access will be granted in a forthcoming update.", "info")}
                      >
                        {m.footer[1]}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="landing__footer">
          <div className="landing__footer-left mono">
            <span className="landing__footer-logo">⊙</span>
            © 2025 Chaos Vault · Algorithmic Playground
          </div>
          <div className="landing__footer-right mono">
            <span>{'>_'}  Rulebook</span>
            <span>Patch Notes</span>
            <span>OST & Credits</span>
          </div>
        </footer>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
