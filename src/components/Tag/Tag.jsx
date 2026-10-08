import './Tag.css';

/**
 * Small pill-shaped tag label.
 * variant: 'default' | 'lime' | 'violet' | 'yellow' | 'coral' | 'slate'
 */
export default function Tag({ children, variant = 'default', className = '' }) {
  const cls = ['tag', `tag--${variant}`, 'mono', className].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}
