const express = require('express');
const router = express.Router();
const app = express();
const port = 3000;
app.use(express.json());

const User = require('./dbconnection');
const User = require('./Usermodel'); // Assuming the schema is in a separate file

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



module.exports = router;