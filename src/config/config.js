module.exports = {
  development: {
    // dialect: 'sqlite',
    // storage: './db.development.sqlite'
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'datics@123',
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOSTNAME || 'localhost',
    type: 'default',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    // schema: 'boilerplate_db',
    logging: true,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    use_env_variable: 'DATABASE_URL',
  },
};
