const path = require('path');
const fs = require('fs');

const uiDir = path.join(__dirname, 'src/components/ui');
console.log('UI directory:', uiDir);
console.log('Files:', fs.readdirSync(uiDir).slice(0, 10));

const indexPath = path.join(uiDir, 'index.ts');
console.log('\nindex.ts content:');
console.log(fs.readFileSync(indexPath, 'utf8').split('\n').slice(0, 20).join('\n'));
