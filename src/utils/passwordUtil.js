import crypto from 'crypto';

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

export { generateHash, validatePassword };
