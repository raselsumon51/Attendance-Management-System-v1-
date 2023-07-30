const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher1',
        required: false
    }
    //,
    // student: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Student1',
    //     required: false
    // }
});

const Course1 = mongoose.model('Course1', courseSchema);


async function getAllCourse() {
    try {
        const courses = await Course1.find();
        return courses;
    } catch (err) {
        console.error(err);
        return [];
    }
}

module.exports = {
    Course1,
    getAllCourse
}