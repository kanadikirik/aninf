import firebase from './Firebase';
import { User } from './User';

export class Knowledge {
  static collection = () => { return firebase.firestore().collection("knowledges") }

  constructor(dbObject, author){
    this.dbObject  = dbObject; 
    this.author    = author;
  }

  static build = async (knowledge) => {
    const author = await User.findByID(knowledge.data().author);
    if(author) return new Knowledge(knowledge, author);
    else return false;
  }

  static buildMultiple = async (knowledges) => {
    let buildedKnowledges = [];
    for(const knowledge of knowledges){
      const builded = await Knowledge.build(knowledge);
      if(builded) buildedKnowledges.push(builded);
      else return false;
    }
    return buildedKnowledges;
  }

  static findByID = async (id) => {
    let knowledge = false;
    await Knowledge.collection().doc(id).get()
    .then(doc => knowledge = Knowledge.build(doc))
    .catch(err => console.error(err));
    return knowledge;
  }

  static filter = async (filter, filterValue) => {
    let knowledge = false;
    await Knowledge.collection().where(filter,'==',filterValue).get()
    .then(async doc => knowledge = await Knowledge.buildMultiple(doc.docs))
    .catch(err => console.error(err));
    return knowledge;
  }

  static create = async (knowledge) => {
    let createdKnowledge = false;
    await Knowledge.collection().add(knowledge)
    .then(async ref => {
      await ref.get()
      .then(async doc => createdKnowledge = await Knowledge.build(doc))
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err))
    return createdKnowledge;
  }

  static getToday = async () => {
    let knowledges = false;
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    await Knowledge.collection().orderBy('createdAt', 'desc').startAt(date).endAt(today).get()
    .then(docs => {
      if(docs.size > 0){
        knowledges = Knowledge.buildMultiple(docs.docs);
      } else {
        knowledges = [];
      }
    })
    .catch(err => console.error(err));
    return knowledges;
  }

  static getThisWeek = async (startAfter) => {
    let knowledges = false;
    const date = new Date();
    if(startAfter === 0){
      startAfter = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    const previousWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate()-7);
    await Knowledge.collection().orderBy('createdAt',"desc").startAfter(startAfter).endAt(previousWeek).limit(10).get()
    .then(docs => {
     if(docs.size > 0){
       knowledges = Knowledge.buildMultiple(docs.docs);
     } else {
       knowledges = [];
     }
    })  
    .catch(err => console.error(err));
    return knowledges;
  }

  static paginate = async (startAfter, limit = 5) => {
    let knowledges = false;
    await Knowledge.collection().orderBy("createdAt","desc").startAfter(startAfter).limit(limit).get()
    .then(async docs => {
      if(docs.size > 0){
        console.log(docs.docs)
        knowledges = await Knowledge.buildMultiple(docs.docs);
      } else {
          knowledges = [];
      }
    })
    .catch(err => console.error(err));
    return knowledges;
  }

  static update = async (id, title, summary, source) => {
    let status = false;
    const updatedAt = new Date();
    await Knowledge.collection().doc(id).update({
      title, summary, source, updatedAt
    })
    .then(() => status = true)
    .catch((err) => console.error(err));
    return status
  }

  static delete = async (id) => {
    let status = false;
    await Knowledge.collection().doc(id).delete()
    .then(() => status = true)
    .catch(err => console.error(err));
    return status;
  }
}