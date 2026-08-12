/* Baby Feud questions, transcribed from FINAL_Baby_Feud.key and listed
   best-answer-first.

   Points come from position rather than the original survey percentages: the
   top answer is worth as many points as there are answers, then one less each
   step down, so a six-answer round runs 6-5-4-3-2-1. Every round is therefore
   worth the same 21 points and the board reads at a glance.

   Loaded by both the board and the host panel so the two can never disagree. */
var BABY_FEUD_ROUNDS = [
 /* "Freedom", "Going out", "Date night" and "Travel" all meant roughly
    "leaving the house", so a guest naming one left the host guessing which
    slot they had in mind. Six separate things now. */
 {q:"Name something new parents miss most about their pre-baby lives",
  a:["Sleep","Going out","Sexy time","Travel","Money","Privacy"]},
 {q:"Name something new parents constantly buy",
  a:["Diapers","Wipes / cream","Baby clothes","Take-out","Coffee","Formula"]},
 {q:"Name an event parents do not want to miss in their child's life",
  a:["1st steps","1st word","Birthdays","1st smile","Birth","Wedding"]},
 {q:"Name something people do to entertain a baby",
  a:["Sing","Funny faces","Peekaboo","Dance","Baby talk","Read"]},
 /* "Sensory toys", "Musical toys" and "Play mat" are shop-catalogue words.
    Guests shout teddy, blocks, ball — so those are the answers now. */
 {q:"Name a good toy for a baby",
  a:["Rattle","Teddy bear","Blocks","Ball","Books","Teether"]},
 {q:"Name something that's cute when a baby does it but not when an adult does it",
  a:["Fart","Poop / pee pants","Burp","Drool","Blow bubbles","Messy eating"]},
 {q:"Name something new parents will try to do when the baby's asleep",
  a:["Sleep","Clean / chores","Sexy time","Shower","Eat a good meal","Screen time"]},
 {q:"Name a reason the baby might be crying",
  a:["Hungry","Tired","Farts / gas","Dirty diaper","Colic","Teething"]},
 {q:"Name a place where people hope not to have to sit next to a baby",
  a:["Airplane","Restaurant","Movies","Bar","Bus / train","Library"]},
 /* "Working", "Shopping", "Far from home" and "On the street" were four ways
    of saying "in public". Named places now, and no second Airplane — that is
    already the top answer one round earlier. */
 {q:"Name a situation you don't want to be in when your water breaks",
  a:["At work","Driving","Grocery shopping","At a wedding","In an elevator","At the gym"]},
 /* Had two poop answers competing with each other, and phrases too long to
    guess word for word. One poop answer, and short enough to shout. */
 {q:"The parents just said “oh no!” … what did the baby do?",
  a:["Threw up","Blowout / poop","Fell over","Threw food","Ate something gross","Broke something"]},
 /* "Being carried", "Being catered to" and "No responsibilities" were three
    versions of the easy life; one of them is enough. */
 {q:"If you could go back to being a baby for a day, what would you enjoy the most?",
  a:["Naps","Snuggles","No responsibilities","Being carried","Playtime","Being fed"]},
 {q:"Name something your partner does that's just like a baby",
  a:["Whine","Fart","Fall asleep anywhere","Always eating","Noisy sleep","Messy eating"]},
 {q:"Name something you would not want a babysitter doing on the job",
  a:["Drugs","Drinking","Sleeping","Phone / screens","Sexy time","Throw party"]},
 {q:"Name something a baby shouldn't touch, but might try to",
  a:["Outlets","Hot stove / oven","Dirty diaper","Animals","Hot drink / food","Knife"]}
];

/* Shown from the title screen to teach the rules before anything is scored.
   Deliberately something everyone can answer without knowing babies. */
var BABY_FEUD_DEMO_ROUND = {
  q:"Name something a baby wears",
  a:["Diaper","Onesie","Bib","Socks","Hat","Shoes"]
};

/* Expanded to the [text, points] pairs the board and host panel read. */
function expand(round){
  return {
    q: round.q,
    a: round.a.map(function(text, i){ return [text, round.a.length - i]; })
  };
}
window.BABY_FEUD_QUESTIONS = BABY_FEUD_ROUNDS.map(expand);
window.BABY_FEUD_DEMO = expand(BABY_FEUD_DEMO_ROUND);
