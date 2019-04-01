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
  .then(response => {
    urlRoutes = [...urlRoutes, ...response.docs]
    urlRoutes.map(item => {
      sitemap.add({
        url: `anlatim/${item.id}`,
        changeFreq: 'daily',
        priority: 0.8
      })
    })
    res.send(sitemap.toString());
  })
}

module.exports = { createSitemap }