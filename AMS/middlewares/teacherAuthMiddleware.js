function teacherAuthMiddleware(req, res, next) {
    if (req.session.teacher_id || req.session.student_id) {
        next();
    } else {
        res.status(401).send('You are not logged in! Unauthorized');
    }
}

module.exports = teacherAuthMiddleware