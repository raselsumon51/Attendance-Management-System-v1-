const Teacher1 = require('../models/Teacher1.model.js');
const User = require('../models/user.js');
const xlsx = require('xlsx');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
app.use(fileUpload());
const path = require('path');
const { Course1 } = require('../models/Course1.model.js');


exports.getUser = async (req, res) => {
    const users = await User.find();
    res.render('admin', {
        email: users[0].email,
        users: users
    })
}


exports.getAdminLoginForm = (req, res) => {
    res.render('admin/login', {
        layout: false,
        message:""
    });
};

exports.loginAdmin = async (req, res) => {
    try {
        let { email, pswd } = req.body;
        const user = await User.find({ email: email, password: pswd });
        if (user.length > 0 && user[0].role == "admin") {
            req.session.username = email;
            res.redirect('/admin-dashboard');
        } else {
            res.render('admin/login', {
                layout: false,
                message: "Email and Password didn't matched!"
            });
        }
    } catch (error) {
        console.log(error);
    }
};



exports.getAdminDashboard = (req, res) => {
    if (!req.session.username) {
        res.redirect('/admin-dashboard/login');
    } else {
        res.render('admin/welcome', {
            email: req.session.username,
            page: "",
            layout: './layouts/admin-dashboard-layout',
            stylesheet: ""
        });
    }
};

exports.logoutAdmin = (req, res) => {

    req.session.username = null;
    req.session.save((err) => {
        if (err) {
            console.log('Error in log out', err);
        } else {
            console.log('Log out successful');
        }
        res.redirect('/'); // Redirect to the desired location after destroying the session
    });
};


exports.createTeacher = (req, res) => {
    let saved = false;
    res.render('admin/teachers/add_manually', {
        layout: './layouts/admin-dashboard-layout',
        saved:saved
    });
};

exports.createNewTeacher = async (req, res) => {
    try {
        const existingTeacher = await Teacher1.findOne({ email: req.body.teacher_email });
        if (existingTeacher) {
            res.status(409).send('Teacher already exists');
            return;
        }

        const newTeacher = new Teacher1({
            email: req.body.teacher_email,
            password: req.body.teacher_pass,
        });

        await newTeacher.save();
        //console.log('New teacher saved to database:', newTeacher);
        //res.send("New Teacher Created");
        const success = true;
        res.render('admin/teachers/add_manually', {
            layout: './layouts/admin-dashboard-layout',
            message: "",
            stylesheet: "",
            success
        })
    } catch (err) {
        console.error('Error saving new teacher to database:', err);
    }
};


exports.uploadTeacherEmails = (req, res) => {
    const file = req.files.teacher_file;
    const filePath = path.join(__dirname, file.name);
    let saved = true;

    file.mv(filePath, async (error) => {
        if (error) {
            return res.status(500).send('Error uploading file');
        }

        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const emailAddresses = [];

        data.forEach((obj) => {
            const [firstKey, firstValue] = Object.entries(obj)[0];
            emailAddresses.push(firstValue);
        });
        // console.log(emailAddresses);

        // const emailAddresses = data.map((row) => row.teachers_email);
        for (const email of emailAddresses) {
            try {
                const existingTeacher = await Teacher1.find({ email:email });
               // console.log(existingTeacher)
                if (existingTeacher.length<1) {
                    const teacher = new Teacher1({ email, password: "123456" }); // Set the default password value
                    const savedTeacher = await teacher.save();
                }
                else {
                    console.log(`Already Exists ${email}`);
                }
                saved = true;
            } catch (error) {
                console.error(`Error saving teacher with email ${email}:`, error);
            }
        }
    });
    //console.log(saved)
    res.render('admin/teachers/add', {
        layout: './layouts/admin-dashboard-layout',
        message: "",
        stylesheet: '/css/admin/teachers/add_teacher/style.css',
        saved: saved
    });
}

exports.allTeachers = async (req, res) => {
    try {
        const teachers = await Teacher1.find();
        res.render('admin/teachers/list', {
            teachers,
            layout: './layouts/admin-dashboard-layout',
            stylesheet: ""
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getCoursesAndTeachers = async (req, res) => {
    try {
        const courses = await Course1.find().populate('teacher').exec();

        res.render('admin/assigned-courses-teachers', {
            courses,
            layout: './layouts/admin-dashboard-layout',
            stylesheet: ''
        });
    }
    catch (error) {
        console.log(error);
    }
};


exports.addCourseTeacher = async (req, res) => {
    try {
        const courses = await Course1.find();
        const teachers = await Teacher1.find();

        res.render('admin/assign-course-teacher', {
            courses,
            teachers,
            layout: './layouts/admin-dashboard-layout',
            stylesheet: ""
        });
    } catch (error) {
        console.log(error);
    }
};

exports.addTeacher = async (req, res) => {
    try {
        let course = await Course1.findById(req.body.course_id);
        if (course.teacher) {
            return res.status(400).send("The teacher is already assigned to the course");
        }
        course.teacher = req.body.teacher_id;
        await course.save();
        res.send("Teacher assigned to the course");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};


exports.createCourse = (req, res) => {
    res.render('admin/courses/add', {
        layout: './layouts/admin-dashboard-layout',
        message: "",
        stylesheet: "",
        saved:false
    });
};



exports.createNewCourse = async (req, res) => {
    const existingCourse = await Course1.findOne({ code: req.body.course_code });
    if (existingCourse) {
        res.status(409).send('Course already exists');
        return;
    }

    const course1 = new Course1({
        name: req.body.course_name,
        code: req.body.course_code,
    });

    course1.save()
        .then(course => {
            console.log(`Saved course: ${course}`);
            res.send("Course Created");
        })
        .catch(err => {
            console.error(err);
        });
};


exports.uploadCourses = async (req, res) => {
    try {
        
        const file = req.files.course_file;
        const filePath = path.join(__dirname, file.name);
        let saved = false;

        file.mv(filePath, async (error) => {
            if (error) {
                return res.status(500).send('Error uploading file');
            }

            const workbook = xlsx.readFile(filePath);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const courses = xlsx.utils.sheet_to_json(worksheet);

            for (const course of courses) {
                const existingCourse = await Course1.find({ code: course.course_code });
                if (existingCourse.length < 1) {
                    const newCourse = new Course1({ name: course.course_name, code: course.course_code }); // Set the default password value
                    const savedCourse = await newCourse.save();
                    console.log(savedCourse)
                }
                else {
                    console.log(`Already Exists ${course.course_name}`);
                }
                saved = true;
            }
            res.render('admin/courses/add', {
                layout: './layouts/admin-dashboard-layout',
                saved: saved,
                stylesheet: ""
            });
        });
    }
    catch (err) {
        console.error(err);
    }    
};


exports.getUploadCourses = (req, res) => {
    res.render('admin/teachers/add', {
        layout: './layouts/admin-dashboard-layout',
        message: "",
        stylesheet: '/css/admin/teachers/add_teacher/style.css',
        saved: ""
    });
};

exports.addCourseManually = (req, res) => {
    res.render('admin/courses/add_manually', {
        layout: './layouts/admin-dashboard-layout',
        message: "",
        stylesheet: ""
    });
};

exports.addTeacherManually = (req, res) => {
    // const success = true;
    res.render('admin/teachers/add_manually', {
        layout: './layouts/admin-dashboard-layout',
        message: "",
        stylesheet: "",
        success: ""
    });
};