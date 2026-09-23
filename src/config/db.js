const mongoose = require('mongoose');
const { db, env } = require('./env');

async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('[db] Mongoose connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] Mongoose connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] Mongoose disconnected');
  });

  await mongoose.connect(db.uri, {
    // Modern mongoose (6+/8+) doesn't need useNewUrlParser/useUnifiedTopology,
    // they're defaults now — kept here as a comment for anyone coming from Mongoose 5.
  });

  if (env !== 'production') {
    mongoose.set('debug', true); // logs every query - dev only, useful while learning
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
