const { Course1, getAllCourse } = require('../models/Course1.model');
const Teacher1 = require('../models/Teacher1.model');
const Enrollment = require('../models/Enrollment.model');
const Marks = require('../models/Mark.model');
const xlsx = require('xlsx');
const path = require('path');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
app.use(fileUpload());


exports.showCourses = async (req, res) => {
    const courses = await Course1.find({ teacher: req.session.teacher_id });
    res.render('teacher/courses/list', {
        teacher_id: req.session.teacher_id,
        courses,
        layout: './layouts/teacher-dashboard-layout'
    });
};





exports.teachersCourses = (req, res) => {
    res.render('dashboard/admin', {
        page: "teachersCourses"
    });
};


exports.getCourseNames = async (req, res) => {
    try {
        if (!req.session.teacher_email) {
            res.send("Session expired");
            res.redirect('/teacher/login');
        } else {
            courses = await Course1.find({ teacher: req.session.teacher_id });
            if (courses.length === 0) {
                res.render('teacher/set-marks/courses/select', {
                    errorMessage: "You are not assigned in a course",
                    email: req.session.email,
                    courses: [],
                    teacher_id: req.session.teacher_id,
                    layout: './layouts/teacher-dashboard-layout',
                });
            } else {
                res.render('teacher/set-marks/courses/select', {
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


exports.getMarksForm = async (req, res) => {
    try {
        if (!req.session.teacher_email) {
            res.send("Session expired");
            res.redirect('/teacher/login');
        }
        else {
            res.render('teacher/set-marks/courses/marks/form', {
                teacher_id: req.session.teacher_id,
                course_id: req.body.course_id,
                layout: './layouts/teacher-dashboard-layout'
            });
        }

    } catch (error) {
        console.log(error);
    }
};


exports.setMarks = async (req, res) => {
    try {
        const marksData = req.body;
        const marks = new Marks(marksData);

        await marks.save();
        res.send('Marks saved successfully');
    } catch (err) {
        console.error('Error saving marks:', err);
        res.status(500).send('An error occurred while saving the marks');
    }
};