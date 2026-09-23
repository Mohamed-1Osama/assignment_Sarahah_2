const CryptoJS = require('crypto-js');
const { encryptionKey } = require('../config/env');


function encrypt(plainText) {
  if (plainText === undefined || plainText === null) return plainText;
  return CryptoJS.AES.encrypt(String(plainText), encryptionKey).toString();
}

function decrypt(cipherText) {
  if (!cipherText) return cipherText;
  const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };
