import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useGuest } from './GuestContext';
import useUserProfile from '../hooks/useUserProfile';
import useUpdateUserProfile from '../hooks/useUpdateUserProfile';
import '../style/profile.css';

const astrologicalSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function Profile() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { updateUserProfile, loading, error } = useUpdateUserProfile();
  const [userProfile, setUserProfile] = useUserProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [astrologicalSign, setAstrologicalSign] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setAstrologicalSign(userProfile.astrologicalSign || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    const updatedUser = await updateUserProfile(name, astrologicalSign);
    if (updatedUser) {
      setUserProfile(updatedUser);
      setIsEditing(false);
    }
  };

  if (isGuest) {
    return (
      <div className="profile-container guest">
        <h2>Welcome, Guest!</h2>
        <p>You are browsing the app as a guest. Please log in to access your profile information.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {userProfile ? (
        <>
          {isEditing ? (
            <div className="edit-form">
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Astrological Sign:
                <select
                  value={astrologicalSign}
                  onChange={(e) => setAstrologicalSign(e.target.value)}
                >
                  <option value="">Select your sign</option>
                  {astrologicalSigns.map((sign) => (
                    <option key={sign} value={sign}>
                      {sign}
                    </option>
                  ))}
                </select>
              </label>
              <div className="button-group">
                <button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
              {error && <p className="error">{error}</p>}
            </div>
          ) : (
            <>
              <div className="profile-info">
                <p>Name: {userProfile.name}</p>
                <p>📧 Email: {user.email}</p>
                <p>🔑 Auth0Id: {userProfile.auth0Id}</p>
                <p>✅ Email verified: {user.email_verified?.toString()}</p>
                <p>🔮 Astrological Sign: {userProfile.astrologicalSign}</p>
              </div>
              <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}