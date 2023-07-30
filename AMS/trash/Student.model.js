const mongoose = require('mongoose');
const Course = require('./course')

const studentSchema = new mongoose.Schema({
    student_Id: Number,
    name: String,
    email: String,
    password: Number,
    dept: String,
    semester: String,
    image: String,
    enrolled_Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: false }]
})

module.exports = mongoose.model("Student", studentSchema);


// "email": "teacher441@gmail.com",
//     "password": 123456
// "email": "teacher4411@gmail.com",
//     "password": 123456,