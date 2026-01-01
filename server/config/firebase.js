
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDw52g0658t1LeIuAgOQqMucLdIKuTM_WY",
    authDomain: "student-e38ed.firebaseapp.com",
    projectId: "student-e38ed",
    storageBucket: "student-e38ed.firebasestorage.app",
    messagingSenderId: "1004962583250",
    appId: "1:1004962583250:web:dca08a01fcf5817c34530b",
    measurementId: "G-44HV8XHH27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
