/* Phase 2 — professions, Brain stats & focus sessions (real-life mirroring).
   The grown-up mirrors YOUR real life: pick a profession, then run real focus
   sprints at the cozy desk. Rewards: coins + Brain-axis XP (+ sparks later). */
window.P = window.P || {};
P.livelihood = (function(){
  var D = P.data, SC = P.screens, ST = P.state;

  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c];
    });
  }
  function clamp01(n){ return Math.max(0, Math.min(1, n)); }

  /* ================= brain stats ================= */
  function thresholds(){
    return (P.TUNE && P.TUNE.brain && P.TUNE.brain.thresholds) || [80, 190, 360, 600, 900];
  }
  function levelOf(xp){
    var th = thresholds(); var lvl = 1;
    for (var i = 0; i < th.length; i++){ if (xp >= th[i]) lvl = i + 2; }
    return lvl;                                   // 1..6
  }
  function axisRange(xp){
    var th = thresholds(); var lo = 0, hi = th[0];
    for (var i = 0; i < th.length; i++){
      if (xp >= th[i]){ lo = th[i]; hi = th[i + 1] || (th[i] * 1.6 | 0); }
    }
    return { lo: lo, hi: hi, pct: clamp01((xp - lo) / Math.max(1, hi - lo)) };
  }
  function addXp(axis, n){
    var B = P.S.brain;
    if (!B[axis]) B[axis] = 0;
    B[axis] = Math.round((B[axis] + n) * 10) / 10;
  }

  /* Skill tree = REAL skills only (courses live in 05b/05c). Shop-style tabs:
     Language → World → Real Life (2-up tiles). Sparks are earned from focus
     sprints, full quest days & lesson completions. */
  function openSkills(tab){
    var S = P.S;
    if (!S || !S.flags.adopted) return;
    var CS = P.data.COURSES || {};
    if (!window.P.lessons){
      SC.openModal({ title: 'Real skills', body:
        '<div class="quest-streak"><span class="streak-chip">' + P.art.icon('spark', 16) + ' ' + (S.sparks || 0) + ' sparks</span>' +
        '<span class="streak-chip soft">every lesson is free</span></div>' +
        '<div class="sk-hint">Lessons arrive soon!</div>' });
      return;
    }
    var SHORT = { rw_money:'Money', rw_psych:'Psychology', rw_tech:'Tech & AI', rw_comm:'People Skills',
      rw_life:'Everyday Life', rw_create:'Creativity', rw_brain:'Brain Training' };
    function rowHtml(cid){
      var c = CS[cid];
      if (P.lessons.isLocked(cid)){
        return '<div class="course-card locked" data-course="' + cid + '">' +
          '<span class="cc-ico">' + P.art.icon(c.flagIcon || 'flag', 28) + '</span>' +
          '<div class="cc-info"><div class="cc-name">' + esc(c.name) + ' with Pippo</div>' +
          '<div class="cc-sub">' + (c.units ? c.units.reduce(function(n, u){ return n + u.lessons.length; }, 0) : 0) + ' lessons \u00b7 tap to peek</div></div>' +
          '<span class="cc-go">' + P.art.icon('close', 15) + '</span></div>';
      }
      var pr = P.lessons.progress(cid);
      var isNew = P.lessons.newToday(cid);
      return '<div class="course-card" data-course="' + cid + '">' +
        '<span class="cc-ico">' + P.art.icon(c.flagIcon || 'flag', 28) + '</span>' +
        '<div class="cc-info"><div class="cc-name">' + esc(c.name) + ' with Pippo</div>' +
        '<div class="cc-sub">' + pr.done + '/' + pr.total + ' lessons \u00b7 ' + pr.streak + '-day streak</div></div>' +
        (isNew ? '<span class="cc-new">new today</span>' : '') +
        '<span class="cc-go">' + P.art.icon('play', 15) + '</span></div>';
    }
    function tileHtml(cid){
      var c = CS[cid];
      var pr = P.lessons.progress(cid);
      var isNew = P.lessons.newToday(cid);
      var skills = c.units ? c.units.length : 0;
      var total = c.units ? c.units.reduce(function(n, u){ return n + u.lessons.length; }, 0) : 0;
      return '<div class="rw-tile" data-course="' + cid + '">' +
        (isNew ? '<span class="rw-new">new</span>' : '') +
        '<span class="rw-ico">' + P.art.icon(c.flagIcon || 'flag', 28) + '</span>' +
        '<div class="rw-name">' + esc(SHORT[cid] || c.name) + '</div>' +
        '<div class="rw-sub">' + skills + ' skills \u00b7 ' + pr.done + '/' + total + '</div></div>';
    }
    var TABS = [
      { id: 'Language',  ico: 'chat',  mode: 'rows', ids: ['spanish', 'french', 'german', 'italian'] },
      { id: 'World',     ico: 'star',  mode: 'rows', ids: ['music', 'manners', 'habits', 'nature', 'space', 'math', 'weather'] },
      { id: 'Real Life', ico: 'spark', mode: 'grid', ids: ['rw_money', 'rw_psych', 'rw_tech', 'rw_comm', 'rw_life', 'rw_create', 'rw_brain'] }
    ];
    var used = {};
    TABS.forEach(function(t){
      t.ids = t.ids.filter(function(cid){ return CS[cid] && !used[cid]; });
      t.ids.forEach(function(cid){ used[cid] = 1; });
    });
    var rest = Object.keys(CS).filter(function(cid){ return !used[cid]; });
    if (rest.length) TABS.push({ id: 'More', ico: 'book', mode: 'rows', ids: rest });
    TABS = TABS.filter(function(t){ return t.ids.length; });
    var cur = tab || 'Real Life';
    if (!TABS.some(function(t){ return t.id === cur; })) cur = TABS[0].id;
    var sel = TABS.filter(function(t){ return t.id === cur; })[0];
    var chips = '<div class="quest-streak"><span class="streak-chip">' + P.art.icon('spark', 16) + ' ' + (S.sparks || 0) + ' sparks</span>' +
      '<span class="streak-chip soft">every lesson is free</span></div>';
    var tabs = TABS.map(function(x){
      return '<div class="shop-tab' + (x.id === cur ? ' sel' : '') + '" data-tab="' + x.id + '">' + x.id + '</div>';
    }).join('');
    var content = sel.mode === 'grid'
      ? '<div class="rw-grid">' + sel.ids.map(tileHtml).join('') + '</div>'
      : sel.ids.map(rowHtml).join('');
    var body = chips + '<div class="shop-tabs">' + tabs + '</div>' + content +
      '<div class="sk-hint">Sparks are your learning stars \u2014 keep the streak alive!</div>';
    SC.openModal({ title: 'Real skills', body: body });
    var modal = document.querySelector('#modalRoot .modal');
    if (!modal) return;
    modal.querySelectorAll('[data-course]').forEach(function(b){
      b.addEventListener('click', function(){ P.lessons.open(b.getAttribute('data-course')); });
    });
    modal.querySelectorAll('[data-tab]').forEach(function(tb){
      tb.addEventListener('click', function(){ P.sfx.tap(); openSkills(tb.getAttribute('data-tab')); });
    });
  }

  /* ================= profession helpers ================= */
  var PROF_ICON = {
    student:'book', youtuber:'play', developer:'timer', artist:'pencil',
    musician:'note', athlete:'dumbbell', entrepreneur:'coin', chef:'apple',
    doctor:'heart', designer:'pencil', teacher:'book', custom:'plant'
  };
  function axisTags(axes){
    var out = '';
    Object.keys(axes).forEach(function(k){
      var a = D.AXES.filter(function(x){ return x.id === k; })[0];
      out += '<span class="ax-tag ax-' + k + '">' + (a ? a.name : k) + ' &times;' + axes[k] + '</span>';
    });
    return out;
  }
  function profName(){
    var S = P.S;
    if (!S.buddy.prof) return '';
    if (S.buddy.prof === 'custom') return S.buddy.profName || 'Custom';
    var p = D.profOf(S.buddy.prof);
    return p ? p.name : '';
  }

  /* ================= ceremony modal ================= */
  /* choosing a life path is a grown-up milestone (day 21) */
  function openCeremony(){
    var S = P.S;
    if (!S || !S.flags.adopted) return;
    if (ST.stage() < 3){
      SC.toast('Professions unlock when ' + esc(S.buddy.name || 'Pippo') + ' grows up (day 21)!');
      SC.speech('I am still little\u2026 but I dream big!', 3000);
      return;
    }
    var cells = D.PROFESSIONS.map(function(p){
      return '<button class="prof-cell" data-prof="' + p.id + '">' +
        '<span class="prof-ico">' + P.art.icon(PROF_ICON[p.id] || 'spark', 26) + '</span>' +
        '<span class="prof-name">' + p.name + '</span>' +
        '<span class="prof-axes">' + axisTags(p.axes) + '</span>' +
        '</button>';
    }).join('');
    SC.openModal({
      title: (S.buddy.prof ? 'Change profession' : 'A grown-up life!'),
      body: '<div class="prof-lead">Whose life does ' + esc(S.buddy.name) + ' mirror? Yours! Pick your real or dream profession \u2014 focus sittings at the desk grow <b>Brain</b> stats.</div>' +
        '<div class="prof-grid">' + cells + '</div>'
    });
    var modal = document.querySelector('#modalRoot .modal');
    if (!modal) return;
    modal.querySelectorAll('[data-prof]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-prof');
        if (id === 'custom') customFlow();
        else confirmProf(id, '');
      });
    });
  }
  function customFlow(){
    SC.openModal({
      title: 'Your own path',
      body: '<div class="prof-lead">What do you do \u2014 or dream of doing?<br>Write your own profession!</div>' +
        '<div class="prof-lead"><input id="profCustomName" class="textin" maxlength="22" placeholder="e.g. Astronaut Chef"></div>' +
        '<div class="mrow"><button class="btn primary" id="profCustomGo">That\'s me!</button></div>'
    });
    var btn = document.getElementById('profCustomGo');
    var input = document.getElementById('profCustomName');
    if (input) input.focus();
    if (btn) btn.addEventListener('click', function(){
      var v = input ? input.value.trim() : '';
      if (!v){ if (input) input.value = 'Custom'; v = 'Custom'; }
      confirmProf('custom', v);
    });
  }
  function confirmProf(id, customName){
    var S = P.S;
    S.buddy.prof = id;
    S.buddy.profName = customName || '';
    SC.closeModal();
    ST.save();
    SC.compose(true);
    var p = id === 'custom' ? { name: customName } : D.profOf(id);
    var p0 = SC.r2s(240, 360);
    P.fx.burst('leaf', p0.x, p0.y, 10, 60);
    P.fx.burst('spark', p0.x + 26, p0.y - 16, 6, 30);
    P.sfx.cheer();
    SC.toast((S.buddy.name ? esc(S.buddy.name) : '') + ' mirrors your life: ' + profName() + '!');
    SC.speech('My dream life\u2026 just like yours!', 3200);
  }

  /* ================= brain panel ================= */
  function openBrain(){
    var S = P.S;
    if (!S || !S.flags.adopted) return;
    var rows = D.AXES.map(function(a){
      var xp = S.brain[a.id] || 0;
      var lvl = levelOf(xp);
      var r = axisRange(xp);
      return '<div class="brain-stat ax-card-' + a.id + '">' +
        '<span class="brain-ico">' + P.art.icon(a.icon, 15) + '</span>' +
        '<div class="brain-stat-mid">' +
          '<div class="brain-stat-top"><span class="brain-name">' + a.name + '</span>' +
          '<span class="brain-lvl">Lv ' + lvl + '</span></div>' +
          '<span class="brain-track"><span class="brain-fill" style="width:' + Math.round(r.pct * 100) + '%"></span></span>' +
        '</div>' +
        '<span class="brain-xp">' + Math.round(xp) + '<i>XP</i></span>' +
        '</div>';
    }).join('');
    var grown = ST.stage() >= 3;
    var heroLine = grown
      ? (S.buddy.prof ? 'Mirroring your real life \u2014 focus sprints add XP below.' : 'Pick a life path that mirrors yours!')
      : ('On day 21 ' + esc(S.buddy.name || 'Pippo') + ' grows up \u2014 then pick a profession to mirror yours!');
    var unlockRow = grown ? '' :
      '<div class="mrow brain-foot"><span class="spark-chip soft">' + P.art.icon('moon', 15) + ' Professions unlock on day 21</span></div>';
    SC.openModal({
      title: 'Brain & Life',
      body: '<div class="brain-hero' + (grown ? ' brain-hero-grown' : '') + '">' +
        '<span class="prof-ico big">' + P.art.icon(PROF_ICON[S.buddy.prof] || (grown ? 'brain' : 'moon'), 26) + '</span>' +
        '<div><div class="brain-prof-name">' + esc(grown ? (profName() || 'No profession yet') : 'Still a little one') + '</div>' +
        '<div class="mtext soft">' + heroLine + '</div></div>' +
        '</div>' +
        '<div class="brain-stats">' + rows + '</div>' +
        '<div class="mrow brain-foot"><span class="spark-chip">' + P.art.icon('spark', 15) + ' ' + (S.sparks || 0) + ' sparks</span>' +
        '<span class="spark-chip">' + P.art.icon('timer', 15) + ' ' + Math.round(S.daily.focusCoins || 0) + '/' + (P.TUNE.focus.coinCapDay) + ' coins today</span></div>' +
        unlockRow +
        '<div class="mrow brain-btns">' + (grown
          ? '<button class="brain-link link-prof" id="btnChangeProf">' + P.art.icon('brain', 16) + 'Life path</button>'
          : '') +
        '<button class="brain-link link-skills" id="btnSkills">' + P.art.icon('pencil', 16) + 'Real skills</button>' +
        '<button class="brain-link link-story" id="btnStory">' + P.art.icon('book', 16) + 'Story</button>' +
        '<button class="brain-link link-badges" id="btnBadges">' + P.art.icon('badge', 16) + 'Badges</button></div>'
    });
    var btn = grown ? document.getElementById('btnChangeProf') : null;
    if (btn) btn.addEventListener('click', function(){ openCeremony(); });
    var skBtn = document.getElementById('btnSkills');
    if (skBtn) skBtn.addEventListener('click', function(){ openSkills(); });
    var stBtn = document.getElementById('btnStory');
    if (stBtn) stBtn.addEventListener('click', function(){ P.memory.openJournal(); });
    var bdBtn = document.getElementById('btnBadges');
    if (bdBtn) bdBtn.addEventListener('click', function(){ P.memory.openBadges(); });
  }

  /* ================= focus sessions ================= */
  function canFocus(){
    var S = P.S;
    if (!S || !S.flags.adopted) return { ok: false, why: '' };
    if (P.ST && false) {} // noop
    if (ST.stage() < 3) return { ok: false, why: 'Pippo still grows up first (day 21)!' };
    if (!S.buddy.prof) return { ok: false, why: 'ceremony' };
    if (S.buddy.asleep) return { ok: false, why: 'zzz' };
    if (S.session) return { ok: true, active: true };
    return { ok: true };
  }
  function openFocusPlan(){
    var c = canFocus();
    if (!c.ok){
      if (c.why === 'ceremony') openCeremony();
      else if (c.why) SC.toast(c.why);
      return;
    }
    if (c.active){ openSessionPeek(); return; }
    var S = P.S;
    var T = P.TUNE.focus;
    var planRows = [15, 25, 50].map(function(m){
      var coins = Math.min(Math.round(m * T.coinPerMin), T.coinCapDay);
      var spark = Math.floor(m / 25);
      return '<button class="plan-cell" data-plan="' + m + '">' +
        '<span class="plan-min">' + m + '<i> min</i></span>' +
        '<span class="plan-rev">' + P.art.icon('coin', 13) + ' ~' + coins + '</span>' +
        '<span class="plan-rev soft">' + P.art.icon('spark', 13) + ' +' + spark + ' ' + P.art.icon('brain', 13) + '</span>' +
        '</button>';
    }).join('');
    var earnedToday = S.daily.focusCoins || 0;
    var capRow = '<div class="quest-streak" style="margin:10px 0 0">' +
      '<span class="streak-chip soft">' + P.art.icon('coin', 13) + ' focus coins today: ' + earnedToday + ' / ' + T.coinCapDay + '</span>' +
      '</div>';
    SC.openModal({
      title: 'Focus with ' + esc(S.buddy.name),
      body: '<div class="prof-lead">Work ON your real life while ' + esc(S.buddy.name) + ' works at the little desk beside you. Honest timer, real reward!</div>' +
        '<div class="plan-grid">' + planRows + '</div>' + capRow +
        '<div class="mtext soft" style="text-align:center">Finish the full sprint for the whole reward, okay?</div>'
    });
    var modal = document.querySelector('#modalRoot .modal');
    if (!modal) return;
    modal.querySelectorAll('[data-plan]').forEach(function(b){
      b.addEventListener('click', function(){ startFocus(parseInt(b.getAttribute('data-plan'), 10)); });
    });
  }
  function startFocus(plan){
    var S = P.S;
    plan = Math.max((P.TUNE.focus.minPlan || 15), plan | 0);
    S.session = { start: Date.now(), plan: plan, prof: S.buddy.prof };
    SC.closeModal();
    SC.sfxTap ? SC.sfxTap() : P.sfx.tap();
    SC.compose(true);
    SC.speech(pick(['Watch me focus too!', 'Deep work time~', 'Let\'s do this together!']), 3000);
    ST.save();
    syncBar();
  }
  function endFocus(claim){
    var S = P.S;
    if (!S.session) return;
    var T = P.TUNE.focus;
    var prof = D.profOf(S.session.prof) || { axes: {}, name: '' };
    var ms = Date.now() - S.session.start;
    var min = Math.floor(ms / 60000);
    var planMs = S.session.plan * 60000;
    var coins = 0, sparks = 0, xpAr = [];
    if (claim){
      var full = ms >= planMs - 90 * 1000;   // small grace so ending at the bell counts
      var countMin = full ? Math.min(min, S.session.plan) : Math.max(0, Math.floor(min));
      var room = Math.max(0, T.coinCapDay - (S.daily.focusCoins || 0));
      coins = Math.min(Math.round(countMin * T.coinPerMin), room);
      (S.daily.focusCoins = (S.daily.focusCoins || 0) + coins);
      sparks = full ? Math.floor(countMin / 25) : 0;
      Object.keys(prof.axes || {}).forEach(function(ax){
        var w = prof.axes[ax];
        var xp = Math.round(w * countMin * T.xpPerMin / 25) * (full ? 1 : 0.15);
        if (xp > 0){ addXp(ax, xp); xpAr.push(ax + ' +' + Math.round(xp)); }
      });
      S.sparks = Math.round((S.sparks || 0) + sparks);
      if (coins > 0) ST.addCoins(coins);
      if (full && window.P.quests) P.quests.setFlag('focusDone');
      // Phase 3 memory hooks: stats + journal + badges
      S.stats.focusRuns++;
      S.stats.focusMin += countMin;
      if (sparks) S.stats.sparksEarned += sparks;
      if (window.P.memory){
        P.memory.journalAdd('timer', 'Deep-focus sprint: ' + countMin + ' min of ' + (prof.name || 'work'));
        P.memory.check();
      }
    } else {
      Object.keys(prof.axes || {}).forEach(function(ax){
        var xp = Math.round(prof.axes[ax] * min * T.xpPerMin / 25 * 0.15);
        if (xp > 0){ addXp(ax, xp); xpAr.push(ax + ' +' + xp); }
      });
    }
    S.session = null;
    clearBar();
    ST.save();
    SC.compose(true);
    SC.refreshHUD();
    if (claim){
      var p0 = SC.r2s(240, 360);
      P.fx.burst('leaf', p0.x, p0.y, 10, 60);
      P.fx.burst('spark', p0.x - 24, p0.y - 10, 8, 34);
      P.sfx.cheer();
      SC.toast('Focus done! +' + coins + 'c' + (sparks ? ' +' + sparks + ' spark' + (sparks > 1 ? 's' : '') : ''));
      SC.speech(full ? pick(['We did it! Team us!', 'Focused hard, huh?', 'Bath of proud!']) : 'Almost\u2026 finish next time?', 3000);
    } else {
      SC.speech(pick(['Okay\u2026 next sprint soon?', 'That\'s okay. Rest a bit~']), 3000);
      if (xpAr.length) SC.toast('Tiny brain XP: ' + xpAr.join(' \u00b7 '));
    }
  }
  function isActive(){ return !!(P.S && P.S.session); }
  function remaining(){
    var S = P.S;
    if (!S.session) return null;
    var end = S.session.start + S.session.plan * 60000;
    return end - Date.now();
  }
  function tickFocus(){
    if (!isActive()) return;
    var rem = remaining();
    var tEl = document.getElementById('fbarTime');
    var fEl = document.getElementById('fbarFill');
    var doneEl = document.getElementById('fbDone');
    var headEl = document.getElementById('fbarHead');
    if (tEl) tEl.textContent = rem > 0 ? fmtMs(rem) : 'Time!';
    if (fEl){
      var planMs = P.S.session.plan * 60000;
      fEl.style.width = Math.round(clamp01(1 - rem / planMs) * 100) + '%';
      fEl.classList.toggle('done', rem <= 0);
    }
    if (doneEl && rem <= 0 && !doneEl.classList.contains('glow')) {
      doneEl.classList.add('glow');
    }
    if (headEl && P.S.session) {
      // one-time toast when the sprint completes
      if (rem <= 0 && !P.S.session.__toasted){
        P.S.session.__toasted = true;
        SC.toast('Sprint complete \u2014 tap Done!');
        P.sfx.chimeMorning ? P.sfx.chimeMorning() : P.sfx.tap();
      }
    }
  }
  function fmtMs(ms){
    ms = Math.max(0, ms | 0);
    var s = Math.ceil(ms / 1000);
    return (Math.floor(s / 60) < 10 ? '0' : '') + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- focus bar (DOM overlay inside #stage) ---------- */
  var barEl = null;
  function ensureBar(){
    if (barEl) return barEl;
    var stage = document.getElementById('stage');
    if (!stage) return null;
    barEl = document.createElement('div');
    barEl.id = 'focusBar';
    barEl.innerHTML =
      '<button id="fbQuit" class="fbar-btn ghost"><svg viewBox="0 0 24 24" width="17" height="17"><path d="M6 6 L18 18 M18 6 L6 18" stroke="#423a34" stroke-width="3" fill="none" stroke-linecap="round"/></svg></button>' +
      '<div class="fbar-mid">' +
      '<div id="fbarHead" class="fbar-head"></div>' +
      '<div id="fbarTime" class="fbar-time">--:--</div>' +
      '<div class="fbar-track"><div id="fbarFill" class="fbar-fill"></div></div>' +
      '</div>' +
      '<button id="fbDone" class="fbar-btn done">Done</button>';
    stage.appendChild(barEl);
    document.getElementById('fbQuit').addEventListener('click', function(){
      P.sfx.tap(); endFocus(false);
    });
    document.getElementById('fbDone').addEventListener('click', function(){
      P.sfx.tap(); endFocus(true);
    });
    return barEl;
  }
  function clearBar(){
    if (barEl && barEl.parentNode) barEl.parentNode.removeChild(barEl);
    barEl = null;
  }
  function syncBar(){
    if (isActive()){
      var el = ensureBar();
      if (el){
        var head = document.getElementById('fbarHead');
        if (head) head.innerHTML = P.art.icon('timer', 14) + ' Focusing \u00b7 ' + esc(profName());
      }
    } else {
      clearBar();
    }
  }

  /* recover after reload: resume bar for a running session */
  function recover(){
    var S = P.S;
    if (!S || !S.session) return;
    // stale sessions (way past the planned window) keep the claim; older than a day auto-clear
    if (Date.now() - S.session.start > 26 * 3600 * 1000){
      S.session = null; ST.save(); return;
    }
    syncBar();
  }
  setInterval(tickFocus, 1000);

  /* friendly peek card when tapping Focus while a sprint is running */
  function openSessionPeek(){
    var S = P.S;
    if (!S.session) return;
    var prof = D.profOf(S.session.prof) || { name: 'your work' };
    SC.openModal({
      title: 'Focusing\u2026',
      body: '<div class="prof-lead">' + esc(S.buddy.name) + ' is deep in ' + esc(prof.name || 'your work') +
        ' at the little desk. The timer keeps ticking while you wander the house \u2014 finish the sprint for the whole reward!' +
        '<div class="mtext soft" style="text-align:center;margin-top:8px">' + P.art.icon('timer', 14) + ' ' + fmtMs(remaining()) + ' left</div></div>'
    });
  }

  return {
    openCeremony: openCeremony,
    openBrain: openBrain,
    openFocusPlan: openFocusPlan,
    openSessionPeek: openSessionPeek,
    startFocus: startFocus,
    endFocus: endFocus,
    isActive: isActive,
    remaining: remaining,
    tickFocus: tickFocus,
    recover: recover,
    profName: profName,
    openSkills: openSkills,
    openCeremony: openCeremony,
    grantXp: addXp
  };
})();
