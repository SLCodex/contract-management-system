import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Plus, RefreshCw, Trash2 } from '../components/icons';
import { api } from '../api/client';
import { Badge, Button, Card, Input, Select } from '../components/ui';

const toneMap = {
  Draft: 'neutral',
  Active: 'success',
  'Expiring Soon': 'warning',
  Expired: 'danger',
  Terminated: 'danger',
};

const initialForm = {
  contract_no: '',
  title: '',
  vendor_name: '',
  department: '',
  start_date: '',
  end_date: '',
  amount: '',
  status: 'Pending Approval',
  description: '',
};

const statuses = ['Draft', 'Pending Approval', 'Active', 'Expiring Soon', 'Expired', 'Terminated'];

export default function ContractsPage({ user }) {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [nextStatus, setNextStatus] = useState('Pending Approval');

  const modalTitle = useMemo(() => (isEditing ? 'Edit Contract' : 'Add Contract'), [isEditing]);

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

  function resetFormState() {
    setForm(initialForm);
    setSelectedContract(null);
    setIsEditing(false);
  }

  function openCreateModal() {
    resetFormState();
    setIsFormModalOpen(true);
  }

  function openEditModal(contract) {
    setSelectedContract(contract);
    setIsEditing(true);
    setForm({
      ...contract,
      start_date: contract.start_date?.slice(0, 10),
      end_date: contract.end_date?.slice(0, 10),
      amount: contract.amount,
    });
    setIsFormModalOpen(true);
  }

  function openStatusModal(contract) {
    setSelectedContract(contract);
    setNextStatus(contract.status || 'Pending Approval');
    setIsStatusModalOpen(true);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this contract?')) return;
    await api.deleteContract(id);
    loadContracts();
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (isEditing && selectedContract) {
      await api.updateContract(selectedContract.id, form);
    } else {
      await api.createContract(form);
    }
    setIsFormModalOpen(false);
    resetFormState();
    loadContracts();
  }

  async function handleStatusSubmit(e) {
    e.preventDefault();
    if (!selectedContract) return;
    await api.updateContract(selectedContract.id, {
      ...selectedContract,
      status: nextStatus,
      start_date: selectedContract.start_date?.slice(0, 10),
      end_date: selectedContract.end_date?.slice(0, 10),
    });
    setIsStatusModalOpen(false);
    setSelectedContract(null);
    loadContracts();
  }

  return (
    <div>
      <div className="row-between">
        <h1>Contracts</h1>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Add Contract
        </Button>
      </div>

      <Card className="filters">
        <Input placeholder="Search by contract no, title, vendor" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          {statuses.map((value) => (
            <option key={value}>{value}</option>
          ))}
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
                  <Link to={`/contracts/${c.id}`} className="inline-link"><Eye size={14} />View</Link>
                  <Button variant="secondary" onClick={() => openEditModal(c)}><Pencil size={14} />Edit</Button>
                  <Button variant="secondary" onClick={() => openStatusModal(c)}><RefreshCw size={14} />Change Status</Button>
                  {user?.role === 'Admin' && <Button variant="destructive" onClick={() => handleDelete(c.id)}><Trash2 size={14} />Delete</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isFormModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsFormModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="row-between">
              <h2>{modalTitle}</h2>
              <Button variant="secondary" onClick={() => setIsFormModalOpen(false)}>Close</Button>
            </div>
            <form className="grid" onSubmit={handleFormSubmit}>
              <Input placeholder="Contract No" value={form.contract_no} onChange={(e)=>setForm({...form, contract_no: e.target.value})} required />
              <Input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} required />
              <Input placeholder="Vendor Name" value={form.vendor_name} onChange={(e)=>setForm({...form, vendor_name: e.target.value})} required />
              <Input placeholder="Department" value={form.department} onChange={(e)=>setForm({...form, department: e.target.value})} required />
              <Input type="date" value={form.start_date || ''} onChange={(e)=>setForm({...form, start_date: e.target.value})} required />
              <Input type="date" value={form.end_date || ''} onChange={(e)=>setForm({...form, end_date: e.target.value})} required />
              <Input type="number" step="0.01" placeholder="Amount" value={form.amount || ''} onChange={(e)=>setForm({...form, amount: e.target.value})} required />
              <Select value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})}>
                {statuses.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
              <Input placeholder="Description" value={form.description || ''} onChange={(e)=>setForm({...form, description: e.target.value})} />
              <Button type="submit">Save Contract</Button>
            </form>
          </div>
        </div>
      )}

      {isStatusModalOpen && selectedContract && (
        <div className="modal-backdrop" onClick={() => setIsStatusModalOpen(false)}>
          <div className="modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
            <h2>Change Status</h2>
            <p className="muted">{selectedContract.contract_no} - {selectedContract.title}</p>
            <form className="grid" onSubmit={handleStatusSubmit}>
              <Select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
                {statuses.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
              <div className="row-between">
                <Button type="button" variant="secondary" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
