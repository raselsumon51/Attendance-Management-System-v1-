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

exports.insertAttendance = async (req, res) => {

    // let today = new Date();
    // const formattedToday = today.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    // const month = today.getMonth() + 1;
    // const day = today.getDate();
    // const year = today.getFullYear();

    // const formattedDate = `${month}/${day}/${year}`;
    // console.log(req.body.attendance_data.date);

    //convert the form date to dd/mm/yy
    const date = new Date(req.body.attendance_data.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`;
    ///console.log(formattedDate);



    // const today = new Date();
    // const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    // const formattedDate = today.toLocaleDateString('en-GB', options);

    try {
        const attendance = await Attendance.findOne({
            attendance_value: true,
            student: req.body.attendance_data.student_id,
            course: req.body.attendance_data.course_id,
            attendance_date: formattedDate
        });

        if (attendance) {
            await Attendance.deleteOne({
                attendance_value: true,
                student: req.body.attendance_data.student_id,
                course: req.body.attendance_data.course_id,
                attendance_date: formattedDate
            });
            res.json({ msg: "Attendance deleted" });
        } else {
            const newAttendance = new Attendance({
                attendance_value: true,
                student: req.body.attendance_data.student_id,
                course: req.body.attendance_data.course_id,
                attendance_date: formattedDate
            });

            await newAttendance.save();
            res.json({ msg: "New Attendance Recorded" });
        }
    } catch (err) {
        console.error(err);
    }
};

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


