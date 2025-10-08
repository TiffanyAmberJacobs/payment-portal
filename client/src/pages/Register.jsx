import React, { useState } from 'react';
import API from '../api';

export default function Register() {
  const [form, setForm] = useState({ fullName:'', idNumber:'', accountNumber:'', username:'', password:'' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      setMsg('Registered — please log in');
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Error');
    }
  };
  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Full name" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})}/>
      <input placeholder="ID number" value={form.idNumber} onChange={e=>setForm({...form, idNumber:e.target.value})}/>
      <input placeholder="Account number" value={form.accountNumber} onChange={e=>setForm({...form, accountNumber:e.target.value})}/>
      <input placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
      <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      <button type="submit">Register</button>
      <div>{msg}</div>
    </form>
  );
}
