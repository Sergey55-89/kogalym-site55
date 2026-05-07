
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const firebaseConfig={apiKey:"AIzaSyA_Y0BsSrcgxvSExq1oH30_zMR-sjXI71I",authDomain:"kogalym-site.firebaseapp.com",projectId:"kogalym-site",storageBucket:"kogalym-site.firebasestorage.app",messagingSenderId:"859257999395",appId:"1:859257999395:web:8f048a2ced0e9f9f796196",measurementId:"G-KDR1BLZT5R"};
export const app=initializeApp(firebaseConfig);export const auth=getAuth(app);export const db=getFirestore(app);
export {signInWithEmailAndPassword,signOut,onAuthStateChanged,collection,addDoc,updateDoc,deleteDoc,doc,getDoc,onSnapshot,query,orderBy,serverTimestamp};
