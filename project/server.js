const express = require("express");
const analysisRoutes = require("./routes/analysis");
const connectDB = require("./db");

const app = express();
app.use(express.json());
(async () => {
  await connectDB();  
  app.use("/api", analysisRoutes);

  app.listen(3000, () => {
    console.log("Node API running on http://localhost:3000");
  });
})();


