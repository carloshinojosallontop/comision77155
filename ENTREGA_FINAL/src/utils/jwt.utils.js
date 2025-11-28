import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "s3cr3t0";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});
