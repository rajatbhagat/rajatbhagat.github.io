/* Shared game state + phone-to-screen sync for Baby Feud.

   Both pages hold the same state object. Whoever changes it sends a full
   snapshot; the other side swaps its copy in and re-renders. A snapshot is
   well under a kilobyte, so there is no need for deltas or conflict
   resolution — only one person is ever touching the controls.

   Transport is WebRTC. PeerJS's free public broker is used for the handshake
   only: the board claims the peer id "babyfeud-<CODE>", the host dials that
   id, and from then on the data goes phone-to-laptop directly. Nothing is
   stored on anyone's server and the game works with the broker down as long
   as the two are already paired. */

(function(){
"use strict";

var QUESTIONS = window.BABY_FEUD_QUESTIONS;
var DEMO = window.BABY_FEUD_DEMO;

/* Ambiguous glyphs left out so a code is never misread off a TV: no O/0, I/1, L. */
var ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
var PEER_PREFIX = "babyfeud-";
var CODE_KEY  = "babyfeud.code.v1";
var STATE_KEY = "babyfeud.state.v1";

function randomCode(){
  var s = "";
  for(var i=0;i<4;i++) s += ALPHABET[Math.floor(Math.random()*ALPHABET.length)];
  return s;
}

function newState(){
  return {
    /* "home" is the title screen where the teams get named, "demo" the
       example round used to explain the rules, "playing" the real board.
       A reset drops back to home. */
    phase:"home",
    demoRevealed: DEMO.a.map(function(){ return false; }),
    qi:0,
    revealed: QUESTIONS.map(function(q){ return q.a.map(function(){ return false; }); }),
    /* Bumped to flash the giant ✕ on the board. The sync carries state, not
       events, so the board watches this number for an increase. */
    buzz:0,
    mult:1,
    control:null,            // 'A' | 'B' | null
    scores:{A:0,B:0},
    names:{A:"Team Mama",B:"Team Papa"},
    /* Which answers have already been paid out. Control passes back and forth
       inside a round, so a round can be awarded several times — the pot counts
       only the answers revealed since the last award. */
    banked: QUESTIONS.map(function(q){ return q.a.map(function(){ return false; }); })
  };
}

/* A snapshot that arrived from the other device is not trusted to have the
   right shape — a stale tab from an older version of the page could send
   anything. Anything missing or the wrong length falls back to a fresh value,
   so a bad message can never wedge the board mid-party. */
function sanitize(raw){
  var s = newState();
  if(!raw || typeof raw !== "object") return s;
  if(typeof raw.qi === "number" && raw.qi >= 0 && raw.qi < QUESTIONS.length) s.qi = Math.floor(raw.qi);
  if(Array.isArray(raw.revealed)){
    s.revealed = QUESTIONS.map(function(q,qi){
      var row = raw.revealed[qi];
      return q.a.map(function(_,ai){ return Array.isArray(row) ? !!row[ai] : false; });
    });
  }
  if(raw.phase === "playing" || raw.phase === "demo") s.phase = raw.phase;
  if(Array.isArray(raw.demoRevealed)){
    s.demoRevealed = DEMO.a.map(function(_,i){ return !!raw.demoRevealed[i]; });
  }
  if(typeof raw.buzz === "number" && isFinite(raw.buzz) && raw.buzz >= 0) s.buzz = Math.floor(raw.buzz);
  if(raw.mult === 1 || raw.mult === 2 || raw.mult === 3) s.mult = raw.mult;
  if(raw.control === "A" || raw.control === "B") s.control = raw.control;
  if(raw.scores){
    if(typeof raw.scores.A === "number" && isFinite(raw.scores.A)) s.scores.A = Math.round(raw.scores.A);
    if(typeof raw.scores.B === "number" && isFinite(raw.scores.B)) s.scores.B = Math.round(raw.scores.B);
  }
  if(raw.names){
    if(typeof raw.names.A === "string" && raw.names.A.trim()) s.names.A = raw.names.A.slice(0,24);
    if(typeof raw.names.B === "string" && raw.names.B.trim()) s.names.B = raw.names.B.slice(0,24);
  }
  if(Array.isArray(raw.banked)){
    s.banked = QUESTIONS.map(function(q,qi){
      var row = raw.banked[qi];
      return q.a.map(function(_,ai){ return Array.isArray(row) ? !!row[ai] : false; });
    });
  }
  return s;
}

function loadState(){
  try{
    var raw = localStorage.getItem(STATE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : newState();
  }catch(e){ return newState(); }
}
function saveState(s){
  try{ localStorage.setItem(STATE_KEY, JSON.stringify(s)); }catch(e){}
}
function loadCode(){
  try{ return localStorage.getItem(CODE_KEY) || ""; }catch(e){ return ""; }
}
function saveCode(c){
  try{ localStorage.setItem(CODE_KEY, c); }catch(e){}
}

var Sync = {
  role:null,          // 'board' | 'host'
  peer:null,
  conn:null,
  code:"",
  status:"idle",      // idle | starting | waiting | connecting | connected | error
  detail:"",
  onState:function(){},
  onStatus:function(){},
  _retry:null,
  _wantCode:"",

  init:function(opts){
    this.role = opts.role;
    this.onState = opts.onState || function(){};
    this.onStatus = opts.onStatus || function(){};
    if(typeof Peer === "undefined"){
      this._set("error","Could not load the connection library.");
      return;
    }
    if(this.role === "board") this._startBoard(loadCode() || randomCode());
  },

  _set:function(status, detail){
    this.status = status;
    this.detail = detail || "";
    this.onStatus(status, this.detail, this.code);
  },

  /* ---------- board: claim "babyfeud-CODE" and wait to be dialled ---------- */
  _startBoard:function(code){
    var self = this;
    this.code = code;
    saveCode(code);
    this._set("starting","");
    this._destroyPeer();

    var peer = new Peer(PEER_PREFIX + code, {debug:0});
    this.peer = peer;

    peer.on("open", function(){ self._set("waiting",""); });

    peer.on("connection", function(conn){
      /* A host reloading its phone page dials in again; the newest one wins. */
      if(self.conn && self.conn !== conn){ try{ self.conn.close(); }catch(e){} }
      self.conn = conn;
      self._wire(conn);
    });

    peer.on("error", function(err){
      var t = err && err.type;
      if(t === "unavailable-id"){
        /* Someone (probably a stale tab of ours) holds this code. Take a new one. */
        saveCode("");
        self._startBoard(randomCode());
        return;
      }
      if(t === "peer-unavailable") return;            // host not up yet, harmless
      if(t === "network" || t === "server-error" || t === "socket-error" || t === "socket-closed"){
        self._set("error","Lost the pairing service. Retrying…");
        clearTimeout(self._retry);
        self._retry = setTimeout(function(){ self._startBoard(self.code); }, 4000);
        return;
      }
      self._set("error", (err && err.message) || "Connection problem.");
    });

    peer.on("disconnected", function(){
      /* Dropped the broker but an open data channel keeps working. */
      if(!self.conn || !self.conn.open) self._set("starting","");
      try{ peer.reconnect(); }catch(e){}
    });
  },

  /* ---------- host: dial the board's code ---------- */
  connect:function(code){
    var self = this;
    code = (code||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4);
    if(code.length !== 4){ this._set("error","A room code is 4 characters."); return; }
    this._wantCode = code;
    this.code = code;
    saveCode(code);
    clearTimeout(this._retry);
    this._set("connecting","");

    /* Re-pairing to a different screen must not leave the old one driven. */
    if(this.conn){ try{ this.conn.close(); }catch(e){} this.conn = null; }

    if(this.peer && !this.peer.destroyed){
      this._dial();
      return;
    }
    this._destroyPeer();
    var peer = new Peer({debug:0});
    this.peer = peer;
    peer.on("open", function(){ self._dial(); });
    peer.on("error", function(err){
      var t = err && err.type;
      if(t === "peer-unavailable"){
        self._set("connecting","No screen answering on that code yet. Still trying…");
        self._scheduleRedial();
        return;
      }
      self._set("error", (err && err.message) || "Connection problem.");
      self._scheduleRedial();
    });
    peer.on("disconnected", function(){ try{ peer.reconnect(); }catch(e){} });
  },

  _dial:function(){
    var self = this;
    if(!this.peer || this.peer.destroyed || !this._wantCode) return;
    if(this.conn && this.conn.open) return;
    var conn = this.peer.connect(PEER_PREFIX + this._wantCode, {reliable:true});
    if(!conn){ this._scheduleRedial(); return; }
    this.conn = conn;
    this._wire(conn);
    /* connect() stays silent when the far side is absent, so give up and redial. */
    setTimeout(function(){
      if(self.conn === conn && !conn.open) self._scheduleRedial();
    }, 6000);
  },

  _scheduleRedial:function(){
    var self = this;
    if(this.role !== "host" || !this._wantCode) return;
    clearTimeout(this._retry);
    this._retry = setTimeout(function(){ self._dial(); }, 3000);
  },

  /* ---------- shared ---------- */
  _wire:function(conn){
    var self = this;
    conn.on("open", function(){
      self._set("connected","");
      /* The phone carries the running game, so it seeds a board that just
         opened or reloaded. The board never seeds the phone. */
      if(self.role === "host" && self._seed) self.send(self._seed());
    });
    conn.on("data", function(msg){
      if(!msg || msg.t !== "state") return;
      self.onState(sanitize(msg.s));
    });
    /* A reloading phone dials in again before the old channel reports closing,
       so a close that is not the current channel is stale and ignored. */
    conn.on("close", function(){
      if(self.conn !== conn) return;
      self.conn = null;
      self._set(self.role === "host" ? "connecting" : "waiting","");
      self._scheduleRedial();
    });
    conn.on("error", function(){
      if(self.conn !== conn) return;
      self.conn = null;
      self._scheduleRedial();
    });
  },

  send:function(state){
    if(this.conn && this.conn.open){
      try{ this.conn.send({t:"state", s:state}); }catch(e){}
    }
  },

  /* Host hands over a getter so a board that connects later can be caught up. */
  seedWith:function(fn){ this._seed = fn; },

  newCode:function(){
    if(this.role !== "board") return;
    if(this.conn){ try{ this.conn.close(); }catch(e){} this.conn = null; }
    saveCode("");
    this._startBoard(randomCode());
  },

  _destroyPeer:function(){
    if(this.peer){ try{ this.peer.destroy(); }catch(e){} }
    this.peer = null;
  }
};

window.BabyFeudSync = {
  Sync:Sync,
  newState:newState,
  loadState:loadState,
  saveState:saveState,
  loadCode:loadCode
};

})();
