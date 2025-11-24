// const express = require("express");
// const cors = require("cors");
// const ExcelJS = require("exceljs");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // API to save data in Excel
// app.post("/save", async (req, res) => {
//   const { name, email, message } = req.body;

//   const workbook = new ExcelJS.Workbook();
//   const filePath = "./contact-data.xlsx";

//   // If file exists load it else create new
//   try {
//     await workbook.xlsx.readFile(filePath);
//   } catch (err) {
//     workbook.addWorksheet("Contacts");
//   }

//   const sheet = workbook.getWorksheet("Contacts") ||
//                 workbook.addWorksheet("Contacts");

//   // Header only once
//   if (sheet.rowCount === 0) {
//     sheet.addRow(["Name", "Email", "Message"]);
//   }

//   // Add new row
//   sheet.addRow([name, email, message]);

//   await workbook.xlsx.writeFile(filePath);

//   res.json({ message: "Form submitted successfully!" });
// });

// // Start server
// app.listen(5000, () => console.log("Server running on port 5000"));

//----------------------------------------------------------------------------------------------------

// server.js
// const express = require('express');
// const cors = require('cors');
// const { google } = require('googleapis');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ----- CONFIG -----
// // Path to the service account JSON key
// const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// // The ID of your spreadsheet (from URL)
// const SPREADSHEET_ID = 'https://docs.google.com/spreadsheets/d/1L7BeSirggeYZ9f_Nint2zvY_K5YorZ6e331oyvZXWDU/edit?gid=0#gid=0'; // <-- put your sheet id here

// // The sheet name (tab) to append to (e.g., "Sheet1" or "Contacts")
// const SHEET_NAME = 'Contact_Data'; // change to your sheet tab name if needed

// // Load credentials
// if (!fs.existsSync(CREDENTIALS_PATH)) {
//   console.error('Missing credentials.json. Put your service account JSON at:', CREDENTIALS_PATH);
//   process.exit(1);
// }
// const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

// // Create JWT client
// const jwtClient = new google.auth.JWT(
//   credentials.client_email,
//   null,
//   credentials.private_key,
//   ['https://www.googleapis.com/auth/spreadsheets'] // scopes
// );

// // Create sheets API instance
// const sheets = google.sheets({ version: 'v4', auth: jwtClient });

// // Ensure the JWT is authorized before starting server (optional but helpful)
// async function authorize() {
//   await jwtClient.authorize();
//   console.log('Google service account authorized.');
// }

// app.post('/save', async (req, res) => {
//   try {
//     const { name, email, message } = req.body;
//     if (!name || !email || !message) {
//       return res.status(400).json({ message: 'Name, email and message are required.' });
//     }

//     // prepare row values
//     const now = new Date().toLocaleString();
//     const values = [[name, email, message, now]];

//     // append row
//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId: SPREADSHEET_ID,
//       range: `${SHEET_NAME}!A:D`, // columns to append into
//       valueInputOption: 'USER_ENTERED',
//       insertDataOption: 'INSERT_ROWS',
//       requestBody: {
//         values
//       }
//     });

//     res.json({ message: 'Form submitted successfully!' });
//   } catch (err) {
//     console.error('Error saving to sheet:', err);
//     res.status(500).json({ message: 'Server error saving to Google Sheet.' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// authorize().then(() => {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }).catch(err => {
//   console.error('Authorization failed:', err);
//   process.exit(1);
// });

const { google } = require("googleapis");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Load credentials JSON using environment variable
const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;

// Load credentials JSON
if (!CREDENTIALS_PATH) {
  console.error(
    "Missing CREDENTIALS_PATH environment variable. Set it to your service account JSON file path."
  );
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH, // your JSON file
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SHEET_ID = "1L7BeSirggeYZ9f_Nint2zvY_K5YorZ6e331oyvZXWDU";

app.post("/save", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,

      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[name, email, message]],
      },
    });

    res.json({ message: "Submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving data" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
