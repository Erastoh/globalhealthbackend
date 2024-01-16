const express = require('express');
const router = express.Router();
const app = express();
const port = 3000;
app.use(express.json());
const { MongoClient } = require('mongodb');
// Connection to database name
const url = 'mongodb://0.0.0.0:27017';
const dbName = 'globalhealth';
// Create a new MongoClient
const client = new MongoClient(url, {});
const mongoose = require('mongoose');
const User = require('./Usermodel'); // Assuming the schema is in a separate file
// Connect to MongoDB
mongoose
	.connect('mongodb://0.0.0.0:27017/globalhealth', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		family: 4,
	})
	.then(() => console.log("Database connected!"))
	.catch(err => console.log("Error while connecting to Db: ", err));

// route  to test the if server is working
app.get('/', (req, res) => {
	res.send('Hello, Express!');
});

// function to start the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

// Endpoint: /api/health - to print server is healthy
app.get('/api/health', (req, res) => {
	res.json({ message: 'Server is healthy' });
});

// timestamp and requested endpoint middleware
app.use((req, res, next) => {
	const timestamp = new Date().toLocaleString();
	const endpoint = req.url;

	console.log(`[${timestamp}] Requested endpoint: ${endpoint}`);

	// Continue to next middleware || route handler
	next();
});

// Function for connecting to the server
client.connect()
	.then(() => {
		console.log('Connected to MongoDB');

		// Use the database
		const db = client.db(dbName);

		// Perform database operations here

		// Close the connection when done
		client.close();
	})
	.catch(err => console.error('Error connecting to MongoDB:', err));


// GET all users
app.get('/users', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET user by ID
app.get('/users/:id', getUser, (req, res) => {
	res.json(res.user);
});

// POST create a new user
app.post('/users', async (req, res) => {
	const user = new User(req.body);
	user.save()
		.then(() => res.status(201).json(user))
		.catch((err) => {
			if (err.name === 'ValidationError') {
				console.error('Validation Error:', err.message);
				res.status(400).json({ error: err.message });
			} else {
				console.error('Save Error:', err);
				res.status(500).json({ error: 'Internal Server Error' });
			}
		});
});

// PUT update a user by ID
app.put('/users/:id', getUser, async (req, res) => {
	if (req.body.firstName != null) {
		res.user.firstName = req.body.firstName;
	}

	if (req.body.lastName != null) {
		res.user.lastName = req.body.lastName;
	}

	if (req.body.email != null) {
		res.user.email = req.body.email;
	}

	try {
		const updatedUser = await res.user.save();
		res.json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});


app.delete('/users/:id', async (req, res) => {
	const userId = req.params.id;
	console.log('Deleting user with ID:', userId);

	try {
		const deletedUser = await User.findByIdAndDelete(userId);

		if (!deletedUser) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({ message: 'User deleted successfully', deletedUser });
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Middleware function to get user by ID
async function getUser(req, res, next) {
	let user;

	try {
		user = await User.findById(req.params.id);

		if (user == null) {
			return res.status(404).json({ message: 'User not found' });
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}

	res.user = user;
	next();
}

module.exports = router;