import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../admin/constants.js';

// Middleware to authenticate token from HTTP-only cookie
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Access the token from the cookie

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Attach decoded token data to request object
    next();
  });
};