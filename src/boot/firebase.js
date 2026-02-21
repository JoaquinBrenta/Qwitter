import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
   apiKey: "AIzaSyCclGaY1vsDGbmk0Hgk-N8uCw6rULyljbU",

  authDomain: "qwitter-2ee61.firebaseapp.com",

  projectId: "qwitter-2ee61",

  storageBucket: "qwitter-2ee61.firebasestorage.app",

  messagingSenderId: "615393840308",

  appId: "1:615393840308:web:d3f78b225dac348fce5be1"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db