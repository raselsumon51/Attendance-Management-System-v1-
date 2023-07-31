const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_id: Number,
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: Number,
    dept: String,
    semester: String,
    image: String,
    // courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student1', studentSchema);
