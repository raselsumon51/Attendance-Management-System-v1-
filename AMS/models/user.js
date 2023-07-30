const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: String,
    email: String,
    password: Number
})


module.exports = mongoose.model("User", userSchema);