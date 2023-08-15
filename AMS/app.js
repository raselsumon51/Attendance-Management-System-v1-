const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const port = 3001;
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware and configurations
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set a different layout as the default
app.set('layout', 'layouts/layout');


// Session configuration
const store = new MongoStore({
    // url: 'mongodb://127.0.0.1:27017/attendance',
    url: "mongodb+srv://raselsumon51:enPAmPa3oRxTsOCW@cluster0.nngte0p.mongodb.net/attendance?retryWrites=true&w=majority",
    ttl: 604800 // 7 days
});

app.use(
    session({
        secret: 'ljfkfkkrkririejdbc',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
        store: store
    })
);
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

const logSessionData = (req, res, next) => {
    console.log('Session Data: ', req.session);
    next();
};

app.use(logSessionData);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes

    // Determine the response status code
    const statusCode = err.statusCode || 500;

    // Send a response to the client
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
            path: req.path
        }
    });
});

// Routes
app.use('/admin-dashboard', adminRoutes);
app.use('/course', courseRoutes);
app.use('/teacher', teacherRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/students-dashboard', studentRoutes);

app.get('/', function (req, res) {
    res.render('Homepage/homePage.ejs', { layout: false });
});

// Database connection
mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://127.0.0.1:27017/attendance');
mongoose.connect("mongodb+srv://raselsumon51:enPAmPa3oRxTsOCW@cluster0.nngte0p.mongodb.net/attendance?retryWrites=true&w=majority");


// Start the server
app.listen(port, () => {
    console.log(`Express app listening on port http://localhost:${port}`);
});
