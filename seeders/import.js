import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, Hely, Szerelo, Munkalap } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseTSV(filePath){
  const raw = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/);
  const header = raw.shift().split('\t').map(h=>h.trim());
  return raw.map(line=>{
    const cols = line.split('\t');
    const obj = {};
    header.forEach((h,i)=> obj[h.trim()] = (cols[i]||'').trim());
    return obj;
  });
}

function toISO(dstr){
  const m = dstr.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if(!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

async function run(){
  await sequelize.sync();

  const helyek = parseTSV(path.join(__dirname,'../data/hely.txt'));
  await Hely.destroy({ where:{} });
  await Hely.bulkCreate(helyek.map(r=>({ az: +r['az'], telepules: r['telepules'], utca: r['utca'] })));

  const szerelok = parseTSV(path.join(__dirname,'../data/szerelo.txt'));
  await Szerelo.destroy({ where:{} });
  await Szerelo.bulkCreate(szerelok.map(r=>({ az: +r['az'], nev: r['nev'], kezdev: +r['kezdev'] })));

  const munkalapok = parseTSV(path.join(__dirname,'../data/munkalap.txt'));
  await Munkalap.destroy({ where:{} });
  await Munkalap.bulkCreate(munkalapok.map(r=>({
    bedatum: toISO(r['bedatum']),
    javdatum: toISO(r['javdatum']),
    helyaz: +r['helyaz'],
    szereloaz: +r['szereloaz'],
    munkaora: +r['munkaora'],
    anyagar: +r['anyagar']
  })));

  console.log('Import ksz.');
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
