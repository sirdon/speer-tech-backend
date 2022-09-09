const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../dbConnect")

let stockSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    stockId: { type: Schema.Types.ObjectId, ref: "ListedStocks" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
});

stockSchema.index({ userId: 1, stockId: 1 }, { unique: true });
module.exports = mongoose.model("Stock", stockSchema);
