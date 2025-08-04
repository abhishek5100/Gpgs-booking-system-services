require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Route imports (make sure these exist and use Express.Router())
const sheetRoutes = require('../routes/sheetRoutes');
const propertiesSheetRoutes = require('../routes/propertiesSheetRoutes');
const propertySheetRoutes = require('../routes/propertySheetRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/', sheetRoutes);
app.use('/', propertiesSheetRoutes);
app.use('/', propertySheetRoutes);

// Export as serverless handler
module.exports.handler = serverless(app);
