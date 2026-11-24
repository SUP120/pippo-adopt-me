/* Mini-games (Play shelf): the Play dock opens a game picker.
   Pippo Pairs  = brain game (memory match, grants Focus XP)
   Bubble Pop   = normal fun game (tap floating bubbles)
   Peek-a-Boo   = the classic scene game, stays in 08_screens.
   All games share one reward pipe: mood, day-capped coins, play quest, bond. */
window.P = window.P || {};
P.games = (function(){
  var SC = P.screens, ST = P.state;
  var RUN = null;

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

  /* ---------- shared shell ---------- */
  function shell(title, sub){
    closeGame();
    var layer = document.createElement('div');
    layer.className = 'game-layer';
    layer.innerHTML =
      '<div class="game-box">' +
        '<div class="game-top"><span class="game-title">' + esc(title) + '</span>' +
        '<button class="modal-close" id="gameQuit">' + P.art.icon('close', 16) + '</button></div>' +
        '<div class="game-sub">' + esc(sub) + '</div>' +
        '<div class="game-body" id="gameBody"></div>' +
      '</div>';
    document.getElementById('screen-home').appendChild(layer);
    RUN = { layer: layer, cleanups: [] };
    document.getElementById('gameQuit').addEventListener('click', quit);
    P.sfx.bird();
    return layer;
  }
  function quit(){
    P.sfx.tap();
    closeGame();
    if (SC.speech) SC.speech('More games later? Okay~', 2200);
  }
  function closeGame(){
    if (RUN && RUN.cleanups){
      RUN.cleanups.forEach(function(f){ try { f(); } catch (e) {} });
    }
    if (RUN && RUN.layer) RUN.layer.remove();
    RUN = null;
  }
  function isOver(){ return !RUN; }

  /* one reward pipe for every game (mirrors the peek-a-boo rewards) */
  function reward(o){
    var S = P.S;
    ST.addMeter('mood', o.mood || 0);
    var earn = Math.min(o.coins || 0, Math.max(0, 20 - (S.daily.playCoins || 0)));
    S.daily.playCoins = (S.daily.playCoins || 0) + earn;
    if (earn) ST.addCoins(earn);
    S.stats.plays++; S.stats.care++;
    if (P.quests) P.quests.bump('playCount');
    ST.addBond(8);
    if (o.focusXp && P.livelihood && P.livelihood.grantXp) P.livelihood.grantXp('focus', o.focusXp);
    if (earn) SC.toast('+' + earn + 'c');
    if (o.line) SC.speech(o.line, 2600);
    SC.refreshHUD(); ST.save();
  }
  function endPanel(opts){
    var body = document.getElementById('gameBody');
    if (!body || isOver()) return;
    body.innerHTML = '<div class="game-end">' +
      (opts.stars ? '<div class="game-stars">' + opts.stars + '</div>' : '') +
      '<div class="game-score">' + esc(opts.scoreLine) + '</div>' +
      '<div class="mrow"><button class="btn primary" id="gameAgain">' + esc(opts.againLabel) + '</button>' +
      '<button class="btn" id="gameDone">Done</button></div></div>';
    document.getElementById('gameAgain').addEventListener('click', function(){
      P.sfx.tap(); opts.again();
    });
    document.getElementById('gameDone').addEventListener('click', function(){
      P.sfx.tap(); closeGame(); SC.playReaction();
    });
    reward({ mood: opts.mood, coins: opts.coins, focusXp: opts.focusXp, line: opts.line });
  }
  function starRow(n){
    var out = '';
    for (var i = 0; i < 3; i++){
      out += '<span' + (i < n ? '' : ' class="star-off"') + '>' + P.art.icon('star', 26) + '</span>';
    }
    return out;
  }

  /* ================= PIPPO PAIRS (brain) ================= */
  function openPairs(){
    var icons = ['bottle', 'ball', 'star', 'heart', 'apple', 'moon'];
    var deck = shuffle(icons.concat(icons));
    shell('Pippo Pairs', 'A memory game \u2014 find all 6 matching pairs. Fewer moves, more stars!');
    var body = document.getElementById('gameBody');
    body.innerHTML = '<div class="pairs-grid">' + deck.map(function(ic){
      return '<button class="pair-card" data-ic="' + ic + '">' +
        '<span class="pc-back">' + P.art.icon('spark', 15) + '</span>' +
        '<span class="pc-face">' + P.art.icon(ic, 26) + '</span></button>';
    }).join('') + '</div><div class="pairs-stats" id="pairStats">Moves 0 \u00b7 Pairs 0/6</div>';
    var st = { first: null, lock: false, matched: 0, moves: 0 };
    function stats(){
      var el = document.getElementById('pairStats');
      if (el) el.textContent = 'Moves ' + st.moves + ' \u00b7 Pairs ' + st.matched + '/6';
    }
    Array.prototype.forEach.call(body.querySelectorAll('.pair-card'), function(b){
      b.addEventListener('click', function(){
        if (isOver() || st.lock || b.classList.contains('open')) return;
        b.classList.add('open'); P.sfx.tap();
        if (!st.first){ st.first = b; return; }
        st.moves++; stats();
        if (st.first.getAttribute('data-ic') === b.getAttribute('data-ic')){
          st.first.classList.add('done'); b.classList.add('done');
          st.first = null; st.matched++; stats();
          if (P.sfx.giggle) P.sfx.giggle();
          if (st.matched === 6){
            var stars = st.moves <= 8 ? 3 : (st.moves <= 12 ? 2 : 1);
            endPanel({
              stars: starRow(stars),
              scoreLine: 'All 6 pairs found in ' + st.moves + ' moves!',
              againLabel: 'Play again',
              again: openPairs,
              mood: 8 + stars * 3,
              coins: stars * 2,
              focusXp: stars === 3 ? 8 : (stars === 2 ? 5 : 3),
              line: pick(stars === 3
                ? ['Super memory!', 'My brain is sparkly!', 'Nothing hides from us!']
                : ['Pairs found!', 'Good thinking!'])
            });
          }
        } else {
          st.lock = true;
          var a = st.first; st.first = null;
          if (P.sfx.wrong) P.sfx.wrong();
          setTimeout(function(){
            if (isOver()) return;
            a.classList.remove('open'); b.classList.remove('open'); st.lock = false;
          }, 680);
        }
      });
    });
  }

  /* ================= BUBBLE POP (fun) ================= */
  function bubbleSvg(gold){
    var fill = gold ? '#ffcf5c' : '#c9e7f2';
    return '<svg viewBox="0 0 40 40" fill="none">' +
      '<circle cx="20" cy="20" r="17" fill="' + fill + '" stroke="#423a34" stroke-width="2.4"/>' +
      '<ellipse cx="14" cy="11.5" rx="5" ry="3.2" fill="#fdf8e7" stroke="none" opacity=".9"/>' +
      '<circle cx="14.6" cy="22.5" r="1.7" fill="#423a34" stroke="none"/>' +
      '<circle cx="25.4" cy="22.5" r="1.7" fill="#423a34" stroke="none"/>' +
      '<path d="M15.5 26.5 q4.5 3.8 9 0" stroke="#423a34" stroke-width="2" stroke-linecap="round"/>' +
      (gold ? '<path d="M20 4.6 l1 3.1 3.2 .5 -2.3 2.2 .5 3.2 -2.4 -1.4 -2.4 1.4 .5 -3.2 -2.3 -2.2 3.2 -.5 Z" fill="#e8a020" stroke="#423a34" stroke-width="1.2"/>' : '') +
      '</svg>';
  }
  function openBubbles(){
    shell('Bubble Pop', 'Tap bubbles before they float away \u2014 gold ones are worth 3!');
    var body = document.getElementById('gameBody');
    body.innerHTML = '<div class="bub-field" id="bubField"></div>' +
      '<div class="bub-hud"><span id="bubScore">0</span>&nbsp;popped \u00b7 <span id="bubTime">30</span>s left</div>';
    var field = document.getElementById('bubField');
    var score = 0, t = 30, over = false;
    function mkBubble(){
      if (over || isOver()) return;
      var gold = Math.random() < 0.14;
      var size = 42 + ((Math.random() * 26) | 0);
      var b = document.createElement('button');
      b.className = 'bub' + (gold ? ' gold' : '');
      b.style.width = size + 'px'; b.style.height = size + 'px';
      b.style.left = (3 + Math.random() * 80) + '%';
      b.innerHTML = bubbleSvg(gold);
      field.appendChild(b);
      var dur = 5.2 + Math.random() * 2.6;
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        if (!b.parentNode || over) return;
        b.style.transition = 'transform ' + dur + 's linear';
        b.style.transform = 'translateY(-' + (field.clientHeight + 120) + 'px)';
      });});
      var kill = setTimeout(function(){ if (b.parentNode) b.remove(); }, dur * 1000 + 500);
      RUN.cleanups.push(function(){ clearTimeout(kill); if (b.parentNode) b.remove(); });
      b.addEventListener('click', function(){
        if (over || isOver() || b.classList.contains('pop')) return;
        score += gold ? 3 : 1;
        var sc = document.getElementById('bubScore');
        if (sc) sc.textContent = score;
        b.classList.add('pop'); P.sfx.tap();
        setTimeout(function(){ if (b.parentNode) b.remove(); }, 240);
      });
    }
    mkBubble();
    var spawn = setInterval(mkBubble, 540);
    var timer = setInterval(function(){
      if (over || isOver()) return;
      t--;
      var te = document.getElementById('bubTime');
      if (te) te.textContent = t;
      if (t <= 0){
        over = true;
        clearInterval(spawn); clearInterval(timer);
        Array.prototype.forEach.call(field.querySelectorAll('.bub'), function(x){
          x.style.pointerEvents = 'none';
        });
        endPanel({
          scoreLine: score + ' bubbles popped!',
          againLabel: 'Pop again',
          again: openBubbles,
          mood: 6 + Math.min(10, (score / 2) | 0),
          coins: Math.min(9, (score / 3) | 0),
          focusXp: 0,
          line: pick(score >= 16
            ? ['So many bubbles!', 'Pop pop pop, hooray!', 'Bubble champion!']
            : ['Bubbles are fun!', 'More next time!'])
        });
      }
    }, 1000);
    RUN.cleanups.push(function(){ clearInterval(spawn); clearInterval(timer); });
  }

  /* ---------- public ---------- */
  return {
    start: function(id){
      if (id === 'pairs') openPairs();
      else if (id === 'bubbles') openBubbles();
    },
    openPairs: openPairs,
    openBubbles: openBubbles,
    close: closeGame
  };
})();
