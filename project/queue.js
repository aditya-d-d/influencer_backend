const { Queue } = require("bullmq");

const connection = { host: "127.0.0.1", port: 6379 };

const analysisQueue = new Queue("analysis-queue", { connection });

module.exports = { analysisQueue };
