// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmgT5tpv5u6FVKczJbL570EX-tgSOjc44",
    authDomain: "off-my-chest.firebaseapp.com",
    projectId: "off-my-chest",
    storageBucket: "off-my-chest.appspot.com",
    messagingSenderId: "1087542841850",
    appId: "1:1087542841850:web:8f3b3d7e978bebad499443",
    measurementId: "G-GPC2R64T65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);