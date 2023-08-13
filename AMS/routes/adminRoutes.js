const express = require('express');
const app = express();
const router = express.Router();

const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const { getUser, getAdminDashboard, logoutAdmin, getAdminLoginForm, loginAdmin, createTeacher, createNewTeacher, uploadTeacherEmails, allTeachers, getCoursesAndTeachers, addCourseTeacher, addTeacher, createCourse, createNewCourse, uploadCourses, getUploadCourses, addTeacherManually, addCourseManually, addCourseManually1, addCourseManual } = require('../controllers/adminController');
// router.get('/', getUser);

router.get('/', getAdminDashboard);
router.get('/logout', logoutAdmin);


//get and post login form
router.get('/login', getAdminLoginForm);
router.post('/login', loginAdmin);




router.get('/teachers', adminAuthMiddleware, allTeachers);

router.get('/teachers-assigned-courses', adminAuthMiddleware, getCoursesAndTeachers);

router.get('/assign-course-teacher', adminAuthMiddleware, addCourseTeacher);
router.post('/assign-course-teacher', adminAuthMiddleware, addTeacher);

// router.get('/add-teachers-manually', adminAuthMiddleware, addTeacherManually);


// Add courses Manually
router.get('/add-courses-manually', adminAuthMiddleware, addCourseManual);
router.post('/add-course', adminAuthMiddleware, createNewCourse);


//upload courses by excel file
router.get('/add-course', adminAuthMiddleware, createCourse);
router.post('/upload-courses', adminAuthMiddleware, uploadCourses);


//upload teachers by file
router.get('/upload-teachers', adminAuthMiddleware, getUploadCourses);
router.post('/teacher-upload', adminAuthMiddleware, uploadTeacherEmails);


//add teachers manually
router.get('/add-teacher', adminAuthMiddleware, createTeacher);
router.post('/add-teacher', adminAuthMiddleware, createNewTeacher);


module.exports = router;



