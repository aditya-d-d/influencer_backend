const express = require("express");
const multer = require("multer");
const { analysisQueue } = require("../queue");
const { Job } = require("bullmq");
const JobModel = require("../models/Job");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No video uploaded" });

  const job = await analysisQueue.add("analyze-video", {
    filename: req.file.originalname,
    buffer: req.file.buffer.toString("base64"),
  });

  // Save in Mongo
  // await JobModel.create({
  //   jobId: job.id,
  //   filename: req.file.originalname,
  //   status: "queued",
  // });

  res.json({ jobId: job.id, status: "queued" });
});

router.get("/jobs/:id", async (req, res) => {
  const job = await JobModel.findOne({ jobId: req.params.id });
  if (!job) return res.status(404).json({ error: "Job not found" });

  res.json({
    id: job.id,
    status: await job.getState(),
    result: job.returnvalue || null,
  });
});

module.exports = router;
