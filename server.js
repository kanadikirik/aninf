const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const fs = require('fs');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { createSitemap } = require("./sitemap");

app.prepare().then(() => {
	const server = express();
	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({extended:true}));

	const options = {
		root: __dirname + '/static/',
		headers: {
			'Content-Type': 'text/plain;charset=UTF-8',
		}
	};

	server.get('/robots.txt', (req, res) => (
		res.status(200).sendFile('robots.txt', options)
	));

	server.get("/sitemap.xml", function(req, res) {
		res.header('Content-Type', 'application/xml');
		createSitemap(res);
	});

	server.get('/admin', (req, res) => {
		const mergedQuery = Object.assign({}, req.query, req.params);
		return app.render(req, res, '/Admin', mergedQuery);
	})

	server.get('/anlatim/:id', (req, res) => {
		const mergedQuery = Object.assign({}, req.query, req.params);
		return app.render(req, res, '/KnowledgePage', mergedQuery);
	})

	// server.post('/anlatim/search', (req, res) => {
	// 	const { filter } = req.query;
	// 	fs.readFile("./knowledges.json", (err, data) => {
	// 		if(err){
	// 			console.log(err);
	// 			res.sendStatus(500);
	// 		} else {
	// 			data = JSON.parse(data);
	// 			data.map(knowledge => {
	// 				console.log(knowledge, filter);
	// 			})
	// 		}
	// 	})
	// })

	server.post('/anlatim/create', (req, res) => {
		fs.readFile("./knowledges.json", (err, data) => {
			const id = req.body.knowledge.id;
			const knowledge = req.body.knowledge.data();
			data = JSON.parse(data);
			data[id] = knowledge;
			fs.writeFile("./knowledges.json", JSON.stringify(knowledge, null, 4), (err) => {
			})
		})
	})

	
	server.get('/etiket/:title', (req, res) => {
		const mergedQuery = Object.assign({}, req.query, req.params);
		return app.render(req, res, '/LabelPage', mergedQuery);
	})

	// This is the default route, don't edit this.
	server.get('*', (req, res) => {
		return handle(req, res);
	});


	const port = process.env.PORT || 3000;

	server.listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on port ${port}...`);
	});
}); 