import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8mZebQZiO4oHvpD9U41TH96QHDrrsroo",
  authDomain: "fir-a242d.firebaseapp.com",
  projectId: "fir-a242d",
  storageBucket: "fir-a242d.appspot.com",
  messagingSenderId: "116985266221",
  appId: "1:116985266221:web:4797473f6e54d8d14938a4",
};

//getting the firebase database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
