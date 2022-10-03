const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

// filter returned values on requests
const returnFilter = (obj) => {
	let tmp = { ...obj }
	tmp.__v = undefined
	return tmp
}

const orderSchema = new Schema({
	invoiceNo: { type: String, required: true },
	products: { type: [], required: true },
	status: { type: String, required: true },
	customerInfo: { type: {}, required: true },
	courier: {type:String},
	subtotal: { type: String, required: true },
	cgst: { type: String, required: true },
	sgst: { type: String, required: true },
	total: { type: String, required: true },
	roundoff: { type: String },
	grandtotal: { type: String, required: true}
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  orderSchema.methods.toJSON = function () {
	const order = this
	const orderObject = order.toObject()
	return returnFilter(orderObject)
}
orderSchema.statics.returnFilter = returnFilter
orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Orders", orderSchema);