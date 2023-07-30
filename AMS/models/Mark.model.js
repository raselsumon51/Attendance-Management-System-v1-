const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    marks_95_100: { type: Number, required: true },
    marks_90_94: { type: Number, required: true },
    marks_85_89: { type: Number, required: true },
    marks_80_84: { type: Number, required: true },
    marks_75_79: { type: Number, required: true },
    marks_70_74: { type: Number, required: true },
    marks_65_69: { type: Number, required: true },
    marks_60_64: { type: Number, required: true },
    course_id: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Mark = mongoose.model('Marks', marksSchema);

module.exports = Mark;
