const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { port } = require('./src/config/env');

let server;

async function start() {
  await connectDB();
  server = app.listen(port, () => {
    console.log(`[server] Listening on port ${port}`);
  });
}


process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received, shutting down gracefully');
  if (server) server.close(() => process.exit(0));
});

start();
