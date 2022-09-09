const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../dbConnect")

let listedStockSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
});


module.exports = mongoose.model("ListedStocks", listedStockSchema);
