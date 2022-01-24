import express from 'express';
import { midldewares as setupMiddlewares } from './middlewares';

const app = express();
setupMiddlewares(app);

export { app };
