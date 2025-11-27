import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import morgan from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
dotenv.config();

import './config/passport.js';
import { sequelize } from './models/index.js';

import mainRoutes from './routes/main.js';
import authRoutes from './routes/auth.js';
import szereloRoutes from './routes/szerelo.js';
import munkalapRoutes from './routes/munkalap.js';
import messageRoutes from './routes/messages.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


const BASE_PATH = '/app152';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

// statikus fájlok: /app152/assets/...
app.use(BASE_PATH, express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'valami-titok',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// view-kben elérhetõ legyen a basePath
app.use((req, res, next) => {
  res.locals.basePath = BASE_PATH;
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// MINDEN route /app152 ra vezetve ( az enyémre csináljtam meg)
app.use(BASE_PATH, mainRoutes);
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/szerelok`, szereloRoutes);
app.use(`${BASE_PATH}/munkalapok`, munkalapRoutes);
app.use(`${BASE_PATH}/messages`, messageRoutes);
app.use(`${BASE_PATH}/admin`, adminRoutes);

app.get(`${BASE_PATH}/health`, async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ status: 'db_error', message: e.message });
  }
});

export default app;
