/* Pippo & Me — Cozy Storybook palette + tuning constants */
window.P = window.P || {};

P.C = {
  paper:'#fdf8e7', dim:'#f2ead3', ink:'#423a34', soft:'#6d6458',
  sky:'#c9e7f2', night:'#2c3350', moonc:'#f4ecd4',
  grass:'#8fc07a', leaf:'#7fb069', leaf2:'#6fa84e', shade:'#5d8f43',
  wood:'#b98a5a', dwood:'#8f6840', sand:'#e8dfc0', stone:'#cfc8ba',
  amber:'#ffcf5c', orange:'#ef8a3e', rose:'#e57f8e', water:'#7ec8e3',
  gold:'#e8a020'
};

/* REDUCED-MOTION friendly hooks live in fx/rig, not here. */

/* Tuning constants (balance pass happens in Phase 3) */
P.TUNE = {
  // meter decay per real hour, by stage (0 baby .. 3 adult)
  decay: {
    0: { hunger:12, sleep:8,  hygiene:7,  mood:5 },
    1: { hunger:8,  sleep:7,  hygiene:5,  mood:4 },
    2: { hunger:7,  sleep:6,  hygiene:4,  mood:3 },
    3: { hunger:5,  sleep:5,  hygiene:3,  mood:3 }
  },
  moodFloor: 22,          // never miserable
  offlineCapH: 8,         // decays at most 8h-equivalent while away
  asleepDecayMul: 0.35,   // other meters decay much slower while sleeping
  asleepSleepRegen: 26,   // sleep meter regen per hour while sleeping
  sleepyLow: 58,          // below this the buddy looks/acts sleepy (red bar, dark circles)
  shortNightCap: 52,      // a skipped-bedtime night caps overnight sleep recovery until a nap is taken
  petMoodPerHour: 15,     // mood gained from petting cap (per hour window)
  growth: { babyMax:6, toddlerMax:13, kidMax:20 },   // day thresholds
  focus: {                 // Phase 2 mirror sessions
    coinPerMin: 0.9,      // base coins per focus minute
    coinCapDay: 110,      // max focus earnings per day
    xpPerMin: 11,         // brain xp per axis share per minute
    minPlan: 15           // shortest plan offered (defends against tap-farming)
  },
  brain: { thresholds: [80, 190, 360, 600, 900] },   // axis level edges (level 1..6)
  turbo: 60               // demo-speed multiplier
};
