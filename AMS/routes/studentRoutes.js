const express = require('express');
const { getRegistrationPage, postRegistrationData, saveEnrollData, editStudent, updateStudent, getAllStudents, getLoginForm, loginStudent, logoutStudent, getDashboard, profile, postCourseID, store_form_info, uploadStudentInfo, getAllCourses, showCourseAttendance, showAllCourses, addStudentManually } = require('../controllers/students.controller');
const app = express();
const router = express.Router();
const studentAuthMiddleware = require('../middlewares/studentAuthMiddleware');


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


router.get('/all', getAllStudents);
router.get('/login', getLoginForm);
router.post('/login', loginStudent);
router.get('/logout', logoutStudent);
router.get('/', getDashboard);


//upload student using file
router.get('/add', getRegistrationPage);
router.post('/add', postCourseID);

//add student using 
router.post('/store-form-data', store_form_info);
router.get('/add-manually/:course_id', addStudentManually);

router.post('/register', postRegistrationData)
router.get('/enroll', saveEnrollData)
router.get('/students/:id/edit', studentAuthMiddleware, editStudent)
router.post('/:id/update', studentAuthMiddleware, updateStudent)
router.get('/students/:id/', studentAuthMiddleware, profile)

router.post('/upload', uploadStudentInfo);

router.get('/courses', studentAuthMiddleware, getAllCourses);

router.get('/attendances', showAllCourses);
router.get('/attendance/courses/:course_id', studentAuthMiddleware, showCourseAttendance);



module.exports = router;