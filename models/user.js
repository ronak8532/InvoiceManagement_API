const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

// filter returned values on requests
const returnFilter = (obj) => {
	let tmp = { ...obj }
	tmp.__v = undefined
	return tmp
}

const userSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String },
	password_hash: { type: String, required: true },
	address: { type: String },
	phoneNumber: { type: String },
	city: { type: String },
	state: { type: String },
	role: {type: String, required: true},
	zipcode: {type: String}
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  userSchema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()
	return returnFilter(userObject)
}
userSchema.statics.returnFilter = returnFilter
userSchema.plugin(uniqueValidator);

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);