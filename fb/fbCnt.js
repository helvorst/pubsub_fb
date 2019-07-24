const fb = require('firebase-admin');
const key = require("./key.json");
const {firebaseConfig} = require('./config');

fb.initializeApp({
  credential: fb.credential.cert(key),
  databaseURL: firebaseConfig.databaseURL
});

console.log(`fb initialized for project id: ${firebaseConfig.projectId}, databaseUrl: ${firebaseConfig.databaseURL}`);

module.exports.create = async function(col, data) {
    console.log(`adding new item to fb collection ${col}: ${data}`);
    try {
        await fb.firestore().collection(col).add(data);
    } catch(e) {
        console.error(e);
    }
    console.log('added fb item');
}
