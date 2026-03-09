import { useLocation, useNavigate } from 'react-router-dom';
import { Button, NavButton } from './ui';

export default function Layout({ user, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2>Contract CMS</h2>
          <p className="muted">{user?.name} ({user?.role})</p>
        </div>
        <nav>
          <NavButton isActive={location.pathname === '/dashboard'} to="/dashboard">Dashboard</NavButton>
          <NavButton isActive={location.pathname.startsWith('/contracts')} to="/contracts">Contracts</NavButton>
        </nav>
        <Button onClick={logout} variant="secondary">Logout</Button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
