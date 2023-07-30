const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student1',
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course1',
        required: true
    },
    enrolled_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
