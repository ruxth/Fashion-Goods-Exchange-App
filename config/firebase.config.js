import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  browserLocalPersistence,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrJEZB_-ed8ikv35XMAr1ayy2Xtqcz--0",
  authDomain: "final-year-project-a6ba8.firebaseapp.com",
  databaseURL:
    "https://final-year-project-a6ba8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "final-year-project-a6ba8",
  storageBucket: "final-year-project-a6ba8.appspot.com",
  messagingSenderId: "362849549997",
  appId: "1:362849549997:web:c148762649e122aeb25024",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

// const auth = initializeAuth(app, {
//   persistence: browserLocalPersistence,
//   dataConverter: {},
// });

const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);
const storage = getStorage(app);

export { app, firebaseAuth, firestoreDB, storage };
