const express = require("express");
const analysisRoutes = require("./routes/analysis");
const connectDB = require("./db");

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
(async () => {
  await connectDB();  
  app.use("/api", analysisRoutes);

  app.listen(3000, () => {
    console.log("Node API running on http://localhost:3000");
  });
})();


