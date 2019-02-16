import firebase from './Firebase';

export class Report {
  static collection = () => { return firebase.firestore().collection("reports") }

  constructor(id, description, reportedItem, createdAt, author){
    this.id           = id;
    this.reportedItem = reportedItem
    this.description  = description;
    this.createdAt    = createdAt;
    this.author       = author;
  }

  build = (report) => {
    const { id } = report;
    const { description, reportedItem, createdAt, author } = report.data();
    return new Report(id, description, reportedItem, createdAt, author);
  }

  static create = async (report) => {
    let status = false;
    await Report.collection().add(report)
    .then(() => status = true)
    .catch(err => console.error(err));
    return status;
  }

  static paginate = async (startAfter, limit = 10) => {
    let reports = false;
    let query;
    if(startAfter === 0) query = Report.collection().orderBy('createdAt').limit(limit)
    else query = Report.collection().orderBy('createdAt').startAfter(startAfter).limit(limit)
    await query.get()
    .then(docs => {
      if(docs.size > 0){
        reports = docs.docs;
      } else {
        reports = [];
      }
    })
    .catch(err => console.error(err));
    return reports
  }

}