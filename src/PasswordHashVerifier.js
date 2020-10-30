const sodium = require('libsodium-wrappers')

module.exports = () => {

  return Object.freeze({
    verify: (hashedPassword, password) => {
      return sodium.crypto_pwhash_str_verify(hashedPassword, password);
    }
  })
}