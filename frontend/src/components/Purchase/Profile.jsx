import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Profile() {
  const { user } = useAuth0();
  return (
    <div>
      <h2>Your Profile</h2>
      <table>
        <tbody>
          <tr><td><b>Username:</b></td><td>{user?.nickname || user?.preferred_username || user?.name || user?.email}</td></tr>
          <tr><td><b>Name:</b></td><td>{user?.name}</td></tr>
          <tr><td><b>Email:</b></td><td>{user?.email}</td></tr>
          <tr><td><b>Contact number:</b></td><td>{user?.['phone_number'] || '—'}</td></tr>
          <tr><td><b>Country:</b></td><td>{user?.['country'] || '—'}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
