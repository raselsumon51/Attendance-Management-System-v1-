const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    instructor: String,
    credits: Number,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StdCourse', courseSchema);
