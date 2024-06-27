import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

// this is a custom hook that fetches the tarot history from the API
// custom hooks are a way to share logic between components
export default function useTarotHistory() {
  const [tarotHistory, setTarotHistory] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getTarotHistoryFromApi() {
      // fetch the tarot history from the API, passing the access token in the Authorization header
      const data = await fetch(`${process.env.REACT_APP_API_URL}/tarothistory`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const history = await data.json();

      setTarotHistory(history);
    }

    if (accessToken) {
      getTarotHistoryFromApi();
    }
  }, [accessToken]);

  return [tarotHistory, setTarotHistory];
}