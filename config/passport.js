import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

passport.use(new LocalStrategy({ usernameField:'email' }, async (email, password, done)=>{
  try {
    const u = await User.findOne({ where:{ email } });
    if(!u) return done(null,false,{message:'Ismeretlen e-mail vagy jelsz.'});
    const ok = await bcrypt.compare(password, u.passwordHash);
    if(!ok) return done(null,false,{message:'Ismeretlen e-mail vagy jelsz.'});
    return done(null,u);
  } catch(e){ return done(e); }
}));

passport.serializeUser((u,done)=>done(null,u.id));
passport.deserializeUser(async (id,done)=>{
  try{ const u = await User.findByPk(id); done(null,u); } catch(e){ done(e); }
});
