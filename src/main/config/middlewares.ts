import { Express } from 'express';
import { bodyParser } from '../middlewares/body-parser';
import { contentType } from '../middlewares/content-type';
import { cors } from '../middlewares/cors';

const midldewares = (app: Express): void => {
  app.use(cors);
  app.use(contentType);
  app.use(bodyParser);
};

export { midldewares };
