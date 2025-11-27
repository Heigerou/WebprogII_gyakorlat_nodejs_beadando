import { Router } from 'express';
import { ensureRole } from '../middleware/auth.js';
import { User } from '../models/index.js';
const router = Router();

router.get('/', ensureRole('admin'), async (req,res)=>{
  const users = await User.findAll({ order:[['id','ASC']] });
  res.render('admin/index', { users, title:'Admin' });
});

export default router;
