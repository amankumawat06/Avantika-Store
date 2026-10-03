export const isAdmin = (req, res, next) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message: "You don't have access of this page!",
    });
  }
  next();
};
