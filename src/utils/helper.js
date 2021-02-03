import crypto from 'crypto';

import jwt from 'jsonwebtoken';

/**
 * Validates that the provided password matches the hashed counterpart
 *
 * @category validation
 * @param {String} password The password provided by the user
 * @param {String} hashedPassword The password stored in your db
 * @returns {Boolean}
 */
const validatePassword = (password, hashedPassword) => password === hashedPassword;

// Hashed passwords !
// const hash = crypto.pbkdf2Sync(password, process.env.SALT, 10000, 512, 'sha512').toString('hex');
// return hash === hashedPassword;
/**
 * Generates Hash for the user password
 *
 * @category validation
 * @param {String} password The password provided by the user
 * @returns {String} password The hashed password
 */
const generateHash = (password) =>
  crypto.pbkdf2Sync(password, process.env.SALT, 10000, 64, 'sha512').toString('hex');

/**
 * generate the json web token that we'll use for authentication
 *
 * @since 1.0.0
 * @category authentication
 * @param    {Any} id The user ID
 * @param    {String} email The email of the user
 * @param    {String} name The name of the user
 * @param    {String} surname The surname of the user
 * @returns  {Object} The generated JWT
 */

const generateJWT = ({ id, email, name, role }) =>
  jwt.sign(
    {
      id,
      email,
      name,
      role,
    },
    process.env.JWT_SECRET
  );

const getErrorMessages = (joiErrorObject) => joiErrorObject.error.details.map((e) => e.message);
export { generateHash, validatePassword, generateJWT, getErrorMessages };
