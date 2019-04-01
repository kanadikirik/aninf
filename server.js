const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { createSitemap } = require("./sitemap");

app.prepare().then(() => {
	const server = express();
	
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