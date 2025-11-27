import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

/** Auth felhasznlk */
export const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull:false, unique:true },
  passwordHash: { type: DataTypes.STRING, allowNull:false },
  role: { type: DataTypes.ENUM('registered','admin'), defaultValue: 'registered' }
});

/** Feladat adatbzisa */
export const Hely = sequelize.define('Hely', {
  az: { type: DataTypes.INTEGER, primaryKey:true },
  telepules: { type: DataTypes.STRING, allowNull:false },
  utca: { type: DataTypes.STRING, allowNull:false }
}, { tableName:'hely', timestamps:false });

export const Szerelo = sequelize.define('Szerelo', {
  az: { type: DataTypes.INTEGER, primaryKey:true },
  nev: { type: DataTypes.STRING, allowNull:false },
  kezdev: { type: DataTypes.INTEGER, allowNull:false }
}, { tableName:'szerelo', timestamps:false });

export const Munkalap = sequelize.define('Munkalap', {
  az: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
  bedatum: { type: DataTypes.DATEONLY, allowNull:false },
  javdatum: { type: DataTypes.DATEONLY, allowNull:false },
  munkaora: { type: DataTypes.INTEGER, allowNull:false },
  anyagar: { type: DataTypes.INTEGER, allowNull:false }
}, { tableName:'munkalap', timestamps:false });

Hely.hasMany(Munkalap, { foreignKey:'helyaz' });
Munkalap.belongsTo(Hely, { foreignKey:'helyaz' });

Szerelo.hasMany(Munkalap, { foreignKey:'szereloaz' });
Munkalap.belongsTo(Szerelo, { foreignKey:'szereloaz' });

export { sequelize };
