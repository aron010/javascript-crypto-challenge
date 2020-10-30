const sodium = require('libsodium-wrappers')

module.exports = async () => {
  await sodium.ready;
  const { publicKey, privateKey } = sodium.crypto_sign_keypair();

  return Object.freeze({
    verifyingKey: publicKey,
    sign: (msg) => {
      return sodium.crypto_sign(msg, privateKey);
    }
  })
}