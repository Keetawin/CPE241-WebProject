import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBm_oZ1WLDdx760GGXgXaVErMU36XdxUw",
  authDomain: "evento-385505.firebaseapp.com",
  projectId: "evento-385505",
  storageBucket: "evento-385505.appspot.com",
  messagingSenderId: "376149182697",
  appId: "1:376149182697:web:e08d24d0d6da34a39f4878",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
