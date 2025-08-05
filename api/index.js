
// api/index.js
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const sheetRoutes = require('../routes/sheetRoutes');
const propertiesSheetRoutes = require('../routes/propertiesSheetRoutes');
const propertySheetRoutes = require('../routes/propertySheetRoutes');
const employeesRoutes = require('../routes/employeesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', sheetRoutes);
app.use('/api', propertiesSheetRoutes);
app.use('/api', propertySheetRoutes);
app.use('/api', employeesRoutes);


module.exports = app;
module.exports.handler = serverless(app);