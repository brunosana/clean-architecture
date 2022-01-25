import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import dotenv from 'dotenv';

dotenv.config();
MongoHelper.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Database connected...');
    const app = (await import('./config/app')).app;
    app.listen(process.env.PORT, () => {
      console.log('Server started on port 8080...');
    });
  })
  .catch(console.error);
