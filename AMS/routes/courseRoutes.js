const express = require('express');
const { showCourses, addTeacher, getAllCourses, getCoursesAndTeachers, createCourse, createNewCourse, addCourseTeacher, teachersCourses, getCourseNames, getMarksForm, setMarks, uploadCourses } = require('../controllers/courseController');
const teacherAuthMiddleware = require('../middlewares/teacherAuthMiddleware');
const studentAuthMiddleware = require('../middlewares/studentAuthMiddleware');

const app = express();
const router = express.Router();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

router.get('/', showCourses);

router.get('/teachers/courses', teachersCourses);
router.get('/set-marks', teacherAuthMiddleware, getCourseNames);
router.post('/set-marks', teacherAuthMiddleware, setMarks);
router.post('/marks-form', teacherAuthMiddleware, getMarksForm);

module.exports = router;






















// router.get('/teacher/show', function (req, res) {
//     res.render('dashboard/teacher', {
//         page: "showCourses"
//     });
// })



// router.post('/add/teacher', async function (req, res) {
//     try {
//         let course = await Course1.findById(req.body.course_id);
//         if (course.teacher) {
//             return res.status(400).send("The teacher is already assigned to the course");
//         }
//         course.teacher = req.body.teacher_id;
//         await course.save();
//         res.send("Teacher assigned to the course");
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send("Internal server error");
//     }
// });

// router.get('/all', async function (req, res) {

//     const enrollments = await Enrollment.find({ student_id: req.session.student_id }).populate('course_id').exec();
//     const enrolledCourseIds = enrollments.map(enrollment => enrollment.course_id._id.toString());

//     const courses = await getAllCourse();

//     res.render('student/all-courses', {
//         page: "course-all",
//         courses,
//         enrolledCourseIds: enrolledCourseIds,
//         student_email: req.session.student_email,
//         student_id: req.session.student_id,
//         layout: './layouts/student',
//         pageTitle: "All Courses"
//     });
// });

// router.get('/all/show', async function (req, res) {
//     try {
//         const courses = await Course1.find().populate('teacher').exec();
//         if (req.url == "/all/show") {
//             res.render('dashboard/admin', {
//                 page: "allCourses",
//                 courses,
//             });
//         }
//         else {
//             // res.render('dashboard/student', {
//             //     page: "showAllCourses",
//             //     courses,
//             //     student_email: req.session.student_email,
//             //     name: "rasel sumon nn",
//             //     std_Id: req.session.std_Id
//             // });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// });

// router.get('/create', function (req, res) {
//     res.render('dashboard/admin', {
//         page: "createCourse"
//     });
// })


// router.post('/create', async function (req, res) {

//     const existingCourse = await Course1.findOne({ code: req.body.course_code });
//     if (existingCourse) {
//         res.status(409).send('Course already exists');
//         return;
//     }
//     const course1 = new Course1({
//         name: req.body.course_name,
//         code: req.body.course_code,
//     });

//     course1.save()
//         .then(course => {
//             console.log(`Saved course: ${course}`);
//             res.send("Course Created");
//         })
//         .catch(err => {
//             console.error(err);
//         });
// })

// router.get('/add/teacher', async function (req, res) {
//     try {
//         const result = await Course1.find();
//         const teachers = await Teacher1.find();

//         res.render('dashboard/admin', {
//             page: "addCourseTeacher",
//             courses: result,
//             teachers
//         });
//     } catch (error) {
//         console.log(error);
//     }
// })

// router.get('/teachers/courses', function (req, res) {
//     res.render('dashboard/admin', {
//         page: "teachersCourses"
//     });
// })

