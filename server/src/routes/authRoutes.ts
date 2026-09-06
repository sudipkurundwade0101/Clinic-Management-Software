import { Router } from "express";
import { google } from "googleapis";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_LOGIN_REDIRECT_URI || "http://localhost:5000/api/auth/google/callback"
);

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

// Initiate Login Flow
router.get("/google/login", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(url);
});

// OAuth Login Callback
router.get("/google/callback", async (req, res) => {
  const code = req.query.code as string;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();
    const { id, email, name, picture } = userInfo.data;

    if (!id || !email) {
      throw new Error("Missing required profile info from Google");
    }

    // Find or create user
    let user = await User.findOne({ googleId: id });
    if (!user) {
      user = new User({
        googleId: id,
        email: email,
        name: name || "Unknown User",
        avatarUrl: picture,
      });
      await user.save();
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_change_me_in_prod";
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?token=${token}`);
  } catch (error) {
    console.error("Auth callback error:", error);
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
});

// Verify token endpoint
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_change_me_in_prod";
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
