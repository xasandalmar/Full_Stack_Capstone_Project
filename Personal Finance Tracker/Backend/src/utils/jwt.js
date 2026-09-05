import jwt from 'jsonwebtoken';

const getSecret = () => process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_12345!';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};
