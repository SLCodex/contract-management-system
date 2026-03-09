import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { Button, Card, Input, Select, Textarea } from '../components/ui';

const initial = {
  contract_no: '',
  title: '',
  vendor_name: '',
  department: '',
  start_date: '',
  end_date: '',
  amount: '',
  status: 'Draft',
  description: '',
};

export default function ContractFormPage({ isEdit }) {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      api.getContract(id).then((data) => {
        const c = data.data;
        setForm({
          ...c,
          start_date: c.start_date?.slice(0, 10),
          end_date: c.end_date?.slice(0, 10),
        });
      }).catch(console.error);
    }
  }, [isEdit, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = isEdit ? await api.updateContract(id, form) : await api.createContract(form);
      const contractId = isEdit ? id : response.data.id;

      if (file) {
        await api.uploadContractFile(contractId, file);
      }

      navigate('/contracts');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>{isEdit ? 'Edit Contract' : 'Create Contract'}</h1>
      <form className="form-grid" onSubmit={handleSubmit}>
        <Card className="grid">
          <Input placeholder="Contract No" value={form.contract_no} onChange={(e)=>setForm({...form, contract_no: e.target.value})} required />
          <Input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} required />
          <Input placeholder="Vendor Name" value={form.vendor_name} onChange={(e)=>setForm({...form, vendor_name: e.target.value})} required />
          <Input placeholder="Department" value={form.department} onChange={(e)=>setForm({...form, department: e.target.value})} required />
          <Input type="date" value={form.start_date} onChange={(e)=>setForm({...form, start_date: e.target.value})} required />
          <Input type="date" value={form.end_date} onChange={(e)=>setForm({...form, end_date: e.target.value})} required />
          <Input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={(e)=>setForm({...form, amount: e.target.value})} required />
          <Select value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})}>
            <option>Draft</option><option>Active</option><option>Terminated</option>
          </Select>
          <Textarea placeholder="Description" value={form.description || ''} onChange={(e)=>setForm({...form, description: e.target.value})} />
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {error && <p className="error">{error}</p>}
          <Button type="submit">Save Contract</Button>
        </Card>
      </form>
    </div>
  );
}
