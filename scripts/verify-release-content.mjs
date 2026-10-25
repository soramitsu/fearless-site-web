import fs from 'node:fs';

const requiredContent = [
  ['src/pages/index.vue', ['Universal Wallet', 'Bitcoin', 'Solana', 'TON', 'SORA Nexus', 'Taira']],
  ['src/pages/download.vue', ['self-custody', 'browser extension', 'iOS', 'Android', 'GitHub']],
  ['src/pages/roadmap.vue', ['Universal Wallet', 'Bitcoin', 'Solana', 'Taira', 'SORA Nexus']],
  ['src/lib/networks.ts', ['bitcoin:', 'solana:', 'nexus:', 'taira:', 'si.soramitsu.io']],
  ['src/components/Network/networks.ts', ['"slug": "bitcoin"', '"slug": "solana"', '"slug": "nexus"', '"slug": "taira"']],
];

let failed = false;

for (const [file, needles] of requiredContent) {
  const content = fs.readFileSync(file, 'utf8');

  for (const needle of needles) {
    if (!content.includes(needle)) {
      console.error(`${file} is missing required release content: ${needle}`);
      failed = true;
    }
  }
}

for (const file of ['src/public/networks/bitcoin.svg', 'src/public/networks/solana.svg']) {
  if (!fs.existsSync(file)) {
    console.error(`${file} is missing`);
    failed = true;
  }
}

// These short links expired and now serve a 404 page. Link to the stores
// through src/lib/appLinks.ts instead.
const expiredLinkHosts = ['qrcodes.pro'];
const sourceFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = `${dir}/${entry.name}`;
  return entry.isDirectory() ? sourceFiles(path) : [path];
});

for (const file of sourceFiles('src').filter(file => /\.(vue|ts|md|json|html)$/.test(file))) {
  const content = fs.readFileSync(file, 'utf8');

  for (const host of expiredLinkHosts) {
    if (content.includes(host)) {
      console.error(`${file} links to the expired short-link host ${host}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);

console.log('Release content verification passed.');
