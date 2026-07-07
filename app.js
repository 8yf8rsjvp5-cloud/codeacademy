// ============================================================================
// CodeAcademy — движок приложения (навигация, прогресс, выполнение кода, голос)
// ============================================================================

const PROGRESS_KEY = 'codeacademy-progress-v1';
const VOICE_KEY = 'codeacademy-voice-pref';

let state = {
  currentLang: null,
  currentLessonIndex: 0,
  pyodideInstance: null,
  pyodideLoading: false,
};

// ---------------------------------------------------------------------------
// Прогресс (localStorage)
// ---------------------------------------------------------------------------

function loadProgress(){
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e){ return {}; }
}

function saveProgress(progress){
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch(e){}
}

let progress = loadProgress();

// ---------------------------------------------------------------------------
// Streak (серия дней подряд с активностью) — хранится отдельным ключом
// ---------------------------------------------------------------------------

const STREAK_KEY = 'codeacademy-streak-v1';

function todayStr(){
  return new Date().toISOString().slice(0,10); // YYYY-MM-DD
}

function updateStreak(){
  let streak;
  try { streak = JSON.parse(localStorage.getItem(STREAK_KEY)) || {count:0, lastDate:null}; }
  catch(e){ streak = {count:0, lastDate:null}; }

  const today = todayStr();
  if (streak.lastDate === today){
    // уже отмечались сегодня — ничего не меняем
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    if (streak.lastDate === yesterday){
      streak.count += 1;       // пришёл на следующий день подряд
    } else {
      streak.count = 1;        // пропустил день(и) — серия начинается заново
    }
    streak.lastDate = today;
    try { localStorage.setItem(STREAK_KEY, JSON.stringify(streak)); } catch(e){}
  }
  document.getElementById('streakDisplay').textContent = `🔥 ${streak.count} ${streak.count === 1 ? 'день' : 'дней'} подряд`;
}

function isLessonDone(langKey, day){
  return !!(progress[langKey] && progress[langKey].completed && progress[langKey].completed.includes(day));
}

function markLessonDone(langKey, day){
  if (!progress[langKey]) progress[langKey] = { completed: [] };
  if (!progress[langKey].completed.includes(day)) progress[langKey].completed.push(day);
  saveProgress(progress);
}

function langProgressPct(langKey){
  const lessons = CURRICULUM[langKey].lessons;
  const done = (progress[langKey] && progress[langKey].completed) ? progress[langKey].completed.length : 0;
  return Math.round((done / lessons.length) * 100);
}

function isLessonUnlocked(langKey, dayIndex){
  if (dayIndex === 0) return true; // первый урок всегда открыт
  const lessons = CURRICULUM[langKey].lessons;
  const prevDay = lessons[dayIndex - 1].day;
  return isLessonDone(langKey, prevDay);
}

// ---------------------------------------------------------------------------
// Навигация между экранами
// ---------------------------------------------------------------------------

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function findNextRecommendedLesson(){
  // Ищем язык с прогрессом > 0%, но ещё не пройденный полностью — приоритет
  // "продолжить то, что уже начал", иначе ничего не рекомендуем.
  for (const key of Object.keys(CURRICULUM)){
    const lang = CURRICULUM[key];
    const done = (progress[key] && progress[key].completed) ? progress[key].completed.length : 0;
    if (done > 0 && done < lang.lessons.length){
      return {langKey: key, lessonIndex: done, lang, lesson: lang.lessons[done]};
    }
  }
  return null;
}

function renderContinueBanner(){
  const banner = document.getElementById('continueBanner');
  const next = findNextRecommendedLesson();
  if (!next){
    banner.style.display = 'none';
    return;
  }
  banner.style.display = 'block';
  banner.innerHTML = `▶ Продолжить обучение: <strong>${next.lang.emoji} ${next.lang.name} — День ${next.lesson.day}: ${next.lesson.title}</strong>`;
  banner.onclick = () => openLesson(next.langKey, next.lessonIndex);
}

function renderLanguageGrid(){
  const grid = document.getElementById('langGrid');
  grid.innerHTML = '';
  Object.keys(CURRICULUM).forEach(key => {
    const lang = CURRICULUM[key];
    const pct = langProgressPct(key);
    const card = document.createElement('div');
    card.className = 'lang-card';
    const badge = lang.runtime === 'sim'
      ? '<span class="sim-badge">структурная проверка</span>'
      : '<span class="real-exec-badge">реальное выполнение</span>';
    card.innerHTML = `
      <span class="emoji">${lang.emoji}</span>
      ${badge}
      <span class="name">${lang.name}</span>
      <span class="desc">${lang.desc}</span>
      <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
      <span class="pct">${pct}% пройдено · ${lang.lessons.length} уроков</span>
    `;
    card.addEventListener('click', () => openLanguage(key));
    grid.appendChild(card);
  });
}

function openLanguage(langKey){
  state.currentLang = langKey;
  const lang = CURRICULUM[langKey];
  document.getElementById('lessonsLangTitle').textContent = `${lang.emoji} ${lang.name}`;
  document.getElementById('lessonsLangDesc').textContent = lang.desc;
  renderLessonList(langKey);
  showScreen('screenLessons');
}

function renderLessonList(langKey){
  const lang = CURRICULUM[langKey];
  const list = document.getElementById('lessonList');
  list.innerHTML = '';
  lang.lessons.forEach((lesson, idx) => {
    const unlocked = isLessonUnlocked(langKey, idx);
    const done = isLessonDone(langKey, lesson.day);
    const item = document.createElement('div');
    item.className = 'lesson-item' + (unlocked ? '' : ' locked') + (done ? ' done' : '');
    item.innerHTML = `
      <span class="day-badge">День ${lesson.day}</span>
      <span class="l-title">${lesson.title}</span>
      <span class="l-status">${done ? '✅' : (unlocked ? '' : '🔒')}</span>
    `;
    if (unlocked){
      item.addEventListener('click', () => openLesson(langKey, idx));
    }
    list.appendChild(item);
  });
}

// ---------------------------------------------------------------------------
// Экран урока
// ---------------------------------------------------------------------------

function openLesson(langKey, lessonIndex){
  state.currentLang = langKey;
  state.currentLessonIndex = lessonIndex;
  const lang = CURRICULUM[langKey];
  const lesson = lang.lessons[lessonIndex];

  document.getElementById('lessonDayTag').textContent = `${lang.name} · День ${lesson.day} из ${lang.lessons.length}`;
  document.getElementById('lessonTitle').textContent = lesson.title;
  document.getElementById('lessonExplanation').textContent = lesson.explanation;

  if (lesson.example){
    document.getElementById('examplePanel').style.display = 'block';
    document.getElementById('exampleCode').textContent = lesson.example;
  } else {
    document.getElementById('examplePanel').style.display = 'none';
  }

  document.getElementById('exercisePrompt').textContent = lesson.exercisePrompt;
  document.getElementById('codeEditor').value = lesson.starter || '';
  document.getElementById('simBanner').style.display = lang.runtime === 'sim' ? 'block' : 'none';

  const outputBox = document.getElementById('outputBox');
  outputBox.className = 'output-box';
  outputBox.textContent = '';

  const htmlPreview = document.getElementById('htmlPreview');
  htmlPreview.style.display = lang.runtime === 'html' ? 'block' : 'none';
  if (lang.runtime === 'html') htmlPreview.srcdoc = document.getElementById('codeEditor').value;

  const done = isLessonDone(langKey, lesson.day);
  document.getElementById('nextLessonBtn').disabled = !done;
  document.getElementById('prevLessonBtn').disabled = lessonIndex === 0;

  if (lang.runtime === 'pyodide') ensurePyodideLoaded();

  showScreen('screenLesson');
  window.scrollTo(0,0);
}

document.getElementById('backToLangsBtn').addEventListener('click', () => {
  renderLanguageGrid();
  renderContinueBanner();
  showScreen('screenLanguages');
});

document.getElementById('backToLessonsBtn').addEventListener('click', () => {
  renderLessonList(state.currentLang);
  showScreen('screenLessons');
});

document.getElementById('prevLessonBtn').addEventListener('click', () => {
  if (state.currentLessonIndex > 0) openLesson(state.currentLang, state.currentLessonIndex - 1);
});

document.getElementById('nextLessonBtn').addEventListener('click', () => {
  const lang = CURRICULUM[state.currentLang];
  if (state.currentLessonIndex < lang.lessons.length - 1){
    openLesson(state.currentLang, state.currentLessonIndex + 1);
  } else {
    renderLessonList(state.currentLang);
    showScreen('screenLessons');
  }
});

function setEditorCode(code){
  document.getElementById('codeEditor').value = code;
  // Для HTML/CSS уроков превью должно обновляться вместе с кодом —
  // раньше "Сбросить код" и "Показать решение" меняли только textarea,
  // а iframe с превью продолжал показывать старую версию.
  if (state.currentLang && CURRICULUM[state.currentLang].runtime === 'html'){
    document.getElementById('htmlPreview').srcdoc = code;
  }
}

document.getElementById('resetCodeBtn').addEventListener('click', () => {
  const lesson = CURRICULUM[state.currentLang].lessons[state.currentLessonIndex];
  setEditorCode(lesson.starter || '');
  const outputBox = document.getElementById('outputBox');
  outputBox.className = 'output-box';
  outputBox.textContent = '';
});

document.getElementById('showSolutionBtn').addEventListener('click', () => {
  const lesson = CURRICULUM[state.currentLang].lessons[state.currentLessonIndex];
  setEditorCode(lesson.solution || '');
  const outputBox = document.getElementById('outputBox');
  outputBox.className = 'output-box show';
  outputBox.textContent = '💡 Решение подставлено в редактор. Нажми «Проверить», чтобы увидеть, как оно засчитывается.';
});

document.getElementById('resetProgressBtn').addEventListener('click', () => {
  if (confirm('Сбросить весь прогресс по всем языкам? Это нельзя отменить.')){
    progress = {};
    saveProgress(progress);
    renderLanguageGrid();
    renderContinueBanner();
  }
});

document.getElementById('exportProgressBtn').addEventListener('click', () => {
  const data = JSON.stringify({ progress, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'codeacademy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importProgressBtn').addEventListener('click', () => {
  document.getElementById('importFileInput').click();
});

document.getElementById('importFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.progress) throw new Error('Файл не похож на экспорт прогресса CodeAcademy.');
      progress = parsed.progress;
      saveProgress(progress);
      renderLanguageGrid();
      renderContinueBanner();
      alert('Прогресс успешно импортирован.');
    } catch(err){
      alert('Не удалось прочитать файл: ' + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

document.getElementById('codeEditor').addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
    e.preventDefault();
    handleRun();
  }
});

// ---------------------------------------------------------------------------
// Выполнение кода по типам runtime
// ---------------------------------------------------------------------------

async function ensurePyodideLoaded(){
  if (state.pyodideInstance || state.pyodideLoading) return;
  state.pyodideLoading = true;
  const outputBox = document.getElementById('outputBox');
  outputBox.className = 'output-box show';
  outputBox.textContent = 'Загружаю Python-движок (Pyodide)… это происходит один раз и может занять 10-20 секунд.';
  try {
    state.pyodideInstance = await loadPyodide();
    outputBox.className = 'output-box';
    outputBox.textContent = '';
  } catch(e){
    outputBox.className = 'output-box show fail';
    outputBox.textContent = 'Не удалось загрузить Python-движок: ' + e.message + '\nПроверь подключение к интернету и обнови страницу.';
  }
  state.pyodideLoading = false;
}

async function runPython(code){
  if (!state.pyodideInstance){
    await ensurePyodideLoaded();
    if (!state.pyodideInstance) return {error: 'Python-движок не загружен.'};
  }
  const pyodide = state.pyodideInstance;
  try {
    pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `);
    await pyodide.runPythonAsync(code);
    const out = pyodide.runPython('sys.stdout.getvalue()');
    const err = pyodide.runPython('sys.stderr.getvalue()');
    if (err) return {error: err};
    return {output: out};
  } catch(e){
    return {error: String(e.message || e)};
  }
}

function runJavaScript(code){
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => { logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')); };
  try {
    new Function(code)();
    console.log = originalLog;
    return {output: logs.join('\n')};
  } catch(e){
    console.log = originalLog;
    return {error: e.message};
  }
}

function runHtmlCheck(code, checkFn){
  return new Promise((resolve) => {
    const iframe = document.getElementById('htmlPreview');
    const onLoad = () => {
      iframe.removeEventListener('load', onLoad);
      try {
        const result = checkFn(iframe.contentDocument);
        resolve(result);
      } catch(e){
        resolve({pass:false, hint:'Ошибка при проверке разметки: ' + e.message});
      }
    };
    iframe.addEventListener('load', onLoad);
    iframe.srcdoc = code;
  });
}

async function handleRun(){
  const lang = CURRICULUM[state.currentLang];
  const lesson = lang.lessons[state.currentLessonIndex];
  const code = document.getElementById('codeEditor').value;
  const outputBox = document.getElementById('outputBox');
  const runBtn = document.getElementById('runBtn');

  runBtn.disabled = true;
  outputBox.className = 'output-box show';
  outputBox.textContent = 'Выполняю…';

  let result;

  if (lang.runtime === 'pyodide'){
    const runResult = await runPython(code);
    if (runResult.error){
      outputBox.className = 'output-box show fail';
      outputBox.textContent = '❌ Ошибка выполнения:\n' + runResult.error;
      runBtn.disabled = false;
      return;
    }
    result = lesson.checkOutput(runResult.output || '', code);
    presentCheckResult(result, runResult.output);

  } else if (lang.runtime === 'js'){
    const runResult = runJavaScript(code);
    if (runResult.error){
      outputBox.className = 'output-box show fail';
      outputBox.textContent = '❌ Ошибка выполнения:\n' + runResult.error;
      runBtn.disabled = false;
      return;
    }
    result = lesson.checkOutput(runResult.output || '', code);
    presentCheckResult(result, runResult.output);

  } else if (lang.runtime === 'html'){
    document.getElementById('htmlPreview').style.display = 'block';
    result = await runHtmlCheck(code, (doc) => lesson.checkDom(doc));
    presentCheckResult(result, null);

  } else if (lang.runtime === 'sim'){
    result = lesson.checkStatic(code);
    presentCheckResult(result, null);
  }

  if (result && result.pass){
    markLessonDone(state.currentLang, lesson.day);
    document.getElementById('nextLessonBtn').disabled = false;
  }

  runBtn.disabled = false;
}

function presentCheckResult(result, rawOutput){
  const outputBox = document.getElementById('outputBox');
  if (result.pass){
    outputBox.className = 'output-box show ok';
    let text = '✅ Верно! Урок засчитан.';
    if (rawOutput) text += '\n\nВывод программы:\n' + rawOutput;
    outputBox.textContent = text;
  } else {
    outputBox.className = 'output-box show fail';
    let text = '❌ Пока не то.';
    if (rawOutput) text += '\n\nВывод программы:\n' + rawOutput;
    outputBox.textContent = text;
    const hintEl = document.createElement('div');
    hintEl.className = 'hint';
    hintEl.textContent = '💡 ' + (result.hint || 'Проверь код ещё раз.');
    outputBox.appendChild(hintEl);
  }
}

document.getElementById('runBtn').addEventListener('click', handleRun);

document.getElementById('codeEditor').addEventListener('input', () => {
  if (state.currentLang && CURRICULUM[state.currentLang].runtime === 'html'){
    document.getElementById('htmlPreview').srcdoc = document.getElementById('codeEditor').value;
  }
});

// ---------------------------------------------------------------------------
// Голосовой агент (озвучка объяснений) — так же, как в voice-booth
// ---------------------------------------------------------------------------

let voiceGenderPref = localStorage.getItem(VOICE_KEY) || null;
let availableVoicesForTts = [];

function loadTtsVoices(){
  availableVoicesForTts = window.speechSynthesis ? speechSynthesis.getVoices() : [];
}
if ('speechSynthesis' in window){
  loadTtsVoices();
  speechSynthesis.onvoiceschanged = loadTtsVoices;
}

function pickRussianVoice(){
  return availableVoicesForTts.find(v => v.lang.toLowerCase().startsWith('ru')) || null;
}

function updateVoiceButtons(){
  document.getElementById('voiceMaleBtn').classList.toggle('active-voice', voiceGenderPref === 'male');
  document.getElementById('voiceFemaleBtn').classList.toggle('active-voice', voiceGenderPref === 'female');
}
updateVoiceButtons();

document.getElementById('voiceMaleBtn').addEventListener('click', () => {
  voiceGenderPref = 'male';
  localStorage.setItem(VOICE_KEY, 'male');
  updateVoiceButtons();
});
document.getElementById('voiceFemaleBtn').addEventListener('click', () => {
  voiceGenderPref = 'female';
  localStorage.setItem(VOICE_KEY, 'female');
  updateVoiceButtons();
});

document.getElementById('ttsPlayBtn').addEventListener('click', () => {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const text = document.getElementById('lessonExplanation').textContent;
  const utter = new SpeechSynthesisUtterance(text);
  const ruVoice = pickRussianVoice();
  if (ruVoice) { utter.voice = ruVoice; utter.lang = ruVoice.lang; } else { utter.lang = 'ru-RU'; }
  utter.rate = 0.95;
  utter.pitch = voiceGenderPref === 'male' ? 0.8 : voiceGenderPref === 'female' ? 1.3 : 1.0;
  speechSynthesis.speak(utter);
});

document.getElementById('ttsStopBtn').addEventListener('click', () => {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
});

// ---------------------------------------------------------------------------
// Старт
// ---------------------------------------------------------------------------

renderLanguageGrid();
renderContinueBanner();
updateStreak();

if ('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
