import * as firebase from "firebase";
import '@firebase/auth';
import '@firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyCyFM8N1XBSaPjZ1eNkoQ_G3AWAtF0iJXw",
    authDomain: "space-to-do.firebaseapp.com",
    databaseURL: "https://space-to-do.firebaseio.com",
    projectId: "space-to-do",
    storageBucket: "space-to-do.appspot.com",
    messagingSenderId: "1004724691500",
    appId: "1:1004724691500:web:7fad698876e16772b7a789",
    measurementId: "G-5HJRKJYZEL"
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
}

export { firebase }