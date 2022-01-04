import jwt from 'express-jwt';

export const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};
export const getTokenFromSocketHeaders = (req) => {
  const { headers } = req;
  const token = headers['sec-websocket-protocol'];
  if (token && token.split(' ')[0] === 'Bearer') {
    return token.split(' ')[1];
  }

  return token;
};

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET,
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

export default auth;
