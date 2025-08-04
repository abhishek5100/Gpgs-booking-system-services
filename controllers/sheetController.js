const { GoogleSpreadsheet } = require('google-spreadsheet');

const addRowToSheet = async (req, res) => {
  try {
    const SHEET_ID = "1cWLYINmOLORpwMxZLFb1yJ8wZQ4-P2X455qIHzGGCsE";
    const doc = new GoogleSpreadsheet(SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    try {
      await sheet.loadHeaderRow();
    } catch (err) {
      console.warn('⚠️ No header row. Creating one.');
    }

    if (!sheet.headerValues || sheet.headerValues.length === 0) {
      const headers = Object.keys(req.body);
      await sheet.setHeaderRow(headers);
    }

    const missingKeys = Object.keys(req.body).filter(
      (key) => !sheet.headerValues.includes(key)
    );

    if (missingKeys.length > 0) {
      return res.status(400).json({
        error: `❌ These keys are not in the sheet header: ${missingKeys.join(', ')}`,
      });
    }

    await sheet.addRow(req.body);
    res.status(200).json({ message: '✅ Row added successfully' });

  } catch (error) {
    console.error('❌ Error adding row:', error);
    res.status(500).json({ error: 'Failed to add row to Google Sheet' });
  }
};

module.exports = {
  addRowToSheet,
};
