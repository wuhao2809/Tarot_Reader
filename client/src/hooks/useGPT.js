import { useState } from "react";
import { useAuthToken } from "../AuthTokenContext";

const useGpt = () => {
  const [gptResponse, setGptResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuthToken();

  const callGpt = async ({ name, gender, astrologicalSign, dateToday, card, position, question }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/gpt-reading`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, gender, astrologicalSign, dateToday, card, position, question }),
      });
      const data = await response.json();
      setGptResponse(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { gptResponse, loading, error, callGpt };
};

export default useGpt;