const { MongoClient } = require('mongodb');
// Connection to database name
const url = 'mongodb://0.0.0.0:27017';
const dbName = 'globalhealth';
// Create a new MongoClient
const client = new MongoClient(url, {});
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
	.connect('mongodb://0.0.0.0:27017/globalhealth', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		family: 4,
	})
	.then(() => console.log("Database connected!"))
	.catch(err => console.log("Error while connecting to Db: ", err));
