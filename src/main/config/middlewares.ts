import { Express } from 'express';
import { bodyParser } from '../middlewares/body-parser';

const midldewares = (app: Express): void => {
  app.use(bodyParser);
};

export { midldewares };
