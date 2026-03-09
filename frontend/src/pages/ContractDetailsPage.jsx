import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { Badge, Card } from '../components/ui';

const toneMap = {
  Draft: 'neutral',
  Active: 'success',
  'Expiring Soon': 'warning',
  Expired: 'danger',
  Terminated: 'danger',
};

export default function ContractDetailsPage() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    api.getContract(id).then((data) => setContract(data.data)).catch(console.error);
  }, [id]);

  if (!contract) return <p>Loading...</p>;

  return (
    <Card>
      <div className="details-header">
        <div>
          <p className="muted">Contract details</p>
          <h1 className="details-title">{contract.title}</h1>
        </div>
        <Badge tone={toneMap[contract.status] || 'neutral'}>{contract.status}</Badge>
      </div>

      <div className="details-grid">
        <div className="details-item"><span>Contract No</span><strong>{contract.contract_no}</strong></div>
        <div className="details-item"><span>Vendor</span><strong>{contract.vendor_name}</strong></div>
        <div className="details-item"><span>Department</span><strong>{contract.department}</strong></div>
        <div className="details-item"><span>Amount</span><strong>${Number(contract.amount).toLocaleString()}</strong></div>
        <div className="details-item"><span>Start Date</span><strong>{contract.start_date?.slice(0, 10)}</strong></div>
        <div className="details-item"><span>End Date</span><strong>{contract.end_date?.slice(0, 10)}</strong></div>
        <div className="details-item details-full"><span>Description</span><strong>{contract.description || '-'}</strong></div>
        <div className="details-item"><span>Created At</span><strong>{new Date(contract.created_at).toLocaleString()}</strong></div>
        <div className="details-item"><span>Updated At</span><strong>{new Date(contract.updated_at).toLocaleString()}</strong></div>
        <div className="details-item"><span>Created By (user id)</span><strong>{contract.created_by}</strong></div>
        <div className="details-item"><span>Approved By (user id)</span><strong>{contract.approved_by || '-'}</strong></div>
        <div className="details-item details-full"><span>Approved At</span><strong>{contract.approved_at ? new Date(contract.approved_at).toLocaleString() : '-'}</strong></div>
        {contract.file_path && (
          <div className="details-item details-full">
            <span>Attachment</span>
            <a href={`http://localhost:5000/${contract.file_path}`} target="_blank" rel="noreferrer">Open File</a>
          </div>
        )}
      </div>
    </Card>
  );
}
