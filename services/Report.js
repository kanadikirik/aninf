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

}