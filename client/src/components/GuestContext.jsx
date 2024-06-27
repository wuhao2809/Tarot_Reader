import React, { createContext, useContext, useState } from 'react';

const GuestContext = createContext();

export function useGuest() {
  return useContext(GuestContext);
}

export function GuestProvider({ children }) {
  const [isGuest, setIsGuest] = useState(false);

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  return (
    <GuestContext.Provider value={{ isGuest, continueAsGuest }}>
      {children}
    </GuestContext.Provider>
  );
}