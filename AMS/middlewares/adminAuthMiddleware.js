function teacherAuthMiddleware(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.status(401).send('You are not logged in! or Unauthorized');
    }
}

module.exports = teacherAuthMiddleware