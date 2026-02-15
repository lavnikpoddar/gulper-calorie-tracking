import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAKG5eLEF4x3FcH-GuKOLNYOq8HNBJT174",
    authDomain: "gulper-calorie-tracking.firebaseapp.com",
    projectId: "gulper-calorie-tracking",
    storageBucket: "gulper-calorie-tracking.firebasestorage.app",
    messagingSenderId: "49433036460",
    appId: "1:49433036460:web:dca30c900a62117b650109",
    measurementId: "G-KG61K6KFY1"
};

// Initialize Firebase (handle hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (handle hot reload — getFirestore if already initialized)
let db;
try {
    db = initializeFirestore(app, {});
} catch {
    db = getFirestore(app);
}

export { app, db };

