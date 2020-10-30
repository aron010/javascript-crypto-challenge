const sodium = require('libsodium-wrappers')
const decryptor = require("./Decryptor")
const encryptor = require("./Encryptor")

module.exports = async() =>
{

  await sodium.ready;
  const { publicKey, privateKey } = sodium.crypto_sign_keypair();
  let key = sodium.crypto_secretbox_keygen();
  let encrypter = encryptor(key);
  let decrypter = decryptor(key);
    return Object.freeze(
        {
            publicKey: publicKey,
            sendMessage: null,
           
            send: (peerMsg) => {
              this.sendMessage = peerMsg;
            },

            receive: () => {
              return this.sendMessage;
            },

            encrypt: (msg) => {
              const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
              const ciphertext = encrypter.encrypt(msg, nonce);
              return { ciphertext, nonce };
            },
            
            decrypt: (ciphertext, nonce) => {
             return decrypter.decrypt(ciphertext, nonce)
            },
          }
      );
}