import jwt from 'jsonwebtoken';

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

const generateJWT = ({ id, email, name, Role }) =>
  jwt.sign(
    {
      id,
      email,
      name,
      role: Role.name,
      // exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    process.env.JWT_SECRET
  );
module.exports = generateJWT;
