import firebase from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/compat/auth";
import Timestamp from "firebase/compat/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5AxHPJgEjL2YCIKm7DKulCg6U9NACqUQ",
  authDomain: "probando-f66c2.firebaseapp.com",
  projectId: "probando-f66c2",
  storageBucket: "probando-f66c2.appspot.com",
  messagingSenderId: "286784378045",
  appId: "1:286784378045:web:b5fe206480b2e630b993d4",
  measurementId: "G-YCVQSFG1NP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = app.auth();
const marcaTiempo = firebase.firestore.FieldValue.serverTimestamp;

const analytics = getAnalytics(app);
firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
export{db, auth, marcaTiempo, firebase,analytics};
export default firebase.firestore();
