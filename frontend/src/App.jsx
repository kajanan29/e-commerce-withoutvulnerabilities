import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './components/Purchase/Profile';
import PurchaseForm from './components/PurchaseForm';
import PurchasesList from './components/PurchasesList';

export default function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Shop Demo</h1>
        <div>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Log in</button>
          ) : (
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</button>
          )}
        </div>
      </header>

      {isAuthenticated ? (
        <>
          <Profile />
          <hr />
          <PurchaseForm />
          <hr />
          <PurchasesList />
        </>
      ) : (
        <p>Please log in to view your profile and place orders.</p>
      )}
    </div>
  );
}
