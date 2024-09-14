const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: "http://localhost:5173" // Your React app URL
}));

// Other middleware and route handlers
