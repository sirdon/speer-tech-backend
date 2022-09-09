const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../dbConnect")

let tweetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    content: { type: String, require: true },
    like: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
});


module.exports = mongoose.model("Tweets", tweetSchema);
