const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.resolve(__dirname);

const heroData = {
  counter: 14826,
  serverLoad: '24%',
  syncStatus: 'OK',
};

const features = [
  { icon: 'fa-solid fa-database', title: 'Cheat Vault', description: 'Access a premium library of verified cheat codes, rapid-fire exploits, and hidden debug toggles.' },
  { icon: 'fa-solid fa-bug', title: 'Exploit Tracker', description: 'Monitor live exploit feeds, patch bypass alerts, and game-breaking glitch intel in real time.' },
  { icon: 'fa-solid fa-magnifying-glass', title: 'Quick Search', description: 'Find the exact cheat, tool, or game modifier instantly with advanced filter search and keyword matching.' },
  { icon: 'fa-solid fa-shield-halved', title: 'Encrypted Vault', description: 'Keep your custom cheat profiles, patched presets, and dev configs locked behind hacker-grade encryption.' },
  { icon: 'fa-solid fa-crosshairs', title: 'Stealth Mode', description: 'Run stealth-enabled cheats and bypass detection by blending into the game like a ghost.' },
  { icon: 'fa-solid fa-wave-square', title: 'Live Hack Pulse', description: 'Get live updates for trending cheats, network drops, and system health from the underground grid.' },
  { icon: 'fa-solid fa-robot', title: 'AI Cheat Bot', description: 'Query the terminal for auto-detected exploits, custom cheat recommendations, and instant loadout builds.' },
  { icon: 'fa-solid fa-terminal', title: 'Terminal Console', description: 'Open a console-style command center to inject, verify, and control cheats like an elite hacker.' },
  { icon: 'fa-solid fa-shield-virus', title: 'Patch Bypass', description: 'Use adaptive bypass logic to stay ahead of game updates, anti-cheat changes, and patch rollouts.' },
  { icon: 'fa-solid fa-gauge-high', title: 'Performance Override', description: 'Optimize framerate, latency, and resource loads while cheats run, preserving speed and stability.' },
  { icon: 'fa-solid fa-rocket', title: 'Latency Optimizer', description: 'Lower input lag and network jitter with smart packet smoothing for competitive advantage.' },
  { icon: 'fa-solid fa-microchip', title: 'Auto Injector', description: 'Deploy code injections automatically on launch, with safe rollback and version control.' },
  { icon: 'fa-solid fa-user-secret', title: 'Ghost Mode', description: 'Hide cheat activity from dashboards and logs with a stealth shield that masks your terminal footprint.' },
  { icon: 'fa-solid fa-lock', title: 'Secure Backdoor', description: 'Maintain a hidden fallback channel to restore cheats and access even under heavy anti-cheat pressure.' },
  { icon: 'fa-solid fa-eye-slash', title: 'Ghost Injector', description: 'Inject code invisibly with a stealth loader that avoids detection and minimizes system impact.' },
  { icon: 'fa-solid fa-list-check', title: 'Command Queue', description: 'Queue cheat commands, schedule injections, and execute complex cheat workflows automatically.' },
];

const dashboardData = {
  activeSessions: '7,482',
  networkStability: '98.7%',
  exploitAlerts: '12 Live',
  cheatStream: [
    'ACCESS_GRANTED → 0x4F2A',
    'NOCLIP activated in Halo',
    'GODMODE patched on latest build',
    'AIMBOT.exe deployed in Valorant',
    'LEVELUP sequence queued',
  ],
};

const chartData = {
  labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  datasets: [
    {
      label: 'Cheat Activation Rate',
      data: [45, 58, 71, 85, 82, 93, 99],
      borderColor: '#00f0ff',
      backgroundColor: 'rgba(0, 255, 136, 0.5)',
      borderWidth: 3,
      pointBackgroundColor: '#ff008c',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00f0ff',
      pointRadius: 5,
      pointHoverRadius: 8,
      fill: true,
      tension: 0.36,
    },
  ],
};

app.use(express.json());
app.use(express.static(publicPath));

app.get('/api/hero', (req, res) => {
  res.json(heroData);
});

app.get('/api/features', (req, res) => {
  res.json({ features });
});

app.get('/api/dashboard', (req, res) => {
  res.json(dashboardData);
});

app.get('/api/chart', (req, res) => {
  res.json(chartData);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gamer Cheats backend running at http://localhost:${PORT}`);
});
