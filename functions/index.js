const firebase = require('./configs/firebase-config')

const functions = require("firebase-functions")
const admin = require('firebase-admin')
const md5 = require('md5')
const express = require('express')
const {createToken, createCustomer, createCard} = require('./library/stripe-api')
const { auth, firestore } = require('firebase-admin')
const { ResultStorage } = require('firebase-functions/v1/testLab')
const { user } = require('firebase-functions/v1/auth')
const { softEval } = require('../../../../../../Users/liu/Downloads/movie-recommendation/prediction')

// Configuration for url-encoded and path body parser...
express.json(true)
express.urlencoded(true)

// Configure the Firebase Admin...
admin.initializeApp();
const firestoreDB = admin.firestore();

const app = express()

// Configuration Firebase App...
// const firebaseApp = firebase.initializeApp(
//     functions.config().firebase
// )


// Functions of the request "GET" and "POST"

// Request GET for Demo //
// Test Response in http://localhost:5000/hello //

app.get('/hello', (req, res) => {
    res.send("Hello")
})

// Request POST for Signup with Email and Password // 
app.post('/signup', (req, res) => {
    const useremail = req.body.email
    const password = req.body.password
    const username = req.body.username
    
    firebase.auth().createUserWithEmailAndPassword(useremail, password).then(async (userCredential)=>{
        var user = userCredential.user;

        const userDocRef = firestoreDB.collection('users').doc(user.uid)
        await userDocRef.set({
            email: useremail,
            password: md5(password),
            username: username
        })
        
        res.send(user.uid)

    }).catch((error) => {
        res.send(error.message)
    })
})

app.post('/signin', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user
        res.send(user.uid)
    }).catch((error) => {
        res.send(error.message)
    })
})

app.post('/signinWithGoogle', (req, res) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        var credential = result.credential
        var token = credential.accessToken
        var user = result.user

        res.send(user);
    }).catch((error) => {
        var errorCode = error.code
        var errorMessage = error.message

        var email = error.email
        var credential = error.credential

        res.send(email);

    })
})

app.post('/forgotpassword', (req,res) => {
    const email = req.body.email
    if(email != null){
        firebase.auth().sendPasswordResetEmail(email).then(()=>{
            res.send("Sent Email to reset password")
        }).catch((error)=>{
            
            res.send(error.message)
        })
    }
    
})

app.post('/confirmpasswordreset', (req, res)=>{
    const actionCode = req.body.actionCode
    const newPassword = req.body.newPassword
    const confirmnewPassword = req.body.confirmnewPassword
    if (newPassword != null && newPassword === confirmnewPassword){
        firebase.auth().confirmPasswordReset(actionCode, newPassword).then((resp) => {
            res.send(resp.message);
        }).catch((error) => {
            res.send(error.message);
        })
    } else {
        res.send("Please check password again");
    }
})

app.post("/getAllStreamServices", async (req, res)=>{

    var result = {};

    const streamServicesRef = firestoreDB.collection("streaming_services");
    const streamServicesSnapShot = await streamServicesRef.get()
    await streamServicesSnapShot.forEach(async(streamServiceDoc) => {
        result[streamServiceDoc.id] = []
        result[streamServiceDoc.id].push(streamServiceDoc.data())
    })
    res.send(result)
})

app.get("/getAllGenres", async(req, res) => {
    var result = {}

    const streamServiceRef = firestoreDB.collection("genres")
    const streamServicesSnapShot = await streamServiceRef.get()
    await streamServicesSnapShot.forEach(async(streamServiceDoc) => {
        result[streamServiceDoc.id] = []
        result[streamServiceDoc.id].push(streamServiceDoc.data())
    })
    res.send(result)
})

app.post("/stripe/pay", async(req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var country = req.body.country;
    var cardNumber = req.body.cardnumber;
    var exp_month = req.body.exp_month;
    var exp_year = req.body.exp_year;
    var cvc = req.body.cvc;
    var zipCode = req.body.zipcode;
    var couponCode = req.body.couponcode;

    var token = await createToken(cardNumber, exp_month, exp_year, cvc, country, zipCode)
    var customer = await createCustomer(name, email, couponcode)
    var card = await createCard(customer.id, token.id)

    res.send(card)
})

app.post("/setMembership", async(req, res) => {
    var email = req.body.email
    var membership = req.body.membership
    var userid = await getUserIDByEmail(email)
    var userRef = firestoreDB.collection("users")
    userRef.doc(userId).set({membership: membership})
    res.send("Success")
})

async function getUserIDByEmail(email){
    var userId = ""
    var usersRef = firestoreDB.collection("users");
    const userSnapshot = await userRef.get()
    userRef.forEach(async(userDoc) => {
        userId = await userDoc.id
        var userData =  await userDoc.data()
        if(userData.email == email){
            break;
        }
    })
    return userId;
}

async function getRecommendations(){
    return await  softEval()
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);
