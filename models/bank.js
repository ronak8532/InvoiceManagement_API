const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

// filter returned values on requests
const returnFilter = (obj) => {
	let tmp = { ...obj }
	tmp.__v = undefined
	return tmp
}

const bankSchema = new Schema({
	bankBalance: { type: String, required: true },
	dueBalance: { type: String, required: true },
	totalBalance: { type: String, required: true },
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  bankSchema.methods.toJSON = function () {
	const bank = this
	const bankObject = bank.toObject()
	return returnFilter(bankObject)
}
bankSchema.statics.returnFilter = returnFilter
bankSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Bank", bankSchema);