/* Real lessons engine (Phase 3): Duolingo-style mini lessons, course-agnostic.
   Player learns WITH Pippo: mini Pippo face reacts, TTS speaks the language,
   finishing lessons teaches Pippo words he "uses" later.
   Courses live in 05b_courses.js (P.data.COURSES). Progress in S.lessons[courseId]. */
window.P = window.P || {};
P.lessons = (function(){
  var SC = P.screens, ST = P.state, A = P.art;
  var RUN = null;

  /* tuning */
  var RW = { fullCoins: 14, fullLearn: 30, fullSpXp: 12, fullSpark: 1,
             praCoins: 5, praLearn: 8, praSpXp: 4 };
  var SP_LV = [0, 40, 90, 150, 220, 300, 400];
  var SP_LV_NAMES = ['Bebé', 'Curioso', 'Pequeño', 'Aprendiz', 'Hablador', 'Estrella', 'Profesor'];
  var PRAISE = ['¡Muy bien!', '¡Excelente!', '¡Perfecto!', '¡Eso es!'];

  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c];
    });
  }
  function shuffle(a){
    for (var i = a.length - 1; i > 0; i--){
      var j = (Math.random() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(a){ return a[(Math.random() * a.length) | 0]; }

  function course(cid){ return (P.data.COURSES || {})[cid]; }
  function cstate(cid){
    var L = P.S.lessons;
    if (!L[cid]) L[cid] = { done: {}, xp: 0, streak: 0, streakBest: 0, lastDay: '', words: 0, pool: [] };
    return L[cid];
  }
  function flat(c){
    var out = [];
    c.units.forEach(function(u){ u.lessons.forEach(function(l){ out.push(l); }); });
    return out;
  }
  function lessonIndex(c, lid){
    var f = flat(c);
    for (var i = 0; i < f.length; i++) if (f[i].id === lid) return i;
    return -1;
  }
  function nextLesson(c){
    var f = flat(c), s = cstate(c.id);
    for (var i = 0; i < f.length; i++) if (!s.done[f[i].id]) return f[i];
    return null;
  }
  function progress(cid){
    var c = course(cid), s = cstate(cid);
    return { done: Object.keys(s.done).length, total: flat(c).length, streak: s.streak };
  }
  function levelInfo(xp){
    var lv = 1;
    for (var i = 1; i < SP_LV.length; i++) if (xp >= SP_LV[i]) lv = i + 1;
    var lo = SP_LV[lv - 1], hi = SP_LV[Math.min(SP_LV.length - 1, lv)];
    return { lv: lv, name: SP_LV_NAMES[Math.min(SP_LV_NAMES.length - 1, lv - 1)], pct: (xp - lo) / Math.max(1, hi - lo) };
  }

  /* ---------- text-to-speech (device voices; guarded) ---------- */
  function speak(text, lang){
    try {
      if (!window.speechSynthesis) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'es-ES';
      u.rate = 0.8; u.pitch = 1.1;
      speechSynthesis.speak(u);
    } catch (e){}
  }

  /* ---------- exercise builders ---------- */
  function distractors(w, c, n){
    var pool = [];
    flat(c).forEach(function(l){
      l.words.forEach(function(x){
        if (x.en !== w.en && x.es !== w.es) pool.push(x);
      });
    });
    shuffle(pool);
    return pool.slice(0, n);
  }
  function mkMc(w, c, reverse){
    var opts = shuffle([{ es: w.es, en: w.en, ok: true }].concat(
      distractors(w, c, 2).map(function(o){ return { es: o.es, en: o.en, ok: false }; })
    ));
    return { type: 'mc', w: w, reverse: !!reverse, opts: opts };
  }
  function mkListen(w, c){
    var ex = mkMc(w, c, false);
    ex.type = 'listen';
    return ex;
  }
  function mkBank(w, c){
    var ans = w.en.split(' ');
    var distr = [];
    flat(c).forEach(function(l){
      l.words.forEach(function(x){
        if (x.en === w.en) return;
        x.en.split(' ').forEach(function(t){
          if (ans.indexOf(t) < 0 && distr.indexOf(t) < 0) distr.push(t);
        });
      });
    });
    shuffle(distr);
    return { type: 'bank', w: w, ans: ans, tiles: shuffle(ans.concat(distr.slice(0, 2))) };
  }
  function mkMatch(words){
    var ws = words.slice(0, 4);
    var es = shuffle(ws.map(function(w){ return w.es; }));
    var en = shuffle(ws.map(function(w){ return w.en; }));
    var map = {};
    ws.forEach(function(w){ map[w.en] = w.es; });
    return { type: 'match', es: es, en: en, pairs: ws, map: map };
  }
  function reviewPool(c, lesson){
    var s = cstate(c.id), pool = [];
    flat(c).forEach(function(l){
      if (l.id === lesson.id || !s.done[l.id]) return;
      pool = pool.concat(l.words);
    });
    return pool;
  }
  function genExercises(c, lesson, isPractice){
    var words = lesson.words.slice();
    var mcWords = words.slice();
    if (mcWords.length > 4) mcWords.splice((Math.random() * mcWords.length) | 0, 1);
    var exs = [];
    mcWords.forEach(function(w, i){ exs.push(mkMc(w, c, i % 2 === 1)); });
    exs.push(mkListen(pick(words), c));
    var phs = words.filter(function(w){ return w.es.indexOf(' ') >= 0; });
    exs.push(phs.length ? mkBank(pick(phs), c) : mkMc(pick(words), c, true));
    exs.push(mkMatch(words));
    if (!isPractice){
      var rp = reviewPool(c, lesson);
      if (rp.length) exs.push(mkMc(pick(rp), c, Math.random() < 0.5));
    }
    shuffle(exs);
    for (var i = 0; i < exs.length; i++){        // gentle start: word → meaning
      if (exs[i].type === 'mc' && !exs[i].reverse){
        var t = exs[0]; exs[0] = exs[i]; exs[i] = t;
        break;
      }
    }
    // teach BEFORE ask: each new word gets a card (word + meaning + audio) first
    var teach = words.map(function(w){ return { type: 'teach', w: w }; });
    return teach.concat(exs);
  }

  /* ---------- scene hooks (garden lives in compose) ---------- */
  function sceneActive(){ return !!RUN; }
  function cheerOn(){ return !!RUN && RUN.cheerUntil > Date.now(); }
  function sadOn(){ return !!RUN && RUN.sadUntil > Date.now(); }
  function boardData(){
    var CH = RUN && RUN.c.cheer ? RUN.c.cheer : { go: 'go!', bravo: 'bravo!', listen: 'listen\u2026', match: 'pairs!' };
    if (!RUN) return { label: '', l1: CH.go, l2: '' };
    if (!RUN.cur) return { label: esc(RUN.c.name), l1: CH.bravo, l2: '' };   // recap on board
    var ex = RUN.cur, label = esc(RUN.lesson.title);
    if (ex.type === 'listen') return { label: label, l1: CH.listen, l2: '' };
    if (ex.type === 'match') return { label: label, l1: CH.match, l2: '' };
    if (ex.type === 'bank') return { label: label, l1: esc(ex.w.es), l2: '' };
    var t = ex.reverse ? ex.w.en : ex.w.es;
    return { label: label, l1: esc(t), l2: '' };
  }
  function newToday(cid){
    var c = course(cid);
    if (!c) return false;
    var s = cstate(cid);
    var n = nextLesson(c);
    return !!n && s.lastDay !== ST.dayKey();
  }

  /* cheer/sad moments redraw the scene, then settle back */
  function moment(kind){
    var r = RUN;
    if (!r) return;
    var now = Date.now();
    if (kind === 'cheer') r.cheerUntil = now + 1500;
    else r.sadUntil = now + 1300;
    SC.compose(true);
    clearTimeout(r.mTimer);
    r.mTimer = setTimeout(function(){
      if (RUN && !cheerOn() && !sadOn()) SC.compose(true);
    }, 1700);
  }

  /* ---------- runner (bottom sheet over the garden scene) ---------- */
  function startRun(c, lesson, isPractice){
    if (RUN) quitRun();
    var exs = genExercises(c, lesson, isPractice);
    RUN = {
      c: c, lesson: lesson, isPractice: !!isPractice,
      queue: exs, solved: 0, total: exs.length, mistakes: 0, cur: null, built: [],
      hot: 0, cheerUntil: 0, sadUntil: 0, mTimer: null, amb: null
    };
    var layer = document.createElement('div');
    layer.className = 'ls-layer';
    layer.innerHTML =
      '<div class="ls-sheet">' +
        '<div class="ls-top">' +
          '<span class="ls-top-title">' + esc(c.name) + ' \u00b7 ' + esc(lesson.title) + '</span>' +
          '<button class="modal-close" id="lsQuit">' + A.icon('close', 16) + '</button>' +
        '</div>' +
        '<div id="lsBody"></div>' +
        '<div class="ls-foot" id="lsFoot"></div>' +
      '</div>';
    document.getElementById('screen-home').appendChild(layer);
    RUN.layer = layer;
    document.getElementById('lsQuit').addEventListener('click', function(){
      SC.speech(pick(['We\u2019ll finish next time!', 'Lesson later? Okay~']), 2600);
      quitRun();
    });
    P.sfx.bird();
    // garden ambience: chirps + random Pippo giggles while learning
    RUN.amb = setInterval(function(){
      if (!RUN || document.hidden) return;
      if (Math.random() < 0.62) P.sfx.bird(); else P.sfx.giggle();
    }, 6800);
    renderEx();   // renderEx ends with compose → garden appears with the question on the board
  }
  function quitRun(){
    if (RUN){
      clearInterval(RUN.amb);
      clearTimeout(RUN.mTimer);
    }
    if (RUN && RUN.layer && RUN.layer.remove) RUN.layer.remove();
    RUN = null;
    SC.compose(true);
  }
  /* celebrate a correct answer — Pippo throws his arms up, Me too */
  function cheerBurst(){
    var r = RUN;
    if (!r) return;
    r.hot++;
    var big = r.hot % 3 === 0;                 // every 3-in-a-row: extra fanfare
    moment('cheer');
    if (big){
      r.cheerUntil = Date.now() + 2400;
      clearTimeout(r.mTimer);
      r.mTimer = setTimeout(function(){
        if (RUN && !cheerOn() && !sadOn()) SC.compose(true);
      }, 2600);
      P.sfx.cheer();
      var p = SC.r2s(146, 288);
      P.fx.burst('spark', p.x, p.y, 12, 46);
      P.fx.burst('leaf', p.x - 18, p.y + 6, 9, 42);
      P.fx.burst('heart', p.x + 18, p.y - 4, 8, 40);
    }
  }
  function cheersOk(extraSpeak){
    P.sfx.correct();
    cheerBurst();
    setTimeout(function(){ P.sfx.giggle(); }, 160);
    if (extraSpeak) setTimeout(function(){ speak(extraSpeak, RUN && RUN.c.ttsLang); }, 380);
  }

  function dots(){
    var r = RUN, s = '';
    for (var i = 0; i < r.total; i++) s += '<span class="dot' + (i < r.solved ? ' on' : '') + '"></span>';
    return '<div class="ls-progress">' + s + '</div>';
  }
  function feedback(text, ok, onNext){
    var foot = document.getElementById('lsFoot');
    if (!foot) return;
    foot.innerHTML =
      '<div class="ls-banner ' + (ok ? 'ok' : 'no') + '">' +
        (ok ? A.icon('star', 15) : A.icon('close', 14)) +
        '<span>' + text + '</span>' +
        '<button class="btn primary ls-next" id="lsNext">Continue</button>' +
      '</div>';
    document.getElementById('lsNext').addEventListener('click', onNext);
  }
  function advance(ok){
    var r = RUN;
    if (!r) return;
    if (ok){ r.queue.shift(); r.solved++; }
    else { var e = r.queue.shift(); r.queue.push(e); }   // miss it once → try again at the end
    var foot = document.getElementById('lsFoot');
    if (foot) foot.innerHTML = '';
    renderEx();
  }

  function renderEx(){
    var r = RUN;
    if (!r) return;
    if (!r.queue.length){ finishRun(); return; }
    var ex = r.cur = r.queue[0];
    var body = document.getElementById('lsBody');
    if (!body){ quitRun(); return; }
    var foot = document.getElementById('lsFoot');
    if (foot) foot.innerHTML = '';
    var html = dots();

    if (ex.type === 'teach'){
      html += '<div class="ls-teach">' +
        '<span class="ls-newchip">' + A.icon('spark', 13) + ' New word</span>' +
        '<div class="ls-bigword">' + esc(ex.w.es) + '</div>' +
        '<div class="ls-meaning">' + esc(ex.w.en) + '</div>' +
        '<div class="ls-audio"><button class="ls-speak" id="lsTeachSpeak">' + A.icon('speaker', 26) + '</button></div>' +
        '</div>';
      body.innerHTML = html;
      speak(ex.w.es, r.c.ttsLang);
      document.getElementById('lsTeachSpeak').addEventListener('click', function(){ speak(ex.w.es, r.c.ttsLang); });
      if (foot) foot.innerHTML = '<div class="ls-gotrow"><button class="btn primary" id="lsGot">Got it!</button></div>';
      document.getElementById('lsGot').addEventListener('click', function(){ P.sfx.tap(); advance(true); });
      SC.compose(true);   // blackboard shows the new word while Pippo presents it
      return;
    }
    if (ex.type === 'mc' || ex.type === 'listen'){
      var q = ex.type === 'listen'
        ? 'Listen \u2014 what does it mean?'
        : (ex.reverse
          ? (r.c.ask && r.c.ask.rev
            ? r.c.ask.rev.replace('{en}', esc(ex.w.en))
            : 'How do you say \u00ab' + esc(ex.w.en) + '\u00bb in ' + esc(r.c.name) + '?')
          : 'What does \u00ab' + esc(ex.w.es) + '\u00bb mean?');
      var opts = ex.opts.map(function(o, i){
        var t = ex.reverse ? o.es : o.en;
        o._t = t;
        return '<button class="ls-opt" data-i="' + i + '">' + esc(t) + '</button>';
      }).join('');
      html += '<div class="ls-q">' + q + '</div>';
      if (ex.type === 'listen'){
        html += '<div class="ls-audio"><button class="ls-speak" id="lsSpeak">' + A.icon('speaker', 26) + '</button></div>';
      }
      html += '<div class="ls-opts">' + opts + '</div>';
      body.innerHTML = html;
      if (ex.type === 'listen'){
        speak(ex.w.es, r.c.ttsLang);
        document.getElementById('lsSpeak').addEventListener('click', function(){ speak(ex.w.es, r.c.ttsLang); });
      }
      Array.prototype.forEach.call(body.querySelectorAll('.ls-opt'), function(b){
        b.addEventListener('click', function(){ answerMc(parseInt(b.getAttribute('data-i'), 10)); });
      });

    } else if (ex.type === 'bank'){
      r.built = [];
      var tiles = ex.tiles.map(function(t, i){
        return '<button class="ls-tile" data-i="' + i + '">' + esc(t) + '</button>';
      }).join('');
      html += '<div class="ls-q">Build the English for \u00ab' + esc(ex.w.es) + '\u00bb</div>' +
        '<div class="ls-line" id="lsLine"></div>' +
        '<div class="ls-tiles">' + tiles + '</div>' +
        '<div style="text-align:center;margin-top:8px"><button class="btn primary" id="lsCheck">Check</button></div>';
      body.innerHTML = html;
      Array.prototype.forEach.call(body.querySelectorAll('.ls-tile'), function(b){
        b.addEventListener('click', function(){
          var t = ex.tiles[parseInt(b.getAttribute('data-i'), 10)];
          b.classList.add('used');
          r.built.push({ t: t, el: b });
          document.getElementById('lsLine').innerHTML = r.built.map(function(x){
            return '<span class="ls-chip">' + esc(x.t) + '</span>';
          }).join('');
          P.sfx.tap();
        });
      });
      document.getElementById('lsCheck').addEventListener('click', function(){
        var said = r.built.map(function(x){ return x.t; }).join(' ');
        if (said === ex.w.en){ cheersOk(ex.w.en); feedback(pick(PRAISE) + ' \u00ab' + esc(ex.w.es) + '\u00bb = ' + esc(ex.w.en), true, function(){ advance(true); }); }
        else { r.mistakes++; r.hot = 0; moment('sad'); feedback('Almost \u2014 \u00ab' + esc(ex.w.es) + '\u00bb = \u00ab' + esc(ex.w.en) + '\u00bb', false, function(){ advance(false); }); P.sfx.wrong(); }
      });

    } else if (ex.type === 'match'){
      var colA = ex.es.map(function(t){ return '<button class="ls-cell" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
      var colB = ex.en.map(function(t){ return '<button class="ls-cell" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
      html += '<div class="ls-q">Tap the pairs that belong together</div>' +
        '<div class="ls-match"><div class="ls-col" data-side="a">' + colA + '</div>' +
        '<div class="ls-col" data-side="b">' + colB + '</div></div>';
      body.innerHTML = html;
      r.msel = null; r.mleft = ex.pairs.length;
      Array.prototype.forEach.call(body.querySelectorAll('.ls-cell'), function(cell){
        cell.addEventListener('click', function(){
          if (cell.classList.contains('off')) return;
          var side = cell.parentElement.getAttribute('data-side');
          var v = cell.getAttribute('data-v');
          if (r.msel && r.msel.side !== side){
            var a = side === 'a' ? v : r.msel.v;
            var b = side === 'a' ? r.msel.v : v;
            var hit = ex.map[b] === a;
            if (hit){
              cell.classList.add('off'); r.msel.el.classList.add('off');
              r.mleft--; cheersOk();
              if (r.mleft <= 0){ feedback('All pairs matched!', true, function(){ advance(true); }); }
            } else {
              r.hot = 0; moment('sad'); P.sfx.wrong();
              cell.classList.add('no'); r.msel.el.classList.add('no');
              setTimeout(function(){
                Array.prototype.forEach.call(body.querySelectorAll('.ls-cell.no'), function(x){ x.classList.remove('no'); });
              }, 420);
            }
            r.msel = null;
          } else {
            if (r.msel && r.msel.el) r.msel.el.classList.remove('sel');
            r.msel = { side: side, v: v, el: cell };
            cell.classList.add('sel'); P.sfx.tap();
          }
        });
      });
    }
    P.sfx.tap();
    SC.compose(true);   // blackboard shows the current question, Pippo reacts to state
  }

  function answerMc(i){
    var r = RUN, ex = r.cur;
    if (!r || !ex || (ex.type !== 'mc' && ex.type !== 'listen')) return;
    var o = ex.opts[i];
    if (!o) return;
    if (o.ok){
      cheersOk(ex.w.es);
      var pairTxt = ex.reverse ? '\u00ab' + ex.w.en + '\u00bb = \u00ab' + ex.w.es + '\u00bb' : '\u00ab' + ex.w.es + '\u00bb = ' + ex.w.en;
      feedback(pick(PRAISE) + ' ' + pairTxt, true, function(){ advance(true); });
    } else {
      cstate(r.c.id).lastMiss = { es: ex.w.es, en: ex.w.en, day: ST.dayKey() };
      r.mistakes++; r.hot = 0; moment('sad'); P.sfx.wrong();
      var right = ex.reverse ? '\u00ab' + ex.w.es + '\u00bb' : '\u00ab' + ex.w.en + '\u00bb';
      feedback('Almost! The answer is ' + right, false, function(){ advance(false); });
    }
  }

  /* ---------- finish: rewards, streak, recap ---------- */
  function finishRun(){
    var r = RUN, c = r.c, s = cstate(c.id);
    RUN.cur = null;   // board switches to «¡bravo!» for the recap
    var first = !s.done[r.lesson.id];
    var full = first && s.lastDay !== ST.dayKey();
    var stars = r.mistakes === 0 ? 3 : (r.mistakes <= 2 ? 2 : 1);
    var coins = full ? RW.fullCoins : RW.praCoins;
    var learnXp = full ? RW.fullLearn : RW.praLearn;
    var spXp = full ? RW.fullSpXp : RW.praSpXp;
    var spark = full ? RW.fullSpark : 0;

    var prev = s.done[r.lesson.id];
    s.done[r.lesson.id] = { stars: Math.max(stars, prev ? prev.stars : 0), day: ST.dayKey() };
    s.xp += spXp;
    if (first){
      s.words += r.lesson.words.length;
      s.pool = s.pool || [];
      r.lesson.words.forEach(function(w){ s.pool.push({ es: w.es, en: w.en }); });
    }
    if (s.lastDay !== ST.dayKey()){
      s.streak = (s.lastDay === ST.dayKey(Date.now() - 86400000)) ? s.streak + 1 : 1;
      s.streakBest = Math.max(s.streakBest, s.streak);
      s.lastDay = ST.dayKey();
    }
    ST.addCoins(coins);
    if (spark) P.S.sparks = Math.round((P.S.sparks || 0) + spark);
    if (window.P.livelihood && P.livelihood.grantXp) P.livelihood.grantXp('learn', learnXp);
    if (window.P.quests) P.quests.setFlag('lessonDone');
    // Phase 3 memory hooks: stats, journal, badges
    var Sx = P.S;
    Sx.stats.lessons++;
    if (stars === 3) Sx.stats.stars3++;
    if (spark) Sx.stats.sparksEarned++;
    if (window.P.memory){
      P.memory.journalAdd('book', 'Learned ' + r.lesson.words.length + ' word' + (r.lesson.words.length > 1 ? 's' : '') + ' in ' + c.name + (stars === 3 ? ' \u2014 all stars!' : ''));
      P.memory.check();
    }
    ST.save();
    SC.refreshHUD();

    RUN.cheerUntil = Date.now() + 6000;   // garden keeps celebrating through the recap
    RUN.hot = 0;
    SC.compose(true);
    var p0 = SC.r2s(240, 246);
    P.fx.burst('spark', p0.x, p0.y, 12, 46);
    P.fx.burst('leaf', p0.x - 20, p0.y + 8, 8, 40);
    P.sfx.cheer();
    setTimeout(function(){ P.sfx.giggle(); }, 220);
    setTimeout(function(){ P.sfx.bird(); }, 520);

    var chips = r.lesson.words.map(function(w){
      return '<span class="ls-chip">' + esc(w.es) + ' \u2014 ' + esc(w.en) + '</span>';
    }).join('');
    var rows =
      '<div class="ls-rew"><span>' + A.icon('coin', 15) + ' +' + coins + ' coins</span>' +
      '<span>' + A.icon('book', 15) + ' +' + learnXp + ' Learn XP</span>' +
      (spark ? '<span>' + A.icon('spark', 15) + ' +' + spark + ' spark</span>' : '') +
      '<span>' + A.icon('flame', 15) + ' ' + s.streak + '-day streak</span></div>';
    var w0 = pick(r.lesson.words);
    speak(w0.es, c.ttsLang);   // Pippo says his new favorite word out loud
    var body = document.getElementById('lsBody');
    body.innerHTML =
      '<div class="ls-done-face"><svg viewBox="-40 -40 80 80" width="64" height="64">' + A.faceMini(P.S.buddy.look) + '</svg></div>' +
      '<div class="ls-q">Lesson complete!</div>' +
      '<div class="mtext soft" style="text-align:center">Pippo learned ' + r.lesson.words.length + ' new word' + (r.lesson.words.length > 1 ? 's' : '') + ' \u2014 \u00ab' + esc(w0.es) + '\u00bb is his favorite!</div>' +
      '<div class="ls-chips">' + chips + '</div>' + rows;
    var foot = document.getElementById('lsFoot');
    foot.innerHTML = '<button class="btn primary" id="lsDone" style="width:100%">Continue</button>';
    document.getElementById('lsDone').addEventListener('click', function(){
      quitRun();
      setTimeout(function(){ open(c.id); }, 250);
    });
  }

  /* ---------- course home (lesson list) ---------- */
  function lessonRow(c, l){
    var s = cstate(c.id);
    var idx = lessonIndex(c, l.id);
    var f = flat(c);
    var prevDone = idx === 0 || !!s.done[f[idx - 1].id];
    var d = s.done[l.id];
    if (d){
      var stars = d.stars || 1;
      return '<div class="ls-row done">' +
        '<span class="ls-ico">' + A.icon('star', 17) + '</span>' +
        '<span class="ls-name">' + esc(l.title) + '</span>' +
        '<span class="ls-stars">' + stars + '/3</span>' +
        '<button class="it-buy" data-practice="' + l.id + '">Practice</button>' +
        '</div>';
    }
    if (!prevDone){
      return '<div class="ls-row locked">' +
        '<span class="ls-ico">' + A.icon('book', 17) + '</span>' +
        '<span class="ls-name">' + esc(l.title) + '</span>' +
        '<span class="ls-lock">finish previous</span>' +
        '</div>';
    }
    var isNext = nextLesson(c) && nextLesson(c).id === l.id;
    return '<div class="ls-row avail">' +
      '<span class="ls-ico">' + A.icon('book', 17) + '</span>' +
      '<span class="ls-name">' + esc(l.title) + '</span>' +
      (isNext && s.lastDay !== ST.dayKey() ? '<span class="ls-badge">new today</span>' : '') +
      '<button class="it-buy" data-lesson="' + l.id + '">Start</button>' +
      '</div>';
  }

  function isLocked(cid){
    var c = course(cid);
    return !!(c && c.cost && !(P.S.unlocked || {})[cid]);
  }

  /* spark-gated course unlock screen */
  function openUnlock(c){
    var S = P.S;
    var afford = (S.sparks || 0) >= c.cost;
    var html =
      '<div class="ls-head">' +
        '<span class="cc-ico">' + A.icon(c.flagIcon || 'flag', 30) + '</span>' +
        '<div class="ls-headinfo"><div class="ls-title">' + esc(c.name) + ' with Pippo</div>' +
        '<div class="mtext soft">' + flat(c).length + ' lessons \u00b7 ' + flat(c).reduce(function(n, l){ return n + l.words.length; }, 0) + ' new words</div></div>' +
      '</div>' +
      '<div class="unlock-card">' +
        '<div class="unlock-spark">' + A.icon('spark', 26) + ' <b>' + c.cost + ' sparks</b></div>' +
        '<div class="mtext soft" style="text-align:center">Earn sparks with deep-focus sprints and lessons. Pippo can\u2019t wait to speak ' + esc(c.name) + ' with you!</div>' +
        '<button class="btn primary big" id="btnUnlockCourse" style="width:100%" ' + (afford ? '' : 'disabled') + '>' +
          (afford ? 'Unlock ' + esc(c.name) + ' \u2014 ' + c.cost + ' sparks' : 'Not enough sparks yet') + '</button>' +
      '</div>';
    SC.openModal({ title: 'Locked course', body: html });
    var btn = document.getElementById('btnUnlockCourse');
    if (btn && afford){
      btn.addEventListener('click', function(){
        S.sparks = Math.round((S.sparks || 0) - c.cost);
        (S.unlocked = S.unlocked || {})[c.id] = true;
        ST.save(); SC.refreshHUD();
        P.sfx.buy();
        SC.toast(c.name + ' unlocked! Pippo is thrilled');
        P.memory.journalAdd('spark', 'Unlocked the ' + c.name + ' course!');
        P.memory.check();
        setTimeout(function(){ open(c.id); }, 200);
      });
    }
  }

  function open(cid){
    var c = course(cid);
    if (!c) return;
    if (isLocked(cid)) return openUnlock(c);
    var s = cstate(cid);
    var lv = levelInfo(s.xp);
    var pr = progress(cid);
    var html =
      '<div class="ls-head">' +
        '<span class="cc-ico">' + A.icon(c.flagIcon || 'flag', 30) + '</span>' +
        '<div class="ls-headinfo"><div class="ls-title">' + esc(c.name) + ' with Pippo</div>' +
        '<div class="mtext soft">Level ' + lv.lv + ' \u00b7 ' + lv.name + ' \u00b7 ' + pr.done + '/' + pr.total + ' lessons \u00b7 ' + s.words + ' words</div></div>' +
        '<span class="ls-streak">' + A.icon('flame', 16) + ' ' + s.streak + '</span>' +
      '</div>';
    c.units.forEach(function(u){
      html += '<div class="ls-unit">' + esc(u.name) + '</div>';
      html += u.lessons.map(function(l){ return lessonRow(c, l); }).join('');
    });
    html += '<div class="mrow" style="margin-top:8px"><button class="btn" id="btnWordbook">' + A.icon('book', 15) + ' Wordbook</button></div>' +
      '<div class="mtext soft" style="text-align:center;margin-top:8px">One fresh lesson a day keeps the streak! Finished lessons can be practiced anytime.</div>';
    SC.openModal({ title: 'Learn with Pippo', body: html });
    var modal = document.querySelector('#modalRoot .modal');
    if (!modal) return;
    var wbBtn = document.getElementById('btnWordbook');
    if (wbBtn) wbBtn.addEventListener('click', function(){ P.sfx.tap(); openWordbook(cid); });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-lesson]'), function(b){
      b.addEventListener('click', function(){
        var lid = b.getAttribute('data-lesson');
        var idx = lessonIndex(c, lid);
        var l = flat(c)[idx];
        SC.closeModal ? SC.closeModal() : null;
        startRun(c, l, false);
      });
    });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-practice]'), function(b){
      b.addEventListener('click', function(){
        var lid = b.getAttribute('data-practice');
        var idx = lessonIndex(c, lid);
        var l = flat(c)[idx];
        SC.closeModal ? SC.closeModal() : null;
        startRun(c, l, true);
      });
    });
  }

  /* test hooks (not used by gameplay) */
  function _dbg(){
    if (!RUN) return null;
    var ex = RUN.cur;
    if (!ex) return { type: 'recap', solved: RUN.solved };
    var out = { type: ex.type, queue: RUN.queue.length, solved: RUN.solved };
    if (ex.opts) out.opts = ex.opts.map(function(o){ return { text: o._t || (ex.reverse ? o.es : o.en), ok: o.ok }; });
    if (ex.type === 'bank') out.ans = ex.ans;
    if (ex.type === 'match') out.pairs = ex.pairs;
    return out;
  }

  /* ---------- Pippo talks: learned words come alive ---------- */
  function pools(){
    var out = [];
    var CS = P.data.COURSES || {};
    Object.keys(P.S.lessons || {}).forEach(function(cid){
      var c = CS[cid];
      var pool = (P.S.lessons[cid].pool || []);
      if (!c || !pool.length) return;
      pool.forEach(function(w){ out.push({ es: w.es, en: w.en, lang: c.ttsLang, course: c.name }); });
    });
    return out;
  }
  function randomWord(){
    var p = pools();
    return p.length ? p[(Math.random() * p.length) | 0] : null;
  }
  /* returns a word to say if the cooldown has passed, and stamps the cooldown */
  function maybeWordTalk(gapMs){
    var S = P.S;
    var now = Date.now();
    if (S.flags.lastTalk && now - S.flags.lastTalk < (gapMs || 240000)) return null;
    var w = randomWord();
    if (!w) return null;
    S.flags.lastTalk = now;
    return w;
  }
  function sayWord(w){
    if (!w) return;
    SC.speech(w.es + ' \u00b7 ' + w.en + '!', 3000);
    speak(w.es, w.lang);
    var p0 = SC.r2s(240, 380);
    P.fx.burst('heart', p0.x + 26, p0.y - 20, 2, 18);
  }

  /* ---------- wordbook: review everything Pippo has learned ---------- */
  function allCourseWords(c){
    var out = [];
    c.units.forEach(function(u){ u.lessons.forEach(function(l){
      l.words.forEach(function(w){ out.push({ es: w.es, en: w.en }); });
    }); });
    return out;
  }
  function openWordbook(cid){
    var c = course(cid);
    if (!c) return;
    var s = cstate(cid);
    var known = {};
    (s.pool || []).forEach(function(w){ known[w.es] = true; });
    var all = allCourseWords(c);
    var nKnown = all.filter(function(w){ return known[w.es]; }).length;
    var html = '<div class="wb-count mtext soft">Pippo knows ' + nKnown + ' of ' + all.length + ' words \u2014 tap a word to hear it!</div>' +
      '<div class="wb-grid">';
    all.forEach(function(w){
      var got = !!known[w.es];
      html += '<button class="wb-chip' + (got ? ' got' : '') + '" data-say="' + esc(w.es) + '"' + (got ? '' : ' disabled') + '>' +
        (got ? esc(w.es) + '<i>' + esc(w.en) + '</i>' : '? ? ?') + '</button>';
    });
    html += '</div>' +
      (nKnown < all.length ? '<div class="mtext soft" style="text-align:center;margin-top:8px">Finish more lessons to teach Pippo the rest!</div>' : '');
    SC.openModal({ title: 'Wordbook \u00b7 ' + c.name, body: html });
    var modal = document.querySelector('#modalRoot .modal');
    if (!modal) return;
    Array.prototype.forEach.call(modal.querySelectorAll('[data-say]'), function(b){
      b.addEventListener('click', function(){ speak(b.getAttribute('data-say'), c.ttsLang); });
    });
  }

  return {
    open: open,
    progress: progress,
    speak: speak,
    _dbg: _dbg,
    quit: quitRun,
    sceneActive: sceneActive,
    boardData: boardData,
    cheerOn: cheerOn,
    sadOn: sadOn,
    newToday: newToday,
    isLocked: isLocked,
    pools: pools,
    randomWord: randomWord,
    maybeWordTalk: maybeWordTalk,
    sayWord: sayWord,
    openWordbook: openWordbook
  };
})();
