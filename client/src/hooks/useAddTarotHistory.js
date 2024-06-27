// useAddTarotHistory.js
import { useAuthToken } from "../AuthTokenContext";

export default function useAddTarotHistory() {
  const { accessToken } = useAuthToken();

  const addTarotHistory = async (card) => {
    const tarot = `${card.name} + ${card.reversed ? "Reversed" : "Normal"}`;
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tarothistory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ tarot }),
    });

    if (!response.ok) {
      throw new Error("Failed to add tarot history");
    }

    return response.json();
  };

  return addTarotHistory;
}