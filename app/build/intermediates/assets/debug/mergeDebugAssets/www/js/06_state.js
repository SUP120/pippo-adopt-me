/* State, save/load, time model, meter decay, offline progression */
window.P = window.P || {};
P.state = (function(){
  var KEY = 'pippo-me-save-v1';
  var T = P.TUNE;

  function def(){
    return {
      v: 1,
      buddy: {
        name: 'Pippo',
        bornAt: 0, stage: 0,
        meters: { hunger: 82, sleep: 78, hygiene: 84, mood: 80 },
        asleep: false, sleepStart: 0, shortNight: false,
        prof: '', profName: '',   // mirrored profession (Phase 2)
        look: { skin: 0, onesie: 0, tuft: 0, eyes: 0, acc: '' }   // closet: acc = accessory id
      },
      coins: 40,
      inv: { bottle: 3, mash: 2, toast: 0, rattle: 0, ball: 0, plush: 0 },
      brain: { focus: 0, learn: 0, create: 0, move: 0, care: 0 },
      sparks: 0,
      session: null,   // active focus session {start, plan, prof}
      room: { rug: 0, wall: 0, poster: 0, light: 1, posterRoom: 'home' },
      closet: {},      // owned wear/room item ids
      friends: {},     // visitor friendship {id: {pts, visits}}
      buffs: {},       // timed effects {warm: {until}}
      lessons: {},     // real-lesson courses (per-course progress, streaks)
      unlocked: { spanish: true },   // legacy saves; every course is free now
      achv: {},        // badge id -> dayKey earned
      journal: [],     // story-book memories {d, i, t}
      notes: { pages: [], visits: 0, lastDay: '', firstOpen: 0, returnedWithinWeek: false, starts: 0, recallAttempts: 0, recallCorrect: 0 },
      flags: { adopted: false, tut: 0, lastSleepGift: '', lastStage: 0, welcomed: false },
      daily: { key: '', playCoins: 0, petMood: 0, focusCoins: 0, feedCount: 0, bathCount: 0, playCount: 0, petCount: 0, focusDone: 0, onBed: 0, lessonDone: 0, questDone: {}, allDone: false, weather: 'sunny' },
      streak: 0, streakBest: 0,
      bond: { xp: 0 },
      stats: { care: 0, feeds: 0, baths: 0, plays: 0, lessons: 0, focusRuns: 0, focusMin: 0, sparksEarned: 0, stars3: 0, perfectDays: 0 },
      settings: { sound: true, bedtime: 21, wake: 7, turbo: false },
      meta: { created: 0, lastSeen: 0 }
    };
  }

  function merge(dst, src){
    for (var k in src){
      if (Array.isArray(src[k])){ dst[k] = src[k]; continue; }   // arrays come straight from the save (journal…)
      if (!(k in dst)){ dst[k] = src[k]; continue; }
      if (src[k] && typeof src[k] === 'object' && dst[k] && typeof dst[k] === 'object' && !Array.isArray(dst[k])){
        merge(dst[k], src[k]);
      } else if (src[k] !== undefined && typeof src[k] !== 'object'){
        dst[k] = src[k];
      }
    }
    return dst;
  }

  /* ---------- load / save ---------- */
  function load(){
    var s = def();
    try{
      var raw = localStorage.getItem(KEY);
      if (raw){ s = merge(s, JSON.parse(raw)); }
    }catch(e){ /* fresh save */ }
    P.S = s;
    return s;
  }
  function save(){
    if (!P.S) return;
    /* never persist a shop try-on — previews are temporary, not purchases */
    if (P.screens && P.screens.shopTrialActive && P.screens.shopTrialActive()) return;
    P.S.meta.lastSeen = Date.now();
    try{ localStorage.setItem(KEY, JSON.stringify(P.S)); }catch(e){}
  }
  function exportSave(){ return JSON.stringify(P.S); }
  function importSave(txt){
    var s = JSON.parse(txt);
    if (!s || !s.buddy) throw new Error('bad save');
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  }
  function reset(){ try{ localStorage.removeItem(KEY); }catch(e){} }

  /* ---------- time model (hybrid: real clock drives the day) ---------- */
  var now = Date.now;
  function clockParts(ts){
    var d = new Date(ts || now());
    return { h: d.getHours(), m: d.getMinutes(), dow: d.getDay() };
  }
  function dayKey(ts){
    var d = new Date(ts || now());
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function isNight(ts, st){
    st = st || P.S;
    var h = clockParts(ts).h;
    return (h >= st.settings.bedtime || h < st.settings.wake);
  }
  function turbo(){ return P.S && P.S.settings.turbo ? T.turbo : 1; }
  function ageDays(){
    var S = P.S;
    if (!S || !S.buddy.bornAt) return 0;
    return ((now() - S.buddy.bornAt) * turbo()) / 86400000;
  }
  function stage(){
    var a = ageDays();
    if (a <= T.growth.babyMax) return 0;
    if (a <= T.growth.toddlerMax) return 1;
    if (a <= T.growth.kidMax) return 2;
    return 3;
  }
  function dayNum(){ return Math.floor(ageDays()) + 1; }

  var STAGE_NAMES = ['baby','toddler','kid','grown-up'];

  /* ---------- bond ---------- */
  var BOND_XP = [0, 0, 30, 70, 120, 180, 260, 350, 450, 560, 680];
  function bondLevel(){
    var xp = P.S.bond.xp, lv = 1;
    for (var i = 1; i <= 10; i++){ if (xp >= BOND_XP[i]) lv = i; }
    return lv;
  }
  function bondNextAt(){ return BOND_XP[Math.min(10, bondLevel() + 1)]; }
  function addBond(n){ P.S.bond.xp += n; }

  /* ---------- economy ---------- */
  function addCoins(n){ P.S.coins = Math.max(0, Math.min(99999, P.S.coins + n)); }
  function canBuy(cost){ return P.S.coins >= cost; }
  function buy(cost){ if (!canBuy(cost)) return false; addCoins(-cost); return true; }
  function addItem(id, n){ P.S.inv[id] = (P.S.inv[id] || 0) + n; }
  function useItem(id){ var c = P.S.inv[id] || 0; if (c <= 0) return false; P.S.inv[id] = c - 1; return true; }

  /* ---------- meters ---------- */
  function clampMeter(v){ return Math.max(0, Math.min(100, v)); }
  function addMeter(key, n){ P.S.buddy.meters[key] = clampMeter(P.S.buddy.meters[key] + n); }
  function moodFloor(){
    var f = T.moodFloor;
    if (P.S.inv.plush) f += 8;
    return f;
  }
  function avgMeters(){
    var m = P.S.buddy.meters;
    return (m.hunger + m.sleep + m.hygiene + m.mood) / 4;
  }

  function tickDecay(dtH){
    if (dtH <= 0) return;
    var S = P.S, m = S.buddy.meters;
    var rate = T.decay[S.buddy.stage] || T.decay[0];
    var mul = S.buddy.asleep ? T.asleepDecayMul : 1;
    // warm-belly buff (home soup): the tummy empties 30% slower for a while
    var hungerRate = rate.hunger * ((S.buffs && S.buffs.warm && S.buffs.warm.until > now()) ? 0.7 : 1);
    m.hunger  = clampMeter(m.hunger  - hungerRate * dtH * mul);
    m.hygiene = clampMeter(m.hygiene - rate.hygiene * dtH * mul);
    if (S.buddy.asleep){
      if (S.buddy.shortNight){
        // skipped-bedtime night: poor rest until a proper nap is taken
        m.sleep = Math.min(T.shortNightCap, m.sleep + T.asleepSleepRegen * dtH);
        m.sleep = clampMeter(m.sleep);
      } else {
        m.sleep = clampMeter(m.sleep + T.asleepSleepRegen * dtH);
      }
    } else {
      m.sleep = clampMeter(m.sleep - rate.sleep * dtH);
    }
    var moodR = rate.mood * mul;
    if (m.hunger <= 0) moodR += 3;               // starving is sad
    m.mood = Math.max(moodFloor(), m.mood - moodR * dtH);
  }

  /* ---------- offline progression ---------- */
  function offlineAdjust(lastSeen){
    var S = P.S;
    var elapsedMs = Math.max(0, now() - lastSeen);
    var hours = (elapsedMs / 3600000) * turbo();
    var capped = Math.min(hours, T.offlineCapH);
    if (capped > 0.02) tickDecay(capped);
    // buddy mirrors the clock while away: asleep at night, awake in the day
    if (isNight()){ S.buddy.asleep = true; if (!S.buddy.sleepStart) S.buddy.sleepStart = now(); }
    else { S.buddy.asleep = false; S.buddy.sleepStart = 0; }
    return { hours: hours, capped: capped };
  }

  /* ---------- daily weather (deterministic per day; snow only Dec–Feb) ---------- */
  function hashNum(n){
    var x = (n * 2654435761) % 4294967296;
    x = (x ^ (x >>> 13)) * 1274126177 % 4294967296;
    return (x >>> 0) / 4294967296;
  }
  function rollWeather(){
    var d = new Date(), m = d.getMonth();               // 0=Jan … 11=Dec
    var r = hashNum(dayNum());
    var winter = (m === 11 || m <= 1);
    if (r < 0.46) return 'sunny';
    if (r < 0.70) return 'cloudy';
    if (r < 0.90 || !winter) return 'rain';
    return 'snow';
  }
  function weather(){ return (P.S.daily && P.S.daily.weather) || 'sunny'; }

  /* ---------- daily resets ---------- */
  function rolloverDaily(){
    var S = P.S, k = dayKey();
    if (S.daily.key !== k){
      // evaluate yesterday's streak before wiping the day
      var previous = S.daily;
      S.daily = { key: k, playCoins: 0, petMood: 0, focusCoins: 0, feedCount: 0, bathCount: 0, playCount: 0, petCount: 0, focusDone: 0, onBed: 0, lessonDone: 0, visitDone: 0, questDone: {}, allDone: false, weather: rollWeather() };
      if (window.P.quests) P.quests.rollover(previous);
      if (window.P.memory) P.memory.check();
    } else {
      // backfills for older saves
      if (!S.daily.weather) S.daily.weather = rollWeather();
      if (S.daily.visitDone === undefined) S.daily.visitDone = 0;
    }
  }

  P.state = {
    def: def, load: load, save: save, reset: reset,
    exportSave: exportSave, importSave: importSave,
    clockParts: clockParts, dayKey: dayKey, isNight: isNight,
    ageDays: ageDays, stage: stage, dayNum: dayNum, STAGE_NAMES: STAGE_NAMES,
    bondLevel: bondLevel, bondNextAt: bondNextAt, addBond: addBond,
    addCoins: addCoins, canBuy: canBuy, buy: buy,
    addItem: addItem, useItem: useItem,
    addMeter: addMeter, moodFloor: moodFloor, avgMeters: avgMeters,
    tickDecay: tickDecay, offlineAdjust: offlineAdjust, rolloverDaily: rolloverDaily,
    weather: weather, rollWeather: rollWeather,
    KEY: KEY
  };
  return P.state;
})();
