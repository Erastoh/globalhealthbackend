const mongoose = require('mongoose');
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

// create a new user
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

// update a user by ID
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

//get user by id Middleware
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