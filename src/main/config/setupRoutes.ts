import { Express, Router } from 'express';
import fg from 'fast-glob';

const setupRoutes = (app: Express): void => {
  const router = Router();
  fg.sync('**/src/main/routes/**routes.ts').map(async file =>
    (await import(`../../../${file}`)).default(router),
  );
  app.use('/api', router);
};

export { setupRoutes };
