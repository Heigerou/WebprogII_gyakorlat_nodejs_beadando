import app from './server.js';
import { ensureDbReady } from './scripts/initdb.js';


const PORT = 4152;

await ensureDbReady();

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
  console.log(`Elérés kívülről: http://143.47.98.96/app152/`);
});
