const env = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/api',
  PORT: process.env.PORT || 8080,
};

export { env };
