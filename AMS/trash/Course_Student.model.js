const mongoose = require('mongoose');

const course_StudentSchema = new mongoose.Schema({
    student_Id: Number,
    course_Id: Number,
    enrolled_date: new Date(),
    enrolled_by: String,
})


module.exports = mongoose.model("Course_Student", course_StudentSchema);