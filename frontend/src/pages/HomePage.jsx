import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

const FEATURES = [
  {
    title: 'Centralized contract records',
    text: 'Store contract numbers, vendors, departments, and attached files in one secure workspace.',
  },
  {
    title: 'Status tracking made simple',
    text: 'Track draft, approval, active, expiring, and closed states with visual indicators.',
  },
  {
    title: 'Faster team collaboration',
    text: 'Give legal, procurement, and finance teams a clear shared view of every agreement.',
  },
];

export default function HomePage() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <h2>Contract CMS</h2>
        <Link to="/login" className="inline-link">Sign in</Link>
      </header>

      <section className="landing-hero">
        <p className="hero-kicker">Contract Lifecycle Management</p>
        <h1>Manage contracts with clarity, speed, and confidence.</h1>
        <p className="hero-copy">
          Contract CMS helps teams create, monitor, and review contracts from one modern dashboard.
          Stay on top of renewals, owners, amounts, and approvals without spreadsheet chaos.
        </p>
        <div className="landing-actions">
          <Button asChild>
            <Link to="/login">Get started</Link>
          </Button>
        </div>
      </section>

      <section className="landing-grid">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p className="muted">{feature.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
