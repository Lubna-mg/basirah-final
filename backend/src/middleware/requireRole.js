/**
 * Middleware للتحقق من الصلاحيات حسب الدور
 * @param {string | string[]} roles
 */
export const requireRole = (roles) => {
  // توحيد الشكل إلى array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403);
      return next(new Error("Access denied"));
    }
    next();
  };
};
