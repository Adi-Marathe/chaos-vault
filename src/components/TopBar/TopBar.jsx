import { Link, useLocation } from 'react-router-dom';
import { Map, Swords, BookOpen, CalendarDays, Coins } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { TOTAL_LEVELS } from '../../data/levels';
import './TopBar.css';

const navItems = [
  { label: 'Map', to: '/map', icon: Map, enabled: true },
  { label: 'Modes', to: '#', icon: Swords, enabled: false },
  { label: 'Codex', to: '#', icon: BookOpen, enabled: false },
  { label: 'Daily', to: '#', icon: CalendarDays, enabled: false },
];

export default function TopBar() {
  const { clearedCount, coins } = useProgress();
  const location = useLocation();
  const pct = Math.round((clearedCount / TOTAL_LEVELS) * 100);

  return (
    <header className="topbar">
      <div className="topbar__inner">
        {/* Logo */}
        <Link to="/" className="topbar__logo" aria-label="Home">
          <span className="topbar__logo-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="var(--ink)" strokeWidth="3" fill="var(--cream)" />
              <circle cx="16" cy="16" r="6" stroke="var(--ink)" strokeWidth="2" fill="var(--lime)" />
              <path d="M16 2v6M16 24v6M2 16h6M24 16h6" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="topbar__wordmark">
            CHAOS <strong>VAULT</strong>
          </span>
        </Link>

        {/* Nav */}
        <nav className="topbar__nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.enabled && location.pathname === item.to;
            return (
              <span key={item.label} className="topbar__nav-wrapper">
                {item.enabled ? (
                  <Link
                    to={item.to}
                    className={`topbar__nav-item ${isActive ? 'topbar__nav-item--active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="topbar__nav-item topbar__nav-item--disabled" title="Soon">
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="topbar__right">
          {/* Progress pill */}
          <div className="topbar__pill" aria-label={`${clearedCount} of ${TOTAL_LEVELS} cleared`}>
            <span className="topbar__pill-text mono">
              {clearedCount} / {TOTAL_LEVELS}
            </span>
            <div className="topbar__pill-bar">
              <div className="topbar__pill-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Coin counter */}
          <div className="topbar__coins mono" aria-label={`${coins} coins`}>
            <Coins size={16} />
            <span>{coins} ¢</span>
          </div>
        </div>
      </div>
    </header>
  );
}
