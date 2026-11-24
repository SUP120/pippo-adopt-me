/* Buddy rig life controller — makes the SVG character feel alive.
   All motion is procedural: breathing, blinking, pupil tracking, arm sway. */
window.P = window.P || {};
(function(){

  /* shared pointer position (updated once, read by every rig) */
  var ptr = { x: innerWidth / 2, y: innerHeight / 2, has: false };
  window.addEventListener('pointermove', function(e){ ptr.x = e.clientX; ptr.y = e.clientY; ptr.has = true; }, { passive:true });
  window.addEventListener('pointerdown', function(e){ ptr.x = e.clientX; ptr.y = e.clientY; ptr.has = true; }, { passive:true });
  P._ptr = ptr;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function Rig(svgEl){
    this.svg = svgEl;
    this.face = 'open';
    this.sleeping = false;
    this.wobbleUntil = 0;
    this.chewUntil = 0;
    this.blinkAt = performance.now() + 2600;
    this.blinkOn = false;
    this.refs = {};
    this._faceApplied = '';
    this._displayCache = {};
  }

  Rig.prototype.build = function(inner){ this.svg.innerHTML = inner || ''; this.refs = {}; };

  Rig.prototype.attach = function(){
    var r = this.refs, svg = this.svg;
    if (r.attached) return;
    r.attached = true;
    var q = function(sel){ return svg.querySelector(sel); };
    r.place = q('.rig-place');
    r.feeding = !!q('.meal-prop');
    r.body = q('.rig-body');
    r.head = q('.g-head');
    r.hs = r.head ? parseFloat(r.head.getAttribute('data-hs') || '1') : 1;
    r.armL = q('.g-armL'); r.armR = q('.g-armR');
    r.eOpen = q('.e-open'); r.eClosed = q('.e-closed');
    r.pupils = q('.e-pupils');
    r.mOpen = q('.m-open'); r.mChew = q('.m-chew');
    r.mSmile = q('.m-smile'); r.mSad = q('.m-sad');
  };

  function disp(el, on){
    if (!el) return;
    var v = on ? '' : 'none';
    if (el.datasetDisp === v) return;
    el.datasetDisp = v;
    el.style.display = v;
  }

  Rig.prototype.setFace = function(face, mouth){
    this.attach();
    var r = this.refs;
    this.face = face === 'closed' ? 'closed' : 'open';
    this.mouth = mouth;
    disp(r.eOpen, this.face === 'open');
    disp(r.eClosed, this.face !== 'open');
    disp(r.mSmile, mouth === 'smile');
    disp(r.mOpen, mouth === 'open');
    disp(r.mSad, mouth === 'sad');
  };

  Rig.prototype.wobble = function(ms){ this.wobbleUntil = performance.now() + (ms || 420); };
  Rig.prototype.react = function(kind, ms){
    this.reaction = kind;
    this.reactStart = performance.now();
    this.reactDuration = ms;
  };
  Rig.prototype.chew = function(ms){ this.chewUntil = performance.now() + (ms || 2200); };

  /* world-space placement metrics (room svg coords) — home uses for hit-tests */
  Rig.prototype.metrics = function(){
    var r = this.refs;
    var place = r.place;
    if (!place) return null;
    var items = place.transform.baseVal;
    var m = items.getItem(0).matrix;      // translate part
    var k = items.numberOfItems > 1 ? items.getItem(1).matrix.a : 1;  // scale part
    return { fx: m.e + 100 * k, fy: m.f + 210 * k, k: k, hs: r.hs,
      headCx: m.e + 100 * k, headCy: m.f + 210 * k - 126 * k, headR: 41 * k * r.hs * 1.3,
      bellyCy: m.f + 210 * k - 52 * k, bellyR: 34 * k };
  };

  Rig.prototype.frame = function(now){
    var r = this.refs;
    this.attach();
    if (!r.place) return;
    var t = now * 0.001;
    var progress = (now - this.reactStart) / this.reactDuration;
    var reacting = progress >= 0 && progress < 1 && !this.sleeping;
    var pulse = reacting && !reduced.matches ? Math.sin(Math.PI * progress) : 0;
    var beat = pulse * Math.sin(progress * Math.PI * 5);
    var splash = this.reaction === 'splash' ? beat : 0;
    var delight = reacting && !r.feeding;
    r.place.classList.toggle('is-splashing', delight && this.reaction === 'splash');

    // breathing: gentle vertical scale around feet
    if (r.body){
      var sy = this.sleeping ? (1 + 0.02 * Math.sin(t * 1.4)) : (1 + 0.012 * Math.sin(t * 2.1));
      var lift = this.reaction === 'play' ? 7 * Math.abs(beat) : 2 * Math.abs(splash);
      r.body.setAttribute('transform', 'translate(100 ' + (210-lift) + ') scale(1 ' + (reduced.matches ? 1 : sy).toFixed(4) + ') translate(-100 -210)');
    }

    // head wobble / sleepy tilt
    if (r.head){
      var rot = 0;
      if (this.sleeping) rot = -9;
      else if (now < this.wobbleUntil){
        var remain = Math.max(0, this.wobbleUntil - now);
        rot = 9 * Math.sin(t * 30) * (remain / 340);
      } else {
        rot = 1.6 * Math.sin(t * 0.9);   // idle sway
      }
      if (r.feeding) rot = -4 + 2 * Math.sin(t * 8);
      if (delight) rot = this.reaction === 'cuddle' ? -10 * pulse : 5 * beat;
      if (reduced.matches) rot = this.sleeping ? -6 : 0;
      r.head.setAttribute('transform',
        'translate(100 84) rotate(' + rot.toFixed(2) + ') scale(' + r.hs + ') translate(-100 -84)');
    }

    // arm sway
    if (r.armL && r.armR){
      var bl = parseFloat(r.armL.getAttribute('data-base') || '20');
      var br = parseFloat(r.armR.getAttribute('data-base') || '-20');
      var sw = reduced.matches ? 0 : this.sleeping ? 0.8 : 2.2;
      bl += 35 * Math.abs(splash) + (this.reaction === 'play' ? 78 * pulse : 0);
      br -= 35 * Math.abs(splash) + (this.reaction === 'play' ? 78 * pulse : 0);
      r.armL.setAttribute('transform', 'rotate(' + (bl + sw * Math.sin(t * 1.8)).toFixed(2) + ' 72 130)');
      r.armR.setAttribute('transform', 'rotate(' + (br - sw * Math.sin(t * 1.8 + 0.9)).toFixed(2) + ' 128 130)');
    }

    // blinking
    var squint = delight && progress < .76;
    disp(r.eOpen, (this.face === 'open') && !(this.blinkOn || this.sleeping || squint));
    disp(r.eClosed, this.face !== 'open' || this.blinkOn || this.sleeping || squint);
    if (this.mouth){
      disp(r.mOpen, delight ? this.reaction !== 'cuddle' : this.mouth === 'open');
      disp(r.mSmile, delight ? this.reaction === 'cuddle' : this.mouth === 'smile');
      disp(r.mSad, !delight && this.mouth === 'sad');
    }
    if (!this.sleeping && this.face === 'open'){
      if (now >= this.blinkAt){
        if (!this.blinkOn){ this.blinkOn = true; this.blinkAt = now + 130; }
        else { this.blinkOn = false; this.blinkAt = now + 2600 + Math.random() * 3600; }
      }
    }

    // pupil tracking (Talking-Tom feel): eyes drift toward the pointer
    if (r.pupils){
      var rect = this.svg.getBoundingClientRect();
      if (rect.width > 4 && ptr.has){
        var dx = (ptr.x - (rect.left + rect.width / 2)) / rect.width * 10;
        var dy = (ptr.y - (rect.top + rect.height * 0.32)) / rect.height * 8;
        var mx = 3.1, my = 2.3;
        dx = Math.max(-mx, Math.min(mx, dx));
        dy = Math.max(-my, Math.min(my, dy));
        r.pupils.setAttribute('transform', 'translate(' + dx.toFixed(2) + ' ' + dy.toFixed(2) + ')');
      }
    }

    // chewing while feeding
    if (r.mChew){
      if (now < this.chewUntil){
        var s = 0.62 + 0.38 * Math.abs(Math.sin(t * 17));
        r.mChew.setAttribute('transform', 'translate(100 107) scale(1 ' + s.toFixed(3) + ') translate(-100 -107)');
      } else if (r.mChew.getAttribute('transform')){
        r.mChew.removeAttribute('transform');
      }
    }
  };

  P.Rig = Rig;
})();
