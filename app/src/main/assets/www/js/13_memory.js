/* Phase 3 memory: badges (achievements) + the storybook journal.
   Badge checks are cheap predicates over state; check() runs after meaningful
   events (lesson finished, focus sprint, quests, day rollover, panel opened).
   Journal entries are one-line memories grouped by day in the Story panel. */
window.P = window.P || {};
P.memory = (function(){
  var SC = P.screens, ST = P.state, A = P.art;
  var JCAP = 80;   // keep the last 80 memories

  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c];
    });
  }

  /* ---------- journal ---------- */
  function journalAdd(icon, text){
    var S = P.S;
    if (!S || !text) return;
    if (!S.journal) S.journal = [];
    S.journal.push({ d: ST.dayKey(), i: icon, t: text });
    if (S.journal.length > JCAP) S.journal.splice(0, S.journal.length - JCAP);
    ST.save();
  }

  /* ---------- badge helpers ---------- */
  function totalLessons(){
    var n = 0;
    Object.keys(P.S.lessons || {}).forEach(function(k){ n += Object.keys(P.S.lessons[k].done).length; });
    return n;
  }
  function bestStreak(){
    var b = 0;
    Object.keys(P.S.lessons || {}).forEach(function(k){ b = Math.max(b, P.S.lessons[k].streakBest || 0); });
    return b;
  }
  function brainLv3(){
    var th = (P.TUNE && P.TUNE.brain && P.TUNE.brain.thresholds) || [80, 190, 360, 600, 900];
    var ok = false;
    Object.keys(P.S.brain).forEach(function(k){ if (P.S.brain[k] >= th[1]) ok = true; });
    return ok;
  }

  var BADGES = [
    { id:'firstBite',  name:'First bite',       desc:'Feed Pippo for the very first time', icon:'bottle', test:function(){ return P.S.stats.feeds >= 1; } },
    { id:'bigEater',   name:'Little foodie',    desc:'Serve 25 meals',                     icon:'apple',  test:function(){ return P.S.stats.feeds >= 25; } },
    { id:'squeaky',    name:'Squeaky clean',    desc:'Give 10 cozy baths',                 icon:'bath',   test:function(){ return P.S.stats.baths >= 10; } },
    { id:'playmate',   name:'Best playmate',    desc:'Play together 20 times',             icon:'ball',   test:function(){ return P.S.stats.plays >= 20; } },
    { id:'cuddles',    name:'Cuddle bug',       desc:'Give 100 gentle pats',               icon:'heart',  test:function(){ return P.S.stats.care >= 100; } },
    { id:'scholar',    name:'First lesson',     desc:'Finish a lesson with Pippo',         icon:'book',   test:function(){ return totalLessons() >= 1; } },
    { id:'bookworm',   name:'Bookworm',         desc:'Finish 10 lessons',                  icon:'quest',  test:function(){ return totalLessons() >= 10; } },
    { id:'perfect',    name:'Flawless',         desc:'A 3-star lesson, no mistakes',       icon:'star',   test:function(){ return P.S.stats.stars3 >= 1; } },
    { id:'streak7',    name:'Week of learning', desc:'Keep a 7-day lesson streak',         icon:'flame',  test:function(){ return bestStreak() >= 7; } },
    { id:'focused',    name:'Deep diver',       desc:'Finish 5 focus sprints',             icon:'timer',  test:function(){ return P.S.stats.focusRuns >= 5; } },
    { id:'sparky',     name:'Spark collector',  desc:'Earn 10 sparks in total',            icon:'spark',  test:function(){ return P.S.stats.sparksEarned >= 10; } },
    { id:'brightMind', name:'Bright mind',      desc:'Any brain stat reaches level 3',     icon:'brain',  test:brainLv3 },
    { id:'bond',       name:'True friends',     desc:'Reach friendship level 4',           icon:'heart',  test:function(){ return ST.bondLevel() >= 4; } },
    { id:'rich',       name:'Piggy bank',       desc:'Save up 200 coins',                  icon:'coin',   test:function(){ return P.S.coins >= 200; } }
  ];

  function check(){
    var S = P.S;
    if (!S || !S.flags.adopted || !S.stats) return;
    var fresh = [];
    BADGES.forEach(function(b){
      if (!S.achv[b.id] && b.test()){ S.achv[b.id] = ST.dayKey(); fresh.push(b); }
    });
    if (fresh.length){
      ST.save();
      fresh.forEach(function(b){
        journalAdd('badge', 'New badge: ' + b.name + '!');
        SC.toast(A.icon('badge', 15) + ' Badge earned: ' + esc(b.name));
      });
      P.sfx.cheer();
    }
    return fresh.length;
  }

  /* ---------- panels ---------- */
  function openBadges(){
    check();
    var S = P.S;
    var n = 0;
    var html = '<div class="badge-grid">';
    BADGES.forEach(function(b){
      var got = !!S.achv[b.id];
      if (got) n++;
      html += '<div class="badge' + (got ? ' on' : '') + '">' +
        '<span class="badge-ico">' + A.icon(b.icon, 22) + '</span>' +
        '<span class="badge-name">' + esc(b.name) + '</span>' +
        '<span class="badge-desc">' + esc(b.desc) + '</span>' +
        (got ? '<span class="badge-day">' + esc(S.achv[b.id]) + '</span>' : '') +
        '</div>';
    });
    html += '</div><div class="mtext soft" style="text-align:center;margin-top:8px">' + n + ' of ' + BADGES.length + ' badges earned</div>';
    SC.openModal({ title: 'Badges', body: html });
  }

  function openJournal(){
    var S = P.S;
    var list = (S.journal || []).slice().reverse();   // newest first
    var html = '<div class="journal">';
    if (!list.length){
      html += '<div class="mtext soft" style="text-align:center;padding:14px 0">The story is just beginning\u2026 care for Pippo, finish a lesson or a focus sprint to fill these pages!</div>';
    } else {
      var lastDay = null;
      list.forEach(function(e){
        if (e.d !== lastDay){
          if (lastDay !== null) html += '</div>';
          html += '<div class="j-day">' + esc(e.d) + '</div><div class="j-group">';
          lastDay = e.d;
        }
        html += '<div class="j-row"><span class="j-ico">' + A.icon(e.i || 'heart', 15) + '</span><span class="j-text">' + esc(e.t) + '</span></div>';
      });
      html += '</div>';
    }
    html += '</div>';
    SC.openModal({ title: "Pippo's story", body: html });
  }

  return {
    journalAdd: journalAdd,
    check: check,
    openBadges: openBadges,
    openJournal: openJournal,
    badges: BADGES
  };
  })();
