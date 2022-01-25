import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import { env } from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    console.log('Database connected...');
    const app = (await import('./config/app')).app;
    app.listen(env.PORT, () => {
      console.log('Server started on port 8080...');
    });
  })
  .catch(console.error);
