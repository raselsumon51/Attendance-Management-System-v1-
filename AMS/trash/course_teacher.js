const mongoose = require('mongoose');
// const Course = require('./course');
// const User = require('./user');

const course_teacher = new mongoose.Schema({
    course_name: {
        type: String
    },
    teacher_name: {
        type: String
    }
})
module.exports = mongoose.model("Course_Teacher", course_teacher);