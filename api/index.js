import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import OpenAI from "openai";

// Debug
console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);
console.log("AUTH0_ISSUER:", process.env.AUTH0_ISSUER);

// Middleware to validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Public endpoint
app.get("", (req, res) => {
  res.send("pong");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.put("/update-profile", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { name, astrologicalSign } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { auth0Id },
      data: { name, astrologicalSign },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating profile");
  }
});

// Get tarot history for the authenticated user
app.get("/tarothistory", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;

    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const tarotHistory = await prisma.tarotHistory.findMany({
      where: {
        userId: user.id,
      },
    });

    res.json(tarotHistory);
  } catch (error) {
    console.error("Error fetching tarot history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a tarot history entry for the authenticated user
app.post("/tarothistory", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { tarot } = req.body;

  if (!tarot) {
    res.status(400).send("tarot is required");
  } else {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const newEntry = await prisma.tarotHistory.create({
      data: {
        tarot,
        user: { connect: { id: user.id } },
      },
    });

    res.status(201).json(newEntry);
  }
});


// Endpoint to get GPT tarot reading
app.post("/gpt-reading", requireAuth, async (req, res) => {
  const { name, gender, astrologicalSign, dateToday, card, position, question } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional Tarot Reader. Your mission is to use information from the user's to give them insights, guidance, and understanding through the tarot reading process. Your role involves interpreting the cards with intuition and expertise to provide meaningful advice and support.",
        },
        {
          role: "user",
          content: `name: ${name}\ngender: ${gender}\nastrologicalSign: ${astrologicalSign}\ndateToday: ${dateToday}\ncard: ${card}\nposition: ${position}\nquestion: ${question}`,
        },
      ],
      temperature: 0.8,
      model: "gpt-3.5-turbo",
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching GPT reading:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a tarot history entry by id
app.delete("/tarothistory/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const deletedEntry = await prisma.tarotHistory.delete({
    where: {
      id,
    },
  });
  res.json(deletedEntry);
});
// Forum endpoints

// Get comments for the authenticated user
app.get("/comments", requireAuth, async (req, res) => {
  try {
    const comments = await prisma.comments.findMany({
      include: {
        user: true, // Ensure user data is included
      },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a comment
app.post("/comments", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { content } = req.body;

  if (!content) {
    res.status(400).send("content is required");
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          auth0Id,
        },
      });

      const newComment = await prisma.comments.create({
        data: {
          content,
          user: { connect: { id: user.id } },
        },
      });

      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).send("Error creating comment");
    }
  }
});

// Edit a comment
app.put("/comments/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comments.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (comment.user.auth0Id !== auth0Id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedComment = await prisma.comments.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.json(updatedComment);
  } catch (error) {
    res.status(500).send("Error updating comment");
  }
});

// Delete a comment
app.delete("/comments/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { id } = req.params;

  try {
    const comment = await prisma.comments.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (comment.user.auth0Id !== auth0Id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const deletedComment = await prisma.comments.delete({
      where: { id: parseInt(id) },
    });

    res.json(deletedComment);
  } catch (error) {
    res.status(500).send("Error deleting comment");
  }
});


// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
