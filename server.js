//Initialize Express, body-parser, mongodb, socket.io for the good.
const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

var http = require("http").Server(app)
var io = require("socket.io")(http)

app.use(bodyParser.urlencoded({extended: true}));

var db;
var collectionName="gossipstore";


//Process the get request for the root directory and display the user records.
app.get('/', (req, res) => {
	db.collection(collectionName).find().toArray((err, result) => {
		if (err) return console.log(err)
		// Render index.ejs with our gossip people values.
		res.render('index.ejs', {people: result})
	})
})

//Process the post request and insert the record in mongodb
app.post('/gossipstore', (req, res) => {
	db.collection(collectionName).save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('Values saved to database')
		res.redirect('/')
	})
})

//Process post request and update the record in mongodb based on the email id.
app.post('/gossipupdate', (req, res) => {
	var emailSearch = { emailId: req.body.emailId };
	var newValues = { $set: req.body };
	db.collection(collectionName).updateOne(emailSearch, newValues, (err, result) => {
		if (err) return console.log(err)
		console.log('Values updated to database')
		res.redirect('/')
	})
})


//connects to the mongodb replication instances in order to use changestream API
MongoClient.connect('mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=mongo-repl', (err, client) => {
	if (err) return console.log(err)
		db = client.db('gossipgirl') // setting up the db

		//start watching for the changes to the collection
		const changeStream = db.collection(collectionName).watch();
		// start listening to database changes
		changeStream.on("change", function(change) {
		console.log(change)
		console.log(change.operationType)
			if(change.operationType==='update'){
				obj = change.updateDescription.updatedFields;
				for (var key in change.updateDescription.updatedFields) {
					if (typeof obj[key] === "object") {
						console.log(change.documentKey._id+key)
						io.emit(change.documentKey._id+key, change) 
						io.emit("everyone"+key, change)
						io.emit(change.documentKey._id+"everything", change) 
						io.emit("everyone"+"everything", change) 
					} else {
						console.log(change.documentKey._id+key)
						io.emit(change.documentKey._id+key, change) 
						io.emit("everyone"+key, change)
						io.emit(change.documentKey._id+"everything", change) 
						io.emit("everyone"+"everything", change) 
					}
				}
			}
		});

		//socket connection log out
		io.on("connection", (socket) => {
		console.log("Socket is connected...")
		})

		//if everything is good, start the server up and listen to port 3000
		var server = http.listen(3000, () => {
		console.log("Alrighty, I am listening on ", server.address().port)
		})
})
