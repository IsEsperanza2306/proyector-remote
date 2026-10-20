const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

const ADB = 'C:\\Users\\Surface\\Downloads\\platform-tools-latest-windows\\platform-tools\\adb.exe';
const DEVICE = '192.168.1.3:5555';

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

function adb(cmd) {
  return new Promise((resolve, reject) => {
    const full = `"${ADB}" -s ${DEVICE} ${cmd}`;
    exec(full, (err, stdout, stderr) => {
      if (err) reject(stderr || err.message);
      else resolve(stdout.trim());
    });
  });
}

// Keycodes
const KEYS = {
  up: 19, down: 20, left: 21, right: 22,
  ok: 23, back: 4, home: 3, menu: 82,
  vol_up: 24, vol_down: 25,
  play_pause: 85, mute: 164,
  del: 67
};

// Apps
const APPS = {
  youtube:  'com.google.android.youtube.tv',
  netflix:  'com.netflix.mediaclient',
  disney:   'com.disney.disneyplus',
  amazon:   'com.amazon.amazonvideo.livingroom',
  hbomax:   'com.wbd.stream',
  hdmi:     'com.softwinner.awsource',
  keystone: 'ashd.rockchip.keystone'
};

app.post('/key/:name', async (req, res) => {
  const code = KEYS[req.params.name];
  if (!code) return res.status(400).json({ error: 'unknown key' });
  try {
    await adb(`shell input keyevent ${code}`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.post('/type', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'no text' });
  try {
    // Encode spaces and special chars
    const safe = text.replace(/\\/g, '\\\\').replace(/ /g, '%s').replace(/'/g, "\\'");
    await adb(`shell input text '${safe}'`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.post('/launch/:app', async (req, res) => {
  const pkg = APPS[req.params.app];
  if (!pkg) return res.status(400).json({ error: 'unknown app' });
  try {
    await adb(`shell monkey -p ${pkg} -c android.intent.category.LAUNCHER 1`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.get('/status', async (req, res) => {
  try {
    const result = await adb('devices');
    res.json({ connected: result.includes(DEVICE) });
  } catch (e) {
    res.json({ connected: false });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Control remoto activo en http://localhost:${PORT}`);
  console.log(`📱 Desde tu teléfono (misma WiFi): http://<IP-de-tu-PC>:${PORT}\n`);
});
