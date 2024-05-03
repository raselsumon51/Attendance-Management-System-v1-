// library imports
const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
require("dotenv").config();


// student1 model
const Student1 = require('./models/Student1.model');


//env variables
const port = process.env.PORT; // Use environment variable for port
const DATABASE_URL = process.env.DATABASE_URL;

//create main app
const app = express();

// Middleware 
app.use(expressLayouts);
app.use(express.static("public"));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");


//  Session configuration
app.use(
  session({
    secret: "ljfkfkkrkririejdbc",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  })
);


// Set session data to be available globally
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});




//define routes
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendance");

// use Routes
app.use("/admin-dashboard", adminRoutes);
app.use("/course", courseRoutes);
app.use("/teacher", teacherRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/students-dashboard", studentRoutes);

// home page render
app.get("/", function (req, res) {
  res.render("Homepage/Homepage.ejs", { layout: './layouts/layout',  error_message : "" });
});

app.post("/", async function (req, res) {
      
  try {
    let { email, pswd } = req.body;
    
    const student = await Student1.find({ email: email, password: pswd });

    if (student.length != 0) {
        req.session.student_email = email;
        req.session.student_id = student[0]._id;
        res.redirect('/students-dashboard');
    } else {
        // res.send("Email and password are not matched or You are not a Student!");
        res.render('Homepage/Homepage',{
            layout: './layouts/layout',
            error_message : "Email and password did not match!"
    });
    }
} catch (error) {
    console.log(error);
}
 
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err); 
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      path: req.path,
    },
  });
});

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Connect to the database before listening
connectDB().then(() => {
  app.listen(port, () => {
    console.log("Listening on 3001 port");
  });
});
