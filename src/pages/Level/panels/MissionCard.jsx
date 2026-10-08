import './MissionCard.css';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import Tag from '../../../components/Tag/Tag';

/**
 * Right-column mission card showing goal, algorithm badge, moves/time vs par.
 */
export default function MissionCard({ level, engine, moves, parMoves, seconds }) {
  const movesPct = parMoves > 0 ? Math.min(100, Math.round((moves / parMoves) * 100)) : 0;
  const timePct = level.parSeconds > 0 ? Math.min(100, Math.round((seconds / level.parSeconds) * 100)) : 0;

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="missioncard">
      <div className="missioncard__header">
        <span className="mono missioncard__label">Primary Directive</span>
        <Tag>{level.code}</Tag>
      </div>

      <p className="missioncard__goal">{level.mission}</p>

      {/* Moves vs par */}
      <div className="missioncard__stat">
        <div className="missioncard__stat-header">
          <span className="mono missioncard__stat-label">Swap Budget Usage</span>
          <span className="mono missioncard__stat-value">
            {moves} / {parMoves} ({Math.max(0, parMoves - moves)} Remaining)
          </span>
        </div>
        <ProgressBar
          value={movesPct}
          color={moves > parMoves ? 'var(--coral)' : 'var(--lime)'}
        />
      </div>

      {/* ExplainBox inline */}
      <div className="missioncard__explain">
        <span className="mono missioncard__explain-prompt">{'>_'}</span>
        <span className="missioncard__explain-text">
          {engine.meta.concept}
        </span>
      </div>
    </div>
  );
}
