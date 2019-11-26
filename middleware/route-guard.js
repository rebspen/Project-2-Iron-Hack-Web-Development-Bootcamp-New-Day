module.exports = (req, res, next) => {
  const userId = req.session.user;
    if (userId && req.user.status === "Active" ) {
      next();
    } else {
      next(new Error('User has no permission to visit that page.'));
    }
  };