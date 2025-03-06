const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,

  CORS_ORIGIN: process.env.CORS_ORIGIN,
  API_HOST: process.env.API_HOST,

  SALT_ROUNDS: process.env.SALT_ROUNDS,
  FRONTEND_URL: process.env.FRONTEND_URL,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  OTP_EXPIRY: process.env.OTP_EXPIRY,


  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS

}

export default config
