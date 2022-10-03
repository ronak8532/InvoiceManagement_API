const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

// filter returned values on requests
const returnFilter = (obj) => {
	let tmp = { ...obj }
	tmp.__v = undefined
	return tmp
}

const productSchema = new Schema({
	productName: { type: String, required: true },
	price: { type: String },
	priceWithoutGST: { type: String },
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  productSchema.methods.toJSON = function () {
	const product = this
	const productObject = product.toObject()
	return returnFilter(productObject)
}
productSchema.statics.returnFilter = returnFilter
productSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Product", productSchema);