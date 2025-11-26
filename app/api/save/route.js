import { google } from "googleapis";
import { NextResponse } from "next/server";

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString()
);
const SHEET_ID = credentials.sheet_id;

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: { values: [[name, email, message]] },
    });

    return NextResponse.json({ message: "Submitted successfully!" });
  } catch (error) {
    console.error("Sheets error:", error);
    return NextResponse.json(
      { error: "Failed to save", details: error.message },
      { status: 500 }
    );
  }
}
