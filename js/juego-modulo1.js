/* V4 · Glosario filtrable y juegos locales en dos sentidos. */
    (function(){
      'use strict';
      const el = id => document.getElementById(id);
      const filterGroup=el('m1-filter-group'),filterSearch=el('m1-filter-search'),filterCount=el('m1-filter-count');
      const glossaryRows=[...document.querySelectorAll('.m1-glossary-row')];
      function normalize(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
      function updateGlossary(){
        const category=filterGroup.value;
        const search=normalize(filterSearch.value.trim());
        let visible=0;
        glossaryRows.forEach(row=>{
          const match=(category==='Todas'||row.dataset.group===category)&&(!search||normalize(row.textContent).includes(search));
          row.hidden=!match;
          if(match) visible++;
        });
        filterCount.textContent=visible+' ejemplo'+(visible===1?'':'s');
      }
      filterGroup.addEventListener('change',updateGlossary);
      filterSearch.addEventListener('input',updateGlossary);
      updateGlossary();
      const sets={
        forward:[
          {q:'«El doble de un número y después sumarle cinco»',opts:['2(x + 5)','2x + 5','x + 7','5x + 2'],correct:1,hint:'Multiplica primero x por 2. Después suma 5.',why:'El doble de x es 2x; al sumar cinco obtenemos 2x + 5.'},
          {q:'«La mitad de un número»',opts:['2x','x − 2','x / 2','2 / x'],correct:2,hint:'La mitad significa dividir entre dos.',why:'Para encontrar la mitad de x, dividimos x entre 2.'},
          {q:'«Siete menos que un número»',opts:['7 − x','x − 7','x + 7','7x'],correct:1,hint:'La frase «menos que» indica quitar siete del número inicial.',why:'Si tienes x y le quitas 7, queda x − 7. El orden importa.'},
          {q:'«El triple de la suma de un número y ocho»',opts:['3x + 8','x + 24','3(x + 8)','8(x + 3)'],correct:2,hint:'Primero suma x y 8. Luego triplica el resultado.',why:'Los paréntesis muestran que el triple afecta a toda la suma: 3(x + 8).'},
          {q:'«Diez menos el doble de un número»',opts:['2x − 10','10 − 2x','10 − x','2(10 − x)'],correct:1,hint:'Empieza con 10 y réstale el doble de x.',why:'El doble es 2x; se lo restamos a diez: 10 − 2x.'},
          {q:'«El cuádruple de la diferencia entre un número y tres»',opts:['4x − 3','x − 12','4(x − 3)','3(x − 4)'],correct:2,hint:'Calcula la diferencia x − 3 y después multiplícala por cuatro.',why:'Primero va (x − 3); su cuádruple es 4(x − 3).'},
          {q:'Cada cuaderno cuesta p pesos. ¿Cuál es el costo de cuatro cuadernos iguales?',opts:['p + 4','4 / p','p − 4','4p'],correct:3,hint:'Suma p cuatro veces.',why:'p + p + p + p es igual a 4p pesos.'},
          {q:'«La suma de un número entero y el que le sigue»',opts:['x + (x + 1)','x(x + 1)','2x + 2','x + 1'],correct:0,hint:'Si el primero es x, el siguiente es x + 1.',why:'La suma de los dos números consecutivos es x + (x + 1).'},
          {q:'«La mitad de la suma de un número y seis»',opts:['x / 2 + 6','(x + 6) / 2','2(x + 6)','x + 3'],correct:1,hint:'Suma x y 6 antes de dividir el total entre dos.',why:'Los paréntesis indican que dividimos toda la suma: (x + 6) / 2.'},
          {q:'«El cuadrado de un número y después sumarle cuatro»',opts:['(x + 4)²','2x + 4','x² + 4','4x²'],correct:2,hint:'El cuadrado de x se escribe x².',why:'Primero elevamos x al cuadrado, luego añadimos cuatro: x² + 4.'},
          {q:'En una papelería, cada lápiz cuesta x pesos. Compras tres lápices y un borrador de 8 pesos. ¿Cuánto pagas?',opts:['3(x + 8)','3x + 8','x + 11','8x + 3'],correct:1,hint:'Calcula primero el precio de tres lápices.',why:'Los lápices cuestan 3x pesos. Con el borrador son 3x + 8.'},
          {q:'«La diferencia entre doce y un número»',opts:['x − 12','12 + x','12x','12 − x'],correct:3,hint:'La palabra «entre» marca el orden: primero doce, luego el número.',why:'A doce le restamos x, así que escribimos 12 − x.'}
        ],
        reverse:[
          {q:'2x + 7',opts:['Dos cajas con x lápices cada una y siete lápices sueltos.','Dos cajas con siete lápices cada una y x lápices sueltos.','Siete cajas con x lápices cada una y dos lápices sueltos.','Dos cajas con x + 7 lápices cada una.'],correct:0,hint:'La expresión 2x representa dos grupos de x; el + 7 va aparte.',why:'Dos cajas de x lápices suman 2x, y siete sueltos hacen 2x + 7.'},
          {q:'x − 4',opts:['Ten pesos repartidos entre x personas.','Tienes x pesos y gastas cuatro.','Tienes cuatro pesos y gastas x.','Compras cuatro objetos de x pesos.'],correct:1,hint:'La cantidad inicial es x; se le quitan cuatro.',why:'Si empiezas con x pesos y gastas 4, te quedan x − 4.'},
          {q:'5(x + 3)',opts:['Cinco bolsas con x dulces y tres dulces extra en total.','Tres bolsas con x + 5 dulces cada una.','Cinco bolsas con x + 3 dulces en cada bolsa.','Una bolsa con cinco dulces y x + 3 bolsas adicionales.'],correct:2,hint:'Los paréntesis indican que cada uno de los cinco grupos tiene x + 3.',why:'Cinco bolsas de (x + 3) dulces representan 5(x + 3).'},
          {q:'4x',opts:['Un boleto de x pesos más cuatro pesos de comisión.','Cuatro boletos de x pesos cada uno.','Un boleto cuesta cuatro pesos menos que x.','Cuatro amigos reparten x pesos entre todos.'],correct:1,hint:'4x indica cuatro grupos de tamaño x.',why:'Cuatro boletos a x pesos cada uno cuestan 4x pesos.'},
          {q:'12 − x',opts:['Tienes x canicas y pierdes doce.','Tienes doce canicas y te regalan x.','Tienes doce canicas y pierdes x.','Tienes x docenas de canicas.'],correct:2,hint:'El número 12 es la cantidad inicial.',why:'Comenzamos con 12 canicas y quitamos x; quedan 12 − x.'},
          {q:'x / 3',opts:['Tres personas reciben x pesos cada una.','Repartes x pesos por igual entre tres personas.','Guardas tres pesos y luego sumas x.','Repartes tres pesos entre x personas.'],correct:1,hint:'El denominador 3 es el número de partes iguales.',why:'Al dividir x pesos entre tres personas, cada una recibe x / 3.'},
          {q:'2(x − 5)',opts:['Dos amigos tienen x monedas en total y gastan cinco.','Una persona tiene dos veces x monedas y gasta cinco.','Dos personas tienen x monedas cada una y cada una gasta cinco.','Cinco personas tienen x − 2 monedas cada una.'],correct:2,hint:'Los paréntesis significan que a cada grupo se le quitan cinco.',why:'Cada persona conserva x − 5 monedas. Entre las dos son 2(x − 5).'},
          {q:'x + y',opts:['Un equipo tiene x puntos y otro y puntos; se suman.','Un equipo tiene x puntos y pierde y.','Un equipo multiplica sus x puntos por y.','Un equipo reparte x puntos entre y jugadores.'],correct:0,hint:'Hay dos cantidades distintas que se suman.',why:'Sumar x puntos más y puntos se escribe x + y.'},
          {q:'(x + 8) / 2',opts:['Repartes x dulces entre dos amigos y agregas ocho a cada uno.','Juntas x dulces y ocho adicionales; después repartes todo entre dos.','Compras dos paquetes con x + 8 dulces cada uno.','Repartes ocho dulces entre x amigos y agregas dos.'],correct:1,hint:'Primero suma x + 8, luego divide ese total entre dos.',why:'La cantidad completa es x + 8; al repartirla en dos partes iguales queda (x + 8) / 2.'},
          {q:'x²',opts:['El perímetro de un cuadrado cuyo lado mide x.','El área de un rectángulo con lados x y 2.','El área de un cuadrado cuyo lado mide x.','La longitud de dos segmentos de x unidades.'],correct:2,hint:'El área de un cuadrado es lado por lado.',why:'Un cuadrado de lado x tiene área x × x = x².'}
        ]
      };
      const modeButtons=[el('m1-mode-forward'),el('m1-mode-reverse')];
      const count=el('m1-game-count'),points=el('m1-game-points'),progress=el('m1-progress'),fill=el('m1-game-fill');
      const category=el('m1-game-category'),qtext=el('m1-game-question'),options=el('m1-options'),hint=el('m1-hint'),feedback=el('m1-feedback');
      const check=el('m1-check'),next=el('m1-next'),hintButton=el('m1-show-hint'),wrap=el('m1-game-question-wrap'),finish=el('m1-finish');
      let mode='forward',index=0,score=0,selected=-1,evaluated=false;
      const questions=()=>sets[mode];
      function setMode(nextMode){
        mode=nextMode;index=0;score=0;
        modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===nextMode)));
        el('m1-mode-description').textContent=nextMode==='forward'
          ?'Lee una frase y elige la expresión algebraica correcta. Puedes pedir una pista antes de responder.'
          :'Lee la expresión algebraica y selecciona la historia que mejor la representa. ¡Ahora piensas en sentido inverso!';
        progress.setAttribute('aria-valuemax',String(questions().length));
        showQuestion();
      }
      function showQuestion(){
        const q=questions()[index];selected=-1;evaluated=false;
        count.textContent='Reto '+(index+1)+' de '+questions().length;
        points.textContent=score+' acierto'+(score===1?'':'s');
        fill.style.width=(index/questions().length*100)+'%';
        progress.setAttribute('aria-valuenow',String(index));
        category.textContent=mode==='forward'?'Traduce a álgebra':'Elige la historia correcta';
        qtext.textContent=q.q;
        qtext.classList.toggle('m1-algebra-question',mode==='reverse');
        options.replaceChildren();
        q.opts.forEach((answer,i)=>{
          const button=document.createElement('button');
          button.type='button';button.className='m1-option'+(mode==='reverse'?' m1-story-option':'');
          button.textContent=String.fromCharCode(65+i)+'. '+answer;
          button.setAttribute('aria-pressed','false');
          button.addEventListener('click',()=>{
            if(evaluated)return;
            selected=i;
            [...options.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
            check.disabled=false;
          });
          options.appendChild(button);
        });
        hint.hidden=true;hint.textContent='';feedback.hidden=true;feedback.replaceChildren();
        check.hidden=false;check.disabled=true;next.hidden=true;hintButton.hidden=false;
        next.textContent=index===questions().length-1?'Ver resultados →':'Siguiente reto →';
        wrap.hidden=false;finish.hidden=true;
      }
      hintButton.addEventListener('click',()=>{
        if(evaluated)return;
        hint.textContent='Pista: '+questions()[index].hint;
        hint.hidden=false;hintButton.hidden=true;
      });
      check.addEventListener('click',()=>{
        if(evaluated||selected<0)return;
        evaluated=true;
        const q=questions()[index];const correct=selected===q.correct;
        if(correct)score++;
        [...options.children].forEach((button,i)=>{
          button.disabled=true;
          if(i===q.correct)button.classList.add('m1-correct');
          if(i===selected&&!correct)button.classList.add('m1-incorrect');
        });
        feedback.className='m1-feedback'+(correct?'':' error');
        feedback.replaceChildren();
        const title=document.createElement('strong');title.textContent=correct?'✓ ¡Respuesta correcta!':'✦ Vamos a revisar la respuesta';
        const explain=document.createElement('p');explain.textContent=q.why;
        feedback.append(title,explain);feedback.hidden=false;
        points.textContent=score+' acierto'+(score===1?'':'s');
        check.hidden=true;next.hidden=false;hintButton.hidden=true;hint.hidden=true;
        next.focus();
      });
      next.addEventListener('click',()=>{
        index++;
        if(index>=questions().length){
          wrap.hidden=true;finish.hidden=false;
          count.textContent='¡Has completado los '+questions().length+' retos!';
          points.textContent=score+' de '+questions().length+' aciertos';
          fill.style.width='100%';progress.setAttribute('aria-valuenow',String(questions().length));
          el('m1-final-score').textContent=score+' / '+questions().length;
          el('m1-final-message').textContent=score===questions().length
            ?'¡Excelente! Comprendiste todas las situaciones de este juego.'
            :score>=questions().length*.7
              ?'¡Muy bien! Consulta los ejemplos que te costaron y vuelve a intentarlo.'
              :'Lo importante es comprender. Revisa el diccionario, observa las pistas y prueba otra vez.';
          el('m1-restart').focus();
        }else{showQuestion();qtext.focus();}
      });
      modeButtons.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
      el('m1-restart').addEventListener('click',()=>{setMode(mode);el('m1-game').scrollIntoView({behavior:'smooth',block:'start'});});
      el('m1-switch-after').addEventListener('click',()=>{setMode(mode==='forward'?'reverse':'forward');el('m1-juego-inicio').scrollIntoView({behavior:'smooth',block:'start'});});
      setMode('forward');
    })();
