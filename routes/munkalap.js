import { Router } from 'express';
import { Munkalap, Hely, Szerelo } from '../models/index.js';

const router = Router();

router.get('/', async (req,res)=>{
  const allowed = [20, 50, 100, 200];
  let limit = parseInt(req.query.limit || '20', 10);
  if (!allowed.includes(limit)) limit = 20;
  let page = parseInt(req.query.page || '1', 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * limit;

  const { rows, count } = await Munkalap.findAndCountAll({
    include:[Hely, Szerelo],
    order:[['bedatum','DESC']],
    limit,
    offset
  });

  const totalPages = Math.max(1, Math.ceil(count / limit));
  res.render('munkalap/list', {
    munkalapok: rows,
    title: 'Munkalapok táblázata',
    limit, page, totalPages, count, offset
  });
});

export default router;
