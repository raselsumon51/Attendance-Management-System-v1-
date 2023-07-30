const express = require('express');
const { takeAttendance, insertAttendance, sliderAttendance, showAllCourses, showCourseAttendance } = require('../controllers/attendanceController');
const teacherAuthMiddleware = require('../middlewares/teacherAuthMiddleware');
const app = express();
const router = express.Router();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Route: /teacher/take
router.get('/select-course', teacherAuthMiddleware,takeAttendance);
// Route: /teacher/insert
router.post('/insert', teacherAuthMiddleware, insertAttendance);
// Route: /teacher/slider
router.post('/slider', teacherAuthMiddleware, sliderAttendance);

module.exports = router;


















// router.get('/take', async function (req, res) {
//     console.log(req.session.teacher_id);
//     try {
//         if (!req.session.teacher_email) {
//             res.send("Session expired");
//             // res.redirect('/teacher/login');
//         }
//         else {
//             courses = await Course1.find({ teacher: req.session.teacher_id });
//             if (courses.length === 0) {
//                 res.render('dashboard/teacher', {
//                     page: "choose-course",
//                     errorMessage: "You are not assigned in a course",
//                     email: req.session.email,
//                     courses: [],
//                     teacher_id: req.session.teacher_id
//                 });
//             } else {
//                 res.render('dashboard/teacher', {
//                     page: "choose-course",
//                     courses,
//                     email: req.session.email,
//                     errorMessage: "",
//                     teacher_id: req.session.teacher_id
//                 });
//             }

//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

// router.post('/insert', async function (req, res) {
//     const today = new Date();
//     const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
//     const formattedDate = today.toLocaleDateString('en-GB', options);

//     try {
//         const attendance = await Attendance.findOne({
//             attendance_value: true,
//             student: req.body.attendance_data.student_id,
//             course: req.body.attendance_data.course_id,
//             attendance_date: formattedDate
//         });

//         if (attendance) {
//             await Attendance.deleteOne({
//                 attendance_value: true,
//                 student: req.body.attendance_data.student_id,
//                 course: req.body.attendance_data.course_id,
//                 attendance_date: formattedDate
//             });
//             res.json({ msg: "Attendance deleted" })
//         } else {
//             const newAttendance = new Attendance({
//                 attendance_value: true,
//                 student: req.body.attendance_data.student_id,
//                 course: req.body.attendance_data.course_id,
//                 attendance_date: formattedDate
//             });

//             await newAttendance.save();
//             res.json({ msg: "New Attendance Recorded" })
//         }
//     } catch (err) {
//         console.error(err);
//     }
// })

// router.post('/slider', async function (req, res) {
//     const { course_id, date } = req.body;
//     const students = await Student1.find();
//     res.render('dashboard/teacher', {
//         page: "attendance-slider",
//         course_id,
//         teacher_id: req.session.teacher_id,
//         date,
//         students,
//         teacher_email: req.session.teacher_email
//     });
// })