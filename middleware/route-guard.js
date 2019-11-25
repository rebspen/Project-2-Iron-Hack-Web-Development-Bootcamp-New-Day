module.exports = (req, res, next) => {
  const userId = req.session;
    if (userId) {
      next();
    } else {
      next(new Error('User has no permission to visit that page.'));
    }
  };