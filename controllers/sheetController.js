// const { GoogleSpreadsheet } = require('google-spreadsheet');

// const addRowToSheet = async (req, res) => {
//   try {
//     const SHEET_ID = "1cWLYINmOLORpwMxZLFb1yJ8wZQ4-P2X455qIHzGGCsE";
//     const doc = new GoogleSpreadsheet(SHEET_ID);

//     await doc.useServiceAccountAuth({
//       client_email: process.env.GOOGLE_CLIENT_EMAIL,
//       private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     });

//     await doc.loadInfo();
//     const sheet = doc.sheetsByIndex[0];

//     try {
//       await sheet.loadHeaderRow();
//     } catch (err) {
//       console.warn('⚠️ No header row. Creating one.');
//     }

//     if (!sheet.headerValues || sheet.headerValues.length === 0) {
//       const headers = Object.keys(req.body);
//       await sheet.setHeaderRow(headers);
//     }

//     const missingKeys = Object.keys(req.body).filter(
//       (key) => !sheet.headerValues.includes(key)
//     );

//     if (missingKeys.length > 0) {
//       return res.status(400).json({
//         error: `❌ These keys are not in the sheet header: ${missingKeys.join(', ')}`,
//       });
//     }

//     await sheet.addRow(req.body);
//     res.status(200).json({ message: '✅ Row added successfully' });

//   } catch (error) {
//     console.error('❌ Error adding row:', error);
//     res.status(500).json({ error: 'Failed to add row to Google Sheet' });
//   }
// };

// module.exports = {
//   addRowToSheet,
// };




// const { GoogleSpreadsheet } = require('google-spreadsheet');

// const addRowToSheet = async (req, res) => {
//   try {
//     const SHEET_ID = "1UpHDHfLp4kbjENM4RpnGTe4cRABSZmoS5tYSmi17Wxo";
//     const doc = new GoogleSpreadsheet(SHEET_ID);

//     await doc.useServiceAccountAuth({
//       client_email: process.env.GOOGLE_CLIENT_EMAIL,
//       private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     });

//     await doc.loadInfo();

//     // ✅ Pick sheet by title from query or body
//     const sheetTitle = req.query.sheet || "NewPayment"; 
//     const sheet = doc.sheetsByTitle[sheetTitle];

//     if (!sheet) {
//       return res.status(400).json({ error: `❌ Sheet with title "${sheetTitle}" not found` });
//     }

//     try {
//       await sheet.loadHeaderRow();
//     } catch (err) {
//       console.warn('⚠️ No header row. Creating one.');
//     }

//     if (!sheet.headerValues || sheet.headerValues.length === 0) {
//       const headers = Object.keys(req.body);
//       await sheet.setHeaderRow(headers);
//     }

//     const missingKeys = Object.keys(req.body).filter(
//       (key) => key !== "sheetTitle" && !sheet.headerValues.includes(key)
//     );

//     if (missingKeys.length > 0) {
//       return res.status(400).json({
//         error: `❌ These keys are not in the sheet header: ${missingKeys.join(', ')}`,
//       });
//     }

//     // ✅ Remove sheetTitle before inserting
//     const rowData = { ...req.body };
//     delete rowData.sheetTitle;

//     await sheet.addRow(rowData);

//     res.status(200).json({ message: `✅ Row added successfully to sheet "${sheetTitle}"` });

//   } catch (error) {
//     console.error('❌ Error adding row:', error);
//     res.status(500).json({ error: 'Failed to add row to Google Sheet' });
//   }
// };

// module.exports = {
//   addRowToSheet,
// };





const { GoogleSpreadsheet } = require('google-spreadsheet');

const addRowToSheet = async (req, res) => {
  try {
    const SHEET_ID = "1UpHDHfLp4kbjENM4RpnGTe4cRABSZmoS5tYSmi17Wxo";
    const doc = new GoogleSpreadsheet(SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    // ✅ Pick sheet by title from query or body
    const sheetTitle = req.query.sheet || "NewPayment"; 
    const sheet = doc.sheetsByTitle[sheetTitle];

    if (!sheet) {
      return res.status(400).json({ error: `❌ Sheet with title "${sheetTitle}" not found` });
    }

    try {
      await sheet.loadHeaderRow();
    } catch (err) {
      console.warn('⚠️ No header row. Creating one.');
    }

    if (!sheet.headerValues || sheet.headerValues.length === 0) {
      const headers = Object.keys(req.body);
      await sheet.setHeaderRow(headers);
    }

    // ✅ Keep only keys that exist in sheet headers
    const rowData = Object.keys(req.body).reduce((acc, key) => {
      if (key !== "sheetTitle" && sheet.headerValues.includes(key)) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    // ✅ Only insert if we have at least one valid key
    if (Object.keys(rowData).length === 0) {
      return res.status(400).json({
        error: "❌ No valid keys found in request body that match the sheet header",
      });
    }

    await sheet.addRow(rowData);

    res.status(200).json({ 
      message: `✅ Row added successfully to sheet "${sheetTitle}"`, 
      inserted: rowData 
    });

  } catch (error) {
    console.error('❌ Error adding row:', error);
    res.status(500).json({ error: 'Failed to add row to Google Sheet' });
  }
};

module.exports = {
  addRowToSheet,
};
