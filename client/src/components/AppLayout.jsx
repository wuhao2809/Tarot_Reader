import "../style/appLayout.css";
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useGuest } from "./GuestContext";

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();
  const { isGuest } = useGuest();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="title">
        <h1>Tarot Cards</h1>
      </div>
      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/app">Profile</Link>
            </li>
            <li>
              <Link to="/app/tarot">Tarot Cards</Link>
            </li>
            <li>
              <Link to="/app/tarothistory">Tarot History</Link>
            </li>
            <li>
              <Link to="/app/forum">Forum</Link>
            </li>
            <li>
              <button
                className="exit-button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                LogOut
              </button>
            </li>
          </ul>
        </nav>
        <div>Welcome 👋 {isGuest ? "Guest" : user?.name}</div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}