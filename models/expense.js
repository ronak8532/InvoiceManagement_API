const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

// filter returned values on requests
const returnFilter = (obj) => {
	let tmp = { ...obj }
	tmp.__v = undefined
	return tmp
}

const expenseSchema = new Schema({
	expenseDescription: { type: String, required: true },
	amount: { type: String, required: true },
	status: {type: String, required: true }
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  expenseSchema.methods.toJSON = function () {
	const expense = this
	const expenseObject = expense.toObject()
	return returnFilter(expenseObject)
}
expenseSchema.statics.returnFilter = returnFilter
expenseSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Expense", expenseSchema);