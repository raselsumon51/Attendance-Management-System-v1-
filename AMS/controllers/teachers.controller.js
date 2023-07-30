const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Teacher1 = require('../models/Teacher1.model');
const xlsx = require('xlsx');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const path = require('path');
const { Course1 } = require('../models/Course1.model');
const { Attendance } = require('../models/Attendance.model');
const Student1 = require('../models/Student1.model');
const Enrollment = require('../models/Enrollment.model');
const Mark = require('../models/Mark.model');


exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher1.findOne({ _id: req.session.teacher_id });
        console.log(teacher)
        if (!teacher) {
            res.status(404).send('Teacher not found');
            return;
        }
        // Render the update form with the student data
        res.render('teacher/profile/update', { teacher, page: "teacher-update", teacher_id: req.session.teacher_id, layout: './layouts/teacher-dashboard-layout' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

exports.saveUpdatedTeacher = async (req, res) => {
    try {
        const teacher = await Teacher1.findById(req.params.id);
        if (!teacher) {
            res.status(404).send('teacher not found');
            return;
        }
        teacher.name = req.body.name;
        await teacher.save();
        // Redirect to the student detail page
        res.send("change saved");
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};


//login GET
exports.loginForm = (req, res) => {
    res.render('teacher/login', {
        layout: false,
        message:""
    });
};

// logout
exports.logout = (req, res) => {
    req.session.teacher_email = null;
    req.session.teacher_id = null;
    req.session.save((err) => {
        if (err) {
            console.log('Error in log out', err);
        } else {
            console.log('Log out successful');
        }
        res.redirect('/'); // Redirect to the desired location after destroying the session
    });
};

// 
exports.login = async (req, res) => {
    try {
        const { email, pswd } = req.body;
        const teacher = await Teacher1.find({ email: email, password: pswd });

        if (teacher.length > 0) {
            req.session.teacher_email = email;
            req.session.teacher_id = teacher[0]._id;
            res.redirect('/teacher/dashboard');
        } else {
            res.render('teacher/login', {
                layout: false,
                message: "Email and Password didn't matched!"
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.dashboard = (req, res) => {
    
    if (!req.session.teacher_email) {
        res.redirect('/teacher/login');
    }
    
    res.render('teacher/welcome', {
        email: req.session.teacher_email,
        layout: './layouts/teacher-dashboard-layout',
        page: "",
        teacher_id: req.session.teacher_id,
        student_email: req.session.student_email
    });
};


exports.showAllCourses = async (req, res) => {
    const courses = await Course1.find({ teacher: req.session.teacher_id });
    res.render('teacher/attendance-records/courses/list', { layout: './layouts/teacher-dashboard-layout', teacher_id: req.session.teacher_id, courses, dashboard: "teacher-dashboard" });
}

exports.showCourseAttendance = async (req, res) => {
    const course_id = req.params.course_id;
    try {

        const results = await Attendance.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(course_id),
                },
            },
            {
                $group: {
                    _id: '$student',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
        ]);
        // console.log(results);
        const studentIds = results.map(result => result._id);
        const students = await Student1.find({ _id: { $in: studentIds } });

        let populatedResults = results.map(result => {
            const student = students.find(student => student._id.equals(result._id));
            return {
                _id: student._id,
                name: student.name,
                count: result.count,
            };
        });

        //find total classes
        const uniqueDates = await Attendance.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(course_id) } },
            { $group: { _id: '$attendance_date' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        const total_class = uniqueDates.length > 0 ? uniqueDates[0].count : 0;

        //console.log(populatedResults);

        let allStudents = await Enrollment.find({ course_id }).populate('student_id').select('student_id');

        allStudents = allStudents.map(enrollment => enrollment.student_id);
        // console.log(allStudents);
        const output = allStudents.map(student => {
            const result = populatedResults.find(res => res._id.toString() === student._id.toString());
            if (result) {
                return result;
            } else {
                let newstd = {
                    _id: student._id,
                    name: student.name,
                    count: 0
                };
                return newstd;
            }
        });

        const latestMark = await Mark.find({}).sort({ date: -1 });

        if (req.baseUrl == "/students-dashboard") {
            res.render('student/attendance/list', { layout: './layouts/student', student_id: req.session.student_id, results: output, total_class, latestMark });
        }
        else if (req.baseUrl == "/teacher") {
            res.render('teacher/attendance-records/courses/attendance/list', { layout: './layouts/teacher-dashboard-layout', teacher_id: req.session.teacher_id, results: output, total_class, latestMark });
        }
    } catch (error) {
        console.error('Error executing the query:', error);
    }
};





