import fs from 'fs';
import path from 'path';

const REGISTRY_DIR = path.join(process.cwd(), 'registry', 'bots');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'directory.json');

function compileRegistry() {
  console.log('Compiling Bot Registry...');
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  if (!fs.existsSync(REGISTRY_DIR)) {
    console.error(`Registry directory not found at ${REGISTRY_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(REGISTRY_DIR).filter(file => file.endsWith('.json'));
  const bots = [];

  for (const file of files) {
    try {
      const filePath = path.join(REGISTRY_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const bot = JSON.parse(content);
      
      // Basic validation
      if (!bot.id || !bot.name) {
        console.warn(`Skipping ${file}: Missing id or name`);
        continue;
      }
      
      bots.push(bot);
    } catch (err) {
      console.error(`Error parsing ${file}:`, err.message);
    }
  }

  const directoryData = {
    last_updated: new Date().toISOString(),
    total_bots: bots.length,
    bots: bots.sort((a, b) => {
      // Sort featured bots first, then by name
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    })
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(directoryData, null, 2));
  console.log(`Successfully compiled ${bots.length} bots to ${OUTPUT_FILE}`);
}

compileRegistry();
