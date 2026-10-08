import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

/**
 * Shared Button component.
 * variant: 'primary' (yellow) | 'zone' | 'link' | 'ghost'
 * If `to` is provided, renders a Link; otherwise a <button>.
 */
const Button = forwardRef(function Button(
  { children, variant = 'primary', to, zoneColor, disabled, className = '', ...rest },
  ref,
) {
  const cls = [
    'button',
    `button--${variant}`,
    disabled ? 'button--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = zoneColor ? { '--btn-zone': zoneColor } : undefined;

  if (to && !disabled) {
    return (
      <Link ref={ref} to={to} className={cls} style={style} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={cls} style={style} disabled={disabled} {...rest}>
      {children}
    </button>
  );
});

export default Button;
