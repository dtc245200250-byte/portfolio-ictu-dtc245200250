import mysql from 'mysql2/promise';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';

const dbConfig: mysql.PoolOptions = {
  host: process.env.MYSQL_HOST || 'mysql',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'portfolio_user',
  password: process.env.MYSQL_PASSWORD || 'PortfolioSecurePass2026!',
  database: process.env.MYSQL_DATABASE || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

export const pool = mysql.createPool(dbConfig);

export async function testDbConnection(retries = 15, delay = 3000): Promise<boolean> {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await pool.getConnection();
      logger.info(`MySQL database connected successfully on attempt ${i}`);
      conn.release();
      await ensureInitialAdmin();
      return true;
    } catch (error: any) {
      logger.warn(`MySQL connection attempt ${i}/${retries} failed: ${error.message}. Retrying in ${delay / 1000}s...`);
      if (i === retries) {
        logger.error('Could not connect to MySQL after maximum retries', { error: error.message });
        return false;
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  return false;
}

async function ensureInitialAdmin(): Promise<void> {
  const username = process.env.INITIAL_ADMIN_USERNAME || 'admin';
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecurePassword2026!';
  const email = process.env.INITIAL_ADMIN_EMAIL || 'phantung121206@gmail.com';
  const fullName = process.env.INITIAL_ADMIN_FULLNAME || 'Phan Quang Tùng';

  try {
    const [rows]: [any[], any] = await pool.query('SELECT id FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await pool.query(
        'INSERT INTO admins (username, password_hash, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
        [username, hash, fullName, email, 'superadmin']
      );
      logger.info(`Initialized default admin account: ${username}`);
    }
  } catch (error: any) {
    logger.error('Error ensuring initial admin account:', { error: error.message });
  }
}
