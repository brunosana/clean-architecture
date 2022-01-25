import express from 'express';
import { midldewares as setupMiddlewares } from './middlewares';
import { setupRoutes } from './setupRoutes';

const app = express();
setupMiddlewares(app);
setupRoutes(app);

export { app };
