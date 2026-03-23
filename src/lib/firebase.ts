import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGW3kSWIJr9rFfAjekQZl6qXKnsXPAtEc",
  authDomain: "sponsorai-894f3.firebaseapp.com",
  projectId: "sponsorai-894f3",
  storageBucket: "sponsorai-894f3.firebasestorage.app",
  messagingSenderId: "27324660265",
  appId: "1:27324660265:web:ed392dd935666616153a38",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

