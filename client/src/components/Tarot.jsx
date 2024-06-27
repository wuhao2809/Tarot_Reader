import React, { useState } from "react";
import shuffle from "lodash.shuffle";
import { useAuth0 } from "@auth0/auth0-react";
import useAddTarotHistory from "../hooks/useAddTarotHistory";
import useGpt from "../hooks/useGPT";
import "../style/tarot.css";
import { tarotCards } from "./TarotCards"; // Assuming this file contains tarotCards data

const shuffledCards = shuffle(tarotCards);

export default function Tarot() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [opened, setOpened] = useState([]); // Using index | this state only has 1 item max with the selection from the user
  const [selectedCard, setSelectedCard] = useState(null);
  const [question, setQuestion] = useState(""); // Added state to handle the question
  const [guestMessage, setGuestMessage] = useState(""); // Added state for guest message
  const addTarotHistory = useAddTarotHistory();
  const { gptResponse, loading, error, callGpt } = useGpt();

  async function flipCard(index) {
    // If there is already a card flipped and not the same one, do nothing
    if (opened.length > 0) return;

    const isReversed = Math.random() <= 0.5;
    const selected = { ...shuffledCards[index], reversed: isReversed };
    setOpened([index]);
    setSelectedCard(selected);

    // Add tarot history if user is authenticated
    if (isAuthenticated) {
      try {
        const accessToken = await getAccessTokenSilently();
        await addTarotHistory(selected);

        const userProfile = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((res) => res.json());

        const { name, gender, astrologicalSign } = userProfile;
        setSelectedCard({ ...selected, name, gender, astrologicalSign });
      } catch (error) {
        console.error("Failed to add tarot history:", error);
      }
    }
  }

  const handleGptRequest = async () => {
    if (!isAuthenticated) {
      setGuestMessage("Please register or log in to ask the Tarot Master.");
      return;
    }
    const { name, gender, astrologicalSign } = selectedCard;
    const dateToday = new Date().toLocaleDateString("en-CA");
    const card = selectedCard.name;
    const position = selectedCard.reversed ? "reversed" : "upright";

    await callGpt({
      name,
      gender,
      astrologicalSign,
      dateToday,
      card,
      position,
      question,
    });
  };

  return (
    <div className="tarot">
      <div className="draw-info">
        {selectedCard ? (
          <>
            <h2>
              {selectedCard.name} {selectedCard.reversed && "(Reversed)"}
            </h2>
            <p>
              {selectedCard.reversed
                ? selectedCard.reversedMeaning
                : selectedCard.meaning}
            </p>
            {gptResponse && (
              <div className="gpt-response">
                <h3>Tarot Master (actually GPT...) Reading:</h3>
                <p>{gptResponse}</p>
              </div>
            )}
            {loading && <p>Loading Tarot Master reading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="gpt-request">
              <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button onClick={handleGptRequest} disabled={loading}>
                Ask Tarot Master
              </button>
            </div>
            {guestMessage && <p className="guest-message">{guestMessage}</p>}
          </>
        ) : (
          <p>Pick a card to see its meaning.</p>
        )}
      </div>
      <div className="cards">
        {shuffledCards.map((card, index) => {
          const isFlipped = opened.includes(index);
          return (
            <TarotCard
              key={index}
              index={index}
              card={card}
              isFlipped={isFlipped}
              flipCard={flipCard}
            />
          );
        })}
      </div>
    </div>
  );
}

export function TarotCard({ index, card, isFlipped, flipCard }) {
  return (
    <button
      className={`tarot-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => flipCard(index)}
      aria-label={`tarot-card-${card.name}`}
    >
      <div className="inner">
        <div className="front">
          <p>{card.name}</p>
        </div>
        <div className="back">
          <img
            src="https://res.cloudinary.com/dfib0veoq/image/upload/v1719443550/6ebd8b4b03fcd35c05b49ca0d3dfe85c_vj9tlh.png"
            alt="Card Back"
          />
        </div>
      </div>
    </button>
  );
}