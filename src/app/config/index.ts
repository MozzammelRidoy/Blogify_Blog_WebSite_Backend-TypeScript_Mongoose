import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') })

// Export configuration settings from environment variables
export default {
  NODE_ENV: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 5000,
  database_url: process.env.DATA_BASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_access_token_expiry: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  jwt_refresh_token_expiry: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
}
