import firebase from 'firebase/app';
import 'firebase/firestore';


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDuITtAAMi3rGJVm8os8ZCG4cX8HFA3txM",
    authDomain: "runalytical.firebaseapp.com",
    databaseURL: "https://runalytical.firebaseio.com",
    projectId: "runalytical",
    storageBucket: "runalytical.appspot.com",
    messagingSenderId: "354712551975",
    appId: "1:354712551975:web:d15fcf24d96bff0a7b0402",
    measurementId: "G-99LPP2L96J"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  export default firebase;