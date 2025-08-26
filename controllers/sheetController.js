



const { google } = require('googleapis');

const addRowToSheet = async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = "1UpHDHfLp4kbjENM4RpnGTe4cRABSZmoS5tYSmi17Wxo";
    const sheetTitle = req.query.sheet || "NewBooking";

    // 🔹 Get sheet metadata to get sheetId and headers
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = sheetMeta.data.sheets.find(s => s.properties.title === sheetTitle);
    if (!sheet) {
      return res.status(404).json({ error: `❌ Sheet titled "${sheetTitle}" not found.` });
    }
    const sheetId = sheet.properties.sheetId;

    // 🔹 Get header row (first row)
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!1:1`,
    });
    const headers = headerResponse.data.values?.[0] || [];

    if (headers.length === 0) {
      return res.status(400).json({ error: '❌ Header row is empty or missing.' });
    }

    // 1️⃣ Insert a new empty row at index 2
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: 1,
                endIndex: 2,
              },
              inheritFromBefore: false,
            },
          },
        ],
      },
    });

    // 2️⃣ Map request body to header columns
    const rowData = headers.map(header => req.body[header] ?? "");

    // 3️⃣ Update A2 row with the mapped data
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A2`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });

    res.status(200).json({
      message: `✅ Row inserted at top of sheet "${sheetTitle}" with header-mapped values`,
      inserted: rowData,
    });

  } catch (error) {
    console.error("❌ Error inserting row:", error);
    res.status(500).json({ error: 'Failed to insert row at top of sheet' });
  }
};

module.exports = {
  addRowToSheet,
};
