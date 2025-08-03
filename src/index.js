"use strict";
const cors = require('cors');
app.use(cors());
// o, si necesitas configuraciones más específicas:
app.use(cors({
  origin: 'http://localhost:4200' // o '*'
}));