import { sequelize, User } from '../models/index.js';
import bcrypt from 'bcrypt';

async function main(){
  await sequelize.sync({ force:true });
  const adminPass = await bcrypt.hash('admin123',10);
  await User.create({ email:'admin@example.com', passwordHash: adminPass, role:'admin' });
  console.log('DB sync ksz. Admin: admin@example.com / admin123');
  process.exit(0);
}
main().catch(e=>{ console.error(e); process.exit(1); });
