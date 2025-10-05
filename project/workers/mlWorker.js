const cluster = require("cluster");
const os = require("os");
const { Worker } = require("bullmq");
const axios = require("axios");
const FormData = require("form-data");

const numCPUs = os.cpus().length;
const connection = { host: "127.0.0.1", port: 6379 };

if (cluster.isMaster) {
  console.log(` Master started. Spawning ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const worker = new Worker(
    "analysis-queue",
    async (job) => {
      console.log(`Worker ${process.pid} processing job ${job.id}...`);

      const buffer = Buffer.from(job.data.buffer, "base64");

      const formData = new FormData();
      formData.append("video", buffer, { filename: job.data.filename });

      const response = await axios.post("http://127.0.0.1:5000/infer", formData, {
        headers: formData.getHeaders(),
      });

      return response.data;
    },
    { connection }
  );

  worker.on("completed", (job, result) => {
    console.log(`✅ Job ${job.id} completed by worker ${process.pid}:`, result);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed by worker ${process.pid}: ${err.message}`);
  });
}
