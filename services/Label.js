import firebase from './Firebase';

export class Label {
  static collection = () => { return firebase.firestore().collection("labels") }

  constructor(dbObject, knowledges){
    this.dbObject = dbObject;
    this.knowledges = knowledges;
  }

  static findByTitle = async (title) => {
    return new Promise((resolve, reject) => {
      Label.collection().where("title", "==", title).get()
      .then(refs => {
        refs.empty ? reject({status: "empty"}) : resolve(refs.docs[0])
      })
      .catch(err => reject(err));
    })
  }

  static create = async (title, knowledgeID) => {
    return new Promise((resolve, reject) => {
      const createdAt = new Date();
      const newLabel = { title, createdAt, knowledgeIDs: [knowledgeID], count: 1 };
      Label.collection().add(newLabel)
      .then(ref => {
        ref.get()
        .then(doc => resolve(doc))
        .catch(err => reject(err));
      })
      .catch(err => reject(err));
    })
  }

  static update = async (id, updation) => {
    return new Promise((resolve, reject) => {
      Label.collection().doc(id).update(updation)
      .then(_ => {
        Label.collection().doc(id).get()
        .then(doc => resolve(doc))
        .catch(err => reject(err));
      })
      .catch(err => reject(err));
    })
  }

  static addKnowledge = (title, knowledgeID) => {
    return new Promise((resolve, reject) => {
      Label.collection().where("title", "==", title).limit(1).get()
      .then(doc => {
        if(doc.empty){
          Label.create(title, knowledgeID)
          .then(doc => resolve(doc))
          .catch(err => reject(err))
        } else {
          Label.update(doc.docs[0].id, { 
            knowledgeIDs: firebase.firestore.FieldValue.arrayUnion(knowledgeID),
            count: doc.docs[0].data().count + 1
          })
          .then(doc => resolve(doc))
          .catch(err => reject(err))
        }
      }).catch(err => reject(err));
    })
  }

  static removeKnowledge = (labelID, knowledgeID, count) => {
    return new Promise((resolve, reject) => {
      Label.collection().doc(labelID).get()
      .then(label => {
        Label.update(labelID, {
          knowledgeIDs: firebase.firestore.FieldValue.arrayRemove(knowledgeID),
          count: label.data().count - 1
        })
          .then(doc => resolve(doc))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
    })
  }

  static getLabelsOfKnowledge = (knowledgeID) => {
    return new Promise((resolve, reject) => {
      Label.collection().where("knowledgeIDs", "array-contains", knowledgeID).get()
      .then(refs => resolve(refs.docs))
      .catch(err => reject(err));
    })
  }

  static getPopulars = () => {
    return new Promise((resolve, reject) => {
      Label.collection().orderBy("count", "desc").limit(10).get()
      .then(refs => resolve(refs.docs))
      .catch(err => reject(err));
    })
  }

}