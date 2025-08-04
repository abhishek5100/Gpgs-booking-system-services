require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sheetRoutes = require('./routes/sheetRoutes');
const propertiesSheetRoutes = require('./routes/propertiesSheetRoutes');
const propertySheetRoutes = require("./routes/propertySheetRoutes")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/', sheetRoutes);
app.use('/', propertiesSheetRoutes);
app.use('/', propertySheetRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
