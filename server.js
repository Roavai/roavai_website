// server.js — ONLY for local development
require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

let credentials;
if (fs.existsSync("creds.json")) {
  credentials = JSON.parse(fs.readFileSync("creds.json", "utf8"));
} else {
  console.error("creds.json not found! Teammates: place it in project root.");
  process.exit(1);
}

const SHEET_ID = credentials.sheet_id;
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

app.post("/save", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: { values: [[name, email, message]] },
    });
    res.json({ message: "Submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5010, () =>
  console.log("Local backend running → http://localhost:5010")
);
