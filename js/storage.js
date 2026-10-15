/* 所有學習紀錄都存放在這個瀏覽器的 localStorage。 */
const STORAGE_KEY = 'english-star-planet-v1';
function emptyStats(){return {rounds:0,answered:0,correct:0,studied:[],mistakes:[],sessions:[]};}
function loadStats(){
  try {const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(!saved || typeof saved!=='object')return emptyStats(); return {...emptyStats(),...saved,studied:Array.isArray(saved.studied)?saved.studied:[],mistakes:Array.isArray(saved.mistakes)?saved.mistakes:[],sessions:Array.isArray(saved.sessions)?saved.sessions:[]};}
  catch(error){return emptyStats();}
}
let stats = loadStats();
function saveStats(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(stats));return true;}catch(error){return false;}}
function recordAnswer(word, correct){
  if(!stats.studied.includes(word.en)) stats.studied.push(word.en);
  if(correct){stats.correct++;stats.mistakes=stats.mistakes.filter(item=>item!==word.en);}
  else if(!stats.mistakes.includes(word.en)) stats.mistakes.push(word.en);
  stats.answered++;saveStats();
}
function recordRound(score, total, mode){stats.rounds++;stats.sessions.unshift({score,total,mode,date:new Date().toISOString()});stats.sessions=stats.sessions.slice(0,20);saveStats();}
function clearMistakes(){stats.mistakes=[];saveStats();}
