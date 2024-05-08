const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const initRouter = require("./routes/initialroutes");
dotenv.config();
app.use(cors());
// Middleware to serve static files
app.use(express.static("public"));

app.use('/', initRouter)
// Start the server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
