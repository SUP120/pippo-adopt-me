/* ============ PIPPO & ME — screens, modals, care, mini-games ============ */
window.P = window.P || {};
(function(){
  var C = P.C, art = P.art, st = P.state, sfx = P.sfx, fx = P.fx, data = P.data;

  /* ---------------- tiny helpers ---------------- */
  function $(sel, root){ return (root || document).querySelector(sel); }
  function h(tag, cls, html){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  /* ---------------- toasts ---------------- */
  function toast(txt){
    var t = h('div', 'toast', txt);
    $('#toasts').appendChild(t);
    setTimeout(function(){ t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2300);
    setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, 2650);
  }

  /* ---------------- modal system ---------------- */
  var modalEl = null;
  function closeModal(){
    if (modalEl){ modalEl.parentNode.removeChild(modalEl); modalEl = null; }
  }
  function openModal(opts){
    closeModal();
    var back = h('div', 'modal-back');
    var m = h('div', 'modal');
    m.innerHTML =
      '<div class="modal-head"><div class="modal-title">' + opts.title + '</div>' +
      '<button class="modal-close" data-close>' + art.icon('close', 18) + '</button></div>' +
      '<div class="modal-body"></div>';
    var body = m.querySelector('.modal-body');
    if (typeof opts.body === 'string') body.innerHTML = opts.body;
    else if (opts.body) body.appendChild(opts.body);
    m.querySelector('[data-close]').addEventListener('click', function(){ sfx.tap(); closeModal(); if (opts.onClose) opts.onClose(); });
    back.appendChild(m);
    back.addEventListener('pointerdown', function(e){ if (e.target === back){ closeModal(); if (opts.onClose) opts.onClose(); } });
    $('#modalRoot').appendChild(back);
    modalEl = back;
    sfx.tap();
    return m;
  }

  /* ---------------- speech & fx helpers ---------------- */
  var speechTimer = null;
  function speech(txt, ms){
    var sp = $('#speech');
    if (!sp) return;
    sp.textContent = txt;
    sp.classList.remove('hidden');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(function(){ sp.classList.add('hidden'); }, ms || 2600);
    // restyle tail side randomly for charm
    sp.style.borderRadius = Math.random() < 0.5 ? '16px 22px 22px 22px' : '22px 16px 22px 22px';
  }
  function r2s(x, y){
    var scene = $('#scene'), stage = $('#stage');
    try{
      var pt = scene.createSVGPoint(); pt.x = x; pt.y = y;
      var p = pt.matrixTransform(scene.getScreenCTM());
      var r = stage.getBoundingClientRect();
      return { x: p.x - r.left, y: p.y - r.top };
    }catch(e){ return { x: x, y: y }; }
  }
  function heartBurstAt(x, y, n){ fx.burst('heart', x, y, n || 3, 20); }

  /* ---------------- shared game context ---------------- */
  var G = {
    rig: null, adoptRig: null,
    busy: false, fxPose: null,
    lastTick: 0, tickCount: 0,
    nightNudgeDay: '',
    homeLayout: null,
    lastMinute: -1,
    zzzTimer: null,
    room: 'home', walk: null, keeperUntil: 0
  };
  P.homeLayoutGet = function(){ return G.homeLayout; };

  /* ---------------- the house ----------------
     Every dock care action walks Pippo through the hallway door
     into its own cozy room. Door center x = 383 in every room. */
  var DOOR_X = 383;
  var HOUSE = {
    home:   { label: 'Home',        ax: 240, fy: 520, hello: ['Home sweet home!', 'Back home, hee hee~'] },
    dining: { label: 'Dining room', ax: 240, fy: 521, fy0: 498, hello: ['Mmm\u2026 something smells yummy!', 'Food time! Yay!'] },
    bath:   { label: 'Bathroom',    ax: 240, fy: 570, hello: ['Rub-a-dub-dub!', 'Splish splash, bath time!'] },
    play:   { label: 'Play room',   ax: 296, fy: 548, hello: ['Playtime! Hehe!', 'Toys, toys, toys!'] },
    bed:    { label: 'Bedroom',     ax: 250, fy: 556, hello: ['My cozy little bed\u2026', 'Sleepy corner\u2026'] },
    study:  { label: 'Study room',  ax: 240, fy: 556, hello: ['Quiet time\u2026 shh\u2026', 'Books and big ideas!'] },
    shop:   { label: 'Cozy Shop',   ax: 100, fy: 548, hello: ['Ooh, the cozy shop!', 'Hello, Mr. Shopkeeper!'] }
  };

  /* ---------------- walking between rooms ----------------
     Velocity-based rAF walker: re-reads the rig's place transform
     every frame, so a compose() rebuild mid-walk can't break it.
     Optional toY lerps the feet height (climbing into a chair). */
  function rigWalkTo(toX, toY, done){
    var t0 = performance.now(), last = t0;
    var SPEED = 0.24;   // scene units per ms
    var x0 = null, ty0 = 0, stopped = false;
    function step(now){
      if (stopped) return;
      var rig = G.rig;
      if (!G.walk || !rig){ stopped = true; if (done) done(); return; }
      rig.attach();
      var place = rig.refs.place;
      if (!place){ stopped = true; if (done) done(); return; }
      var items = place.transform.baseVal;
      var k = items.numberOfItems > 1 ? items.getItem(1).matrix.a : 1;
      var mtx = items.getItem(0).matrix;
      if (x0 === null){ x0 = mtx.e; ty0 = mtx.f; }
      var dt = Math.min(200, now - last); last = now;   // generous catch-up: rAF can throttle hard in occluded tabs
      var tyT = toY ? (toY - 210 * k) : ty0;
      var toE = toX - 100 * k;   // feet target -> place-translate space (place tx = fx - 100k)
      var x = mtx.e;
      if (Math.abs(toE - x) <= SPEED * dt + 2){
        stopped = true;
        place.setAttribute('transform', 'translate(' + toE.toFixed(1) + ' ' + tyT.toFixed(1) + ') scale(' + k + ')');
        if (done) done();
        return;
      }
      var nx = x + (toE > x ? 1 : -1) * SPEED * dt;
      var dx0 = toE - x0;
      var prog = dx0 ? Math.max(0, Math.min(1, (nx - x0) / dx0)) : 1;
      var ty = ty0 + (tyT - ty0) * prog;
      var hop = Math.abs(Math.sin((now - t0) * 0.011)) * 7;
      place.setAttribute('transform', 'translate(' + nx.toFixed(1) + ' ' + (ty - hop).toFixed(1) + ') scale(' + k + ')');
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    /* watchdog: when frames stop entirely (occluded tab / throttled
       webview) the interval still steps the walk to its anchor */
    var wd = setInterval(function(){
      if (stopped || !G.walk){ clearInterval(wd); return; }
      if (performance.now() - last > 350) step(performance.now());
    }, 320);
  }
  /* dock actions route through here: walk to the door, swap the
     scene, walk in from the door to the room's anchor, then act. */
  function goRoom(room, after){
    if (G.walk) return;
    if (guarded()) return;
    if (P.S.buddy.asleep){ speech(pick(['Shh\u2026 sweet dreams\u2026', 'Zzz\u2026']), 1800); return; }
    var stageN = P.S.buddy.stage;
    var floorY = stageN === 0 ? 543 : 545;
    if (room === G.room){
      if (after) after();
      return;
    }
    G.busy = true;
    G.walk = { room: room, after: after || null, phase: 'out' };
    rigWalkTo(DOOR_X, floorY, function(){
      if (!G.walk){ G.busy = false; return; }
      G.room = room;
      G.fxPose = null;
      G.walk.phase = 'in';
      compose(true);
      var info = HOUSE[room] || HOUSE.home;
      var fy2 = (stageN === 0 && info.fy0) ? info.fy0 : info.fy;
      rigWalkTo(info.ax, fy2, arriveRoom);
    });
  }
  function arriveRoom(){
    var w = G.walk;
    G.walk = null;
    G.busy = false;
    compose(true);
    if (w){
      var info = HOUSE[w.room];
      if (info){
        speech(pick(info.hello), 2400);
        if (G.rig) G.rig.wobble(420);
      }
      if (w.after) w.after();
    }
    refreshHUD();
  }
  /* shopkeeper waves when something is bought */
  function waveKeeper(){
    G.keeperUntil = Date.now() + 1400;
    if (G.room === 'shop') compose();
  }

  function compose(force){
    if (!P.S || !P.S.flags.adopted) return;
    var S = P.S, scene = $('#scene');
    if (!scene || (G.busy && !force)) return;
    var stageN = S.buddy.stage, look = S.buddy.look;
    var asleep = S.buddy.asleep;
    if (asleep && G.room && G.room !== 'bed') G.room = 'bed';   // tuck-ins happen in the bedroom
    var tired = !asleep && (S.buddy.shortNight || S.buddy.meters.sleep < 30);
    var cp = st.clockParts();
    var tod = st.isNight() ? 'night' : 'day';
    var owned = { rattle: !!S.inv.rattle, ball: !!S.inv.ball, plush: !!S.inv.plush };
    var wx = st.weather();
    var inner = '';
    var layout;

    var k0 = art.stageScale(stageN).k;
    var focusActive = window.P && window.P.livelihood && P.livelihood.isActive();

    if (window.P.lessons && P.lessons.sceneActive() && !G.fxPose && look){
      // garden schoolyard: blackboard on the tree, Pippo + Me learning
      var cheer = P.lessons.cheerOn(), lsSad = P.lessons.sadOn(), lsSleep = asleep;
      inner += art.gardenG({ tod: tod, cheer: cheer, sad: lsSad, board: P.lessons.boardData(), weather: wx });
      inner += art.rigG({
        stage: stageN, look: look,
        pose: cheer ? 'cheer' : 'idle',
        fx: 146, fy: 415,
        face: lsSleep ? 'closed' : undefined,
        mouth: lsSad ? 'sad' : (lsSleep ? 'smile' : undefined)
      });
      inner += art.meG(334, 415, cheer);
      inner += art.weatherG(wx);
      layout = { fx: 146, fy: 415, k: k0, hs: art.stageScale(stageN).hs };
    } else if (G.room !== 'home' && HOUSE[G.room] && look){
      // --- one of the house rooms: dining, bath, play, bed, study, shop ---
      var rInfo = HOUSE[G.room];
      var rStage = art.stageScale(stageN);
      var rTod = { tod: tod, weather: wx, hour: cp.h, minute: cp.m };
      var atDoor = !!(G.walk && G.walk.phase === 'in');
      var floorY = stageN === 0 ? 543 : 545;
      var ax = atDoor ? DOOR_X : rInfo.ax;
      var fy = atDoor ? floorY : ((stageN === 0 && rInfo.fy0) ? rInfo.fy0 : rInfo.fy);
      if (G.room === 'dining'){
        inner += art.diningG(rTod);
        inner += art.rigG({ stage: stageN, look: look, pose: G.fxPose === 'feed' ? 'feed' : 'idle', food: G.food, fx: ax, fy: fy, mouth: G.fxPose === 'feed' ? 'open' : undefined });
        inner += art.diningFront(stageN);
      } else if (G.room === 'bath'){
        inner += art.bathroomG(rTod);
        if (atDoor){
          inner += art.rigG({ stage: stageN, look: look, pose: 'idle', fx: ax, fy: 570 });
          fy = 570;
        } else {
          inner += art.tubBack(240, 505);
          inner += art.rigG({ stage: stageN, look: look, pose: 'bath', fx: 240, fy: 512 + 58 * k0 });
          inner += art.tubFront(240, 520);
          ax = 240; fy = 512 + 58 * k0;
        }
      } else if (G.room === 'play'){
        inner += art.playroomG(rTod);
        inner += art.rigG({ stage: stageN, look: look, pose: 'idle', fx: ax, fy: fy });
        inner += art.playFront();
      } else if (G.room === 'bed'){
        inner += art.bedroomG({ tod: tod, weather: wx, light: S.room.light !== 0 });
        inner += art.cribBack(190, 552);
        if (asleep){
          inner += '<g transform="translate(190 552) scale(' + rStage.k + ') translate(-190 -552)">' + art.babySleepG(190, 552, look) + '</g>';
        } else {
          inner += art.cribTidy(190, 552);
          inner += art.rigG({ stage: stageN, look: look, pose: 'idle', fx: ax, fy: fy });
        }
        inner += art.cribFront(190, 552, { blanket: false });
      } else if (G.room === 'study'){
        var profRef = P.data.profOf(S.buddy.prof);
        var prop0 = profRef ? profRef.prop : 'laptop';
        inner += art.studyRoomG(rTod);
        inner += art.deskBack(240, 545);
        if (focusActive){
          inner += art.rigG({ stage: stageN, look: look, pose: 'work', fx: 240, fy: 545 });
          ax = 240; fy = 545;
        } else {
          inner += art.rigG({ stage: stageN, look: look, pose: 'idle', fx: ax, fy: fy });
        }
        inner += art.deskFront(240, 545);
        inner += art.deskProps(240, 545, prop0);
      } else if (G.room === 'shop'){
        inner += art.shopG(rTod);
        inner += art.shopkeeperG(252, 468, (Date.now() < G.keeperUntil) ? 'wave' : 'idle');
        inner += art.shopCounter();
        inner += art.rigG({ stage: stageN, look: look, pose: 'idle', fx: ax, fy: fy });
      }
      layout = { fx: ax, fy: fy, k: rStage.k, hs: rStage.hs };
    } else if (G.fxPose === 'bath'){
      // legacy tub pose (bath now always runs inside the bathroom)
      inner = art.roomG({ tod: tod, hour: cp.h, minute: cp.m, owned: owned, room: S.room, posterRoom: S.room.posterRoom, weather: wx });
      inner += art.tubBack(240, 505);
      inner += art.rigG({ stage: stageN, look: look, pose: 'bath', fx: 240, fy: 512 + 58 * k0 });
      inner += art.tubFront(240, 520);
      layout = { fx: 240, fy: 512 + 58 * k0, k: k0, hs: art.stageScale(stageN).hs };
    } else if (stageN === 0){
      inner = art.roomG({ tod: tod, hour: cp.h, minute: cp.m, owned: owned, room: S.room, posterRoom: S.room.posterRoom, weather: wx });
      var sc0 = art.stageScale(0);
      if (asleep){
        inner += art.babySleepG(240, 552, look);
        layout = { fx: 240, fy: 552, k: sc0.k, hs: sc0.hs };
      } else {
        var pose0 = G.fxPose === 'feed' ? 'feed' : 'idle';
        var face0 = 'open';
        var mouth0 = G.fxPose === 'feed' ? 'open' : (tired ? 'tired' : 'smile');
        inner += art.rigG({ stage: 0, look: look, pose: pose0, face: face0, mouth: mouth0, fx: 240, fy: 543 });
        layout = { fx: 240, fy: 543, k: sc0.k, hs: sc0.hs };
      }
    } else {
      inner = art.roomG({ tod: tod, hour: cp.h, minute: cp.m, owned: owned, room: S.room, posterRoom: S.room.posterRoom, weather: wx });
      if (asleep){
        var ks = art.stageScale(stageN).k;
        inner += '<g transform="translate(240 552) scale(' + ks + ') translate(-240 -552)">' +
          art.babySleepG(240, 552, look) + '</g>';
        layout = { fx: 240, fy: 552, k: k0, hs: art.stageScale(stageN).hs };
      } else {
        var p = G.fxPose === 'feed' ? 'feed' : (G.fxPose === 'cheer' ? 'cheer' : (G.fxPose === 'sulk' ? 'sulk' : 'idle'));
        inner += art.rigG({ stage: stageN, look: look, pose: p, fx: 240, fy: 520, mouth: (!G.fxPose && tired) ? 'tired' : undefined });
        layout = { fx: 240, fy: 520, k: k0, hs: art.stageScale(stageN).hs };
      }
    }
    /* visiting friends (Phase 6): guest on the rug or a knock at the door */
    if (G.room === 'home' && G.guest){
      if (G.guest.phase === 'knock') inner += art.guestG({ knock: true });
      else inner += art.guestG({ who: G.guest.who, x: G.guest.x });
    }
    /* the photo frame hangs on the wall of the room it was placed in */
    if (S.room.posterRoom && G.room === S.room.posterRoom && G.room !== 'home' && G.room !== 'shop' && HOUSE[G.room]){
      inner += art.posterG(S.room.poster || 0, G.room);
    }
    /* bedroom lamp: when the light is pulled off, the whole room goes cozy-dark */
    if (G.room === 'bed' && S.room.light === 0){
      inner += '<rect x="0" y="0" width="480" height="600" fill="rgba(66,58,52,.16)" stroke="none"/>';
    }
    var closeCare = !G.walk && (G.room === 'dining' || G.room === 'bath' || (G.room === 'bed' && asleep)) && !P.lessons.sceneActive();
    scene.setAttribute('viewBox', closeCare ? '68 262 344 338' : '0 0 480 600');
    $('#toasts').classList.toggle('care-notices', closeCare);
    if (!G.rig) scene.innerHTML = inner;
    G.homeLayout = layout;
    var homeDock = G.dockBtns && G.dockBtns.home;
    if (homeDock) homeDock.classList.toggle('dim', G.room === 'home');
    if (G.rig){
      G.rig.build(inner);
      var fxp = G.fxPose;
      var lsOn = window.P.lessons && P.lessons.sceneActive() && !G.fxPose;
      if (fxp === 'feed'){ G.rig.setFace('open', 'open'); G.rig.chew(2300); G.rig.sleeping = false; }
      else if (fxp === 'bath'){ G.rig.setFace('closed', 'smile'); G.rig.sleeping = false; }
      else if (fxp === 'cheer'){ G.rig.setFace('closed', 'open'); G.rig.sleeping = false; }
      else if (fxp === 'sulk'){ G.rig.setFace('open', 'sad'); G.rig.sleeping = false; G.rig.wobble(50); }
      else if (lsOn && P.lessons.sadOn()){ G.rig.setFace('open', 'sad'); G.rig.sleeping = false; }
      else if (lsOn && P.lessons.cheerOn()){ G.rig.setFace('closed', 'open'); G.rig.sleeping = false; }
      else if (lsOn && asleep){ G.rig.setFace('closed', 'smile'); G.rig.sleeping = true; }
      else if (lsOn){ G.rig.setFace('open', 'smile'); G.rig.sleeping = false; }
      else if (asleep){ G.rig.setFace('closed', 'smile'); G.rig.sleeping = true; }
      else { G.rig.setFace('open', scene.querySelector('.m-tired:not([style])') ? 'tired' : 'smile'); G.rig.sleeping = false; }
    }
  }

  /* ============ SPLASH ============ */
  function enterSplash(){
    $('#splashArt').innerHTML = art.svg('0 0 340 250', art.storkG());
    var start = function(){
      sfx.unlock(); sfx.coo();
      window.removeEventListener('pointerdown', start);
      if (P.S.flags.adopted) enterHome(); else enterAdoption();
    };
    $('#btnBegin').addEventListener('click', start);
    window.addEventListener('pointerdown', start);
    showScreen('screen-splash');
  }

  function showScreen(id){
    ['screen-splash', 'screen-adoption', 'screen-home'].forEach(function(s){
      $('#' + s).classList.toggle('hidden', s !== id);
    });
  }

  /* ============ ADOPTION ============ */
  var A = { step: 0, look: { skin: 0, onesie: 0, tuft: 0, eyes: 0 } };

  function enterAdoption(){ A.step = 0; renderAdoption(); showScreen('screen-adoption'); }

  function adoptPreview(){
    var scene = $('#adopStage');
    var inner = art.svg('0 0 340 400',
      '<ellipse cx="170" cy="342" rx="110" ry="26" fill="' + C.sand + '" stroke="' + C.ink + '" stroke-width="3"/>' +
      '<ellipse cx="170" cy="342" rx="78" ry="17" fill="none" stroke="' + C.leaf + '" stroke-width="2.4" stroke-dasharray="6 8"/>' +
      art.rigG({ stage: 0, look: A.look, pose: 'idle', fx: 170, fy: 336, k: 0.82, hs: 1.1 }));
    scene.innerHTML = inner;
    if (!G.adoptRig) { G.adoptRig = new P.Rig(scene); P.rigs.push(G.adoptRig); }
    G.adoptRig.svg = scene;
    G.adoptRig.build(scene.innerHTML);
    G.adoptRig.face = 'open';
  }

  function renderAdoption(){
    var scr = $('#screen-adoption');
    if (A.step === 0){
      scr.innerHTML =
        '<div class="adop-head">A Special Delivery</div>' +
        '<div class="adop-sub">Something is flying in just for you\u2026</div>' +
        '<div id="adopStage">' + art.svg('0 0 340 260', art.storkG()) + '</div>' +
        '<div class="tap-hint" id="hintTxt">Tap the bundle</div>';
      var taps = 0;
      $('#adopStage').addEventListener('pointerdown', function(){
        sfx.pop();
        taps++;
        var std = $('#adopStage svg');
        std.style.transition = 'transform .1s';
        std.style.transform = 'rotate(' + (taps % 2 ? 2 : -2) + 'deg) scale(' + (1 + taps * 0.02) + ')';
        if (taps >= 3){ sfx.cheer(); A.step = 1; setTimeout(renderAdoption, 260); }
      });
    } else if (A.step === 1){
      scr.innerHTML =
        '<div class="adop-head">Meet your buddy</div>' +
        '<div class="adop-sub">Style them, then give them a name</div>' +
        '<div id="adopStage"></div>' +
        '<div class="adop-controls">' +
          '<div class="ctrl-row"><span class="ctrl-label">Skin</span><span id="rowSkin" class="ctrl-row"></span></div>' +
          '<div class="ctrl-row"><span class="ctrl-label">Onesie</span><span id="rowOnesie" class="ctrl-row"></span></div>' +
          '<div class="ctrl-row"><span class="ctrl-label">Tuft</span><span id="rowTuft" class="ctrl-row"></span></div>' +
          '<div class="ctrl-row"><span class="ctrl-label">Eyes</span><span id="rowEyes" class="ctrl-row"></span></div>' +
        '</div>' +
        '<div class="adop-nav"><button class="btn" id="adBack">' + art.icon('back', 16) + '</button><button class="btn primary" id="adNext">Next</button></div>';
      var swRow = function(rowId, colors, key){
        var row = $('#' + rowId);
        colors.forEach(function(col, i){
          var b = h('button', 'swatch' + (A.look[key] === i ? ' sel' : ''));
          b.style.background = col;
          b.addEventListener('click', function(){
            sfx.tap(); A.look[key] = i; renderAdoption();
          });
          row.appendChild(b);
        });
      };
      swRow('rowSkin', ['#ffe9d2', '#f4d3a7', '#d9a97b'], 'skin');
      swRow('rowOnesie', [C.rose, C.water, C.leaf, C.amber], 'onesie');
      // tuft previews: tiny svgs
      [0, 1, 2].forEach(function(i){
        var b = h('button', 'swatch tuft' + (A.look.tuft === i ? ' sel' : ''));
        b.innerHTML = '<svg viewBox="76 12 48 42">' + art.tuftPreview(i) + '</svg>';
        b.addEventListener('click', function(){ sfx.tap(); A.look.tuft = i; renderAdoption(); });
        $('#rowTuft').appendChild(b);
      });
      // eyes: text chips
      ['Big', 'Dot'].forEach(function(lbl, i){
        var b = h('button', 'btn' + (A.look.eyes === i ? ' primary' : ''), lbl);
        b.style.padding = '6px 12px';
        b.addEventListener('click', function(){ sfx.tap(); A.look.eyes = i; renderAdoption(); });
        $('#rowEyes').appendChild(b);
      });
      adoptPreview();
      $('#adBack').addEventListener('click', function(){ sfx.tap(); A.step = 0; renderAdoption(); });
      $('#adNext').addEventListener('click', function(){ sfx.tap(); A.step = 2; renderAdoption(); });
    } else if (A.step === 2){
      scr.innerHTML =
        '<div class="adop-head">Name your buddy</div>' +
        '<div class="adop-sub">A name makes it officially yours</div>' +
        '<div id="adopStage"></div>' +
        '<div class="adop-controls">' +
          '<div class="name-row"><input id="nameInput" maxlength="12" placeholder="Type a name" value=""></div>' +
          '<div class="ctrl-row" id="nameSug"></div>' +
        '</div>' +
        '<div class="adop-nav"><button class="btn" id="adBack">' + art.icon('back', 16) + '</button><button class="btn primary" id="adNext">Next</button></div>';
      adoptPreview();
      var input = $('#nameInput');
      input.value = A.name || '';
      data.NAMES.forEach(function(n){
        var b = h('button', 'btn', n); b.style.padding = '5px 10px'; b.style.fontSize = '13px';
        b.addEventListener('click', function(){ sfx.tap(); input.value = n; });
        $('#nameSug').appendChild(b);
      });
      $('#adBack').addEventListener('click', function(){ sfx.tap(); A.step = 1; renderAdoption(); });
      $('#adNext').addEventListener('click', function(){
        var v = input.value.trim();
        if (!v){ toast('Give them a name first'); input.focus(); return; }
        sfx.coo(); A.name = v; A.step = 3; renderAdoption();
      });
    } else {
      scr.innerHTML =
        '<div class="adop-head">All set?</div>' +
        '<div id="adopStage"></div>' +
        '<div class="adop-controls"><div class="mtext" style="text-align:center">' +
          '<b>' + esc(A.name) + '</b> will live in your cozy room, and grow up right beside you.<br>' +
          '<span class="mtext soft">Care for them well \u2014 they mirror the life you live.</span>' +
        '</div></div>' +
        '<div class="adop-nav"><button class="btn" id="adBack">' + art.icon('back', 16) + '</button><button class="btn primary big" id="adDone">Adopt!</button></div>';
      adoptPreview();
      $('#adBack').addEventListener('click', function(){ sfx.tap(); A.step = 2; renderAdoption(); });
      $('#adDone').addEventListener('click', finishAdoption);
    }
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]; }); }

  function finishAdoption(){
    var S = P.S;
    S.flags.adopted = true;
    S.buddy.name = A.name || 'Pippo';
    S.buddy.look = A.look;
    S.buddy.bornAt = Date.now();
    S.flags.tut = 0;
    S.settings.sound = sfx.isOn();
    if (window.P.memory) P.memory.journalAdd('heart', 'You adopted ' + S.buddy.name + ' \u2014 the story begins!');
    st.save();
    sfx.cheer();
    closeModalIf();
    enterHome();
    openModal({
      title: 'Welcome home!',
      body: '<div class="mtext">' + esc(S.buddy.name) + ' is finally here. Modules for a good start:' +
        '<div style="margin-top:10px"><b>\u2022 Feed</b> from the food you buy with coins.<br><b>\u2022 Bath</b> \u2014 solve a tiny puzzle, then splash!<br><b>\u2022 Play</b> games together.<br><b>\u2022 Nap</b> keeps energy healthy.<br><b>\u2022 Shop</b> earns and spends.<br><b>\u2022 Care</b> \u2014 always.</div>' +
        '<div class="mtext soft" style="margin-top:10px">Grow together. One day, real life syncs in \u2014 STAY TUNED.</div></div>',
      onClose: function(){ speech('Hi hi! I am ' + S.buddy.name + '!', 3200); }
    });
    setTimeout(function(){ startTutorial(); }, 300);
  }
  function closeModalIf(){ closeModal(); closeShopSession(); }

  /* ============ TUTORIAL (Day 0) ============ */
  var TUT_STEPS = [
    { id:'feed', text:'A brand new tummy! Tap FEED and pick Milk Bottle or Fruit Mash.' },
    { id:'bath', text:'Splash time! Tap BATH and solve the bath puzzle.' },
    { id:'play', text:'Now the fun part \u2014 tap PLAY for peekaboo!' },
    { id:'nap',  text:'All that playing is tiring\u2026 Tap NAP to tuck them in.' }
  ];
  function tutStep(){ return P.S.flags.tut; }
  function startTutorial(){
    if (A.step < 3) return;
    var first = TUT_STEPS[0];
    speech(first.text, 4200);
    refreshDock();
  }
  function tutorialAdvance(id){
    var s = tutStep();
    if (s < 0 || s >= TUT_STEPS.length) return;
    if (TUT_STEPS[s].id !== id) return;
    P.S.flags.tut = s + 1;
    if (P.S.flags.tut >= TUT_STEPS.length){
      P.S.flags.tut = -1;
      P.S.coins += 15;
      sfx.cheer(); fx.burst('spark', 240, 160, 8, 60);
      toast('Day 0 complete! +15c');
      setTimeout(function(){
        openModal({
          title: 'Day 0 complete',
          body: '<div class="mtext">Beautiful work! Now time flows with <b>your real world</b> \u2014 days pass day by day.<br><br>' +
            '<span class="mtext soft">' + esc(P.S.buddy.name) + ' grows: baby \u2192 toddler \u2192 kid \u2192 grown-up (about a week). Keep meters happy every day, and zoom ahead soon to something special\u2026 \u26a1</span></div>'
        });
      }, 900);
    } else {
      speech(TUT_STEPS[P.S.flags.tut].text, 3600);
    }
    refreshDock(); st.save();
  }
  function curTutStep(){ var s = tutStep(); return (s >= 0 && s < TUT_STEPS.length) ? TUT_STEPS[s] : null; }

  /* ============ HOME ============ */
  function enterHome(){
    showScreen('screen-home');
    if (G.adoptRig){
      var ai = P.rigs.indexOf(G.adoptRig);
      if (ai >= 0) P.rigs.splice(ai, 1);
      G.adoptRig = null;
    }
    buildHomeChrome();
    G.rig = new P.Rig($('#scene'));
    if (P.rigs.indexOf(G.rig) < 0) P.rigs.push(G.rig);
    G.room = 'home'; G.walk = null; G.fxPose = null;
    compose();
    refreshHUD();
  }

  function buildLifeDrawer(){
    var drawer = $('#lifeDrawer');
    if (!drawer || drawer.dataset.wired) return;
    drawer.dataset.wired = '1';
    var icos = drawer.querySelectorAll('[data-ico]');
    for (var i = 0; i < icos.length; i++) icos[i].innerHTML = art.icon(icos[i].dataset.ico, 22);
    $('#lifeClose').innerHTML = art.icon('close', 15);
    var close = function(){ drawer.classList.remove('open'); };
    $('#lifeTab').addEventListener('click', function(){ sfx.tap(); drawer.classList.add('open'); });
    $('#lifeScrim').addEventListener('click', close);
    $('#lifeClose').addEventListener('click', function(){ sfx.tap(); close(); });
    var routes = [
      ['ltNotes', function(){ P.notes.album(); }],
      ['ltSkills', function(){ P.livelihood.openSkills(); }],
      ['ltStory',  function(){ P.memory.openJournal(); }],
      ['ltBadges', function(){ P.memory.openBadges(); }],
      ['ltProf',   function(){ P.livelihood.openCeremony(); }]
    ];
    routes.forEach(function(r){
      var b = document.getElementById(r[0]);
      if (b) b.addEventListener('click', function(){ sfx.tap(); close(); r[1](); });
    });
  }

  function buildHomeChrome(){
    var dock = $('#dock');
    dock.innerHTML = '';
    G.dockBtns = {
      feed: mkDock('feed', 'bottle', 'Feed', true, preFeed),
      bath: mkDock('bath', 'bath', 'Bath', false, preBath),
      play: mkDock('play', 'play', 'Play', false, prePlay),
      nap:  mkDock('nap', 'moon', 'Nap', false, doNap),
      focus: mkDock('focus', 'timer', 'Focus', false, openFocus),
      shop: mkDock('shop', 'cart', 'Shop', false, preShop),
      home: mkDock('home', 'house', 'Home', false, function(){
        sfx.tap();
        if (G.room === 'home'){ speech(pick(['We are already home!', 'Home sweet home~']), 2000); return; }
        goRoom('home', null);
      })
    };
    $('#btnSettings').innerHTML = art.icon('gear', 20);
    $('#btnSound').innerHTML = art.icon(P.S.settings.sound ? 'soundon' : 'soundoff', 20);
    $('#btnSettings').onclick = function(){ sfx.tap(); openSettings(); };
    $('#btnSound').onclick = toggleSound;
    var brainBtn = $('#btnBrain');
    if (brainBtn){
      brainBtn.innerHTML = art.icon('brain', 20);
      brainBtn.onclick = function(){ sfx.tap(); openBrainPanel(); };
    }
    var questBtn = $('#btnQuests');
    if (questBtn){
      questBtn.innerHTML = art.icon('quest', 20);
      questBtn.onclick = function(){ sfx.tap(); openQuests(); };
    }
    buildLifeDrawer();
    $('#dailyNote').onclick = function(){ P.notes.open(); };
    var stage = $('#stage');
    stage.addEventListener('pointerdown', onStagePointer);
    stage.addEventListener('pointermove', onStageMove);
    window.addEventListener('pointerup', onStageUp);
  }
  function mkDock(id, icon, label, primary, fn){
    var b = h('button', 'dockbtn' + (primary ? ' primary' : ''), art.icon(icon) + '<span>' + label + '</span>');
    b.addEventListener('click', function(ev){ fn(ev); });
    $('#dock').appendChild(b);
    return b;
  }

  function toggleSound(){
    var v = !P.S.settings.sound;
    P.S.settings.sound = v;
    sfx.setEnabled(v);
    $('#btnSound').innerHTML = art.icon(v ? 'soundon' : 'soundoff', 20);
    if (v) sfx.tap();
    st.save();
  }

  /* Phase 2 hooks into the livelihood module (professions / brain / focus) */
  function openFocus(){
    goRoom('study', function(){
      if (window.P.livelihood) P.livelihood.openFocusPlan();
    });
  }
  function openBrainPanel(){
    if (window.P.livelihood) P.livelihood.openBrain();
    else toast('Brain panel arrives with professions!');
  }
  function openQuests(){
    if (window.P.quests) P.quests.openPanel();
  }

  /* ---------------- HUD ---------------- */
  var M_KEYS = [['hunger', 'bottle', 'Hunger'], ['sleep', 'moon', 'Sleep'], ['hygiene', 'drop', 'Bath'], ['mood', 'heart', 'Mood']];
  function buildMeters(){
    var box = $('#meters');
    box.innerHTML = '';
    M_KEYS.forEach(function(mk){
      var m = h('div', 'meter');
      m.title = mk[2];
      m.innerHTML = '<span class="m-ico">' + art.icon(mk[1], 18) + '</span><div class="m-bar"><div class="m-fill"></div></div><span class="m-name">' + mk[2] + '</span>';
      m.dataset.key = mk[0];
      box.appendChild(m);
    });
  }
  function refreshHUD(){
    P.notes.refresh();
    buildMetersIfNeeded();
    var S = P.S;
    document.querySelectorAll('#meters .meter').forEach(function(m){
      var v = S.buddy.meters[m.dataset.key] || 0;
      m.querySelector('.m-fill').style.width = Math.round(v) + '%';
      m.classList.toggle('low', v < 28);
      // red = genuinely bad condition (skipped bedtime / extreme tiredness)
      if (m.dataset.key === 'sleep') m.classList.toggle('crit', !!S.buddy.shortNight || v < 20);
    });
    $('#chipCoins').innerHTML = art.icon('coin', 15) + ' ' + S.coins;
    var cp = st.clockParts();
    var wx = st.weather();
    var wIcon = st.isNight() ? 'moon' : (wx === 'cloudy' ? 'cloud' : wx === 'rain' ? 'rain' : wx === 'snow' ? 'snow' : 'sun');
    var chipDay = $('#chipDay');
    chipDay.innerHTML = '<span class="day-ico">' + art.icon(wIcon, 18) + '</span>' +
      '<span class="day-txt"><b>Day ' + st.dayNum() + '</b><i>' + pad(cp.h) + ':' + pad(cp.m) + '</i></span>';
    chipDay.classList.toggle('night', st.isNight());
    refreshDock();
  }
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function buildMetersIfNeeded(){
    var box = $('#meters');
    if (!box.childElementCount) buildMeters();
  }
  function refreshDock(){
    if (!G.dockBtns) return;
    var S = P.S, asleep = S.buddy.asleep;
    var nap = G.dockBtns.nap;
    nap.innerHTML = art.icon(asleep ? 'sun' : 'moon') + '<span>' + (asleep ? 'Wake' : 'Nap') + '</span>';
    document.querySelectorAll('.dockbtn').forEach(function(b){ b.classList.remove('pulse'); });
    var tut = curTutStep();
    if (tut){ G.dockBtns[tut.id] && G.dockBtns[tut.id].classList.add('pulse'); return; }
    if ((S.buddy.shortNight || S.buddy.meters.sleep < 30) && !asleep) nap.classList.add('pulse');
    else if (S.buddy.meters.hunger < 28) G.dockBtns.feed.classList.add('pulse');
    else if (S.buddy.meters.hygiene < 28) G.dockBtns.bath.classList.add('pulse');
    else if (S.buddy.meters.mood < 28) G.dockBtns.play.classList.add('pulse');
  }

  /* ---------------- care actions ---------------- */
  function guarded(){
    if (G.busy){ toast('One moment\u2026'); return true; }
    if (!P.S.flags.adopted) return true;
    return false;
  }
  function needAwake(msg){
    if (P.S.buddy.asleep){ speech(pick(['Shh\u2026 sweet dreams\u2026', 'Zzz\u2026']), 1800); return false; }
    return true;
  }

  /* dock pre-checks: decide BEFORE walking so Pippo never walks for nothing */
  function preFeed(){
    if (guarded() || !needAwake()) return;
    if (P.S.buddy.meters.hunger > 92){ speech(pick(['Not hungry right now!', 'Tummy is full~']), 2000); return; }
    goRoom('dining', feedModal);
  }
  function preBath(){
    if (guarded() || !needAwake()) return;
    if (P.S.buddy.meters.hygiene > 96){ speech(pick(['Already squeaky clean!', 'So fresh~']), 2000); return; }
    goRoom('bath', doBathCore);
  }
  function prePlay(){
    if (guarded() || !needAwake()) return;
    goRoom('play', openGamePicker);
  }
  function openGamePicker(){
    var games = [
      ['peek', 'play', 'Peek-a-Boo', 'The classic \u2014 tap ' + esc(P.S.buddy.name || 'Pippo') + ' when he peeks!'],
      ['pairs', 'brain', 'Pippo Pairs', 'Brain game \u2014 flip cards and find the matching pairs!'],
      ['bubbles', 'drop', 'Bubble Pop', 'Pop floating bubbles before they drift away!']
    ];
    var cards = games.map(function(g){
      return '<button class="game-card" data-game="' + g[0] + '">' +
        '<span class="gc-ico">' + art.icon(g[1], 28) + '</span>' +
        '<span class="gc-info"><span class="gc-name">' + g[2] + '</span>' +
        '<span class="gc-desc">' + g[3] + '</span></span>' +
        '<span class="gc-go">' + art.icon('play', 16) + '</span></button>';
    }).join('');
    openModal({ title: 'Playtime!', body: '<div class="game-shelf">' + cards + '</div>' });
    modalEl.querySelectorAll('[data-game]').forEach(function(b){
      b.addEventListener('click', function(){
        sfx.tap();
        closeModal();
        var id = b.getAttribute('data-game');
        if (id === 'peek') doPlayCore();
        else P.games.start(id);
      });
    });
  }
  function preShop(){
    if (guarded()) return;
    goRoom('shop', function(){
      setTimeout(function(){ if (G.room === 'shop') openShop(); }, 650);
    });
  }

  var FOOD_ICON = { bottle:'bottle', mash:'apple', toast:'toast', soup:'pot' };
  var COOK_COST = 8;
  function feedModal(){
    var S = P.S;
    var cookRow = '<div class="shop-item">' +
      '<div class="it-ico">' + art.icon('pot', 28) + '</div>' +
      '<div class="it-info"><div class="it-name">Cook something fresh</div>' +
      '<div class="it-desc">Stir the little pot with ' + esc(S.buddy.name || 'Pippo') + ' \u2014 Home Soup keeps the tummy warm for hours!</div></div>' +
      '<button class="it-buy' + (st.canBuy(COOK_COST) ? '' : ' no') + '" id="btnCook">' + art.icon('coin', 14) + COOK_COST + '</button>' +
    '</div>';
    var rows = data.FOODS.map(function(f){
      var own = (S.inv[f.id] || 0) > 0;
      return '<div class="shop-item">' +
        '<div class="it-ico">' + art.icon(FOOD_ICON[f.id] || 'apple', 28) + '</div>' +
        '<div class="it-info"><div class="it-name">' + f.name + (own ? '<span class="it-own"> \u00d7' + S.inv[f.id] + '</span>' : '') + '</div>' +
        '<div class="it-desc">' + f.desc + '</div></div>' +
        (own ? '<button class="btn primary" data-feed="' + f.id + '">Feed</button>' : '') +
        (f.cost ? '<button class="it-buy' + (st.canBuy(f.cost) ? '' : ' no') + '" data-buyfood="' + f.id + '">' + art.icon('coin', 14) + f.cost + '</button>' : '') +
      '</div>';
    }).join('');
    openModal({ title: 'Feeding time', body: cookRow + rows, onClose: null });
    var modal = modalEl;
    var cookBtn = document.getElementById('btnCook');
    if (cookBtn) cookBtn.addEventListener('click', cookStart);
    modal.querySelectorAll('[data-buyfood]').forEach(function(b){
      b.addEventListener('click', function(){
        var food = data.foodOf(b.getAttribute('data-buyfood'));
        if (st.buy(food.cost)){ st.addItem(food.id, 1); sfx.buy(); toast('Bought ' + food.name); compose(); closeModal(); setTimeout(feedModal, 60); }
        else { toast('Not enough coins'); }
      });
    });
    modal.querySelectorAll('[data-feed]').forEach(function(b){
      b.addEventListener('click', function(){ closeModal(); feedWith(b.getAttribute('data-feed')); });
    });
  }

  function feedWith(id){
    var food = data.foodOf(id);
    var S = P.S;
    if (!food || !(S.inv[id] > 0)) return;
    G.busy = true;
    st.useItem(id);
    G.food = id; G.fxPose = 'feed'; compose(true);
    var sound = id === 'bottle' ? sfx.sip : sfx.munch;
    setTimeout(sound, 380); setTimeout(sound, 920); setTimeout(sound, 1480);
    if (G.rig) G.rig.chew(2300);
    var headTop = r2s(G.homeLayout.fx + 30 * G.homeLayout.k, G.homeLayout.fy - 155 * G.homeLayout.k);
    heartBurstAt(headTop.x, headTop.y, 4);
    setTimeout(function(){
      st.addMeter('hunger', food.hunger);
      st.addMeter('mood', food.mood);
      if (food.buff){
        var B = S.buffs || (S.buffs = {});
        B[food.buff] = { until: Date.now() + (food.buffH || 5) * 3600000 };
        toast('Warm belly! Tummy drains slower for ' + (food.buffH || 5) + 'h');
        if (!S.flags.firstWarm){
          S.flags.firstWarm = true;
          if (window.P.memory){ P.memory.journalAdd('pot', 'A warm-belly soup day'); P.memory.check(); }
        }
      }
      st.addBond(4);
      S.stats.feeds++; S.stats.care++;
      if (P.quests) P.quests.bump('feedCount');
      G.fxPose = null; G.busy = false;
      G.rig.react('cuddle', 1100);
      speech(id === 'bottle' ? 'Mmm. Warm tummy.' : pick(['Yummy!', 'Nom nom nom\u2026', 'So tasty!']), 2200);
      sfx.giggle();
      tutorialAdvance('feed');
      refreshHUD(); compose(true); st.save();
    }, 2400);
  }

  function doBathCore(){
    G.busy = true;
    G.fxPose = 'bath'; compose(true);
    sfx.swim();
    startBath(function(solved){
      if (!solved){
        // closed the puzzle without solving — the bath waits for next time
        G.fxPose = null; G.busy = false;
        speech(pick(['The bubbles will wait for us~', 'Puzzle later? Okay!']), 2200);
        refreshHUD(); compose(true); st.save();
        return;
      }
      st.addMeter('hygiene', 100);
      st.addMeter('mood', 22 + (P.S.inv.plush ? 2 : 0));
      var coins = 10;
      st.addCoins(coins);
      P.S.stats.baths++; P.S.stats.care++;
      if (P.quests) P.quests.bump('bathCount');
      st.addBond(6);
      toast('+' + coins + 'c');
      G.fxPose = null; G.busy = false;
      speech(pick(['Squeaky clean!', 'Bath is so fun!', 'Puzzle solved, splash time!']), 2400);
      G.rig.react('splash', 1800);
      sfx.swim();
      tutorialAdvance('bath');
      refreshHUD(); compose(true); st.save();
    });
  }

  function doPlayCore(){
    G.busy = true;
    sfx.peek();
    startPeek(function(hits){
      boost = 8 * hits + data.playBoost({ rattle: P.S.inv.rattle, ball: P.S.inv.ball });
      st.addMeter('mood', boost);
      var earn = Math.min(hits * 5, Math.max(0, 20 - P.S.daily.playCoins));
      P.S.daily.playCoins += earn;
      if (earn) st.addCoins(earn);
      P.S.stats.plays++; P.S.stats.care++;
      if (P.quests) P.quests.bump('playCount');
      st.addBond(8);
      if (earn) toast('+' + earn + 'c');
      speech(hits >= 2 ? pick(['Best game ever!', 'Hehe, found me!']) : 'So fun!');
      tutorialAdvance('play');
      G.rig.react('play', 1350);
      refreshHUD(); st.save();
      G.busy = false;
    });
  }
  var boost = 0; // assigned inside doPlay callback (hoisted for older engines)

  function doNap(){
    if (guarded()) return;
    var S = P.S;
    if (S.buddy.asleep){ wake(false); return; }
    if (S.buddy.meters.sleep > 92){ speech(pick(['Wide awake right now!', 'Too excited to sleep~']), 2200); return; }
    goRoom('bed', function(){
      S.buddy.asleep = true;
      S.buddy.sleepStart = Date.now();
      S.buddy.shortNight = false;   // a real tuck-in restores proper rest
      if (P.quests) P.quests.bedTuck();
      sfx.night();
      if (st.isNight()) sfx.startLullaby();
      compose();
      speech(st.isNight() ? 'Good night, world\u2026' : 'Nap time, hee hee~', 2600);
      setSleepingFx(true);
      tutorialAdvance('nap');
      refreshHUD(); st.save();
    });
  }

  /* bedtime modal: game ASKS the player to tuck the buddy in once per night */
  var STORIES = [
    'The moon tucked the hills into ribbons of night, and blew out the stars like candles of light.',
    'A drowsy old cloud cuddled up with the sun, whispering \u201cdream of the morning to come.\u201d',
    'The garden grew quiet, the flowers nodded low, and the wind hummed a song only sleepy things know.',
    'Pippo counted fireflies blinking at play \u2014 one for tomorrow, and two for today.',
    'A snail dreamed of racing the dusk down the lane, and winning a ribbon of silvery rain.',
    'The little star yawned, slid down from the sky, to warm up the dreaming glow-worms nearby.'
  ];
  function storyIndex(){
    var k = st.dayKey(), h = 0;
    for (var i = 0; i < k.length; i++) h = (h + k.charCodeAt(i) * (i + 3)) % 100000;
    return h % STORIES.length;
  }
  function bedPrompt(){
    var S = P.S;
    if (!P.S || !P.S.flags.adopted || S.buddy.asleep) return;
    if (S.flags.tut >= 0 && S.flags.tut < 99) { /* tutorial still running */ }
    var story = STORIES[storyIndex()];
    openModal({
      title: 'Bedtime~',
      body: '<div class="bed-ask">' +
        '<div class="bed-moon">' + art.icon('moon', 44) + '</div>' +
        '<p class="bed-text">' + S.buddy.name + ' is getting sleepy&hellip;<br><span class="bed-sub">A good bedtime tonight means a happy tomorrow.</span></p>' +
        '<div class="bed-story"><span class="bed-story-tag">' + art.icon('book', 14) + ' Tonight\u2019s story</span>' + esc(story) + '</div>' +
        '<div class="mrow">' +
        '<button class="btn primary" id="btnTuckIn">Tuck in</button>' +
        '<button class="btn" id="btnNotYet">Not yet</button>' +
        '</div></div>'
    });
    $('#btnTuckIn').addEventListener('click', function(){
      sfx.tap(); closeModal();
      if (P.S.buddy.asleep) return;
      P.S.buddy.asleep = true;
      P.S.buddy.sleepStart = Date.now();
      P.S.buddy.shortNight = false;
      if (P.quests) P.quests.bedTuck();
      sfx.night();
      if (st.isNight()) sfx.startLullaby();
      compose();
      setSleepingFx(true);
      speech('Night night\u2026 zzz\u2026', 2600);
      if (window.P.memory) P.memory.journalAdd('book', 'Read a bedtime story together');
      refreshHUD(); st.save();
    });
    $('#btnNotYet').addEventListener('click', function(){
      sfx.tap(); closeModal();
      speech(pick(['Okay\u2026 five more minutes\u2026', 'Just a bit longer\u2026 *yawn*']), 2600);
    });
  }

  function wake(natural){
    var S = P.S;
    S.buddy.asleep = false;
    S.buddy.sleepStart = 0;
    sfx.stopLullaby();
    setSleepingFx(false);
    var morning = false;
    var morningLines = null;
    if (natural && !st.isNight()){
      morning = true;
      sfx.chimeMorning();
      var today = st.dayKey();
      if (S.flags.lastSleepGift !== today){
        S.flags.lastSleepGift = today;
        st.addCoins(22);
        setTimeout(function(){ toast('Slept so well! +22c'); }, 700);
      }
      var WX_LINES = {
        sunny: ['Good morning! The sun is up \u2014 yay!', 'Hello sunshine! What a bright day~'],
        cloudy: ['Good morning! Soft fluffy clouds today~', 'Yaaawn\u2026 a cozy gray morning.'],
        rain: ['Good morning! Listen \u2014 rain on the window~', 'A rainy day! Perfect for stories inside.'],
        snow: ['Brrr \u2014 good morning! Snow outside!', 'Snowflakes! Can we look at them?']
      };
      morningLines = WX_LINES[st.weather()] || ['Good morning!'];
    }
    speech(morning ?
      (S.buddy.shortNight ?
        pick(['Yaaawn\u2026 my eyes are heavy\u2026', 'I could not sleep well last night\u2026', 'So sleepy\u2026 let me nap okay\u2026']) :
        pick(morningLines || ['Good morning!', 'Yaaawn\u2026 hello sun!'])) :
      pick(['I\u2019m up! What next?', 'Hiii again~']), 3000);
    heartBurstAt(240, 300, 4);
    refreshHUD(); compose(); st.save();
  }

  /* ---------------- stage interactions (tap / pet) ---------------- */
  var petAcc = 0, petDown = false, lastPt = null;
  function stageRoomPt(e){
    var scene = $('#scene');
    var pt = scene.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var m = scene.getScreenCTM(); if (!m) return null;
    var p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }
  function toggleBedLight(){
    var asleep = P.S.buddy.asleep;
    var on = P.S.room.light !== 0;
    P.S.room.light = on ? 0 : 1;
    st.save();
    sfx.tap();
    var say = asleep
      ? (on ? ['Lights down low\u2026 zzz\u2026', 'Cozy dark for sleepy dreams\u2026']
            : ['Mmm\u2026 a soft glow\u2026', 'Little light for brave dreams~'])
      : (on ? ['Cozy dark~ night-night lamp\u2026', 'Ooh, soft and dark!']
            : ['Light on! Bright and cozy!', 'Hello sunshine lamp!']);
    speech(pick(say), 1800);
    compose(true);
    refreshHUD();
  }
  function onStagePointer(e){
    if (G.busy) return;
    var pt = stageRoomPt(e); if (!pt) return;
    lastPt = pt; petDown = (e.button === undefined || e.button === 0); petAcc = 0;
    var L = G.homeLayout; if (!L) return;
    // bedroom ceiling light: pull the little cord (works even while asleep)
    if (G.room === 'bed' && pt.x > 356 && pt.x < 428 && pt.y > 0 && pt.y < 140){
      toggleBedLight();
      return;
    }
    var headY = L.fy - 126 * L.k;
    var headR = 44 * L.k * L.hs;
    if (P.S.buddy.asleep){
      sfx.tap();
      speech(pick(['Shh\u2026 sweet dreams\u2026', 'Zzz\u2026', 'Dreaming of you\u2026']), 1800);
      return;
    }
    var hp = r2s(pt.x, pt.y);
    // front door: welcome a waiting guest (or a cozy flavor line)
    if (G.room === 'home' && Math.abs(pt.x - DOOR_X) < 44 && pt.y > 280 && pt.y < 545){
      if (G.guest && G.guest.phase === 'knock'){ welcomeGuest(); return; }
      sfx.tap();
      speech(pick(['Our cozy front door~', 'Who could it be, I wonder?']), 1700);
      return;
    }
    var dx = pt.x - L.fx, dy = pt.y - headY;
    if (Math.sqrt(dx * dx + dy * dy) < headR){
      G.rig.react('play', 690); sfx.boop();
      st.addMeter('mood', 1);
      fx.burst('spark', hp.x, hp.y, 2, 10);
      speech(pick(['Boop!', 'Hehe!', 'Peek-a-whoo?']), 1500);
    } else if (Math.abs(dx) < 44 * L.k && pt.y > headY + headR * 0.5 && pt.y < L.fy - 8){
      sfx.giggle();
      heartBurstAt(hp.x, hp.y, 4);
      st.addMeter('mood', 2);
      G.rig.react('cuddle', 950);
      // 30% of the time Pippo answers a cuddle with a word he has learned
      var wPat = (window.P.lessons && Math.random() < 0.3) ? P.lessons.maybeWordTalk(60000) : null;
      if (wPat) P.lessons.sayWord(wPat);
      else speech(pick(['Tickles!', 'Hihihi!', 'Hug!']), 1600);
    }
    refreshHUD();
  }
  function onStageMove(e){
    if (!petDown || G.busy) return;
    var pt = stageRoomPt(e); if (!pt) return;
    var L = G.homeLayout; if (!L) return;
    if (lastPt){
      petAcc += Math.abs(pt.x - lastPt.x) + Math.abs(pt.y - lastPt.y);
      if (petAcc > 50){
        petAcc = 0;
        var hp = r2s(pt.x, pt.y);
        fx.burst('heart', hp.x, hp.y, 1, 6);
        if (Math.random() < 0.3) sfx.coo();
        if (P.S.daily.petMood < 30 && !P.S.buddy.asleep){
          st.addMeter('mood', 1); P.S.daily.petMood++;
          if (P.quests) P.quests.bump('petCount');
        }
      }
    }
    lastPt = pt;
  }
  function onStageUp(){ petDown = false; lastPt = null; }

  /* ---------------- shop ---------------- */
  function itemIcon(id){
    if (id === 'bottle') return art.icon('bottle', 28);
    if (id === 'mash') return art.icon('apple', 28);
    if (id === 'toast') return art.icon('toast', 28);
    if (id === 'rattle') return art.icon('rattle', 28);
    if (id === 'ball') return art.icon('ball', 28);
    if (id === 'plush') return art.icon('plush', 28);
    return art.icon('heart', 28);
  }
  /* ---- shop try-on: tap an item, see it live, then decide (GTA-wardrobe style) ---- */
  var shopPrev = null;    // committed baseline (look + room) to revert to
  var shopTrying = null;  // item currently previewed
  var shopTab = 'Food';
  var MOCK_ROOMS = ['home', 'dining', 'bath', 'play', 'bed', 'study'];
  var ROOM_LABELS = { home: 'Living room', dining: 'Dining', bath: 'Bathroom', play: 'Play room', bed: 'Bedroom', study: 'Study' };

  function snapshotShop(){
    var S = P.S;
    shopPrev = {
      look: JSON.parse(JSON.stringify(S.buddy.look)),
      room: { rug: S.room.rug, wall: S.room.wall, poster: S.room.poster, posterRoom: S.room.posterRoom }
    };
  }
  function commitShop(){ snapshotShop(); shopTrying = null; }
  function restoreShopState(){
    var S = P.S;
    if (shopPrev){
      S.buddy.look = JSON.parse(JSON.stringify(shopPrev.look));
      S.room.rug = shopPrev.room.rug; S.room.wall = shopPrev.room.wall;
      S.room.poster = shopPrev.room.poster; S.room.posterRoom = shopPrev.room.posterRoom;
    }
    shopTrying = null;
  }
  function revertTrying(){ restoreShopState(); compose(true); }
  function closeShopSession(){
    if (!shopPrev) return;
    restoreShopState();
    compose(true);
    shopPrev = null;
  }
  function fitRoomSvg(){
    var S = P.S;
    var k = Math.min(0.62, art.stageScale(S.buddy.stage).k * 0.9);
    var inner = '<ellipse cx="150" cy="312" rx="96" ry="22" fill="' + C.sand + '" stroke="' + C.ink + '" stroke-width="3"/>' +
      '<ellipse cx="150" cy="312" rx="66" ry="14" fill="none" stroke="' + C.leaf + '" stroke-width="2.4" stroke-dasharray="6 8"/>' +
      art.rigG({ stage: S.buddy.stage, look: S.buddy.look, pose: 'idle', fx: 150, fy: 306, k: k, hs: 1 });
    return art.svg('30 140 240 200', inner);
  }
  function roomMockSvg(roomState, roomId){
    var g = { home: art.roomG, dining: art.diningG, bath: art.bathroomG, play: art.playroomG, bed: art.bedroomG, study: art.studyRoomG }[roomId] || art.roomG;
    var o = { tod: 'day', hour: 10, minute: 0, weather: 'sunny', owned: { plush: false, rattle: false } };
    if (roomId === 'home'){ o.room = roomState; o.posterRoom = roomState.posterRoom; }
    var inner = g(o);
    if (roomId !== 'home' && roomState.posterRoom === roomId) inner += art.posterG(roomState.poster, roomId);
    return art.svg('0 0 480 600', inner);
  }
  function placeButtonsHtml(){
    var cur = P.S.room.posterRoom || 'home';
    return '<div class="place-row">' + MOCK_ROOMS.map(function(r){
      return '<button class="place-btn' + (r === cur ? ' sel' : '') + '" data-room="' + r + '">' + ROOM_LABELS[r] + '</button>';
    }).join('') + '</div>';
  }
  function bindPlacement(root, onChange){
    root.querySelectorAll('.place-btn').forEach(function(b){
      b.addEventListener('click', function(ev){
        ev.stopPropagation();
        P.S.room.posterRoom = b.getAttribute('data-room');
        sfx.tap();
        if (onChange) onChange();
      });
    });
  }
  function previewItem(it){
    var S = P.S;
    restoreShopState();
    shopTrying = it;
    if (it.kind === 'onesie'){ S.buddy.look.onesie = it.idx; }
    else if (it.kind === 'acc'){ S.buddy.look.acc = it.idx; }
    else if (it.kind === 'rug'){ S.room.rug = it.idx; }
    else if (it.kind === 'wall'){ S.room.wall = it.idx; }
    else if (it.kind === 'poster'){ S.room.poster = it.idx; }
    compose(true);   // the scene behind the shop shows it live
  }
  /* slide through the tab's items like a wardrobe carousel — no scrolling needed */
  function bindStripNav(){
    var grid = document.getElementById('shopGrid');
    if (!grid) return;
    var step = 158;   // card width + gap
    var pv = document.getElementById('stripPrev');
    var nx = document.getElementById('stripNext');
    if (pv) pv.addEventListener('click', function(){ sfx.tap(); grid.scrollBy({ left: -step, behavior: 'smooth' }); });
    if (nx) nx.addEventListener('click', function(){ sfx.tap(); grid.scrollBy({ left: step, behavior: 'smooth' }); });
  }
  function markTrying(){
    if (!modalEl) return;
    modalEl.querySelectorAll('.shop-item[data-id]').forEach(function(r){
      r.classList.toggle('trying', !!(shopTrying && r.getAttribute('data-id') === shopTrying.id));
    });
  }
  function buyTrying(it){
    if (st.buy(it.cost)){
      P.S.closet[it.id] = true;
      sfx.buy();
      commitShop();
      compose(true); refreshHUD(); st.save();
      boughtShowcase(it);
    } else { toast('Not enough coins'); sfx.wrong(); }
  }
  function useTrying(it){
    sfx.tap();
    commitShop();
    compose(true); st.save();
    toast((it.kind === 'onesie' || it.kind === 'acc') ? 'Looking cute!' : 'Placed!');
    openShop(shopTab);
  }
  function renderPreviewBand(){
    var band = document.getElementById('fitBand');
    if (!band) return;
    var S = P.S;
    if (!shopTrying){
      band.innerHTML =
        '<div class="fit-box"><span class="fit-empty">Tap an item<br>to try it!</span></div>' +
        '<div class="fit-info"><div class="fit-name">Fitting room</div>' +
        '<div class="fit-note">Slide the products right \u2014 tap one to try it, buy only if you love it!</div></div>';
      return;
    }
    var it = shopTrying;
    var owned = it.cost === 0 || S.closet[it.id];
    var previewHtml, note, btns;
    if (it.kind === 'onesie' || it.kind === 'acc'){
      previewHtml = '<div class="fit-box">' + fitRoomSvg() + '</div>';
      note = it.kind === 'onesie' ? 'A fresh onesie color, right on the baby!' : 'A cozy accessory, right on the baby!';
      btns = owned
        ? '<button class="btn primary small" id="fitUse">\u2713 Wear it</button>'
        : '<button class="btn primary small" id="fitBuy">' + art.icon('coin', 14) + ' ' + it.cost + '</button>';
    } else {
      var rs = { rug: S.room.rug, wall: S.room.wall, poster: S.room.poster, posterRoom: S.room.posterRoom };
      previewHtml = '<div class="fit-box wide">' + roomMockSvg(rs, it.kind === 'poster' ? (S.room.posterRoom || 'home') : 'home') + '</div>';
      note = it.kind === 'poster' ? 'Pick the wall it hangs on:' : 'How it will look in the living room!';
      btns = (owned
          ? '<button class="btn primary small" id="fitUse">\u2713 Use it</button>'
          : '<button class="btn primary small" id="fitBuy">' + art.icon('coin', 14) + ' ' + it.cost + '</button>') +
        (it.kind === 'poster' ? placeButtonsHtml() : '');
    }
    band.innerHTML = previewHtml +
      '<div class="fit-info"><div class="fit-name">Trying: ' + esc(it.name) + '</div>' +
      '<div class="fit-note">' + note + '</div>' +
      '<div class="fit-btns">' + btns + '<button class="btn small" id="fitRevert">Revert</button></div></div>';
    var buy = document.getElementById('fitBuy');
    if (buy) buy.addEventListener('click', function(ev){ ev.stopPropagation(); buyTrying(it); });
    var use = document.getElementById('fitUse');
    if (use) use.addEventListener('click', function(ev){ ev.stopPropagation(); useTrying(it); });
    var rev = document.getElementById('fitRevert');
    rev.addEventListener('click', function(ev){ ev.stopPropagation(); sfx.tap(); revertTrying(); renderPreviewBand(); });
    bindPlacement(band, function(){ renderPreviewBand(); });
    bindFitNav(band);
  }
  /* every purchase gets a little "what you got" moment — and a live look */
  function boughtShowcase(it){
    var S = P.S;
    var preview = '';
    var where = '';
    if (it.kind === 'onesie' || it.kind === 'acc'){
      preview = '<div class="fit-box big">' + fitRoomSvg() + '</div>';
      where = 'It looks adorable on ' + esc(S.buddy.name || 'Pippo') + ' \u2014 and it is already on!';
    } else if (it.kind === 'poster'){
      preview = '<div class="fit-box wide">' + roomMockSvg({ rug: S.room.rug, wall: S.room.wall, poster: S.room.poster, posterRoom: S.room.posterRoom }, S.room.posterRoom || 'home') + '</div>' +
        '<div class="fit-note">The frame hangs where you placed it \u2014 tap a room to move it anytime.</div>' +
        placeButtonsHtml();
    } else if (it.kind){
      preview = '<div class="fit-box wide">' + roomMockSvg({ rug: S.room.rug, wall: S.room.wall, poster: S.room.poster, posterRoom: S.room.posterRoom }, 'home') + '</div>';
      where = 'How it looks in the little house!';
    } else {
      preview = '<div class="buy-ico">' + itemIcon(it.id) + '</div>';
      where = 'Added to your ' + (data.foodOf(it.id) ? 'kitchen basket.' : 'toy shelf.');
    }
    openModal({ title: 'You bought ' + esc(it.name) + '!', body:
      '<div class="buy-wrap">' + preview + '<div class="buy-where">' + where + '</div>' +
      '<button class="btn primary" id="buyOk">Yay!</button></div>' });
    bindPlacement(modalEl, function(){
      var box = modalEl.querySelector('.fit-box.wide');
      if (box) box.innerHTML = roomMockSvg({ rug: S.room.rug, wall: S.room.wall, poster: S.room.poster, posterRoom: S.room.posterRoom }, S.room.posterRoom || 'home');
      commitShop();          // keep the placement when the shop reopens
      compose(true); st.save();
    });
    modalEl.querySelector('#buyOk').addEventListener('click', function(){
      sfx.tap(); closeModal(); openShop(shopTab);
    });
  }

  function openShop(tab){
    var t = tab || 'Food';
    shopTab = t;
    if (!shopPrev) snapshotShop();
    restoreShopState();   // switching tabs returns any tried-on look
    var S = P.S;
    var listHtml = '';
    if (t === 'Food' || t === 'Toys'){
      listHtml = (t === 'Food' ? data.FOODS : data.TOYS).map(function(it){
        var own = S.inv[it.id] || 0;
        return '<div class="shop-item" data-id="' + it.id + '">' +
          '<div class="it-ico">' + itemIcon(it.id) + '</div>' +
          '<div class="it-info"><div class="it-name">' + it.name + (own ? '<span class="it-own"> \u00d7' + own + '</span>' : '') + '</div>' +
          '<div class="it-desc">' + it.desc + '</div></div>' +
          '<button class="it-buy' + (st.canBuy(it.cost) ? '' : ' no') + '" data-buy="' + it.id + '">' + art.icon('coin', 14) + it.cost + '</button>' +
        '</div>';
      }).join('');
    } else if (t === 'Wear'){
      listHtml = data.WARDROBE.map(function(it){
        var owned = it.cost === 0 || S.closet[it.id];
        var wearing = it.kind === 'onesie' ? S.buddy.look.onesie === it.idx : S.buddy.look.acc === it.idx;
        return '<div class="shop-item' + (wearing ? ' wearing' : '') + '" data-id="' + it.id + '">' +
          '<div class="it-ico">' + wearSwatch(it) + '</div>' +
          '<div class="it-info"><div class="it-name">' + it.name + '</div>' +
          '<div class="it-desc">' + (it.kind === 'onesie' ? 'Onesie color' : 'Cozy accessory') + '</div></div>' +
          (owned
            ? '<button class="it-buy' + (wearing ? ' on' : '') + '" data-equip="' + it.id + '">' + (wearing ? '\u2713 Wearing' : 'Wear') + '</button>'
            : '<button class="it-buy' + (st.canBuy(it.cost) ? '' : ' no') + '" data-buywear="' + it.id + '">' + art.icon('coin', 14) + it.cost + '</button>') +
        '</div>';
      }).join('');
    } else {
      listHtml = data.ROOMS.map(function(it){
        var owned = it.cost === 0 || S.closet[it.id];
        var wearing = S.room[it.kind] === it.idx;
        return '<div class="shop-item' + (wearing ? ' wearing' : '') + '" data-id="' + it.id + '">' +
          '<div class="it-ico">' + wearSwatch(it) + '</div>' +
          '<div class="it-info"><div class="it-name">' + it.name + '</div>' +
          '<div class="it-desc">' + (it.kind === 'rug' ? 'Round rug style' : (it.kind === 'wall' ? 'Wall paint' : 'Picture frame')) + '</div></div>' +
          (owned
            ? '<button class="it-buy' + (wearing ? ' on' : '') + '" data-equip="' + it.id + '">' + (wearing ? '\u2713 Using' : 'Use') + '</button>'
            : '<button class="it-buy' + (st.canBuy(it.cost) ? '' : ' no') + '" data-buywear="' + it.id + '">' + art.icon('coin', 14) + it.cost + '</button>') +
        '</div>';
      }).join('');
    }
    var coinsRow = '<div class="set-row"><label>Your coins</label><span style="font-weight:800">' + art.icon('coin', 15) + ' ' + S.coins + '</span></div>';
    var tabs = ['Food', 'Toys', 'Wear', 'Room'].map(function(x){
      return '<div class="shop-tab' + (t === x ? ' sel' : '') + '" data-tab="' + x + '">' + x + '</div>';
    }).join('');
    var body = '<div class="shop-tabs">' + tabs + '</div>' +
      '<div class="fit-band" id="fitBand"></div>' +
      '<div class="shop-grid" id="shopGrid">' + listHtml + '</div>';
    openModal({ title: 'Cozy Shop', body: body, onClose: closeShopSession });
    var head = modalEl.querySelector('.modal-body');
    head.insertAdjacentHTML('afterbegin', coinsRow);
    bindShop(t);
    renderPreviewBand();
    markTrying();
    modalEl.querySelectorAll('[data-tab]').forEach(function(tb){
      tb.addEventListener('click', function(){ sfx.tap(); openShop(tb.getAttribute('data-tab')); });
    });
  }
  function wearSwatch(it){
    var svgOpen = '<svg viewBox="0 0 28 28" width="30" height="30" fill="none" stroke="' + P.C.ink + '" stroke-width="2.2">';
    if (it.kind === 'onesie'){
      return svgOpen + '<circle cx="14" cy="14" r="10.6" fill="' + art.onesieColor(it.idx) + '"/></svg>';
    }
    if (it.kind === 'acc'){
      return art.icon(it.idx === 'glasses' ? 'glasses' : (it.idx === 'scarf' ? 'scarf' : 'bow'), 26);
    }
    if (it.kind === 'rug'){
      var rug = art.rugPalette(it.idx);
      return svgOpen + '<ellipse cx="14" cy="14" rx="11.6" ry="7" fill="' + rug.f + '"/><ellipse cx="14" cy="14" rx="7.4" ry="4" stroke="' + rug.ring + '" stroke-dasharray="3 3"/></svg>';
    }
    if (it.kind === 'wall'){
      return svgOpen + '<rect x="3.4" y="3.4" width="21.2" height="21.2" rx="4" fill="' + art.wallPalette(it.idx) + '"/></svg>';
    }
    return art.icon(it.idx === 1 ? 'heart' : 'moon', 26);
  }
  function bindShop(tab){
    modalEl.querySelectorAll('[data-buy]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-buy');
        var item = data.foodOf(id) || data.toyOf(id);
        if (st.buy(item.cost)){
          st.addItem(id, 1); sfx.buy(); waveKeeper();
          compose(); refreshHUD(); st.save();
          boughtShowcase(item);   // a little "what you got" moment
        } else { toast('Not enough coins'); sfx.wrong(); }
      });
    });
    modalEl.querySelectorAll('[data-equip]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-equip');
        var it = closetItem(id);
        if (!it) return;
        equipItem(it);
        sfx.tap();
        commitShop();
        compose(true); st.save();
        openShop(tab);
      });
    });
    modalEl.querySelectorAll('[data-buywear]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-buywear');
        var it = closetItem(id);
        if (!it) return;
        if (st.buy(it.cost)){
          P.S.closet[id] = true;
          equipItem(it);
          sfx.buy();
          commitShop();
          compose(true); refreshHUD(); st.save();
          boughtShowcase(it);
        } else { toast('Not enough coins'); sfx.wrong(); }
      });
    });
    // tap a row to try it on / try it in the room — buy only if you love it
    modalEl.querySelectorAll('.shop-item[data-id]').forEach(function(row){
      row.addEventListener('click', function(ev){
        if (ev.target.closest('.it-buy')) return;
        var it = closetItem(row.getAttribute('data-id'));
        if (!it) return;
        sfx.tap();
        if (shopTrying && shopTrying.id === it.id){ revertTrying(); renderPreviewBand(); markTrying(); return; }
        previewItem(it);
        renderPreviewBand();
        markTrying();
      });
    });
  }
  function closetItem(id){
    var out = null;
    data.WARDROBE.concat(data.ROOMS).forEach(function(x){ if (x.id === id) out = x; });
    return out;
  }
  function equipItem(it){
    var S = P.S;
    if (it.kind === 'onesie'){ S.buddy.look.onesie = it.idx; }
    else if (it.kind === 'acc'){ S.buddy.look.acc = it.idx; }
    else { S.room[it.kind] = it.idx; }
  }

  /* ---------------- settings ---------------- */
  function openSettings(){
    var S = P.S;
    var body = h('div');
    body.innerHTML =
      '<div class="set-row"><label>Sound</label><div class="switch' + (S.settings.sound ? ' on' : '') + '" id="swSound"></div></div>' +
      '<div class="set-row"><label>Bedtime<span class="sub">Pippo sleeps and mirrors the night</span></label>' +
        '<select id="selBed">' + [20, 21, 22, 23].map(function(v){ return '<option ' + (S.settings.bedtime === v ? 'selected' : '') + '>' + v + ':00</option>'; }).join('') + '</select></div>' +
      '<div class="set-row"><label>Wake time</label>' +
        '<select id="selWake">' + [6, 7, 8].map(function(v){ return '<option ' + (S.settings.wake === v ? 'selected' : '') + '>' + v + ':00</option>'; }).join('') + '</select></div>' +
      '<div class="set-row"><label>\u26a1 Turbo<span class="sub">Demo speed \u00d760 \u2014 watch the days fly by</span></label><div class="switch' + (S.settings.turbo ? ' on' : '') + '" id="swTurbo"></div></div>' +
      '<div class="mrow"><button class="btn" id="expBtn">Export save</button><button class="btn" id="impBtn">Import save</button></div>' +
      '<div class="mrow"><button class="btn" id="resetBtn">Reset game</button></div>' +
      '<div class="mtext soft" style="text-align:center">Pippo &amp; Me \u00b7 v0.1 \u00b7 Cozy Storybook</div>';
    openModal({ title: 'Settings', body: body });
    $('#swSound').addEventListener('click', function(){ toggleSound(); openSettings(); });
    $('#swTurbo').addEventListener('click', function(){
      P.S.settings.turbo = !P.S.settings.turbo; st.save(); openSettings();
      toast(P.S.settings.turbo ? 'Turbo ON \u2014 time flies' : 'Turbo off');
    });
    $('#selBed').addEventListener('change', function(){ P.S.settings.bedtime = parseInt(this.value, 10); st.save(); compose(); });
    $('#selWake').addEventListener('change', function(){ P.S.settings.wake = parseInt(this.value, 10); st.save(); compose(); });
    $('#expBtn').addEventListener('click', function(){
      var blob = new Blob([st.exportSave()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'pippo-me-save.json';
      a.click();
    });
    $('#impBtn').addEventListener('click', function(){
      var inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'application/json';
      inp.onchange = function(){
        var f = inp.files[0]; if (!f) return;
        var r = new FileReader();
        r.onload = function(){
          try{ st.importSave(r.result); location.reload(); }
          catch(e){ toast('That save looks broken'); }
        };
        r.readAsText(f);
      };
      inp.click();
    });
    var resetBtn = $('#resetBtn'), armed = false;
    resetBtn.addEventListener('click', function(){
      if (!armed){ armed = true; resetBtn.textContent = 'Tap again to confirm'; return; }
      st.reset(); location.reload();
    });
  }

  /* ---------------- minigame: bath puzzle (solve it, then splash!) ---------------- */
  var BATH_QUIZ = [
    { q: 'What makes the bath all bubbly?',
      hint: 'The slippery little bar \u2014 squeak squeak~',
      opts: [
        { ok: 1, label: 'Soap', svg:
          '<svg viewBox="0 0 40 40">' +
          '<circle cx="13" cy="10" r="2.6" fill="none" stroke="' + C.water + '" stroke-width="1.8"/>' +
          '<circle cx="20" cy="6.5" r="1.8" fill="none" stroke="' + C.water + '" stroke-width="1.6"/>' +
          '<circle cx="27" cy="10.5" r="2.2" fill="none" stroke="' + C.water + '" stroke-width="1.8"/>' +
          '<rect x="8" y="17" width="24" height="15" rx="7" fill="' + C.water + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
          '<circle cx="15" cy="23.5" r="1.3" fill="' + C.ink + '" stroke="none"/>' +
          '<circle cx="25" cy="23.5" r="1.3" fill="' + C.ink + '" stroke="none"/>' +
          '<path d="M17.5 27 q2.5 2.2 5 0" fill="none" stroke="' + C.ink + '" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' },
        { ok: 0, label: 'Ball', svg:
          '<svg viewBox="0 0 40 40">' +
          '<circle cx="20" cy="23" r="12" fill="' + C.rose + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
          '<path d="M8.6 19.5 Q20 27.5 31.4 19.5" fill="none" stroke="' + C.ink + '" stroke-width="2.2"/>' +
          '<circle cx="15" cy="18" r="1.6" fill="' + C.paper + '" stroke="none"/>' +
          '</svg>' },
        { ok: 0, label: 'Book', svg:
          '<svg viewBox="0 0 40 40">' +
          '<rect x="9" y="12" width="22" height="18" rx="2.5" fill="' + C.paper + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
          '<path d="M20 12 L20 30" stroke="' + C.ink + '" stroke-width="2"/>' +
          '<path d="M12.5 17 L17 17 M12.5 21 L17 21 M23 17 L27.5 17 M23 21 L27.5 21" stroke="' + C.stone + '" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' } ] },
    { q: 'Who floats in the tub and squeaks?',
      hint: 'It says quack, quack~',
      opts: [
        { ok: 1, label: 'Ducky', svg:
          '<svg viewBox="0 0 40 40">' +
          '<path d="M6 27 Q5.5 33.5 13 34 L25 34 Q31 34 31 28.5 Q31 23.5 25 23 L14 23 Q6.5 23 6 27 Z" fill="' + C.amber + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<circle cx="26.5" cy="15.5" r="6.5" fill="' + C.amber + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
          '<path d="M32.5 14 L38 15.8 L32.5 17.6 Z" fill="' + C.orange + '" stroke="' + C.ink + '" stroke-width="1.6" stroke-linejoin="round"/>' +
          '<circle cx="28" cy="13.8" r="1.3" fill="' + C.ink + '" stroke="none"/>' +
          '</svg>' },
        { ok: 0, label: 'Rock', svg:
          '<svg viewBox="0 0 40 40">' +
          '<path d="M9 30 L10.5 22 Q13 13.5 21.5 14 Q30 14.5 30.5 23 L30 30 Q19.5 33.5 9 30 Z" fill="' + C.stone + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<circle cx="16" cy="22" r="1.2" fill="' + C.soft + '" stroke="none"/>' +
          '<circle cx="24" cy="25" r="1.2" fill="' + C.soft + '" stroke="none"/>' +
          '</svg>' },
        { ok: 0, label: 'Spoon', svg:
          '<svg viewBox="0 0 40 40">' +
          '<ellipse cx="15" cy="14" rx="6.5" ry="7.5" fill="' + C.paper + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
          '<path d="M18.5 19.5 L27 32" stroke="' + C.ink + '" stroke-width="3.2" stroke-linecap="round"/>' +
          '</svg>' } ] },
    { q: 'What dries you after the bath?',
      hint: 'Soft and cozy \u2014 it hugs you dry~',
      opts: [
        { ok: 1, label: 'Towel', svg:
          '<svg viewBox="0 0 40 40">' +
          '<path d="M6 11.5 L34 11.5" stroke="' + C.dwood + '" stroke-width="2.8" stroke-linecap="round"/>' +
          '<path d="M11 11.5 L29 11.5 L29 29 Q20 32.5 11 29 Z" fill="' + C.sky + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<path d="M11 26 Q20 29.5 29 26" fill="none" stroke="' + C.rose + '" stroke-width="2.4"/>' +
          '<circle cx="16" cy="18.5" r="1.3" fill="' + C.ink + '" stroke="none"/>' +
          '<circle cx="24" cy="18.5" r="1.3" fill="' + C.ink + '" stroke="none"/>' +
          '<path d="M17.5 21.5 q2.5 2 5 0" fill="none" stroke="' + C.ink + '" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' },
        { ok: 0, label: 'Umbrella', svg:
          '<svg viewBox="0 0 40 40">' +
          '<path d="M7 22 Q20 6.5 33 22 Q26.5 19.5 20 22 Q13.5 19.5 7 22 Z" fill="' + C.red + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<path d="M20 22 L20 31 Q20 34.5 16.5 33.5" fill="none" stroke="' + C.ink + '" stroke-width="2.4" stroke-linecap="round"/>' +
          '</svg>' },
        { ok: 0, label: 'Drum', svg:
          '<svg viewBox="0 0 40 40">' +
          '<path d="M11 14 L11 28 Q20 32 29 28 L29 14" fill="' + C.orange + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<ellipse cx="20" cy="14" rx="9" ry="3.4" fill="' + C.paper + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
          '<path d="M11 21 l4.5 -2.6 4.5 2.6 4.5 -2.6 4.5 2.6" fill="none" stroke="' + C.paper + '" stroke-width="2"/>' +
          '</svg>' } ] },
    { q: 'Where do we splash and get clean?',
      hint: 'It is full of warm water and bubbles~',
      opts: [
        { ok: 1, label: 'Bathtub', svg:
          '<svg viewBox="0 0 40 40">' +
          '<circle cx="13" cy="8" r="2.2" fill="none" stroke="' + C.water + '" stroke-width="1.8"/>' +
          '<circle cx="24" cy="6.5" r="1.7" fill="none" stroke="' + C.water + '" stroke-width="1.6"/>' +
          '<path d="M7 17 L33 17 L33 25.5 Q33 30.5 28 30.5 L12 30.5 Q7 30.5 7 25.5 Z" fill="' + C.paper + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<path d="M9.5 21 Q20 24 30.5 21" fill="none" stroke="' + C.water + '" stroke-width="2.4"/>' +
          '<circle cx="14" cy="25" r="1.2" fill="' + C.ink + '" stroke="none"/>' +
          '<circle cx="26" cy="25" r="1.2" fill="' + C.ink + '" stroke="none"/>' +
          '<path d="M17.5 27.5 q2.5 2 5 0" fill="none" stroke="' + C.ink + '" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' },
        { ok: 0, label: 'Flower pot', svg:
          '<svg viewBox="0 0 40 40">' +
          '<path d="M20 23 L20 17" stroke="' + C.leaf + '" stroke-width="2.2" stroke-linecap="round"/>' +
          '<circle cx="20" cy="13.5" r="4.4" fill="' + C.rose + '" stroke="' + C.ink + '" stroke-width="2.2"/>' +
          '<circle cx="20" cy="13.5" r="1.5" fill="' + C.gold + '" stroke="none"/>' +
          '<path d="M12.5 23 L27.5 23 L25.5 32 L14.5 32 Z" fill="' + C.orange + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
          '</svg>' },
        { ok: 0, label: 'Toy box', svg:
          '<svg viewBox="0 0 40 40">' +
          '<rect x="9" y="16" width="22" height="15" rx="2.5" fill="' + C.sand + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
          '<path d="M9 21 L31 21" stroke="' + C.ink + '" stroke-width="2"/>' +
          '<rect x="17.5" y="19" width="5" height="4" rx="1" fill="' + C.gold + '" stroke="' + C.ink + '" stroke-width="1.6"/>' +
          '</svg>' } ] }
  ];
  function startBath(cb){
    var base = BATH_QUIZ[Math.floor(Math.random() * BATH_QUIZ.length)];
    var opts = base.opts.slice().sort(function(){ return Math.random() - 0.5; });
    var cards = '';
    opts.forEach(function(o){
      cards += '<button class="pz-card" data-ok="' + o.ok + '">' + o.svg + '<span>' + o.label + '</span></button>';
    });
    var layer = h('div', 'mg-layer');
    layer.innerHTML =
      '<div class="mg-top">' +
        '<span class="mg-badge">Bath puzzle!</span>' +
        '<button class="modal-close" id="mgQuit">' + art.icon('close', 16) + '</button>' +
      '</div>' +
      '<div class="mg-area" style="background:' + C.paper + '; border:3px solid ' + C.ink + '">' +
        '<div class="pz-q">' + base.q + '</div>' +
        '<div class="pz-row">' + cards + '</div>' +
        '<div class="pz-hint" id="pzHint"></div>' +
      '</div>';
    $('#screen-home').appendChild(layer);
    var area = layer.querySelector('.mg-area');
    var solved = false, ended = false;
    Array.prototype.forEach.call(layer.querySelectorAll('.pz-card'), function(card){
      card.addEventListener('pointerdown', function(ev){
        ev.stopPropagation();
        if (ended || solved) return;
        if (card.dataset.ok === '1'){
          solved = true;
          sfx.giggle();
          card.classList.add('good');
          var hint = $('#pzHint'); if (hint) hint.textContent = 'Yes! Splash time!';
          for (var i = 0; i < 6; i++){
            var sp = h('div', 'pz-spark');
            sp.style.left = (10 + i * 15) + '%';
            sp.style.animationDelay = (i * 0.08) + 's';
            area.appendChild(sp);
          }
          setTimeout(function(){ endLayer(); cb(true); }, 1000);
        } else {
          sfx.tap();
          card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
          var hint = $('#pzHint'); if (hint) hint.textContent = base.hint;
        }
      });
    });
    function endLayer(){
      ended = true;
      layer.style.transition = 'opacity .25s'; layer.style.opacity = '0';
      setTimeout(function(){ if (layer.parentNode) layer.parentNode.removeChild(layer); }, 260);
    }
    $('#mgQuit').addEventListener('click', function(){
      if (ended || solved) return;
      endLayer(); cb(false);
    });
  }

  /* ---------------- cooking: soup at the little table (Phase 6) ---------------- */
  function cookStart(){
    if (guarded()) return;
    if (!st.buy(COOK_COST)){ toast('Not enough coins for ingredients'); return; }
    refreshHUD();
    closeModal();
    G.busy = true;
    startCook(function(hits){
      G.busy = false;
      if (hits >= 3){
        st.addItem('soup', 1);
        P.S.stats.cooked = (P.S.stats.cooked || 0) + 1;
        if (P.quests) P.quests.bump('cooked');
        if (!P.S.flags.firstCook){
          P.S.flags.firstCook = true;
          if (window.P.memory){ P.memory.journalAdd('cook', 'First home-cooked soup!'); P.memory.check(); }
        }
        var hl = G.homeLayout || { fx: 240, fy: 520, k: 1 };
        var p0 = r2s(hl.fx + 30 * hl.k, hl.fy - 155 * hl.k);
        heartBurstAt(p0.x, p0.y, 5);
        speech(pick(['Mmm! Smells so yummy!', 'We made soup together!', 'Little chef at work!']), 3200);
        sfx.giggle();
      } else {
        toast('The pot will wait for you~');
      }
      refreshHUD(); compose(true); st.save();
    });
  }

  /* ---------------- minigame: cooking soup ---------------- */
  var COOK_ING = [
    { left: '16%', svg:
      '<svg viewBox="0 0 40 40">' +
      '<path d="M16.5 12.5 q-4.5 -5 -8.5 -5 q3.5 5 7.5 6" fill="none" stroke="' + C.leaf + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M20 12 q0 -6 4.5 -8 q-.5 6 -3 8.5" fill="none" stroke="' + C.leaf + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M15 15 L25 15 L21.5 33.5 Q20 36 18.5 33.5 Z" fill="' + C.orange + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '</svg>' },
    { left: '44%', svg:
      '<svg viewBox="0 0 40 40">' +
      '<circle cx="20" cy="23" r="12" fill="' + C.rose + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M20 10.2 q-1.5 -3.2 -4.6 -3.8 q2.8 -.7 4.6 1.2 q1.8 -1.9 4.6 -1.2 q-3.1 .6 -4.6 3.8Z" fill="' + C.leaf + '" stroke="' + C.ink + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="15.5" cy="20" r="1.4" fill="' + C.paper + '" stroke="none"/>' +
      '</svg>' },
    { left: '72%', svg:
      '<svg viewBox="0 0 40 40">' +
      '<path d="M15 22.6 L14.6 31.5 Q20 34 25.4 31.5 L25 22.6" fill="' + C.paper + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M6.5 19.5 A13.5 11.5 0 0 1 33.5 19.5 Q34 22.6 30 22.6 L10 22.6 Q6 22.6 6.5 19.5Z" fill="' + C.sand + '" stroke="' + C.ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<circle cx="14" cy="16.5" r="1.8" fill="' + C.paper + '" stroke="none"/>' +
      '<circle cx="23.5" cy="14.5" r="2.2" fill="' + C.paper + '" stroke="none"/>' +
      '</svg>' }
  ];
  function startCook(cb){
    var layer = h('div', 'mg-layer');
    layer.innerHTML =
      '<div class="mg-top">' +
        '<span class="mg-badge">Cook the soup!</span>' +
        '<span class="mg-badge" id="mgProg">0 / 3</span>' +
        '<button class="modal-close" id="mgQuit">' + art.icon('close', 16) + '</button>' +
      '</div>' +
      '<div class="mg-area" id="mgArea" style="background:' + C.paper + '; border:3px solid ' + C.ink + '">' +
        '<div class="cook-hint">Tap each ingredient to plop it in the pot!</div>' +
        '<div class="cook-pot">' + art.icon('pot', 130) + '</div>' +
      '</div>';
    $('#screen-home').appendChild(layer);
    var area = $('#mgArea');
    var hits = 0, over = false, ended = false;
    COOK_ING.forEach(function(d, i){
      setTimeout(function(){ if (!over) spawnIng(d); }, 600 + i * 1000);
    });
    function spawnIng(d){
      if (over) return;
      var el = h('div', 'cook-ing');
      el.style.left = d.left;
      el.innerHTML = d.svg;
      el.addEventListener('pointerdown', function(ev){
        ev.stopPropagation();
        if (over || el.dataset.done) return;
        el.dataset.done = 1;
        hits++;
        var pr = $('#mgProg'); if (pr) pr.textContent = hits + ' / 3';
        sfx.pop();
        el.style.animation = 'none';
        el.style.transition = 'transform .32s ease-in, opacity .32s';
        el.style.transform = 'translateY(46vh) scale(.35) rotate(24deg)';
        el.style.opacity = '0';
        setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); }, 340);
        if (hits >= 3) setTimeout(finish, 380);
      });
      area.appendChild(el);
    }
    function finish(){
      if (ended) return;
      ended = true; over = true;
      var pr = $('#mgProg'); if (pr) pr.textContent = 'Ready!';
      for (var i = 0; i < 6; i++){
        var p = h('div', 'cook-steam');
        p.style.left = (36 + i * 6) + '%';
        p.style.animationDelay = (i * 0.1) + 's';
        area.appendChild(p);
      }
      sfx.giggle();
      setTimeout(function(){ endLayer(); cb(3); }, 1100);
    }
    function endLayer(){
      layer.style.transition = 'opacity .25s'; layer.style.opacity = '0';
      setTimeout(function(){ if (layer.parentNode) layer.parentNode.removeChild(layer); }, 260);
    }
    $('#mgQuit').addEventListener('click', function(){
      if (ended) return;
      ended = true; over = true; endLayer(); cb(hits);
    });
  }

  /* ================= visitors: friends who knock (Phase 6) ================= */
  var GUESTS = {
    rosa: { id:'rosa', name:'Nana Rosa', kind:'stories', mood:14, bond:3, coins:0,
      hello:'Tea time! I brought warm berry cookies for you two~',
      byeLine:'Thank you for the cookies, Nana Rosa!' },
    momo: { id:'momo', name:'Momo', kind:'games', mood:10, bond:2, coins:5,
      hello:'Look look! I found a shiny coin \u2014 it is for my best friend!',
      byeLine:'Bye Momo! Come play again tomorrow!' }
  };
  /* Nana Rosa's little tales rotate day by day — each visit can be a story visit */
  var ROSA_TALES = [
    { title:'the little paper boat',  t:'The paper boat that sailed the whole gutter-sea and came home with a pearl.',        m:'And the little boat found its way back home, right to our door.' },
    { title:'the fog-knit scarf',     t:'The hedgehog who knitted a scarf out of morning fog.',                                m:'It was the coziest scarf in the whole garden, they say.' },
    { title:'the two lost mittens',   t:'The two mittens that got separated in the snow and found each other in spring.',      m:'They held hands all summer, even in the warm sun.' },
    { title:'the whistling teapot',   t:'The teapot who whistled lullabies so the cups could dream.',                          m:'And every cup dreamed of little seas of tea. Sweet dreams~' }
  ];
  /* Momo's games rotate too — pat-a-cake days, thimble days, shadow days */
  var MOMO_GAMES = [
    { id:'pat-a-cake',            line:'Pat-a-cake, pat-a-cake \u2014 faster, faster! Hee hee!' },
    { id:'hide the thimble',      line:'Where did the thimble go? Under the cushion \u2014 found it!' },
    { id:'shadow puppets',        line:'Look \u2014 a bunny shadow! And a big flappy bird!' },
    { id:'ring-around-the-rosie', line:'Ring around the rosie, we all tumble down \u2014 giggle giggle!' }
  ];
  var FRIEND_LABEL = { 1:'New friend', 2:'Good friend', 3:'Best friend' };
  var SEAT_X = 158;   // guest spot on the rug's left edge

  function friendPts(id){
    var F = P.S.friends || (P.S.friends = {});
    return (F[id] && F[id].pts) || 0;
  }
  function friendLevel(pts){ return pts >= 15 ? 3 : pts >= 6 ? 2 : 1; }

  /* once a day, someone knocks between 10:00 and 21:00 while Pippo is awake */
  function guestTick(){
    var S = P.S;
    if (!S || !S.flags.adopted) return;
    /* a knock nobody answered for 2 minutes: they give up kindly */
    if (G.guest && G.guest.phase === 'knock' && Date.now() - (G.guest.t0 || 0) > 120000){
      G.guest = null;
      speech(pick(['Aww\u2026 they could not wait\u2026', 'Maybe they will come back tomorrow\u2026']), 3000);
      compose(true);
      return;
    }
    if (G.guest || G.busy || G.walk || S.daily.visit === 1 || S.buddy.asleep) return;
    if (st.isNight()) return;
    var h = st.clockParts().h;
    if (h < 10 || h >= 21) return;
    if (document.querySelector('#modalRoot .modal')) return;
    if (Math.random() < 0.004) startKnock();
  }
  function startKnock(who){
    var S = P.S;
    if (!S || !S.flags.adopted || S.buddy.asleep) return false;
    if (G.guest || G.busy || G.walk) return false;
    var ids = Object.keys(GUESTS);
    G.guest = { who: who && GUESTS[who] ? who : ids[Math.floor(Math.random() * ids.length)],
      phase: 'knock', x: DOOR_X, t0: Date.now() };
    S.daily.visit = 1;
    sfx.knock(); setTimeout(sfx.knock, 420);
    speech(pick(['Knock knock!', 'Someone is at our door!', 'I hear a knock-knock \u2014 the front door!']), 2800);
    compose(true); refreshHUD();
    return true;
  }
  /* tapping the front door welcomes the waiting guest */
  function welcomeGuest(){
    var g = G.guest;
    if (!g || g.phase !== 'knock' || G.busy) return;
    g.phase = 'enter';
    speech(pick(['A visitor! Yay!', 'Come in, come in!']), 2200);
    compose(true);
    guestWalk(g, SEAT_X, function(){
      g.phase = 'sit';
      compose(true);
      sfx.coo();
      setTimeout(function(){ openVisitModal(g); }, 700);
    });
  }
  function guestWalk(g, toX, done){
    var x0 = g.x, dist = Math.abs(toX - x0) || 1;
    var dur = dist / 0.26, t0 = performance.now(), last = t0, stopped = false;
    function step(now){
      if (stopped) return;
      if (!G.guest || G.guest !== g){ stopped = true; if (done) done(); return; }
      var dt = Math.min(200, now - last); last = now;
      var prog = Math.min(1, (now - t0) / dur);
      var x = x0 + (toX - x0) * prog;
      var hop = Math.abs(Math.sin((now - t0) * 0.012)) * 6;
      g.x = x;
      var el = document.getElementById('guestG');
      if (el) el.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + (528 - hop).toFixed(1) + ')');
      if (prog >= 1){
        stopped = true;
        g.x = toX;
        var el2 = document.getElementById('guestG');
        if (el2) el2.setAttribute('transform', 'translate(' + toX.toFixed(1) + ' 528)');
        if (done) done();
        return;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    /* watchdog keeps slow/occluded tabs moving */
    var wd = setInterval(function(){
      if (stopped || !G.guest){ clearInterval(wd); return; }
      if (performance.now() - last > 350) step(performance.now());
    }, 320);
  }
  function openVisitModal(g){
    var who = GUESTS[g.who] || GUESTS.rosa;
    var S = P.S;
    var lv = friendLevel(friendPts(who.id));
    var hearts = '';
    for (var i = 0; i < 3; i++){
      hearts += '<span style="display:inline-flex;opacity:' + (i < lv ? '1' : '.22') + '">' + art.icon('heart', 15) + '</span>';
    }
    var actLabel = who.kind === 'stories' ? 'Ask for a story' : 'Play together';
    var actHint = who.kind === 'stories'
      ? 'Rosa has a fresh little tale every day'
      : 'Momo brought a brand-new game today';
    openModal({
      title: who.name + ' is visiting',
      body: '<div class="visit-face">' + art.guestPortrait(g.who) + '</div>' +
        '<div style="display:flex;gap:5px;align-items:center;justify-content:center;margin:2px 0 6px">' + hearts +
        '<span class="mtext soft" style="margin:0 0 0 6px;font-weight:700">' + FRIEND_LABEL[lv] + '</span></div>' +
        '<div class="mtext">\u201c' + who.hello + '\u201d</div>' +
        '<div class="mtext soft">' + esc(S.buddy.name || 'Pippo') + ' beams \u2014 a cozy little tea on the rug!</div>' +
        '<div class="mtext soft" style="margin-top:4px">' + art.icon(who.kind === 'stories' ? 'book' : 'ball', 13) + ' ' + actHint + '</div>' +
        '<div class="mrow">' +
        '<button class="btn primary" id="btnVisitTea">Share the tea</button>' +
        '<button class="btn" id="btnVisitAct">' + actLabel + '</button>' +
        '</div>',
      onClose: function(){ politeLeave(g); }
    });
    var tea = document.getElementById('btnVisitTea');
    if (tea) tea.addEventListener('click', function(){ closeModal(); finishVisit(g, who, 'tea'); });
    var act = document.getElementById('btnVisitAct');
    if (act) act.addEventListener('click', function(){ closeModal(); finishVisit(g, who, who.kind === 'stories' ? 'story' : 'game'); });
  }
  /* dismissed without sharing tea: the guest leaves, no gifts, no fuss */
  function politeLeave(g){
    if (!G.guest || G.guest !== g || g.phase !== 'sit') return;
    speech(pick(['Visit again soon, okay?', 'Bye bye \u2014 come back tomorrow!']), 2600);
    g.phase = 'bye';
    compose(true);
    guestWalk(g, DOOR_X, function(){
      G.guest = null;
      compose(true); refreshHUD();
    });
  }
  function finishVisit(g, who, act){
    var S = P.S;
    var F = S.friends || (S.friends = {});
    var fr = F[who.id] || (F[who.id] = { pts: 0, visits: 0 });
    var lvBefore = friendLevel(fr.pts);
    var moodGain = who.mood, bondGain = who.bond, coinsGift = who.coins || 0;
    var line = null, jour = '';
    if (act === 'tea'){
      fr.pts += 3;
      jour = 'Shared tea with ' + who.name;
    } else if (act === 'story'){
      var tale = ROSA_TALES[(st.dayNum() + 1) % ROSA_TALES.length];
      moodGain = 8; bondGain = Math.max(2, who.bond - 1);
      fr.pts += 2;
      line = tale.m;
      jour = 'Story time \u2014 Rosa told ' + tale.title;
    } else {
      var game = MOMO_GAMES[(st.dayNum() + 2) % MOMO_GAMES.length];
      moodGain = 8; bondGain = Math.max(2, who.bond - 1);
      fr.pts += 2;
      line = game.line;
      jour = 'Played ' + game.id + ' with Momo';
    }
    /* best friends feel right at home: a little extra warmth */
    if (friendLevel(fr.pts) === 3){ moodGain += 4; coinsGift += 2; }
    st.addMeter('mood', moodGain);
    st.addBond(bondGain);
    if (coinsGift){ st.addCoins(coinsGift); toast('+' + coinsGift + 'c'); }
    S.stats.visits = (S.stats.visits || 0) + 1;
    if (!S.flags.firstVisit){
      S.flags.firstVisit = true;
      if (window.P.memory){ P.memory.journalAdd('visit', 'First friendly visit \u2014 ' + who.name + '!'); }
    }
    if (window.P.memory){ P.memory.journalAdd('visit', jour); }
    if (P.quests) P.quests.setFlag('visitDone');
    var lvAfter = friendLevel(fr.pts);
    if (lvAfter > lvBefore){
      toast(who.name + ' is now our ' + FRIEND_LABEL[lvAfter] + '!');
      if (lvAfter === 3 && window.P.memory){ P.memory.journalAdd('heart', who.name + ' is a best friend now!'); }
      heartBurstAt(240, 300, 9);
    }
    P.memory.check();
    var gp = r2s(g.x, 430);
    heartBurstAt(gp.x, gp.y, 5);
    sfx.giggle();
    speech(line || who.byeLine, 2800);
    g.phase = 'bye';
    compose(true);
    guestWalk(g, DOOR_X, function(){
      G.guest = null;
      speech(pick(['Come again soon!', 'What a lovely visit~']), 2400);
      compose(true); refreshHUD(); st.save();
    });
  }

  /* ---------------- minigame: peekaboo ---------------- */
  function startPeek(cb){
    var layer = h('div', 'mg-layer');
    layer.innerHTML =
      '<div class="mg-top">' +
        '<span class="mg-badge">Where is ' + esc(P.S.buddy.name) + '?</span>' +
        '<span class="mg-badge" id="mgRound">Round 1 / 3</span>' +
        '<button class="modal-close" id="mgQuit">' + art.icon('close', 16) + '</button>' +
      '</div>' +
      '<div class="mg-area" id="mgArea" style="background:' + C.dim + '; border:3px solid ' + C.ink + '"></div>';
    $('#screen-home').appendChild(layer);
    var area = $('#mgArea');
    var spots = ['12%', '40%', '68%'];
    var round = 0, hits = 0, playing = false, finished = false;

    // three cloth patches
    var cloths = spots.map(function(left, i){
      var c = h('div', 'peek-cloth');
      c.dataset.spot = i;
      c.style.left = left; c.style.width = '20%'; c.style.height = '38%';
      c.style.top = '26%';
      c.innerHTML = '<svg viewBox="-40 -40 80 80" style="width:100%;opacity:0">' + art.faceMini(P.S.buddy.look) + '</svg>';
      area.appendChild(c);
      c.addEventListener('pointerdown', function(){ guess(i, c); });
      return c;
    });

    function nextRound(){
      if (finished) return;
      if (round >= 3){ end(); return; }
      playing = false;
      var spot = Math.floor(Math.random() * 3);
      cloths.forEach(function(c){ c.dataset.spotFace = ''; });
      var lucky = cloths[spot];
      lucky.dataset.spotFace = '1';
      setTimeout(function(){
        if (finished) return;
        lucky.querySelector('svg').style.opacity = '1';
        lucky.style.transform = 'translateY(-16%) rotate(-6deg)';
        sfx.peek();
        playing = true;
        lucky.dataset.revealTime = Date.now();
        hideTimer = setTimeout(function(){
          lucky.querySelector('svg').style.opacity = '0';
          lucky.style.transform = '';
          playing = false;
          round++;
          var counter = $('#mgRound');
          if (counter) counter.textContent = 'Round ' + Math.min(round + 1, 3) + ' / 3';
          setTimeout(nextRound, 650);
        }, 1250);
      }, 850);
    }
    var hideTimer;
    function guess(i){
      if (!playing || finished || round >= 3) return;
      clearTimeout(hideTimer);
      var correct = cloths[i].dataset.spotFace === '1';
      round++;
      var rEl = $('#mgRound'); if (rEl) rEl.textContent = 'Round ' + (round < 3 ? round + 1 : 3) + ' / 3';
      if (correct){
        hits++;
        sfx.correct();
        var c = cloths[i], r = c.getBoundingClientRect(), ar = area.getBoundingClientRect();
        fx.burst('heart', r.left - ar.left + r.width / 2, r.top - ar.top, 3, 14);
        c.querySelector('svg').style.opacity = '1';
      } else {
        sfx.wrong();
        cloths.forEach(function(cc){ cc.style.transform = ''; cc.querySelector('svg').style.opacity = '0'; });
      }
      playing = false;
      setTimeout(function(){
        cloths.forEach(function(cc){ cc.style.transform = ''; cc.querySelector('svg').style.opacity = '0'; });
        nextRound();
      }, 650);
    }
    function end(){
      if (finished) return;
      finished = true;
      clearTimeout(hideTimer);
      layer.style.transition = 'opacity .25s'; layer.style.opacity = '0';
      setTimeout(function(){ if (layer.parentNode) layer.parentNode.removeChild(layer); }, 260);
      cb(hits);
    }
    $('#mgQuit').addEventListener('click', end);
    nextRound();
  }

  /* ---------------- sleeping zzz loop ---------------- */
  function setSleepingFx(isOn){
    clearInterval(G.zzzTimer);
    G.zzzTimer = null;
    if (isOn && G.homeLayout){
      G.zzzTimer = setInterval(function(){
        if (!P.S.buddy.asleep || !G.homeLayout) { clearInterval(G.zzzTimer); G.zzzTimer = null; return; }
        var L = G.homeLayout;
        var p = r2s(L.fx - 26 * L.k, L.fy - 96 * L.k);
        fx.burst(Math.random() < 0.75 ? 'zzz' : 'note', p.x, p.y, 1, 4);
      }, 2800);
      var p0 = r2s(G.homeLayout.fx - 26 * G.homeLayout.k, G.homeLayout.fy - 108 * G.homeLayout.k);
      fx.burst('zzz', p0.x, p0.y, 1, 3);
    }
  }

  /* ================= exports ================= */
  P.gameX = {}; // namespace reserved for main.js extensions
  P.screens = {
    enterSplash: enterSplash,
    enterAdoption: enterAdoption,
    enterHome: enterHome,
    compose: compose,
    refreshHUD: refreshHUD,
    toast: toast,
    speech: speech,
    openShop: openShop,
    openSettings: openSettings,
    closeModal: closeModal,
    doFeed: preFeed,
    doBath: preBath,
    doPlay: prePlay,
    playReaction: function(){ if (G.rig) G.rig.react('play',1350); },
    doNap: doNap,
    goRoom: goRoom,
    room: function(){ return G.room; },
    waveKeeper: waveKeeper,
    bedPrompt: bedPrompt,
    wake: wake,
    setSleepingFx: setSleepingFx,
    tutorialAdvance: tutorialAdvance,
    curTutStep: curTutStep,
    heartBurstAt: heartBurstAt,
    r2s: r2s,
    openModal: openModal,
    openFocus: openFocus,
    openBrainPanel: openBrainPanel,
    guestTick: guestTick,
    startKnock: startKnock,
    welcomeGuest: welcomeGuest,
    guestState: function(){ return G.guest; },
    shopTrialActive: function(){ return !!shopTrying; },
    toastFn: toast
  };
  P.rigs = [];
})();
