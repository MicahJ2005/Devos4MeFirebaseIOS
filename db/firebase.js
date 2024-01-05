import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {FB_API_KEY, FB_AUTH_DOMAIN, FB_PROJECT_ID, FB_STORAGE_BUCKET, FB_MESSAGING_SENDER_ID, FB_APP_ID, FB_MEASUREMENT_ID} from '@env';

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

const firebaseConfig  = {
    apiKey: FB_API_KEY,
    authDomain: FB_AUTH_DOMAIN,
    projectId: FB_PROJECT_ID,
    storageBucket: FB_STORAGE_BUCKET,
    messagingSenderId: FB_MESSAGING_SENDER_ID,
    appId: FB_APP_ID,
    measurementId: FB_MEASUREMENT_ID
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;