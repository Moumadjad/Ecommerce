import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const optionalAuth = async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch {
    // Invalid or expired token on a public route: proceed unauthenticated.
  }

  next();
};

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
