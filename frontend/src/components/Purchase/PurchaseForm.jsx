import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { apiPost } from '../api';

const PRODUCTS = ['Apples', 'Oranges', 'USB Cable', 'Wireless Mouse'];
const DISTRICTS = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara'];

export default function PurchaseForm() {
  const { user, getAccessTokenSilently } = useAuth0();

  const [form, setForm] = useState({
    dateOfPurchase: '',
    preferredTime: '10 AM',
    preferredLocation: DISTRICTS[0],
    productName: PRODUCTS[0],
    quantity: 1,
    message: ''
  });
  const [status, setStatus] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'quantity' ? parseInt(value,10) : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const token = await getAccessTokenSilently();
      const payload = {
        username: user?.nickname || user?.email || user?.name,
        name: user?.name,
        email: user?.email,
        contactNumber: user?.phone_number,
        country: user?.country,
        ...form
      };
      const res = await apiPost('/purchases', payload, token);
      setStatus('Purchase created!');
      setForm(prev => ({ ...prev, quantity: 1, message: '' }));
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || err.message);
    }
  }

  function isDateValid(d) {
    if (!d) return false;
    const dt = new Date(d);
    const today = new Date(); today.setHours(0,0,0,0);
    dt.setHours(0,0,0,0);
    if (dt < today) return false;
    if (dt.getDay() === 0) return false;
    return true;
  }

  return (
    <div>
      <h2>Place a Purchase</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date of purchase: </label>
          <input type="date" name="dateOfPurchase" value={form.dateOfPurchase} onChange={onChange} required />
        </div>
        <div>
          <label>Preferred time: </label>
          <select name="preferredTime" value={form.preferredTime} onChange={onChange}>
            <option>10 AM</option>
            <option>11 AM</option>
            <option>12 PM</option>
          </select>
        </div>
        <div>
          <label>District: </label>
          <select name="preferredLocation" value={form.preferredLocation} onChange={onChange}>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label>Product: </label>
          <select name="productName" value={form.productName} onChange={onChange}>
            {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label>Quantity: </label>
          <input type="number" name="quantity" value={form.quantity} onChange={onChange} min={1} />
        </div>
        <div>
          <label>Message: </label>
          <textarea name="message" value={form.message} onChange={onChange} maxLength={500} />
        </div>
        <div>
          <button type="submit" disabled={!isDateValid(form.dateOfPurchase)}>Submit</button>
        </div>
      </form>
      {status && <p>{status}</p>}
      {!isDateValid(form.dateOfPurchase) && <p style={{color:'red'}}>Choose today or later, and not Sunday.</p>}
    </div>
  );
}
