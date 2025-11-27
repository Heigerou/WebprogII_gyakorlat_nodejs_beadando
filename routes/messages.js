import { Router } from 'express';
import { ensureLoggedIn } from '../middleware/auth.js';
import { ensureRole } from '../middleware/auth.js';
import { DataTypes } from 'sequelize';
import { sequelize } from '../models/index.js';

const Uzenet = sequelize.define('Uzenet', {
  id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
  name: { type: DataTypes.STRING, allowNull:false },
  email: { type: DataTypes.STRING, allowNull:false },
  content: { type: DataTypes.TEXT, allowNull:false },
  sentAt: { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW }
}, { tableName:'uzenet', timestamps:false });

await Uzenet.sync();

const router = Router();

router.post('/', async (req,res)=>{
  const { name, email, content } = req.body;
  await Uzenet.create({ name, email, content });
  req.flash('success','Üzenet elküldve!');
  res.redirect('/kapcsolat');
});

router.get('/', ensureLoggedIn, async (req,res)=>{
  const messages = await Uzenet.findAll({ order:[['sentAt','DESC']] });
  res.render('messages/list', { messages, title:'Üzenetek' });
});

export default router;


router.delete('/:id', ensureRole('admin'), async (req,res)=>{ await Uzenet.destroy({ where:{ id: req.params.id } }); req.flash('success','Üzenet törölve.'); res.redirect('/messages'); });
