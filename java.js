const startBtn   = document.getElementById('startBtn');
const sequence   = document.getElementById('sequence');
const overlay    = document.querySelector('.overlay');
const textDisplay= document.getElementById('textDisplay');
const touchBtn   = document.getElementById('touchBtn');

const mapExperience = document.getElementById('mapExperience');
const peel         = document.getElementById('peel');
const systemToast  = document.getElementById('systemToast');
const dragInstruction = document.getElementById('dragInstruction');
const memoryModal  = document.getElementById('memoryModal');
const memoryText   = document.getElementById('memoryText');
const submitMemory = document.getElementById('submitMemory');
const cancelMemory = document.getElementById('cancelMemory');
const archive      = document.getElementById('archive');
const archiveItems = document.getElementById('archiveItems');


const meiText = [
  "My name is Mei. I’m part of Generation Leaf—the first to grow up without walls, bells, or desks.",
  "We don’t go to school. We grow through space.",
  "Our lessons live in air currents, root networks, and animal memories.",
  "EcoLink is how we connect. We touch it, and it touches back.",
  "Today, I’ve been assigned a new pulse: KP-01 — Red Panda / Memory / Migration.",
  "I place my palm on the living wall. It reads my breath rate, thermal trace, and mood spectrum.",
  "The surface hums and glows in return."
];

if (startBtn) {
  startBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    sequence.classList.remove('hidden');
    displayLines();
  });
} else {
  console.warn('[init] #startBtn not found at load');
}

let currentLine = 0;
function displayLines() {
  if (currentLine < meiText.length) {
    const line = document.createElement('p');
    line.textContent = meiText[currentLine];
    textDisplay.appendChild(line);
    currentLine++;
    setTimeout(displayLines, 2500);
  } else {
    touchBtn.classList.remove('hidden');
  }
}

touchBtn.addEventListener('click', () => {
  sequence.classList.add('hidden');
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
  window.scrollTo(0, 0);
  mapExperience.classList.remove('hidden');
  const ambient = document.getElementById('ambientAudio');
if (ambient) {
  ambient.volume = 0;           
  const fadeTo = 0.35;          
  const step = 0.02;           
  const iv = setInterval(() => {
    try { ambient.play(); } catch(e) {}
    ambient.volume = Math.min(fadeTo, ambient.volume + step);
    if (ambient.volume >= fadeTo) clearInterval(iv);
  }, 120); 
}
});


(() => {
  const set = (x, y) => {
    const px = (x / window.innerWidth) * 100;
    const py = (y / window.innerHeight) * 100;
    document.querySelectorAll('.overlay, #sequence').forEach(el => {
      el.style.setProperty('--mx', px + '%');
      el.style.setProperty('--my', py + '%');
    });
  };
  set(window.innerWidth / 2, window.innerHeight / 2);
  window.addEventListener('mousemove', e => set(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => {
    const t = e.touches && e.touches[0];
    if (t) set(t.clientX, t.clientY);
  }, { passive: true });
})();


const pathCards = document.querySelectorAll('.path-card');
let pathLocked = false;

pathCards.forEach(card => {
  card.addEventListener('click', () => {
    if (pathLocked) return;

    const path = card.dataset.path;
    if (path === 'elder') {
      pathLocked = true;
      card.classList.add('selected');
      pathCards.forEach(c => { if (c !== card) c.classList.add('locked'); });
      
      peel.classList.add('active');
      setTimeout(() => peel.classList.add('open'), 200);
      
      animateRoute();
    } else {
      toast("Only one path can be unlocked now. Elder’s Voice is available in this build.");
    }
  });
});


const mapSvg   = document.getElementById('migrationMap');
const hotspots = mapSvg ? mapSvg.querySelectorAll('.hotspot') : [];
let dragging = false;
let visitedCount = 0;

if (mapSvg) {
  mapSvg.addEventListener('pointerdown', () => {
    dragging = true;
    dragInstruction.classList.add('hidden');
  });
  window.addEventListener('pointerup', () => { dragging = false; });

  hotspots.forEach(h => {
    h.addEventListener('pointerenter', () => triggerIfDragging(h));
    h.addEventListener('click', () => triggerIfDragging(h, true)); 
  });
}

function triggerIfDragging(h, force = false) {
  if ((!dragging && !force) || h.classList.contains('visited')) return;
  h.classList.add('visited');
  visitedCount++;
  const fragId = h.getAttribute('data-frag');
  appendFragment(fragId, visitedCount);
  if (visitedCount >= 2) {
    setTimeout(() => {
      toast("Emotional resonance detected. Permission to leave a memory granted.");
      openMemoryModal();
    }, 600);
  }
}

function appendFragment(id, count) {
  const log = document.getElementById('fragmentLog');
  const div = document.createElement('div');
  div.className = 'fragment-point';

  if (count === 1) {
    div.innerHTML = `<strong>One point hums under my touch.</strong>`;
  } else if (id === 'A') {
    div.textContent = "“This habitat no longer exists. It was converted into a mining zone in 2034.”";
  } else if (id === 'B') {
    div.textContent = "A child’s voice: “I found a red panda once. It was sleeping in a tyre.”";
  } else {
    div.textContent = "A whisper over the hills.";
  }
  log.appendChild(div);
}


function animateRoute() {
  const pulse = document.getElementById('migPulse');
  if (!pulse) return;
  let len = 900, seg = 180, t = 0;
  const tick = () => {
    t = (t + 6) % (len + seg);
    pulse.setAttribute('stroke-dasharray', `${seg} ${len}`);
    pulse.setAttribute('stroke-dashoffset', String(len - t));
    raf = requestAnimationFrame(tick);
  };
  let raf = requestAnimationFrame(tick);
}


function openMemoryModal() {
  memoryModal.classList.remove('hidden');
  memoryText.focus();
}
function closeMemoryModal() {
  memoryModal.classList.add('hidden');
}
cancelMemory.addEventListener('click', closeMemoryModal);

submitMemory.addEventListener('click', () => {
  const val = (memoryText.value || "I hope someone finds them again.").trim();
  closeMemoryModal();

  
  const nextBtn = document.getElementById('nextChapterBtn');
  if (nextBtn) nextBtn.classList.remove('hidden');

  
  archive.classList.remove('hidden');
  const item = document.createElement('div');
  item.className = 'archive-entry';
  const time = new Date().toLocaleString();
  item.textContent = `"${val}"  — added ${time}`;
  archiveItems.appendChild(item);

  
  const log = document.getElementById('fragmentLog');
  const div = document.createElement('div');
  div.className = 'fragment-point';
  div.textContent = "I whisper: “I hope someone finds them again.”";
  log.appendChild(div);
});


let toastTimer = 0;
function toast(msg) {
  systemToast.textContent = msg;
  systemToast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => systemToast.classList.add('hidden'), 2800);
}

const nextBtn = document.getElementById('nextChapterBtn');
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    
    const ambient = document.getElementById('ambientAudio');
    if (ambient) {
      const iv = setInterval(() => {
        ambient.volume = Math.max(0, ambient.volume - 0.04);
        if (ambient.volume <= 0) { ambient.pause(); clearInterval(iv); }
      }, 100);
    }

    
    const ch1 = document.getElementById('mapExperience');
    if (ch1) ch1.classList.add('hidden');

    
    const chap2 = document.getElementById('chapter2');
    if (chap2) {
      chap2.classList.remove('hidden');
      chap2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    
    document.body.classList.add('theme-cyan');

    
    if (typeof initPenguinDome === 'function') initPenguinDome();

    const ambientAudio2 = document.getElementById('ambientAudio2');
    if (ambientAudio2) {
      ambientAudio2.volume = 0;
      const iv2 = setInterval(() => {
        try { ambientAudio2.play(); } catch(e) {}
        ambientAudio2.volume = Math.min(0.35, ambientAudio2.volume + 0.03);
        if (ambientAudio2.volume >= 0.35) clearInterval(iv2);
      }, 120);
    }
  });
}


function initPenguinDome() {
  
  if (window.__pdInited) return;
  window.__pdInited = true;

  
  const mix = document.getElementById('voiceMix');
  const mixer = document.getElementById('voiceMixer');
  const sciPane = mixer?.querySelector('.voice-science');
  const elderPane = mixer?.querySelector('.voice-elder');

  const applyMix = (val) => {
    
    const t = Math.max(0, Math.min(100, val||65));
    if (sciPane && elderPane) {
      const elderAlpha = 0.55 + (t/100)*0.35;  
      const sciAlpha   = 0.90 - (t/100)*0.45;  
      elderPane.style.opacity = String(elderAlpha);
      sciPane.style.opacity   = String(sciAlpha);
      
      elderPane.style.transform = `translateY(${(100-t)*0.04}px)`;
      sciPane.style.transform   = `translateY(${t*0.04}px)`;
    }
  };
  if (mix) {
    applyMix(mix.value);
    mix.addEventListener('input', e => applyMix(e.target.value));
  }

  
  const iceWall = document.getElementById('iceWall');
  const fragList = document.getElementById('penguinFragments');
  const pdQuestion = document.getElementById('pdQuestion');

  const frags = [
    { tag: 'sci',   text: `<strong>Scientist:</strong> “These readings don’t match. Can you verify source integrity?”` },
    { tag: 'whisp', text: `<strong>Whisper:</strong> “Why must every truth match a graph?”` },
    { tag: 'elder', text: `<strong>Elder:</strong> “We watched the sky more than the clock.”` },
    { tag: 'sci',   text: `<strong>AI:</strong> “Fragment set #27 joined. Confidence: 0.62.”` },
  ];
  let idx = 0;

  function pushFrag() {
    if (!fragList) return;
    const item = document.createElement('div');
    const f = frags[idx % frags.length];
    item.className = `frag ${f.tag==='sci'?'tag-sci':f.tag==='elder'?'tag-elder':'tag-whisp'}`;
    item.innerHTML = f.text;
    fragList.appendChild(item);
    idx++;

    
    if (idx === 4 && pdQuestion) {
  pdQuestion.classList.add('show');
  pdQuestion.setAttribute('aria-hidden', 'false');

  
  const wrap2 = document.getElementById('nextChapter2Wrap');
  if (wrap2) {
    wrap2.classList.remove('hidden');
    wrap2.classList.add('pop'); 
  }
}
  }

  if (iceWall) {
    iceWall.addEventListener('click', pushFrag);
    
    let holdTimer = null;
    iceWall.addEventListener('pointerdown', () => {
      holdTimer = setTimeout(pushFrag, 550);
    });
    window.addEventListener('pointerup', () => {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    });
  }const nextBtn2 = document.getElementById('nextChapter2Btn');
if (nextBtn2) {
  nextBtn2.addEventListener('click', () => {
    
    const ambientAudio2 = document.getElementById('ambientAudio2');
    if (ambientAudio2) {
      const iv = setInterval(() => {
        ambientAudio2.volume = Math.max(0, ambientAudio2.volume - 0.04);
        if (ambientAudio2.volume <= 0) { ambientAudio2.pause(); clearInterval(iv); }
      }, 100);
    }

    
    const ch2 = document.getElementById('chapter2');
    if (ch2) ch2.classList.add('hidden');

    
    const ch3 = document.getElementById('chapter3');
    if (ch3) {
      ch3.classList.remove('hidden');
      ch3.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
document.body.classList.remove('theme-cyan');
document.body.classList.add('theme-amber');


if (typeof initSealPlaza === 'function') initSealPlaza();
  });
}
}
function initSealPlaza() {
  
  if (window.__spInited) return;
  window.__spInited = true;

  const ambient3 = document.getElementById('ambientAudio3');
if (ambient3) {
  ambient3.volume = 0;
  const iv3 = setInterval(() => {
    try { ambient3.play(); } catch(e) {}
    ambient3.volume = Math.min(0.35, ambient3.volume + 0.03);
    if (ambient3.volume >= 0.35) clearInterval(iv3);
  }, 120);
}


  const tabs = document.querySelectorAll('.sp-tab');
  const listTop = document.getElementById('spListTop');
  const listLeast = document.getElementById('spListLeast');
  const viewLeastBtn = document.getElementById('viewLeastBtn');

  const setView = (v) => {
    tabs.forEach(t => {
      const on = t.dataset.view === v;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (v === 'top') {
      listTop.classList.remove('hidden');
      listLeast.classList.add('hidden');
    } else {
      listLeast.classList.remove('hidden');
      listTop.classList.add('hidden');
    }
  };
  tabs.forEach(t => t.addEventListener('click', () => setView(t.dataset.view)));
  if (viewLeastBtn) viewLeastBtn.addEventListener('click', () => setView('least'));

  
 const leastPick = document.getElementById('leastPick');
if (leastPick) {
  const whisper = document.getElementById('spWhisper');
  leastPick.addEventListener('click', () => {
    leastPick.classList.add('is-picked');

    
    if (whisper) {
      whisper.classList.remove('hidden');
      whisper.classList.add('reveal');
    }

    
    document.getElementById('flipperZone')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}


  
  const flipper = document.getElementById('flipperZone');
  const replyInput = document.getElementById('replyText');
  const replySubmit = document.getElementById('replySubmit');
  let holdTimer = null, holding = false;

  function startHold() {
    if (holding) return;
    holding = true;
    holdTimer = setTimeout(() => {
      
      if (replyInput && !replyInput.value.trim()) {
        replyInput.value = `"I'm listening," I say. "I heard you."`;
      }
      
      flipper?.classList.add('flipper-done');
      setTimeout(() => flipper?.classList.remove('flipper-done'), 900);
    }, 900); 
  }
  function endHold() {
    holding = false;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
  }
  if (flipper) {
    flipper.addEventListener('pointerdown', startHold);
    window.addEventListener('pointerup', endHold);
    flipper.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') startHold(); });
    flipper.addEventListener('keyup', endHold);
  }

  
  if (replySubmit) {
    replySubmit.addEventListener('click', () => {
      const v = (replyInput?.value || `"I'm listening," I say. "I heard you."`).trim();
      if (!v) return;
      
      alert(`Stored to archive: ${v}`);
    });
  }

  
  const openMsg = document.getElementById('openMessage');
  if (openMsg) {
    openMsg.addEventListener('click', () => {
      const w = window.open('', '_blank', 'noopener,noreferrer,width=720,height=520');
      if (!w) return;
      const html = `
<!doctype html><html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Message — Archive Notice</title>
<style>
  html,body{margin:0;height:100%;background:radial-gradient(circle at 50% 30%, #2c2200, #0b0700);font-family: 'Prompt', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;color:#fff8d6;}
  .wrap{max-width:800px;margin:0 auto;padding:24px;}
  .card{background:rgba(255,235,175,.08);border:1px solid rgba(255,211,107,.28);border-radius:16px;box-shadow:0 0 26px rgba(255,211,107,.18);padding:16px 18px;}
  h1{margin:0 0 8px 0;color:#ffd36b;text-shadow:0 0 10px rgba(255,211,107,.45);font-size:1.3rem;}
  p{font-family:'Share Tech Mono', monospace;line-height:1.6}
  .hr{height:1px;background:linear-gradient(90deg,transparent, rgba(255,211,107,.45), transparent);margin:12px 0;}
  .q{font-style:italic;color:#fff2bf;}
  .btns{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
  button{cursor:pointer;border-radius:12px;padding:.6rem .9rem;border:1px solid rgba(255,211,107,.35);background:rgba(255,235,175,.12);color:#fff6cf}
  button:hover{box-shadow:0 0 16px rgba(255,211,107,.25) inset}
</style>
</head><body>
  <div class="wrap">
    <div class="card">
      <h1>Archive Notice</h1>
      <p>Your reply has been marked as ‘Low Impact’. It will expire in 3 days unless echoed by others.</p>
      <div class="hr"></div>
      <p class="q">“Who decides what matters?”</p>
      <div class="btns">
        <button onclick="window.close()">Close</button>
      </div>
    </div>
  </div>
</body></html>`;
      w.document.open();
      w.document.write(html);
      w.document.close();
    });
  }
}
  
  const next3 = document.getElementById('nextChapter3Btn');
if (next3) {
  next3.addEventListener('click', () => {
    const ch3 = document.getElementById('chapter3');
    if (ch3) ch3.classList.add('hidden');

    const ch4 = document.getElementById('chapter4');

    // 切主题
    document.body.classList.remove('theme-amber');
    document.body.classList.add('theme-purple');

    // 先显示 ch4，再初始化
    if (ch4) {
      ch4.classList.remove('hidden');
      ch4.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    if (typeof initFinalChapter === 'function') initFinalChapter();

    // 淡出 ch3 背景音
    const ambient3 = document.getElementById('ambientAudio3');
    if (ambient3) {
      const iv = setInterval(() => {
        ambient3.volume = Math.max(0, ambient3.volume - 0.04);
        if (ambient3.volume <= 0) { ambient3.pause(); clearInterval(iv); }
      }, 100);
    }
  });
}

function initFinalChapter() {
  if (window.__fcInited) return;
  window.__fcInited = true;

  // 保底自动播放：静音 + 两次尝试（元素已可见）
  const v = document.querySelector('#finalVideo2, #finalVideo');
if (v) {
  v.muted = true;
  const tryPlay = () => v.play().catch(()=>{});
  v.addEventListener('loadeddata', tryPlay, { once: true });
  requestAnimationFrame(() => {
    tryPlay();
    setTimeout(tryPlay, 200);
  });
}
  // 漂浮卡片 settle
  const panel = document.getElementById('floatPanel');
  const closing = document.getElementById('closingCard');
  function settle() {
    panel?.classList.add('settle');
    if (closing) closing.classList.remove('hidden');
  }
  if (panel) {
    panel.addEventListener('click', settle);
    panel.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); settle(); }
    });
  }

  // 提交归档
  const note = document.getElementById('finalNote');
  const voice = document.getElementById('finalVoice');
  const submit = document.getElementById('finalSubmit');
  if (submit) {
    submit.addEventListener('click', () => {
      const text = (note?.value || '').trim();
      const hasVoice = voice?.files?.length > 0;
      const msg = `Archived: ${text ? `"${text}"` : '(no text)'} ${hasVoice ? ' [+voice]' : ''}`;
      alert(msg);
    });
  }

  // Return to Start
  const curtain = document.getElementById('finalCurtain');
  const restart = document.getElementById('restartBtn');
   if (restart) {
    restart.addEventListener('click', () => {
      curtain?.classList.remove('hidden');
      requestAnimationFrame(() => curtain?.classList.add('show'));
      setTimeout(() => {
        document.getElementById('chapter4')?.classList.add('hidden');
        document.getElementById('container')?.scrollIntoView({ behavior:'smooth', block:'start' });
      }, 900);
    });
  }
} 
