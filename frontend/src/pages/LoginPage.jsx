import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Button, Card, Input } from '../components/ui';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const data = await api.login(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-wrap">
      <form className="form-stack" onSubmit={handleSubmit}>
        <Card>
          <h1>Welcome back</h1>
          <p className="muted">Sign in to manage contracts and approvals.</p>
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="error">{error}</p>}
          <Button type="submit">Login</Button>
        </Card>
        <Card>
          <p className="muted">Admin: admin@example.com / admin123</p>
          <p className="muted">Staff: staff@example.com / staff123</p>
        </Card>
      </form>
    </div>
  );
}
