import { useEffect } from 'react';
import './ActionBar.css';

/**
 * Action buttons bar under the board.
 * Renders engine meta.actions with button:true as clickable buttons,
 * plus keyboard shortcut hints.
 */
export default function ActionBar({ actions, onAction, disabled }) {
  // Keyboard shortcuts
  useEffect(() => {
    if (disabled) return;
    const handler = (e) => {
      const action = actions.find((a) => a.key === e.key.toLowerCase());
      if (action) {
        e.preventDefault();
        onAction({ type: action.type });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions, onAction, disabled]);

  return (
    <div className="actionbar">
      {actions.filter((a) => a.button !== false).map((action) => (
        <button
          key={action.type}
          className={`actionbar__btn actionbar__btn--${action.type}`}
          onClick={() => onAction({ type: action.type })}
          disabled={disabled}
        >
          <span className="actionbar__btn-label">{action.label}</span>
          <kbd className="actionbar__btn-key mono">{action.key.toUpperCase()}</kbd>
        </button>
      ))}
    </div>
  );
}
