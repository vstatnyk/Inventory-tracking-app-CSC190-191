const admin = require("../../config/FirebaseConfig");

// Middleware to authorize user based on role
const authorizeUser = (accessLevelRequired) => {
  return async (req, res, next) => {
    const user = await admin.auth().getUser(req.user.uid);
    if (user.customClaims.accessLevel >= accessLevelRequired) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  };
};

module.exports = authorizeUser;
