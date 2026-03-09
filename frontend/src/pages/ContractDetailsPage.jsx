import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function ContractDetailsPage() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    api.getContract(id).then((data) => setContract(data.data)).catch(console.error);
  }, [id]);

  if (!contract) return <p>Loading...</p>;

  return (
    <div className="card details">
      <h1>{contract.title}</h1>
      <p><strong>Contract No:</strong> {contract.contract_no}</p>
      <p><strong>Vendor:</strong> {contract.vendor_name}</p>
      <p><strong>Department:</strong> {contract.department}</p>
      <p><strong>Amount:</strong> ${Number(contract.amount).toLocaleString()}</p>
      <p><strong>Status:</strong> {contract.status}</p>
      <p><strong>Start Date:</strong> {contract.start_date?.slice(0,10)}</p>
      <p><strong>End Date:</strong> {contract.end_date?.slice(0,10)}</p>
      <p><strong>Description:</strong> {contract.description || '-'}</p>
      <p><strong>Created At:</strong> {new Date(contract.created_at).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(contract.updated_at).toLocaleString()}</p>
      <p><strong>Created By (user id):</strong> {contract.created_by}</p>
      {contract.file_path && (
        <p><a href={`http://localhost:5000/${contract.file_path}`} target="_blank">Open File</a></p>
      )}
    </div>
  );
}
