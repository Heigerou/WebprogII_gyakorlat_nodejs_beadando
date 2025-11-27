import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User } from '../models/index.js';

const router = Router();


const BASE_PATH = '/app152';

router.get('/register', (req, res) =>
  res.render('auth/register')
);

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Hi�nyz� adatok');
    return res.redirect(`${BASE_PATH}/auth/register`);
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash: hash });
    req.flash('success', 'Sikeres regisztr�ci�! Jelentkezz be.');
    res.redirect(`${BASE_PATH}/auth/login`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba t�rt�nt a regisztr�ci� sor�n.');
    res.redirect(`${BASE_PATH}/auth/register`);
  }
});

router.get('/login', (req, res) =>
  res.render('auth/login')
);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: `${BASE_PATH}/`,
    failureRedirect: `${BASE_PATH}/auth/login`,
    failureFlash: true,
  }),
);

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Kijelentkezt�l.');
    res.redirect(`${BASE_PATH}/`);
  });
});

export default router;
