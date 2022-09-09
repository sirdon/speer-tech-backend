const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");
const crypto = require("crypto");
require("../dbConnect")

let userSchema = new Schema({
    username: { type: String, require: true, unique: true},
    hashed_password: { type: String, require: true },
    balance: { type: Number, default: 0 },
    liveSubscription: { type:Boolean, default: false},
    salt: { type: String, require: true },
    token: { type: String, require: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
});

userSchema
    .virtual("password")
    .set(function (password) {
        //create a temporary variable called password
        //generate salt
        this.salt = this.makeSalt();
        //encryptPassword
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this.hashed_password;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        let pass = this.encryptPassword(plainText)
        return pass === this.hashed_password;
    },
    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (error) {
            return "";
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random() + "");
    },
};

module.exports = mongoose.model("Users", userSchema);
