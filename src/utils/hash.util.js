const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/env');

/**
 * Hashing (bcrypt): one-way. Used for passwords — we never need to
 * "get the password back", only verify a guess against the stored hash.
 */
async function hashPassword(plainText) {
  return bcrypt.hash(plainText, saltRounds);
}

async function comparePassword(plainText, hashed) {
  return bcrypt.compare(plainText, hashed);
}

module.exports = { hashPassword, comparePassword };
