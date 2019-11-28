module.exports = (req, res, next) => {
  const userId = req.session.user;
  console.log("userId, req.user", userId, req.user);
    if (userId && req.user.status === "Active" ) {
      next();
    } else {
      next(new Error('User has no permission to visit that page - make sure you have verified your eamil and logged in.'));
    }
  };