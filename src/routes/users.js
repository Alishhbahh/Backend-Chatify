var express = require('express');
var router = express.Router();
const { db } = require('../config/firebase');
const admin = require('firebase-admin');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signin', function(req, res, next) {
  res.send('signin');
});

router.post('/signup', async(req, res, next) => {
  const { email, password,name, phoneNo } = req.body;

  try {
    console.log("email",req.body)
    
   const user= await admin.auth().createUser({
      email,
      password,
      phoneNo,

    });
    await db.collection('users').doc(user.uid).set({
      name,
      phoneNo,
      email,
      password,
    });
    res.status(200).json({
      message: 'User created successfully',
    });
    console.log("user", user)
    // res.send(user);
  } catch (error) {
    console.log("err",error.message)
    res.status(500).json({
      message: error.message,
    });
  }
});


router.post('/login', async(req, res, next) => {
  const { email, password } = req.body;
  try {
    const user= await admin.auth().signInWithEmailAndPassword(email, password);
    // Return a success response
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        uid: user.uid,
        email: user.email,
        // Add any other user data you want to send to the client
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});



    




module.exports = router;
