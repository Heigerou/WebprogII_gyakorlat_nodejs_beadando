import { Router } from 'express';
const router = Router();

router.get('/', (req,res)=>{
  res.render('pages/index', { title: 'Jani&Szabi Kft.  Főldal' });
});

router.get('/kapcsolat', (req,res)=>{
  res.render('pages/kapcsolat', { title: 'Kapcsolat' });
});

export default router;
