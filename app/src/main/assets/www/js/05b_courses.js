/* Real-lesson courses (Phase 3): learn actual things with Pippo, Duolingo-style.
   Each lesson: words[{es,en}] — the lessons engine (12_lessons.js) turns words into
   exercises (multiple choice, listening, word bank, pair matching) automatically.
   Add a new language by adding another entry here — no engine changes needed. */
window.P = window.P || {};
P.data.COURSES = {
  spanish: {
    id: 'spanish',
    name: 'Spanish',
    ttsLang: 'es-ES',
    flagIcon: 'flag',
    cheer: { go: '¡vamos!', bravo: '¡bravo!', listen: 'escucha\u2026', match: '¡parejas!' },
    units: [
      { name: '¡Hola! First words', lessons: [
        { id: 'sp1', title: 'Greetings', words: [
          { es: 'hola', en: 'hello' },
          { es: 'adiós', en: 'goodbye' },
          { es: 'buenos días', en: 'good morning' },
          { es: 'buenas noches', en: 'good night' }
        ]},
        { id: 'sp2', title: 'Thank you', words: [
          { es: 'gracias', en: 'thank you' },
          { es: 'por favor', en: 'please' },
          { es: 'de nada', en: "you're welcome" },
          { es: 'perdón', en: 'sorry' }
        ]},
        { id: 'sp3', title: 'My name is…', words: [
          { es: '¿cómo te llamas?', en: 'what is your name?' },
          { es: 'me llamo Pippo', en: 'my name is Pippo' },
          { es: 'mucho gusto', en: 'nice to meet you' },
          { es: 'sí', en: 'yes' },
          { es: 'no', en: 'no' }
        ]}
      ]},
      { name: 'Feelings & colors', lessons: [
        { id: 'sp4', title: 'Feelings', words: [
          { es: 'feliz', en: 'happy' },
          { es: 'triste', en: 'sad' },
          { es: 'cansado', en: 'tired' },
          { es: 'tengo hambre', en: 'I am hungry' },
          { es: 'tengo sueño', en: 'I am sleepy' }
        ]},
        { id: 'sp5', title: 'Colors', words: [
          { es: 'rojo', en: 'red' },
          { es: 'azul', en: 'blue' },
          { es: 'verde', en: 'green' },
          { es: 'amarillo', en: 'yellow' },
          { es: 'rosa', en: 'pink' }
        ]},
        { id: 'sp6', title: 'Family', words: [
          { es: 'mamá', en: 'mom' },
          { es: 'papá', en: 'dad' },
          { es: 'bebé', en: 'baby' },
          { es: 'amigo', en: 'friend' },
          { es: 'familia', en: 'family' }
        ]}
      ]},
      { name: 'Numbers & food', lessons: [
        { id: 'sp7', title: 'One to five', words: [
          { es: 'uno', en: 'one' },
          { es: 'dos', en: 'two' },
          { es: 'tres', en: 'three' },
          { es: 'cuatro', en: 'four' },
          { es: 'cinco', en: 'five' }
        ]},
        { id: 'sp8', title: 'Snack time', words: [
          { es: 'manzana', en: 'apple' },
          { es: 'leche', en: 'milk' },
          { es: 'pan', en: 'bread' },
          { es: 'agua', en: 'water' },
          { es: 'queso', en: 'cheese' }
        ]},
        { id: 'sp9', title: 'Animals', words: [
          { es: 'gato', en: 'cat' },
          { es: 'perro', en: 'dog' },
          { es: 'pájaro', en: 'bird' },
          { es: 'pez', en: 'fish' },
          { es: 'vaca', en: 'cow' }
        ]}
      ]},
      { name: 'Together', lessons: [
        { id: 'sp10', title: 'Love & hello', words: [
          { es: 'te quiero', en: 'I love you' },
          { es: '¿cómo estás?', en: 'how are you?' },
          { es: 'muy bien', en: 'very well' },
          { es: 'hasta mañana', en: 'see you tomorrow' }
        ]},
        { id: 'sp11', title: 'Playtime', words: [
          { es: 'jugar', en: 'to play' },
          { es: 'pelota', en: 'ball' },
          { es: '¿jugamos?', en: 'shall we play?' },
          { es: 'divertido', en: 'fun' }
        ]},
        { id: 'sp12', title: 'Sweet dreams', words: [
          { es: 'la luna', en: 'the moon' },
          { es: 'la estrella', en: 'the star' },
          { es: 'dulces sueños', en: 'sweet dreams' },
          { es: 'a dormir', en: 'time to sleep' }
        ]}
      ]}
    ]
  },
  french: {
    id: 'french',
    name: 'French',
    ttsLang: 'fr-FR',
    flagIcon: 'flagfr',
    cheer: { go: 'on y va !', bravo: 'bravo !', listen: 'écoute\u2026', match: 'paires !' },
    units: [
      { name: 'Bonjour! First words', lessons: [
        { id: 'fr1', title: 'Greetings', words: [
          { es: 'bonjour', en: 'hello' },
          { es: 'salut', en: 'hi' },
          { es: 'au revoir', en: 'goodbye' },
          { es: 'merci', en: 'thank you' }
        ]},
        { id: 'fr2', title: 'Polite words', words: [
          { es: "s'il te plaît", en: 'please' },
          { es: 'de rien', en: "you're welcome" },
          { es: 'pardon', en: 'sorry' },
          { es: 'oui', en: 'yes' },
          { es: 'non', en: 'no' }
        ]},
        { id: 'fr3', title: 'Me voilà', words: [
          { es: "je m'appelle Pippo", en: 'my name is Pippo' },
          { es: 'enchanté', en: 'nice to meet you' },
          { es: 'ça va ?', en: 'how are you?' },
          { es: 'ça va bien', en: "I'm doing well" }
        ]}
      ]},
      { name: 'Chiffres & couleurs', lessons: [
        { id: 'fr4', title: 'Numbers 1–5', words: [
          { es: 'un', en: 'one' },
          { es: 'deux', en: 'two' },
          { es: 'trois', en: 'three' },
          { es: 'quatre', en: 'four' },
          { es: 'cinq', en: 'five' }
        ]},
        { id: 'fr5', title: 'Colours', words: [
          { es: 'rouge', en: 'red' },
          { es: 'bleu', en: 'blue' },
          { es: 'vert', en: 'green' },
          { es: 'jaune', en: 'yellow' }
        ]}
      ]},
      { name: 'La vie de Pippo', lessons: [
        { id: 'fr6', title: 'Little meals', words: [
          { es: 'le pain', en: 'bread' },
          { es: 'le lait', en: 'milk' },
          { es: 'la pomme', en: 'apple' },
          { es: "l'eau", en: 'water' }
        ]},
        { id: 'fr7', title: 'Family & friends', words: [
          { es: 'maman', en: 'mommy' },
          { es: 'papa', en: 'daddy' },
          { es: 'le bébé', en: 'the baby' },
          { es: "l'ami", en: 'the friend' }
        ]},
        { id: 'fr8', title: 'Sweet dreams', words: [
          { es: 'bonne nuit', en: 'good night' },
          { es: 'je suis fatigué', en: 'I am tired' },
          { es: 'fais de beaux rêves', en: 'sweet dreams' },
          { es: 'à demain', en: 'see you tomorrow' }
        ]}
      ]}
    ]
  },
  german: {
    id: 'german',
    name: 'German',
    ttsLang: 'de-DE',
    flagIcon: 'flagde',
    cheer: { go: 'los geht\u2019s!', bravo: 'bravo!', listen: 'h\u00f6r zu\u2026', match: 'paare!' },
    units: [
      { name: 'Hallo! First words', lessons: [
        { id: 'ge1', title: 'Greetings', words: [
          { es: 'hallo', en: 'hello' },
          { es: 'tsch\u00fcss', en: 'bye-bye' },
          { es: 'guten Morgen', en: 'good morning' },
          { es: 'gute Nacht', en: 'good night' }
        ]},
        { id: 'ge2', title: 'Thank you', words: [
          { es: 'danke', en: 'thank you' },
          { es: 'bitte', en: 'please' },
          { es: 'gern geschehn', en: "you're welcome" },
          { es: 'entschuldige', en: 'sorry' }
        ]},
        { id: 'ge3', title: 'About me', words: [
          { es: 'ich hei\u00dfe Pippo', en: 'my name is Pippo' },
          { es: "wie geht's?", en: 'how are you?' },
          { es: "mir geht's gut", en: 'I am doing well' },
          { es: 'ja', en: 'yes' },
          { es: 'nein', en: 'no' }
        ]}
      ]},
      { name: 'Farben & Zahlen', lessons: [
        { id: 'ge4', title: 'Colors', words: [
          { es: 'rot', en: 'red' },
          { es: 'blau', en: 'blue' },
          { es: 'gr\u00fcn', en: 'green' },
          { es: 'gelb', en: 'yellow' },
          { es: 'rosa', en: 'pink' }
        ]},
        { id: 'ge5', title: 'One to five', words: [
          { es: 'eins', en: 'one' },
          { es: 'zwei', en: 'two' },
          { es: 'drei', en: 'three' },
          { es: 'vier', en: 'four' },
          { es: 'f\u00fcnf', en: 'five' }
        ]},
        { id: 'ge6', title: 'Snack time', words: [
          { es: 'der Apfel', en: 'the apple' },
          { es: 'die Milch', en: 'the milk' },
          { es: 'das Brot', en: 'the bread' },
          { es: 'das Wasser', en: 'the water' }
        ]}
      ]},
      { name: 'Pippos Welt', lessons: [
        { id: 'ge7', title: 'Family', words: [
          { es: 'die Mama', en: 'the mom' },
          { es: 'der Papa', en: 'the dad' },
          { es: 'das Baby', en: 'the baby' },
          { es: 'der Freund', en: 'the friend' }
        ]},
        { id: 'ge8', title: 'Animals', words: [
          { es: 'die Katze', en: 'the cat' },
          { es: 'der Hund', en: 'the dog' },
          { es: 'der Vogel', en: 'the bird' },
          { es: 'der Fisch', en: 'the fish' }
        ]},
        { id: 'ge9', title: 'Sweet dreams', words: [
          { es: 'schlaf gut', en: 'sleep well' },
          { es: 's\u00fc\u00dfe Tr\u00e4ume', en: 'sweet dreams' },
          { es: 'die Sterne', en: 'the stars' },
          { es: 'bis morgen', en: 'see you tomorrow' }
        ]}
      ]}
    ]
  },
  music: {
    id: 'music',
    name: 'Music',
    ttsLang: 'en-US',       // spoken term is the note / sound word itself
    flagIcon: 'note',
    cheer: { go: 'let\u2019s play!', bravo: 'encore!', listen: 'listen\u2026', match: 'pairs!' },
    ask: { rev: 'Which note is \u00ab{en}\u00bb?' },
    units: [
      { name: 'Do\u2013Re\u2013Mi', lessons: [
        { id: 'mu1', title: 'The scale', words: [
          { es: 'do', en: 'note C' },
          { es: 're', en: 'note D' },
          { es: 'mi', en: 'note E' },
          { es: 'fa', en: 'note F' }
        ]},
        { id: 'mu2', title: 'Climbing up', words: [
          { es: 'sol', en: 'note G' },
          { es: 'la', en: 'note A' },
          { es: 'ti', en: 'note B' },
          { es: 'octave', en: 'eight notes up' }
        ]}
      ]},
      { name: 'Sound & speed', lessons: [
        { id: 'mu3', title: 'Loud or soft', words: [
          { es: 'forte', en: 'loud sound' },
          { es: 'piano', en: 'soft sound' },
          { es: 'crescendo', en: 'growing louder' },
          { es: 'lullaby', en: 'a sleepy song' }
        ]},
        { id: 'mu4', title: 'Fast or slow', words: [
          { es: 'largo', en: 'very slow' },
          { es: 'allegro', en: 'quick and happy' },
          { es: 'rhythm', en: 'pattern of the beat' },
          { es: 'steady beat', en: 'the ticking pulse' }
        ]}
      ]},
      { name: 'Little performer', lessons: [
        { id: 'mu5', title: 'Clap and move', words: [
          { es: 'clap', en: 'hands with the beat' },
          { es: 'hum', en: 'sing with lips closed' },
          { es: 'encore', en: 'once more please' },
          { es: 'bow', en: 'a thank-you bend' }
        ]},
        { id: 'mu6', title: 'Instruments', words: [
          { es: 'drum', en: 'a round boom' },
          { es: 'bell', en: 'a bright ring' },
          { es: 'shaker', en: 'a soft rattle' },
          { es: 'flute', en: 'a windy whistle' }
        ]}
      ]}
    ]
  },
  manners: {
    id: 'manners',
    name: 'Manners',
    ttsLang: 'en-US',
    flagIcon: 'heart',
    cheer: { go: 'kindness time!', bravo: 'so kind!', listen: 'listen\u2026', match: 'kind pairs!' },
    ask: { rev: 'Which kind word means \u00ab{en}\u00bb?' },
    units: [
      { name: 'Magic words', lessons: [
        { id: 'mn1', title: 'The magic word', words: [
          { es: 'please', en: 'asking kindly' },
          { es: 'thank you', en: 'feeling grateful' },
          { es: "you're welcome", en: 'reply to thanks' },
          { es: 'excuse me', en: 'polite passing' }
        ]},
        { id: 'mn2', title: 'Sorry & after you', words: [
          { es: 'sorry', en: 'after a mistake' },
          { es: "it's okay", en: 'kind reply' },
          { es: 'after you', en: 'let a friend go first' },
          { es: 'pardon', en: 'gentle interrupt' }
        ]}
      ]},
      { name: 'Sharing & caring', lessons: [
        { id: 'mn3', title: 'Turn taking', words: [
          { es: 'share', en: 'give a piece of fun' },
          { es: 'my turn', en: 'waiting patient' },
          { es: 'your turn', en: 'offering the toy' },
          { es: 'together', en: 'playing as one' }
        ]},
        { id: 'mn4', title: 'Hello & goodbye', words: [
          { es: 'good morning', en: 'hello to the sun' },
          { es: 'good night', en: 'wish at bedtime' },
          { es: 'welcome', en: 'greeting a guest' },
          { es: 'goodbye', en: 'waving bye-bye' }
        ]}
      ]},
      { name: 'Helping hands', lessons: [
        { id: 'mn5', title: 'Little helpers', words: [
          { es: 'can I help?', en: 'offering a hand' },
          { es: 'tidy up', en: 'toys go home' },
          { es: 'gentle', en: 'soft and slow touch' },
          { es: 'patience', en: 'waiting with a smile' }
        ]},
        { id: 'mn6', title: 'Feelings matter', words: [
          { es: 'are you okay?', en: 'caring check-in' },
          { es: "I'm happy", en: 'my heart feels warm' },
          { es: "I'm sad", en: 'asking for a hug' },
          { es: 'try again', en: 'missing is learning' }
        ]}
      ]}
    ]
  },
  habits: {
    id: 'habits',
    name: 'Good Habits',
    ttsLang: 'en-US',
    flagIcon: 'plant',
    cheer: { go: 'let\u2019s grow!', bravo: 'strong and healthy!', listen: 'listen\u2026', match: 'routine pairs!' },
    ask: { rev: 'Which habit is \u00ab{en}\u00bb?' },
    units: [
      { name: 'Every day', lessons: [
        { id: 'hb1', title: 'Morning time', words: [
          { es: 'brush teeth', en: 'twice a day habit' },
          { es: 'wash face', en: 'splash awake' },
          { es: 'make the bed', en: 'a tidy start' },
          { es: 'stretch', en: 'reach up tall' }
        ]},
        { id: 'hb2', title: 'Mealtime', words: [
          { es: 'wash hands', en: 'before eating' },
          { es: 'fruits and veggies', en: 'rainbow on the plate' },
          { es: 'chew slowly', en: 'small bites' },
          { es: 'drink water', en: 'thirsty helper' }
        ]}
      ]},
      { name: 'Clean & safe', lessons: [
        { id: 'hb3', title: 'Tidy home', words: [
          { es: 'tidy toys', en: 'every toy has a home' },
          { es: 'dirty clothes', en: 'into the basket' },
          { es: 'soap and water', en: 'bubbles clean best' },
          { es: 'sneeze in elbow', en: 'catch the sneeze' }
        ]},
        { id: 'hb4', title: 'Safe play', words: [
          { es: 'look both ways', en: 'before crossing' },
          { es: 'hold a hand', en: 'with a grown-up' },
          { es: 'outdoor play', en: 'fresh air daily' },
          { es: 'helmet on', en: 'for rides' }
        ]}
      ]},
      { name: 'Rest & feelings', lessons: [
        { id: 'hb5', title: 'Bedtime', words: [
          { es: 'bedtime', en: 'same time nightly' },
          { es: 'story time', en: 'wind down together' },
          { es: 'dim the lights', en: 'eyes get sleepy' },
          { es: 'deep breath', en: 'calm to four' }
        ]},
        { id: 'hb6', title: 'Growing strong', words: [
          { es: 'name the feeling', en: 'say happy or sad' },
          { es: 'ask for help', en: 'grown-ups help' },
          { es: 'try again', en: 'missing is learning' },
          { es: 'big hug', en: 'soft arms warm heart' }
        ]}
      ]}
    ]
  },
  italian: {
    id: 'italian',
    name: 'Italian',
    ttsLang: 'it-IT',
    flagIcon: 'flagit',
    cheer: { go: 'andiamo!', bravo: 'bravo!', listen: 'ascolta\u2026', match: 'coppie!' },
    units: [
      { name: 'Ciao! First words', lessons: [
        { id: 'it1', title: 'Greetings', words: [
          { es: 'ciao', en: 'hello and bye' },
          { es: 'buongiorno', en: 'good morning' },
          { es: 'buona notte', en: 'good night' },
          { es: 'grazie', en: 'thank you' }
        ]},
        { id: 'it2', title: 'Polite words', words: [
          { es: 'per favore', en: 'please' },
          { es: 'prego', en: "you're welcome" },
          { es: 'scusa', en: 'sorry' },
          { es: 's\u00ec', en: 'yes' },
          { es: 'no', en: 'no' }
        ]},
        { id: 'it3', title: 'About me', words: [
          { es: 'mi chiamo Pippo', en: 'my name is Pippo' },
          { es: 'come stai?', en: 'how are you?' },
          { es: 'sto bene', en: 'I am well' },
          { es: 'piacere', en: 'nice to meet you' }
        ]}
      ]},
      { name: 'Colori & Numeri', lessons: [
        { id: 'it4', title: 'Colors', words: [
          { es: 'rosso', en: 'red' },
          { es: 'blu', en: 'blue' },
          { es: 'verde', en: 'green' },
          { es: 'giallo', en: 'yellow' },
          { es: 'rosa', en: 'pink' }
        ]},
        { id: 'it5', title: 'One to five', words: [
          { es: 'uno', en: 'one' },
          { es: 'due', en: 'two' },
          { es: 'tre', en: 'three' },
          { es: 'quattro', en: 'four' },
          { es: 'cinque', en: 'five' }
        ]},
        { id: 'it6', title: 'Snack time', words: [
          { es: 'la mela', en: 'the apple' },
          { es: 'il latte', en: 'the milk' },
          { es: 'il pane', en: 'the bread' },
          { es: "l'acqua", en: 'the water' }
        ]}
      ]},
      { name: 'Il mondo di Pippo', lessons: [
        { id: 'it7', title: 'Family', words: [
          { es: 'la mamma', en: 'the mom' },
          { es: 'il pap\u00e0', en: 'the dad' },
          { es: 'il bambino', en: 'the baby' },
          { es: "l'amico", en: 'the friend' }
        ]},
        { id: 'it8', title: 'Animals', words: [
          { es: 'il gatto', en: 'the cat' },
          { es: 'il cane', en: 'the dog' },
          { es: "l'uccello", en: 'the bird' },
          { es: 'il pesce', en: 'the fish' }
        ]},
        { id: 'it9', title: 'Good night', words: [
          { es: 'buoni sogni', en: 'sweet dreams' },
          { es: 'la luna', en: 'the moon' },
          { es: 'le stelle', en: 'the stars' },
          { es: 'a domani', en: 'see you tomorrow' }
        ]}
      ]}
    ]
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    ttsLang: 'en-US',
    flagIcon: 'sun',
    cheer: { go: 'let\u2019s explore!', bravo: 'nature expert!', listen: 'listen\u2026', match: 'nature pairs!' },
    ask: { rev: 'Which part of nature is \u00ab{en}\u00bb?' },
    units: [
      { name: 'Growing things', lessons: [
        { id: 'na1', title: 'Seed to tree', words: [
          { es: 'seed', en: 'sleeps in the soil' },
          { es: 'sprout', en: 'first green peek' },
          { es: 'leaf', en: 'makes plant food' },
          { es: 'roots', en: 'drink for the plant' }
        ]},
        { id: 'na2', title: 'Becoming bugs', words: [
          { es: 'caterpillar', en: 'eats and grows' },
          { es: 'chrysalis', en: 'sleeping cocoon' },
          { es: 'butterfly', en: 'new wings!' },
          { es: 'ladybug', en: 'eats garden pests' }
        ]}
      ]},
      { name: 'Sky & water', lessons: [
        { id: 'na3', title: 'Water cycle', words: [
          { es: 'rain', en: 'clouds share water' },
          { es: 'puddle', en: "sky's little mirror" },
          { es: 'vapor', en: 'invisible rising water' },
          { es: 'rainbow', en: 'sun + rain together' }
        ]},
        { id: 'na4', title: 'Seasons', words: [
          { es: 'spring', en: 'flowers wake up' },
          { es: 'summer', en: 'long sunny days' },
          { es: 'autumn', en: 'leaves turn gold' },
          { es: 'winter', en: 'nature rests warm' }
        ]}
      ]},
      { name: 'Animal friends', lessons: [
        { id: 'na5', title: 'Homes', words: [
          { es: 'nest', en: "a bird's cradle" },
          { es: 'hive', en: "bees' honey house" },
          { es: 'burrow', en: "a rabbit's tunnel" },
          { es: 'pond', en: "frogs' pool" }
        ]},
        { id: 'na6', title: 'Little helpers', words: [
          { es: 'acorn', en: 'becomes an oak' },
          { es: 'bee', en: "flowers' pollinator" },
          { es: 'worm', en: "soil's gardener" },
          { es: 'owl', en: 'night hunter' }
        ]}
      ]}
    ]
  },
  space: {
    id: 'space',
    name: 'Space',
    ttsLang: 'en-US',
    flagIcon: 'moon',
    cheer: { go: 'blast off!', bravo: 'star explorer!', listen: 'listen\u2026', match: 'space pairs!' },
    ask: { rev: 'Which space wonder is \u00ab{en}\u00bb?' },
    units: [
      { name: 'Our sky', lessons: [
        { id: 'sky1', title: 'Sun & moon', words: [
          { es: 'sun', en: 'our nearest star' },
          { es: 'moon', en: "Earth's night lamp" },
          { es: 'star', en: 'giant burning gas' },
          { es: 'orbit', en: 'round trip around' }
        ]},
        { id: 'sky2', title: 'Planet Earth', words: [
          { es: 'Earth', en: 'the blue planet' },
          { es: 'gravity', en: 'keeps us down' },
          { es: 'day & night', en: 'Earth spinning' },
          { es: 'horizon', en: 'where sky meets land' }
        ]}
      ]},
      { name: 'Planets & beyond', lessons: [
        { id: 'sky3', title: 'Planets', words: [
          { es: 'Mars', en: 'the red planet' },
          { es: 'Saturn', en: 'the ring planet' },
          { es: 'Jupiter', en: 'the biggest planet' },
          { es: 'Venus', en: 'the brightest light' }
        ]},
        { id: 'sky4', title: 'Exploring', words: [
          { es: 'rocket', en: 'rides fire to space' },
          { es: 'astronaut', en: 'space suit sailor' },
          { es: 'telescope', en: 'sees far stars' },
          { es: 'comet', en: 'icy star with a tail' }
        ]}
      ]}
    ]
  },
  math: {
    id: 'math',
    name: 'Numbers & Shapes',
    ttsLang: 'en-US',
    flagIcon: 'plus',
    cheer: { go: 'count with me!', bravo: 'math whiz!', listen: 'listen\u2026', match: 'number pairs!' },
    ask: { rev: 'Which math word matches \u00ab{en}\u00bb?' },
    units: [
      { name: 'Shapes & sizes', lessons: [
        { id: 'nm1', title: 'Shapes', words: [
          { es: 'circle', en: 'no corners at all' },
          { es: 'square', en: 'four equal sides' },
          { es: 'triangle', en: 'three sides' },
          { es: 'star', en: 'five points' }
        ]},
        { id: 'nm2', title: 'More shapes', words: [
          { es: 'rectangle', en: 'two long two short' },
          { es: 'oval', en: 'a stretched circle' },
          { es: 'diamond', en: 'a leaning square' },
          { es: 'crescent', en: 'the moon shape' }
        ]},
        { id: 'nm3', title: 'Sizes', words: [
          { es: 'big', en: 'fills lots of space' },
          { es: 'small', en: 'takes little space' },
          { es: 'tall', en: 'reaches up high' },
          { es: 'tiny', en: 'very very small' }
        ]}
      ]},
      { name: 'Count & take away', lessons: [
        { id: 'nm4', title: 'Little sums', words: [
          { es: 'two plus one', en: 'makes three' },
          { es: 'three plus two', en: 'makes five' },
          { es: 'four plus four', en: 'makes eight' },
          { es: 'five plus five', en: 'makes ten' }
        ]},
        { id: 'nm5', title: 'Take away', words: [
          { es: 'five take two', en: 'leaves three' },
          { es: 'seven take two', en: 'leaves five' },
          { es: 'ten take three', en: 'leaves seven' },
          { es: 'eight take four', en: 'leaves four' }
        ]}
      ]}
    ]
  },
  weather: {
    id: 'weather',
    name: 'Weather',
    ttsLang: 'en-US',
    flagIcon: 'rain',
    cheer: { go: 'weather watch!', bravo: 'sky reader!', listen: 'listen\u2026', match: 'sky pairs!' },
    ask: { rev: 'Which sky word is \u00ab{en}\u00bb?' },
    units: [
      { name: 'Sky watching', lessons: [
        { id: 'we1', title: 'Clouds & rain', words: [
          { es: 'fog', en: 'clouds touch the ground' },
          { es: 'drizzle', en: 'tiny slow rain' },
          { es: 'thunder', en: "lightning's boom" },
          { es: 'breeze', en: 'soft moving air' }
        ]},
        { id: 'we2', title: 'Storms & calm', words: [
          { es: 'lightning', en: "sky's bright flash" },
          { es: 'hail', en: 'ice from the sky' },
          { es: 'rainbow', en: 'comes after rain' },
          { es: 'heatwave', en: 'very very hot' }
        ]}
      ]},
      { name: 'Dress for it', lessons: [
        { id: 'we3', title: 'What to wear', words: [
          { es: 'raincoat', en: 'for rainy walks' },
          { es: 'sunglasses', en: 'for bright sun' },
          { es: 'scarf', en: 'for chilly wind' },
          { es: 'boots', en: 'for puddle days' }
        ]},
        { id: 'we4', title: 'How it feels', words: [
          { es: 'freezing', en: 'water turns to ice' },
          { es: 'chilly', en: 'grab a warm coat' },
          { es: 'mild', en: 'just right outside' },
          { es: 'hot', en: 'shade and water please' }
        ]}
      ]}
    ]
  }
};
