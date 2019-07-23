const fb = require('firebase-admin');
var serviceAccount = require("./f1-yt-309bd-firebase-adminsdk-zt8ca-3fdc7bcc59.json");

fb.initializeApp({
  credential: fb.credential.cert(serviceAccount),
  databaseURL: "https://f1-yt-309bd.firebaseio.com"
});

module.exports.create = async function(col, data) {
    console.log(`adding new item to fb collection ${col}: ${data}`);
    try {
        await fb.firestore().collection(col).add(data);
    } catch(e) {
        console.error(e);
    }
    console.log('added fb item');
}
