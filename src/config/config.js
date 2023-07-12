require("dotenv").config({ path: __dirname + "/../../.env" });

const { env } = process;

module.exports = {
  development: {
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    dialect: env.DB_TYPE || "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    logging: env.DB_LOGGING === 'true' ? true : false,
    define: {
      timestamps: false,
    },
  },
  production: {
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    dialect: env.DB_TYPE || "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    logging: false,
    define: {
      timestamps: false,
    },
  },
};