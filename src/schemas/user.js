const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	Name: { type: String, required: true },
	Password: { type: String, required: true },
	Email: { type: String, required: true, unique: true },
	PhoneNo: { type: String, required: true },
	Profession: { type: String, required: true },
});

module.exports = mongoose.model('User', User);
