const config = {
  port: process.env.PORT || 3000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  databaseUrl: process.env.DATABASE_URL || ':memory:'
};

module.exports = config;