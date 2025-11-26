// pages/api/save.js
import { google } from "googleapis";
import { Buffer } from "buffer";

// Load credentials from Vercel env var (base64 – never truncated)
function getCredentials() {
  if (!process.env.GOOGLE_CREDENTIALS_BASE64) {
    throw new Error(
      "Missing GOOGLE_CREDENTIALS_BASE64 in Vercel environment variables"
    );
  }
  const jsonString = Buffer.from(
    process.env.GOOGLE_CREDENTIALS_BASE64,
    "base64"
  ).toString();
  return JSON.parse(jsonString);
}

const credentials = getCredentials();
const SHEET_ID = credentials.sheet_id;

if (!SHEET_ID) {
  throw new Error("Add 'sheet_id' inside your credentials JSON!");
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[name, email, message]],
      },
    });

    res.status(200).json({ message: "Submitted successfully!" });
  } catch (error) {
    console.error("Google Sheets error:", error.message);
    res.status(500).json({ error: "Failed to save", details: error.message });
  }
}
