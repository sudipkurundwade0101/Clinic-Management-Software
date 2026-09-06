import { Router } from "express";
import { google } from "googleapis";
import { Settings } from "../models/Settings.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/calendar/auth/google/callback"
);

// Scopes for Google Calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
];

// 1. Initiate OAuth Flow
router.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(url);
});

// 2. OAuth Callback
router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code as string;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens to DB
    await Settings.findOneAndUpdate(
      { id: "default_settings" },
      { googleCalendarTokens: tokens },
      { upsert: true, new: true }
    );

    // Redirect to frontend (assumed React app runs on port 5173 or similar)
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/appointments?status=success`);
  } catch (error) {
    console.error("Error retrieving access token", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/appointments?status=error`);
  }
});

// 3. Check connection status
router.get("/status", async (req, res) => {
  try {
    const settings = await Settings.findOne({ id: "default_settings" });
    if (settings && settings.googleCalendarTokens) {
      res.json({ connected: true });
    } else {
      res.json({ connected: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to check status" });
  }
});

// Helper to get authenticated client
export const getCalendarClient = async () => {
  const settings = await Settings.findOne({ id: "default_settings" });
  if (!settings || !settings.googleCalendarTokens) {
    throw new Error("Google Calendar not connected");
  }

  oauth2Client.setCredentials(settings.googleCalendarTokens as any);
  return google.calendar({ version: "v3", auth: oauth2Client });
};

// 4. Get Events
router.get("/events", async (req, res) => {
  try {
    const calendar = await getCalendarClient();
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.json(response.data.items);
  } catch (error: any) {
    console.error("Error fetching events", error);
    res.status(500).json({ error: error.message || "Failed to fetch events" });
  }
});

// 5. Create Event (Follow-up)
router.post("/events", async (req, res) => {
  try {
    const { summary, description, startTime, endTime } = req.body;
    const calendar = await getCalendarClient();

    const event = {
      summary,
      description,
      start: {
        dateTime: startTime,
      },
      end: {
        dateTime: endTime,
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error creating event", error);
    res.status(500).json({ error: error.message || "Failed to create event" });
  }
});

export default router;
