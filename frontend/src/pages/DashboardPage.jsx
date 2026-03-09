import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/ui';

const STAT_ITEMS = [
  { key: 'total', label: 'Total Contracts' },
  { key: 'active', label: 'Active Contracts' },
  { key: 'expiringSoon', label: 'Expiring Soon' },
  { key: 'expired', label: 'Expired Contracts' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, expiringSoon: 0, expired: 0 });

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid stats">
        {STAT_ITEMS.map((item) => (
          <Card key={item.key}>
            <p className="muted">{item.label}</p>
            <p className="stat-number">{stats[item.key]}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
