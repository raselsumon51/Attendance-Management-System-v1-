const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true
    },
    course_code: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: false
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course
// const courseSchema = new mongoose.Schema({
//     course_name: {
//         type: String,
//     },
//     course_code: {
//         type: String,
//     },
//     creation_date: {
//         type: Date,
//         default: new Date()
//     },
//     teacher: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Teacher",
//         required: false
//     }
// })

// module.exports = mongoose.model("Course", courseSchema);
