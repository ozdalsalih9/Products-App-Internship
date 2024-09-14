import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBkx47HuDJ3xx5vnvc_w2WxcvMiRsRGVQY",
  authDomain: "productsapp-cd6e8.firebaseapp.com",
  projectId: "productsapp-cd6e8",
  storageBucket: "productsapp-cd6e8.appspot.com",
  messagingSenderId: "707174869945",
  appId: "1:707174869945:web:41d0e658cffe7aaca1a468"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);