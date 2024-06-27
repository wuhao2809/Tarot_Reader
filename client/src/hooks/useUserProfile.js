import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useUserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function fetchUserProfile() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profile = await response.json();
      setUserProfile(profile);
    }

    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);

  return [userProfile, setUserProfile];
}