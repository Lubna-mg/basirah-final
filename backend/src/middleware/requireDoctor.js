export const requireDoctor = (req, res, next) => {
  if (!req.doctor) {
    return res.status(401).json({ message: "غير مصرح" });
  }
  next();
};
