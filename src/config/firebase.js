
const admin = require("firebase-admin");

const serviceAccount = require("./serviceaccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chatapp-3eef1-default-rtdb.firebaseio.com/"
});

const db = admin.firestore();
const rdb= admin.database();

module.exports = {
  db,
  rdb,
};


