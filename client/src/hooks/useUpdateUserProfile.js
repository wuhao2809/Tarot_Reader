// hooks/useUpdateUserProfile.js
import { useState } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useUpdateUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuthToken();

  async function updateUserProfile(name, astrologicalSign) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, astrologicalSign }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setLoading(false);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return { updateUserProfile, loading, error };
}