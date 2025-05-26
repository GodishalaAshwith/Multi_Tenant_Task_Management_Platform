const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: "You don't have permission to perform this action" 
      });
    }

    next();
  };
};

module.exports = checkRole;
