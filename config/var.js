const dotenv = require("dotenv");

dotenv.config();

const config = {
  app: {
    port: parseInt(process.env.PORT),
    jwt_key: process.env.JWT_SECRET_KEY,
    base_url: process.env.BASE_URL,
    app_url: process.env.APP_URL
  },
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dbUrl: process.env.DB_URL,
  },
  mail: {
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    service: process.env.MAIL_SERVICE,
    from: process.env.MAIL_FROM,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    siteLink: process.env.SITE_LINK
  },
  razorpay: {
    id: process.env.RAZOR_PAY_KEY_ID,
    secret: process.env.RAZOR_PAY_KEY_SECRET,
  }
};

module.exports = config;
