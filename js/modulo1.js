/* V5: escritura algebraica y evaluación local (sin librerías ni servidores). */
  (() => {
    'use strict';
    const el = id => document.getElementById(id);
    const storageKey = 'despejando-dudas-m1-evaluacion-v1';
    function equivalent(given, expected) {
      return window.DespejandoAlgebra.equivalentes(given, expected);
    }
    const practice={
      basico:[
        {q:'El doble de un número.',a:'2x',hint:'El doble significa multiplicar por 2.',why:'Si el número es x, el doble se representa como 2x.'},
        {q:'La suma de un número y nueve.',a:'x+9',hint:'Empieza con x y agrega 9.',why:'La suma de un número desconocido y nueve es x + 9.'},
        {q:'Doce menos un número.',a:'12-x',hint:'La cantidad inicial es 12.',why:'A doce le restamos x: 12 − x.'},
        {q:'El triple de un número.',a:'3x',hint:'Triple quiere decir tres veces una cantidad.',why:'Tres grupos de x se escriben como 3x.'},
        {q:'Un número disminuido en cinco.',a:'x-5',hint:'La cantidad de la que partes es x.',why:'Restamos cinco al número: x − 5.'},
        {q:'La cuarta parte de un número.',a:'x/4',hint:'Divide el total entre cuatro.',why:'La cuarta parte se calcula dividiendo x entre 4.'},
        {q:'El cuadrado de un número.',a:'x^2',hint:'Multiplica el número por sí mismo.',why:'El cuadrado de x es x².'}
      ],
      intermedio:[
        {q:'A un número le sumas ocho y después multiplicas el resultado por dos.',a:'2(x+8)',hint:'Primero suma x + 8, después multiplica todo por 2.',why:'El resultado completo x + 8 se multiplica por 2: 2(x + 8).'},
        {q:'Restas seis al triple de un número.',a:'3x-6',hint:'Primero encuentra el triple.',why:'El triple es 3x; al quitarle seis queda 3x − 6.'},
        {q:'La quinta parte de la suma de un número y diez.',a:'(x+10)/5',hint:'Suma antes de dividir.',why:'Divides toda la suma (x + 10) entre 5.'},
        {q:'El doble de un número y después agregas once.',a:'2x+11',hint:'No multipliques el once por dos.',why:'Solo x se duplica: 2x + 11.'},
        {q:'Luis tiene x años. Ana tiene cuatro años más que Luis.',a:'x+4',hint:'La edad de Luis es la base.',why:'La edad de Ana es x + 4.'},
        {q:'La suma del triple de un número y otro número diferente.',a:'3x+y',hint:'Usa x y y para representar dos números distintos.',why:'El triple del primero es 3x, luego sumamos y.'},
        {q:'Cuatro menos que la mitad de un número.',a:'x/2-4',hint:'Primero calcula la mitad de x y después resta cuatro.',why:'«Cuatro menos que» indica quitar cuatro de x/2.'}
      ],
      reto:[
        {q:'Cada entrada al cine cuesta x pesos. Compras cuatro entradas y pagas una sola comisión de 20 pesos.',a:'4x+20',hint:'La comisión se cobra una sola vez, no cuatro.',why:'Las entradas suman 4x y la comisión añade 20.'},
        {q:'Compras tres cuadernos de x pesos cada uno y dos lápices de y pesos cada uno.',a:'3x+2y',hint:'Usa una letra para cada precio.',why:'Tres cuadernos cuestan 3x y dos lápices 2y; se suman.'},
        {q:'Dos hermanos tienen x canicas cada uno. Cada hermano regala tres canicas. ¿Cuántas les quedan entre los dos?',a:'2(x-3)',hint:'Cada hermano conserva x − 3.',why:'Los dos conservan 2(x − 3) canicas en total.'},
        {q:'Recorres x kilómetros diarios durante cinco días y luego doce kilómetros más.',a:'5x+12',hint:'Cinco recorridos de x kilómetros y un recorrido adicional.',why:'Cinco días son 5x kilómetros; sumamos 12.'},
        {q:'La mitad de la diferencia entre el triple de un número y cuatro.',a:'(3x-4)/2',hint:'A la cantidad 3x − 4 divídela entre 2.',why:'Primero restamos cuatro al triple; luego tomamos la mitad.'},
        {q:'Un rectángulo mide x unidades de alto y x + 2 unidades de ancho. ¿Cuál es su área?',a:'x(x+2)',hint:'Área = alto multiplicado por ancho.',why:'Multiplicamos x por (x + 2).'},
        {q:'Tienes dos bolsas con x + 5 fichas en cada una y luego regalas tres fichas en total.',a:'2(x+5)-3',hint:'Dos bolsas iguales, y las tres fichas se quitan solo una vez.',why:'Las dos bolsas contienen 2(x + 5) fichas; restamos 3.'}
      ]
    };
    let level='basico',current=null,last=-1,solved=0,attempts=0,solvedCurrent=false;
    const levelButtons=[...document.querySelectorAll('.m1-level[data-level]')];
    function newPractice(){
      const list=practice[level];
      let index=Math.floor(Math.random()*list.length);
      if(list.length>1 && index===last)index=(index+1)%list.length;
      last=index;current=list[index];solvedCurrent=false;
      el('m1-lab-question').textContent=current.q;
      el('m1-lab-category').textContent=level==='basico'?'Nivel básico':level==='intermedio'?'Nivel intermedio':'Nivel reto';
      el('m1-lab-context').textContent=level==='reto'?'Piensa qué representa cada cantidad y el orden de las operaciones.':'Utiliza x para un número; cuando el reto lo indique, también puedes usar y.';
      el('m1-lab-input').value='';el('m1-lab-input').disabled=false;
      el('m1-lab-feedback').hidden=true;
      el('m1-lab-hint').disabled=false;
      el('m1-lab-reveal').disabled=false;
    }
    function practiceFeedback(title,description,error=false){
      const area=el('m1-lab-feedback');area.replaceChildren();area.className='m1-feedback'+(error?' error':'');
      const strong=document.createElement('strong');strong.textContent=title;
      const text=document.createElement('p');text.textContent=description;
      area.append(strong,text);area.hidden=false;
    }
    levelButtons.forEach(button=>button.addEventListener('click',()=>{
      level=button.dataset.level;last=-1;
      levelButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      newPractice();
    }));
    el('m1-lab-form').addEventListener('submit',event=>{
      event.preventDefault();
      const typed=el('m1-lab-input').value.trim();
      if(!typed){practiceFeedback('Escribe una respuesta para intentarlo.','Por ejemplo: 2x + 4.',true);return;}
      try{
        const good=equivalent(typed,current.a);
        attempts++;el('m1-lab-attempts').textContent=attempts;
        if(good){
          if(!solvedCurrent){solved++;solvedCurrent=true;el('m1-lab-solves').textContent=solved;}
          practiceFeedback('✓ ¡Correcto! También puede escribirse como '+current.a+'.',current.why);
        }else practiceFeedback('Todavía no coincide, ¡intenta de nuevo!','Revisa el orden de las operaciones y los paréntesis. Puedes abrir una pista o volver a escribir.',true);
      }catch(err){practiceFeedback('Revisa cómo escribiste la expresión.',err.message || 'Usa números, letras y operaciones.',true);}
    });
    el('m1-lab-hint').addEventListener('click',()=>practiceFeedback('Pista',current.hint));
    el('m1-lab-reveal').addEventListener('click',()=>practiceFeedback('Una solución es: '+current.a,current.why));
    el('m1-lab-next').addEventListener('click',()=>{newPractice();el('m1-lab-question').focus();});
    newPractice();

    // Seis preguntas de opción múltiple y cuatro de expresión libre.
    const exam=[
      {type:'choice',topic:'Traducción',q:'¿Cómo escribes «el cuádruple de un número, menos tres»?',opts:['4(x − 3)','x⁴ − 3','4x − 3','3x − 4'],correct:2,why:'El cuádruple es 4x, después se restan 3 unidades.'},
      {type:'choice',topic:'Interpretación',q:'¿Qué historia representa 7 − x?',opts:['Tienes x estampas y pierdes siete.','Tienes siete estampas y regalas x.','Recibes siete veces x estampas.','Repartes siete estampas entre x personas.'],correct:1,why:'La cantidad inicial es 7 y se le quitan x estampas.'},
      {type:'choice',topic:'Paréntesis',q:'«La mitad de la suma de un número y diez» se escribe:',opts:['x/2 + 10','(x + 10)/2','2(x + 10)','x + 10/2'],correct:1,why:'Primero sumamos x + 10 y dividimos el resultado completo entre 2.'},
      {type:'choice',topic:'Interpretación',q:'¿Cuál situación corresponde a 3(x + 4)?',opts:['Tres bolsas con x dulces y cuatro dulces extra en total.','Tres bolsas con x + 4 dulces cada una.','Cuatro bolsas con x + 3 dulces cada una.','Tres bolsas con x dulces menos cuatro.'],correct:1,why:'Cada una de tres bolsas contiene x + 4 dulces, por eso se multiplica todo por 3.'},
      {type:'choice',topic:'Variables',q:'La suma de dos números que pueden ser diferentes se representa como:',opts:['x²','2x','x + y','xy'],correct:2,why:'Usamos x e y para distinguir ambas cantidades; su suma es x + y.'},
      {type:'choice',topic:'Interpretación',q:'¿Qué situación representa x² + 1?',opts:['El área de un cuadrado de lado x, más una unidad cuadrada.','El perímetro de un cuadrado de lado x, más una unidad.','El doble de un número, más uno.','El área de un cuadrado de lado x + 1.'],correct:0,why:'El área de un cuadrado de lado x es x²; luego añadimos 1.'},
      {type:'typed',topic:'Traducción',q:'Multiplicas un número por tres y después le sumas cinco. Escribe la expresión.',answer:'3x+5',why:'Primero 3x y luego +5: 3x + 5.'},
      {type:'typed',topic:'Orden de operaciones',q:'Cinco menos que la mitad de un número. Escribe la expresión.',answer:'x/2-5',why:'A la mitad x/2 se le resta cinco.'},
      {type:'typed',topic:'Situaciones cotidianas',q:'Tienes dos cajas con x lápices cada una y tres lápices sueltos. ¿Cuántos lápices hay en total? Exprésalo en álgebra.',answer:'2x+3',why:'Dos cajas aportan 2x lápices y los tres sueltos se agregan: 2x + 3.'},
      {type:'typed',topic:'Paréntesis',q:'Escribe «el doble de la suma de un número y siete».',answer:'2(x+7)',why:'Toda la suma x + 7 debe multiplicarse por 2: 2(x + 7).'}
    ];
    const draft = readExamRecord().draft;
    const validDraft = Array.isArray(draft?.answers) && draft.answers.length === exam.length;
    let examIndex = validDraft && Number.isInteger(draft.position) && draft.position >= 0 &&
      draft.position < exam.length ? draft.position : 0;
    let answers = exam.map((q, index) => {
      const answer = validDraft ? draft.answers[index] : '';
      if (q.type === 'typed') return typeof answer === 'string' ? answer.slice(0, 90) : '';
      return Number.isInteger(answer) && answer >= 0 && answer < q.opts.length ? answer : '';
    });
    const typed=el('m1-test-input'), optionArea=el('m1-test-options');
    function displayExam(){
      const q=exam[examIndex];
      el('m1-test-count').textContent='Pregunta '+(examIndex+1)+' de '+exam.length;
      el('m1-test-category').textContent=q.topic;
      el('m1-test-question').textContent=q.q;
      optionArea.replaceChildren();
      el('m1-test-typed').hidden=q.type!=='typed';
      optionArea.hidden=q.type==='typed';
      if(q.type==='typed')typed.value=answers[examIndex] || '';
      else q.opts.forEach((opt,i)=>{
        const button=document.createElement('button');button.type='button';button.className='m1-option m1-story-option';
        button.textContent=String.fromCharCode(65+i)+'. '+opt;
        button.setAttribute('aria-pressed',String(answers[examIndex]===i));
        button.addEventListener('click',()=>{
          answers[examIndex]=i;
          [...optionArea.children].forEach((b,index)=>b.setAttribute('aria-pressed',String(index===i)));
          countAnswers();
          saveDraft();
        });
        optionArea.appendChild(button);
      });
      el('m1-test-prev').disabled=examIndex===0;
      el('m1-test-next').hidden=examIndex===exam.length-1;
      el('m1-test-submit').hidden=examIndex!==exam.length-1;
      countAnswers();
    }
    function saveTyped(){if(exam[examIndex].type==='typed')answers[examIndex]=typed.value.trim();}
    function countAnswers() {
      const count = answers.filter(answer => answer !== '').length;
      el('m1-test-completed').textContent = count + ' / ' + exam.length + ' respondidas';
      el('m1-test-progress').setAttribute('aria-valuenow', String(count));
      el('m1-test-fill').style.width = (count / exam.length * 100) + '%';
    }
    typed.addEventListener('input', () => { saveTyped(); countAnswers(); saveDraft(); });
    function go(index) {
      saveTyped();
      examIndex = index;
      saveDraft();
      displayExam();
      el('m1-test-question').focus();
    }
    el('m1-test-prev').addEventListener('click',()=>{if(examIndex>0)go(examIndex-1);});
    el('m1-test-next').addEventListener('click',()=>{if(examIndex<exam.length-1)go(examIndex+1);});
    function readExamRecord() {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
      } catch (error) {}
      return {};
    }
    function readResult(saved = readExamRecord()) {
      if (Number.isInteger(saved.last) && Number.isInteger(saved.best) &&
          saved.last >= 0 && saved.last <= 10 && saved.best >= saved.last && saved.best <= 10) return saved;
      return null;
    }
    function writeExamRecord(record) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(record));
      } catch (error) {
        return false;
      }
      window.dispatchEvent(new CustomEvent('dd:progress'));
      return true;
    }
    function saveDraft() {
      const record = readExamRecord();
      const hadDraft = Boolean(record.draft);
      const hasDraft = examIndex > 0 || answers.some(answer => answer !== '');
      if (!hadDraft && !hasDraft) return;
      if (hasDraft) record.draft = {position: examIndex, answers, updatedAt: Date.now()};
      else delete record.draft;
      if (writeExamRecord(record) && hadDraft !== hasDraft) renderProgress(readResult(record), hasDraft);
    }
    function storeResult(score) {
      const record = readExamRecord();
      const previous = readResult(record);
      delete record.draft;
      record.last = score;
      record.best = Math.max(score, previous?.best || 0);
      record.date = new Date().toISOString();
      return writeExamRecord(record);
    }
    function renderProgress(result, hasDraft = Boolean(readExamRecord().draft)){
      const target=el('m1-progress-summary');target.replaceChildren();
      const title=document.createElement('strong');
      title.textContent=result?'Tu evaluación del Módulo 1':'Aún no has realizado la evaluación';
      const desc=document.createElement('p');desc.className='muted';
      if(result){
        const score=document.createElement('div');score.className='m1-progress-score';score.textContent=result.last+' / 10 ('+result.last*10+'%)';
        desc.textContent='Mejor resultado guardado: '+result.best+' / 10. Puedes repetir el cuestionario para mejorar.';
        target.append(title,score,desc);
      } else {desc.textContent='Realiza el cuestionario para guardar aquí tu resultado en este dispositivo.';target.append(title,desc);}
      const link = document.createElement('a');
      link.className = 'btn btn-primary';
      link.href = '#m1-evaluacion';
      link.textContent = hasDraft ? 'Continuar evaluación →' :
        result ? 'Volver a la evaluación →' : 'Ir a la evaluación →';
      target.append(link);
    }
    function labelAnswer(q,index){
      const value=answers[index];if(value===''||value===null||value===undefined)return 'Sin respuesta';
      return q.type==='choice'?q.opts[value]:' '+value;
    }
    function correctAnswer(q){return q.type==='choice'?q.opts[q.correct]:q.answer;}
    function gradeExam(){
      saveTyped();const missing=answers.filter(v=>v===''||v===null).length;
      if(missing && !window.confirm('Hay '+missing+' pregunta'+(missing===1?' sin responder':'s sin responder')+'. Se contarán como incorrectas. ¿Deseas terminar?'))return;
      let score=0;const review=el('m1-test-review');review.replaceChildren();
      exam.forEach((q,i)=>{
        let good=false;const answer=answers[i];
        if(answer!==''&&answer!==null){
          if(q.type==='choice') good=answer===q.correct;
          else {try{good=equivalent(answer,q.answer);}catch(e){good=false;}}
        }
        if(good)score++;
        const card=document.createElement('div');card.className='m1-review-card '+(good?'is-good':'is-wrong');
        const title=document.createElement('strong');title.textContent=(good?'✓ ':'✦ ')+(i+1)+'. '+q.topic;
        const question=document.createElement('p');question.textContent=q.q;
        const mine=document.createElement('p');mine.className='m1-review-answer';mine.textContent='Tu respuesta: '+labelAnswer(q,i);
        const correct=document.createElement('p');correct.className='m1-review-answer';correct.textContent='Respuesta correcta: '+correctAnswer(q);
        const why=document.createElement('p');why.textContent=q.why;
        card.append(title,question,mine,correct,why);review.appendChild(card);
      });
      const stored=storeResult(score);renderProgress(readResult());
      el('m1-test-score').textContent=score+' / '+exam.length+' · '+score*10+'%';
      el('m1-test-result-title').textContent=score>=7?'¡Evaluación completada!':'Ahora sabes qué reforzar';
      el('m1-test-message').textContent=score>=9?'¡Excelente dominio del lenguaje algebraico!':score>=7?'Vas por buen camino. Revisa las respuestas que más te costaron.':'Regresa a la tabla y al laboratorio libre y vuelve a intentarlo. Aprender también es corregir.';
      el('m1-test-storage-note').textContent=stored?'Tu último resultado y tu mejor puntaje se guardaron en este navegador.':'La evaluación está completada, pero este navegador no permitió guardar el resultado. Puedes revisarlo ahora.';
      el('m1-test-form').hidden=true;el('m1-test-result').hidden=false;
      const resultTitle = el('m1-test-result-title');
      resultTitle.tabIndex = -1;
      resultTitle.focus({preventScroll: true});
      el('m1-test-result').scrollIntoView({behavior:'smooth',block:'start'});
    }
    el('m1-test-submit').addEventListener('click',gradeExam);
    el('m1-test-restart').addEventListener('click',()=>{
      examIndex = 0;
      answers = Array(exam.length).fill('');
      el('m1-test-form').hidden = false;
      el('m1-test-result').hidden = true;
      saveDraft();
      displayExam();
      el('m1-test-question').focus();
    });
    displayExam();renderProgress(readResult());
  })();
