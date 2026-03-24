const firebaseConfig = {
  apiKey: "AIzaSyB7p3-1NepPCMjBudyEKd5ZRKmGxCCRSZI",
  authDomain: "shobhitnigamanchor.firebaseapp.com",
  projectId: "shobhitnigamanchor",
  storageBucket: "shobhitnigamanchor.firebasestorage.app",
  messagingSenderId: "574516796796821",
  appId: "1:574516796821:web:d6dbf6c0e317bbabf62a9c",
  measurementId: "G-NVEGJZWCRQ"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();