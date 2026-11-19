/* V8: Diagnóstico previo a los módulos. Todo se procesa localmente. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY='despejando-dudas-diagnostico-v1';
  const QUESTIONS=[
    {p:1,s:'Interpretar',t:'mc',q:'En la frase «Lola compra x libretas», ¿qué representa la letra x?',opts:['El precio de una libreta','La cantidad de libretas que compra Lola','El número de tiendas','El dinero que le sobra'],right:1,why:'La variable x representa una cantidad desconocida: el número de libretas que compra Lola.'},
    {p:1,s:'Traducir',t:'mc',q:'¿Cómo representas «el triple de un número más cinco»?',opts:['3(x + 5)','3x + 5','x + 3 + 5','5x + 3'],right:1,why:'El triple de x es 3x; después se agregan cinco unidades.'},
    {p:1,s:'Traducir',t:'expr',q:'Escribe «veinte menos un número» en lenguaje algebraico.',ans:'20-x',why:'Se comienza con 20 y se le resta el número desconocido x: 20 − x.'},
    {p:1,s:'Interpretar',t:'mc',q:'¿Qué significa la expresión x / 3 + 2?',opts:['La tercera parte de la suma de un número y dos','El triple de un número más dos','La tercera parte de un número, más dos','Un número dividido entre cinco'],right:2,why:'Primero se obtiene la tercera parte x/3 y luego se suman dos unidades.'},
    {p:1,s:'Traducir',t:'expr',q:'Escribe «el doble de la suma de un número y cuatro».',ans:'2(x+4)',why:'Se suma x + 4 y se multiplica toda la suma por dos: 2(x + 4).'},
    {p:1,s:'Interpretar',t:'mc',q:'¿Cuál es la interpretación correcta de 5x − 3?',opts:['Cinco más un número y después restar tres','El quíntuple de un número, menos tres','Cinco veces la diferencia entre un número y tres','Tres veces un número, menos cinco'],right:1,why:'El término 5x significa cinco veces x, y luego se restan tres unidades.'},
    {p:1,s:'Traducir',t:'expr',q:'Una plataforma cobra 15 pesos fijos y 6 pesos por cada día. Si x es el número de días, escribe el costo total.',ans:'15+6x',why:'La cuota fija es 15 y los días cuestan 6x. El total se expresa como 15 + 6x.'},
    {p:1,s:'Interpretar',t:'mc',q:'¿Qué historia describe mejor (x − 8) / 2?',opts:['Ocho menos la mitad de un número','La mitad de un número, menos ocho','La mitad de la diferencia entre un número y ocho','El doble de la diferencia entre un número y ocho'],right:2,why:'Primero se calcula x − 8; después se divide esa diferencia entre dos.'},
    {p:1,s:'Traducir',t:'expr',q:'Escribe «tres menos que el doble de un número».',ans:'2x-3',why:'El doble es 2x; «tres menos que» indica restar 3 a ese resultado.'},
    {p:1,s:'Traducir',t:'mc',q:'Compras tres lápices de x pesos cada uno y una goma de 7 pesos. ¿Qué expresión representa el total?',opts:['3(x + 7)','3x + 7','x + 3 + 7','7x + 3'],right:1,why:'Los tres lápices cuestan 3x en total y se suma una goma de 7 pesos.'},
    {p:2,s:'Igualdad',t:'mc',q:'En 3x + 5 = 20, ¿qué acción mantiene el equilibrio y permite empezar a despejar x?',opts:['Restar 5 únicamente a la izquierda','Restar 5 a ambos lados','Sumar 5 a ambos lados','Dividir solo el lado derecho entre 3'],right:1,why:'La igualdad se conserva si aplicamos la misma operación a ambos miembros: 3x = 15.'},
    {p:2,s:'Resolver',t:'num',q:'Resuelve la ecuación x + 8 = 21. ¿Cuánto vale x?',ans:13,why:'Restamos 8 a ambos miembros: x = 21 − 8 = 13.'},
    {p:2,s:'Modelar',t:'eq',q:'Tres boletos cuestan x pesos cada uno y se cobra una comisión fija de 15 pesos. El total es 90 pesos. Escribe la ecuación que representa el costo antes de despejar.',ans:'3x+15=90',why:'Los boletos cuestan 3x y la comisión agrega 15. Se iguala el total a 90: 3x + 15 = 90.'},
    {p:2,s:'Resolver',t:'mc',q:'¿Cuál es la solución de la ecuación 4x − 6 = 18?',opts:['x = 3','x = 4','x = 6','x = 8'],right:2,why:'Al sumar 6 se obtiene 4x = 24; al dividir entre 4, x = 6.'},
    {p:2,s:'Resolver',t:'num',q:'Resuelve 2(x + 3) = 22. Escribe solo el valor de x.',ans:8,why:'Dividimos entre 2: x + 3 = 11. Luego x = 8.'},
    {p:2,s:'Resolver',t:'mc',q:'Resuelve la ecuación 5x + 10 = 2x + 31.',opts:['x = 5','x = 7','x = 9','x = 21'],right:1,why:'Restando 2x y después 10: 3x = 21, entonces x = 7.'},
    {p:2,s:'Modelar',t:'eq',q:'La suma de un número x y su doble es 36. Escribe la ecuación original que representa esa situación.',ans:'x+2x=36',why:'Un número es x y su doble es 2x. Al sumarlos se obtiene 36: x + 2x = 36.'},
    {p:2,s:'Modelar',t:'num',q:'Un taxi cobra 25 pesos fijos y 10 pesos por kilómetro. Si el viaje costó 85 pesos, ¿cuántos kilómetros se recorrieron? Escribe solo el número.',ans:6,why:'25 + 10x = 85; al restar 25 queda 10x = 60; por tanto x = 6 kilómetros.'},
    {p:2,s:'Igualdad',t:'mc',q:'¿Cómo podemos comprobar si x = 5 satisface la ecuación 2x + 4 = 14?',opts:['Sustituir x por 5 y verificar que ambos lados den 14','Cambiar el signo = por +','Dividir solamente la izquierda entre 5','Afirmar que cualquier número sirve'],right:0,why:'Sustituimos x = 5: 2(5) + 4 = 10 + 4 = 14. La igualdad se cumple.'},
    {p:2,s:'Resolver',t:'num',q:'Resuelve x / 3 + 4 = 10. Escribe solo el valor de x.',ans:18,why:'Restamos 4: x/3 = 6. Multiplicamos ambos miembros por 3: x = 18.'}
  ];
  if(QUESTIONS.length!==20) throw Error('El diagnóstico debe contener veinte preguntas.');
  const CATEGORIES=['Interpretar','Traducir','Igualdad','Modelar','Resolver'];
  let position=0, answers=Array(20).fill(''), result=null, memory=readMemory();
  let localWorks=true;
  function node(tag,txt,cls){const n=document.createElement(tag);if(txt!==undefined)n.textContent=String(txt);if(cls)n.className=cls;return n;}
  function approx(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b));}
  function parseLinear(text){
    const s=String(text).toLowerCase().trim().replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/,/g,'.').replace(/\s+/g,'');
    if(!s||s.length>100||!/^[0-9x.+*\/()\-]+$/.test(s))throw Error('Expresión no válida');
    const raw=[];let i=0;
    while(i<s.length){const n=s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);if(n){raw.push({t:'n',v:Number(n[0])});i+=n[0].length;}
      else if(s[i]==='x'){raw.push({t:'x'});i++;}
      else if('+-*/()'.includes(s[i])){raw.push({t:s[i]});i++;}
      else throw Error('Símbolo no válido');}
    const ts=[];
    raw.forEach((item,j)=>{const prev=raw[j-1];if(prev&&['n','x',')'].includes(prev.t)&&['x','('].includes(item.t))ts.push({t:'*'});ts.push(item);});
    let p=0;const is=t=>ts[p]?.t===t;
    function atom(){if(is('n')){const v=ts[p++].v;return ()=>v;}if(is('x')){p++;return x=>x;}if(is('(')){p++;const f=add();if(!is(')'))throw Error('Falta paréntesis');p++;return f;}throw Error('Sintaxis no válida');}
    function signed(){if(is('+')){p++;return signed();}if(is('-')){p++;const f=signed();return x=>-f(x);}return atom();}
    function mult(){let f=signed();while(is('*')||is('/')){const op=ts[p++].t,a=f,b=signed();f=x=>op==='*'?a(x)*b(x):a(x)/b(x);}return f;}
    function add(){let f=mult();while(is('+')||is('-')){const op=ts[p++].t,a=f,b=mult();f=x=>op==='+'?a(x)+b(x):a(x)-b(x);}return f;}
    const f=add();if(p!==ts.length)throw Error('Sintaxis no válida');
    const xs=[-4,-2,-1,0,1,3,8],ys=xs.map(f);
    if(ys.some(v=>!Number.isFinite(v)))throw Error('División no válida');
    const b=f(0),a=f(1)-b;
    if(ys.some((v,j)=>!approx(v,a*xs[j]+b)))throw Error('Solo expresiones lineales');
    return {a,b};
  }
  function exprMatches(input,expected){try{const a=parseLinear(input),b=parseLinear(expected);return approx(a.a,b.a)&&approx(a.b,b.b);}catch(e){return false;}}
  function eqMatches(input,expected){const xs=input.split('='),ys=expected.split('=');if(xs.length!==2||ys.length!==2)return false;return (exprMatches(xs[0],ys[0])&&exprMatches(xs[1],ys[1]))||(exprMatches(xs[0],ys[1])&&exprMatches(xs[1],ys[0]));}
  function numMatches(input,expected){const s=String(input).trim().toLowerCase().replace(/\s/g,'').replace(/^x=/,'').replace(',','.').replace(/[−–—]/g,'-');if(!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return false;return approx(Number(s),expected);}
  function correct(q,a){if(!String(a).trim())return false;return q.t==='mc'?Number(a)===q.right:q.t==='expr'?exprMatches(a,q.ans):q.t==='eq'?eqMatches(a,q.ans):numMatches(a,q.ans);}
  function displayAnswer(q,a){if(!String(a).trim())return 'Sin responder';return q.t==='mc'?q.opts[Number(a)]||'Sin responder':String(a);}
  function correctAnswer(q){return q.t==='mc'?q.opts[q.right]:String(q.ans);}
  function readMemory(){try{const value=JSON.parse(localStorage.getItem(KEY)||'null');return value&&typeof value==='object'?value:{first:null,last:null,count:0,draft:null};}catch(e){return {first:null,last:null,count:0,draft:null};}}
  function notifyProgress(){window.dispatchEvent(new CustomEvent('dd:progress',{detail:{key:KEY}}));}
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(memory));localWorks=true;notifyProgress();}catch(e){localWorks=false;}}
  function answered(q,a){return String(a).trim().length>0;}
  function persistDraft(){memory.draft={answers:[...answers],position,updatedAt:Date.now()};persist();}
  function setView(view){$('dg-intro').hidden=view!=='intro';$('dg-test').hidden=view!=='test';$('dg-result').hidden=view!=='result';}
  function intro(){setView('intro');const existing=$('dg-existing');existing.replaceChildren();existing.hidden=!memory.first;
    $('dg-start').textContent=memory.draft?'Continuar diagnóstico →':memory.first?'Hacer otro intento →':'Comenzar diagnóstico →';
    if(memory.first){const block=node('div',undefined,'dg-guidance');block.append(node('strong','Ya tienes un diagnóstico inicial registrado.'),node('p','Tu primera puntuación fue '+memory.first.score+' de 20. Se conservará como línea de base aunque repitas el examen.'));const actions=node('div',undefined,'dg-actions');const see=node('button','Consultar mi último resultado','btn btn-outline');see.type='button';see.addEventListener('click',()=>showResult(memory.last));actions.append(see);const clear=node('button','Borrar solo los datos del diagnóstico','dg-muted-button');clear.type='button';clear.addEventListener('click',clearData);actions.append(clear);block.append(actions);existing.append(block);}
  }
  function begin(){if(memory.draft&&Array.isArray(memory.draft.answers)&&memory.draft.answers.length===20){answers=memory.draft.answers.map(v=>String(v||''));position=Math.min(19,Math.max(0,Number(memory.draft.position)||0));}
    else{answers=Array(20).fill('');position=0;persistDraft();}setView('test');render();}
  function updateNav(){const filled=answers.filter((a,i)=>answered(QUESTIONS[i],a)).length;
    $('dg-test-counter').textContent='Pregunta '+(position+1)+' de 20 · '+filled+' respondidas';$('dg-progress').setAttribute('aria-valuenow',String(filled));$('dg-progress-fill').style.width=filled*5+'%';
    $('dg-back').disabled=position===0;$('dg-next').hidden=position===19;$('dg-finish').hidden=position!==19;
    const map=$('dg-map-grid');map.replaceChildren();QUESTIONS.forEach((q,i)=>{const b=node('button',i+1,'dg-map-btn'+(answered(q,answers[i])?' answered':'')+(position===i?' current':''));b.type='button';b.setAttribute('aria-label','Pregunta '+(i+1)+(answered(q,answers[i])?', respondida':' sin responder'));b.setAttribute('aria-current',String(position===i));b.addEventListener('click',()=>{position=i;persistDraft();render();});map.append(b);});}
  function render(){const q=QUESTIONS[position];$('dg-section-pill').textContent=q.p===1?'PDA 1 · LENGUAJE ALGEBRAICO':'PDA 2 · ECUACIONES LINEALES';$('dg-question-category').textContent=q.s;$('dg-question-text').textContent=q.q;
    $('dg-question-caption').textContent=q.t==='mc'?'Selecciona la opción que consideres correcta.':q.t==='num'?'Escribe únicamente el resultado numérico.':q.t==='eq'?'Escribe una igualdad con el signo = y la letra x. No la despejes todavía.':'Usa la letra x, números y operaciones; los paréntesis pueden ser necesarios.';
    const area=$('dg-answer-area');area.replaceChildren();
    if(q.t==='mc'){
      const choices=node('div',undefined,'dg-answer-group');q.opts.forEach((o,i)=>{const lab=node('label',undefined,'dg-answer');const radio=document.createElement('input');radio.type='radio';radio.name='dg-question-'+position;radio.value=String(i);radio.checked=answers[position]===String(i);const txt=node('span',o);radio.addEventListener('change',()=>{answers[position]=String(i);persistDraft();updateNav();});lab.append(radio,txt);choices.append(lab);});area.append(choices);
    }else{
      const label=node('label',q.t==='eq'?'Tu ecuación:':q.t==='num'?'Tu resultado:':'Tu expresión:','dg-write-label');label.htmlFor='dg-text-answer';const input=document.createElement('input');input.type='text';input.id='dg-text-answer';input.className='dg-written';input.maxLength=100;input.autocomplete='off';input.spellcheck=false;input.value=answers[position];input.placeholder=q.t==='eq'?'Ej. 3x + 5 = 20':q.t==='num'?'Ej. 12':'Ej. 2(x + 4)';input.setAttribute('aria-label',q.t==='eq'?'Escribe la ecuación':q.t==='num'?'Escribe el valor de x':'Escribe la expresión algebraica');input.addEventListener('input',()=>{answers[position]=input.value;persistDraft();updateNav();});area.append(label,input);
    }updateNav();}
  function scoreAttempt(){const marks=QUESTIONS.map((q,i)=>correct(q,answers[i]));const buckets={};CATEGORIES.forEach(k=>buckets[k]={right:0,total:0});QUESTIONS.forEach((q,i)=>{buckets[q.s].total++;if(marks[i])buckets[q.s].right++;});return {score:marks.filter(Boolean).length,pda1:marks.slice(0,10).filter(Boolean).length,pda2:marks.slice(10).filter(Boolean).length,marks,answers:[...answers],buckets,date:new Date().toISOString()};}
  function finish(){const missing=answers.filter((a,i)=>!answered(QUESTIONS[i],a)).length;
    if(missing && !window.confirm('Hay '+missing+' pregunta(s) sin responder. Contarán como incorrectas. ¿Quieres entregar de todos modos?'))return;
    const attempt=scoreAttempt();if(!memory.first)memory.first=attempt;memory.last=attempt;memory.count=(Number(memory.count)||0)+1;memory.draft=null;persist();showResult(attempt);
  }
  function getDate(raw){try{return new Date(raw).toLocaleDateString('es-MX',{year:'numeric',month:'short',day:'numeric'});}catch(e){return 'Fecha no disponible';}}
  function appendScore(parent,title,value,max,sub){const card=node('div',undefined,'dg-score-card');card.append(node('small',title),node('strong',value+' / '+max),node('span',sub));parent.append(card);}
  function showResult(attempt){if(!attempt)return intro();result=attempt;setView('result');const scores=$('dg-result-scores');scores.replaceChildren();appendScore(scores,'RESULTADO TOTAL',attempt.score,20,'Aciertos de la prueba');appendScore(scores,'PDA 1 · LENGUAJE',attempt.pda1,10,'Interpretación y traducción');appendScore(scores,'PDA 2 · ECUACIONES',attempt.pda2,10,'Igualdad, modelación y resolución');
    const skills=$('dg-skills');skills.replaceChildren();CATEGORIES.forEach(k=>{const item=attempt.buckets[k];const line=node('div');const heading=node('div',undefined,'dg-skill-head');heading.append(node('span',k),node('span',item.right+' de '+item.total));const track=node('div',undefined,'dg-skill-track');const bar=node('div',undefined,'dg-skill-fill');bar.style.width=(100*item.right/item.total)+'%';track.append(bar);line.append(heading,track);skills.append(line);});
    const guidance=$('dg-recommendation');guidance.replaceChildren();guidance.append(node('strong','Tu siguiente paso recomendado'));
    const advice=attempt.pda1<=attempt.pda2?'Empieza por el Módulo 1 para fortalecer la interpretación y traducción del lenguaje algebraico.':'Empieza por el Módulo 2 para reforzar la modelación, resolución y comprobación de ecuaciones.';
    guidance.append(node('p',advice+' Lo importante será volver a practicar los temas con mayor dificultad.'));
    const a=node('a',attempt.pda1<=attempt.pda2?'Ir al Módulo 1 →':'Ir al Módulo 2 →');a.href=attempt.pda1<=attempt.pda2?'#modulo1':'#modulo2';a.className='inline-link';guidance.append(a);
    $('dg-storage-note').textContent=localWorks?'Tu primer diagnóstico se conserva como línea de base en este navegador. Puedes repetir la prueba sin reemplazarlo. No se envían respuestas a ningún servidor.':'Este navegador no permitió guardar los datos. Puedes descargar el reporte antes de cerrar la página.';
    const review=$('dg-review');review.replaceChildren();QUESTIONS.forEach((q,i)=>{const ok=attempt.marks[i];const card=node('div',undefined,'dg-review-card '+(ok?'correct':'incorrect'));card.append(node('span',ok?'✓ Correcta · '+q.s:'↻ Por reforzar · '+q.s,'dg-review-badge'),node('h4',(i+1)+'. '+q.q),node('p','Tu respuesta: '+displayAnswer(q,attempt.answers[i])),node('p','Respuesta esperada: '+correctAnswer(q)),node('p',q.why));review.append(card);});
    const progress=$('dg-progress-summary');if(progress)renderProgress(progress);
  }
  function renderProgress(target){target.replaceChildren();if(!memory.first){target.append(node('strong','Aún no has realizado el diagnóstico inicial.'),node('p','Este examen mide tus conocimientos previos en los dos PDA.','muted'));const a=node('a','Comenzar diagnóstico →','btn btn-primary');a.href='#diagnostico';target.append(a);return;}
    const first=memory.first,last=memory.last||first;target.append(node('strong','Línea de base · '+getDate(first.date)),node('div',first.score+' / 20','m1-progress-score'),node('p','Lenguaje algebraico: '+first.pda1+'/10 · Ecuaciones lineales: '+first.pda2+'/10.','muted'));
    if(memory.count>1)target.append(node('p','Último intento: '+last.score+'/20. Se conservó el primer diagnóstico sin modificar.','muted'));
    const a=node('a','Consultar diagnóstico →','btn btn-primary');a.href='#diagnostico';target.append(a);
  }
  function clearData(){if(!window.confirm('¿Quieres borrar el diagnóstico inicial y los intentos guardados en este navegador? No se borrarán los resultados de los módulos.'))return;memory={first:null,last:null,count:0,draft:null};try{localStorage.removeItem(KEY);notifyProgress();}catch(e){}result=null;answers=Array(20).fill('');intro();renderProgress($('dg-progress-summary'));}
  function report(){if(!result)return;const lines=['DESPEJANDO DUDAS — REPORTE DE DIAGNÓSTICO','Reporte sin datos personales','Fecha: '+getDate(result.date),'','Total: '+result.score+'/20','PDA 1: '+result.pda1+'/10','PDA 2: '+result.pda2+'/10',''];CATEGORIES.forEach(k=>lines.push(k+': '+result.buckets[k].right+'/'+result.buckets[k].total));lines.push('','DETALLE DE RESPUESTAS');QUESTIONS.forEach((q,i)=>lines.push((i+1)+'. '+q.q+'\nTu respuesta: '+displayAnswer(q,result.answers[i])+'\nRespuesta esperada: '+correctAnswer(q)+'\nEstado: '+(result.marks[i]?'Correcta':'Por reforzar')+'\nExplicación: '+q.why+'\n'));lines.push('El diagnóstico inicial es un punto de partida, no una calificación aprobatoria.','Este reporte se generó en el dispositivo y no contiene identificadores personales.');const b=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='Despejando_Dudas_Diagnostico_Reporte.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
  $('dg-start').addEventListener('click',begin);$('dg-back').addEventListener('click',()=>{if(position>0){position--;persistDraft();render();}});$('dg-next').addEventListener('click',()=>{if(position<19){position++;persistDraft();render();}});$('dg-finish').addEventListener('click',finish);$('dg-retake').addEventListener('click',()=>{memory.draft=null;answers=Array(20).fill('');position=0;persistDraft();setView('test');render();});$('dg-download').addEventListener('click',report);
  window.addEventListener('hashchange',()=>{if(location.hash==='#diagnostico'&&$('dg-test').hidden&&$('dg-result').hidden)intro();});
  const progress=$('dg-progress-summary');if(progress)renderProgress(progress);intro();
})();
