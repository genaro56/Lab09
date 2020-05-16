const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const { Bookmarks } = require("./models/bookmarksModel");
const {DATABASE_URL, PORT} = require( './config' );

/* middleware */
const validateToken = require('./middleware/validateToken');
const validatePatch = require('./middleware/validatePatch');
const cors = require( './middleware/cors' );

app.use(cors);
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(validateToken);

/**
 * id: uuid.v4(),
	title: string,
	description: string,
	url: string,
	rating: number
 */

app.get('/bookmarks', validateToken, (req, res) => {
	console.log('%c getting list of bookmarks', 'background: #332167; color: #B3D1F6; font-size: 16px');
	Bookmarks.getAllBookmarks()
		.then(allBookmarks => { return res.status(200).json(allBookmarks); })
		.catch(err => {
			res.statusMessage = err;
			return res.status(500).end();
		});
});

app.get('/bookmark', validateToken, (req, res) => {
	console.log('Getting boomark by title');
	console.log(req.query.title);
	let queryTitle = req.query.title;
	if (!queryTitle) {
		res.statusMessage = 'The param title is required.';
		return res.status(406).end();
	};
	// let result = bookmarksList.filter((bookmark) => bookmark.title == queryTitle);
	Bookmarks.getBookmarkByTitle(queryTitle)
		.then(bookmarks => {
			if (bookmarks.length < 1) {
				res.statusMessage = `The title ${queryTitle} does not exist`;
				return res.status(404).end();
			}
			return res.status(200).json(bookmarks);
		}).catch(err => {
			res.statusMessage = err;
			return res.status(500).end();
		})
});

app.post('/bookmarks', [jsonParser, validateToken], (req, res) => {
	console.log('Adding a bookmark');
	console.log('body', req.body);
	const { title, description, url, rating } = req.body;
	if (!title ||
		!description ||
		!rating ||
		!url
	) {
		res.statusMessage = "One of the parameters is missing";
		return res.status(406).end();
	}
	if (typeof (rating) !== "number") {
		res.statusMessage = "The rating must be a number";
		return res.status(406).end();
	}
	let newBookmark = { id: uuid.v4(), title, description, rating, url };
	Bookmarks
		.createBookmark(newBookmark)
		.then(result => {
			if (result.errmsg) {
				res.statusMessage = "the id already exists "
					+ result.errmsg;
				return res.status(409).end();
			}
			return res.status(201).json(result);
		})
		.catch(err => {
			res.statusMessage = err;
			return res.status(500).end();
		})
});

app.patch('/bookmark/:id', [jsonParser, validatePatch, validateToken], (req, res) => {
	let id = req.params.id;
	const { rating } = req.body;

	if (Object.keys(req.body).length < 2) {
		res.statusMessage = "Please provide at least one parameter and an id to update the object";
		return res.status(406).end();
	} else if (rating && typeof (rating) !== "number") {
		res.statusMessage = "The rating must be a number";
		return res.status(406).end();
	}
	console.log("BODY:", req.body);
	Bookmarks.updateBookmark(id, req.body)
		.then(result => {
			console.log("Results:", result);
			if (result.nModified == 0 && result.n === 1) {
				res.statusMessage = "The values are the same.";
				return res.status(406).end();
			} else if (result.nModified == 0 && result.n === 0) {
				res.statusMessage = "The bookmark does not exist in the database.";
				return res.status(406).end();
			}
			return res.status(202).json(result);
		}).catch(err => {
			res.statusMessage = "Something went wrong, please try again: " + err;
			return res.status(500).end();
		})
})

app.delete('/bookmark/:id', validateToken, (req, res) => {
	let id = req.params.id;
	console.log(id)
	if (!id) {
		res.statusMessage = "The id must be sent as a parameter"
		res.status(406).end();
	}

	// let index = bookmarksList.findIndex(bookmark => {
	// 	if (bookmark.id == id) {
	// 		return true;
	// 	}
	// });
	Bookmarks.deleteBookmark(id)
		.then(result => {
			console.log(result)
			if (result.deletedCount === 0) {
				res.statusMessage = "The id sent was not found in the existing bookmarks."
				return res.status(400).end();
			}
			return res.status(204).end();
		}).catch(err => {
			res.statusMessage = "The id sent was not found in the existing bookmarks."
				+ err;
			return res.status(400).end();
		});
})

app.listen(PORT, () => {
	console.log('this server is running in port 8080.');
	new Promise((resolve, reject) => {
		const settings = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		}
		mongoose.connect(
			DATABASE_URL,
			settings,
			(err) => {
				if (err) {
					return reject(err);
				} else {
					console.log("Database connected successfully");
					return resolve();
				}
			}
		);
	}).catch(err => {
		console.log(err);
	});
});
