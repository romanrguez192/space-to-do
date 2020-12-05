import * as firebase from "firebase";
import '@firebase/auth';
import '@firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyCH18boiLMcrtxUoF0Qv8rO5sVYvlkpnJc",
  authDomain: "space-to-do-ihc.firebaseapp.com",
  projectId: "space-to-do-ihc",
  storageBucket: "space-to-do-ihc.appspot.com",
  messagingSenderId: "853717455324",
  appId: "1:853717455324:web:11cd9e129d825cec8b3f19",
  measurementId: "G-R46CDS746S"
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
}

export { firebase }