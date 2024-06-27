import React, { useState } from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";

import Tarot from "./components/Tarot";
import TarotHistory from "./components/TarotHistory";
import Forum from "./components/Forum";

import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";

import "./style/normalize.css";
import "./style/index.css";

import { useGuest, GuestProvider } from "./components/GuestContext";

const container = document.getElementById("root");

const requestedScopes = ["profile", "email"];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const { isGuest } = useGuest();

  // If the user is not authenticated, redirect to the home page
  if (!isLoading && !isAuthenticated && !isGuest) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, display the children (the protected page)
  return children;
}

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <GuestProvider>
      <AuthTokenProvider>
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route
              path="app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Profile />} />
              <Route path="tarot" element={<Tarot />} />
              <Route path="tarothistory" element={<TarotHistory />} />
              <Route path="forum" element={<Forum />} />
              <Route path="debugger" element={<AuthDebugger />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
          
        </AuthTokenProvider>
        </GuestProvider>
    </Auth0Provider>
  </React.StrictMode>
);
