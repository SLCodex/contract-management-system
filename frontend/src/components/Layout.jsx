import { Link, useLocation, useNavigate } from 'react-router-dom';

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
        <h2>CMS</h2>
        <p className="muted">{user?.name} ({user?.role})</p>
        <nav>
          <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">Dashboard</Link>
          <Link className={location.pathname.startsWith('/contracts') ? 'active' : ''} to="/contracts">Contracts</Link>
        </nav>
        <button onClick={logout} className="secondary">Logout</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
