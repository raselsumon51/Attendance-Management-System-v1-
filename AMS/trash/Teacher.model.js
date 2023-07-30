const mongoose = require('mongoose');
const Course = require('./course');

const teacherSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: Number
    // courses: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Course",
    //     required: false
    // }
})

module.exports = mongoose.model("Teacher", teacherSchema);