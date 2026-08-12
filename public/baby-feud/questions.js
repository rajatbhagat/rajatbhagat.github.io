/* Baby Feud questions, transcribed from FINAL_Baby_Feud.key and listed
   best-answer-first.

   Points come from position rather than the original survey percentages: the
   top answer is worth as many points as there are answers, then one less each
   step down, so a six-answer round runs 6-5-4-3-2-1. Every round is therefore
   worth the same 21 points and the board reads at a glance.

   Loaded by both the board and the host panel so the two can never disagree. */
var BABY_FEUD_ROUNDS = [
 {q:"Name something new parents miss most about their pre-baby lives",
  a:["Sleep","Freedom","Sexy time","Going out","Date night","Travel"]},
 {q:"Name something new parents constantly buy",
  a:["Diapers","Wipes / cream","Baby clothes","Take-out","Coffee","Formula"]},
 {q:"Name an event parents do not want to miss in their child's life",
  a:["1st steps","1st word","Birthdays","1st smile","Birth","Wedding"]},
 {q:"Name something people do to entertain a baby",
  a:["Sing","Funny faces","Peekaboo","Dance","Baby talk","Read"]},
 {q:"Name a good toy for a baby",
  a:["Rattle","Sensory toys","Teether","Musical toys","Stuffed animal","Play mat"]},
 {q:"Name something that's cute when a baby does it but not when an adult does it",
  a:["Fart","Poop / pee pants","Burp","Drool","Blow bubbles","Messy eating"]},
 {q:"Name something new parents will try to do when the baby's asleep",
  a:["Sleep","Clean / chores","Sexy time","Shower","Eat a good meal","Screen time"]},
 {q:"Name a reason the baby might be crying",
  a:["Hangry","Tired","Farts / gas","Dirty diaper","Colic","Teething"]},
 {q:"Name a place where people hope not to have to sit next to a baby",
  a:["Airplane","Restaurant","Movies","Bar","Bus / train","Library"]},
 {q:"Name a situation you don't want to be in when your water breaks",
  a:["Working","Driving","Shopping","Airplane","Far from home","On the street"]},
 {q:"The parents just said “oh no!” … what did the baby do?",
  a:["Vomited","Blowout / poop","Hurt themselves","Dropped / threw something","Pee/poop during diaper change","Put something in their mouth"]},
 {q:"If you could go back to being a baby for a day, what would you enjoy the most?",
  a:["Big naps","Snuggles","Being carried","No responsibilities","Being catered to","Playtime"]},
 {q:"Name something your partner does that's just like a baby",
  a:["Whine","Fart","Fall asleep anywhere","Always eating","Noisy sleep","Messy eating"]},
 {q:"Name something you would not want a babysitter doing on the job",
  a:["Drugs","Drinking","Sleeping","Phone / screens","Sexy time","Throw party"]},
 {q:"Name something a baby shouldn't touch, but might try to",
  a:["Outlets","Hot stove / oven","Dirty diaper","Animals","Hot drink / food","Knives"]}
];

/* Expanded to the [text, points] pairs the board and host panel read. */
window.BABY_FEUD_QUESTIONS = BABY_FEUD_ROUNDS.map(function(round){
  return {
    q: round.q,
    a: round.a.map(function(text, i){ return [text, round.a.length - i]; })
  };
});
