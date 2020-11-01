const sodium = require('libsodium-wrappers')

module.exports = (key) => {
  if (typeof key === 'undefined') {
    throw "no key"
  }

  return Object.freeze({
    encrypt: (msg) => {
      let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      let ciphertext = sodium.crypto_secretbox_easy(msg, nonce, key);
      return { ciphertext, nonce };
    }
  });
}