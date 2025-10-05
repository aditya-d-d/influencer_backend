const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    filename: String,
    status: {
      type: String,
      enum: ["queued", "active", "completed", "failed"],
      default: "queued",
    },
    result: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
