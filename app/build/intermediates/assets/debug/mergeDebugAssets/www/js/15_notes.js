/* Little notes: one untimed keepsake per local day. */
window.P = window.P || {};
P.notes = (function(){
  var stories = [
    ['The picnic basket', 'I packed a picnic for us. Can you remember what went into the basket?', ['apple','toast','bottle'], 'We shared the last slice of toast on the picnic rug.'],
    ['The rainy window', 'I drew three things on the misty glass. One is about to fade.', ['cloud','drop','heart'], 'We left a little heart on the window until the sun came out.'],
    ['The bedtime shelf', 'Three treasures sat beside my pillow. Which one slipped under it?', ['book','plush','star'], 'Our teddy kept a paper star safe until morning.'],
    ['The kitchen sketch', 'I sketched our breakfast while the pot was warm. Look closely.', ['pot','apple','toast'], 'There is an apple-shaped thumbprint on our recipe page.'],
    ['The parcel', 'I tucked three surprises into a present. Help me check the wrapping.', ['bow','rattle','ball'], 'We kept a scrap of ribbon from the parcel.'],
    ['The garden page', 'Three little drawings from our windowsill. Which will I rub out?', ['plant','sun','pencil'], 'We marked the newest leaf with a tiny pencil sketch.'],
    ['The paper sky', 'I made a sky out of paper shapes. One floated off the page.', ['moon','star','cloud'], 'We taped our paper moon back into its sky.']
  ];
  var sc = P.screens, st = P.state;
  function el(tag, cls, label){
    var node = document.createElement(tag);
    node.className = cls || '';
    if (label != null) node.textContent = label;
    return node;
  }
  function button(label, action, primary){
    var node = el('button','btn' + (primary ? ' primary' : ''),label);
    node.onclick = action;
    return node;
  }
  function sheet(title){
    var node = el('div','note-sheet');
    sc.openModal({ title:title, body:node });
    return node;
  }
  function strip(items){
    var row = el('div','note-strip');
    items.forEach(function(item){
      var tile = el('span','note-object');
      tile.innerHTML = P.art.icon(item,36);
      tile.appendChild(el('span','',item));
      row.appendChild(tile);
    });
    return row;
  }
  function refresh(){
    var notes = P.S.notes, done = notes.lastDay === st.dayKey();
    var label = done ? 'Today\u2019s keepsake' : stories[notes.visits % stories.length][0];
    var node = document.getElementById('dailyNote');
    if (node.dataset.label === label) return;
    node.dataset.label = label;
    node.innerHTML = P.art.icon(done ? 'book' : 'pencil',18);
    node.appendChild(document.createTextNode(done ? label : 'A note: ' + label));
  }
  function album(){
    var notes = P.S.notes, node = sheet('Our little notes');
    if (!notes.pages.length) node.appendChild(el('p','','Your first little note is waiting at home.'));
    notes.pages.slice().reverse().forEach(function(page){
      var story = stories[page.id];
      if (!story) return;
      var row = el('article','note-page');
      row.appendChild(el('small','',page.day));
      row.appendChild(el('strong','',story[0]));
      row.appendChild(strip(story[2]));
      row.appendChild(el('p','',story[3]));
      node.appendChild(row);
    });
    if (notes.pages.length >= 3){
      var choices = el('div','note-actions');
      node.insertBefore(choices,node.firstChild);
      ['meadow','rose'].forEach(function(color){
        choices.appendChild(button(color + ' blanket',function(){
          P.S.room.noteBlanket = color; st.save(); sc.compose(); album();
        },P.S.room.noteBlanket === color));
      });
    }
  }
  function recall(node){
    var pool = P.lessons.pools(), day = st.dayKey();
    var missed = Object.keys(P.S.lessons).map(function(cid){ return P.S.lessons[cid].lastMiss; })
      .filter(function(word){ return word && word.day !== day; });
    var word = missed[0] || pool[P.S.notes.visits % pool.length];
    if (!word) return;
    var other = pool.find(function(entry){ return entry.en !== word.en && entry.es !== word.es; });
    if (!other || P.S.daily.noteRecall) return;
    var ask = el('p','','One for our wordbook: what did "' + word.es + '" mean?');
    var choices = el('div','note-actions');
    node.appendChild(ask); node.appendChild(choices);
    var answers = [word.en,other.en];
    if (P.S.notes.visits % 2) answers.reverse();
    answers.forEach(function(answer){
      choices.appendChild(button(answer,function(){
        if (day !== st.dayKey() || P.S.daily.noteRecall) return;
        var ok = answer === word.en;
        P.S.daily.noteRecall = true; P.S.notes.recallAttempts++;
        if (ok) {
          P.S.notes.recallCorrect++;
          Object.keys(P.S.lessons).forEach(function(cid){
            var course = P.S.lessons[cid];
            if (course.lastMiss === word) delete course.lastMiss;
          });
        }
        ask.textContent = (ok ? 'You remembered! ' : 'For next time: ') + word.es + ' = ' + word.en;
        choices.remove(); st.save();
      }));
    });
  }
  function open(){
    st.rolloverDaily();
    var notes = P.S.notes, day = st.dayKey();
    if (notes.lastDay === day){ album(); return; }
    if (!notes.firstOpen) notes.firstOpen = Date.now();
    else if (day !== st.dayKey(notes.firstOpen) && Date.now() - notes.firstOpen <= 604800000) notes.returnedWithinWeek = true;
    var id = notes.visits % stories.length, story = stories[id], items = story[2];
    if (!P.S.daily.noteStarted){ P.S.daily.noteStarted = true; notes.starts++; st.save(); }
    var missing = (new Date().getDate() + id) % items.length;
    function show(hidden){
      var node = sheet(story[0]);
      node.appendChild(el('p','',hidden ? 'One is missing. Which one was here?' : story[1]));
      node.appendChild(strip(items.filter(function(item,index){ return !hidden || index !== missing; })));
      if (!hidden){ node.appendChild(button('Ready to remember',function(){ show(true); },true)); return; }
      var choices = el('div','note-actions'), feedback = el('p','');
      feedback.setAttribute('aria-live','polite');
      node.appendChild(choices); node.appendChild(feedback);
      var extras = stories[(id + 3) % stories.length][2].filter(function(item){ return items.indexOf(item) < 0; });
      var options = [items[missing]].concat(extras.concat(['scarf','gift']).slice(0,2));
      options = options.slice(missing).concat(options.slice(0,missing));
      options.forEach(function(item){
        choices.appendChild(button(item,function(){
          if (day !== st.dayKey() || notes.lastDay === day){ open(); return; }
          if (item !== items[missing]){ feedback.textContent = 'Not this time. Take another peek?'; return; }
          notes.lastDay = day; notes.visits++;
          if (!notes.pages.some(function(page){ return page.id === id; })) notes.pages.push({ id:id, day:day });
          P.quests.setFlag('noteDone');
          refresh();
          var end = sheet(story[0]);
          end.appendChild(strip(items)); end.appendChild(el('p','',story[3]));
          recall(end);
          end.appendChild(button(notes.pages.length === 3 && !P.S.room.noteBlanket ? 'Choose our picnic blanket' : 'Open our little notes',album,true));
        }));
      });
      node.appendChild(button('Peek again',function(){ show(false); }));
    }
    show(false);
  }
  return { open:open, album:album, refresh:refresh };
})();
