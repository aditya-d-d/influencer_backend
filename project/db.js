const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://workXadi:aditya123@jobdata.0ijk5iq.mongodb.net/influencerAI?retryWrites=true&w=majority&appName=JobData", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", err => {
  console.error("❌ Mongoose runtime error:", err.message);
});

module.exports = connectDB;
