/* 測驗的出題、選項與作答流程。 */
const QUIZ_LENGTH=10;
const MODES={enToZh:'英文找中文',zhToEn:'中文找英文',picture:'看圖猜單字',review:'錯題複習'};
function shuffled(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function makeQuestions(mode, source=WORDS, optionPool=source){
  const pool=shuffled([...source]);
  return pool.slice(0,Math.min(QUIZ_LENGTH,pool.length)).map(word=>({word,options:shuffled([word,...shuffled(optionPool.filter(item=>item.en!==word.en)).slice(0,3)])}));
}
