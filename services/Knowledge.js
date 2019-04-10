import firebase from './Firebase';
import { User } from './User';
import { Label } from './Label';

export class Knowledge {
  static collection = () => { return firebase.firestore().collection("knowledges") }

  constructor(dbObject, author, labels){
    this.dbObject  = dbObject; 
    this.author    = author;
    this.labels    = labels;
  }

  static dbCreationObject = (title, summary, source, createdAt, author, labels) => {
    return { title, summary, source, createdAt, updatedAt: createdAt, author, labels };
  }

  static build = async (knowledge) => {
    const authorResp = User.findByID(knowledge.data().author);
    const labelsResp = Label.getLabelsOfKnowledge(knowledge.id);
    const author = await authorResp;
    const labels = await labelsResp;
    if(author && labels) return new Knowledge(knowledge, author, labels);
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
    .then(doc => {
      if(doc.exists){
        knowledge = Knowledge.build(doc)
      } else {
        knowledge = null;
      }
    })
    .catch(err => console.error(err));
    return knowledge;
  }

  static findByLabelQuery = (label, startAt) =>{
    if(startAt === 0){
      return Knowledge.collection().where("labels", "array-contains", label).orderBy("createdAt", "desc").limit(6).get();
    } else {
      return Knowledge.collection().where("labels", "array-contains", label).orderBy("createdAt", "desc").startAt(startAt).limit(6).get();
    }
  }

  static findByLabel = async (label, startAt = 0) => {
    return new Promise((resolve, reject) => {
      Knowledge.findByLabelQuery(label, startAt)      
      .then(async refs => {
        let startAtKnowledge = false;
        if(refs.size === 6){
          startAtKnowledge = refs.docs[refs.docs.length - 1];
        }
        const docs = [];
        refs.docs.map((doc, index) => { if(index !== 5) docs.push(doc) })
        const knowledges = await Knowledge.buildMultiple(docs);
        knowledges ? resolve({ knowledges, startAt: startAtKnowledge }) : reject({err: "build error"});
      })
      .catch(err => reject(err))
    })
  }

  static getAllQuery = (startAt) => {
    if(startAt === 0){
      return Knowledge.collection().orderBy("createdAt", "desc").limit(6).get();
    } else {
      return Knowledge.collection().orderBy("createdAt", "desc").startAt(startAt).limit(6).get();
    }
  }

  static getAll = async (startAt = 0) => {
    return new Promise((resolve, reject) => {
      Knowledge.getAllQuery(startAt)
      .then(async refs => {
        let startAtKnowledge = false;
        if(refs.size === 6){
          startAtKnowledge = refs.docs[refs.docs.length - 1];
        }
        const docs = [];
        refs.docs.map((doc, index) => { if(index !== 5) docs.push(doc) })
        const knowledges = await Knowledge.buildMultiple(docs);
        knowledges ? resolve({ knowledges, startAt: startAtKnowledge }) : reject({err: "build error"});
      })
      .catch(err => reject(err));
    })
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
      .then(async doc => {
        //Axios.post('/anlatim/create', {knowledge: doc});
        createdKnowledge = await Knowledge.build(doc)
      })
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err))
    return createdKnowledge;
  }

  
  static get = async (limit = 6) => {
    let knowledges = false;
    await Knowledge.collection().orderBy("createdAt", "desc").limit(limit).get()
    .then(async docs => {
      if(docs.empty){
        knowledges = [];
      } else {
        knowledges = await Knowledge.buildMultiple(docs.docs);
      }
    }).catch(err => console.error(err));
    return knowledges;
  }
  
  static paginate = async (startAfter, limit = 5) => {
    let knowledges = false;
    await Knowledge.collection().orderBy("createdAt","desc").startAfter(startAfter).limit(limit).get()
    .then(async docs => {
      if(docs.size > 0){
        knowledges = await Knowledge.buildMultiple(docs.docs);
      } else {
        knowledges = [];
      }
    }).catch(err => console.error(err));
    return knowledges;
  }

  static update = async (id, title, summary, source, labels) => {
    let updatedKnowledge = false;
    const updatedAt = new Date();
    await Knowledge.collection().doc(id).update({
      title, summary, source, updatedAt, labels
    })
    .then(async () => {
      await Knowledge.collection().doc(id).get()
      .then(async doc => updatedKnowledge = await Knowledge.build(doc))
      .catch(err => console.error(err))
    })
    .catch(err => console.error(err));
    return updatedKnowledge;
  }

  static delete = async (id) => {
    let status = false;
    await Knowledge.collection().doc(id).delete()
    .then(() => status = true)
    .catch(err => console.error(err));
    return status;
  }

  static try = async () => {
    await Knowledge.collection().get()
    .then(docs => {
      
    })
  }

}

