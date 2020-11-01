const sodium = require('libsodium-wrappers')
const decryptor = require("./Decryptor")
const encryptor = require("./Encryptor")

module.exports = async (peer) =>
{

  await sodium.ready;
  let keys = sodium.crypto_kx_keypair();
  let encrypter;
  let decrypter;
  let sharedKeys;
  let otherPeer = peer;
  let msgList = [];

  let initConnection = (_otherPeer) => {
    otherPeer = _otherPeer;
    sharedKeys = sodium.crypto_kx_server_session_keys(
      keys.publicKey,
      keys.privateKey,
      otherPeer.publicKey
    );
    initCrypto(sharedKeys.sharedTx, sharedKeys.sharedRx);
    otherPeer.connect(self); //connect otherPeer to current Peer
  };

  let initCrypto = async (encryptKey, decryptKey) => {
    encrypter = await encryptor(encryptKey);
    decrypter = await decryptor(decryptKey);
  };

 

    let self = Object.freeze(
          {
            publicKey: keys.publicKey,

            connect: async (connectedPeer) => {
              otherPeer = connectedPeer;
              sharedKeys = sodium.crypto_kx_client_session_keys(
                keys.publicKey,
                keys.privateKey,
                otherPeer.publicKey
              );
              initCrypto(sharedKeys.sharedTx, sharedKeys.sharedRx);
            },

            send: (msg) => {
              const encrypt = self.encrypt(msg);
              otherPeer.addToMsgQueue(encrypt);
            },

            receive: () => {
              if (msgList.length <= 0) throw "No new messages";
              const msgFromList = msgList.shift();
              const msg = self.decrypt(msgFromList.ciphertext, msgFromList.nonce);
              return msg;
            },

            encrypt: (msg) =>  encrypter.encrypt(msg),
              
            decrypt: (ciphertext, nonce) => decrypter.decrypt(ciphertext, nonce),
            
            addToMsgQueue: (msg) => msgList.push(msg),
          }
      ); 
      
      if (peer) initConnection(peer);
      
      return self;
};