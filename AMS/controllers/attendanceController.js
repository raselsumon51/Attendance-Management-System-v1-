const express = require('express');
const app = express();
const { Course1, getAllCourse } = require('../models/Course1.model');
const Student1 = require('../models/Student1.model');
const { Attendance } = require('../models/Attendance.model');
const { getAllCourses, getMarksForm } = require('./courseController');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment.model');
const Student1Model = require('../models/Student1.model');
const Mark = require('../models/Mark.model');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


exports.takeAttendance = async (req, res) => {
    try {
        if (!req.session.teacher_email) {
            res.send("Session expired");
        } else {
            courses = await Course1.find({ teacher: req.session.teacher_id });
            if (courses.length === 0) {
                res.render('teacher/record-attendance/courses/select', {
                    errorMessage: "You are not assigned in a course",
                    email: req.session.email,
                    courses: [],
                    teacher_id: req.session.teacher_id,
                    layout: './layouts/teacher-dashboard-layout',
                });
            } else {
                res.render('teacher/record-attendance/courses/select', {
                    courses,
                    email: req.session.email,
                    errorMessage: "",
                    teacher_id: req.session.teacher_id,
                    layout: './layouts/teacher-dashboard-layout'
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

// const Attendance = require('./models/Attendance'); // Adjust the path as necessary

exports.insertAttendance = async (req, res) => {
    const studentId = req.body['attendance_data[student_id]'];
    const courseId = req.body['attendance_data[course_id]'];
    const date = req.body['attendance_data[date]'];

    console.log(`student id : ${studentId} courseid ${courseId} date ${date}`)
    
    const formattedDate = new Date(date);
    const formattedDateString = `${formattedDate.getDate()}/${formattedDate.getMonth() + 1}/${String(formattedDate.getFullYear()).slice(-2)}`;

    try {
        const existingAttendance = await Attendance.findOne({
            attendance_value: true,
            student: studentId,
            course: courseId,
            attendance_date: formattedDateString
        });

        if (existingAttendance) {
            await Attendance.deleteOne({
                attendance_value: true,
                student: studentId,
                course: courseId,
                attendance_date: formattedDateString
            });
            res.json({ msg: "Attendance deleted" });
        } else {
            const newAttendance = new Attendance({
                attendance_value: true,
                student: studentId,
                course: courseId,
                attendance_date: formattedDateString
            });

            await newAttendance.save();
            res.json({ msg: "New Attendance Recorded" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// module.exports = { insertAttendance };


// module.exports = { insertAttendance };


exports.sliderAttendance = async (req, res) => {
    const { course_id, date } = req.body;
    //const students = await Student1.find();
    const enrolledStudents = await Enrollment.find({ course_id: course_id })
        .populate('student_id')
        .exec();

    res.render('teacher/record-attendance/courses/attendance/slider', {
        page: "attendance-slider",
        course_id,
        teacher_id: req.session.teacher_id,
        date,
        enrolledStudents,
        teacher_email: req.session.teacher_email,
        layout: './layouts/teacher-dashboard-layout'
    });
};


