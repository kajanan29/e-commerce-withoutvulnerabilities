import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { apiGet } from '../api';

export default function PurchasesList() {
  const { getAccessTokenSilently } = useAuth0();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await apiGet('/purchases', token);
        setPurchases(res.purchases || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getAccessTokenSilently]);

  if (loading) return <div>Loading purchases...</div>;
  if (!purchases.length) return <div>No purchases yet.</div>;

  return (
    <div>
      <h2>Your Purchases</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Date</th><th>Time</th><th>Product</th><th>Qty</th><th>District</th><th>Message</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p._id}>
              <td>{new Date(p.dateOfPurchase).toLocaleDateString()}</td>
              <td>{p.preferredTime}</td>
              <td>{p.productName}</td>
              <td>{p.quantity}</td>
              <td>{p.preferredLocation}</td>
              <td>{p.message || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
