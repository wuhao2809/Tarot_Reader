# Tarot Card Reader Application

### Live Demo: [https://cs-5610-assignment-03-hao.vercel.app/](https://cs-5610-assignment-03-hao.vercel.app/)

## Overview

The Tarot Card Reader Application is a full-stack web app that allows users to draw tarot cards, interpret their meanings, and receive detailed readings powered by GPT. Users can log in, sign up, or continue as guests. Authenticated users can save their card draw history.

## Features

- Draw tarot cards and receive interpretations
- Reversed card support for alternate meanings
- GPT-powered Tarot Master for detailed readings
- User authentication via Auth0 (login, signup, guest mode)
- Save and view card draw history (for logged-in users)
- Responsive design for desktop, tablet, and mobile
- Accessibility tested with Lighthouse
- Deployed client, API, and database

## Tech Stack

- **Frontend:** React, Auth0, CSS
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL
- **AI:** OpenAI GPT API
- **Deployment:** Vercel (client), [your API host], [your DB host]

## Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd cs-5610-assignment-03-hao
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd client && npm install
   cd ../api && npm install
   ```

3. **Environment variables:**

   - Copy `.env.example` to `.env` in both `client` and `api` folders and fill in your secrets (Auth0, OpenAI, DB, etc).

4. **Run locally:**
   - Start the API:
     ```bash
     cd api
     npm run dev
     ```
   - Start the client:
     ```bash
     cd ../client
     npm start
     ```

## Testing

- Run unit tests in the client:
  ```bash
  cd client
  npm test
  ```

## Accessibility

- Lighthouse accessibility reports for 3 pages are included in the `accessibility_reports` folder.

## Deployment

- **Live site:** [https://cs-5610-assignment-03-hao.vercel.app/](https://cs-5610-assignment-03-hao.vercel.app/)
- API and database are also deployed (see `.env` for endpoints).
