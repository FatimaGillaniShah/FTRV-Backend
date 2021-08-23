import { BadRequestError, getErrorMessages } from './helper';
import { STATUS_CODES } from './constants';

const Request = (target, key, descriptor) => {
  const controllerFunc = descriptor.value;
  // eslint-disable-next-line no-param-reassign
  descriptor.value = async (...args) => {
    try {
      await controllerFunc.apply(this, args);
    } catch (error) {
      const [, , next] = args;
      next(error);
    }
  };
};

const RequestBodyValidator = (validatePayloadFunc) => {
  const actualDecorator = (target, key, descriptor) => {
    const controllerFunc = descriptor.value;
    // eslint-disable-next-line no-param-reassign
    descriptor.value = (...args) => {
      const [req] = args;
      const result = validatePayloadFunc(req);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      controllerFunc.apply(target, args);
    };
    return descriptor;
  };
  return actualDecorator;
};

export { Request, RequestBodyValidator };
