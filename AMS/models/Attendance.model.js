const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    attendance_value: {
        type: Boolean,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course1',
        required: false
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student1',
        required: false
    },
    attendance_date: {
        type: String,
        required: true,
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = {
    Attendance
}