import "../style/home.css";

import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useGuest } from "./GuestContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const { continueAsGuest } = useGuest();

  return (
    <div className="home">
      <div className="home-container">
        <h1>Tarot Cards</h1>
        <div>
          {!isAuthenticated ? (
            <button className="btn-primary" onClick={loginWithRedirect}>
              Login
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigate("/app")}>
              Enter App
            </button>
          )}
        </div>
        <div>
          <button className="btn-secondary" onClick={signUp}>
            Create Account
          </button>
        </div>
        <div>
          <button
            className="btn-secondary"
            onClick={() => {
              continueAsGuest();
              navigate("/app");
            }}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}