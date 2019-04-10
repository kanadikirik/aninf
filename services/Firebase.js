import app from 'firebase/app';
require('firebase/auth');
require('firebase/firestore');
let config = {
  apiKey: "AIzaSyDu0-sXbkauN6X5Yjw7yiH3PB3L_Dc_BJk",
  authDomain: "aninfdotcom.firebaseapp.com",
  databaseURL: "https://aninfdotcom.firebaseio.com",
  projectId: "aninfdotcom",
  storageBucket: "aninfdotcom.appspot.com",
  messagingSenderId: "936824385421"
};
!app.apps.length ? app.initializeApp(config) : null;
export default app;