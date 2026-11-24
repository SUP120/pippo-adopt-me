/* Paper-particle FX layer. Ink-outlined shapes only — never glowing dots. */
window.P = window.P || {};
P.fx = (function(){
  var C = P.C;
  var layer = null;

  /* tiny inline svg shapes, animated by CSS classes in theme.css */
  function shape(type){
    var s = '';
    if (type === 'heart') s =
      '<svg viewBox="0 0 24 22" width="'+(14+Math.random()*8)+'"><path d="M12 20 C4 14 1 9 1 6 C1 2 5 0 8 0 C10 0 11.4 1 12 2.4 C12.6 1 14 0 16 0 C19 0 23 2 23 6 C23 9 20 14 12 20 Z" fill="'+C.rose+'" stroke="'+C.ink+'" stroke-width="2"/></svg>';
    else if (type === 'zzz') s =
      '<svg viewBox="0 0 20 20" width="18"><path d="M2 3 H12 L2 13 H12" fill="none" stroke="'+C.ink+'" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    else if (type === 'spark') s =
      '<svg viewBox="0 0 24 24" width="20"><path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="'+C.amber+'" stroke="'+C.ink+'" stroke-width="1.6"/></svg>';
    else if (type === 'leaf') s =
      '<svg viewBox="0 0 18 12" width="16"><path d="M1 8 Q6 -2 17 2 Q13 11 1 8 Z" fill="'+C.leaf+'" stroke="'+C.ink+'" stroke-width="1.6"/></svg>';
    else if (type === 'drop') s =
      '<svg viewBox="0 0 14 18" width="12"><path d="M7 1 C10 6 13 9 13 12 A6 6 0 0 1 1 12 C1 9 4 6 7 1 Z" fill="'+C.water+'" stroke="'+C.ink+'" stroke-width="1.6"/></svg>';
    else if (type === 'note') s =
      '<svg viewBox="0 0 18 22" width="15"><path d="M6 18 V4 L16 2 V14" fill="none" stroke="'+C.ink+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="4" cy="18" rx="3.4" ry="2.6" fill="'+C.ink+'"/><ellipse cx="14" cy="14" rx="3.4" ry="2.6" fill="'+C.ink+'"/></svg>';
    else s = '';
    return s;
  }

  var ANIM = { heart:'fx-heart 1.5s ease-out forwards', zzz:'fx-zzz 2.4s linear forwards',
    spark:'fx-spark .8s ease-out forwards', leaf:'fx-leaf 1.8s linear forwards',
    drop:'fx-drop .7s ease-in forwards', note:'fx-note 2.2s linear forwards' };

  function spawnOne(type, x, y){
    var d = document.createElement('div');
    d.className = 'fxr';
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.style.setProperty('--dx', (Math.random()*70 - 35).toFixed(0) + 'px');
    d.style.setProperty('--rot', (Math.random()*160 - 80).toFixed(0) + 'deg');
    d.style.animation = ANIM[type] || ANIM.heart;
    d.innerHTML = shape(type);
    d.addEventListener('animationend', function(){ if (d.parentNode) d.parentNode.removeChild(d); });
    layer.appendChild(d);
  }

  var A = {
    mount:function(el){ layer = el; },
    burst:function(type, x, y, count, spread){
      if (!layer) return;
      count = count || 1; spread = spread || 26;
      for (var i = 0; i < count; i++){
        (function(i){
          setTimeout(function(){
            spawnOne(type,
              x + (Math.random()*spread*2 - spread),
              y + (Math.random()*spread*0.6 - spread*0.3));
          }, i * 70);
        })(i);
      }
    }
  };
  return A;
})();
