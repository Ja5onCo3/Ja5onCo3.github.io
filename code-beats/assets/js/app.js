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

cmEditor.on('change', (instance, changeObj) => {
  if (changeObj.origin !== 'setValue') {
    state.toggleMode = false;
  }
})

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
play(E4, 3.0)`
};

// ── Constants ──────────────────────────────
const VALID_NOTES = /^[A-Ga-g][#b]?\d$/;
const VALID_WAVES = ['sine', 'square', 'triangle', 'sawtooth'];
const STEPS       = 8;

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
};

// ── DOM refs ───────────────────────────────
const btnRun       = document.getElementById('btn-run');
const btnStop      = document.getElementById('btn-stop');
const btnLoop      = document.getElementById('btn-loop');
const btnClear     = document.getElementById('btn-clear');
const btnHelp      = document.getElementById('btn-help');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const statusEl     = document.getElementById('status');
const rdWave       = document.getElementById('rd-wave');
const rdBpm        = document.getElementById('rd-bpm');
const rdVol        = document.getElementById('rd-vol');
const rdNote       = document.getElementById('rd-note');
const rdDur        = document.getElementById('rd-dur');
const rdLoop       = document.getElementById('rd-loop');
const rdAttack     = document.getElementById('rd-attack');
const rdDecay      = document.getElementById('rd-decay');
const rdSustain    = document.getElementById('rd-sustain');
const rdRelease    = document.getElementById('rd-release');
const rdReverb     = document.getElementById('rd-reverb');
const rdDelay      = document.getElementById('rd-delay');
const barReverb    = document.getElementById('bar-reverb');
const barDelay     = document.getElementById('bar-delay');
const consoleEl    = document.getElementById('console-log');
const canvas       = document.getElementById('waveform-canvas');
const ctx2d        = canvas.getContext('2d');
const adsrCanvas   = document.getElementById('adsr-canvas');
const adsrCtx      = adsrCanvas.getContext('2d');
const rdBassWave   = document.getElementById('rd-bass-wave');
const rdBassVol    = document.getElementById('rd-bass-vol');
const rdBassReverb = document.getElementById('rd-bass-reverb');
const rdBassSynth  = document.getElementById('rd-bass-synth');
const rdBassAttack = document.getElementById('rd-bass-attack');
const rdBassDecay  = document.getElementById('rd-bass-decay');
const rdBassSustain= document.getElementById('rd-bass-sustain');
const rdBassRelease= document.getElementById('rd-bass-release');
const rdBassDelay  = document.getElementById('rd-bass-delay');

// ── Help modal ─────────────────────────────
btnHelp.addEventListener('click', () => modalOverlay.classList.add('open'));
modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) modalOverlay.classList.remove('open'); });

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
          state.melodySynth.triggerAttackRelease(n.note, n.dur, time);
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

// ── Command parser ─────────────────────────
function executeCode(code) {
  const commands = [];
  code.split('\n').forEach((raw, idx) => {
    const t = raw.trim();
    if (t && !t.startsWith('//')) commands.push({ text: t, lineNum: idx + 1 });
  });
  if (commands.length === 0) { log('// No executable commands found.', 'err'); return; }
  log(`// Executing ${commands.length} command(s)...`, 'info');

  const melodyNotes = [];

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
  const hasPattern = Object.values(state.patterns).some(p => p.some(v => v === 1));
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
  notes.forEach(({ note, dur }) => {
    setTimeout(() => {
      state.isPlaying = true;
      setStatus('● PLAYING', 'active');
      rdNote.textContent = note;
      rdDur.textContent  = `${dur}s`;
      log(`// play(${note}, ${dur})`, 'ok');
      state.melodySynth.triggerAttackRelease(note, dur);
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
                    || state.bassPattern.some(n => n !== '0');
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
                    || state.bassPattern.some(n => n !== '0');
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