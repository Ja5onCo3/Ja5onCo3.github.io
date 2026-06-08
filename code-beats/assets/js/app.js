/* ════════════════════════════════════════════
   CODE BEATS — Final (Phase 5)
   CodeMirror editor, How to Use modal,
   clean footer. All Phase 2–4 features intact.
   ════════════════════════════════════════════ */

// ── CodeMirror init ────────────────────────

const cmEditor = CodeMirror(document.getElementById('cm-wrapper'), {
  value: '',
  mode: 'javascript',
  theme: 'dracula',
  lineNumbers: true,
  indentWithTabs: false,
  tabSize: 2,
  lineWrapping: false,
  autofocus: false,
  extraKeys: {
    'Ctrl-Enter': () => document.getElementById('btn-run').click(),
  }
});

// ── Presets ────────────────────────────────
const PRESETS = {
  basic:
`// Basic Note
synth(sine)
bpm(120)
volume(0.8)
attack(0.02)
decay(0.1)
sustain(0.5)
release(0.8)
play(C4, 0.5)`,

  dreamy:
`// Dreamy Pad
synth(sine)
bpm(80)
volume(0.7)
attack(0.8)
decay(0.4)
sustain(0.7)
release(2.0)
reverb(0.8)
delay(0.3)
play(C4, 1.5)
play(E4, 1.5)
play(G4, 1.5)`,

  punchy:
`// Punchy Lead
synth(square)
bpm(140)
volume(0.75)
attack(0.001)
decay(0.05)
sustain(0.3)
release(0.1)
reverb(0.1)
play(C4, 0.2)
play(E4, 0.2)
play(G4, 0.2)
play(C5, 0.4)`,

  groove:
`// Groove
synth(sine)
bpm(95)
volume(0.7)
attack(0.02)
decay(0.1)
sustain(0.5)
release(0.4)
reverb(0.2)
kick([1,0,0,1,0,0,1,0])
snare([0,0,1,0,0,1,0,0])
hihat([1,0,1,1,0,1,1,0])
loop(true)`,

  hiphop:
`// Hip-Hop Beat
synth(sawtooth)
bpm(85)
volume(0.75)
attack(0.001)
decay(0.2)
sustain(0.4)
release(0.3)
reverb(0.15)
delay(0.2)
kick([1,0,0,0,0,0,1,0])
snare([0,0,0,1,0,0,0,1])
hihat([1,1,0,1,1,1,0,1])
loop(true)`,

  ambient:
`// Ambient Wash
synth(triangle)
bpm(60)
volume(0.65)
attack(1.5)
decay(0.8)
sustain(0.8)
release(3.0)
reverb(0.9)
delay(0.5)
play(C3, 3.0)
play(G3, 3.0)
play(E4, 3.0)`,

	PersPre:
`// Personal Mod
// Toggle mode — click grid cells to build your pattern
bpm(120)
volume(0.80)
synth(sine)
attack(0.05)
bass_attack(0.5)
decay(0.7)
bass_decay(1.0)
sustain(0.7)
bass_sustain(0.4)
release(0.03)
bass_release(0.3)
reverb(0.8)
bass_reverb(1.0)
kick([0,0,0,0,0,0,0,0])
snare([0,0,0,0,0,0,0,0])
hihat([0,0,0,0,0,0,0,0])
bass([C1,0,Eb2,0,C1,0,G2,0])
djembe([1,1,1,0,0,0,0,0])
tabla([1,0,0,0,0,0,0,0])
darbuka([1,0,1,0,1,0,0,0])
dunun([0,1,0,0,1,0,0,0])
conga([0,0,1,0,0,0,1,0])
taiko([0,1,1,1,0,0,0,0])
dhol([0,0,0,1,0,0,0,1])
framedrum([0,0,0,0,1,1,0,1])
instrument(electriccello)
play(C2, 1.0)
play(Eb2, 1.0)
play(G2, 1.0)
play(A2, 0.5)
play(F1, 0.5)
play(G1, 0.5)
melody_loop(true)
loop(true)`	
};

// ── Constants ──────────────────────────────
const VALID_NOTES = /^[A-Ga-g][#b]?\d$/;
const VALID_WAVES = ['sine', 'square', 'triangle', 'sawtooth'];
const STEPS       = 8;

// Instrument definitions
const INSTRUMENT_TYPES = {
  piano:         'sampler',
  electricpiano: 'sampler',
  violin:        'sampler',
	guitaracoustic:'sampler',
  pluckedbass:   'sampler',
  electriccello: 'sampler',
  organ:         'synth',
  warmpad:       'synth',
  atmosphere:    'synth',
  clavicylinder: 'synth',
};

const SAMPLER_URLS = {
  piano: {
    baseUrl: 'https://tonejs.github.io/audio/salamander/',
    urls: {
      'A0':'A0.mp3','C1':'C1.mp3','D#1':'Ds1.mp3','F#1':'Fs1.mp3',
      'A1':'A1.mp3','C2':'C2.mp3','D#2':'Ds2.mp3','F#2':'Fs2.mp3',
      'A2':'A2.mp3','C3':'C3.mp3','D#3':'Ds3.mp3','F#3':'Fs3.mp3',
      'A3':'A3.mp3','C4':'C4.mp3','D#4':'Ds4.mp3','F#4':'Fs4.mp3',
      'A4':'A4.mp3','C5':'C5.mp3','D#5':'Ds5.mp3','F#5':'Fs5.mp3',
      'A5':'A5.mp3','C6':'C6.mp3','D#6':'Ds6.mp3','F#6':'Fs6.mp3',
      'A7':'A7.mp3','C8':'C8.mp3',
    }
  },
  electricpiano: {
    baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/electric-piano/',
    urls: {
      'A2':'A2.mp3','A3':'A3.mp3','A4':'A4.mp3','A5':'A5.mp3',
      'C2':'C2.mp3','C3':'C3.mp3','C4':'C4.mp3','C5':'C5.mp3',
      'D#2':'Ds2.mp3','D#3':'Ds3.mp3','D#4':'Ds4.mp3','D#5':'Ds5.mp3',
      'F#2':'Fs2.mp3','F#3':'Fs3.mp3','F#4':'Fs4.mp3','F#5':'Fs5.mp3',
    }
  },
	violin: {
  baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/violin/',
  urls: {
    'A3':'A3.mp3','A4':'A4.mp3','A5':'A5.mp3',
    'C4':'C4.mp3','C5':'C5.mp3','C6':'C6.mp3',
    'E4':'E4.mp3','E5':'E5.mp3',
    'G3':'G3.mp3','G4':'G4.mp3','G5':'G5.mp3',
	  }
	},
	guitaracoustic: {
  	baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/',
  	urls: {
    	'A2':'A2.mp3','A3':'A3.mp3','A4':'A4.mp3',
	    'C3':'C3.mp3','C4':'C4.mp3','C5':'C5.mp3',
	    'E2':'E2.mp3','E3':'E3.mp3','E4':'E4.mp3',
	    'G2':'G2.mp3','G3':'G3.mp3','G4':'G4.mp3',
	  }
	},
  pluckedbass: {
    baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/bass-electric/',
    urls: {
      'A1':'A1.mp3','A2':'A2.mp3','A3':'A3.mp3','A4':'A4.mp3',
      'C2':'C2.mp3','C3':'C3.mp3','C4':'C4.mp3',
      'D#2':'Ds2.mp3','D#3':'Ds3.mp3','D#4':'Ds4.mp3',
      'F#2':'Fs2.mp3','F#3':'Fs3.mp3','F#4':'Fs4.mp3',
      'G2':'G2.mp3','G3':'G3.mp3','G4':'G4.mp3',
    }
  },
  electriccello: {
    baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/cello/',
    urls: {
      'A2':'A2.mp3','A3':'A3.mp3','A4':'A4.mp3',
      'C2':'C2.mp3','C3':'C3.mp3','C4':'C4.mp3',
      'D#2':'Ds2.mp3','D#3':'Ds3.mp3','D#4':'Ds4.mp3',
      'G2':'G2.mp3','G3':'G3.mp3','G4':'G4.mp3',
    }
  },
};

// ── State ──────────────────────────────────
const state = {
  melodySynth: null, melodyLoop: false, melodyNotes: [],
  kickSynth: null, snareSynth: null, hihatSynth: null,
  vol: null, analyser: null, reverbFx: null, delayFx: null, seqLoop: null,
  waveType: 'sine', bpm: 120, volume: 0.8,
  loopEnabled: false, isPlaying: false, currentStep: -1, toggleMode: false,
  adsr: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
  fx:   { reverb: 0.0, delay: 0.0 },
  patterns: {
    kick:  new Array(STEPS).fill(0),
    snare: new Array(STEPS).fill(0),
    hihat: new Array(STEPS).fill(0),
  },
  bassWaveType: 'sine',
  bassVolume:   0.85,
  bassPattern:  ['0','0','0','0','0','0','0','0'],
  bassAdsr: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.4 },
  bassFx:   { reverb: 0.0, delay: 0.0 },
  bassSynth:    null,
  bassVol:      null,
  bassReverbFx: null,
  bassDelayFx:  null,

  //Percussion
  activeDrum:     'djembe',
  percVolumes:    { djembe: 0.8, tabla: 0.8, darbuka: 0.8, talking: 0.8, dunun: 0.8, cajon: 0.8, conga: 0.8, taiko: 0.8, dhol: 0.8, framedrum: 0.8 },
  percPatterns:   { djembe: new Array(STEPS).fill(0), tabla: new Array(STEPS).fill(0), darbuka: new Array(STEPS).fill(0), talking: new Array(STEPS).fill(0), dunun: new Array(STEPS).fill(0), cajon: new Array(STEPS).fill(0), conga: new Array(STEPS).fill(0), taiko: new Array(STEPS).fill(0), dhol: new Array(STEPS).fill(0), framedrum: new Array(STEPS).fill(0) },
  percSynths:     {},

  // Melodic instruments
activeInstrument:    'piano',
melodicVolumes: {
  piano: 0.8, electricpiano: 0.8, organ: 0.8,
  warmpad: 0.8, atmosphere: 0.8, clavicylinder: 0.8,
  pluckedbass: 0.8, electriccello: 0.8,
  violin: 0.8, guitaracoustic: 0.8,
},
melodicSynths:       {},
melodicLoaded:       {},

};

cmEditor.on('change', (instance, changeObj) => {
  if (changeObj.origin !== 'setValue') {
    state.toggleMode = false;
  }
});


// ── DOM refs ───────────────────────────────
const btnRun          = document.getElementById('btn-run');
const btnStop         = document.getElementById('btn-stop');
const btnLoop         = document.getElementById('btn-loop');
const btnClear        = document.getElementById('btn-clear');
const btnHelp         = document.getElementById('btn-help');
const modalOverlay    = document.getElementById('modal-overlay');
const modalClose      = document.getElementById('modal-close');
const statusEl        = document.getElementById('status');
const rdWave          = document.getElementById('rd-wave');
const rdBpm           = document.getElementById('rd-bpm');
const rdVol           = document.getElementById('rd-vol');
const rdNote          = document.getElementById('rd-note');
const rdDur           = document.getElementById('rd-dur');
const rdLoop          = document.getElementById('rd-loop');
const rdAttack        = document.getElementById('rd-attack');
const rdDecay         = document.getElementById('rd-decay');
const rdSustain       = document.getElementById('rd-sustain');
const rdRelease       = document.getElementById('rd-release');
const rdReverb        = document.getElementById('rd-reverb');
const rdDelay         = document.getElementById('rd-delay');
const barReverb       = document.getElementById('bar-reverb');
const barDelay        = document.getElementById('bar-delay');
const consoleEl       = document.getElementById('console-log');
const canvas          = document.getElementById('waveform-canvas');
const ctx2d           = canvas.getContext('2d');
const adsrCanvas      = document.getElementById('adsr-canvas');
const adsrCtx         = adsrCanvas.getContext('2d');
const rdBassWave      = document.getElementById('rd-bass-wave');
const rdBassVol       = document.getElementById('rd-bass-vol');
const rdBassReverb    = document.getElementById('rd-bass-reverb');
const rdBassSynth     = document.getElementById('rd-bass-synth');
const rdBassAttack    = document.getElementById('rd-bass-attack');
const rdBassDecay     = document.getElementById('rd-bass-decay');
const rdBassSustain   = document.getElementById('rd-bass-sustain');
const rdBassRelease   = document.getElementById('rd-bass-release');
const rdBassDelay     = document.getElementById('rd-bass-delay');
const btnPercussion   = document.getElementById('btn-percussion');
const percOverlay     = document.getElementById('percussion-overlay');
const percClose       = document.getElementById('percussion-close');
const activeDrumEl    = document.getElementById('active-drum');
const rdPercVol       = document.getElementById('rd-drum-vol');
const percSeqGrid     = document.getElementById('perc-seq-grid');
const percStepNumbers = document.getElementById('perc-step-numbers');
const activePatternEl = document.getElementById('active-patterns');
const btnMelodic          = document.getElementById('btn-melodic');
const melodicOverlay      = document.getElementById('melodic-overlay');
const melodicClose        = document.getElementById('melodic-close');
const activeInstrumentEl  = document.getElementById('active-instrument-name');
const melodicStatusEl     = document.getElementById('melodic-status');
const rdMelodicVol        = document.getElementById('rd-melodic-vol');
const melodicRefPlay      = document.getElementById('melodic-ref-play');
const melodicRefVol       = document.getElementById('melodic-ref-vol');
const melodicRefSelect    = document.getElementById('melodic-ref-select');

// ── Help modal ─────────────────────────────
btnHelp.addEventListener('click', () => modalOverlay.classList.add('open'));
modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) modalOverlay.classList.remove('open'); });

// Percussion drawer
btnPercussion.addEventListener('click', () => percOverlay.classList.add('open'));
percClose.addEventListener('click', () => percOverlay.classList.remove('open'));
percOverlay.addEventListener('click', e => {
  if (e.target === percOverlay) percOverlay.classList.remove('open');
});

// Melodic drawer
btnMelodic.addEventListener('click', () => melodicOverlay.classList.add('open'));
melodicClose.addEventListener('click', () => melodicOverlay.classList.remove('open'));
melodicOverlay.addEventListener('click', e => {
  if (e.target === melodicOverlay) melodicOverlay.classList.remove('open');
});

// Instrument button selection
document.querySelectorAll('.melodic-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.melodic-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const inst = btn.dataset.instrument;
    activeInstrumentEl.textContent = btn.textContent;
    melodicRefPlay.textContent   = `${inst}(C4, 0.5)`;
    melodicRefVol.textContent    = `inst_vol(${inst}, 0.8)`;
    melodicRefSelect.textContent = `instrument(${inst})`;
  });
});

// Escape key closes both drawers
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    percOverlay.classList.remove('open');
    melodicOverlay.classList.remove('open');
    modalOverlay.classList.remove('open');
  }
});

// ── Console ────────────────────────────────
function log(msg, type = 'info') {
  const span = document.createElement('span');
  span.className = `log-${type}`;
  span.textContent = msg;
  consoleEl.appendChild(span);
  consoleEl.appendChild(document.createElement('br'));
  consoleEl.scrollTop = consoleEl.scrollHeight;
}
function setStatus(label, cls) {
  statusEl.textContent = label;
  statusEl.className = `status-pill ${cls}`;
}

// ── ADSR visualizer ────────────────────────
function resizeADSR() {
  adsrCanvas.width  = adsrCanvas.offsetWidth;
  adsrCanvas.height = adsrCanvas.offsetHeight;
}
resizeADSR();
window.addEventListener('resize', resizeADSR);

function drawADSR() {
  resizeADSR();
  const W = adsrCanvas.width, H = adsrCanvas.height;
  const { attack, decay, sustain, release } = state.adsr;
  adsrCtx.clearRect(0, 0, W, H);
  const total = attack + decay + 0.3 + release;
  const aW = (attack / total) * W, dW = (decay / total) * W;
  const sW = (0.3 / total) * W,   rW = (release / total) * W;
  const pad = 6, top = pad, bot = H - pad;
  const susY = top + (1 - sustain) * (bot - top);
  adsrCtx.beginPath();
  adsrCtx.strokeStyle = '#00ffe7';
  adsrCtx.lineWidth   = 1.5;
  adsrCtx.shadowColor = '#00ffe7';
  adsrCtx.shadowBlur  = 4;
  adsrCtx.moveTo(0, bot);
  adsrCtx.lineTo(aW, top);
  adsrCtx.lineTo(aW + dW, susY);
  adsrCtx.lineTo(aW + dW + sW, susY);
  adsrCtx.lineTo(aW + dW + sW + rW, bot);
  adsrCtx.stroke();
  adsrCtx.lineTo(0, bot);
  adsrCtx.closePath();
  const grad = adsrCtx.createLinearGradient(0, top, 0, bot);
  grad.addColorStop(0, 'rgba(0,255,231,0.15)');
  grad.addColorStop(1, 'rgba(0,255,231,0.01)');
  adsrCtx.fillStyle = grad;
  adsrCtx.fill();
}
setTimeout(drawADSR, 100);

function buildSynthInstrument(name, vol) {
  const configs = {
    organ: () => new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope:   { attack: 0.01, decay: 0.01, sustain: 1.0, release: 0.2 },
    }),
    warmpad: () => new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope:   { attack: 0.8, decay: 0.4, sustain: 0.7, release: 2.0 },
    }),
    atmosphere: () => new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope:   { attack: 1.5, decay: 0.8, sustain: 0.8, release: 3.0 },
    }),
    clavicylinder: () => new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope:   { attack: 0.001, decay: 0.4, sustain: 0.1, release: 0.8 },
    }),
  };

  const synth = configs[name]();
  synth.chain(vol, Tone.getDestination());
  state.melodicSynths[name]  = synth;
  state.melodicLoaded[name]  = true;
  log(`// ${name} ready.`, 'ok');
}

async function loadInstrument(name) {
  // Already loaded
  if (state.melodicLoaded[name]) return state.melodicSynths[name];

  // Update UI to loading state
  const btn = document.querySelector(`.melodic-btn[data-instrument="${name}"]`);
  if (btn) btn.classList.add('loading');
  melodicStatusEl.innerHTML = '<span class="status-loading">⟳ Loading...</span>';
  log(`// Loading ${name}...`, 'info');

  const vol = new Tone.Volume(Tone.gainToDb(state.melodicVolumes[name]));

  if (INSTRUMENT_TYPES[name] === 'synth') {
    buildSynthInstrument(name, vol);
  } else {
    // Sampler
    const cfg = SAMPLER_URLS[name];
    await new Promise((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls:    cfg.urls,
        baseUrl: cfg.baseUrl,
        onload:  resolve,
        onerror: (err) => {
					log(`// Error loading ${name}: ${err}`, 'err');
					reject(err);
				},
      }).chain(vol, Tone.getDestination());
      state.melodicSynths[name] = sampler;
    }).catch(err => {
			log(`// Failed to load ${name} - check network or CORS.`);			
			if (btn) { btn.classList.remove('loading'); btn.classList.add('loaded'); }
			melodicStatusEl.innerHTML = '<span class="status-loaded" style="color:var(--accent2)">● Failed to load</span>';
			return null;
		});
    state.melodicLoaded[name] = true;
    log(`// ${name} samples loaded.`, 'ok');
  }

  // Update UI to loaded state
  if (btn) {
    btn.classList.remove('loading');
    btn.classList.add('loaded');
  }
  melodicStatusEl.innerHTML = '<span class="status-loaded">● Loaded</span>';

  return state.melodicSynths[name];
}

// ── Build perc step numbers ─────────────────────────
function buildPercStepNumbers() {
  percStepNumbers.innerHTML = '';
  for (let i = 1; i <= STEPS; i++) {
    const d = document.createElement('div');
    d.className = 'perc-step-num';
    d.textContent = i;
    percStepNumbers.appendChild(d);
  }
}
buildPercStepNumbers();

// ── Build perc sequencer grid ─────────────────────────
function buildPercGrid() {
  percSeqGrid.innerHTML = '';
  const pattern = state.percPatterns[state.activeDrum];
  pattern.forEach((on, i) => {
    const cell = document.createElement('div');
    cell.className = 'perc-cell' + (on ? ' on' : '');
    cell.addEventListener('click', () => {
      state.percPatterns[state.activeDrum][i] ^= 1;
      cell.classList.toggle('on', state.percPatterns[state.activeDrum][i] === 1);
      updateActivePatterns();
    });
    percSeqGrid.appendChild(cell);
  });
}
buildPercGrid();

// ── Update active patterns display ───────────────────

function updateActivePatterns() {
  const active = Object.entries(state.percPatterns)
    .filter(([, pattern]) => pattern.some(v => v === 1))
    .map(([name, pattern]) => ({ name, pattern }));

  if (active.length === 0) {
    activePatternEl.innerHTML = '<span class="no-patterns">// No patterns set</span>';
    return;
  }

  activePatternEl.innerHTML = active.map(({ name, pattern }) =>
    `<div class="pattern-line">${name}([${pattern.join(',')}])</div>`
  ).join('');

}

function updateCodeRef() {
  const drum = state.activeDrum;
  const refLines = document.querySelectorAll('.ref-cmd');
  if (refLines[0]) refLines[0].textContent = `${drum}([1,0,0,1,0,0,1,0])`;
  if (refLines[1]) refLines[1].textContent = `perc_vol(${drum}, 0.8)`;
}

// ── Drum button selection ────────────────────

document.querySelectorAll('.perc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.perc-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeDrum = btn.dataset.drum;
    activeDrumEl.textContent = btn.textContent;
    rdPercVol.textContent = state.percVolumes[state.activeDrum].toFixed(2);
    buildPercGrid();
    updateCodeRef();
  });
});

// ── Step numbers & drum grids ──────────────
function buildStepNumbers() {
  const bar = document.getElementById('step-numbers');
  bar.innerHTML = '';
  for (let i = 1; i <= STEPS; i++) {
    const d = document.createElement('div');
    d.className = 'step-num';
    d.textContent = i;
    bar.appendChild(d);
  }
}
buildStepNumbers();

function buildDrumGrid(instrument) {
  const grid = document.getElementById(`grid-${instrument}`);
  grid.innerHTML = '';
  const pattern = instrument === 'bass' ? state.bassPattern : state.patterns[instrument];
  pattern.forEach((val, i) => {
    const cell = document.createElement('div');
    const isOn = instrument === 'bass' ? val !== '0' : val === 1;
    cell.className = 'drum-cell' + (isOn ? ' on' : '');
    cell.addEventListener('click', () => {
      if (instrument === 'bass') {
        state.bassPattern[i] = state.bassPattern[i] !== '0' ? '0' : 'C2';
      } else {
        state.patterns[instrument][i] ^= 1;
      }
      cell.classList.toggle('on', instrument === 'bass'
        ? state.bassPattern[i] !== '0'
        : state.patterns[instrument][i] === 1);
      state.toggleMode = true;
      syncEditorFromGrid();
    });
    grid.appendChild(cell);
  });
}

function syncEditorFromGrid() {
  if (!state.toggleMode) return;
  const kick  = state.patterns.kick.join(',');
  const snare = state.patterns.snare.join(',');
  const hihat = state.patterns.hihat.join(',');
  const bass  = state.bassPattern.join(',');

  const code =
`// Toggle mode — click grid cells to build your pattern
bpm(${state.bpm})
volume(${state.volume.toFixed(2)})
kick([${kick}])
snare([${snare}])
hihat([${hihat}])
bass([${bass}])
loop(true)`;

  cmEditor.setValue(code);
}

function buildAllGrids() { ['kick','snare','hihat','bass'].forEach(buildDrumGrid); }
buildAllGrids();

function highlightStep(step) {
  ['kick','snare','hihat','bass'].forEach(inst => {
    document.querySelectorAll(`#grid-${inst} .drum-cell`).forEach((c, i) => {
      c.classList.toggle('active', i === step);
    });
  });
}

// ── Audio init ─────────────────────────────
async function initAudio() {
  await Tone.start();
  if (state.melodySynth) return;

  state.analyser = new Tone.Analyser('waveform', 256);
  state.vol      = new Tone.Volume(Tone.gainToDb(state.volume));
  state.reverbFx = new Tone.Reverb({ decay: 3, wet: state.fx.reverb });
  state.delayFx  = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: state.fx.delay });
  await state.reverbFx.generate();

  state.melodySynth = new Tone.Synth({
    oscillator: { type: state.waveType },
    envelope:   { ...state.adsr },
  }).chain(state.delayFx, state.reverbFx, state.vol, state.analyser, Tone.getDestination());

  state.kickSynth  = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 8, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 } }).chain(state.vol, Tone.getDestination());
  state.snareSynth = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).chain(state.vol, Tone.getDestination());
  state.hihatSynth = new Tone.MetalSynth({ frequency: 400, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5, envelope: { attack: 0.001, decay: 0.05, release: 0.01 } }).chain(state.vol, Tone.getDestination());
  state.bassReverbFx = new Tone.Reverb({ decay: 3, wet: state.bassFx.reverb });
  state.bassDelayFx  = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: state.bassFx.delay });
  await state.bassReverbFx.generate();

  state.bassVol    = new Tone.Volume(Tone.gainToDb(state.bassVolume));
  state.bassSynth  = new Tone.Synth({
    oscillator: { type: state.bassWaveType },
    envelope:   { ...state.bassAdsr },
  }).chain(state.bassDelayFx, state.bassReverbFx, state.bassVol, Tone.getDestination());

// ── Percussion synths — distinct per instrument ──
const percConfigs = {
  djembe:    { type: 'membrane', pitch: 'C2',  pitchDecay: 0.08, octaves: 6,  decay: 0.4  },
  tabla:     { type: 'metal',    pitch: 'G3',  decay: 0.08, harmonicity: 3.5, modulationIndex: 16, resonance: 3200, octaves: 1.2 },
  darbuka:   { type: 'membrane', pitch: 'G2',  pitchDecay: 0.04, octaves: 4,  decay: 0.15 },
  talking:   { type: 'membrane', pitch: 'A2',  pitchDecay: 0.18, octaves: 9,  decay: 0.25 },
  dunun:     { type: 'membrane', pitch: 'A1',  pitchDecay: 0.15, octaves: 10, decay: 0.6  },
  cajon:     { type: 'noise',    color: 'pink', decay: 0.18 },
  conga:     { type: 'membrane', pitch: 'E2',  pitchDecay: 0.05, octaves: 4,  decay: 0.2  },
  taiko:     { type: 'membrane', pitch: 'C1',  pitchDecay: 0.2,  octaves: 12, decay: 0.8  },
  dhol:      { type: 'membrane', pitch: 'D1',  pitchDecay: 0.1,  octaves: 7,  decay: 0.35 },
  framedrum: { type: 'metal',    pitch: 'A3',  decay: 0.12, harmonicity: 2.1, modulationIndex: 8,  resonance: 2800, octaves: 0.8 },
};

Object.entries(percConfigs).forEach(([name, cfg]) => {
  const vol = new Tone.Volume(Tone.gainToDb(state.percVolumes[name]));
  let synth;

  if (cfg.type === 'membrane') {
    synth = new Tone.MembraneSynth({
      pitchDecay: cfg.pitchDecay,
      octaves:    cfg.octaves,
      envelope:   { attack: 0.001, decay: cfg.decay, sustain: 0, release: 0.1 },
    });

  } else if (cfg.type === 'metal') {
    synth = new Tone.MetalSynth({
      frequency:       cfg.pitch ? Tone.Frequency(cfg.pitch).toFrequency() : 400,
      harmonicity:     cfg.harmonicity,
      modulationIndex: cfg.modulationIndex,
      resonance:       cfg.resonance,
      octaves:         cfg.octaves,
      envelope:        { attack: 0.001, decay: cfg.decay, release: 0.01 },
    });

  } else if (cfg.type === 'noise') {
    synth = new Tone.NoiseSynth({
      noise:    { type: cfg.color || 'brown' },
      envelope: { attack: 0.001, decay: cfg.decay, sustain: 0, release: 0.05 },
    });
  }
  synth.chain(vol, Tone.getDestination());                                                                                    
  state.percSynths[name] = { synth, vol, pitch: cfg.pitch || null, type: cfg.type };  
});
// Pre-load synthesized melodic instruments
const synthInstruments = ['organ', 'warmpad', 'atmosphere', 'clavicylinder'];
synthInstruments.forEach(name => {
  const vol = new Tone.Volume(Tone.gainToDb(state.melodicVolumes[name]));
  buildSynthInstrument(name, vol);
});
log('// Audio context started. Ready.', 'ok');
setStatus('● READY', 'ready');
startOscilloscope();
}  

// ── Oscilloscope ───────────────────────────
function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function startOscilloscope() {
  function draw() {
    requestAnimationFrame(draw);
    if (!state.analyser) return;
    const values = state.analyser.getValue();
    const W = canvas.width, H = canvas.height;
    ctx2d.clearRect(0, 0, W, H);
    ctx2d.beginPath();
    ctx2d.strokeStyle = state.isPlaying ? '#00ffe7' : '#1e2a38';
    ctx2d.lineWidth = 1.5;
    values.forEach((v, i) => {
      const x = (i / values.length) * W, y = ((v + 1) / 2) * H;
      i === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y);
    });
    ctx2d.stroke();
  }
  draw();
}

// ── Drum loop ──────────────────────────────
function startDrumLoop() {
  stopDrumLoop();
  Tone.getTransport().bpm.value = state.bpm;
  let step = 0;
  state.seqLoop = new Tone.Sequence((time) => {
    state.currentStep = step;
    Tone.getDraw().schedule(() => { highlightStep(step); }, time);
    if (state.patterns.kick[step])  { state.kickSynth.triggerAttackRelease('C1', '8n', time); state.isPlaying = true; }
    if (state.patterns.snare[step]) { state.snareSynth.triggerAttackRelease('8n', time); state.isPlaying = true; }
    if (state.patterns.hihat[step]) { state.hihatSynth.triggerAttackRelease('32n', time); state.isPlaying = true; }
    if (state.melodyLoop && state.melodyNotes.length > 0) {
      const noteCount = state.melodyNotes.length;
      const noteStep = Math.floor(STEPS / noteCount);
      state.melodyNotes.forEach((n, idx) => {
        if (step === idx * noteStep) {
          const activeSynth = state.melodicSynths[n.instrument || state.activeInstrument];
					const fallback = state.melodySynth;
					const synthToUse = (activeSynth && state.melodicLoaded[n.instrument || state.activeInstrument])
						? activeSynth
						: fallback;
					synthToUse.triggerAttackRelease(n.note, n.dur, time);
					Tone.getDraw().schedule(() => {
						rdNote.textContent = n.note;
						rdDur.textContent = `${n.dur}s`;
          }, time);
        }
      });
    }

    if (state.bassPattern.some(n => n !== '0')) {
      const bassNote = state.bassPattern[step];
      if (bassNote !== '0') {
        state.bassSynth.triggerAttackRelease(bassNote, '8n', time);
        Tone.getDraw().schedule(() => {
          rdNote.textContent = bassNote;
        }, time);
      }
    }
    //---Exotic percussion ------
    Object.entries(state.percPatterns).forEach(([name, pattern]) => {
      if (pattern[step] && state.percSynths[name]) {
        const { synth, pitch } = state.percSynths[name];
        synth.triggerAttackRelease(pitch, '8n', time);
        state.isPlaying = true;
      }
    });

    step = (step + 1) % STEPS;
  }, [...Array(STEPS).keys()], '8n');
  state.seqLoop.start(0);
  Tone.getTransport().start();
  setStatus('↺ LOOPING', 'loop');
  log('// Drum loop started.', 'ok');
}

function stopDrumLoop() {
  if (state.seqLoop) { state.seqLoop.stop(); state.seqLoop.dispose(); state.seqLoop = null; }
  Tone.getTransport().stop();
  highlightStep(-1);
  state.isPlaying = false;
  state.currentStep = -1;
}

function applyEnvelope() {
  if (!state.melodySynth) return;
  const { attack, decay, sustain, release } = state.adsr;
  state.melodySynth.envelope.attack  = attack;
  state.melodySynth.envelope.decay   = decay;
  state.melodySynth.envelope.sustain = sustain;
  state.melodySynth.envelope.release = release;
}
// ── Code execution ─────────────────────────
async function executeCode(code) {
  const commands = [];
  code.split('\n').forEach((raw, idx) => {
    const t = raw.trim();
    if (t && !t.startsWith('//')) commands.push({ text: t, lineNum: idx + 1 });
  });
  if (commands.length === 0) { log('// No executable commands found.', 'err'); return; }
  log(`// Executing ${commands.length} command(s)...`, 'info');

  const melodyNotes = [];
// Pre-load any instrument() commands found before executing
const preloadMatches = code.match(/^instrument\(\s*(\w+)\s*\)/gmi);
if (preloadMatches) {
  for (const match of preloadMatches) {
    const nameMatch = match.match(/^instrument\(\s*(\w+)\s*\)/i);
    if (nameMatch && INSTRUMENT_TYPES[nameMatch[1].toLowerCase()]) {
      loadInstrument(nameMatch[1].toLowerCase());
    }
  }
}
  commands.forEach(({ text: line, lineNum }) => {
    let m;

    if ((m = line.match(/^play\(\s*([A-Ga-g][#b]?\d)\s*,\s*([\d.]+)\s*\)$/i))) {
      const note = m[1].charAt(0).toUpperCase() + m[1].slice(1), dur = parseFloat(m[2]);
      if (!VALID_NOTES.test(note)) { log(`// Line ${lineNum}: invalid note "${note}".`, 'err'); return; }
      if (isNaN(dur) || dur <= 0 || dur > 8) { log(`// Line ${lineNum}: duration must be 0.1–8 s.`, 'err'); return; }
      melodyNotes.push({ note, dur }); return;
    }
    if ((m = line.match(/^bpm\(\s*(\d+)\s*\)$/i))) {
      const val = parseInt(m[1]);
      if (val < 40 || val > 240) { log(`// Line ${lineNum}: bpm must be 40–240.`, 'err'); return; }
      state.bpm = val; Tone.getTransport().bpm.value = val; rdBpm.textContent = val;
      log(`// bpm → ${val}`, 'ok'); return;
    }
    if ((m = line.match(/^synth\(\s*(\w+)\s*\)$/i))) {
      const wave = m[1].toLowerCase();
      if (!VALID_WAVES.includes(wave)) { log(`// Line ${lineNum}: unknown waveform "${wave}".`, 'err'); return; }
      state.waveType = wave;
      if (state.melodySynth) state.melodySynth.oscillator.type = wave;
      rdWave.textContent = wave.toUpperCase();
      log(`// synth → ${wave}`, 'ok'); return;
    }
    if ((m = line.match(/^volume\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: volume must be 0.0–1.0.`, 'err'); return; }
      state.volume = val;
      if (state.vol) state.vol.volume.value = Tone.gainToDb(val);
      rdVol.textContent = val.toFixed(2); log(`// volume → ${val.toFixed(2)}`, 'ok'); return;
    }
    if ((m = line.match(/^loop\(\s*(true|false)\s*\)$/i))) {
      const val = m[1].toLowerCase() === 'true';
      state.loopEnabled = val; rdLoop.textContent = val ? 'ON' : 'OFF';
      btnLoop.classList.toggle('active', val);
      log(`// loop → ${val}`, 'ok'); return;
    }
    if ((m = line.match(/^melody_loop\(\s*(true|false)\s*\)$/i))) {
      state.melodyLoop = m[1].toLowerCase() === 'true';
      log(`// melody_loop → ${state.melodyLoop}`, 'ok'); return;
    }
    if ((m = line.match(/^attack\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0.001 || val > 2) { log(`// Line ${lineNum}: attack must be 0.001–2.0 s.`, 'err'); return; }
      state.adsr.attack = val; applyEnvelope(); rdAttack.textContent = val.toFixed(3); drawADSR();
      log(`// attack → ${val.toFixed(3)}`, 'ok'); return;
    }
    if ((m = line.match(/^decay\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0.001 || val > 2) { log(`// Line ${lineNum}: decay must be 0.001–2.0 s.`, 'err'); return; }
      state.adsr.decay = val; applyEnvelope(); rdDecay.textContent = val.toFixed(3); drawADSR();
      log(`// decay → ${val.toFixed(3)}`, 'ok'); return;
    }
    if ((m = line.match(/^sustain\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: sustain must be 0.0–1.0.`, 'err'); return; }
      state.adsr.sustain = val; applyEnvelope(); rdSustain.textContent = val.toFixed(2); drawADSR();
      log(`// sustain → ${val.toFixed(2)}`, 'ok'); return;
    }
    if ((m = line.match(/^release\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0.001 || val > 4) { log(`// Line ${lineNum}: release must be 0.001–4.0 s.`, 'err'); return; }
      state.adsr.release = val; applyEnvelope(); rdRelease.textContent = val.toFixed(3); drawADSR();
      log(`// release → ${val.toFixed(3)}`, 'ok'); return;
    }
    if ((m = line.match(/^reverb\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: reverb must be 0.0–1.0.`, 'err'); return; }
      state.fx.reverb = val;
      if (state.reverbFx) state.reverbFx.wet.value = val;
      rdReverb.textContent = val.toFixed(2); barReverb.style.width = `${val * 100}%`;
      log(`// reverb → ${val.toFixed(2)}`, 'ok'); return;
    }
    if ((m = line.match(/^delay\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: delay must be 0.0–1.0.`, 'err'); return; }
      state.fx.delay = val;
      if (state.delayFx) state.delayFx.wet.value = val;
      rdDelay.textContent = val.toFixed(2); barDelay.style.width = `${val * 100}%`;
      log(`// delay → ${val.toFixed(2)}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_synth\(\s*(\w+)\s*\)$/i))) {
      const wave = m[1].toLowerCase();
      if (!VALID_WAVES.includes(wave)) { log(`// Line ${lineNum}: unknown waveform "${wave}".`, 'err'); return; }
      state.bassWaveType = wave;
      if (state.bassSynth) state.bassSynth.oscillator.type = wave;
      if (state.bassVol) {
        const compensation = { sine: 6, triangle: 4, square: 0, sawtooth: 0 };
        const boost = compensation[wave] ?? 0;
        state.bassVol.volume.value = Tone.gainToDb(state.bassVolume) + boost;
      }

      rdBassWave.textContent = wave.toUpperCase();
      log(`// bass_synth → ${wave}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_vol\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: bass_vol must be 0.0–1.0.`, 'err'); return; }
      state.bassVolume = val;
      if (state.bassVol) state.bassVol.volume.value = Tone.gainToDb(val);
      rdBassVol.textContent = val.toFixed(2);
      log(`// bass_vol → ${val.toFixed(2)}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_attack\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0.001 || val > 2) { log(`// Line ${lineNum}: bass attack must be 0.001–2.0 s.`, 'err'); return; }
      state.bassAdsr.attack = val;
      if (state.bassSynth) state.bassSynth.envelope.attack = val;
      rdBassAttack.textContent = val.toFixed(3);
      log(`// bass_attack → ${val.toFixed(3)}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_decay\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0.001 || val > 2) { log(`// Line ${lineNum}: bass decay must be 0.001–2.0 s.`, 'err'); return; }
      state.bassAdsr.decay = val;
      if (state.bassSynth) state.bassSynth.envelope.decay = val;
      rdBassDecay.textContent = val.toFixed(3);
      log(`// bass_decay → ${val.toFixed(3)}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_sustain\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: bass sustain must be 0.0–1.0.`, 'err'); return; }
      state.bassAdsr.sustain = val;
      if (state.bassSynth) state.bassSynth.envelope.sustain = val;
      rdBassSustain.textContent = val.toFixed(2);
      log(`// bass_sustain → ${val.toFixed(2)}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_release\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0.001 || val > 4) { log(`// Line ${lineNum}: bass release must be 0.001–2.0 s.`, 'err'); return; }
      state.bassAdsr.release = val;
      if (state.bassSynth) state.bassSynth.envelope.release = val;
      rdBassRelease.textContent = val.toFixed(3);
      log(`// bass_release → ${val.toFixed(3)}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_reverb\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: bass reverb must be 0.0–1.0.`, 'err'); return; }
      state.bassFx.reverb = val;
      if (state.bassReverbFx) state.bassReverbFx.wet.value = val;
      rdBassReverb.textContent = val.toFixed(2);
      log(`// bass_reverb → ${val.toFixed(2)}`, 'ok'); return;
    }
    if ((m = line.match(/^bass_delay\(\s*([\d.]+)\s*\)$/i))) {
      const val = parseFloat(m[1]);
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: bass delay must be 0.0–1.0.`, 'err'); return; }
      state.bassFx.delay = val;
      if (state.bassDelayFx) state.bassDelayFx.wet.value = val;
      rdBassDelay.textContent = val.toFixed(2);
      log(`// bass_delay → ${val.toFixed(2)}`, 'ok'); return;
    }
    const bassPatM = line.match(/^bass\(\s*\[([^\]]+)\]\s*\)$/i);
    if (bassPatM) {
      const raw = bassPatM[1].split(',').map(n => n.trim());
      if (raw.length !== STEPS) { log(`// Line ${lineNum}: bass pattern needs exactly ${STEPS} values. Got ${raw.length}.`, 'err'); return; }
      state.bassPattern = raw;
      buildDrumGrid('bass');
      log(`// bass → [${raw.join(',')}]`, 'ok'); return;
    }

    // perc_vol(drum, value)
    const percVolMatch = line.match(/^perc_vol\(\s*(\w+)\s*,\s*([\d.]+)\s*\)$/i);
    if (percVolMatch) {
      const drum = percVolMatch[1].toLowerCase();
      const val = parseFloat(percVolMatch[2]);
      if (!state.percPatterns[drum]) { log(`// Line ${lineNum}: unknown percussion "${drum}".`, 'err'); return; }
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: percussion volume must be 0.0–1.0.`, 'err'); return; }
      state.percVolumes[drum] = val;
      if (state.percSynths[drum]) state.percSynths[drum].vol.volume.value = Tone.gainToDb(val);
      log(`// perc_vol(${drum}, ${val.toFixed(2)})`, 'ok'); return;
    }
    // instrument(name) — set active instrument for play() routing         
    const instMatch = line.match(/^instrument\(\s*(\w+)\s*\)$/i);
    if (instMatch) {
      const name = instMatch[1].toLowerCase();
      if (!INSTRUMENT_TYPES[name]) { log(`// Line ${lineNum}: unknown instrument "${name}".`, 'err'); return; }
      state.activeInstrument = name;      
      const btn = document.querySelector(`.melodic-btn[data-instrument="${name}"]`);
      if (btn) {
        document.querySelectorAll('.melodic-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      activeInstrumentEl.textContent = name;
      log(`// instrument → ${name}`, 'ok');
      loadInstrument(name);
      return;
    }
    //inst_vol(name, value) — set instrument volume
    const instVolMatch = line.match(/^inst_vol\(\s*(\w+)\s*,\s*([\d.]+)\s*\)$/i);
    if (instVolMatch) {
      const name = instVolMatch[1].toLowerCase();
      const val  = parseFloat(instVolMatch[2]);
      if (!INSTRUMENT_TYPES[name]) { log(`// Line ${lineNum}: unknown instrument "${name}".`, 'err'); return; }
      if (isNaN(val) || val < 0 || val > 1) { log(`// Line ${lineNum}: inst_vol must be 0.0–1.0.`, 'err'); return; }
      state.melodicVolumes[name] = val;
      if (state.melodicSynths[name]) {
        const synth = state.melodicSynths[name];
        if (synth.volume) synth.volume.value = Tone.gainToDb(val);
      }
      rdMelodicVol.textContent = val.toFixed(2);
      log(`// inst_vol(${name}) → ${val.toFixed(2)}`, 'ok'); return;
    }
    // Individual instrument play commands
    // e.g. piano(C4, 0.5), marimba(D3, 0.3)
    const instrumentNames = Object.keys(INSTRUMENT_TYPES);      
    for (const name of instrumentNames) {
      const instPlayMatch = line.match(
        new RegExp(`^${name}\\(\\s*([A-Ga-g][#b]?\\d)\\s*,\\s*([\\d.]+)\\s*\\)$`, 'i')
      );
      if (instPlayMatch) {
        const note = instPlayMatch[1].charAt(0).toUpperCase() + instPlayMatch[1].slice(1);
        const dur  = parseFloat(instPlayMatch[2]);
        if (!VALID_NOTES.test(note)) { log(`// Line ${lineNum}: invalid note "${note}".`, 'err'); return; }
        if (isNaN(dur) || dur <= 0 || dur > 8) { log(`// Line ${lineNum}: duration must be 0.1–8 s.`, 'err'); return; }
        melodyNotes.push({ note, dur, instrument: name });
        return;
      }
    }
    // Individual drum pattern commands
    // e.g. djembe([1,0,0,1,0,0,1,0])
    const drumNames = Object.keys(state.percPatterns);
    for (const drum of drumNames) {
      const percPatMatch = line.match(new RegExp(`^${drum}\\(\\s*\\[([0-9,\\s]+)\\]\\s*\\)$`, 'i'));
      if (percPatMatch) {
        const parsed = parseDrum(percPatMatch[1], drum, lineNum);
        if (parsed) {
          state.percPatterns[drum] = parsed;
          if (state.activeDrum === drum) buildPercGrid();
          log(`// ${drum} → [${parsed.join(',')}]`, 'ok');
        }
        return;
      }
    }

    const kickM  = line.match(/^kick\(\s*\[([0-9,\s]+)\]\s*\)$/i);
    const snareM = line.match(/^snare\(\s*\[([0-9,\s]+)\]\s*\)$/i);
    const hihatM = line.match(/^hihat\(\s*\[([0-9,\s]+)\]\s*\)$/i);
    if (kickM)  { const p = parseDrum(kickM[1],  'kick',  lineNum); if (p) { state.patterns.kick  = p; buildDrumGrid('kick');  log(`// kick → [${p.join(',')}]`,  'ok'); } return; }
    if (snareM) { const p = parseDrum(snareM[1], 'snare', lineNum); if (p) { state.patterns.snare = p; buildDrumGrid('snare'); log(`// snare → [${p.join(',')}]`, 'ok'); } return; }
    if (hihatM) { const p = parseDrum(hihatM[1], 'hihat', lineNum); if (p) { state.patterns.hihat = p; buildDrumGrid('hihat'); log(`// hihat → [${p.join(',')}]`, 'ok'); } return; }

    log(`// Line ${lineNum}: unknown command → "${line}"`, 'err');
  });

	state.melodyNotes = melodyNotes;
  if (!state.melodyLoop && melodyNotes.length > 0) playMelody(melodyNotes);
  const hasPattern = Object.values(state.patterns).some(p => p.some(v => v === 1)) || state.bassPattern.some(n => n !== '0') || Object.values(state.percPatterns).some(p => p.some(v => v === 1));
  if (state.loopEnabled && hasPattern) startDrumLoop();
}

function parseDrum(raw, name, lineNum) {
  const arr = raw.split(',').map(n => parseInt(n.trim()));
  if (arr.length !== STEPS) { log(`// Line ${lineNum}: ${name} needs exactly ${STEPS} values. Got ${arr.length}.`, 'err'); return null; }
  if (arr.some(v => v !== 0 && v !== 1)) { log(`// Line ${lineNum}: ${name} values must be 0 or 1.`, 'err'); return null; }
  return arr;
}

function playMelody(notes) {
  if (!state.melodySynth) return;
  let delay = 0;
  notes.forEach(({ note, dur, instrument }) => {
    setTimeout(async () => {
      state.isPlaying = true;
      setStatus('● PLAYING', 'active');
      rdNote.textContent = note;
      rdDur.textContent  = `${dur}s`;

      const targetInstrument = instrument || state.activeInstrument;
      const activeSynth = state.melodicSynths[targetInstrument];

      if (activeSynth && state.melodicLoaded[targetInstrument]) {
        log(`// ${instrument ? instrument : 'play'}(${note}, ${dur})`, 'ok');
        activeSynth.triggerAttackRelease(note, dur);
      } else if (targetInstrument && INSTRUMENT_TYPES[targetInstrument]) {
        log(`// Loading ${targetInstrument} then playing ${note}...`, 'info');
        const synth = await loadInstrument(targetInstrument);
        if (synth) synth.triggerAttackRelease(note, dur);
      } else {
        log(`// play(${note}, ${dur})`, 'ok');
        state.melodySynth.triggerAttackRelease(note, dur);
      }

      setTimeout(() => {
        state.isPlaying = false;
        if (!state.loopEnabled) setStatus('● READY', 'ready');
      }, dur * 1000 + 50);
    }, delay);
    delay += dur * 1000 + 60;
  });
}

// ── Buttons ────────────────────────────────
btnRun.addEventListener('click', async () => {
  await initAudio();
  const code = cmEditor.getValue();

  // If editor is empty, check if any cells are toggled on
  if (!code.trim()) {
    const hasPattern = Object.values(state.patterns).some(p => p.some(v => v === 1))
                    || state.bassPattern.some(n => n !== '0')
										|| Object.values(state.percPatterns).some(p => p.some(v => v === 1));
    if (hasPattern) {
      const defaults =
`// Toggle mode — click grid cells to build your pattern
bpm(120)
volume(0.8)
loop(true)`;
      cmEditor.setValue(defaults);
      state.toggleMode = true;
      stopDrumLoop();
      executeCode(cmEditor.getValue());
    } else {
      log('// Editor is empty. Type commands or toggle sequencer cells.', 'err');
    }
    return;
  }

  stopDrumLoop();
  executeCode(code);
});

btnStop.addEventListener('click', () => {
  stopDrumLoop();
  if (state.melodySynth) state.melodySynth.triggerRelease();
  state.loopEnabled = false;
  rdLoop.textContent = 'OFF';
  btnLoop.classList.remove('active');
  setStatus('● READY', 'ready');
  log('// Stopped.', 'info');
});

btnLoop.addEventListener('click', async () => {
  await initAudio();
  state.loopEnabled = !state.loopEnabled;
  btnLoop.classList.toggle('active', state.loopEnabled);
  rdLoop.textContent = state.loopEnabled ? 'ON' : 'OFF';

  if (state.loopEnabled) {
    const hasPattern = Object.values(state.patterns).some(p => p.some(v => v === 1))
                    || state.bassPattern.some(n => n !== '0')
										|| Object.values(state.percPatterns).some(p => p.some(v => v === 1));
    if (!cmEditor.getValue().trim() || !hasPattern) {
      const defaults =
`// Toggle mode — click grid cells to build your pattern
bpm(120)
volume(0.8)
loop(true)`;
      cmEditor.setValue(defaults);
      state.toggleMode = true;
      stopDrumLoop();
      executeCode(cmEditor.getValue());
    } else {
      startDrumLoop();
    }
  } else {
    stopDrumLoop();
    setStatus('● READY', 'ready');
    log('// Loop disabled.', 'info');
  }
});

btnClear.addEventListener('click', () => { cmEditor.setValue(''); cmEditor.focus(); });

document.querySelectorAll('.btn-preset').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.preset;
    if (PRESETS[key]) {
      cmEditor.setValue(PRESETS[key]);
      cmEditor.focus();
      log(`// Preset loaded: ${key}`, 'info');
    }
  });
});

// Ctrl+Enter shortcut hint in console
log('// Tip: Ctrl+Enter to run. Click ? for command reference.', 'info');