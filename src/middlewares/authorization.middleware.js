const { ForbiddenError } = require('../utils/ApiError');

/**
 * Authorization Middleware: "are you allowed to do this?"
 * Runs AFTER authenticate(), which sets req.user.
 * Usage: router.delete('/:id', authenticate, authorize('admin'), ctrl.remove)
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    // Programmer error: authorize() used without authenticate() before it.
    return next(new ForbiddenError('Authentication is required before authorization'));
  }
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ForbiddenError('You do not have permission to perform this action'));
  }
  next();
};

/**
 * Ownership check: lets a user act on their own resource even without
 * an elevated role (e.g. delete your own message), OR any allowed role.
 */
const authorizeOwnerOrRoles = (getOwnerId, ...allowedRoles) => (req, res, next) => {
  if (!req.user) return next(new ForbiddenError('Authentication is required'));
  const ownerId = getOwnerId(req);
  if (req.user._id === ownerId || allowedRoles.includes(req.user.role)) {
    return next();
  }
  next(new ForbiddenError('You do not have permission to perform this action'));
};

module.exports = { authorize, authorizeOwnerOrRoles };
