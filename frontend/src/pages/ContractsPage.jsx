import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Badge, Button, Card, Input, Select } from '../components/ui';

const toneMap = {
  Draft: 'neutral',
  Active: 'success',
  'Expiring Soon': 'warning',
  Expired: 'danger',
  Terminated: 'danger',
};

export default function ContractsPage({ user }) {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const loadContracts = async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    const data = await api.getContracts(`?${params.toString()}`);
    setContracts(data.data);
  };

  useEffect(() => {
    loadContracts().catch(console.error);
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this contract?')) return;
    await api.deleteContract(id);
    loadContracts();
  }

  return (
    <div>
      <div className="row-between">
        <h1>Contracts</h1>
        <Link to="/contracts/new">
          <Button asChild>Create Contract</Button>
        </Link>
      </div>

      <Card className="filters">
        <Input placeholder="Search by contract no, title, vendor" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Draft</option>
          <option>Active</option>
          <option>Expiring Soon</option>
          <option>Expired</option>
          <option>Terminated</option>
        </Select>
        <Button onClick={loadContracts}>Apply</Button>
      </Card>

      <Card className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Contract No</th><th>Title</th><th>Vendor</th><th>Department</th><th>Start Date</th><th>End Date</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id}>
                <td>{c.contract_no}</td>
                <td>{c.title}</td>
                <td>{c.vendor_name}</td>
                <td>{c.department}</td>
                <td>{c.start_date?.slice(0, 10)}</td>
                <td>{c.end_date?.slice(0, 10)}</td>
                <td>${Number(c.amount).toLocaleString()}</td>
                <td><Badge tone={toneMap[c.status] || 'neutral'}>{c.status}</Badge></td>
                <td className="actions">
                  <Link to={`/contracts/${c.id}`}>View</Link>
                  <Link to={`/contracts/${c.id}/edit`}>Edit</Link>
                  {user?.role === 'Admin' && <Button variant="destructive" onClick={() => handleDelete(c.id)}>Delete</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
