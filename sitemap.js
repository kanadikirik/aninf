const sm = require('sitemap');

const firebase = require('firebase');
const { firebaseConfig } = require('./config');
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : null;

const createSitemap = (res) => {
  let urlRoutes = [];
  let sitemap = sm.createSitemap({
    hostname: 'https://aninf.com',
    cacheTime: 60
  })

  firebase.firestore().collection("knowledges").get()
  .then(knowledges => {
    firebase.firestore().collection("labels").get()
    .then(labels => {
      labels.docs.map(label => {
        sitemap.add({
          url: `etiket/${label.data().title}`,
          changeFreq: 'daily',
          priority: 0.8
        })
      })
      knowledges.docs.map(knowledge => {
        sitemap.add({
          url: `anlatim/${knowledge.data().title.split(" ").join("-")}-${knowledge.id}`,
          changeFreq: 'daily',
          priority: 0.8
        })
      })
      res.send(sitemap.toString());
    })
  })
}

module.exports = { createSitemap }