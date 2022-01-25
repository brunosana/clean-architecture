import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeSignUpController } from '../factories/signup';

export default (router: Router): void => {
  // eslint-disable-next-line
  router.post('/signup', adaptRoute(makeSignUpController()));
};
