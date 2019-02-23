import firebase from 'firebase';
let config = {
  apiKey: "AIzaSyDu0-sXbkauN6X5Yjw7yiH3PB3L_Dc_BJk",
  authDomain: "aninfdotcom.firebaseapp.com",
  databaseURL: "https://aninfdotcom.firebaseio.com",
  projectId: "aninfdotcom",
  storageBucket: "aninfdotcom.appspot.com",
  messagingSenderId: "936824385421"
};
!firebase.apps.length ? firebase.initializeApp(config) : null;
export default firebase;