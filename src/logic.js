import {lessons} from './data.js';
export const KEY = 'lingo-persian-v1';
export const initialState = () => ({completed:[], xp:0, studyDates:[], dailyCounts:{}, goal:1, sound:true});
export function loadState(storage) {
  try {
    const raw = JSON.parse(storage.getItem(KEY));
    if (!raw || typeof raw !== 'object') return initialState();
    return {...initialState(), completed:Array.isArray(raw.completed) ? raw.completed.filter(id => lessons.some(l => l.id === id)) : [], xp:Number.isFinite(raw.xp) && raw.xp >= 0 ? raw.xp : 0, studyDates:Array.isArray(raw.studyDates) ? raw.studyDates.filter(x => typeof x === 'string') : [], dailyCounts:raw.dailyCounts && typeof raw.dailyCounts === 'object' && !Array.isArray(raw.dailyCounts) ? raw.dailyCounts : {}, goal:[1,2,3].includes(raw.goal) ? raw.goal : 1, sound:typeof raw.sound === 'boolean' ? raw.sound : true};
  } catch { return initialState(); }
}
export function saveState(storage,state) { storage.setItem(KEY,JSON.stringify(state)); }
export function today(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function streak(dates, now = new Date()) {
  const set = new Set(dates), d = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if (!set.has(today(d))) d.setDate(d.getDate()-1);
  let n=0; while (set.has(today(d))) { n++; d.setDate(d.getDate()-1); } return n;
}
export function isUnlocked(id, completed) { const i=lessons.findIndex(l=>l.id===id); return i >= 0 && (i===0 || completed.includes(lessons[i-1].id)); }
export function nextLesson(completed) { return lessons.find(l=>!completed.includes(l.id)) || null; }
export function completeLesson(state,id, date=today()) {
  if (!lessons.some(l=>l.id===id) || !isUnlocked(id,state.completed)) return false;
  if (!state.completed.includes(id)) state.completed.push(id);
  state.xp += 10;
  if (!state.studyDates.includes(date)) state.studyDates.push(date);
  state.dailyCounts[date] = (Number(state.dailyCounts[date]) || 0) + 1;
  return true;
}
export function makeQuestions(lesson) {
  // Each word is tested once; distractors are other words from this same lesson.
  return lesson.words.map(([english,persian],index) => ({english,persian,options:lesson.words.map(([,p])=>p).sort((a,b) => ((lesson.words.findIndex(w=>w[1]===a)+index)%lesson.words.length)-((lesson.words.findIndex(w=>w[1]===b)+index)%lesson.words.length))}));
}
