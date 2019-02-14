import firebase from 'firebase';
let config = {
  apiKey: "AIzaSyAOvbVU6UBAIKqFhUSfkpO-eFPWAbvNF0A",
  authDomain: "ingilizcenitasarla.firebaseapp.com",
  databaseURL: "https://ingilizcenitasarla.firebaseio.com",
  projectId: "ingilizcenitasarla",
  storageBucket: "ingilizcenitasarla.appspot.com",
  messagingSenderId: "899393357066"
};
!firebase.apps.length ? firebase.initializeApp(config) : null;
export default firebase;