import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: {
		type: String,
		required: false
	},
	resetPasswordExpires: {
		type: Date,
		required: false
	}
});

UserSchema.methods.generatePasswordReset = function () {
	this.resetPasswordToken = crypto.randomBytes(20).toString('hex')
	this.resetPasswordExpires = Date.now() + 3600000 //expires in an hour
  }

module.exports = mongoose.model('user', UserSchema);
