import { Router } from 'express';
import { ensureRole } from '../middleware/auth.js';
import { Szerelo } from '../models/index.js';

const router = Router();


router.get('/', async (req, res) => {
  const szerelok = await Szerelo.findAll({ order: [['az', 'ASC']] });
  res.render('szerelo/list', { szerelok, title: 'Szerelők (CRUD)' });
});


router.get('/new', ensureRole('admin'), (req, res) => {
  res.render('szerelo/new', { title: 'Új szerelő' });
});

router.post('/', ensureRole('admin'), async (req, res) => {
  const { az, nev, kezdev } = req.body;
  await Szerelo.create({ az, nev, kezdev });
  req.flash('success', 'Szerelő felvéve.');
  res.redirect('/szerelok');
});

router.get('/:az/edit', ensureRole('admin'), async (req, res) => {
  const szerelo = await Szerelo.findByPk(req.params.az);
  if (!szerelo) {
    req.flash('error', 'Nincs ilyen szerelő.');
    return res.redirect('/szerelok');
  }
  res.render('szerelo/edit', { szerelo, title: 'Szerelő szerkesztése' });
});

router.put('/:az', ensureRole('admin'), async (req, res) => {
  const { nev, kezdev } = req.body;
  await Szerelo.update({ nev, kezdev }, { where: { az: req.params.az } });
  req.flash('success', 'Módosítva.');
  res.redirect('/szerelok');
});

router.delete('/:az', ensureRole('admin'), async (req, res) => {
  await Szerelo.destroy({ where: { az: req.params.az } });
  req.flash('success', 'Törölve.');
  res.redirect('/szerelok');
});

export default router;
