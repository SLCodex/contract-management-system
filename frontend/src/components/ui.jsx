import { Link } from 'react-router-dom';

export function Card({ className = '', children }) {
  return <div className={`ui-card ${className}`.trim()}>{children}</div>;
}

export function Button({ className = '', variant = 'default', asChild = false, children, ...props }) {
  const classes = `ui-button ui-button-${variant} ${className}`.trim();
  if (asChild) {
    return <span className={classes}>{children}</span>;
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function Input(props) {
  return <input className="ui-input" {...props} />;
}

export function Select(props) {
  return <select className="ui-input" {...props} />;
}

export function Textarea(props) {
  return <textarea className="ui-input" {...props} />;
}

export function Badge({ tone = 'neutral', children }) {
  return <span className={`ui-badge ui-badge-${tone}`}>{children}</span>;
}

export function NavButton({ to, isActive, children }) {
  return (
    <Link className={`ui-nav-link ${isActive ? 'active' : ''}`} to={to}>
      {children}
    </Link>
  );
}
