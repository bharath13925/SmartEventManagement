// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDV186t2ITefpa_Id4fp5Yz8dB8a1KKiSs",
  authDomain: "smart-event-management-f6b29.firebaseapp.com",
  projectId: "smart-event-management-f6b29",
  storageBucket: "smart-event-management-f6b29.firebasestorage.app",
  messagingSenderId: "1:237222998095:web:8f3db781fe3b461b8a7a3a",
  appId: "G-9D14XRRT7G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
