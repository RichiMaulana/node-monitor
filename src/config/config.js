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
    define: {
      timestamps: false,
    },
  },
  production: {
    database: env.DB_NAME_PROD,
    username: env.DB_USER_PROD,
    password: env.DB_PASSWORD_PROD,
    dialect: env.DB_TYPE_PROD || "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    define: {
      timestamps: false,
      logging: false,
    },
  },
};
