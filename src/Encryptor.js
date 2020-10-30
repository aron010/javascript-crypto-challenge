const sodium = require('libsodium-wrappers')

module.exports = (key) => {
  if (typeof key === 'undefined') {
    throw "no key"
  }

  return Object.freeze({
    encrypt: (msg, nonce) => {
    // let key = sodium.crypto_secretbox_keygen();
    return sodium.crypto_secretbox_easy(msg, nonce, key);
    }
  });
}