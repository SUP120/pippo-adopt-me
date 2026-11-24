/* Game data — foods, toys, names. Expands in Phase 2+ (clothes, professions, skills). */
window.P = window.P || {};
P.data = (function(){
  var FOODS = [
    { id:'bottle',  name:'Milk Bottle',  cost:8,  hunger:45, mood:4,  desc:'Warm and cozy. Baby approved.' },
    { id:'mash',    name:'Fruit Mash',   cost:12, hunger:60, mood:6,  desc:'Squished banana-berry yum.' },
    { id:'toast',   name:'Honey Toast',  cost:16, hunger:75, mood:8,  desc:'Extra special treat.' },
    { id:'soup',    name:'Home Soup',    cost:0,  hunger:80, mood:14, buff:'warm', buffH:5, desc:'Cooked with love. Warm belly: hunger drains 30% slower for 5 hours.' }
  ];
  var TOYS = [
    { id:'rattle', name:'Wooden Rattle', cost:15, desc:'Playtime gets +2 mood.' },
    { id:'ball',   name:'Sunny Ball',    cost:25, desc:'Playtime gets +3 mood.' },
    { id:'plush',  name:'Beddy Bear',    cost:30, desc:'Mood never falls under 30.' }
  ];

  var NAMES = ['Pippo','Mimo','Bibi','Toto','Lulu','Nana','Coco'];

  /* Professions (Phase 2): the grown-up mirrors YOUR real/sdream life.
     prop = desk item drawn during focus; axes = brain-stat gains per 25 focus minutes. */
  var PROFESSIONS = [
    { id:'student',      name:'Student',      prop:'books',    axes:{ learn:2, focus:1 } },
    { id:'youtuber',     name:'YouTuber',     prop:'laptop',   axes:{ create:2, care:1 } },
    { id:'developer',    name:'Developer',    prop:'laptop',   axes:{ focus:2, learn:1 } },
    { id:'artist',       name:'Artist',       prop:'sketch',   axes:{ create:2, learn:1 } },
    { id:'musician',     name:'Musician',     prop:'notebook', axes:{ create:2, focus:1 } },
    { id:'athlete',      name:'Athlete',      prop:'dumbbell', axes:{ move:2, focus:1 } },
    { id:'entrepreneur', name:'Entrepreneur', prop:'laptop',   axes:{ focus:2, care:1 } },
    { id:'chef',         name:'Chef',         prop:'cookbook', axes:{ care:2, create:1 } },
    { id:'doctor',       name:'Doctor',       prop:'books',    axes:{ care:2, learn:1 } },
    { id:'designer',     name:'Designer',     prop:'sketch',   axes:{ create:2, focus:1 } },
    { id:'teacher',      name:'Teacher',      prop:'books',    axes:{ care:2, learn:1 } },
    { id:'custom',       name:'Custom\u2026',  prop:'laptop',   axes:{ focus:2, learn:1 }, custom:true }
  ];
  var AXES = [
    { id:'focus',  name:'Focus',  icon:'timer',   tint:'water' },
    { id:'learn',  name:'Learn',  icon:'book',    tint:'sand' },
    { id:'create', name:'Create', icon:'pencil',  tint:'amber' },
    { id:'move',   name:'Move',   icon:'dumbbell',tint:'leaf' },
    { id:'care',   name:'Care',   icon:'heart',   tint:'rose' }
  ];

  /* Daily quests (Phase 2b): stat = S.daily counter key. Auto-claims on completion. */
  var QUESTS = [
    { id:'feed',  name:'Fill the tummy',      target:3, icon:'bottle',  rew:8,  stat:'feedCount' },
    { id:'cook',  name:'Cook a fresh meal',   target:1, icon:'pot',     rew:8,  stat:'cooked' },
    { id:'bath',  name:'Squeaky clean',       target:1, icon:'bath',    rew:8,  stat:'bathCount' },
    { id:'play',  name:'Playtime together',   target:1, icon:'play',    rew:8,  stat:'playCount' },
    { id:'visit', name:'Welcome a friend',    target:1, icon:'house',   rew:10, stat:'visitDone' },
    { id:'focus', name:'One deep-focus sprint', target:1, icon:'timer', rew:14, stat:'focusDone' },
    { id:'pet',   name:'Five gentle pats',    target:5, icon:'heart',   rew:6,  stat:'petCount' },
    { id:'bed',   name:'Lights out on time',  target:1, icon:'moon',    rew:12, stat:'onBed' },
    { id:'lesson', name:'One lesson with Pippo', target:1, icon:'book',  rew:12, stat:'lessonDone' }
  ];

  /* Closet (Phase 2b): onesie idx = palette slot; acc idx = accessory id.
     kind for rooms: rug / wall / poster, idx = palette slot. cost 0 = owned from the start. */
  var WARDROBE = [
    { id:'c0', kind:'onesie', name:'Rose onesie',  idx:0, cost:0 },
    { id:'c1', kind:'onesie', name:'Sky onesie',   idx:1, cost:0 },
    { id:'c2', kind:'onesie', name:'Leaf onesie',  idx:2, cost:0 },
    { id:'c3', kind:'onesie', name:'Honey onesie', idx:3, cost:0 },
    { id:'c4', kind:'onesie', name:'Lilac onesie', idx:4, cost:160 },
    { id:'c5', kind:'onesie', name:'Mint onesie',  idx:5, cost:160 },
    { id:'a1', kind:'acc', name:'Round glasses', idx:'glasses', cost:120 },
    { id:'a2', kind:'acc', name:'Cozy scarf',    idx:'scarf',   cost:90 },
    { id:'a3', kind:'acc', name:'Tiny bow',      idx:'bow',     cost:60 }
  ];
  var ROOMS = [
    { id:'r0', kind:'rug', name:'Cream rug',  idx:0, cost:0 },
    { id:'r1', kind:'rug', name:'Rose rug',   idx:1, cost:80 },
    { id:'r2', kind:'rug', name:'Mint rug',   idx:2, cost:80 },
    { id:'r3', kind:'rug', name:'Sky rug',    idx:3, cost:80 },
    { id:'w0', kind:'wall', name:'Paper wall', idx:0, cost:0 },
    { id:'w1', kind:'wall', name:'Blush wall', idx:1, cost:100 },
    { id:'w2', kind:'wall', name:'Sage wall',  idx:2, cost:100 },
    { id:'p0', kind:'poster', name:'Sun doodle',   idx:0, cost:0 },
    { id:'p1', kind:'poster', name:'Heart doodle', idx:1, cost:70 },
    { id:'p2', kind:'poster', name:'Moon doodle',  idx:2, cost:70 }
  ];

  /* Real-lesson courses live in 05b_courses.js (P.data.COURSES) — the skill tree
     now shows only real, learnable skills (Spanish, Hindi, Music…). */

  function foodOf(id){ for (var i = 0; i < FOODS.length; i++) if (FOODS[i].id === id) return FOODS[i]; return null; }
  function toyOf(id){ for (var i = 0; i < TOYS.length; i++) if (TOYS[i].id === id) return TOYS[i]; return null; }
  function profOf(id){ for (var i = 0; i < PROFESSIONS.length; i++) if (PROFESSIONS[i].id === id) return PROFESSIONS[i]; return null; }

  /* play & bath minigame mood bonuses modified by owned toys */
  function playBoost(owned){
    var b = 0;
    if (owned.rattle) b += 2;
    if (owned.ball) b += 3;
    return b;
  }

  P.data = { FOODS:FOODS, TOYS:TOYS, NAMES:NAMES, PROFESSIONS:PROFESSIONS, AXES:AXES, QUESTS:QUESTS, WARDROBE:WARDROBE, ROOMS:ROOMS, foodOf:foodOf, toyOf:toyOf, profOf:profOf, playBoost:playBoost };
  return P.data;
})();
