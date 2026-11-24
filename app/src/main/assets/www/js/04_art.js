/* ============================================================
   PIPPO & ME — All art is code-drawn SVG in Cozy Storybook style
   Flat fills · warm dark-brown ink outlines · one cream highlight
   ============================================================ */
window.P = window.P || {};
P.art = (function(){
  var C = P.C;
  var INK = C.ink, PAP = C.paper;

  /* ---------- stage scale table ---------- */
  var SK = [
    { k:0.65, hs:1.16 },  // baby
    { k:0.72, hs:1.08 },  // toddler
    { k:0.86, hs:1.03 },  // kid
    { k:1.00, hs:1.00 }   // adult
  ];
  function stageScale(s){ return SK[Math.max(0, Math.min(3, s|0))]; }

  /* ---------- small helpers ---------- */
  function svg(vb, inner){
    return '<svg viewBox="' + vb + '" fill="none" stroke="' + INK + '" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  function icon(name, size){
    return '<svg viewBox="0 0 24 24" width="' + (size||20) + '" height="' + (size||20) + '" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------- 24x24 UI icons (vector paths only, never emoji) ---------- */
  var ICONS = {
    bottle: '<circle cx="12" cy="4.4" r="2.1" fill="'+C.sand+'"/><rect x="9.4" y="6.2" width="5.2" height="2.8" rx="1.2" fill="'+C.amber+'"/><rect x="7.6" y="9" width="8.8" height="11" rx="3.4" fill="'+C.water+'"/><path d="M9.6 13.6h4.8" stroke="'+PAP+'" stroke-width="1.6"/>',
    drop:   '<path d="M12 3 C15 8 19 11 19 15 A7 7 0 0 1 5 15 C5 11 9 8 12 3 Z" fill="'+C.water+'"/><circle cx="9.4" cy="14" r="1.5" fill="'+PAP+'" stroke="none"/>',
    moon:   '<path d="M14 3.5 A8.5 8.5 0 1 0 20.5 14.5 A7 7 0 0 1 14 3.5 Z" fill="'+C.moonc+'"/>',
    sun:    '<circle cx="12" cy="12" r="4.6" fill="'+C.amber+'"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/>',
    ball:   '<circle cx="12" cy="12" r="8.4" fill="'+C.amber+'"/><path d="M3.8 13.4 A8.4 8.4 0 0 0 20.2 13.4 L20.2 12 A8.4 8.4 0 0 1 3.8 12 Z" fill="'+C.rose+'" stroke-width="1.8"/><circle cx="12" cy="12" r="8.4" fill="none"/><path d="M4.6 9.4 Q12 15 19.4 9.4" fill="none"/>',
    cart:   '<path d="M4 6h2.6l2.2 9.4h9.4l2.2-7H8"/><circle cx="10" cy="19.4" r="1.7" fill="'+INK+'" stroke="none"/><circle cx="16.4" cy="19.4" r="1.7" fill="'+INK+'" stroke="none"/>',
    gear:   '<circle cx="12" cy="12" r="3.1"/><circle cx="12" cy="12" r="6.6"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M18.5 5.5l-1.9 1.9M7.4 16.6l-1.9 1.9"/>',
    coin:   '<circle cx="12" cy="12" r="8.4" fill="'+C.gold+'"/><circle cx="12" cy="12" r="5" stroke-dasharray="2.5 3"/><circle cx="9" cy="8.6" r="1.2" fill="'+PAP+'" stroke="none"/>',
    heart:  '<path d="M12 20 C6 15.4 3.4 12 3.4 9.2 C3.4 6.6 5.4 5 7.6 5 C9.4 5 11 6 12 7.6 C13 6 14.6 5 16.4 5 C18.6 5 20.6 6.6 20.6 9.2 C20.6 12 18 15.4 12 20 Z" fill="'+C.rose+'"/>',
    close:  '<path d="M6 6 L18 18 M18 6 L6 18" stroke-width="3"/>',
    back:   '<path d="M14.5 5 L7.5 12 L14.5 19" stroke-width="3"/>',
    soundon:'<path d="M4 9.5h3.6L13 5v14l-5.4-4.5H4Z" fill="'+C.dim+'"/><path d="M16 9q3 3 0 6"/><path d="M18.4 6.8q5 5.2 0 10.4"/>',
    soundoff:'<path d="M4 9.5h3.6L13 5v14l-5.4-4.5H4Z" fill="'+C.dim+'"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>',
    play:   '<circle cx="12" cy="12" r="8.2" fill="'+C.leaf+'"/><path d="M4.4 12 h15.2 M12 3.8 c-3 4.6 -3 11.8 0 16.4 M12 3.8 c3 4.6 3 11.8 0 16.4" stroke-width="1.6"/>',
    bath:   '<path d="M4 12h16v3.4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill="'+C.paper+'"/><path d="M7 12V6.2A2.2 2.2 0 0 1 11.4 5.4" /><circle cx="15.4" cy="7.6" r="1.5" fill="'+C.water+'"/><circle cx="18.2" cy="5.4" r="1.1" fill="'+C.water+'"/>',
    nap:    '<path d="M14 3.5 A8.5 8.5 0 1 0 20.5 14.5 A7 7 0 0 1 14 3.5 Z" fill="'+C.moonc+'"/><path d="M4.2 6.6 q1.4 1.8 0 3.6 M7 5 q1.4 1.8 0 3.6" stroke-width="1.6"/>',
    apple:  '<circle cx="12" cy="13.6" r="7.4" fill="'+C.rose+'"/><path d="M12 6.2 Q11.5 3.4 9.6 2.6" stroke-width="2.4"/><path d="M12 5.4 q4 -2.4 5.6 .2 q-3 2.6 -5.6 -.2 Z" fill="'+C.leaf+'" stroke-width="2"/><circle cx="9" cy="11" r="1.6" fill="'+PAP+'" stroke="none"/>',
    toast:  '<path d="M5 9.4 C4 5.6 7.6 3.2 12 3.2 C16.4 3.2 20 5.6 19 9.4 L18 19.6 A2 2 0 0 1 16 20.6 L8 20.6 A2 2 0 0 1 6 19.6 Z" fill="'+C.amber+'"/><path d="M8 17.4 h8" stroke="'+C.dwood+'" stroke-width="2"/><circle cx="9.6" cy="10" r="1.2" fill="'+PAP+'" stroke="none"/>',
    pot:    '<path d="M9.6 5.2q.9 1 0 2M13.4 4.4q1 1.1 0 2.2" stroke-width="1.6"/><path d="M5 10.4h14v3.8a5.6 5.6 0 0 1-5.6 5.6h-2.8A5.6 5.6 0 0 1 5 14.2Z" fill="'+C.dwood+'"/><path d="M5 12.6H2.8M21.2 12.6H19" stroke-width="2"/><ellipse cx="12" cy="10.4" rx="7" ry="1.9" fill="'+C.wood+'"/><circle cx="12" cy="7.9" r="1.4" fill="'+C.wood+'"/>',
    plush:  '<circle cx="7.4" cy="6.4" r="2.6" fill="'+C.wood+'"/><circle cx="16.6" cy="6.4" r="2.6" fill="'+C.wood+'"/><circle cx="12" cy="8.4" r="4" fill="'+C.wood+'"/><ellipse cx="12" cy="15.4" rx="5.4" ry="5" fill="'+C.dwood+'"/><ellipse cx="12" cy="7.6" rx="2.2" ry="1.6" fill="'+C.sand+'" stroke="none"/><circle cx="10.2" cy="7.4" r=".8" fill="'+INK+'" stroke="none"/><circle cx="13.8" cy="7.4" r=".8" fill="'+INK+'" stroke="none"/>',
    rattle: '<circle cx="12" cy="8" r="4.6" fill="'+C.amber+'"/><path d="M12 12.6 L12 21" stroke-width="2.6"/><circle cx="12" cy="8" r="4.6" fill="none"/><path d="M9.8 6.2 Q12 4.8 14.2 6.2" stroke="'+PAP+'" stroke-width="1.6"/>',
    gift:   '<rect x="4.6" y="10.4" width="14.8" height="9.4" rx="2.4" fill="'+C.leaf+'"/><rect x="3.4" y="7" width="17.2" height="4" rx="2" fill="'+C.leaf2+'"/><path d="M12 7 C10.8 3 6.6 3 7.4 5.6 C8 7.4 10.4 7 12 7 Z" fill="'+C.rose+'" stroke-width="1.8"/><path d="M12 7 C13.2 3 17.4 3 16.6 5.6 C16 7.4 13.6 7 12 7 Z" fill="'+C.rose+'" stroke-width="1.8"/><line x1="12" y1="7" x2="12" y2="19.8"/>',
    timer:  '<circle cx="12" cy="13.4" r="7.4" fill="'+C.paper+'"/><path d="M12 9.8v3.8l2.6 1.7"/><path d="M9.2 3h5.6"/><path d="M12 3v2.6"/>',
    book:   '<path d="M5.4 4.6H11v14H5.4z" fill="'+C.paper+'"/><path d="M13 4.6h5.6v14H13z" fill="'+C.paper+'"/><path d="M11 5.6 q1 .9 2 0 M11 5.6 q1 .9 2 0" stroke-width="1.4"/><path d="M11.6 5.2 L12 4.6 l.4 .6 v13.6 h-.8Z" fill="'+C.sand+'"/>',
    pencil: '<path d="M4.4 19.8l1.2-4 10.6-10.6 a2.1 2.1 0 0 1 3 3 L8.6 18.8Z" fill="'+C.amber+'"/><path d="M13.6 7.6 l2.9 2.9"/><path d="M4.4 19.8 l4-1.2"/>',
    spark:  '<path d="M12 3 l1.8 5.6 L19.4 10.4 L13.8 12.2 L12 17.6 L10.2 12.2 L4.6 10.4 L10.2 8.6 Z" fill="'+C.amber+'"/>',
    brain:  '<circle cx="10" cy="12" r="6.2" fill="'+C.rose+'"/><circle cx="14.4" cy="12" r="6" fill="'+C.rose+'"/><path d="M12 5.8v12.4" stroke-width="1.6"/><path d="M8.4 10.2 q1.6 1.4 0 3 M15.8 10.2 q-1.6 1.4 0 3" stroke-width="1.6"/>',
    dumbbell:'<rect x="3" y="9.8" width="3.2" height="4.4" rx="1" fill="'+C.dwood+'"/><rect x="17.8" y="9.8" width="3.2" height="4.4" rx="1" fill="'+C.dwood+'"/><rect x="6.2" y="10.9" width="11.6" height="2.2" rx="1.1"/>',
    note:   '<path d="M9.4 17.8 V6.2 L17.6 4.6 v11.4" /><circle cx="7" cy="17.8" r="2.6" fill="'+C.rose+'"/><circle cx="15.2" cy="16" r="2.6" fill="'+C.rose+'"/>',
    chat:   '<path d="M12 4.4 C17.2 4.4 20.6 6.9 20.6 10.4 C20.6 13.9 17.2 16.4 12 16.4 C6.8 16.4 3.4 13.9 3.4 10.4 C3.4 6.9 6.8 4.4 12 4.4 Z" fill="'+C.paper+'"/><path d="M8.6 15.6 L7.2 19.8 L11.6 16.6" fill="'+C.paper+'"/><circle cx="8.6" cy="10.6" r="1.15" fill="'+INK+'" stroke="none"/><circle cx="12" cy="10.6" r="1.15" fill="'+INK+'" stroke="none"/><circle cx="15.4" cy="10.6" r="1.15" fill="'+INK+'" stroke="none"/><circle cx="7.2" cy="7.6" r="1" fill="'+PAP+'" stroke="none"/>',
    quest:  '<rect x="5" y="3.6" width="14" height="17" rx="2.6" fill="'+C.paper+'"/><path d="M8.8 8.4 h6.4 M8.8 12 h6.4 M8.8 15.4 h3.4"/><path d="M14 15.6 l1.6 1.6 3 -3.2" stroke="'+C.leaf+'" stroke-width="2.4"/>',
    flame:  '<path d="M12 3.2 C13.8 6.2 17.6 8.2 17.6 12.8 A5.6 5.6 0 0 1 6.4 12.8 C6.4 9.8 8.2 8.6 9.2 6.6 C10 8.2 11 8.8 11.9 8.6 C11.4 6.8 11.3 4.9 12 3.2 Z" fill="'+C.amber+'"/>',
    glasses:'<circle cx="8.2" cy="13.4" r="4.4"/><circle cx="15.8" cy="13.4" r="4.4"/><path d="M11.2 12.8 q0.8 -0.8 1.6 0"/><path d="M3.8 12.4 L2.4 11.2 M20.2 12.4 l1.4 -1.2"/>',
    scarf:  '<path d="M6.4 6.6 q5.6 4.4 11.2 0 l1.6 3.6 q-7.2 4.8 -14.4 0Z" fill="'+C.rose+'"/><path d="M9.8 10.8 l-1.6 8.6 M14.6 10.8 l1.4 8.6" stroke="'+C.rose+'" stroke-width="2.6"/>',
    bow:    '<circle cx="12" cy="12" r="2.2" fill="'+C.rose+'"/><path d="M10.2 11 L4.4 7.6 q-2 4.4 0 8.8Z" fill="'+C.rose+'"/><path d="M13.8 11 l5.8 -3.4 q2 4.4 0 8.8Z" fill="'+C.rose+'"/>',
    flag:   '<rect x="3" y="5" width="18" height="14" rx="2.8" fill="#d95353"/><rect x="3" y="9.4" width="18" height="5.2" rx="1.1" fill="'+C.amber+'"/><rect x="3" y="5" width="18" height="14" rx="2.8" fill="none"/>',
    speaker:'<path d="M4.4 9.6 h3.2 l4.6 -3.7 v12.2 l-4.6 -3.7 H4.4 Z" fill="'+C.soft+'"/><path d="M15.4 9.2 q1.9 2.8 0 5.6 M18.2 7.2 q3.2 4.8 0 9.6"/>',
    star:   '<path d="M12 3.4 l2.6 5.3 5.8 .8 -4.2 4 1 5.8 -5.2 -2.8 -5.2 2.8 1 -5.8 -4.2 -4 5.8 -.8 Z" fill="'+C.gold+'"/>',
    plant:  '<path d="M8.4 17h7.2l-1 5H9.4z" fill="'+C.dwood+'"/><path d="M12 17 v-6"/><path d="M12 12 C8.6 12 7.6 8.6 7 8.2 C9.4 7.8 11.6 9 12 12Z" fill="'+C.leaf+'"/><path d="M12 12 C15.4 12 16.4 8.6 17 8.2 C14.6 7.8 12.4 9 12 12Z" fill="'+C.leaf2+'"/>',
    flagfr: '<rect x="3" y="5" width="18" height="14" rx="2.8" fill="#5a7fd6"/><rect x="9" y="5" width="6" height="14" fill="'+C.paper+'"/><rect x="15" y="5" width="6" height="14" rx="0" fill="#d95353"/><rect x="3" y="5" width="18" height="14" rx="2.8" fill="none"/>',
    flagde: '<rect x="3" y="5" width="18" height="14" rx="2.8" fill="'+C.gold+'"/><rect x="3" y="9.4" width="18" height="5.2" rx="1.1" fill="#d95353"/><rect x="3" y="5" width="18" height="4.4" rx="2.8" fill="#423a34"/><rect x="3" y="5" width="18" height="14" rx="2.8" fill="none"/>',
    flagit: '<rect x="3" y="5" width="18" height="14" rx="2.8" fill="#d95353"/><rect x="9" y="5" width="6" height="14" fill="'+C.paper+'"/><rect x="3" y="5" width="6" height="14" rx="0" fill="'+C.leaf+'"/><rect x="3" y="5" width="18" height="14" rx="2.8" fill="none"/>',
    plus:   '<circle cx="12" cy="12" r="8.4" fill="'+C.sky+'"/><path d="M12 7.8v8.4M7.8 12h8.4" stroke-width="2.4"/>',
    cloud:  '<path d="M6.4 16.6 A3.6 3.6 0 0 1 6.6 9.5 A4.6 4.6 0 0 1 15.4 8.2 A3.9 3.9 0 0 1 17.6 16.6 Z" fill="#ccd5de"/>',
    rain:   '<path d="M6.4 13.6 A3.6 3.6 0 0 1 6.6 6.5 A4.6 4.6 0 0 1 15.4 5.2 A3.9 3.9 0 0 1 17.6 13.6 Z" fill="#ccd5de"/><path d="M8.4 16.4 l-1.4 3 M12.4 16.4 l-1.4 3 M16.2 16.4 l-1.4 3" stroke="'+C.water+'" stroke-width="2"/>',
    snow:   '<path d="M6.4 12.6 A3.6 3.6 0 0 1 6.6 5.5 A4.6 4.6 0 0 1 15.4 4.2 A3.9 3.9 0 0 1 17.6 12.6 Z" fill="#ccd5de"/><circle cx="8.6" cy="16" r="1.3" fill="'+C.paper+'"/><circle cx="13" cy="17.6" r="1.3" fill="'+C.paper+'"/><circle cx="15.6" cy="15.4" r="1.3" fill="'+C.paper+'"/>',
    badge:  '<path d="M8.2 3.8 h7.6 l-2.2 8 h-3.2 Z" fill="'+C.rose+'" stroke-width="1.4"/><path d="M9.6 11.8 l-2.4 8.6 4.8 -2.8 4.8 2.8 -2.4 -8.6" fill="'+C.gold+'" stroke-width="1.6"/><circle cx="12" cy="8.6" r="4.6" fill="'+C.gold+'"/><circle cx="12" cy="8.6" r="2.6" fill="'+PAP+'"/>',
    house:  '<path d="M3.6 11.2 L12 4.4 L20.4 11.2"/><path d="M6.4 10.4 V19 H17.6 V10.4" fill="'+C.paper+'"/><rect x="10.4" y="13.2" width="3.2" height="5.8" fill="'+C.rose+'"/><circle cx="12" cy="9.2" r="1.5" fill="'+C.paper+'"/>'
  };

  /* ============================================================
     THE BUDDY RIG
     Local box: feet anchor (100,210). Caller wraps with placement.
     ============================================================ */
  function onesieColor(i){ return [C.rose, C.water, C.leaf, C.amber, '#b9a6e0', '#9fd6bb'][i % 6]; }
  function skinColor(i){ return ['#ffe9d2', '#f4d3a7', '#d9a97b'][i % 3]; }
  function tuftColor(i){ return ['#6d6458', C.wood, C.rose][i % 3]; }

  function tuftG(style, col){
    if (style === 1){ // curl
      return '<circle cx="100" cy="40" r="7.5" fill="'+col+'" stroke="'+INK+'" stroke-width="2.5"/>' +
        '<path d="M100 33 Q109 20 117 25" stroke="'+INK+'" stroke-width="3" fill="none"/>' +
        '<circle cx="97" cy="37" r="1.8" fill="'+PAP+'" stroke="none" opacity=".9"/>';
    }
    if (style === 2){ // poof
      return '<circle cx="88" cy="42" r="6.5" fill="'+col+'" stroke="'+INK+'" stroke-width="2.5"/>' +
        '<circle cx="112" cy="42" r="6.5" fill="'+col+'" stroke="'+INK+'" stroke-width="2.5"/>' +
        '<circle cx="100" cy="37" r="7.5" fill="'+col+'" stroke="'+INK+'" stroke-width="2.5"/>' +
        '<path d="M95 33 Q100 30.5 105 33" stroke="'+PAP+'" stroke-width="1.8" fill="none" opacity=".85"/>';
    }
    // 0 = sprout (default)
    return '<path d="M100 48 Q97 36 103 29" stroke="'+C.shade+'" stroke-width="3" fill="none"/>' +
      '<ellipse cx="112" cy="27" rx="7" ry="4" fill="'+C.leaf2+'" stroke="'+INK+'" stroke-width="2" transform="rotate(24 112 27)"/>' +
      '<ellipse cx="92" cy="25" rx="7.5" ry="4.5" fill="'+C.leaf+'" stroke="'+INK+'" stroke-width="2" transform="rotate(-22 92 25)"/>' +
      '<path d="M88 24 Q91 21 95 22" stroke="'+PAP+'" stroke-width="1.8" fill="none" opacity=".85"/>';
  }

  function eyesOpenG(style, face){
    var hide = (face === 'open') ? '' : ' style="display:none"';
    if (style === 1){ // simple dot eyes
      return '<g class="e-open"' + hide + '><g class="e-pupils">' +
        '<circle cx="87" cy="78" r="3.6" fill="'+INK+'" stroke="none"/>' +
        '<circle cx="113" cy="78" r="3.6" fill="'+INK+'" stroke="none"/>' +
        '</g><circle cx="85" cy="74.5" r="1.4" fill="'+PAP+'" stroke="none"/>' +
        '<circle cx="111" cy="74.5" r="1.4" fill="'+PAP+'" stroke="none"/></g>';
    }
    return '<g class="e-open"' + hide + '>' +
      '<circle cx="87" cy="78" r="8.5" fill="#fff" stroke="'+INK+'" stroke-width="2.6"/>' +
      '<circle cx="113" cy="78" r="8.5" fill="#fff" stroke="'+INK+'" stroke-width="2.6"/>' +
      '<g class="e-pupils">' +
        '<circle cx="87" cy="78" r="5.1" fill="'+INK+'" stroke="none"/>' +
        '<circle cx="113" cy="78" r="5.1" fill="'+INK+'" stroke="none"/>' +
        '<path d="M85 76h.4m25.6 0h.4" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>' +
      '</g>' +
      '<circle cx="84.5" cy="74.5" r="1.7" fill="#fff" stroke="none"/>' +
      '<circle cx="110.5" cy="74.5" r="1.7" fill="#fff" stroke="none"/>' +
      '</g>';
  }
  function eyesClosedG(face){
    var hide = (face === 'open') ? ' style="display:none"' : '';
    return '<g class="e-closed"' + hide + '>' +
      '<path d="M79 82 Q86 73 93 82" stroke="'+INK+'" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M107 82 Q114 73 121 82" stroke="'+INK+'" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '</g>';
  }
  /* sleepy overlay: heavy lids over the eyeballs + dark under-eye circles.
     shown when mouth === 'tired' (buddy badly needs sleep) */
  function sleepyG(skin, mouth){
    var hide = (mouth === 'tired') ? '' : ' style="display:none"';
    return '<g class="e-sleepy"' + hide + '>' +
      // heavy upper lids (skin color so they melt into the face)
      '<rect x="77.8" y="66" width="17.6" height="12.8" rx="8.6" fill="'+skin+'" stroke="none"/>' +
      '<rect x="103.8" y="66" width="17.6" height="12.8" rx="8.6" fill="'+skin+'" stroke="none"/>' +
      // lid lines (droopy half-closed eyes)
      '<path d="M78.5 79 Q87 82.5 95.5 79" stroke="'+INK+'" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M104.5 79 Q113 82.5 121.5 79" stroke="'+INK+'" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
      // dark circles
      '<path d="M80 90.5 Q87 94.5 94 90.5" stroke="'+INK+'" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".38"/>' +
      '<path d="M106 90.5 Q113 94.5 120 90.5" stroke="'+INK+'" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".38"/>' +
    '</g>';
  }

  function mouthG(mouth){
    mouth = mouth || 'smile';
    return '<g class="m-smile"' + (mouth === 'smile' ? '' : ' style="display:none"') + '><path d="M91 100 Q100 108 109 100" stroke="'+INK+'" stroke-width="3" fill="none" stroke-linecap="round"/></g>' +
      '<g class="m-open"' + (mouth === 'open' ? '' : ' style="display:none"') + '><g class="m-chew"><path d="M90 98 Q100 116 110 98 Z" fill="'+C.rose+'" stroke="'+INK+'" stroke-width="2.6"/></g></g>' +
      '<g class="m-tired"' + (mouth === 'tired' ? '' : ' style="display:none"') + '><ellipse cx="100" cy="103.5" rx="5" ry="6.5" fill="'+C.rose+'" stroke="'+INK+'" stroke-width="2.6"/></g>' +
      '<g class="m-sad"' + (mouth === 'sad' ? '' : ' style="display:none"') + '><path d="M92 105 Q100 97 108 105" stroke="'+INK+'" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  var BLUSH =
    '<ellipse cx="75" cy="95" rx="6.5" ry="4.5" fill="'+C.rose+'" stroke="none" opacity=".8"/>' +
    '<ellipse cx="125" cy="95" rx="6.5" ry="4.5" fill="'+C.rose+'" stroke="none" opacity=".8"/>';
  var TEAR =
    '<path class="tear" d="M124 90 c2.4 3.4 4 5.2 4 7.2 a4 4 0 0 1 -8 0 c0 -2 1.6 -3.8 4 -7.2 Z" ' +
      'fill="'+C.water+'" stroke="'+INK+'" stroke-width="2"/>';

  var ARM_POSES = {
    idle:  [20, -20], crib: [10, -10], feed: [20, -160], cheer: [150, -150],
    sulk:  [-6, 6],   sleep: [8, -8], bath: [14, -14], peek: [10, -10],
    work:  [38, -38]
  };

  /* ---------- wearables (Phase 2b closet) ---------- */
  function scarfG(){
    return '<g class="g-scarf">' +
      '<path d="M80 123 q20 9 40 0 q3 6 -1 9 q-19 8 -38 0 q-4 -3 -1 -9Z" fill="#d26060" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<path d="M94 132 q-3 11 -1 17 q4 3.4 7.4 -0.6 q1.2 -8 -0.8 -16Z" fill="#d26060" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M86 127 q14 5.5 28 0" stroke="' + PAP + '" stroke-width="1.6" fill="none" opacity=".55"/>' +
      '</g>';
  }
  function glassesG(){
    return '<g class="g-glasses">' +
      '<circle cx="87" cy="79" r="11.5" fill="' + PAP + '" opacity=".28" stroke="none"/>' +
      '<circle cx="113" cy="79" r="11.5" fill="' + PAP + '" opacity=".28" stroke="none"/>' +
      '<circle cx="87" cy="79" r="11.5" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="113" cy="79" r="11.5" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M98.5 77.5 q1.5 -1.8 3 0" stroke="' + INK + '" stroke-width="2.6" fill="none"/>' +
      '<path d="M75.5 77.5 L71 75.5 M124.5 77.5 l4.5 -2" stroke="' + INK + '" stroke-width="2.6" fill="none"/>' +
      '</g>';
  }
  function bowG(){
    return '<g class="g-bow" transform="translate(74 49) rotate(-14)">' +
      '<path d="M-1.6 0 L-10 -6.4 Q-13.4 0 -10 6.4Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M1.6 0 L10 -6.4 Q13.4 0 10 6.4Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="0" cy="0" r="2.8" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '</g>';
  }

  /* ---------- garden (real-lesson schoolyard) ---------- */
  var CHALK_FONT = "'Segoe UI', 'Comic Sans MS', sans-serif";

  /* split a chalk line into <=2 rows that fit the board */
  function wrapChalk(t, max){
    var words = String(t).split(' ');
    var lines = [''];
    for (var i = 0; i < words.length; i++){
      var cur = lines[lines.length - 1];
      if (!cur || (cur + ' ' + words[i]).length <= max) lines[lines.length - 1] = cur ? cur + ' ' + words[i] : words[i];
      else lines.push(words[i]);
    }
    return lines.slice(0, 2);
  }

  /* the blackboard: wood frame, night-slate face, chalk text.
     Board sits high in the scene so the bottom sheet never covers it. */
  function boardG(o){
    var b = o.board || {};
    var label = b.label || '';
    var lines = [];
    if (b.l1) lines = lines.concat(wrapChalk(b.l1, 11));
    if (b.l2) lines = lines.concat(wrapChalk(b.l2, 11));
    if (!lines.length) lines = ['¡vamos!'];
    lines = lines.slice(0, 2);
    var chalk =
      '<g transform="rotate(-1.4 240 246)">' +
      (label ? '<text x="240" y="228" text-anchor="middle" font-family="' + CHALK_FONT + '" font-size="10.5" font-weight="600" fill="' + PAP + '" opacity=".72">' + label + '</text>' : '');
    for (var i = 0; i < lines.length; i++){
      var y = lines.length === 1 ? 252 : (246 + i * 20);
      chalk += '<text x="240" y="' + y + '" text-anchor="middle" font-family="' + CHALK_FONT + '" font-size="19" font-weight="700" fill="' + PAP + '">' + lines[i] + '</text>';
    }
    chalk += '</g>';
    return chalk;
  }

  /* whole garden scene 480x600 — drawn HIGH: horizon ~320, board ~204..288,
     characters' feet ~415, so the lesson sheet at the bottom never hides them */
  function gardenG(o){
    o = o || {};
    var night = o.tod === 'night';
    var sky = '';
    // sky band
    sky += '<rect x="0" y="0" width="480" height="322" fill="' + (night ? C.night : C.sky) + '"/>';
    if (night){
      var stars = '';
      var pts = [[52,116],[110,150],[170,96],[330,112],[392,152],[432,100],[292,148],[64,196],[404,214],[214,64],[360,58]];
      for (var i = 0; i < pts.length; i++){
        stars += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + (i % 3 ? 1.8 : 2.6) + '" fill="' + PAP + '" opacity=".9" stroke="none"/>';
      }
      sky += stars + moonG(78, 104, 20) +
        '<g opacity=".9">' +
        '<circle cx="398" cy="266" r="2.2" fill="' + C.gold + '" stroke="none"/>' +
        '<circle cx="120" cy="292" r="2" fill="' + C.gold + '" stroke="none"/>' +
        '<circle cx="350" cy="316" r="2.4" fill="' + C.gold + '" stroke="none"/>' +
        '</g>';   // fireflies
    } else {
      // sun with chunky rays (only when the sky is clear)
      var clear = !o.weather || o.weather === 'sunny';
      if (clear){
        sky += '<g transform="translate(64 106)">' +
        '<g stroke="' + C.amber + '" stroke-width="4" stroke-linecap="round">' +
        '<path d="M0 -36 L0 -27 M0 27 L0 36 M-36 0 L-27 0 M27 0 L36 0 M-26 -26 L-20 -20 M20 20 L26 26 M-26 26 L-20 20 M20 -20 L26 -26"/>' +
        '</g>' +
        '<circle cx="0" cy="0" r="19" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="3"/>' +
        '<circle cx="-6" cy="-4" r="1.9" fill="' + INK + '" stroke="none"/>' +
        '<circle cx="7" cy="-4" r="1.9" fill="' + INK + '" stroke="none"/>' +
        '<path d="M-7 5 Q0 12 7 5" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '</g>';
      }
    }
    // far hills
    sky += '<path d="M-8 322 Q84 248 206 322 Z" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="3"/>' +
           '<path d="M150 322 Q280 250 430 322 L150 322 Z" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="3"/>';
    var g = '<g class="garden-scene">' + sky;
    // grass ground
    g += '<rect x="0" y="320" width="480" height="280" fill="' + C.grass + '"/>' +
      '<path d="M0 320 H480" stroke="' + INK + '" stroke-width="3"/>';
    // tree trunk
    g += '<path d="M228 322 C231 270 229 224 235 196 L251 196 C257 224 256 270 260 322 Q244 314 228 322 Z" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M242 318 C243 284 242 240 245 202" stroke="' + C.dwood + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    // canopy
    g += '<circle cx="240" cy="140" r="54" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="190" cy="162" r="40" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="292" cy="160" r="42" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="214" cy="112" r="27" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="278" cy="182" r="24" fill="' + C.shade + '" stroke="' + INK + '" stroke-width="3"/>';
    // apples
    var apples = [[196, 144], [272, 122], [246, 176]];
    for (var a = 0; a < apples.length; a++){
      g += '<circle cx="' + apples[a][0] + '" cy="' + apples[a][1] + '" r="7" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M' + apples[a][0] + ' ' + (apples[a][1] - 7) + ' q1.6 -4 4 -5" stroke="' + INK + '" stroke-width="1.8" fill="none"/>';
    }
    // ropes + board frame
    g += '<path d="M208 190 L219 206 M272 190 L261 206" stroke="' + C.dwood + '" stroke-width="4" stroke-linecap="round"/>' +
      '<g class="g-board">' +
      '<rect x="172" y="204" width="136" height="84" rx="9" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="181" y="213" width="118" height="66" rx="5" fill="' + C.night + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      boardG(o) +
      '<rect x="198" y="291" width="84" height="8" rx="4" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="206" y="288" width="13" height="5" rx="2.4" fill="' + PAP + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<rect x="224" y="288" width="12" height="5" rx="2.4" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '</g>';
    // grass tufts
    var tufts = [[62, 352], [122, 412], [380, 356], [424, 470], [86, 500], [312, 524], [210, 572]];
    for (var t = 0; t < tufts.length; t++){
      var tx = tufts[t][0], ty = tufts[t][1];
      g += '<path d="M' + tx + ' ' + ty + ' q-5 -11 -9 -13 M' + tx + ' ' + ty + ' q0 -13 0.5 -15 M' + tx + ' ' + ty + ' q5 -10 10 -12" stroke="' + C.shade + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    }
    // flowers
    var flowers = [[70, 368, C.rose], [398, 372, C.gold], [152, 420, C.amber], [330, 482, C.gold]];
    for (var f = 0; f < flowers.length; f++){
      var fx = flowers[f][0], fy2 = flowers[f][1], fc = flowers[f][2];
      g += '<g transform="translate(' + fx + ' ' + fy2 + ')">' +
        '<path d="M0 0 L0 -16" stroke="' + C.leaf + '" stroke-width="2.6" stroke-linecap="round"/>' +
        '<g fill="' + fc + '" stroke="' + INK + '" stroke-width="2">' +
        '<circle cx="0" cy="-21" r="3.6"/><circle cx="-4.6" cy="-17.4" r="3.6"/><circle cx="4.6" cy="-17.4" r="3.6"/><circle cx="-3" cy="-12" r="3.6"/><circle cx="3" cy="-12" r="3.6"/>' +
        '</g><circle cx="0" cy="-16.4" r="2.6" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="1.8"/></g>';
    }
    // butterfly (day) / extra fireflies (night)
    if (!night){
      g += '<g transform="translate(374 268) rotate(14)">' +
        '<ellipse cx="-5" cy="0" rx="5.4" ry="7" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<ellipse cx="5" cy="0" rx="5.4" ry="7" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<rect x="-1.4" y="-7" width="2.8" height="14" rx="1.4" fill="' + INK + '" stroke="none"/>' +
        '</g>';
    }
    g += '</g>';
    return g;
  }

  /* weather overlay for the garden — drawn on top of everything.
     Deterministic positions (no randomness) so the scene is stable per compose. */
  function weatherG(w){
    if (!w || w === 'sunny') return '';
    var s = '<g class="g-weather">';
    if (w === 'cloudy'){
      s += '<rect x="0" y="0" width="480" height="600" fill="' + INK + '" opacity=".045" stroke="none"/>';
    }
    if (w === 'rain'){
      s += '<rect x="0" y="0" width="480" height="600" fill="' + INK + '" opacity=".07" stroke="none"/>';
      var drops = [[36,66],[96,150],[160,50],[226,132],[296,64],[368,168],[430,84],[58,236],[140,300],[210,220],[330,268],[402,320],[80,396],[186,448],[276,386],[366,462],[120,520],[308,532]];
      for (var i = 0; i < drops.length; i++){
        var dx = drops[i][0], dy = drops[i][1];
        s += '<path d="M' + dx + ' ' + dy + ' l-6 15" stroke="' + C.water + '" stroke-width="3" stroke-linecap="round" opacity=".8"/>';
      }
      // puddles on the grass
      s += '<ellipse cx="118" cy="452" rx="34" ry="7" fill="' + C.water + '" opacity=".4" stroke="none"/>' +
        '<ellipse cx="368" cy="522" rx="42" ry="8.5" fill="' + C.water + '" opacity=".4" stroke="none"/>' +
        '<ellipse cx="240" cy="576" rx="30" ry="6" fill="' + C.water + '" opacity=".35" stroke="none"/>';
    }
    if (w === 'snow'){
      s += '<rect x="0" y="0" width="480" height="600" fill="' + PAP + '" opacity=".07" stroke="none"/>';
      var flakes = [[44,84],[104,168],[150,64],[218,150],[288,84],[352,196],[418,104],[70,262],[152,318],[236,244],[322,292],[396,340],[92,414],[196,464],[286,404],[370,478],[132,534],[318,548],[246,566],[410,560]];
      for (var j = 0; j < flakes.length; j++){
        var fx2 = flakes[j][0], fy3 = flakes[j][1];
        s += '<circle cx="' + fx2 + '" cy="' + fy3 + '" r="' + (j % 3 ? 2.6 : 3.6) + '" fill="' + PAP + '" stroke="none"/>';
      }
      // snow settling on the grass
      s += '<ellipse cx="90" cy="470" rx="52" ry="10" fill="' + PAP + '" opacity=".55" stroke="none"/>' +
        '<ellipse cx="330" cy="540" rx="66" ry="12" fill="' + PAP + '" opacity=".5" stroke="none"/>' +
        '<ellipse cx="220" cy="588" rx="80" ry="14" fill="' + PAP + '" opacity=".55" stroke="none"/>' +
        '<ellipse cx="420" cy="380" rx="44" ry="8" fill="' + PAP + '" opacity=".45" stroke="none"/>';
    }
    s += '</g>';
    return s;
  }

  function meG(x, fy, cheer){
    var skin = skinColor(1), shirt = C.water, pants = C.dwood, hair = '#5a4632';
    var s = '<g class="me-fig">';
    s += '<ellipse cx="' + x + '" cy="' + (fy + 4) + '" rx="36" ry="7.5" fill="' + INK + '" opacity=".12" stroke="none"/>';
    // legs
    s += '<rect x="' + (x - 17) + '" y="' + (fy - 31) + '" width="14" height="31" rx="6.5" fill="' + pants + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect x="' + (x + 3) + '" y="' + (fy - 31) + '" width="14" height="31" rx="6.5" fill="' + pants + '" stroke="' + INK + '" stroke-width="2.6"/>';
    // body
    var bt = fy - 102;
    s += '<rect x="' + (x - 30) + '" y="' + bt + '" width="60" height="74" rx="22" fill="' + shirt + '" stroke="' + INK + '" stroke-width="3"/>';
    // arms: idle down, cheer raised
    var la = cheer ? -148 : -16, ra = cheer ? 148 : 16;
    s += '<g transform="rotate(' + la + ' ' + (x - 26) + ' ' + (bt + 14) + ')">' +
      '<ellipse cx="' + (x - 33) + '" cy="' + (bt + 32) + '" rx="7.4" ry="15" fill="' + shirt + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<circle cx="' + (x - 33) + '" cy="' + (bt + 46) + '" r="5.4" fill="' + skin + '" stroke="' + INK + '" stroke-width="2.2"/></g>';
    s += '<g transform="rotate(' + ra + ' ' + (x + 26) + ' ' + (bt + 14) + ')">' +
      '<ellipse cx="' + (x + 33) + '" cy="' + (bt + 32) + '" rx="7.4" ry="15" fill="' + shirt + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<circle cx="' + (x + 33) + '" cy="' + (bt + 46) + '" r="5.4" fill="' + skin + '" stroke="' + INK + '" stroke-width="2.2"/></g>';
    // head
    var hy = fy - 126;
    s += '<circle cx="' + x + '" cy="' + hy + '" r="27" fill="' + skin + '" stroke="' + INK + '" stroke-width="3"/>';
    // hair cap + sweep
    s += '<path d="M' + (x - 27) + ' ' + hy + ' a27 27 0 0 1 54 0 Z" fill="' + hair + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M' + (x - 27) + ' ' + hy + ' q7 -9 14 -1" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    // face: dot eyes (closed arcs on cheer), round glasses, mouth
    if (cheer){
      s += '<path d="M' + (x - 15) + ' ' + (hy + 5) + ' q5 -6 10 0 M' + (x + 5) + ' ' + (hy + 5) + ' q5 -6 10 0" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    } else {
      s += '<circle cx="' + (x - 10) + '" cy="' + (hy + 5) + '" r="2.6" fill="' + INK + '" stroke="none"/>' +
        '<circle cx="' + (x + 10) + '" cy="' + (hy + 5) + '" r="2.6" fill="' + INK + '" stroke="none"/>';
    }
    s += '<circle cx="' + (x - 10) + '" cy="' + (hy + 5) + '" r="9" fill="' + PAP + '" opacity=".25" stroke="none"/>' +
      '<circle cx="' + (x + 10) + '" cy="' + (hy + 5) + '" r="9" fill="' + PAP + '" opacity=".25" stroke="none"/>' +
      '<circle cx="' + (x - 10) + '" cy="' + (hy + 5) + '" r="9" fill="none" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<circle cx="' + (x + 10) + '" cy="' + (hy + 5) + '" r="9" fill="none" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<path d="M' + (x - 1) + ' ' + (hy + 4) + ' q1.4 -2 2.8 0" stroke="' + INK + '" stroke-width="2.4" fill="none"/>' +
      '<path d="M' + (x - 22) + ' ' + (hy + 3) + ' l-6 -2 M' + (x + 22) + ' ' + (hy + 3) + ' l6 -2" stroke="' + INK + '" stroke-width="2.6" fill="none"/>';
    if (cheer){
      s += '<ellipse cx="' + x + '" cy="' + (hy + 17) + '" rx="4.6" ry="5.6" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.2"/>';
    } else {
      s += '<path d="M' + (x - 7) + ' ' + (hy + 15) + ' q7 7 14 0" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    }
    s += '</g>';
    return s;
  }

  /* face + mouth visibility per pose */
  function poseFace(pose){
    switch(pose){
      case 'sleep': return { face:'closed', mouth:'smile' };
      case 'cheer': return { face:'closed', mouth:'open' };
      case 'sulk':  return { face:'open', mouth:'sad' };
      case 'feed':  return { face:'open', mouth:'open' };
      case 'bath':  return { face:'closed', mouth:'smile' };
      default:      return { face:'open', mouth:'smile' };
    }
  }

  function rigG(o){
    o = o || {};
    var look = o.look || { skin:0, onesie:0, tuft:0, eyes:0 };
    var sc = stageScale(o.stage || 0);
    var k = o.k || sc.k, hs = o.hs || sc.hs;
    var pose = o.pose || 'idle';
    var pf;
    if (o.face || o.mouth){ pf = { face: o.face || 'open', mouth: o.mouth || 'smile' }; }
    else { pf = poseFace(pose); }
    var skin = skinColor(look.skin), onesie = onesieColor(look.onesie), tcol = tuftColor(look.tuft);
    var arms = ARM_POSES[pose] || ARM_POSES.idle;
    var baby = !o.stage;

    // feet target -> placement transform (composer can override with fx,fy)
    var fx = (o.fx == null ? 240 : o.fx), fy = (o.fy == null ? 520 : o.fy);
    var tx = fx - 100 * k, ty = fy - 210 * k;

    var headBase = 'translate(100 84) scale(' + hs + ') translate(-100 -84)';

    var s =
    '<g class="rig-place pose-' + pose + '" transform="translate(' + tx + ' ' + ty + ') scale(' + k + ')">' +
      '<g class="rig-body" transform="translate(100 210) translate(-100 -210)">' +
        '<ellipse class="g-shadow" cx="100" cy="213" rx="44" ry="8" fill="' + INK + '" stroke="none" opacity=".12"/>' +
        '<g class="g-armL" data-base="' + arms[0] + '" transform="rotate(' + arms[0] + ' 72 130)">' +
          '<ellipse cx="72" cy="143" rx="8.5" ry="13.5" fill="' + onesie + '" stroke="' + INK + '" stroke-width="3"/>' +
          '<circle cx="72" cy="155" r="4.5" fill="' + skin + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '</g>' +
        '<g class="g-armR" data-base="' + arms[1] + '" transform="rotate(' + arms[1] + ' 128 130)">' +
          '<ellipse cx="128" cy="143" rx="8.5" ry="13.5" fill="' + onesie + '" stroke="' + INK + '" stroke-width="3"/>' +
          '<circle cx="128" cy="155" r="4.5" fill="' + skin + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '</g>' +
        '<g class="g-bodytick">' +
          '<ellipse cx="100" cy="152" rx="31" ry="27" fill="' + onesie + '" stroke="' + INK + '" stroke-width="3"/>' +
          (baby ? '<path d="M78 148 Q72 162 77 184 Q82 202 100 201 Q122 202 125 181 Q128 163 122 148" fill="' + onesie + '" stroke="' + INK + '" stroke-width="3"/><path d="M84 133q16 9 32 0q-1 22-16 22t-16-22Z" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/><path d="M94 143q0-5 6-2q6-3 6 2q0 3-6 7q-6-4-6-7Z" fill="' + C.rose + '"/>' : '<path d="M88 144 Q100 138.5 112 144" stroke="' + PAP + '" stroke-width="3" fill="none" opacity=".8"/>') +
          '<ellipse cx="82" cy="208" rx="10.5" ry="7" fill="' + onesie + '" stroke="' + INK + '" stroke-width="3"/>' +
          '<ellipse cx="118" cy="208" rx="10.5" ry="7" fill="' + onesie + '" stroke="' + INK + '" stroke-width="3"/>' +
        '</g>' +
        (look.acc === 'scarf' ? scarfG() : '') +
        '<g class="g-head" data-hs="' + hs + '" transform="' + headBase + '">' +
          faceG(look, pf, baby) + (o.tear ? TEAR : '') +
          (pose === 'bath' ? '<path d="M64 63q-4-10 5-12q-1-10 8-9q5-10 12-3q9-1 9 7q4 8-6 9q-16-1-28 8Z" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' : '') +
          (pose === 'feed' ? mealG(o.food || 'bottle', skin) : '') +
        '</g>' + (pose === 'bath' ? '<g class="splash-drops" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2"><path d="M42 114q-12-14-7-17t7 17Zm113-4q5-19 11-16t-11 16Z"/><circle cx="32" cy="113" r="3"/><circle cx="169" cy="104" r="3.5"/></g>' : '') + '</g></g>';
    return s;
  }

  function faceG(look, pf, baby){
    var skin = skinColor(look.skin), tcol = tuftColor(look.tuft);
    return '' +
          '<circle cx="57" cy="72" r="6.5" fill="' + skin + '" stroke="' + INK + '" stroke-width="2.6"/>' +
          '<circle cx="143" cy="72" r="6.5" fill="' + skin + '" stroke="' + INK + '" stroke-width="2.6"/>' +
          (baby ? '<path d="M100 45C125 45 139 58 141 78C146 87 145 98 136 107C126 117 111 122 100 122C83 122 67 114 60 103C55 95 55 86 59 78C61 58 76 45 100 45Z"' : '<ellipse cx="100" cy="84" rx="41" ry="38"') + ' fill="' + skin + '" stroke="' + INK + '" stroke-width="3.2"/>' +
          tuftG(look.tuft, tcol) +
          '<path d="M78 66 Q88 59 98 61" stroke="' + PAP + '" stroke-width="2.5" fill="none" opacity=".55"/>' +
          BLUSH +
          (baby ? '<path d="M96 90q4 4 8 0" fill="none" stroke="' + C.wood + '" stroke-width="2" stroke-linecap="round"/><path d="M72 94l2-2m3 3 2-2m42 1 2-2m3 3 2-2" stroke="' + PAP + '" stroke-width="1.6" stroke-linecap="round"/>' : '') +
          eyesOpenG(look.eyes, pf.face) +
          eyesClosedG(pf.face) +
          sleepyG(skin, pf.mouth) +
          mouthG(pf.mouth) +
          (look.acc === 'glasses' ? glassesG() : '') +
          (look.acc === 'bow' ? bowG() : '');
  }

  function mealG(food, skin){
    var prop = food === 'bottle' ? bottleHeld() : food === 'toast' ?
      '<g transform="translate(98 100) rotate(-22) scale(.98)">' + ICONS.toast + '</g>' :
      '<path d="M106 105l20 11" stroke="' + C.dwood + '" stroke-width="4" stroke-linecap="round"/><ellipse cx="105" cy="104" rx="6" ry="3.2" fill="' + (food === 'soup' ? C.orange : C.rose) + '" stroke="' + INK + '" stroke-width="2"/>';
    return '<g class="meal-prop meal-' + food + '" stroke="' + INK + '" stroke-width="2">' + prop +
      '<ellipse cx="122" cy="116" rx="5" ry="4" fill="' + skin + '"/></g>';
  }

  function bottleHeld(){
    return '<g class="bottle" transform="translate(101 102) rotate(-63) translate(0 19)">' +
      '<ellipse cx="0" cy="-19" rx="4.2" ry="4" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="-5" y="-16" width="10" height="5" rx="2" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="-7" y="-11" width="14" height="24" rx="6" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<path d="M-4 -3q4 2 8 0v10q0 4-4 4t-4-4Z" fill="' + PAP + '" stroke="none"/>' +
    '</g>';
  }

  /* ============================================================
     ACCESSORIES (room-space groups; positions computed by caller)
     ============================================================ */
  /* storybook crib — rear halves (headboard + footboard posts, back wall, mattress) */
  function cribBack(x, y){
    var s = '<g transform="translate(' + x + ' ' + y + ')">';
    // left headboard post (tall, rounded) + finial
    s += '<rect x="-118" y="-108" width="16" height="116" rx="8" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>';
    s += '<circle cx="-110" cy="-108" r="9" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.6"/>';
    // right footboard post
    s += '<rect x="102" y="-92" width="16" height="100" rx="8" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>';
    s += '<circle cx="110" cy="-92" r="9" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.6"/>';
    // snug back wall
    s += '<rect x="-104" y="-56" width="208" height="58" rx="10" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.6"/>';
    s += '<line x1="-96" y1="-48" x2="-96" y2="-10" stroke="' + INK + '" stroke-width="1.6" opacity=".18"/>';
    s += '<line x1="96" y1="-48" x2="96" y2="-10" stroke="' + INK + '" stroke-width="1.6" opacity=".18"/>';
    // mattress
    s += '<rect x="-106" y="-8" width="212" height="16" rx="8" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2.6"/>';
    return s + '</g>';
  }
  /* storybook crib — front half (low rail, legs, optional tucked blanket) */
  function cribFront(x, y, opts){
    opts = opts || {};
    var s = '<g transform="translate(' + x + ' ' + y + ')">';
    if (opts.blanket){
      // tucked blanket over belly-to-toes, cuff folded at chest line
      s += '<rect x="-96" y="-34" width="178" height="42" rx="12" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="3"/>';
      s += '<rect x="-96" y="-34" width="178" height="12" rx="6" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="1.6"/>';
      s += '<path d="M-88 -12 Q0 -2 74 -12" stroke="' + INK + '" stroke-width="1.6" fill="none" opacity=".3"/>';
    }
    // low front rail
    s += '<rect x="-118" y="-6" width="236" height="14" rx="7" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>';
    // little feet
    s += '<rect x="-104" y="8" width="12" height="12" rx="4" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2"/>';
    s += '<rect x="92" y="8" width="12" height="12" rx="4" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2"/>';
    return s + '</g>';
  }
  /* folded blanket + pillow look for the EMPTY crib (awake) */
  function cribTidy(x, y){
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      // small pillow at left end
      '<rect x="-96" y="-26" width="62" height="18" rx="9" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M-88 -16 Q-65 -10 -44 -16" stroke="' + INK + '" stroke-width="1.4" fill="none" opacity=".25"/>' +
      // folded blanket stack at right end
      '<rect x="26" y="-26" width="66" height="12" rx="6" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="22" y="-16" width="66" height="10" rx="5" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '</g>';
  }
  /* ============================================================
     FOCUS DESK (grown-up mirror sessions)
     Desk world anchor (240, 545). Compose sandwich:
     deskBack (chair + rear legs) -> rig pose 'work' -> deskFront
     (slab covers feet + chair bottoms) -> deskProps (objects ON the tabletop)
     ============================================================ */
  function deskBack(x, y){
    var s = '<g transform="translate(' + x + ' ' + y + ')">';
    // chair back wraps behind the buddy — wings + top rail peek past the head
    s += '<rect x="-52" y="-128" width="104" height="76" rx="10" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>';
    s += '<rect x="-44" y="-119" width="88" height="56" rx="8" fill="' + C.dwood + '" stroke="none" opacity=".3"/>';
    s += '<circle cx="-46" cy="-128" r="6.5" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<circle cx="46" cy="-128" r="6.5" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>';
    // rear legs
    s += '<rect x="-114" y="-10" width="10" height="18" rx="3" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2"/>';
    s += '<rect x="104" y="-10" width="10" height="18" rx="3" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2"/>';
    return s + '</g>';
  }
  /* desk-top objects — drawn AFTER deskFront so nothing hides them;
     prop-local y 0 = the tabletop top edge (things rest on the surface) */
  function deskProps(x, y, prop){
    var s = '<g transform="translate(' + x + ' ' + y + ')">';
    if (prop === 'laptop'){
      s += '<g transform="translate(-78 -2) rotate(-4)">' +
        '<rect x="-27" y="-36" width="54" height="38" rx="5" fill="' + C.stone + '" stroke="' + INK + '" stroke-width="2.6"/>' +
        '<rect x="-23" y="-32" width="46" height="30" rx="3" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<path d="M-17 -14 h34 M-17 -23 h24 M-17 -9 h20" stroke="' + C.leaf + '" stroke-width="2.2" opacity=".75"/>' +
        '</g>' +
        '<rect x="-104" y="-2" width="52" height="8" rx="3.5" fill="' + C.stone + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M-97 1.5 h15" stroke="' + INK + '" stroke-width="1.5" opacity=".25"/>' +
        '<rect x="66" y="-16" width="10" height="16" rx="2.4" fill="' + C.stone + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M68 -19 L69.5 -26 M71.5 -18 L73 -25 M75 -19 L74 -26" stroke="' + C.amber + '" stroke-width="2"/>';
    } else if (prop === 'books'){
      // book stack cleared off the desk — just the pencil cup stays
      s += '<rect x="-40" y="-16" width="9" height="16" rx="2" fill="' + C.stone + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M-37 -20 v-4 M-34 -22 l2 -4 M-31.5 -21 v-5" stroke="' + C.amber + '" stroke-width="1.8"/>';
    } else if (prop === 'sketch'){
      s += '<g transform="translate(-80 -1) rotate(-6)">' +
        '<rect x="-32" y="-28" width="58" height="28" rx="4" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M-24 -13 q10 -12 20 -2 q8 8 18 -4" stroke="' + C.rose + '" stroke-width="2.4" fill="none"/>' +
        '</g>' +
        '<g transform="translate(80 -10) rotate(24)">' +
        '<rect x="-3.4" y="-14" width="6.8" height="24" rx="3" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M-3.4 10 L0 15 L3.4 10 Z" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.4"/>' +
        '</g>';
    } else if (prop === 'dumbbell'){
      s += '<rect x="-92" y="-8" width="26" height="10" rx="4" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<path d="M-88 -4.5 h18" stroke="' + INK + '" stroke-width="1.4" opacity=".3"/>' +
        '<rect x="68" y="-13" width="9" height="15" rx="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<rect x="92" y="-13" width="9" height="15" rx="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<rect x="77" y="-9" width="15" height="6" rx="3" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2"/>';
    } else if (prop === 'notebook'){
      s += '<g transform="translate(-80 -1) rotate(-5)">' +
        '<rect x="-30" y="-22" width="54" height="24" rx="4" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M-3 -22 v24" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M-22 -15 h15 M-20 -8 h13 M-16 -2 h10" stroke="' + C.water + '" stroke-width="2" opacity=".8"/>' +
        '</g>' +
        '<g transform="translate(74 -2)">' +
        '<path d="M-9 -3 a9 7 0 0 0 18 0 Z" fill="' + C.stone + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<path d="M9 -3 a4 5 0 0 1 5 3" stroke="' + INK + '" stroke-width="2" fill="none"/>' +
        '<ellipse cx="0" cy="-4" rx="9" ry="5.5" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<path d="M-3 -6 q3 2.5 6 0" stroke="' + PAP + '" stroke-width="1.5" fill="none"/>' +
        '</g>';
    } else if (prop === 'cookbook'){
      s += '<g transform="translate(-84 -2) rotate(-7)">' +
        '<rect x="-17" y="-20" width="34" height="28" rx="3" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="-8" y="-26" width="16" height="7" rx="2" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M-10 -10 h18 M-10 -5 h14 M-10 0 h16" stroke="' + C.water + '" stroke-width="1.8" opacity=".8"/>' +
        '</g>' +
        '<path d="M63 -4 a17 11 0 0 0 34 0 Z" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M80 -20 L70 -6" stroke="' + C.dwood + '" stroke-width="3.4" stroke-linecap="round"/>' +
        '<circle cx="66" cy="-3" r="3.2" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.8"/>';
    }
    return s + '</g>';
  }
  function deskFront(x, y){
    var s = '<g transform="translate(' + x + ' ' + y + ')">';
    // tabletop slab (covers the chair bottom edge line)
    s += '<rect x="-118" y="-62" width="236" height="13" rx="6.5" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.8"/>';
    s += '<rect x="-110" y="-59" width="220" height="4" rx="2" fill="' + PAP + '" stroke="none" opacity=".45"/>';
    // front panel + drawer
    s += '<rect x="-104" y="-49" width="208" height="57" rx="10" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.6"/>';
    s += '<rect x="-58" y="-40" width="116" height="26" rx="9" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.2"/>';
    s += '<circle cx="0" cy="-27" r="3.4" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.6"/>';
    // front feet
    s += '<rect x="-112" y="8" width="12" height="12" rx="4" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2"/>';
    s += '<rect x="100" y="8" width="12" height="12" rx="4" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2"/>';
    return s + '</g>';
  }
  /* napping buddy lying on the rug — pillow behind head, own blanket, no crib */
  function babySleepG(x, y, look){
    look = look || { skin:0, onesie:0, tuft:0 };
    var SKIN = skinColor(look.skin);
    var ONES = onesieColor(look.onesie);
    var tcol = tuftColor(look.tuft);
    var hx = x - 44, hy = y - 56;   // head center (propped on pillow)
    var s = '<g>';
    // body lying (chest sliver peeks above blanket)
    s += '<ellipse cx="' + (x + 20) + '" cy="' + (y - 11) + '" rx="46" ry="22" fill="' + ONES + '" stroke="' + INK + '" stroke-width="3"/>';
    // pillow propped behind head
    s += '<rect x="' + (x - 96) + '" y="' + (y - 64) + '" width="64" height="22" rx="10" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<path d="M' + (x - 88) + ' ' + (y - 50) + ' Q' + (x - 70) + ' ' + (y - 44) + ' ' + (x - 52) + ' ' + (y - 50) + '" stroke="' + INK + '" stroke-width="1.4" fill="none" opacity=".25"/>';
    s += '<g transform="translate(' + hx + ' ' + hy + ') rotate(-9) scale(.68) translate(-100 -84)">' +
      faceG(look, { face:'closed', mouth:'smile' }, true) + '</g><g class="sleep-quilt">';
    // own blanket: covers body from chin down, cuff folded at chest line
    s += '<rect x="' + (x - 72) + '" y="' + (y - 34) + '" width="176" height="52" rx="12" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="3"/>';
    s += '<rect x="' + (x - 72) + '" y="' + (y - 34) + '" width="176" height="11" rx="5.5" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="1.4"/>';
    s += '<path d="M' + (x - 60) + ' ' + (y - 10) + ' Q' + (x + 8) + ' ' + (y + 2) + ' ' + (x + 68) + ' ' + (y - 10) + '" stroke="' + INK + '" stroke-width="1.6" fill="none" opacity=".3"/>';
    return s + '</g></g>';
  }
  function tubBack(x, y){
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<ellipse cx="0" cy="-8" rx="86" ry="34" fill="' + C.water + '" stroke="' + INK + '" stroke-width="3"/>' +
      '</g>';
  }
  function tubFront(x, y){
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<ellipse cx="0" cy="10" rx="86" ry="32" fill="' + C.water + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M-42 4 Q0 16 42 4" stroke="' + PAP + '" stroke-width="3" fill="none" opacity=".7"/>' +
      '<circle cx="-52" cy="-12" r="10" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="-20" cy="-16" r="12" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="16" cy="-14" r="11" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="46" cy="-8" r="9" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
      '</g>';
  }
  function pillow(x, y){
    return '<g transform="translate(' + x + ' ' + y + ') rotate(-8)">' +
      '<rect x="-34" y="-13" width="68" height="26" rx="13" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M-20 -4 Q0 2 20 -4" stroke="' + PAP + '" stroke-width="2" fill="none" opacity=".8"/>' +
      '</g>';
  }
  function blanketWrap(x, y, w){
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<ellipse cx="0" cy="0" rx="' + w + '" ry="' + (w * 0.62) + '" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M' + (-w * 0.7) + ' ' + (-w * 0.16) + ' Q0 ' + (w * 0.2) + ' ' + (w * 0.7) + ' ' + (-w * 0.16) + '" stroke="' + INK + '" stroke-width="2" fill="none" opacity=".35"/>' +
      '</g>';
  }
  function plushG(){
    return '<g transform="translate(95 316)">' +
      '<circle cx="-13" cy="-26" r="7" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="13" cy="-26" r="7" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="0" cy="-18" r="16" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<ellipse cx="0" cy="4" rx="13" ry="15" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<ellipse cx="0" cy="-19" rx="7" ry="5.5" fill="' + C.sand + '" stroke="none"/>' +
      '<circle cx="-5" cy="-21" r="1.6" fill="' + INK + '" stroke="none"/><circle cx="5" cy="-21" r="1.6" fill="' + INK + '" stroke="none"/>' +
      '<path d="M-2 -15 Q0 -13 2 -15" stroke="' + INK + '" stroke-width="1.8" fill="none"/>' +
      '</g>';
  }
  function rattleG(x, y){
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<rect x="-2.6" y="-2" width="5.2" height="20" rx="2.6" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<circle cx="0" cy="-8" r="8" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M-4 -11 Q0 -13 4 -11" stroke="' + PAP + '" stroke-width="1.6" fill="none"/>' +
      '</g>';
  }
  function ballG(x, y, r){
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<circle r="' + r + '" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<path d="M' + (-r * 0.94) + ' ' + (r * 0.35) + ' A' + r + ' ' + r + ' 0 0 0 ' + (r * 0.94) + ' ' + (r * 0.35) + ' L' + (r * 0.94) + ' 0 A' + r + ' ' + r + ' 0 0 1 ' + (-r * 0.94) + ' 0 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle r="' + r + '" fill="none" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<path d="M' + (-r * 0.8) + ' ' + (-r * 0.25) + ' Q0 ' + (r * 0.4) + ' ' + (r * 0.8) + ' ' + (-r * 0.25) + '" fill="none" stroke-width="1.8"/>' +
      '<circle cx="' + (-r * 0.35) + '" cy="' + (-r * 0.4) + '" r="' + (r * 0.14) + '" fill="' + PAP + '" stroke="none"/>' +
      '</g>';
  }

  /* ---------- neighbors (Phase 6): guests who knock and come for tea.
     guestBody draws front-facing, origin = feet center; reuse the rig's
     skin palette so everyone feels like one family neighborhood. ---------- */
  function guestBody(who){
    var s = '<g stroke-linecap="round" stroke-linejoin="round">';
    if (who === 'momo'){
      var SK2 = skinColor(2);
      // shoes + legs
      s += '<ellipse cx="-11" cy="-3" rx="9" ry="4.6" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<ellipse cx="11" cy="-3" rx="9" ry="4.6" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<rect x="-14" y="-40" width="8.5" height="38" rx="4" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<rect x="5.5" y="-40" width="8.5" height="38" rx="4" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.4"/>';
      // shorts + shirt
      s += '<path d="M-17 -74 L17 -74 L20 -46 L6 -46 L0 -56 L-6 -46 L-20 -46 Z" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="2.8"/>';
      s += '<rect x="-16" y="-102" width="32" height="32" rx="9" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2.8"/>';
      s += '<path d="M-8 -100 L-8 -78 M8 -100 L8 -78" stroke="' + C.paper + '" stroke-width="2.2"/>';
      // arm raised with the shiny coin
      s += '<path d="M15 -96 Q30 -92 27 -72" fill="none" stroke="' + C.water + '" stroke-width="8"/>';
      s += '<path d="M15 -96 Q30 -92 27 -72" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-dasharray="0" opacity="0"/>';
      s += '<circle cx="27" cy="-70" r="6" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<circle cx="27" cy="-84" r="9" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="2.6"/>';
      s += '<circle cx="24" cy="-87" r="2.4" fill="' + PAP + '" stroke="none"/>';
      s += '<path d="M23 -83 l3 0 m-1.5 -1.5 l0 3" stroke="' + INK + '" stroke-width="1.4"/>';
      // other arm down
      s += '<circle cx="-17" cy="-66" r="6" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.4"/>';
      // head
      s += '<circle cx="0" cy="-126" r="28" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="3.2"/>';
      s += '<path d="M0 -150 q3 -9 -2 -15 q6 1 6 10" fill="none" stroke="' + INK + '" stroke-width="2.6"/>';  // cowlick
      s += '<circle cx="-9" cy="-128" r="2.6" fill="' + INK + '" stroke="none"/>';
      s += '<circle cx="9" cy="-128" r="2.6" fill="' + INK + '" stroke="none"/>';
      s += '<path d="M-7 -118 Q0 -111 7 -118" fill="none" stroke="' + INK + '" stroke-width="2.6"/>';
      s += '<ellipse cx="-19" cy="-120" rx="5" ry="3.4" fill="' + C.rose + '" stroke="none" opacity=".75"/>';
      s += '<ellipse cx="19" cy="-120" rx="5" ry="3.4" fill="' + C.rose + '" stroke="none" opacity=".75"/>';
      return s + '</g>';
    }
    // default: Nana Rosa — shawl, bun, glasses, cookie jar
    var SK1 = skinColor(1);
    s += '<ellipse cx="-13" cy="-4" rx="10.5" ry="5" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<ellipse cx="13" cy="-4" rx="10.5" ry="5" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.4"/>';
    // long dress
    s += '<path d="M-27 -98 L27 -98 L35 -12 Q0 -3 -35 -12 Z" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="3"/>';
    s += '<path d="M-24 -70 Q0 -62 24 -70" fill="none" stroke="' + INK + '" stroke-width="1.8" opacity=".35"/>';
    // shawl over shoulders
    s += '<path d="M-30 -96 Q0 -108 30 -96 L25 -72 Q0 -82 -25 -72 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.8"/>';
    // hands holding the cookie jar
    s += '<circle cx="-14" cy="-56" r="6.5" fill="' + SK1 + '" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<circle cx="14" cy="-56" r="6.5" fill="' + SK1 + '" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<rect x="-11" y="-76" width="22" height="24" rx="6" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.6"/>';
    s += '<rect x="-8" y="-82" width="16" height="7" rx="3.5" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.2"/>';
    // head + gray bun + glasses
    s += '<circle cx="0" cy="-128" r="29" fill="' + SK1 + '" stroke="' + INK + '" stroke-width="3.2"/>';
    s += '<circle cx="0" cy="-152" r="12" fill="' + C.stone + '" stroke="' + INK + '" stroke-width="2.8"/>';
    s += '<path d="M-25 -136 Q-30 -146 -22 -152" fill="none" stroke="' + C.stone + '" stroke-width="5"/>';
    s += '<path d="M25 -136 Q30 -146 22 -152" fill="none" stroke="' + C.stone + '" stroke-width="5"/>';
    s += '<circle cx="-10" cy="-130" r="7.5" fill="none" stroke="' + INK + '" stroke-width="2.2"/>';
    s += '<circle cx="10" cy="-130" r="7.5" fill="none" stroke="' + INK + '" stroke-width="2.2"/>';
    s += '<path d="M-2.5 -130 L2.5 -130" stroke="' + INK + '" stroke-width="2"/>';
    s += '<circle cx="-10" cy="-129" r="2.2" fill="' + INK + '" stroke="none"/>';
    s += '<circle cx="10" cy="-129" r="2.2" fill="' + INK + '" stroke="none"/>';
    s += '<path d="M-6 -116 Q0 -111 6 -116" fill="none" stroke="' + INK + '" stroke-width="2.6"/>';
    s += '<ellipse cx="-20" cy="-122" rx="5" ry="3.4" fill="' + C.rose + '" stroke="none" opacity=".75"/>';
    s += '<ellipse cx="20" cy="-122" rx="5" ry="3.4" fill="' + C.rose + '" stroke="none" opacity=".75"/>';
    return s + '</g>';
  }
  function guestG(o){
    o = o || {};
    if (o.knock){
      // bouncing "Knock!" bubble above the front door while someone waits
      return '<g transform="translate(383 200)"><g class="knock-bub">' +
        '<rect x="-36" y="-16" width="72" height="31" rx="14" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2.6"/>' +
        '<path d="M-6 15 L-13 27 L4 15.5 Z" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<text x="0" y="6" text-anchor="middle" font-family="inherit" font-size="14" font-weight="800" fill="' + INK + '" stroke="none">Knock!</text>' +
        '</g></g>';
    }
    return '<g id="guestG" transform="translate(' + (o.x == null ? 383 : o.x.toFixed(1)) + ' ' + (o.y || 528) + ')">' +
      guestBody(o.who || 'rosa') + '</g>';
  }
  function guestPortrait(who){
    return '<svg viewBox="-72 -206 144 216" width="118" height="176" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      guestBody(who) + '</svg>';
  }

  /* ============================================================
     THE HOUSE — shared pieces so every room feels like one hand-
     drawn home. Conventions: wall to y=462, warm wood floor below,
     one hallway door on the right wall (Pippo walks through it).
     ============================================================ */
  /* each room hangs its own little sign above the door */
  function doorSign(style){
    var g = '';
    if (style === 'dining'){        // apple
      g = '<circle cx="0" cy="2" r="7" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<path d="M0 -5 Q1 -9 4 -10" stroke="' + C.dwood + '" stroke-width="2" fill="none"/>' +
        '<path d="M1 -8 q5 -4 8 -1 q-4 3 -8 1 Z" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="1.4"/>';
    } else if (style === 'bath'){   // rubber duck
      g = '<ellipse cx="-2" cy="3" rx="8" ry="5.5" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<circle cx="5" cy="-3.5" r="4.5" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<path d="M9 -4 L14 -2.4 L9 -0.6 Z" fill="' + C.orange + '" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<circle cx="6" cy="-4.4" r="1" fill="' + INK + '" stroke="none"/>';
    } else if (style === 'bed'){    // moon
      g = '<circle r="8" fill="' + C.moonc + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<circle cx="3.4" cy="-3.2" r="6.4" fill="' + PAP + '" stroke="none"/>';
    } else if (style === 'study'){  // little book
      g = '<path d="M-9 4 L-9 -4 Q-4 -7 0 -4 Q4 -7 9 -4 L9 4 Q4 1 0 4 Q-4 1 -9 4 Z" fill="' + C.water + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<line x1="0" y1="-4" x2="0" y2="4" stroke="' + INK + '" stroke-width="1.2"/>';
    } else if (style === 'play'){   // bouncy ball
      g = '<circle r="7.5" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<path d="M-5 -5 Q0 0 -5 5 M5 -5 Q0 0 5 5" stroke="' + INK + '" stroke-width="1.4" fill="none"/>';
    } else {                        // heart (home)
      g = '<path d="M0 5.4 C-6.4 1.6 -8 -1 -6.6 -3.2 C-5.4 -5 -2.8 -5 -1.4 -3.2 L0 -1.6 L1.4 -3.2 C2.8 -5 5.4 -5 6.6 -3.2 C8 -1 6.4 1.6 0 5.4 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="1.8"/>';
    }
    return '<rect x="-27" y="-13" width="54" height="26" rx="7" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2.4"/>' + g;
  }
  /* the hallway door — same spot in every room (frame x 334..408 so the
     walk math holds), but every room wears its own finish and sign */
  function houseDoor(style){
    style = style || 'home';
    var frameC = (style === 'dining' || style === 'study') ? C.wood : C.dwood;
    var leafC = { home: C.wood, dining: C.sand, bath: C.paper, bed: C.wood, study: C.dwood, play: C.water }[style] || C.wood;
    // nudged a touch right so it breathes away from the room edge
    var s = '<g class="house-door" transform="translate(12 0)">';
    s += '<rect x="334" y="264" width="74" height="198" rx="8" fill="' + frameC + '" stroke="' + INK + '" stroke-width="3"/>';
    if (style === 'bed'){
      // arched bedroom door
      s += '<path d="M340 462 L340 298 Q340 270 371 270 Q402 270 402 298 L402 462 Z" fill="' + leafC + '" stroke="' + INK + '" stroke-width="2.6"/>' +
        '<path d="M350 452 L350 302 Q350 282 371 282 Q392 282 392 302 L392 452" fill="none" stroke="' + INK + '" stroke-width="1.8" opacity=".3"/>';
    } else {
      s += '<rect x="340" y="270" width="62" height="192" rx="6" fill="' + leafC + '" stroke="' + INK + '" stroke-width="2.6"/>';
      if (style === 'home' || style === 'study'){
        s += '<rect x="348" y="280" width="46" height="76" rx="4" fill="none" stroke="' + INK + '" stroke-width="1.8" opacity=".3"/>' +
          '<rect x="348" y="368" width="46" height="86" rx="4" fill="none" stroke="' + INK + '" stroke-width="1.8" opacity=".3"/>';
      } else if (style === 'dining'){
        s += '<path d="M355 276 V456 M371 276 V456 M387 276 V456" stroke="' + C.dwood + '" stroke-width="2" opacity=".55" fill="none"/>';
      } else if (style === 'bath'){
        s += '<circle cx="371" cy="312" r="13" fill="' + C.sky + '" fill-opacity=".8" stroke="' + INK + '" stroke-width="2.2"/>' +
          '<path d="M363 306 A10 10 0 0 1 371 300" stroke="' + PAP + '" stroke-width="2.4" fill="none" opacity=".9"/>' +
          '<rect x="348" y="352" width="46" height="100" rx="4" fill="none" stroke="' + INK + '" stroke-width="1.8" opacity=".3"/>';
      } else if (style === 'play'){
        s += '<path d="M340 366 Q356 358 371 366 Q386 374 402 366" stroke="' + INK + '" stroke-width="1.8" opacity=".35" fill="none"/>' +
          '<path d="M362 310 l3 6.2 6.8 1 -4.9 4.9 1.2 6.8 -6.1 -3.2 -6.1 3.2 1.2 -6.8 -4.9 -4.9 6.8 -1 Z" fill="' + PAP + '" stroke="none" opacity=".9"/>';
      }
    }
    s += '<circle cx="349" cy="362" r="3" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="1.8"/>';
    s += '<circle cx="350" cy="252" r="1.6" fill="' + INK + '" stroke="none"/>' +
      '<circle cx="392" cy="252" r="1.6" fill="' + INK + '" stroke="none"/>' +
      '<g transform="translate(371 252)">' + doorSign(style) + '</g>';
    s += '</g>';
    return s;
  }
  function cottageWalls(night){
    var rail = night ? '#b5a58c' : '#cfb698';
    var s = '<g class="cottage-walls" stroke-linejoin="round">' +
      '<path d="M0 0h480v13H0z" fill="' + rail + '"/><path d="M0 13h480m-480 4h480" fill="none" stroke="#92775f" stroke-width="2"/>';
    for (var row = 0; row < 6; row++){
      for (var col = 0; col < 10; col++){
        var x = col * 55 + (row % 2 ? 27 : 0), y = 35 + row * 59;
        s += '<g transform="translate(' + x + ' ' + y + ')" opacity=".24"><path d="M0 7q1-4 0-9" fill="none" stroke="#a29273"/><path d="M0 4q-7 0-6-5q5 0 6 5m1-3q0-5 5-6q1 4-5 6" fill="#9a9974"/><circle cy="-4" r="2.2" fill="#c48876"/></g>';
      }
    }
    s += '<path d="M0 363h480v99H0z" fill="' + (night ? '#9da69b' : '#b7c3aa') + '"/>';
    for (var panel = 16; panel < 480; panel += 50){
      s += '<path d="M' + panel + ' 369v85" stroke="#819783" stroke-width="1.5"/><path d="M' + (panel+2) + ' 369v85" stroke="#e4dfc5" opacity=".7"/>';
    }
    return s + '<path d="M0 359h480v8H0zm0 94h480v9H0z" fill="' + rail + '" stroke="#88735e" stroke-width="1.6"/></g>';
  }

  function valleyView(night, weather){
    var snow = weather === 'snow', wet = weather === 'rain';
    var peaks = night ? '#616d93' : wet ? '#99aeb9' : '#9eafc4';
    var caps = night ? '#b5bdd1' : '#faf2df';
    var trees = night ? '#375957' : '#588569', pine = night ? '#2a4948' : '#386d59';
    var s = '<svg class="window-valley" x="50" y="76" width="150" height="130" viewBox="0 0 150 130" overflow="hidden" stroke="none">';
    if (!night){
      s += '<path d="M-4 26q5-6 12-4q3-9 12-7q4-7 12-4q6 1 7 7q9-2 13 6q-26 3-56 2zm93-12q5-6 10-4q5-7 11-4q6 0 9 6q4-1 8 2Z" fill="' + (wet ? '#d3dcde' : '#fff4d9') + '"/>';
    }
    s += '<path d="M-4 73L16 52l9 5 27-38 16 19 8-10 23 28 15-20 10 10 8-11 21 30v29H-4Z" fill="' + peaks + '"/>' +
      '<path d="M33 46l19-27 14 17-10-5-5 5-3-5zm32-4 11-14 11 14-10-6-4 5-1-4zm37 11 12-17 10 10-8-3-5 4-1-3Z" fill="' + caps + '"/>' +
      '<path d="M52 20l-8 31-14 17 20-14 8-23zm24 9-3 24-10 9 17-8z" fill="' + (night ? '#74809e' : '#bac7d0') + '"/>' +
      '<path d="M-3 55q24-14 48 3t45 4q32-17 64-11v42H-3Z" fill="' + (night ? '#697e83' : '#94ae9b') + '"/>' +
      '<path d="M-4 66q26-11 51 2t47 0q28-16 61-10v38H-4Z" fill="' + (night ? '#536d70' : '#779d83') + '"/>' +
      '<path d="M-4 75q34-5 64 0t94-9v67H-4Z" fill="' + (snow ? caps : night ? '#647b67' : '#b6c885') + '"/>' +
      '<path d="M79 74q29 0 11 8t8 12q49 9 24 20l-26 17H38q7-15 43-26t-3-14q-21-4 4-11t-7-6Z" fill="' + (night ? '#7699a6' : wet ? '#92b9c3' : '#83bdcb') + '"/>' +
      '<path d="M84 82l7-2m-6 15q9 0 16 3m-17 13 13-3m-33 15 10-3" fill="none" stroke="' + (night ? '#a0b8bd' : '#e4f0da') + '" stroke-width="1.5" stroke-linecap="round"/>';
    function fir(x,y,size,color){
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + size + ')"><path d="M0 0v-12" stroke="#756753" stroke-width="2"/><path d="M0-27l-6 11h3l-6 9 5-1-5 5q9 4 18-1l-5-6 3 1-6-9h3Z" fill="' + color + '"/>' +
        (snow ? '<path d="M0-27l-4 8 4-2 3 1Z" fill="' + caps + '"/>' : '') + '</g>';
    }
    [[0,78,.83],[7,80,.65],[16,78,.9],[25,79,.65],[36,77,.48],[47,76,.35],[114,72,.36],[123,73,.52],[131,73,.59],[141,75,.84],[150,72,.6]].forEach(function(p){s += fir(p[0],p[1],p[2],trees);});
    s += '<g transform="translate(39 80)"><path d="M0 0h16v9H0z" fill="' + (night ? '#ad9780' : '#f3d7a2') + '"/><path d="M-2 0l6-6h9l5 6Z" fill="' + (night ? '#776879' : '#b4705d') + '"/><path d="M2 3h4v3H2zm8 0h3v6h-3z" fill="' + (night ? '#ffe3a1' : '#746f66') + '"/></g>' +
      '<path d="M-2 95q23-16 48-2q-17 1-32 12l-16 4zm154-13q-18-4-30 3l-10 6q27-6 40-2Z" fill="' + (night ? '#475e56' : '#86a776') + '"/>';
    s += fir(8,110,1.55,pine) + fir(20,103,.98,trees) + fir(148,109,1.42,pine);
    return s + '</svg>';
  }

  /* shared wall + floor for every room of the house */
  function houseShell(o){
    o = o || {};
    var wallC = o.wall || PAP;
    var s = '';
    s += '<rect x="0" y="0" width="480" height="462" fill="' + wallC + '"/>';
    var dots = '';
    var i;
    for (i = 0; i < 12; i++){
      var dx = 24 + (i * 97) % 440, dy = 18 + ((i * 61) % 400);
      dots += '<circle cx="' + dx + '" cy="' + dy + '" r="1.6" fill="' + INK + '" opacity=".05" stroke="none"/>';
    }
    s += dots;
    s += '<rect x="0" y="462" width="480" height="138" fill="' + C.wood + '"/>';
    s += '<line x1="0" y1="462" x2="480" y2="462" stroke="' + INK + '" stroke-width="3"/>';
    s += '<g stroke="' + C.dwood + '" stroke-width="2" opacity=".8">' +
      '<line x1="0" y1="492" x2="480" y2="492"/><line x1="0" y1="526" x2="480" y2="526"/><line x1="0" y1="562" x2="480" y2="562"/>' +
      '<line x1="120" y1="462" x2="120" y2="492"/><line x1="330" y1="492" x2="330" y2="526"/><line x1="70" y1="526" x2="70" y2="562"/><line x1="390" y1="462" x2="390" y2="492"/><line x1="240" y1="562" x2="240" y2="600"/>' +
      '</g>';
    for (i = 0; i < 9; i++){
      var px = 28 + (i * 83) % 440, py = 476 + ((i * 47) % 110);
      s += '<circle cx="' + px + '" cy="' + py + '" r="2" fill="' + INK + '" opacity=".1" stroke="none"/>';
    }
    if (o.cottage) s += cottageWalls(o.night);
    if (o.cottage){
      if (o.sunlit){
        s += '<g fill="#ffe3a0" opacity=".30"><path d="M74 275h53l90 84h-65zm61 0h60l93 84h-62zM152 369h65l42 46h-69zm75 0h63l45 46h-70Z"/></g>';
      } else if (o.night){
        s += '<path d="M57 370q62-6 95 34l30 48H2v-44Z" fill="#ffe4a2" opacity=".19"/>';
      }
      s += '<g fill="none" stroke="#926843" opacity=".56" stroke-width="1.2" stroke-linecap="round"><path d="M7 477q19-4 37-1t52-1m86 10q22-3 41-1m80-5q24 4 61-1m-346 37q26-4 45-1m260-4q22-3 41-1t32-2M18 545q27 4 47 0m305 1q26-3 47 0m-300 36q23-3 49 0t47 0m105-5q22 2 38-1"/><path d="M46 516q10-6 18-1q-7 4-18 1zm297-37q11-5 18 0q-7 3-18 0z"/></g>';
    }
    s += houseDoor(o.door);
    return s;
  }
  /* shared window (day / night sky + weather through the glass) */
  function houseWindow(o){
    var tod = o.tod || 'day';
    var style = o.style || 'home';
    var frameC = { home: C.dwood, dining: C.wood, bath: C.leaf2, play: C.dwood, bed: C.dwood, study: C.dwood }[style] || C.dwood;
    var s = '';
    s += '<rect x="38" y="64" width="174" height="154" rx="14" fill="' + frameC + '" stroke="' + INK + '" stroke-width="3"/>';
    s += '<rect x="50" y="76" width="150" height="130" rx="8" fill="' + (tod === 'night' ? C.night : C.sky) + '" stroke="' + INK + '" stroke-width="3"/>';
    if (tod === 'night'){
      s += moonG(162, 106, 14);
      s += '<g fill="' + PAP + '" stroke="none">';
      s += '<circle cx="84" cy="100" r="1.8"/><circle cx="104" cy="128" r="1.5"/><circle cx="176" cy="176" r="1.8"/><circle cx="90" cy="186" r="1.5"/><circle cx="150" cy="185" r="1.4"/>';
      s += '</g>';
      s += '<g stroke="' + INK + '" stroke-width="1.6"><path d="M112 92 v4 M110 94 h4"/><path d="M184 130 v4 M182 132 h4"/></g>';
    } else {
      if (!o.weather || o.weather === 'sunny'){
        s += sunG(164, 104, 14);
      }
    }
    var wxx = o.weather || 'sunny';
    s += valleyView(tod === 'night', wxx);
    if (wxx === 'cloudy'){
      s += '<rect x="50" y="76" width="150" height="130" rx="8" fill="' + INK + '" opacity=".05" stroke="none"/>';
    }
    if (wxx === 'rain'){
      s += '<rect x="50" y="76" width="150" height="130" rx="8" fill="' + INK + '" opacity=".08" stroke="none"/>';
      var wstreaks = [[62,90],[88,118],[140,92],[170,120],[66,158],[96,186],[146,162],[174,188]];
      for (var wsi = 0; wsi < wstreaks.length; wsi++){
        s += '<path d="M' + wstreaks[wsi][0] + ' ' + wstreaks[wsi][1] + ' l-4 9" stroke="' + C.water + '" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>';
      }
    }
    if (wxx === 'snow'){
      s += '<rect x="50" y="76" width="150" height="130" rx="8" fill="' + PAP + '" opacity=".08" stroke="none"/>';
      s += '<g fill="' + PAP + '" stroke="none">';
      var wflakes = [[66,92],[94,124],[146,98],[172,128],[72,162],[104,188],[148,168],[178,192],[120,140]];
      for (var wfi = 0; wfi < wflakes.length; wfi++){
        s += '<circle cx="' + wflakes[wfi][0] + '" cy="' + wflakes[wfi][1] + '" r="' + (wfi % 2 ? 1.8 : 2.6) + '"/>';
      }
      s += '</g>';
    }
    s += '<rect x="50" y="76" width="150" height="130" rx="2" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M125 76v130M50 90h150" fill="none" stroke="' + frameC + '" stroke-width="3"/>';
    // per-room dress: valance, curtain, bubbles, sill props
    if (style === 'dining'){
      // café curtain on a wooden rod
      s += '<line x1="30" y1="60" x2="222" y2="60" stroke="' + C.dwood + '" stroke-width="3.4" stroke-linecap="round"/>' +
        '<circle cx="30" cy="60" r="3.4" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<circle cx="222" cy="60" r="3.4" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<path d="M42 61 L212 61 L212 104 Q197 118 182 104 Q167 118 152 104 Q137 118 122 104 Q107 118 92 104 Q77 118 62 104 Q52 118 42 104 Z" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2.4"/>';
    } else if (style === 'bath'){
      // soap bubbles drifting off the glass
      s += '<g fill="' + PAP + '" stroke="' + INK + '" stroke-width="1.8" opacity=".92">' +
        '<circle cx="178" cy="172" r="7"/><circle cx="190" cy="156" r="4.6"/><circle cx="168" cy="151" r="3.2"/></g>' +
        '<path d="M174 168 a5 5 0 0 1 5 -5" stroke="' + PAP + '" stroke-width="1.6" fill="none"/>';
    } else if (style === 'study'){
      // open side curtains, tied back
      s += '<rect x="42" y="62" width="22" height="150" rx="9" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M53 70 V204" stroke="' + C.dwood + '" stroke-width="1.6" opacity=".4"/>' +
        '<rect x="190" y="62" width="22" height="150" rx="9" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M201 70 V204" stroke="' + C.dwood + '" stroke-width="1.6" opacity=".4"/>';
    } else if (style === 'home'){
      function curtain(flip){
        return '<g' + (flip ? ' transform="translate(250 0) scale(-1 1)"' : '') + '><path d="M37 61h33q-3 27-19 65q-3 24 4 70q-7 5-18 0q5-36 4-69q-7-35-4-66Z" fill="#cc8173" stroke="' + INK + '" stroke-width="1.8"/><path d="M46 65q3 28-2 56m15-56q-2 28-12 56m-1 13-3 56" fill="none" stroke="#a46059" stroke-width="1.5"/><path d="M40 125l12-3 1 5-13 3Z" fill="#e8bc6c" stroke="' + INK + '" stroke-width="1.2"/></g>';
      }
      s += curtain(false) + curtain(true) + '<path d="M31 60h187" stroke="' + C.dwood + '" stroke-width="4" stroke-linecap="round"/>';
    } else {
      var valC = { home: C.rose, play: C.gold, bed: C.water }[style] || C.rose;
      s += '<rect x="34" y="58" width="182" height="18" rx="9" fill="' + valC + '" stroke="' + INK + '" stroke-width="3"/>';
      if (style === 'bed'){
        // sleepy charms dangling from the valance
        s += '<line x1="66" y1="76" x2="66" y2="86" stroke="' + INK + '" stroke-width="1.6"/>' +
          '<path d="M66 86 l2.6 5.2 5.7 .8 -4.1 4 1 5.7 -5.2 -2.7 -5.2 2.7 1 -5.7 -4.1 -4 5.7 -.8 Z" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.4"/>' +
          '<line x1="150" y1="76" x2="150" y2="84" stroke="' + INK + '" stroke-width="1.6"/>' +
          '<path d="M150 84 l2.6 5.2 5.7 .8 -4.1 4 1 5.7 -5.2 -2.7 -5.2 2.7 1 -5.7 -4.1 -4 5.7 -.8 Z" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.4"/>';
      }
    }
    // wooden sill (play skips it — the teepee sits right below the window)
    if (style !== 'play'){
      s += '<rect x="30" y="218" width="192" height="12" rx="6" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>';
      if (style === 'dining'){
        // little herb pot on the sill
        s += '<g transform="translate(186 212)">' +
          '<path d="M-8 6 L8 6 L6 -6 L-6 -6 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2"/>' +
          '<path d="M0 -6 Q-1 -12 -5 -13 M0 -6 Q2 -12 6 -14" stroke="' + C.leaf + '" stroke-width="2.2" fill="none"/>' +
          '</g>';
      } else if (style === 'bath'){
        // soap bar
        s += '<rect x="58" y="206" width="26" height="12" rx="6" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2"/>' +
          '<path d="M63 210 q6 -3 12 0" stroke="' + PAP + '" stroke-width="1.6" fill="none"/>';
      } else if (style === 'bed'){
        // tiny nightlight moon
        s += moonG(182, 212, 7);
      } else if (style === 'study'){
        // two books + pencil cup
        s += '<rect x="148" y="202" width="16" height="16" rx="2" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="1.8"/>' +
          '<rect x="148" y="206" width="16" height="4" fill="' + PAP + '" stroke="none" opacity=".7"/>' +
          '<rect x="166" y="206" width="14" height="12" rx="2" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>' +
          '<rect x="190" y="198" width="12" height="20" rx="3" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="1.8"/>' +
          '<path d="M193 202 l6 -6 M196 203 l6 -6" stroke="' + C.gold + '" stroke-width="1.6"/>';
      }
    }
    return '<g transform="' + (style === 'home' ? 'translate(-20 -26) scale(1.59 1.29)' : 'translate(0 -14)') + '">' + s + '</g>';
  }

  /* ============================================================
     DINING ROOM — long table with a cloth skirt. Sandwich:
     diningG (room) -> rig sitting behind the table -> diningFront
     (cloth + tabletop goodies cover his feet).
     ============================================================ */
  function diningG(o){
    var tod = o.tod || 'day';
    var s = houseShell({ wall: '#f8e8de', door: 'dining' });
    s += houseWindow({ tod: tod, weather: o.weather, style: 'dining' });
    // pendant lamp over the table
    s += '<g transform="translate(240 0)">' +
      '<line x1="0" y1="0" x2="0" y2="64" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<path d="M-24 96 L24 96 L14 64 L-14 64 Z" fill="' + (tod === 'night' ? C.amber : C.sand) + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<circle cx="0" cy="102" r="5" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2"/>' +
      '</g>';
    // chair back behind the buddy (reads as a highchair for the littlest)
    s += '<g transform="translate(240 470)">' +
      '<rect x="-42" y="-120" width="84" height="130" rx="12" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<rect x="-32" y="-108" width="64" height="100" rx="9" fill="' + C.dwood + '" stroke="none" opacity=".3"/>' +
      '<circle cx="-42" cy="-120" r="7" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="42" cy="-120" r="7" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '</g>';
    // tabletop (top surface only — the cloth skirt comes after the rig,
    // so its edge crosses his chest with his little hands resting on it)
    s += '<rect x="122" y="468" width="236" height="26" rx="9" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<line x1="132" y1="481" x2="348" y2="481" stroke="' + C.dwood + '" stroke-width="1.6" opacity=".5"/>';
    // wall shelf with jars of goodies
    s += '<rect x="222" y="288" width="104" height="12" rx="5" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect x="234" y="258" width="22" height="30" rx="5" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="238" y="252" width="14" height="8" rx="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="266" y="262" width="20" height="26" rx="5" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="270" y="256" width="12" height="8" rx="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="294" y="266" width="20" height="22" rx="5" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="298" y="260" width="12" height="8" rx="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2"/>';
    // rug under the table
    s += '<ellipse cx="240" cy="572" rx="152" ry="24" fill="' + C.leaf2 + '" fill-opacity=".45" stroke="' + INK + '" stroke-width="3"/>';
    return s;
  }
  function diningFront(stage){
    var s = '';
    // long cloth skirt hanging from the tabletop: covers his feet so he
    // reads as tucked into his chair at the table
    s += '<path d="M126 494 L354 494 L348 552 Q240 562 132 552 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M150 498 L146 548 M210 498 L208 554 M270 498 L272 554 M330 498 L334 548" stroke="' + INK + '" stroke-width="1.6" opacity=".22" fill="none"/>' +
      '<rect x="122" y="488" width="236" height="14" rx="7" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="122" y="489" width="236" height="5" rx="2.5" fill="' + C.sand + '" stroke="none"/>';
    // goodies on the tabletop (clear of the buddy's head)
    s += '<g transform="translate(168 472)">' +
      '<path d="M-22 0 A22 9 0 0 0 22 0 L18 -8 L-18 -8 Z" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="-6" cy="-11" r="6" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="6" cy="-12" r="6" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="0" cy="-17" r="5" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="2"/>' +
      '</g>';
    s += '<g transform="translate(312 472)">' +
      '<ellipse cx="0" cy="0" rx="20" ry="6.5" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M-12 -2 Q0 6 12 -2" stroke="' + C.dwood + '" stroke-width="1.6" fill="none" opacity=".6"/>' +
      '</g>';
    s += '<g transform="translate(142 466)">' +
      '<rect x="-9" y="-14" width="18" height="16" rx="4" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<rect x="-5" y="-19" width="10" height="6" rx="2.4" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '</g>';
    // highchair tray only for the littlest stage
    if ((stage | 0) === 0){
      s += '<rect x="198" y="470" width="84" height="12" rx="6" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
        '<circle cx="286" cy="476" r="4" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>';
    }
    return s;
  }

  /* ============================================================
     BATHROOM — tiled wainscot, mirror, towel, rubber duck.
     Tub sandwich drawn by compose: tubBack -> rig 'bath' -> tubFront.
     ============================================================ */
  function bathroomG(o){
    var tod = o.tod || 'day';
    var s = houseShell({ wall: '#e9efe2', door: 'bath' });
    s += houseWindow({ tod: tod, weather: o.weather, style: 'bath' });
    // tiled wainscot along the bottom of the wall
    s += '<rect x="0" y="382" width="480" height="80" fill="' + C.paper + '"/>';
    s += '<line x1="0" y1="382" x2="480" y2="382" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<g stroke="' + C.dwood + '" stroke-width="1.6" opacity=".5">';
    for (var tx = 0; tx <= 480; tx += 48){ s += '<line x1="' + tx + '" y1="382" x2="' + tx + '" y2="462"/>'; }
    s += '</g>';
    // round mirror
    s += '<g transform="translate(272 128)">' +
      '<circle r="32" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle r="24" fill="' + (tod === 'night' ? C.night : C.sky) + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M-12 10 A26 26 0 0 1 -2 -20" stroke="' + PAP + '" stroke-width="3" fill="none" opacity=".8"/>' +
      '<rect x="-4" y="30" width="8" height="14" rx="3" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '</g>';
    // towel rail + towel (below the window)
    s += '<circle cx="44" cy="296" r="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<circle cx="122" cy="296" r="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<line x1="44" y1="296" x2="122" y2="296" stroke="' + C.dwood + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M64 296 L64 350 Q83 358 102 350 L102 296 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<line x1="64" y1="312" x2="102" y2="312" stroke="' + C.sand + '" stroke-width="4"/>';
    // duck + soap shelf
    s += '<rect x="228" y="222" width="96" height="11" rx="5" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<g transform="translate(254 212)">' +
      '<ellipse cx="0" cy="2" rx="11" ry="8" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="6" cy="-7" r="5.5" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M11 -7 L17 -5.4 L11 -3.6 Z" fill="' + C.orange + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<circle cx="7.4" cy="-8" r="1.3" fill="' + INK + '" stroke="none"/>' +
      '<path d="M-6 0 Q-1 4 4 1" stroke="' + C.dwood + '" stroke-width="1.6" fill="none"/>' +
      '</g>' +
      '<rect x="284" y="206" width="26" height="12" rx="6" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M290 210 q6 -3 12 0" stroke="' + PAP + '" stroke-width="1.6" fill="none"/>';
    // bath mat
    s += '<ellipse cx="240" cy="578" rx="122" ry="20" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<ellipse cx="240" cy="578" rx="92" ry="13" fill="none" stroke="' + C.water + '" stroke-width="2.2" stroke-dasharray="6 8"/>';
    return s;
  }

  /* ============================================================
     PLAY ROOM — teepee, cubby shelf, toy chest, bunting.
     ============================================================ */
  function playroomG(o){
    var s = houseShell({ wall: PAP, door: 'play' });
    s += houseWindow({ tod: o.tod || 'day', weather: o.weather, style: 'play' });
    // bunting flags (string across the top; pendants skip the window zone)
    s += '<path d="M0 46 Q240 92 480 40" stroke="' + C.dwood + '" stroke-width="2.6" fill="none"/>';
    var flagCols = [C.rose, C.water, C.gold, C.leaf];
    var flagXs = [12, 240, 292, 344, 396, 448];
    for (var fi = 0; fi < flagXs.length; fi++){
      var fy0 = 46 + 46 * (1 - Math.abs(flagXs[fi] - 240) / 240) + 3;
      s += '<path d="M' + flagXs[fi] + ' ' + fy0.toFixed(1) + ' l20 0 l-10 22 Z" fill="' + flagCols[fi % 4] + '" stroke="' + INK + '" stroke-width="2.2"/>';
    }
    // cubby shelf with toys — moved to the far left corner
    s += '<g transform="translate(-196 0)">' +
      '<rect x="216" y="248" width="112" height="132" rx="10" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<line x1="272" y1="248" x2="272" y2="380" stroke="' + INK + '" stroke-width="2"/>' +
      '<line x1="216" y1="292" x2="328" y2="292" stroke="' + INK + '" stroke-width="2"/>' +
      '<line x1="216" y1="336" x2="328" y2="336" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="228" y="270" width="16" height="16" rx="3" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="248" y="274" width="12" height="12" rx="3" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M300 262 l3.8 7.7 8.5 1.2 -6.2 6 1.5 8.5 -7.6 -4 -7.6 4 1.5 -8.5 -6.2 -6 8.5 -1.2 Z" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<circle cx="300" cy="314" r="13" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M290 310 Q300 318 310 310" stroke="' + PAP + '" stroke-width="1.6" fill="none"/>' +
      '<rect x="228" y="306" width="30" height="24" rx="5" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M234 314 h18 M234 320 h12" stroke="' + PAP + '" stroke-width="1.6" opacity=".8"/>' +
      '</g>';
    // soft play rug
    s += '<ellipse cx="248" cy="560" rx="140" ry="30" fill="' + C.water + '" fill-opacity=".38" stroke="' + INK + '" stroke-width="3"/>' +
      '<ellipse cx="248" cy="560" rx="102" ry="20" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-dasharray="7 9" opacity=".5"/>';
    return s;
  }
  function playFront(){
    return ballG(150, 516, 19) +
      '<g transform="translate(352 522)">' +
      '<rect x="-14" y="0" width="28" height="28" rx="4" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect x="-10" y="-26" width="24" height="24" rx="4" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<path d="M-10 -14 h24 M-2 -26 v24" stroke="' + PAP + '" stroke-width="1.6" opacity=".7"/>' +
      '</g>';
  }

  /* ============================================================
     BEDROOM — the crib becomes the cozy bed here, plus nightstand,
     lamp, star garland. Sandwich: bedroomG -> cribBack -> (asleep?
     babySleepG : cribTidy + rig) -> cribFront.
     ============================================================ */
  function bedroomG(o){
    var tod = o.tod || 'day';
    var s = houseShell({ wall: '#f8e8de', door: 'bed' });
    s += houseWindow({ tod: tod, weather: o.weather, style: 'bed' });
    // star garland (string across the top; stars skip the window zone)
    s += '<path d="M0 40 Q240 74 480 36" stroke="' + C.dwood + '" stroke-width="2.4" fill="none"/>';
    var gx = [16, 240, 300, 360, 420, 464];
    for (var gi = 0; gi < gx.length; gi++){
      var gy = 40 + 34 * (1 - Math.abs(gx[gi] - 240) / 240) + 6;
      s += '<path d="M' + gx[gi] + ' ' + gy.toFixed(1) + ' l3.4 6.9 7.6 1.1 -5.5 5.4 1.3 7.6 -6.8 -3.6 -6.8 3.6 1.3 -7.6 -5.5 -5.4 7.6 -1.1 Z" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.8"/>';
    }
    // ceiling pendant with pull cord — tap the little rose bead to toggle the light
    var lit = o.light !== false;
    var lx = 392;
    s += '<line x1="' + lx + '" y1="6" x2="' + lx + '" y2="60" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
    s += '<path d="M' + (lx - 9) + ' 60 L' + (lx + 9) + ' 60 L' + (lx + 26) + ' 90 L' + (lx - 26) + ' 90 Z" fill="' + (lit ? C.amber : C.dim) + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
    if (lit){
      s += '<ellipse cx="' + lx + '" cy="100" rx="30" ry="12" fill="' + C.gold + '" opacity=".3" stroke="none"/>';
      s += '<circle cx="' + lx + '" cy="95" r="5" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="2"/>';
    } else {
      s += '<circle cx="' + lx + '" cy="95" r="5" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>';
    }
    s += '<path d="M' + (lx + 22) + ' 90 q7 13 3 24" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    s += '<circle cx="' + (lx + 24) + '" cy="119" r="5.5" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.2"/>';
    // wall sticker: little cloud
    s += cloudG(242, 98, 0.5);
    // nightstand + lamp (right of the bed)
    var lampC = tod === 'night' ? C.amber : C.sand;
    s += '<rect x="288" y="396" width="46" height="66" rx="8" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<rect x="294" y="410" width="34" height="18" rx="4" fill="' + C.dwood + '" stroke="none" opacity=".35"/>' +
      '<circle cx="311" cy="419" r="2.6" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<rect x="309" y="366" width="4" height="30" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<ellipse cx="311" cy="398" rx="9" ry="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<path d="M299 366 L323 366 L317 344 L305 344 Z" fill="' + lampC + '" stroke="' + INK + '" stroke-width="2.4"/>';
    // soft rug
    s += '<ellipse cx="196" cy="578" rx="128" ry="20" fill="' + C.rose + '" fill-opacity=".4" stroke="' + INK + '" stroke-width="2.6"/>';
    return s;
  }

  /* ============================================================
     STUDY ROOM — cork board, tall bookshelf, globe. Desk sandwich
     drawn by compose (deskBack -> rig -> deskFront -> deskProps).
     ============================================================ */
  function studyRoomG(o){
    var s = houseShell({ wall: '#e9efe2', door: 'study' });
    s += houseWindow({ tod: o.tod || 'day', weather: o.weather, style: 'study' });
    // book bunting (string across the top; books skip the window zone)
    s += '<path d="M0 44 Q240 84 480 40" stroke="' + C.dwood + '" stroke-width="2.4" fill="none"/>';
    var bx = [16, 244, 300, 356, 412, 462];
    var bcols = [C.rose, C.water, C.amber, C.leaf];
    for (var bi = 0; bi < bx.length; bi++){
      var by = 44 + 40 * (1 - Math.abs(bx[bi] - 240) / 240) + 4;
      s += '<g transform="translate(' + bx[bi] + ' ' + by.toFixed(1) + ')"><rect x="-8" y="0" width="16" height="20" rx="3" fill="' + bcols[bi % 4] + '" stroke="' + INK + '" stroke-width="2"/><line x1="0" y1="2" x2="0" y2="18" stroke="' + INK + '" stroke-width="1.4" opacity=".4"/></g>';
    }
    // cork board with pinned notes (above the desk)
    s += '<rect x="142" y="248" width="128" height="88" rx="8" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="150" y="256" width="112" height="72" rx="5" fill="' + C.sand + '" stroke="none"/>' +
      '<g transform="translate(172 276) rotate(-5)"><rect x="-14" y="-16" width="28" height="34" rx="3" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="1.8"/><circle cx="0" cy="-11" r="2.2" fill="' + C.rose + '" stroke="none"/><path d="M-8 -2 h16 M-8 4 h12" stroke="' + C.water + '" stroke-width="1.8"/></g>' +
      '<g transform="translate(232 292) rotate(6)"><rect x="-13" y="-15" width="26" height="32" rx="3" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="1.8"/><circle cx="0" cy="-10" r="2.2" fill="' + C.leaf + '" stroke="none"/><path d="M-7 -1 q7 -8 14 0" stroke="' + C.rose + '" stroke-width="1.8" fill="none"/></g>';
    // tall bookshelf — moved to the left corner (by the window wall)
    s += '<g transform="translate(-260 0)">' +
      '<rect x="278" y="228" width="54" height="176" rx="8" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<line x1="280" y1="272" x2="330" y2="272" stroke="' + INK + '" stroke-width="2"/>' +
      '<line x1="280" y1="316" x2="330" y2="316" stroke="' + INK + '" stroke-width="2"/>' +
      '<line x1="280" y1="360" x2="330" y2="360" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="286" y="240" width="10" height="30" rx="2" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="298" y="244" width="9" height="26" rx="2" fill="' + C.water + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="309" y="238" width="10" height="32" rx="2" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="321" y="246" width="8" height="24" rx="2" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="286" y="300" width="30" height="8" rx="2" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="290" y="292" width="26" height="8" rx="2" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="322" y="292" width="8" height="24" rx="2" fill="' + C.water + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="288" y="332" width="9" height="28" rx="2" fill="' + C.water + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="299" y="336" width="10" height="24" rx="2" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<circle cx="318" cy="348" r="9" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="288" y="368" width="30" height="32" rx="5" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M292 374 h22 M292 384 h22" stroke="' + C.dwood + '" stroke-width="1.6" opacity=".6"/>' +
      '</g>';
    // globe on the floor (left of the desk)
    s += '<g transform="translate(62 486)">' +
      '<rect x="-16" y="18" width="32" height="10" rx="4" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M-16 12 A16 16 0 0 1 16 12" stroke="' + C.dwood + '" stroke-width="3" fill="none"/>' +
      '<circle cx="0" cy="-8" r="20" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<path d="M-10 -14 q6 -6 12 -2 q6 4 10 -2 M-14 0 q8 6 16 0" stroke="' + C.leaf + '" stroke-width="2.6" fill="none"/>' +
      '<path d="M-20 -14 A26 26 0 0 1 -8 -30" stroke="' + INK + '" stroke-width="2.2" fill="none"/>' +
      '</g>';
    // soft rug
    s += '<ellipse cx="240" cy="574" rx="136" ry="24" fill="' + C.leaf2 + '" fill-opacity=".45" stroke="' + INK + '" stroke-width="2.6"/>';
    return s;
  }

  /* ============================================================
     THE COZY SHOP — shelves of goods, counter, and a big friendly
     shopkeeper. Sandwich: shopG -> shopkeeperG -> shopCounter -> rig.
     ============================================================ */
  function shopG(o){
    var s = '';
    var i;
    // a different place: warm shoppe wall + wooden wainscot (no house door,
    // no house window — you walked out of the house and into the shop)
    s += '<rect x="0" y="0" width="480" height="462" fill="#ccdce6"/>';
    var dots = '';
    for (i = 0; i < 12; i++){
      var dx = 24 + (i * 97) % 440, dy = 18 + ((i * 61) % 400);
      dots += '<circle cx="' + dx + '" cy="' + dy + '" r="1.6" fill="' + INK + '" opacity=".05" stroke="none"/>';
    }
    s += dots;
    s += '<rect x="0" y="386" width="480" height="76" fill="' + C.sand + '"/>' +
      '<line x1="0" y1="386" x2="480" y2="386" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<g stroke="' + C.dwood + '" stroke-width="2" opacity=".45">' +
      '<line x1="48" y1="386" x2="48" y2="462"/><line x1="120" y1="386" x2="120" y2="462"/><line x1="192" y1="386" x2="192" y2="462"/><line x1="264" y1="386" x2="264" y2="462"/><line x1="336" y1="386" x2="336" y2="462"/><line x1="408" y1="386" x2="408" y2="462"/>' +
      '</g>';
    // road-gray floor (the shop floor reads as the street out front)
    s += '<rect x="0" y="462" width="480" height="138" fill="' + C.stone + '"/>' +
      '<line x1="0" y1="462" x2="480" y2="462" stroke="' + INK + '" stroke-width="3"/>' +
      '<g stroke="' + INK + '" stroke-width="2" opacity=".16">' +
      '<line x1="0" y1="496" x2="480" y2="496"/><line x1="0" y1="534" x2="480" y2="534"/><line x1="0" y1="574" x2="480" y2="574"/>' +
      '<line x1="80" y1="462" x2="80" y2="496"/><line x1="240" y1="462" x2="240" y2="496"/><line x1="400" y1="462" x2="400" y2="496"/>' +
      '<line x1="160" y1="496" x2="160" y2="534"/><line x1="320" y1="496" x2="320" y2="534"/>' +
      '<line x1="80" y1="534" x2="80" y2="574"/><line x1="240" y1="534" x2="240" y2="574"/><line x1="400" y1="534" x2="400" y2="574"/>' +
      '</g>';
    // scalloped awning across the top
    for (i = 0; i < 12; i++){
      var ax0 = i * 40, ac = (i % 2) ? C.rose : PAP;
      s += '<rect x="' + ax0 + '" y="0" width="40" height="42" fill="' + ac + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<path d="M' + ax0 + ' 42 Q' + (ax0 + 20) + ' 60 ' + (ax0 + 40) + ' 42 Z" fill="' + ac + '" stroke="' + INK + '" stroke-width="2.2"/>';
    }
    // hanging shop sign (where the hallway door used to be)
    s += '<line x1="340" y1="52" x2="340" y2="76" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect x="294" y="76" width="92" height="40" rx="10" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="318" cy="96" r="9" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M350 102 C343.6 98.2 342 95.6 343.4 93.4 C344.6 91.6 347.2 91.6 348.6 93.4 L350 95 L351.4 93.4 C352.8 91.6 355.4 91.6 356.6 93.4 C358 95.6 356.4 98.2 350 102 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="1.8"/>';
    // shelves of goods (behind the shopkeeper)
    s += '<rect x="196" y="168" width="128" height="11" rx="5" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect x="206" y="138" width="20" height="30" rx="5" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="210" y="132" width="12" height="8" rx="3" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="234" y="142" width="20" height="26" rx="5" fill="' + C.water + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="262" y="140" width="26" height="16" rx="4" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<rect x="262" y="132" width="26" height="10" rx="4" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<rect x="296" y="136" width="18" height="32" rx="9" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="200" y="252" width="128" height="11" rx="5" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<circle cx="216" cy="242" r="10" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<rect x="236" y="224" width="24" height="28" rx="5" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<rect x="268" y="228" width="22" height="24" rx="4" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M272 236 h14 M272 242 h10" stroke="' + C.water + '" stroke-width="1.8"/>' +
      '<rect x="298" y="226" width="18" height="26" rx="5" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.4"/>';
    // A-board sign on the floor by the door
    s += '<g transform="translate(392 500)">' +
      '<path d="M-30 44 L0 -34 L30 44 Z" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<path d="M-20 34 L0 -16 L20 34 Z" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="0" cy="4" r="7" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<path d="M-8 18 q8 6 16 0" stroke="' + INK + '" stroke-width="1.8" fill="none"/>' +
      '</g>';
    return s;
  }
  /* counter front — drawn after the shopkeeper so it wraps him */
  function shopCounter(){
    var s = '<g>';
    s += '<rect x="168" y="448" width="170" height="68" rx="6" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M186 460 v44 M222 460 v44 M258 460 v44 M294 460 v44" stroke="' + C.wood + '" stroke-width="2.4" opacity=".55" fill="none"/>' +
      '<rect x="160" y="516" width="186" height="26" rx="7" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="160" y="424" width="186" height="26" rx="9" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="160" y="425" width="186" height="8" rx="4" fill="' + C.sand + '" stroke="none"/>';
    s += '<g transform="translate(196 418)">' +
      '<ellipse cx="0" cy="4" rx="16" ry="5" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<circle cx="-5" cy="0" r="4" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<circle cx="4" cy="-1" r="4" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '</g>';
    s += '<g transform="translate(318 408)">' +
      '<path d="M-10 10 A10 10 0 0 1 10 10 Z" fill="' + C.gold + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<line x1="0" y1="-12" x2="0" y2="-9" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="-12" y="10" width="24" height="4" rx="2" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '</g>';
    return s + '</g>';
  }
  /* the shopkeeper: a big, kind man in an apron (pose 'idle'|'wave') */
  function shopkeeperG(x, y, pose){
    var wave = pose === 'wave';
    var SK2 = '#f4d3a7';
    var s = '<g class="shopkeeper" transform="translate(' + x + ' ' + y + ')">';
    s += '<ellipse cx="0" cy="-4" rx="52" ry="9" fill="' + INK + '" opacity=".10" stroke="none"/>';
    // big body
    s += '<ellipse cx="0" cy="-66" rx="46" ry="52" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="3"/>';
    // apron
    s += '<path d="M-33 -98 L33 -98 L37 -20 Q0 -10 -37 -20 Z" fill="' + C.sand + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect x="-18" y="-66" width="36" height="22" rx="7" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="0" cy="-94" r="4.5" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="1.8"/>';
    // chunky arms (right one waves when you buy something)
    var la = -18, ra = wave ? -142 : 18;
    s += '<g transform="rotate(' + la + ' -44 -92)"><ellipse cx="-48" cy="-62" rx="11" ry="17" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="2.8"/><circle cx="-48" cy="-46" r="6.5" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.2"/></g>';
    s += '<g transform="rotate(' + ra + ' 44 -92)"><ellipse cx="48" cy="-62" rx="11" ry="17" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="2.8"/><circle cx="48" cy="-46" r="6.5" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.2"/></g>';
    // big friendly head
    var hy = -158;
    s += '<circle cx="0" cy="' + hy + '" r="34" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="-33" cy="' + (hy + 4) + '" r="6" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="33" cy="' + (hy + 4) + '" r="6" fill="' + SK2 + '" stroke="' + INK + '" stroke-width="2.4"/>';
    // hair + little flat cap
    s += '<path d="M-33 ' + hy + ' A33 33 0 0 1 33 ' + hy + ' L33 ' + (hy - 4) + ' Q0 ' + (hy - 22) + ' -33 ' + (hy - 4) + ' Z" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<path d="M-22 ' + (hy - 22) + ' Q0 ' + (hy - 42) + ' 22 ' + (hy - 22) + ' Q0 ' + (hy - 30) + ' -22 ' + (hy - 22) + ' Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.4"/>';
    // face: happy closed eyes + blush + mustache + smile
    s += '<path d="M-17 ' + (hy + 4) + ' Q-11 ' + (hy - 4) + ' -5 ' + (hy + 4) + '" stroke="' + INK + '" stroke-width="2.6" fill="none"/>' +
      '<path d="M5 ' + (hy + 4) + ' Q11 ' + (hy - 4) + ' 17 ' + (hy + 4) + '" stroke="' + INK + '" stroke-width="2.6" fill="none"/>' +
      '<ellipse cx="-20" cy="' + (hy + 14) + '" rx="5" ry="3.4" fill="' + C.rose + '" stroke="none" opacity=".7"/>' +
      '<ellipse cx="20" cy="' + (hy + 14) + '" rx="5" ry="3.4" fill="' + C.rose + '" stroke="none" opacity=".7"/>' +
      '<circle cx="0" cy="' + (hy + 12) + '" r="3.4" fill="' + C.dwood + '" stroke="none" opacity=".55"/>' +
      '<path d="M-11 ' + (hy + 20) + ' Q-6 ' + (hy + 15) + ' 0 ' + (hy + 20) + ' Q6 ' + (hy + 15) + ' 11 ' + (hy + 20) + '" stroke="' + C.wood + '" stroke-width="3.4" fill="none"/>' +
      '<path d="M-7 ' + (hy + 28) + ' Q0 ' + (hy + 34) + ' 7 ' + (hy + 28) + '" stroke="' + INK + '" stroke-width="2.6" fill="none"/>';
    return s + '</g>';
  }

  /* ---------- room scene ---------- */
  function cloudG(x, y, s){
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + PAP + '" stroke="' + INK + '" stroke-width="3">' +
      '<path d="M-38 8 C-46 -8 -32 -22 -18 -18 C-14 -30 6 -34 14 -24 C28 -30 42 -18 36 -4 C44 0 42 12 32 12 L-28 12 C-34 12 -37 10 -38 8 Z" stroke-linejoin="round"/>' +
      '</g>';
  }
  function sunG(x, y, r){
    var s = '<g transform="translate(' + x + ' ' + y + ')">' +
      '<circle r="' + r + '" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.6"/>';
    for (var i = 0; i < 8; i++){
      var a = i * Math.PI / 4, c = Math.cos(a), si = Math.sin(a);
      s += '<line x1="' + (c * (r + 4)).toFixed(1) + '" y1="' + (si * (r + 4)).toFixed(1) +
           '" x2="' + (c * (r + 10)).toFixed(1) + '" y2="' + (si * (r + 10)).toFixed(1) + '" stroke-width="2.6"/>';
    }
    return s + '</g>';
  }
  function moonG(x, y, r){
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<circle r="' + r + '" fill="' + C.moonc + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<circle cx="' + (r * 0.42) + '" cy="' + (-r * 0.38) + '" r="' + (r * 0.82) + '" fill="' + C.night + '" stroke="none"/>' +
      '</g>';
  }

  var WALLS = [PAP, '#f8e8de', '#e9efe2'];
  var RUGS = [
    { f: C.sand, ring: C.leaf },
    { f: '#f5d9dc', ring: C.rose },
    { f: '#dcecdf', ring: C.leaf2 },
    { f: '#dbe7f2', ring: C.water }
  ];
  /* the picture frame (photo frame) — hangs on the wall of the room it
     was placed in. Spots are chosen per room so nothing overlaps. */
  var POSTER_SPOT = {
    home:   [378, 194, -4],
    dining: [384, 116,  3],
    bath:   [388, 116, -3],
    play:   [376, 128,  3],
    bed:    [330, 132, -4],
    study:  [400, 124,  3]
  };
  function posterG(idx, room){
    var sp = POSTER_SPOT[room] || POSTER_SPOT.home;
    var poster = (idx || 0) % 3;
    return '<g transform="translate(' + sp[0] + ' ' + sp[1] + ') rotate(' + sp[2] + ')">' +
      '<rect x="-30" y="-24" width="60" height="48" rx="8" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="-23" y="-17" width="46" height="34" rx="4" fill="' + C.dim + '" stroke="' + INK + '" stroke-width="2"/>' +
      (poster === 1
        ? '<path d="M0 9 C-13 0 -10 -13 0 -6 C10 -13 13 0 0 9 Z" fill="' + C.rose + '" stroke="' + INK + '" stroke-width="2.2"/>'
        : (poster === 2
          ? moonG(0, 0, 8.5) + '<g fill="' + INK + '" stroke="none"><circle cx="10" cy="-8" r="1.6"/><circle cx="12" cy="6" r="1.4"/><circle cx="-11" cy="7" r="1.5"/></g>'
          : sunPathCenter())) +
      '</g>';
  }
  function roomG(o){
    o = o || {};
    var tod = o.tod || 'day';
    var owned = o.owned || {};
    var room = o.room || {};
    var wallC = WALLS[(room.wall || 0) % WALLS.length];
    var rug = RUGS[(room.rug || 0) % RUGS.length];
    var s = '';

    // wall + floor + hallway door, then the window (shared house pieces)
    s += houseShell({ wall: wallC, cottage:true, night:tod === 'night', sunlit:tod !== 'night' && (!o.weather || o.weather === 'sunny') }) + houseWindow(o);
    s += '<g transform="translate(240 320) rotate(4)" stroke-linecap="round"><path d="M-15-21l15-12 15 12" fill="none" stroke="#947453" stroke-width="1.7"/><rect x="-21" y="-23" width="42" height="47" rx="3" fill="#ae845f" stroke="' + INK + '" stroke-width="2"/><rect x="-16" y="-18" width="32" height="37" fill="#f4e9cb"/><path d="M-5 14q10-12 6-24" fill="none" stroke="#617c63" stroke-width="1.7"/><path d="M-2 6q-8-1-8-9q7 1 8 9m3-5q1-8 9-10q-1 7-9 10" fill="#86a07c"/><path d="M1-8q-11-3-6-7q3-2 6 3q0-7 4-6q5 1 0 7q7-3 8 1q0 5-12 2" fill="#ce887d"/></g>';

    // picture frame w/ doodle poster (shop-swappable, placed per room)
    if ((o.posterRoom || 'home') === 'home') s += posterG(room.poster, 'home');

    // wall clock with REAL time hands
    var hr = o.hour == null ? 10 : o.hour, mn = o.minute == null ? 0 : o.minute;
    var handA = ((hr % 12) * 30 + mn * 0.5);
    var minA = mn * 6;
    s += '<g transform="translate(404 112)">' +
      '<circle r="27" fill="' + PAP + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle r="2.6" fill="' + INK + '" stroke="none"/>' +
      '<line x1="0" y1="-3" x2="0" y2="-15" stroke="' + INK + '" stroke-width="3.4" transform="rotate(' + handA + ')"/>' +
      '<line x1="0" y1="-4" x2="0" y2="-21" stroke="' + INK + '" stroke-width="2.2" transform="rotate(' + minA + ')"/>' +
      '<circle cx="0" cy="-19" r="1.6" fill="' + INK + '" stroke="none"/>' +
      '<circle cx="19" cy="0" r="1.6" fill="' + INK + '" stroke="none"/><circle cx="0" cy="19" r="1.6" fill="' + INK + '" stroke="none"/><circle cx="-19" cy="0" r="1.6" fill="' + INK + '" stroke="none"/>' +
      '</g>';

    // shelf + plush / books + rattle
    s += '<rect x="40" y="330" width="118" height="13" rx="5" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.6"/>';
    if (owned.plush){ s += plushG(); }
    else {
      s += '<rect x="62" y="304" width="42" height="26" rx="5" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="2.6"/>' +
           '<rect x="72" y="312" width="42" height="18" rx="4" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2.6"/>' +
           '<line x1="80" y1="312" x2="80" y2="330" stroke="' + INK + '" stroke-width="1.8"/>';
    }
    if (owned.rattle){ s += rattleG(140, 322); }

    // plant (sits on the floor beside the hallway door)
    s += '<g transform="translate(434 452)">' +
      '<path d="M0 -52 q-14 -10 -20 4 q16 2 20 -4 Z" fill="' + C.leaf + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M0 -52 q14 -10 20 4 q-16 2 -20 -4 Z" fill="' + C.leaf2 + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M0 -48 q-2 12 0 22" fill="none" stroke="' + C.shade + '" stroke-width="2.6"/>' +
      '<path d="M-20 -26 L20 -26 L14 8 Q0 14 -14 8 Z" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<path d="M-14 -8 q14 5 28 0" stroke="' + PAP + '" stroke-width="2" fill="none" opacity=".7"/>' +
      '</g>';

    // rug (shop-swappable palette)
    s += '<ellipse cx="240" cy="528" rx="146" ry="44" fill="' + rug.f + '" stroke="' + INK + '" stroke-width="3"/>';
    s += '<ellipse cx="240" cy="528" rx="106" ry="30" fill="none" stroke="' + rug.ring + '" stroke-width="2.4" stroke-dasharray="7 9" opacity=".85"/>';

    if (room.noteBlanket){
      var cloth = room.noteBlanket === 'meadow' ? C.leaf : C.rose;
      s += '<g transform="translate(310 505) skewX(-16)"><rect width="73" height="24" rx="4" fill="' + cloth + '" stroke="' + INK + '" stroke-width="2.5"/><path d="M8 6h57M8 18h57M14 3v18M59 3v18" fill="none" stroke="' + PAP + '" stroke-width="2"/></g>';
    }
    // lamp (amber shade at night)
    s += '<g transform="translate(52 430)">' +
      '<ellipse cx="0" cy="36" rx="16" ry="5" fill="' + C.dwood + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect x="-2.6" y="-18" width="5.2" height="52" fill="' + C.wood + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M-16 -18 L16 -18 L10 -44 L-10 -44 Z" fill="' + (tod === 'night' ? C.amber : C.sand) + '" stroke="' + INK + '" stroke-width="2.8"/>' +
      '<path d="M-6 -38 Q0 -40 6 -38" stroke="' + PAP + '" stroke-width="1.6" fill="none" opacity=".8"/>' +
      '</g>';

    if (owned.ball){ s += ballG(84, 500, 16); }
    return s;
  }
  function sunPathCenter(){
    return '<g transform="translate(0 0)"><circle r="7" fill="' + C.amber + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<line x1="0" y1="-12" x2="0" y2="-9" stroke-width="2"/><line x1="0" y1="12" x2="0" y2="9" stroke-width="2"/>' +
      '<line x1="-12" y1="0" x2="-9" y2="0" stroke-width="2"/><line x1="12" y1="0" x2="9" y2="0" stroke-width="2"/>' +
      '<line x1="-8.5" y1="-8.5" x2="-6.4" y2="-6.4" stroke-width="2"/><line x1="8.5" y1="8.5" x2="6.4" y2="6.4" stroke-width="2"/>' +
      '<line x1="8.5" y1="-8.5" x2="6.4" y2="-6.4" stroke-width="2"/><line x1="-8.5" y1="8.5" x2="-6.4" y2="6.4" stroke-width="2"/></g>';
  }

  /* ---------- stork scene (adoption intro) ---------- */
  function storkG(t){
    var s = '<g stroke="' + INK + '" stroke-linecap="round" stroke-linejoin="round">';
    s += '<circle cx="46" cy="52" r="1.8" fill="' + INK + '" stroke="none" opacity=".12"/>' +
         '<circle cx="300" cy="40" r="2.2" fill="' + INK + '" stroke="none" opacity=".12"/>' +
         '<circle cx="72" cy="200" r="2" fill="' + INK + '" stroke="none" opacity=".12"/>' +
         '<circle cx="286" cy="216" r="1.6" fill="' + INK + '" stroke="none" opacity=".12"/>' +
         '<circle cx="240" cy="150" r="1.8" fill="' + INK + '" stroke="none" opacity=".12"/>' +
         '<circle cx="30" cy="140" r="1.6" fill="' + INK + '" stroke="none" opacity=".12"/>';
    s += cloudG(256, 74, 0.5);
    s += cloudG(56, 96, 0.36);
    // legs (ink line then paper line = outlined tube)
    s += '<path d="M120 148 L142 208 M148 152 L156 206" stroke-width="12" fill="none"/>';
    s += '<path d="M120 148 L142 208 M148 152 L156 206" stroke="' + PAP + '" stroke-width="7" fill="none"/>';
    // tail
    s += '<path d="M108 142 q-22 2 -30 18 q16 6 30 -2 Z" fill="' + PAP + '" stroke-width="3"/>';
    s += '<path d="M106 154 q-16 6 -18 18 q14 2 22 -8 Z" fill="' + PAP + '" stroke-width="3"/>';
    // body
    s += '<ellipse cx="160" cy="128" rx="46" ry="31" fill="' + PAP + '" stroke-width="3.5"/>';
    s += '<path d="M136 104 Q166 96 192 112" stroke-width="3" fill="none" opacity=".5"/>';
    // wing
    s += '<path d="M128 118 Q104 96 120 84 Q146 92 156 110 Z" fill="' + PAP + '" stroke-width="3"/>';
    s += '<path d="M126 112 Q112 100 120 92" stroke-width="2" fill="none"/>';
    // neck (tube) + head
    s += '<path d="M196 108 Q214 88 206 70" stroke-width="13" fill="none"/>';
    s += '<path d="M196 108 Q214 88 206 70" stroke="' + PAP + '" stroke-width="8" fill="none"/>';
    s += '<circle cx="206" cy="66" r="14" fill="' + PAP + '" stroke-width="3"/>';
    s += '<circle cx="210" cy="62" r="2.2" fill="' + INK + '" stroke="none"/>';
    // beak (holds bundle strings)
    s += '<path d="M218 62 L252 70 L220 78 Z" fill="' + C.orange + '" stroke-width="2.5"/>';
    s += '<path d="M212 80 Q190 120 160 186" stroke="' + INK + '" stroke-width="2" fill="none" stroke-dasharray="4 5"/>';
    // bundle
    s += '<g transform="translate(158 208)">' +
      '<ellipse rx="30" ry="24" fill="' + C.sand + '" stroke-width="3"/>' +
      '<path d="M-26 -6 Q0 4 26 -6" stroke-width="2" fill="none" opacity=".35"/>' +
      '<circle cy="-24" r="6" fill="' + C.rose + '" stroke-width="2.6"/>' +
      '<path d="M-6 -28 Q-16 -40 -4 -34 Z" fill="' + C.rose + '" stroke-width="2.4"/>' +
      '<path d="M6 -28 Q16 -40 4 -34 Z" fill="' + C.rose + '" stroke-width="2.4"/>' +
      '<path d="M-14 -12 Q0 -6 14 -12" stroke="' + PAP + '" stroke-width="2" fill="none" opacity=".8"/>' +
      '</g>';
    return s + '</g>';
  }

  /* mini face for peekaboo minigame */
  function faceMini(look){
    look = look || {};
    return '<g transform="scale(.77) translate(-100 -80)">' + faceG(look, { face:'open', mouth:'smile' }, true) + '</g>';
  }

  /* bubble sprite for bath minigame */
  function bubbleSprite(r){
    return '<svg viewBox="-20 -20 40 40" width="' + (r * 2) + '" height="' + (r * 2) + '">' +
      '<circle r="' + (r - 2.5) + '" fill="rgba(126,200,227,.5)" stroke="#423a34" stroke-width="2.5"/>' +
      '<ellipse cx="' + (-r * 0.28) + '" cy="' + (-r * 0.3) + '" rx="' + (r * 0.18) + '" ry="' + (r * 0.13) + '" fill="#fdf8e7"/>' +
      '</svg>';
  }

  P.art = {
    stageScale: stageScale,
    svg: svg,
    icon: icon,
    rigG: rigG,
    cribBack: cribBack, cribFront: cribFront, cribTidy: cribTidy, babySleepG: babySleepG,
    sleepyG: sleepyG,
    deskBack: deskBack, deskFront: deskFront, deskProps: deskProps,
    gardenG: gardenG, meG: meG, wrapChalk: wrapChalk, weatherG: weatherG,
    tubBack: tubBack, tubFront: tubFront,
    pillow: pillow, blanketWrap: blanketWrap,
    ballG: ballG,
    roomG: roomG,
    posterG: posterG,
    houseShell: houseShell, houseWindow: houseWindow, houseDoor: houseDoor,
    diningG: diningG, diningFront: diningFront,
    bathroomG: bathroomG,
    playroomG: playroomG, playFront: playFront,
    bedroomG: bedroomG,
    studyRoomG: studyRoomG,
    shopG: shopG, shopCounter: shopCounter, shopkeeperG: shopkeeperG,
    guestG: guestG, guestPortrait: guestPortrait,
    storkG: storkG,
    faceMini: faceMini,
    bubbleSprite: bubbleSprite,
    onesieColor: onesieColor, skinColor: skinColor, tuftColor: tuftColor,
    rugPalette: function(i){ return RUGS[i % RUGS.length]; },
    wallPalette: function(i){ return WALLS[i % WALLS.length]; },
    tuftPreview: function(i){ return tuftG(i, tuftColor(1)); }
  };
  return P.art;
})();
