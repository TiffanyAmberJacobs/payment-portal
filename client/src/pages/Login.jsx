import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ role='customer' }) {
  const [form, setForm] = useState({ username:'', password:'' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/login', form);
      // after login the cookie exists; move to customer dashboard
      if (role === 'customer') nav('/pay');
      else nav('/employee');
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login ({role})</h2>
      <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} placeholder="Username" />
      <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" />
      <button type="submit">Login</button>
      <div>{msg}</div>
    </form>
  );
}
