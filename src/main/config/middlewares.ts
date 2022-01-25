import { Express } from 'express';
import { bodyParser, contentType, cors } from '../middlewares';

const midldewares = (app: Express): void => {
  app.use(cors);
  app.use(contentType);
  app.use(bodyParser);
};

export { midldewares };
