/* A single activity counts for today; completing every available quest earns a bonus. */
window.P = window.P || {};
P.quests = (function(){
  var Q = P.data.QUESTS, SC = P.screens, ST = P.state;

  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c];
    });
  }
  function val(stat){ return P.S.daily[stat] || 0; }
  function isDone(id){
    var d = P.S.daily.questDone || {};
    return !!d[id];
  }
  function allDone(){
    return available().every(function(q){ return isDone(q.id); });
  }
  function available(){
    return Q.filter(function(q){ return q.id !== 'focus' || (ST.stage() >= 3 && P.S.buddy.prof); });
  }
  function goodDay(){
    var S = P.S;
    if (S.daily.goodDay) return;
    S.daily.goodDay = true;
    S.streak++;
    S.streakBest = Math.max(S.streakBest, S.streak);
    ST.save();
  }

  /* ---------- evaluation & rewards ---------- */
  function evaluate(){
    var S = P.S;
    S.daily.questDone = S.daily.questDone || {};
    var completed = [];
    available().forEach(function(q){
      if (!S.daily.questDone[q.id] && val(q.stat) >= q.target){
        S.daily.questDone[q.id] = true;
        ST.addCoins(q.rew);
        completed.push(q);
      }
    });
    completed.forEach(function(q){
      P.sfx.buy();
      SC.toast(P.art.icon('quest', 15) + ' ' + q.name + ' \u00b7 +' + q.rew + 'c');
    });
    if (!S.daily.allDone && allDone()){
      S.daily.allDone = true;
      var bonus = 10 + Math.min(20, (S.streak || 0) * 4);
      ST.addCoins(bonus);
      S.sparks = Math.round((S.sparks || 0) + 1);
      S.stats.sparksEarned++;
      S.stats.perfectDays++;
      var p0 = SC.r2s(240, 360);
      P.fx.burst('leaf', p0.x, p0.y, 10, 60);
      P.fx.burst('spark', p0.x + 24, p0.y - 14, 7, 32);
      P.sfx.cheer();
      SC.toast('All quests done! +' + bonus + 'c +1 spark');
      SC.speech('Best day ever! Same tomorrow?', 3200);
      if (window.P.memory){
        P.memory.journalAdd('quest', 'Perfect day \u2014 every quest done!');
        P.memory.check();
      }
    }
    if (completed.length || S.daily.allDone){ SC.refreshHUD(); }
    ST.save();
  }
  function bump(stat){          // care counters (feed / bath / play / pet)
    ST.rolloverDaily();
    goodDay();
    P.S.daily[stat] = (P.S.daily[stat] || 0) + 1;
    evaluate();
  }
  function setFlag(stat){       // one-shot day flags (focus sprint / on-time bed)
    ST.rolloverDaily();
    goodDay();
    if (!P.S.daily[stat]) P.S.daily[stat] = 1;
    evaluate();
  }
  function bedTuck(){           // called on player tuck-ins (nap button / bed modal)
    var S = P.S, h = ST.clockParts().h;
    var bt = S.settings.bedtime;
    if (h >= bt && h < (bt + 2) % 24 || (bt + 2 > 24 && h < (bt + 2) - 24)){
      setFlag('onBed');
    }
  }
  function rollover(previous){
    var S = P.S;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (previous.key !== ST.dayKey(yesterday.getTime())) S.streak = 0;
    else if (!previous.goodDay) S.streak = previous.allDone ? S.streak + 1 : 0;
    S.streakBest = Math.max(S.streakBest || 0, S.streak || 0);
    ST.save();
  }

  /* ---------- panel ---------- */
  function openPanel(){
    var S = P.S;
    if (!S || !S.flags.adopted) return;
    ST.rolloverDaily();
    var rows = available().map(function(q){
      var n = Math.min(val(q.stat), q.target);
      var done = isDone(q.id);
      return '<div class="quest-row' + (done ? ' done' : '') + '">' +
        '<span class="q-ico">' + P.art.icon(q.icon, 20) + '</span>' +
        '<span class="q-name">' + q.name + '</span>' +
        (done
          ? '<span class="q-check">' + P.art.icon('spark', 15) + '</span>'
          : '<span class="q-prog">' + n + '/' + q.target + '</span>') +
        '<span class="q-rew">' + P.art.icon('coin', 13) + (done ? '\u2713' : '+' + q.rew) + '</span>' +
        '</div>';
    }).join('');
    SC.openModal({
      title: 'Daily quests',
      body: '<div class="quest-streak">' +
        '<span class="streak-chip">' + P.art.icon('flame', 17) + ' ' + (S.streak || 0) + '-day streak</span>' +
        '<span class="streak-chip soft">best ' + (S.streakBest || 0) + '</span>' +
        '</div>' +
        rows +
        '<div class="mtext soft" style="text-align:center">' + (S.daily.goodDay ? 'Today already counts.' : 'One care activity, lesson or little note counts today.') + ' These quests are optional extras.</div>'
    });
  }

  return {
    openPanel: openPanel,
    bump: bump,
    setFlag: setFlag,
    bedTuck: bedTuck,
    rollover: rollover,
    evaluate: evaluate
  };
})();
