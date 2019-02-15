import firebase from './Firebase';

export class User {

  static collection = () => { return firebase.firestore().collection("users") }
  static provider = () => { return new firebase.auth.GoogleAuthProvider() }

  constructor(id, displayName, email, photoURL, type){
    this.id           = id;
    this.displayName  = displayName;
    this.email        = email;
    this.photoURL     = photoURL;
    this.type         = type
  }

  static build = (user) => {
    const { id } = user;
    const { displayName, email, photoURL, type } = user.data();
    return new User(id, displayName, email, photoURL, type);
  }

  static checkCurrent = (callback) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if(user){
        const currentUser = await User.findByID(user.uid);
        callback(currentUser);
      } else {
        callback(false);
      }
    })
  }

  static findByID = async (id) => {
    let user = false;
    await User.collection().doc(id).get()
    .then(doc => user = User.build(doc))
    .catch(err => console.error(err));
    return user;
  }

  static signIn = async () => {
    let user = false;
    await firebase.auth().signInWithPopup(User.provider())
    .then(async result => {
      // if user's first login then create new user and then get it from database
      if(result.additionalUserInfo.isNewUser){
        user = await User.create(result.user);
        if(user){
          user = await User.findByID(result.user.uid);
        }
      } else {
        user = await User.findByID(result.user.uid);
      }
    })
    .catch(err => console.error(err));
    return user;
  }

  static signOut = async () => {
    let status = true;
    await firebase.auth().signOut()
    .catch(err => { status = false; console.error(err) });
    return status;
  }

  static create = async (user) => {
    let newUser = false;
    const { displayName, email, photoURL } = user;
    await User.collection().doc(user.uid).set({
      displayName, email, photoURL, type: 1
    })
    .then(() => newUser = true)
    .catch(err => console.error(err));
    return newUser;
  }

}