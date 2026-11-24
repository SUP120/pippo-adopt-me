/* Tiny procedural sound kit — WebAudio only, no files. Created on first gesture. */
window.P = window.P || {};
P.sfx = (function(){
  var ctx = null, master = null, enabled = true, lullTimer = null;

  function ensure(){
    if (ctx) return true;
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.22;
      master.connect(ctx.destination);
    }catch(e){ return false; }
    return true;
  }
  function setEnabled(v){
    enabled = !!v;
    if (!enabled) stopLullaby();
  }

  /* one enveloped tone */
  function tone(freq, dur, type, gain, when, slideTo){
    if (!ensure() || !enabled) return;
    var t0 = ctx.currentTime + (when||0);
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.5, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  var A = {
    unlock:function(){ if (ensure() && ctx.state === 'suspended') ctx.resume(); },
    setEnabled:setEnabled,
    isOn:function(){ return enabled; },

    tap:   function(){ tone(660, .07, 'sine', .35); },
    pop:   function(){ tone(520 + Math.random()*300, .08, 'sine', .5, 0, 900); },
    giggle:function(){ tone(740,.08,'triangle',.5); tone(880,.08,'triangle',.5,.09); tone(990,.1,'triangle',.5,.18); },
    coo:   function(){ tone(300,.22,'sine',.45,0,430); },
    bird:  function(){ tone(1150,.10,'sine',.3,0,1350); tone(980,.12,'sine',.3,.13,780); },
    munch: function(){ tone(180,.1,'square',.25); tone(150,.1,'square',.22,.12); },
    sip: function(){ tone(350,.09,'sine',.12,0,270); tone(215,.12,'sine',.11,.12,185); },
    splash:function(){ tone(300,.12,'sine',.4); tone(240,.14,'sine',.35,.07,140); },
    swim:  function(){ tone(240,.2,'sine',.3,0,500); },
    boop:  function(){ tone(440,.09,'sine',.4,0,340); },
    knock: function(){ tone(140,.09,'triangle',.6); tone(124,.12,'triangle',.5,.17); },
    sad:   function(){ tone(420,.2,'triangle',.35); tone(330,.3,'triangle',.35,.18); },
    buy:   function(){ tone(1320,.08,'sine',.4); tone(1760,.1,'sine',.4,.07); },
    write: function(){ tone(880,.05,'triangle',.3); },
    night: function(){ tone(392,.3,'sine',.35); tone(523,.4,'sine',.3,.25); },
    chimeMorning:function(){
      [523,659,784,1047].forEach(function(f,i){ tone(f,.28,'sine',.4,i*0.14); });
    },
    cheer: function(){
      [659,784,988,1175,1568].forEach(function(f,i){ tone(f,.14,'triangle',.4,i*0.07); });
    },
    peek:  function(){ tone(500,.1,'sine',.35,0,760); },
    correct:function(){ tone(880,.1,'sine',.45); tone(1175,.14,'sine',.45,.09); },
    wrong: function(){ tone(300,.15,'triangle',.35); },

    /* gentle 8-note lullaby loop (stops when enabled=false or stopLullaby) */
    startLullaby:function(){
      if (!ensure() || !enabled || lullTimer) return;
      var notes = [523,440,392,440,523,587,523,440], i = 0;
      var step = function(){
        if (!enabled){ lullTimer = null; return; }
        tone(notes[i % notes.length], .5, 'sine', .28);
        tone(notes[i % notes.length]*2, .5, 'sine', .07);
        i++;
        lullTimer = setTimeout(step, 640);
      };
      step();
    },
    stopLullaby:(function(){ /* replaced below due to nesting */ return null; })()
  };

  function stopLullaby(){ if (lullTimer){ clearTimeout(lullTimer); lullTimer = null; } }
  A.stopLullaby = stopLullaby;
  return A;
})();
