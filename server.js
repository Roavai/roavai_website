require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Starting server...");

// ——————— CREDENTIALS LOADER  ———————
let credentials;

if (fs.existsSync(path.join(__dirname, "creds.json"))) {
  console.log("Using local creds.json (local development)");
  credentials = JSON.parse(
    fs.readFileSync(path.join(__dirname, "creds.json"), "utf8")
  );
} else {
  throw new Error("No credentials found anywhere!");
}

const SHEET_ID = credentials.sheet_id;
if (!SHEET_ID) throw new Error("Add 'sheet_id' to your creds.json!");

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

// ——————— ROUTE ———————
app.post("/save", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: { values: [[name, email, message]] },
    });
    res.json({ message: "Success!" });
  } catch (err) {
    console.error("Google Sheets error:", err.message);
    res.status(500).json({ error: "Failed", details: err.message });
  }
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server LIVE on port ${PORT}`);
});
