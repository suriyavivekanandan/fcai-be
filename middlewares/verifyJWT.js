import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";

export const verifyTokenAndExtractOrgId = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.organizationId = decoded.organizationId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error?.message || "Invalid access token" });
  }
};

export const verifyPermission = (roles = []) => async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    if (roles.includes(req.user?.role)) {
      next();
    } else {
      return res.status(403).json({ message: "You are not allowed to perform this action" });
    }
  } catch (error) {
    next(error);
  }
};