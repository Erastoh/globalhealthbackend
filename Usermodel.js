const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true, // Ensure uniqueness of email addresses
	},
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;