import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

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

  async function handleApprove(id) {
    if (!confirm('Approve this contract?')) return;
    await api.approveContract(id);
    loadContracts();
  }

  return (
    <div>
      <div className="row-between">
        <h1>Contracts</h1>
        <Link to="/contracts/new"><button>Create Contract</button></Link>
      </div>

      <div className="filters card">
        <input placeholder="Search by contract no, title, vendor" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Draft</option>
          <option>Pending Approval</option>
          <option>Active</option>
          <option>Expiring Soon</option>
          <option>Expired</option>
          <option>Terminated</option>
        </select>
        <button onClick={loadContracts}>Apply</button>
      </div>

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
              <td>{c.start_date?.slice(0,10)}</td>
              <td>{c.end_date?.slice(0,10)}</td>
              <td>${Number(c.amount).toLocaleString()}</td>
              <td>{c.status}</td>
              <td className="actions">
                <Link to={`/contracts/${c.id}`}>View</Link>
                <Link to={`/contracts/${c.id}/edit`}>Edit</Link>
                {user?.role === 'Admin' && c.status === 'Pending Approval' && (
                  <button onClick={() => handleApprove(c.id)}>Approve</button>
                )}
                {user?.role === 'Admin' && <button className="danger" onClick={() => handleDelete(c.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
