/* ============ PIPPO & ME — boot & game loop ============ */
window.P = window.P || {};
(function(){
  var st = P.state, sfx = P.sfx, art = P.art;

  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------- error trap (dev aid) ---------- */
  window.addEventListener('error', function(e){
    var t = document.getElementById('errtrap');
    if (!t){
      t = document.createElement('div');
      t.id = 'errtrap';
      t.addEventListener('click', function(){ t.style.display = 'none'; });
      document.body.appendChild(t);
    }
    t.style.display = 'block';
    t.textContent = 'Oops: ' + (e.message || e.type);
  });

  P.boot = function(){
    st.load();
    P.fx.mount(document.getElementById('fxlayer'));

    /* rAF life loop */
    function raf(ts){
      if (P.rigs && P.rigs.length){
        for (var i = 0; i < P.rigs.length; i++) P.rigs[i].frame(ts);
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    P.screens.enterSplash();
  };

  /* ---------- 1-second world tick ---------- */
  P.tick = function(){
    var S = P.S;
    if (!S || !S.flags.adopted) return;
    var now = Date.now();
    var _ = P._loopStart;
    if (!P._lastTick || P._lastTick > now) P._lastTick = now;
    var dtH = (now - P._lastTick) / 3600000;
    P._lastTick = now;
    if (dtH <= 0) dtH = 0.0003;

    // tutorial runs its first day ~12x, turbo x60
    var mult = 1;
    if (S.settings.turbo) mult *= P.TUNE.turbo;
    if (S.flags.tut >= 0) mult *= 12;
    if (!S.buddy.bornAt) return;
    st.tickDecay(dtH * mult);

    var cp = st.clockParts();
    var today = st.dayKey();

    // --- sleep engine ---
    if (S.buddy.asleep){
      var msAsleep = now - S.buddy.sleepStart;
      var full = S.buddy.meters.sleep >= 99.4;
      var morning = !st.isNight();
      if (full || (morning && msAsleep > 45 * 60 * 1000)){
        if (full && !morning && msAsleep < 3 * 60 * 60 * 1000){
          // brief nap finished in the night: wake quietly, no gift
          S.buddy.asleep = false; S.buddy.sleepStart = 0;
          sfx.stopLullaby();
          P.screens.setSleepingFx(false);
          P.screens.compose(); P.screens.refreshHUD(); st.save();
        } else {
          P.screens.wake(true);
        }
      }
    } else {
      if (S.buddy.shortNight && !S.buddy.asleep){
        // day after a skipped bedtime: buddy is drained and keeps mentioning it
        if (!P.gameX.dayYawnAt || now - P.gameX.dayYawnAt > 300000){
          P.gameX.dayYawnAt = now;
          P.screens.speech(pick(['So sleepy today\u2026 my eyelids are heavy\u2026', 'I barely slept last night\u2026', 'Can I pleeease have a nap?\u2026', 'Zzz\u2026 oops \u2014 I nodded off there\u2026']), 3400);
        }
      } else {
        P.gameX.dayYawnAt = 0;
      }
      // bedtime prompt, sleepy yawns while ignored, forced tuck at +2h (evening)
      var h = cp.h;
      var bt = S.settings.bedtime;
      if (h >= bt && h < 24 && !S.buddy.asleep){
        if (P.gameX.bedPromptDay !== today){
          P.gameX.bedPromptDay = today;
          P.gameX.yawnAt = 0;
          P.screens.speech(pick(['I am getting sleepy\u2026 yawnyawn.', 'The moon is out\u2026']), 3200);
          P.screens.bedPrompt();      // the game asks kindly once
        } else if (!P.gameX.yawnAt || now - P.gameX.yawnAt > 240000){
          // player is putting it off: buddy yawns and complains periodically
          P.gameX.yawnAt = now;
          P.screens.speech(pick(['*yaaawn*\u2026 so sleepy\u2026', 'My eyes arezzz heavy\u2026', 'Can we pleeease sleep now\u2026', 'Tomorrow will feel bad if I stay up\u2026']), 3000);
        }
        if (h >= (bt + 2) % 24){
          // 2h past bedtime: buddy tucks itself in — but tonight is a short night
          S.buddy.asleep = true; S.buddy.sleepStart = now;
          S.buddy.shortNight = true;   // weak rest -> red bar + dark circles tomorrow
          st.addMeter('mood', -8);
          sfx.night(); sfx.startLullaby();
          P.screens.compose();
          P.screens.setSleepingFx(true);
          P.screens.speech('Could not hold on\u2026 floppy sleep\u2026', 3200);
          P.screens.refreshHUD(); st.save();
        }
      }
    }

    // --- growth stages ---
    if (!S.flags.adopted) return;
    var stageNow = st.stage();
    if (stageNow !== S.buddy.stage && S.buddy.bornAt){
      var prev = S.buddy.stage;
      S.buddy.stage = stageNow;
      st.addCoins(30); st.addBond(15);
      sfx.cheer();
      var p = P.screens.r2s(240, 380);
      P.fx.burst('leaf', p.x, p.y, 10, 60);
      P.fx.burst('spark', p.x - 30, p.y, 6, 30);
      var label = st.STAGE_NAMES[stageNow];
      P.screens.toast('Grew into a ' + label + '! +30c');
      P.screens.speech(prev === 0 ? 'Look how big I got!' : 'I\u2019m a ' + label.toLowerCase() + ' now!', 3200);
      if (window.P.memory) P.memory.journalAdd('star', (S.buddy.name || 'Pippo') + ' grew into a ' + label + '!');
      if (window.P.memory) P.memory.check();
      if (stageNow === 3){
        setTimeout(function(){
          if (window.P.livelihood) P.livelihood.openCeremony();
          else P.speechModal();
        }, 1600);
      }
      P.screens.compose(); P.screens.refreshHUD(); st.save();
    }

    // --- periodic UI + save ---
    P.gameX._saveAcc = (P.gameX._saveAcc || 0) + dtH * mult;
    if (P.gameX._saveAcc >= 20 / 60){ P.gameX._saveAcc = 0; st.save(); }   // save every 20 game-minutes
    var minute = cp.m;
    if (minute !== P.gameX._lastMin){
      P.gameX._lastMin = minute;
      P.screens.compose();       // keeps the wall clock ticking
    }
    st.rolloverDaily();
    // --- visitors (Phase 6): a friend may knock on the door today ---
    if (window.P.screens && P.screens.guestTick) P.screens.guestTick();
    // --- Pippo talks: every few minutes awake, he uses a word he learned ---
    if (!S.buddy.asleep && !st.isNight() && window.P.lessons && !P.lessons.sceneActive() &&
        !(window.P.livelihood && P.livelihood.isActive()) && Math.random() < 0.02){
      var wTalk = P.lessons.maybeWordTalk(240000);   // min 4 real minutes between words
      if (wTalk) P.lessons.sayWord(wTalk);
    }
    P.screens.refreshHUD();
  };

  /* grown-up ceremony placeholder (Phase 2 replaces this with real professions) */
  P.speechModal = function(){
    P.screens.openModalSafe();
  };
  P.screens.openModalSafe = function(){
    var S = P.S;
    P.screens.closeModal();
    P.screens.openModal({
      title: 'All grown up!',
      body: '<div class="mtext">' + esc2(S.buddy.name) + ' has grown into an adult!<br><br>' +
        '<b>Profession selection</b> \u2014 where they choose to mirror YOUR real life (student, YouTuber, developer\u2026) \u2014 arrives in the next update. For now, they celebrate with you.<br><br>' +
        '<span class="mtext soft">Keep meters happy. The world grows with you.</span></div>'
    });
  };
  function esc2(s){ return String(s).replace(/[&<>"']/g, function(c){ return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]; }); }

  /* ---------- wire up ---------- */
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'hidden' && P.S && P.S.flags.adopted) st.save();
  });
  window.addEventListener('beforeunload', function(){ if (P.S) st.save(); });

  function start(){
    P.boot();
    if (window.P.livelihood){ P.livelihood.recover(); }
    P._lastTick = Date.now();
    setInterval(P.tick, 1000);
  }
  start();
})();
