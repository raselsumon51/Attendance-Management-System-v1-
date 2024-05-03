const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
;

const mongoose = require('mongoose');
const { getAllCourse, Course1 } = require('../models/Course1.model');
const Enrollment = require('../models/Enrollment.model');
const Student1 = require('../models/Student1.model');
const { Attendance } = require('../models/Attendance.model');
const Mark = require('../models/Mark.model');



exports.getRegistrationManually = async (req, res) => { 
    try {
        res.render('student/registration', { title: 'Home Page', message: "", layout: false });
    } catch (error) {
        console.log(error.message)
    }
}


exports.getRegistrationPage = async (req, res) => {
    try {
        courses = await Course1.find({ teacher: req.session.teacher_id });
        if (courses.length === 0) {
            res.render('teacher/add-student/courses/select', {
                errorMessage: "You are not assigned in a course",
                email: req.session.email,
                courses: [],
                teacher_id: req.session.teacher_id,
                layout: './layouts/teacher-dashboard-layout',
            });
        } else {
            res.render('teacher/add-student/courses/select', {
                courses,
                email: req.session.email,
                errorMessage: "",
                teacher_id: req.session.teacher_id,
                layout: './layouts/teacher-dashboard-layout'
            });
        }
    } catch (error) {
        console.log(error);
    }
};


exports.addStudentManually = async (req, res) => {
    console.log(req.params)
    try {
        courses = await Course1.find({ teacher: req.session.teacher_id });
        if (courses.length === 0) {
            res.render('teacher/add-student/courses/students/add_manually', {
                errorMessage: "You are not assigned in a course",
                email: req.session.email,
                courses: [],
                teacher_id: req.session.teacher_id,
                layout: './layouts/teacher-dashboard-layout',
                message: "",
                course_id: req.params.course_id
            });
        } else {
            res.render('teacher/add-student/courses/students/add_manually', {
                courses,
                email: req.session.email,
                errorMessage: "",
                teacher_id: req.session.teacher_id,
                layout: './layouts/teacher-dashboard-layout',
                message: "",
                course_id: req.params.course_id
            });
        }
    } catch (error) {
        console.log(error);
    }
};



exports.postCourseID = async (req, res) => {
    const course_id = req.body.course_id;
    console.log(course_id)
    res.render('teacher/add-student/courses/students/add', { course_id, message: "", layout: './layouts/teacher-dashboard-layout', teacher_id: req.session.teacher_id });
};

exports.store_form_info = async (req, res) => {
    const { student_id, name, email, password, course_id } = req.body;
    try {
        const student = new Student1({
            student_id,
            name,
            email,
            password
        });

        await student.save();

        const enrollment = new Enrollment({
            student_id: student._id, // Use the student's _id property
            course_id
        });
        console.log(enrollment)
        await enrollment.save();

        res.send("Enrollment Successful!");
    } catch (error) {
        // Handle any errors that occur during the saving process
        res.status(500).send("Error occurred during enrollment");
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        res.json(await Student.find());
    } catch (error) {
        console.log(error);
    }
};


exports.getLoginForm = (req, res) => {
    res.render('student/login', {
        page: "",
        layout: false
    });
};


// Sudent-Login POST
// exports.loginStudent = async (req, res) => {
//     try {
//         let { email, pswd } = req.body;
        
//         const student = await Student1.find({ email: email, password: pswd });

//         if (student.length != 0) {
//             req.session.student_email = email;
//             req.session.student_id = student[0]._id;
//             res.redirect('/students-dashboard');
//         } else {
//             // res.send("Email and password are not matched or You are not a Student!");
//             res.render('Homepage/Homepage',{
//                 layout: './layouts/layout'
//         });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };

exports.logoutStudent = (req, res) => {
    req.session.student_email = null;
    req.session.student_id = null;
    req.session.save((err) => {
        if (err) {
            console.log('Error in log out', err);
        } else {
            console.log('Log out successful');
        }
        res.redirect('/'); // Redirect to the desired location after destroying the session
    });
};

exports.getDashboard = (req, res) => {

    if (!req.session.student_email) {
        res.redirect('/student/login');
    } else {
        res.render('student/welcome', {
            student_email: req.session.student_email,
            page: "",
            student_id: req.session.student_id,
            pageTitle: 'Dashboard Page',
            layout: './layouts/student'
        });
    }
};





exports.postRegistrationData = async (req, res) => {
    const { student_id, name, email, password } = req.body

    if (!student_id || !name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' })
    }

    const existingStudent = await Student1.findOne({ email: email })

    if (existingStudent) {
        res.send('A student with this email already exists.');
    } else {
        const newStudent = new Student1({
            student_id,
            name,
            email,
            password
        })
        newStudent.save()
            .then(student => {
                res.render('student/registration', { message: 'Registration Successful!', layout: false, teacher_id: req.session.teacher_id })
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ message: 'Error saving student record' })
            })
    }
    // res.render('student/student-index', { pageTitle: 'Home Page', layout: './layouts/student', student_email: "rr" });
};

exports.saveEnrollData = async (req, res) => {
    try {
        const { student_id, course_id } = req.query;
        const existingEnrollment = await Enrollment.findOne({ student_id: student_id, course_id: course_id });
        if (existingEnrollment) {
            res.send('The student is already enrolled in the course.');
        }
        else {
            const enrollment = new Enrollment({ student_id, course_id });
            await enrollment.save();

            res.redirect('/students-dashboard/courses');
        }

    } catch (error) {
        res.status(400).send(error);
    }
};

exports.editStudent = async (req, res) => {
    try {
        const student = await Student1.find({ _id: req.session.student_id });
        // console.log("hi")
        // console.log(student[0].student_id);
        if (!student) {
            res.status(404).send('Student not found');
            return;
        }
        res.render('student/update', { student, layout: './layouts/student', student_id: req.params.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};


exports.updateStudent = async (req, res) => {
    try {
        const student = await Student1.findById(req.params.id);
        if (!student) {
            res.status(404).send('Student not found');
            return;
        }
        const imageFile = req.files && req.files.image;
        //console.log(imageFile);
        imageFile.mv(`public/uploads/${imageFile.name}`, (error) => {
            if (error) {
                console.error('Error saving the file:', error);
            }
        });

        student.student_id = req.body.student_id;
        student.name = req.body.name;
        student.image = imageFile.name;
        await student.save();
        // Redirect to the student detail page
        res.send("change saved");
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

exports.profile = async (req, res) => {
    try {
        const student = await Student1.findOne({ _id: req.params.id });
        console.log(student);
        if (!student) {
            res.status(404).send('Student not found');
            return;
        }
        res.render('student/profile', { student, layout: './layouts/student', student_id: req.params.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

exports.uploadStudentInfo = async (req, res) => {
    
    const course_id = req.body.course_id;
    if (!req.files || !req.files.student_file) {
        return res.status(400).send('No file uploaded');
    }

    const file = req.files.student_file;
    const filePath = path.join(__dirname, file.name);

    // Move the uploaded file to the server
    file.mv(filePath, async (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error uploading file');
        }

        try {
            const workbook = xlsx.readFile(filePath);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const students = xlsx.utils.sheet_to_json(worksheet);
            // console.log('student-- ')
            // console.log(students);
            for (const student of students) {
                let insertion_count = 0;
                // Check if a student with the same student_id or student_email already exists
                const existingStudent = await Student1.find(
                    { email: student.student_email }
                );

                if (!(existingStudent.length > 0)) {
                    // If the student does not exist, save the new student data
                    const newStudent = new Student1({
                        student_id: student.student_id,
                        name: student.student_name,
                        email: student.student_email,
                        password:123456
                    });
                    await newStudent.save();
                    // console.log('Student Saved');
                    // console.log('new std-- ');
                    // console.log(newStudent);
                        


                    // const existingEnrollment = await Enrollment.find({ student_id: existingStudent[0]._id, course_id: course_id });
                    // if (existingEnrollment.length > 0) {
                    //     console.log('The student is already enrolled in the course.');
                    // }
                    // else {
                        // console.log('enrollment-- ')
                        // console.log(newStudent._id);
                        const enrollment = new Enrollment({ student_id: newStudent._id, course_id: course_id });
                        // console.log(enrollment)
                        await enrollment.save();
                        // console.log("Enrolled");
                   // }
                }
                else {
                    const existingEnrollment = await Enrollment.find({ student_id: existingStudent[0]._id, course_id: course_id });
                    if (existingEnrollment.length > 0) {
                        console.log('The student is already enrolled in the course.');
                    }
                    else {
                        // console.log('existing student enrollment-- ')
                        // console.log(existingStudent[0]._id);
                        const enrollment = new Enrollment({ student_id: existingStudent[0]._id, course_id: course_id });
                        // console.log(enrollment)
                        await enrollment.save();
                        // console.log("existing student Enrolled");
                    // console.log(`${student.student_email} is already exists`);
                    }
                }
            }
            res.send('Students saved successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error processing the file');
        } finally {
            // Delete the file from the server after processing
            fs.unlinkSync(filePath);
        }
    });
};


exports.getAllCourses = async (req, res) => {
    const enrollments = await Enrollment.find({ student_id: req.session.student_id }).populate('course_id').exec();
    const enrolledCourseIds = enrollments.map(enrollment => enrollment.course_id._id.toString());

    const courses = await getAllCourse();

    res.render('student/courses/enroll', {
        courses,
        enrolledCourseIds: enrolledCourseIds,
        student_email: req.session.student_email,
        student_id: req.session.student_id,
        layout: './layouts/student',
        pageTitle: "All Courses"
    });
};



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
        //  console.log(results);
        const studentIds = results.map(result => result._id);
        const students = await Student1.find({ _id: { $in: studentIds } });

        let populatedResults = results.map(result => {
            const student = students.find(student => student._id.equals(result._id));
            // console.log(student);
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


        //my marks
        const attendancedata = output.filter(obj => obj._id.toString() === req.session.student_id.toString());
        // const course_name = await Course1.findOne({ _id: course_id });
// 

        const latestMark = await Mark.find({}).sort({ date: -1 });

        if (req.baseUrl == "/students-dashboard") {
            res.render('student/attendance/list', { layout: './layouts/student', student_id: req.session.student_id, results: attendancedata, total_class, latestMark });
        }
        else if (req.baseUrl == "/teacher") {
            res.render('teacher/attendance-records/courses/attendance/list', { layout: './layouts/teacher-dashboard-layout', teacher_id: req.session.teacher_id, results: attendancedata, total_class, latestMark });
        }
    } catch (error) {
        console.error('Error executing the query:', error);
    }
};


exports.showAllCourses = async (req, res) => {
    const courses = await Course1.find();
     if (req.baseUrl =="/students-dashboard") {
        res.render('student/courses/list', { layout: './layouts/student', student_id: req.session.student_id, courses, dashboard: "student-dashboard" });
     }
     else if (req.baseUrl == "/teacher") {
        res.render('teacher/attendance-records/courses/list', { layout: './layouts/teacher-dashboard-layout', teacher_id: req.session.teacher_id, courses, dashboard: "teacher-dashboard" });
    }
}