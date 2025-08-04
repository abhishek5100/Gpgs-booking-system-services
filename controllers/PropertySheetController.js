const { GoogleSpreadsheet } = require("google-spreadsheet");

const fetchPropertySheetData = async (req, res) => {
  const value = req.query.sheetId; // format: id,count
  const [spreadsheetId, bedCountStr] = value.split(",");
  const bedCount = parseInt(bedCountStr, 10);
 const sheetTitle = new Date().toLocaleString("en-US", {
  month: "short",
  year: "numeric",
}).replace(" ", "");

  if (!spreadsheetId || !sheetTitle || isNaN(bedCount)) {
    return res.status(400).json({ success: false, message: "Invalid or missing parameters" });
  }
  try {
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) {
      return res.status(404).json({ success: false, message: "Sheet not found" });
    }

    const rows = await sheet.getRows();
    const headers = sheet.headerValues.map(h => h.replace(/\n/g, ' ').trim());

    // ✅ Define the columns you want
    const selectedColumns = ['BedAvailable', "URHD", "URHA", "PRHD", "ACRoom ", "BedNo", "RoomNo", "DA", "MFR"];

    // ✅ Create a map from normalized to original header keys
    const headerMap = {};
    sheet.headerValues.forEach((original, index) => {
      const normalized = original.replace(/\n/g, ' ').trim();
      headerMap[normalized] = original;
    });

    // Convert selected columns to actual header keys in the raw data
    const actualKeys = selectedColumns.map(col => headerMap[col]);

    const data = rows
      .slice(0, bedCount)
      .map(row => {
        const rowData = {};
        actualKeys.forEach((key, index) => {
          const headerLabel = selectedColumns[index]; // "Sr No", "Bed Available"
          const headerIndex = sheet.headerValues.indexOf(key);
          rowData[headerLabel] = row._rawData[headerIndex] || "";
        });
        return rowData;
      })
      .filter(row => row["BedAvailable"]?.toLowerCase() === "yes");

    return res.json({ success: true, total: data.length, data: data });
  } catch (error) {
    console.error("❌ Error fetching sheet:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch sheet data" });
  }
};

module.exports = {
  fetchPropertySheetData,
};
