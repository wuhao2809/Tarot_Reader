import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useGuest } from './GuestContext';
import useTarotHistory from '../hooks/useTarot';
import '../style/tarotHistory.css';

export default function TarotHistory() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const [tarotHistory] = useTarotHistory();

  if (isGuest) {
    return (
      <div className="tarot-history-container">
        <h2>Welcome, Guest!</h2>
        <p>You are browsing the app as a guest. Please log in to access your profile information and tarot history.</p>
      </div>
    );
  }

  return (
    <div className="tarot-history-container">
      {user ? (
        <>
          <h2>Tarot History</h2>
          {tarotHistory.length > 0 ? (
            <ul className="tarot-history-list">
              {tarotHistory.map((entry) => (
                <li key={entry.id} className="tarot-history-item">
                  <p>Card: {entry.tarot}</p>
                  <p>Drawn at: {new Date(entry.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tarot history found.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}