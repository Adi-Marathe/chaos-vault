import './Stars.css';

/**
 * Star rating display.
 */
export default function Stars({ count = 0, total = 3, size = 'md', className = '' }) {
  return (
    <div className={`stars stars--${size} ${className}`} aria-label={`${count} of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`stars__icon ${i < count ? 'stars__icon--earned' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
}
