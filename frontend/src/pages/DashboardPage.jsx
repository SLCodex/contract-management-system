import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, expiringSoon: 0, expired: 0 });

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid stats">
        <div className="card"><h3>Total Contracts</h3><p>{stats.total}</p></div>
        <div className="card"><h3>Active Contracts</h3><p>{stats.active}</p></div>
        <div className="card"><h3>Expiring Soon</h3><p>{stats.expiringSoon}</p></div>
        <div className="card"><h3>Expired Contracts</h3><p>{stats.expired}</p></div>
      </div>
    </div>
  );
}
