import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'db.sqlite');

function runNode(script, args = []){
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [script, ...args], { stdio: 'inherit' });
    p.on('exit', code => code === 0 ? resolve() : reject(new Error(script + ' exited ' + code)));
  });
}

export async function ensureDbReady(){
  const exists = fs.existsSync(dbPath);
  if (exists && process.env.FORCE_DB_INIT !== '1') {
    return; 
  }
  console.log(exists ? '[initdb] FORCE_DB_INIT=1 -> reinitializing DB' : '[initdb] First start: initializing DB');
  await runNode(path.join(__dirname, '..', 'seeders', 'sync.js'));
 
  await runNode(path.join(__dirname, '..', 'seeders', 'import.js'));
  console.log('[initdb] Database initialized.');
}
