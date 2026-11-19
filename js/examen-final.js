/* Examen final integrador con comparación de primeros intentos. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const { expresionesLineales, miembrosLineales } = window.DespejandoAlgebra;
  const questionHeading = $('fx-question-text');
  const resultHeading = $('fx-result').querySelector('h3');
  questionHeading.tabIndex = -1;
  resultHeading.tabIndex = -1;
  const KEY='despejando-dudas-final-v1';
  const guardado = window.DespejandoProgreso.abrir(KEY);
  const DIAG='despejando-dudas-diagnostico-v1';
  const QUESTIONS=[{"p":1,"s":"Traducir","t":"mc","q":"¿Qué expresión representa «ocho unidades más que el triple de un número»?","opts":["3(x + 8)","3x + 8","8x + 3","3x − 8"],"right":1,"why":"El triple de x se escribe 3x. Después se suman ocho unidades: 3x + 8."},{"p":1,"s":"Traducir","t":"expr","q":"Escribe «la mitad de la suma de un número y diez» usando la letra x.","ans":"(x+10)/2","why":"Primero se suma x + 10 y luego se divide el resultado completo entre 2: (x + 10) / 2."},{"p":1,"s":"Interpretar","t":"mc","q":"¿Qué historia corresponde a la expresión 4(x − 3)?","opts":["Se multiplica un número por cuatro y luego se le restan tres unidades.","Se toman cuatro veces las unidades que quedan al quitar tres de un número.","Se resta cuatro a un número y el resultado se multiplica por tres.","Se divide entre cuatro la diferencia entre un número y tres."],"right":1,"why":"El paréntesis indica que primero calculamos x − 3 y después multiplicamos toda esa diferencia por 4."},{"p":1,"s":"Traducir","t":"expr","q":"Para fabricar llaveros se pagan 25 pesos de material fijo y 7 pesos por cada llavero. Si se fabrican x llaveros, escribe el costo total en pesos.","ans":"25+7x","why":"La cuota fija es 25 y el costo variable es 7 por cada llavero: 25 + 7x."},{"p":1,"s":"Interpretar","t":"mc","q":"¿Cuál es el significado de (x + 6) / 3?","opts":["La tercera parte de un número, más seis.","La suma de un número y la tercera parte de seis.","La tercera parte de la suma de un número y seis.","El triple de la suma de un número y seis."],"right":2,"why":"El paréntesis agrupa x + 6; toda esa suma se divide entre 3."},{"p":1,"s":"Traducir","t":"expr","q":"Escribe «cinco menos que el cuádruple de un número» en lenguaje algebraico.","ans":"4x-5","why":"Cuádruple significa 4x y «cinco menos que» indica restar 5: 4x − 5."},{"p":1,"s":"Interpretar","t":"mc","q":"En la expresión 12 − 2x, hay 12 dulces al inicio y se regalan 2 dulces a cada persona. ¿Qué representa x?","opts":["La cantidad inicial de dulces.","La cantidad de dulces que recibe cada persona.","El número de personas que reciben dulces.","La cantidad de dulces que quedan."],"right":2,"why":"La expresión 2x representa el total de dulces regalados a x personas; cada una recibe dos."},{"p":1,"s":"Traducir","t":"expr","q":"Escribe la suma de tres números enteros consecutivos, si el primero es x.","ans":"x+(x+1)+(x+2)","why":"Los números consecutivos son x, x + 1 y x + 2; su suma también puede simplificarse a 3x + 3."},{"p":1,"s":"Traducir","t":"mc","q":"Compras cinco bolsas con x canicas en cada una y regalas nueve canicas. ¿Qué expresión representa las canicas que conservas?","opts":["5(x − 9)","5x + 9","9x − 5","5x − 9"],"right":3,"why":"Las cinco bolsas tienen 5x canicas; al regalar nueve quedan 5x − 9."},{"p":1,"s":"Traducir","t":"expr","q":"Escribe «el doble de la diferencia entre un número y siete» usando x.","ans":"2(x-7)","why":"La diferencia x − 7 se calcula primero y todo su resultado se multiplica por 2."},{"p":2,"s":"Igualdad","t":"mc","q":"En 5x + 9 = 44, ¿qué operación elimina el +9 del lado izquierdo y conserva la igualdad?","opts":["Restar 9 únicamente al miembro izquierdo.","Sumar 9 a los dos miembros.","Restar 9 a los dos miembros.","Dividir únicamente el miembro derecho entre 5."],"right":2,"why":"Restar 9 a ambos lados deja 5x = 35 sin romper la igualdad."},{"p":2,"s":"Resolver","t":"num","q":"Resuelve 7x − 13 = 29. Escribe el valor numérico de x.","ans":6,"why":"Sumamos 13 a ambos miembros: 7x = 42; luego dividimos entre 7 y obtenemos x = 6."},{"p":2,"s":"Modelar","t":"eq","q":"En una feria compras 4 boletos de x pesos cada uno y pagas 12 pesos de acceso. Gastas 92 pesos en total. Escribe la ecuación original sin despejar x.","ans":"4x+12=92","why":"Los boletos cuestan 4x; el acceso cuesta 12. El total se modela con 4x + 12 = 92."},{"p":2,"s":"Resolver","t":"mc","q":"¿Cuál es la solución de la ecuación 2(x + 4) = 34?","opts":["x = 9","x = 13","x = 15","x = 21"],"right":1,"why":"Al dividir entre 2 se obtiene x + 4 = 17; al restar 4, x = 13. Comprobación: 2(13 + 4) = 34."},{"p":2,"s":"Resolver","t":"num","q":"Resuelve 4x + 15 = 7x − 6. Escribe el valor numérico de x.","ans":7,"why":"Restamos 4x y sumamos 6: 21 = 3x; por tanto x = 7. Comprobación: 43 = 43."},{"p":2,"s":"Modelar","t":"eq","q":"Un plan A cuesta 35 pesos de inscripción y 6 pesos por día. Un plan B cuesta 11 pesos de inscripción y 10 pesos por día. Si x representa los días, escribe la ecuación que indica cuándo cuestan lo mismo.","ans":"35+6x=11+10x","why":"Se igualan los costos de ambos planes: 35 + 6x = 11 + 10x. Esto sucede a los 6 días."},{"p":2,"s":"Igualdad","t":"mc","q":"Una compañera afirma que x = 8 resuelve 3x − 5 = 19. ¿Qué comprobación es válida?","opts":["3 + 8 − 5 = 19","3(8) + 5 = 19","3(19) − 5 = 8","3(8) − 5 = 19"],"right":3,"why":"Sustituir x por 8 produce 3(8) − 5 = 24 − 5 = 19: ambos lados coinciden."},{"p":2,"s":"Resolver","t":"num","q":"La suma de tres números enteros consecutivos es 81. ¿Cuál es el menor de los tres? Escribe solo el número.","ans":26,"why":"Si el menor es x, entonces x + (x + 1) + (x + 2) = 81. De 3x + 3 = 81 resulta x = 26."},{"p":2,"s":"Modelar","t":"eq","q":"Dos cajas tienen la misma cantidad de fichas. La primera contiene 5 bolsas con x fichas cada una. La segunda tiene 2 bolsas con x fichas cada una más 27 fichas sueltas. Escribe la ecuación original que representa la igualdad.","ans":"5x=2x+27","why":"La primera caja tiene 5x fichas y la segunda 2x + 27. Como son iguales: 5x = 2x + 27."},{"p":2,"s":"Resolver","t":"num","q":"Compras tres boletos del mismo precio x. Recibes un descuento de 18 pesos sobre la compra completa y pagas 87 pesos. ¿Cuál era el precio de cada boleto antes del descuento? Escribe solo el número.","ans":35,"why":"La situación se modela como 3x − 18 = 87. Entonces 3x = 105 y x = 35 pesos por boleto."}];
  if(QUESTIONS.length!==20 || QUESTIONS.filter(q=>q.p===1).length!==10) throw Error('Se esperan 10 preguntas por PDA');
  const CATEGORIES=['Interpretar','Traducir','Igualdad','Modelar','Resolver'];
  const create=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);if(cls)e.className=cls;return e;};
  const close=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
  const matchNum=(input,target)=>{const n=String(input).toLowerCase().trim().replace(/\s+/g,'').replace(/^x=/,'').replace(',','.').replace(/[−–—]/g,'-');return /^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(n)&&close(Number(n),target);};
  const correct=(q,a)=>String(a).trim()!==''&&(q.t==='mc'?a===String(q.right):q.t==='expr'?expresionesLineales(a,q.ans):q.t==='eq'?miembrosLineales(a,q.ans):matchNum(a,q.ans));
  const hasAnswer=a=>String(a||'').trim().length>0;
  const display=(q,a)=>!hasAnswer(a)?'Sin responder':q.t==='mc'?(q.opts[Number(a)]||'Sin responder'):String(a);
  const solution=q=>q.t==='mc'?q.opts[q.right]:String(q.ans);
  function validStoredAttempt(a){return !!(a&&typeof a.score==='number'&&a.score>=0&&a.score<=20&&Number.isInteger(a.pda1)&&Number.isInteger(a.pda2));}
  function readMemory(record = guardado.leer()) {
    return record && typeof record === 'object'
      ? record
      : {first:null,last:null,count:0,draft:null};
  }
  let memory=readMemory();
  let answers=Array(QUESTIONS.length).fill(''),position=0,currentResult=null,saveWorks=true;
  function persist() { saveWorks = guardado.guardar(memory); }
  function draft(){memory.draft={answers:[...answers],position,updatedAt:Date.now()};persist();}
  function show(stage){$('fx-intro').hidden=stage!=='intro';$('fx-test').hidden=stage!=='test';$('fx-result').hidden=stage!=='result';}
  function stamp(v){if(!v)return 'Fecha no disponible';const d=new Date(v);return Number.isNaN(d.getTime())?'Fecha no disponible':d.toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'});}
  function diagFirst(){const d=window.DespejandoProgreso.leer(DIAG);return validStoredAttempt(d?.first)?d.first:null;}
  const diagnosticoAnterior=(baseline,post)=>{
    const inicial=Date.parse(baseline?.date);
    const final=Date.parse(post?.date);
    return Number.isFinite(inicial)&&Number.isFinite(final)&&inicial<final;
  };
  function summaryForComparison(parent,post){parent.replaceChildren();const baseline=diagFirst();
    if(!diagnosticoAnterior(baseline,post)){
      const box=create('div',undefined,'dg-guidance');
      const title=baseline?'Resultados guardados por separado.':'Comparación no disponible.';
      const explanation=baseline
        ?'La comparación requiere un diagnóstico anterior al primer examen final. Puedes consultar ambos resultados en Mi progreso.'
        :'Para comparar tus aciertos, se necesita un diagnóstico guardado en este navegador antes del primer examen final.';
      box.append(create('strong',title),create('p',explanation));
      parent.append(box);
      return;
    }
    const note=create('div',undefined,'fx-head');note.append(create('h3','Diagnóstico vs. evaluación final'));parent.append(note);
    const grid=create('div',undefined,'fx-compare-grid');
    [['TOTAL',baseline.score,post.score,20],['PDA 1 · LENGUAJE',baseline.pda1,post.pda1,10],['PDA 2 · ECUACIONES',baseline.pda2,post.pda2,10]].forEach(([label,before,after,max])=>{
      const box=create('div',undefined,'fx-compare-card');box.append(create('small',label),create('strong',before+' → '+after+' / '+max),create('p','Primer diagnóstico → primer examen final'));
      const delta=after-before,el=create('p',(delta>0?'+':'')+delta+' '+(Math.abs(delta)===1?'acierto':'aciertos'),'fx-delta'+(delta>0?' positive':delta<0?' negative':''));box.append(el);grid.append(box);
    });
    parent.append(grid,create('p','La comparación usa el primer intento de cada prueba. Como las preguntas son distintas, la diferencia de aciertos es una referencia de tu avance.','fx-comparison-note'));
  }
  function updateProgress(record=memory){const root=$('fx-progress-summary');if(!root)return;root.replaceChildren();
    if(!validStoredAttempt(record.first)){root.append(create('strong','Aún no has realizado el examen final.'),create('p','Después de trabajar ambos módulos, realiza el examen para revisar lo que aprendiste.','muted'));const a=create('a','Comenzar examen final →','btn btn-primary');a.href='#evaluacion';root.append(a);return;}
    root.append(create('strong','Primer examen final · '+stamp(record.first.date)),create('div',record.first.score+' / 20','m1-progress-score'),create('p','Lenguaje algebraico: '+record.first.pda1+'/10 · Ecuaciones lineales: '+record.first.pda2+'/10.','muted'));
    if(record.count>1&&validStoredAttempt(record.last))root.append(create('p','Último intento: '+record.last.score+'/20. El primer intento final se conserva para la comparación.','muted'));
    const comp=create('div',undefined,'fx-comparison');summaryForComparison(comp,record.first);root.append(comp);
    const a=create('a','Consultar examen final →','btn btn-primary');a.href='#evaluacion';root.append(a);
  }
  function intro(){show('intro');const existing=$('fx-existing');existing.replaceChildren();existing.hidden=!validStoredAttempt(memory.first);
    $('fx-start').textContent=memory.draft?'Continuar examen →':validStoredAttempt(memory.first)?'Hacer otro intento →':'Comenzar examen final →';
    if(validStoredAttempt(memory.first)){
      const card=create('div',undefined,'dg-guidance');card.append(create('strong','Ya tienes un examen final registrado.'),create('p','Tu primer resultado fue '+memory.first.score+'/20 y se conservará aunque repitas la prueba.'));
      const actions=create('div',undefined,'dg-actions');
      const view=create('button','Consultar último resultado','btn btn-outline');view.type='button';view.addEventListener('click',()=>displayResult(memory.last||memory.first));actions.append(view);
      const clear=create('button','Borrar solo resultados del examen final','dg-muted-button');clear.type='button';clear.addEventListener('click',clearFinal);actions.append(clear);card.append(actions);existing.append(card);
    }
  }
  function start() {
    memory = readMemory(guardado.recargar());
    if (Array.isArray(memory.draft?.answers) && memory.draft.answers.length === QUESTIONS.length) {
      answers = memory.draft.answers.map(value => String(value ?? ''));
      position = Math.max(0,Math.min(19,Number(memory.draft.position)||0));
    } else {
      answers = Array(QUESTIONS.length).fill('');
      position = 0;
      draft();
    }
    show('test');
    render();
  }
  function updateNav(){const count=answers.filter(hasAnswer).length;$('fx-test-counter').textContent='Pregunta '+(position+1)+' de 20 · '+count+' respondidas';$('fx-progress').setAttribute('aria-valuenow',String(count));$('fx-progress-fill').style.width=(count*5)+'%';
    $('fx-back').disabled=position===0;$('fx-next').hidden=position===19;$('fx-finish').hidden=position!==19;
    const grid=$('fx-map-grid');grid.replaceChildren();QUESTIONS.forEach((q,i)=>{const b=create('button',i+1,'dg-map-btn'+(hasAnswer(answers[i])?' answered':'')+(i===position?' current':''));b.type='button';b.setAttribute('aria-label','Pregunta '+(i+1)+(hasAnswer(answers[i])?', respondida':', sin responder'));if(i===position)b.setAttribute('aria-current','step');b.addEventListener('click',()=>goToQuestion(i));grid.append(b);});
  }
  function goToQuestion(index) {
    position = index;
    draft();
    render();
  }
  function render(){const q=QUESTIONS[position];$('fx-section-pill').textContent=q.p===1?'PDA 1 · LENGUAJE ALGEBRAICO':'PDA 2 · ECUACIONES LINEALES';$('fx-question-category').textContent=q.s;questionHeading.textContent=q.q;
    $('fx-question-caption').textContent=q.t==='mc'?'Selecciona una respuesta.':q.t==='num'?'Escribe el resultado numérico. También se acepta x = seguido del valor.':q.t==='eq'?'Escribe la igualdad original con x, sin despejarla. Puedes intercambiar los dos miembros.':'Escribe una expresión utilizando x y, cuando sea necesario, paréntesis.';
    const area=$('fx-answer-area');area.replaceChildren();
    if(q.t==='mc'){
      const grp=create('div',undefined,'dg-answer-group');q.opts.forEach((label,i)=>{const choice=create('label',undefined,'dg-answer');const input=document.createElement('input');input.type='radio';input.name='fx-answer-'+position;input.value=String(i);input.checked=answers[position]===String(i);input.addEventListener('change',()=>{answers[position]=String(i);draft();updateNav();});choice.append(input,create('span',label));grp.append(choice);});area.append(grp);
    } else {
      const label=create('label',q.t==='num'?'Tu resultado:':q.t==='eq'?'Tu ecuación:':'Tu expresión:','dg-write-label');label.htmlFor='fx-write';const input=document.createElement('input');input.type='text';input.id='fx-write';input.className='dg-written';input.maxLength=110;input.autocomplete='off';input.spellcheck=false;input.value=answers[position];input.addEventListener('input',()=>{answers[position]=input.value;draft();updateNav();});area.append(label,input);
    }
    updateNav();
    questionHeading.focus();
  }
  function score(){const marks=QUESTIONS.map((q,i)=>correct(q,answers[i]));const buckets={};CATEGORIES.forEach(s=>buckets[s]={right:0,total:0});QUESTIONS.forEach((q,i)=>{buckets[q.s].total++;if(marks[i])buckets[q.s].right++;});return {score:marks.filter(Boolean).length,pda1:marks.slice(0,10).filter(Boolean).length,pda2:marks.slice(10).filter(Boolean).length,buckets,answers:[...answers],marks,date:new Date().toISOString()};}
  function finish(){const missing=answers.filter(a=>!hasAnswer(a)).length;
    if(missing&&!window.confirm('Quedaron '+missing+' preguntas sin responder y contarán como incorrectas. ¿Quieres entregar el examen final?'))return;
    const attempt=score();if(!validStoredAttempt(memory.first))memory.first=attempt;memory.last=attempt;memory.count=(Number(memory.count)||0)+1;memory.draft=null;persist();displayResult(attempt);
  }
  function displayResult(a){if(!a)return intro();currentResult=a;show('result');const scores=$('fx-result-scores');scores.replaceChildren();
    [['TOTAL',a.score,20,'Puntuación de la evaluación'],['PDA 1 · LENGUAJE',a.pda1,10,'Traducción e interpretación'],['PDA 2 · ECUACIONES',a.pda2,10,'Modelación y resolución']].forEach(([t,v,m,desc])=>{const box=create('div',undefined,'dg-score-card');box.append(create('small',t),create('strong',v+' / '+m),create('span',desc));scores.append(box);});
    const first=validStoredAttempt(memory.first)?memory.first:a;summaryForComparison($('fx-comparison'),first);
    const skills=$('fx-skills');skills.replaceChildren();CATEGORIES.forEach(category=>{const data=a.buckets?.[category]||{right:0,total:0};if(!data.total)return;const line=create('div');const head=create('div',undefined,'dg-skill-head');head.append(create('span',category),create('span',data.right+' de '+data.total));const track=create('div',undefined,'dg-skill-track'),bar=create('div',undefined,'dg-skill-fill');bar.style.width=(100*data.right/data.total)+'%';track.append(bar);line.append(head,track);skills.append(line);});
    const guide=$('fx-recommendation');guide.replaceChildren();const weaker=a.pda1<=a.pda2?1:2;guide.append(create('strong','Sugerencia para seguir aprendiendo'),create('p',weaker===1?'Vuelve a repasar la traducción de situaciones y el significado de los paréntesis en el Módulo 1.':'Vuelve a practicar el planteamiento, la resolución y la comprobación de ecuaciones en el Módulo 2.'));const link=create('a','Revisar Módulo '+weaker+' →','inline-link');link.href='#modulo'+weaker;guide.append(link);
    $('fx-storage-note').textContent=saveWorks?'Los resultados se guardan solo en este navegador. El primer intento final permanece para la comparación; los demás son oportunidades de práctica.':'Este navegador no permitió guardar el resultado. Descarga el reporte antes de cerrar la página.';
    const review=$('fx-review');review.replaceChildren();QUESTIONS.forEach((q,i)=>{const ok=!!a.marks?.[i];const card=create('div',undefined,'dg-review-card '+(ok?'correct':'incorrect'));card.append(create('span',(ok?'✓ Correcta · ':'↻ Por reforzar · ')+q.s,'dg-review-badge'),create('h4',(i+1)+'. '+q.q),create('p','Tu respuesta: '+display(q,a.answers?.[i]??'')),create('p','Respuesta esperada: '+solution(q)),create('p',q.why));review.append(card);});updateProgress();
    resultHeading.focus();
  }
  function clearFinal(){if(!window.confirm('¿Borrar el primer examen final, los intentos repetidos y el borrador de este navegador? El diagnóstico y los módulos permanecerán guardados.'))return;if(!guardado.borrar())return;memory=readMemory(null);position=0;answers=Array(20).fill('');currentResult=null;intro();updateProgress();}
  function report(){if(!currentResult)return;const a=currentResult,diag=diagFirst();const lines=['DESPEJANDO DUDAS — EVALUACIÓN FINAL','Reporte generado en este navegador','Fecha: '+stamp(a.date),'','Total: '+a.score+'/20','PDA 1 · Lenguaje algebraico: '+a.pda1+'/10','PDA 2 · Ecuaciones lineales: '+a.pda2+'/10'];
    CATEGORIES.forEach(s=>lines.push(s+': '+(a.buckets?.[s]?.right||0)+'/'+(a.buckets?.[s]?.total||0)));
    const first=validStoredAttempt(memory.first)?memory.first:a;
    if(diagnosticoAnterior(diag,first)){lines.push('','COMPARACIÓN DE PRIMEROS INTENTOS','Diagnóstico inicial: '+diag.score+'/20','Primer examen final: '+first.score+'/20','Diferencia total: '+(first.score-diag.score)+' aciertos','PDA 1, diferencia: '+(first.pda1-diag.pda1)+' aciertos','PDA 2, diferencia: '+(first.pda2-diag.pda2)+' aciertos');}else lines.push('','Comparación no disponible: se requiere un diagnóstico anterior al primer examen final.');
    lines.push('','DETALLE DE RESPUESTAS');QUESTIONS.forEach((q,i)=>lines.push((i+1)+'. '+q.q+'\nTu respuesta: '+display(q,a.answers?.[i]??'')+'\nRespuesta esperada: '+solution(q)+'\nResultado: '+(a.marks?.[i]?'Correcta':'Por reforzar')+'\nExplicación: '+q.why+'\n'));
    lines.push('El reporte incluye tus respuestas tal como las escribiste.');const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='Despejando_Dudas_Examen_Final_Reporte.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('fx-start').addEventListener('click',start);
  $('fx-back').addEventListener('click',()=>{if(position>0)goToQuestion(position-1);});
  $('fx-next').addEventListener('click',()=>{if(position<19)goToQuestion(position+1);});
  $('fx-finish').addEventListener('click',finish);
  $('fx-retake').addEventListener('click',()=>{answers=Array(20).fill('');position=0;draft();show('test');render();});
  $('fx-download').addEventListener('click',report);
  window.addEventListener('hashchange',()=>{if(location.hash==='#progreso')updateProgress();if(location.hash==='#evaluacion'&&$('fx-test').hidden&&$('fx-result').hidden)intro();});
  window.addEventListener('dd:progress', e=>{if(e.detail?.key===DIAG)updateProgress();});
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) {
      if (!$('fx-test').hidden) {
        updateProgress(readMemory());
        return;
      }
      memory = readMemory(guardado.recargar());
      if (!$('fx-intro').hidden) intro();
      updateProgress();
    } else if (event.key === DIAG) {
      updateProgress();
    }
  });
  intro();updateProgress();
})();
