import React, { useEffect, useState } from 'react';
import API from '../api';

export default function EmployeePortal() {
  const [txs, setTxs] = useState([]);
  useEffect(() => {
    API.get('/employee/pending').then(r => setTxs(r.data)).catch(()=>{});
  }, []);
  async function verify(id) {
    await API.post(`/employee/verify/${id}`);
    setTxs(prev => prev.filter(tx => tx.id !== id));
  }
  async function submit(id) {
    await API.post(`/employee/submit/${id}`);
    setTxs(prev => prev.filter(tx => tx.id !== id));
  }
  return (
    <div>
      <h2>Employee Portal — Pending Payments</h2>
      <table>
        <thead><tr><th>Customer</th><th>Amount</th><th>Payee</th><th>SWIFT</th><th>Actions</th></tr></thead>
        <tbody>
          {txs.map(tx => (
            <tr key={tx.id}>
              <td>{tx.customerName}</td>
              <td>{tx.amount} {tx.currency}</td>
              <td>{tx.payeeAccount}</td>
              <td>{tx.payeeSWIFT}</td>
              <td>
                <button onClick={()=>verify(tx.id)}>Verify</button>
                <button onClick={()=>submit(tx.id)}>Submit to SWIFT</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
