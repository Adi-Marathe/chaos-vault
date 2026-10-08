import './Hearts.css';

/**
 * Hearts display (filled / empty).
 */
export default function Hearts({ total = 3, remaining = 3, className = '' }) {
  return (
    <div className={`hearts ${className}`} aria-label={`${remaining} of ${total} hearts`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`hearts__icon ${i < remaining ? 'hearts__icon--filled' : ''}`}>
          ♥
        </span>
      ))}
    </div>
  );
}
