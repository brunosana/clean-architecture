import { Express } from 'express';
import { bodyParser } from '../middlewares/body-parser';
import { cors } from '../middlewares/cors';

const midldewares = (app: Express): void => {
  app.use(cors);
  app.use(bodyParser);
};

export { midldewares };
