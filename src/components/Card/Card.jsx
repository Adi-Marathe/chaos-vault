import './Card.css';

/**
 * Shared Card component.
 * variant: 'default' | 'outlined' | 'filled'
 */
export default function Card({ children, className = '', variant = 'default', style, ...rest }) {
  const cls = ['card', `card--${variant}`, className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style} {...rest}>
      {children}
    </div>
  );
}
