// api/contact.js  ← this is the API route
const { google } = require("googleapis");

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message } = req.body;

  try {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: credentials.sheet_id,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[name, email, message]] },
    });

    res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const config = { api: { bodyParser: true } };
