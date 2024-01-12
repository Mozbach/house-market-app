import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv5yCiORJwb5qa0KQv5jrNP-D_9-vxaJg",
  authDomain: "house-marketplace-app-carsten.firebaseapp.com",
  projectId: "house-marketplace-app-carsten",
  storageBucket: "house-marketplace-app-carsten.appspot.com",
  messagingSenderId: "495392231086",
  appId: "1:495392231086:web:b3ae2957b9025d230ce73f"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();

