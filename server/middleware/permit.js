// middleware/permit.js
export function permit(...allowedRoles) {
  return (req, res, next) => {
    if (allowedRoles.includes(req.userRole)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: insufficient rights' });
  };
}
