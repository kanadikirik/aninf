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
    .then(doc => user = doc)
    .catch(err => console.error(err));
    return user;
  }

  static filter = async (filter, filterValue) => {
    let users = false;
    await User.collection().where(filter,'==',filterValue).get()
    .then(docs => users = docs.docs)
    .catch(err => console.error(err));
    return users;
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

  static paginate = async (startAfter, limit = 10) => {
    let users = false;
    let query;
    if(startAfter === 0) query = User.collection().orderBy('createdAt').limit(limit)
    else query = User.collection().orderBy('createdAt').startAfter(startAfter).limit(limit)
    await query.get()
    .then(docs => {
      if(docs.size > 0){
        users = docs.docs;
      } else {
        users = [];
      }
    })
    .catch(err => console.error(err));
    return users
  }

  static create = async (user) => {
    let newUser = false;
    const createdAt = new Date();
    const { displayName, email, photoURL } = user;
    await User.collection().doc(user.uid).set({
      displayName, email, photoURL, type: 1, createdAt
    })
    .then(() => newUser = true)
    .catch(err => console.error(err));
    return newUser;
  }

}