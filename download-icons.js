const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'youtube.png',  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png' },
  { name: 'netflix.png',  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/120px-Netflix_2015_logo.svg.png' },
  { name: 'disney.png',   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/120px-Disney%2B_logo.svg.png' },
  { name: 'amazon.png',   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/120px-Amazon_Prime_Video_logo.svg.png' },
];

const dest = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, filepath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { fs.unlink(filepath, () => {}); reject(err); });
  });
}

(async () => {
  for (const icon of icons) {
    const filepath = path.join(dest, icon.name);
    try {
      await download(icon.url, filepath);
      console.log(`✅ ${icon.name}`);
    } catch (e) {
      console.log(`❌ ${icon.name}: ${e.message}`);
    }
  }
  console.log('\nDone. Ahora reinicia el servidor.');
})();
