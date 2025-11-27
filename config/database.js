import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const url = process.env.DATABASE_URL || 'sqlite:db.sqlite';
export const sequelize = new Sequelize(url, { logging: false });
