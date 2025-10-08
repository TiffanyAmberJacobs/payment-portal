import React, { useState } from 'react';
import API from '../api';

export default function CustomerPay() {
  const [form, setForm] = useState({ amount:'', currency:'ZAR', provider:'SWIFT', payeeAccount:'', payeeSWIFT:'', description:'' });
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/customer/pay', form);
      setMsg(`Created: ${res.data.transactionId}`);
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Error');
    }
  }
  return (
    <form onSubmit={submit}>
      <h2>International Payment</h2>
      <input value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} placeholder="Amount"/>
      <input value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})} placeholder="Currency (ISO)"/>
      <input value={form.provider} onChange={e=>setForm({...form, provider:e.target.value})} placeholder="Provider"/>
      <input value={form.payeeAccount} onChange={e=>setForm({...form, payeeAccount:e.target.value})} placeholder="Payee Account"/>
      <input value={form.payeeSWIFT} onChange={e=>setForm({...form, payeeSWIFT:e.target.value})} placeholder="SWIFT"/>
      <input value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description (optional)"/>
      <button type="submit">Pay Now</button>
      <div>{msg}</div>
    </form>
  );
}
