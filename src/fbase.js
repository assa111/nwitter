 // Firebase App (the core Firebase SDK) is always required and must be listed first
import  firebase from "firebase/app"; 
import "firebase/auth";
import "firebase/firestore";
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey:process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STRAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID
  };
  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 
 export const firebaseInstance = firebase;
 export const authService = firebase.auth();
 export const dbService = firebase.firestore();