const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Invalid email format")
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
       
        // minlength: 10,
        // maxlength: 11
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    datecreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }
});


// model
const users = new mongoose.model("users",usersSchema);

module.exports = users;