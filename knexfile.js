// Update with your config settings.

require("dotenv").config();

module.exports = {
  development: {
    debug: true,
    client: "pg",
    connection: {
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: `./src/db/migrations`,
    },
    seeds: {
      directory: `./src/db/seeds`,
    },
  },
  test: {
    debug: true,
    client: "pg",
    connection: {
      database: process.env.POSTGRES_DB_TEST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: `./src/db/migrations`,
    },
    seeds: {
      directory: `./src/db/seeds`,
    },
  },
  production: {
    debug: true,
    client: "pg",
    connection: {
      database: process.env.POSTGRES_DB_PROD,
      user: process.env.POSTGRES_USER_PROD,
      password: process.env.POSTGRES_PASSWORD_PROD,
      port: process.env.POSTGRES_PORT_PROD,
      host: process.env.POSTGRES_HOST_PROD,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: `./src/db/migrations`,
    },
    seeds: {
      directory: `./src/db/seeds`,
    },
  },
};
