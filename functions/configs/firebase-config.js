const firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyBL4KwUWRBQUBqeiiHAqm223lnbhdAB8rY",
    authDomain: "popcorn-6206c.firebaseapp.com",
    projectId: "popcorn-6206c",
    storageBucket: "popcorn-6206c.appspot.com",
    messagingSenderId: "1097024982908",
    appId: "1:1097024982908:web:b58527a2011d6dac3b1ef9",
    measurementId: "G-33RE12DV8R"
  };
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  } else {
      firebase.app(firebaseConfig);
  }
  

  module.exports = firebase;