import { Link, useLocation } from 'react-router-dom';
import { Map, Swords, BookOpen, CalendarDays, Coins } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { TOTAL_LEVELS } from '../../data/levels';
import { useToast, ToastContainer } from '../Toast/Toast';
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
  const { toasts, show, dismiss } = useToast(3500);
  const pct = Math.round((clearedCount / TOTAL_LEVELS) * 100);

  return (
    <header className="topbar">
      <div className="topbar__inner">
        {/* Logo */}
        <Link to="/" className="topbar__logo" aria-label="Home">
          <span className="topbar__logo-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              {/* Offset shadow */}
              <circle cx="17.5" cy="17.5" r="13" fill="var(--ink)" />
              {/* Outer circle */}
              <circle cx="15.5" cy="15.5" r="13" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="2.5" />
              {/* Inner ring */}
              <circle cx="15.5" cy="15.5" r="5" stroke="var(--ink)" strokeWidth="2" />
              {/* Center dot */}
              <circle cx="15.5" cy="15.5" r="1.5" fill="var(--ink)" />
            </svg>
          </span>
          <span className="topbar__wordmark">
            <strong>CHAOS</strong> <strong style={{ color: 'var(--violet)' }}>VAULT</strong>
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
                  <span
                    className="topbar__nav-item topbar__nav-item--disabled"
                    title="Soon"
                    onClick={() => show("This module is currently sealed. Access will be granted in a forthcoming update.", "info")}
                  >
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
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </header>
  );
}
