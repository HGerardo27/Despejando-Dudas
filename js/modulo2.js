/* V6 — Ecuaciones lineales: balanza, práctica y evaluación; funciona sin conexión. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const approx = (a,b) => Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b));
  const nfmt = n => {
    let v=Math.round((Math.abs(n)<1e-9?0:n)*10000)/10000;
    return String(v).replace(/\.0+$/,'');
  };
  const mfmt = (a,b) => {
    a=approx(a,0)?0:a;b=approx(b,0)?0:b;
    if(!a) return nfmt(b);
    const x=approx(a,1)?'x':approx(a,-1)?'−x':nfmt(a)+'x';
    return x+(b>0?' + '+nfmt(b):b<0?' − '+nfmt(-b):'');
  };
  const linear = (a,b) => ({a,b});

  /* Analizador propio y seguro: sin eval, Function ni código ejecutado del estudiante. */
  function parseLinear(src) {
    const s=String(src||'').trim().toLowerCase().replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/,/g,'.').replace(/\s+/g,'');
    if(!s||s.length>95||!/^[\dx.+*\/()\-]+$/.test(s)) throw Error('Usa x, números, +, −, *, / y paréntesis.');
    const raw=[];
    for(let i=0;i<s.length;){
      const n=s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if(n){raw.push({k:'num',v:Number(n[0])});i+=n[0].length;}
      else if(s[i]==='x'){raw.push({k:'var'});i++;}
      else if('+-*/()'.includes(s[i])){raw.push({k:s[i]});i++;}
      else throw Error('Hay un símbolo desconocido.');
    }
    const ts=[];
    raw.forEach((r,i)=>{
      const last=raw[i-1];
      if(last && ['num','var',')'].includes(last.k) && ['var','('].includes(r.k))ts.push({k:'*'});
      ts.push(r);
    });
    let pos=0;
    const is=k=>ts[pos]?.k===k;
    function prim(){
      if(is('num')){const value=ts[pos++].v;return ()=>value;}
      if(is('var')){pos++;return x=>x;}
      if(is('(')){pos++;const f=add();if(!is(')'))throw Error('Falta cerrar un paréntesis.');pos++;return f;}
      throw Error('Revisa números y paréntesis.');
    }
    function unary(){
      if(is('+')){pos++;return unary();}
      if(is('-')){pos++;const f=unary();return x=>-f(x);}
      return prim();
    }
    function mul(){let f=unary();while(is('*')||is('/')){const k=ts[pos++].k,l=f,r=unary();f=x=>k==='*'?l(x)*r(x):l(x)/r(x);}return f;}
    function add(){let f=mul();while(is('+')||is('-')){const k=ts[pos++].k,l=f,r=mul();f=x=>k==='+'?l(x)+r(x):l(x)-r(x);}return f;}
    const fn=add();if(pos!==ts.length)throw Error('Revisa cómo escribiste la expresión.');
    // No permitir ecuaciones no lineales o valores indefinidos.
    const samples=[-3,-1,0,1,2,6].map(fn);
    if(samples.some(x=>!Number.isFinite(x)))throw Error('No se puede dividir entre cero.');
    const a=fn(1)-fn(0),b=fn(0);
    if(samples.some((v,i)=>!approx(v,a*[-3,-1,0,1,2,6][i]+b)))throw Error('Este ejercicio pide una expresión lineal.');
    return linear(a,b);
  }
  function parseEquation(raw){
    const parts=String(raw||'').split('=');
    if(parts.length!==2)throw Error('Escribe una ecuación con un solo signo =.');
    return [parseLinear(parts[0]),parseLinear(parts[1])];
  }
  function eqModelMatch(given,expected){
    try{
      const [a,b]=parseEquation(given),[c,d]=parseEquation(expected);
      const same=(u,v)=>approx(u.a,v.a)&&approx(u.b,v.b);
      return (same(a,c)&&same(b,d))||(same(a,d)&&same(b,c));
    }catch(e){return false;}
  }
  function solutionMatch(input,expected){
    const s=String(input||'').trim().replace(/,/g,'.').replace(/^x\s*=\s*/i,'');
    if(!s || !/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return false;
    return approx(Number(s),expected);
  }

  /* V7: laboratorio guiado, transformaciones exactas y desafíos con x en ambos lados. */
  const simLevels={
    inicial:[
      {a:1,b:3,c:0,d:8,goal:1,story:'Una cantidad desconocida más 3 es igual a 8. Encuentra esa cantidad.'},
      {a:3,b:0,c:0,d:27,goal:1,story:'Tres cajas iguales pesan 27 unidades. Encuentra el peso de cada caja.'},
      {a:1,b:-8,c:0,d:13,goal:1,story:'A un número se le quitan ocho y quedan trece.'},
      {a:.5,b:0,c:0,d:12,goal:1,story:'La mitad de una cantidad es doce.'},
      {a:5,b:0,c:0,d:45,goal:1,story:'Cinco boletos iguales cuestan cuarenta y cinco pesos.'}
    ],
    intermedio:[
      {a:3,b:6,c:0,d:30,goal:2,story:'Tres entradas del mismo precio más una comisión de 6 pesos cuestan 30.'},
      {a:4,b:-8,c:0,d:36,goal:2,story:'Cuatro veces un número menos ocho es treinta y seis.'},
      {a:.5,b:7,c:0,d:22,goal:2,story:'La mitad de una cantidad más siete da veintidós.'},
      {a:5,b:15,c:0,d:90,goal:2,story:'Cinco artículos y una entrega de 15 pesos cuestan 90 pesos.'},
      {a:2,b:-5,c:0,d:21,goal:2,story:'El doble de un número menos cinco es veintiuno.'}
    ],
    experto:[
      {a:3,b:12,c:2,d:42,goal:2,story:'Plan A: 12 pesos fijos más 3 por película. Plan B: 42 fijos más 2 por película. ¿Cuándo cuestan lo mismo?'},
      {a:4,b:-20,c:2,d:30,goal:3,story:'Tienda A cobra 4 pesos por cuaderno y descuenta 20. Tienda B cobra 2 por cuaderno y agrega 30 de envío.'},
      {a:5,b:8,c:2,d:68,goal:3,story:'Plan A: 8 pesos fijos y 5 por GB. Plan B: 68 fijos y 2 por GB. ¿Para cuántos GB se igualan?'},
      {a:2,b:15,c:3,d:5,goal:2,story:'Taxi A: 15 pesos iniciales más 2 por kilómetro; taxi B: 5 iniciales más 3 por kilómetro.'},
      {a:6,b:8,c:2,d:68,goal:3,story:'Salón A cobra 6 pesos por persona más 8 de servicio. Salón B cobra 2 por persona más 68 de decoración.'},
      {a:4,b:10,c:2,d:58,goal:3,story:'Dos talleres cobran, respectivamente, 4x + 10 y 2(x + 29). ¿Para cuántas piezas cobran lo mismo?'}
    ]
  };
  let simLevel='inicial',simIndex=0,L=null,R=null,log=[],undo=[],cleared={inicial:new Set(),intermedio:new Set(),experto:new Set()};
  const currentSim=()=>simLevels[simLevel][simIndex];
  function solved(){return (approx(L.a,1)&&approx(L.b,0)&&approx(R.a,0))||(approx(R.a,1)&&approx(R.b,0)&&approx(L.a,0));}
  function tiles(container,a,b){
    container.replaceChildren();
    const add=(t,k)=>{const n=document.createElement('span');n.className='m2-tile'+(k?' '+k:'');n.textContent=t;container.append(n);};
    if(!approx(a,0))add(approx(a,1)?'x':approx(a,-1)?'−x':nfmt(a)+'x','m2-tile-x');
    if(!approx(b,0)||approx(a,0))add((a&&!approx(a,0)&&b>0?'+':'')+nfmt(b),b<0?'m2-tile-negative':'');
  }
  function transform(f,op,v){
    if(op==='+')return linear(f.a,f.b+v);
    if(op==='-')return linear(f.a,f.b-v);
    if(op==='+x')return linear(f.a+v,f.b);
    if(op==='-x')return linear(f.a-v,f.b);
    if(op==='*')return linear(f.a*v,f.b*v);
    return linear(f.a/v,f.b/v);
  }
  function simInput(){const raw=$('m2-amount').value.trim();return {raw,v:Number(raw),op:$('m2-op').value};}
  function simPreview(){
    if(!L||!R)return;
    const {raw,v,op}=simInput();const el=$('m2-sim-preview');
    if(!op || !raw){el.textContent='Primero elige una operación y escribe una cantidad. La respuesta no se mostrará por adelantado.';return;}
    if(!Number.isFinite(v)||Math.abs(v)>10000||((op==='/'||op==='*')&&approx(v,0))){el.textContent='Introduce una cantidad válida. No puedes dividir ni multiplicar por cero.';return;}
    const action={'+':'sumar','-':'restar','+x':'sumar','-x':'restar','*':'multiplicar por','/':'dividir entre'}[op];
    el.textContent='Vas a '+action+' '+nfmt(v)+(op.endsWith('x')?'x':'')+' en ambos miembros. Pulsa «Aplicar» para observar el resultado de tu decisión.';
  }
  function renderSim(message){
    const c=currentSim(),win=solved(),moves=log.length-1;
    $('m2-sim-level').textContent='Reto '+(simIndex+1)+' de '+simLevels[simLevel].length+' · '+({inicial:'Nivel inicial',intermedio:'Nivel intermedio',experto:'Nivel experto'}[simLevel]);
    $('m2-sim-context').textContent=c.story;
    $('m2-sim-equation').textContent=mfmt(L.a,L.b)+' = '+mfmt(R.a,R.b);
    tiles($('m2-sim-left'),L.a,L.b);tiles($('m2-sim-right'),R.a,R.b);
    $('m2-sim-status').textContent=win?'✓ x despejada':'⚖ Igualdad conservada';
    $('m2-sim-moves').textContent='Movimientos: '+moves;
    $('m2-sim-target').textContent='Meta sugerida: '+c.goal+' movimientos';
    $('m2-sim-cleared').textContent='Completados: '+cleared[simLevel].size+' / '+simLevels[simLevel].length;
    if(win){cleared[simLevel].add(simIndex);$('m2-sim-cleared').textContent='Completados: '+cleared[simLevel].size+' / '+simLevels[simLevel].length;}
    $('m2-sim-feedback').textContent=message||(win?'¡Despejaste x!':'Selecciona una operación. La vista previa te mostrará cómo quedaría la ecuación.');
    const list=$('m2-sim-history');list.replaceChildren();log.forEach(s=>{const li=document.createElement('li');li.textContent=s;list.append(li);});
    $('m2-apply').disabled=win;$('m2-op').disabled=win;$('m2-amount').disabled=win;
    $('m2-undo').disabled=undo.length===0;
    document.querySelectorAll('[data-m2-sim-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m2SimLevel===simLevel)));
    if(win){const x=approx(L.a,1)?R.b:L.b;
      $('m2-sim-feedback').textContent='¡Bien! x = '+nfmt(x)+'. Lo lograste en '+moves+' movimiento(s). '+(moves<=c.goal?'¡Alcanzaste la meta sugerida!':'¿Puedes encontrar un camino más corto? Prueba reiniciando.');
    }
    simPreview();
  }
  function resetSim(){const c=currentSim();L=linear(c.a,c.b);R=linear(c.c,c.d);log=['Inicio: '+mfmt(L.a,L.b)+' = '+mfmt(R.a,R.b)+'.'];undo=[];
    $('m2-op').disabled=false;$('m2-amount').disabled=false;
    $('m2-op').value='';
    $('m2-amount').value='';
    renderSim('Desafío: encuentra x conservando la igualdad. La meta de movimientos es orientativa.');
  }
  $('m2-apply').addEventListener('click',()=>{
    const {raw,v,op}=simInput();
    if(!op){renderSim('Primero selecciona una operación para ambos miembros.');return;}
    if(!raw||!Number.isFinite(v)||Math.abs(v)>10000){renderSim('Introduce una cantidad válida entre −10 000 y 10 000.');return;}
    if((op==='/'||op==='*')&&approx(v,0)){renderSim('No dividas ni multipliques por cero: se perdería información sobre x.');return;}
    if(approx(v,0)){renderSim('Esa operación no cambia la ecuación. Prueba con un valor distinto de cero.');return;}
    const nL=transform(L,op,v),nR=transform(R,op,v);
    if([nL.a,nL.b,nR.a,nR.b].some(z=>!Number.isFinite(z)||Math.abs(z)>1e7)){renderSim('Las cantidades resultantes son demasiado grandes. Prueba otra operación.');return;}
    // Evitar igualdad sin x por cancelación accidental de la incógnita.
    if(approx(nL.a-nR.a,0)){renderSim('Esa operación eliminaría la incógnita de ambos miembros. Elige otra que conserve una ecuación resoluble.');return;}
    undo.push({L:{...L},R:{...R},log:log.slice()});L=nL;R=nR;
    const word={'+':'Sumar','-':'Restar','+x':'Sumar','-x':'Restar','*':'Multiplicar por','/':'Dividir entre'}[op];
    const suffix=op.endsWith('x')?'x':'';
    log.push(word+' '+nfmt(v)+suffix+' en ambos lados → '+mfmt(L.a,L.b)+' = '+mfmt(R.a,R.b)+'.');
    renderSim(solved()?'¡Conseguiste aislar la incógnita!':'La ecuación sigue siendo equivalente. Elige el siguiente movimiento.');
  });
  $('m2-hint').addEventListener('click',()=>{
    let hint='';
    if(!approx(L.a,0)&&!approx(R.a,0)){hint='Hay x en ambos miembros. Prueba restar '+nfmt(R.a)+'x de ambos lados (o restar '+nfmt(L.a)+'x para despejar por la derecha).';}
    else {const side=!approx(L.a,0)?L:R;
      if(!approx(side.b,0))hint='Elimina el término constante: '+(side.b>0?'resta ':'suma ')+nfmt(Math.abs(side.b))+' en ambos lados.';
      else if(!approx(Math.abs(side.a),1))hint='Ahora divide ambos miembros entre '+nfmt(side.a)+' para que quede x.';
      else if(approx(side.a,-1))hint='Multiplica ambos miembros por −1 para obtener x.';
      else hint='Revisa en qué miembro aparece la incógnita y si ya está aislada.';
    }
    renderSim('💡 '+hint);
  });
  $('m2-undo').addEventListener('click',()=>{const last=undo.pop();if(!last)return;L=last.L;R=last.R;log=last.log;renderSim('Has deshecho el último movimiento. Puedes probar otra estrategia.');});
  $('m2-reset').addEventListener('click',resetSim);
  $('m2-next').addEventListener('click',()=>{simIndex=(simIndex+1)%simLevels[simLevel].length;resetSim();});
  document.querySelectorAll('[data-m2-sim-level]').forEach(b=>b.addEventListener('click',()=>{simLevel=b.dataset.m2SimLevel;simIndex=0;resetSim();}));
  ['m2-op','m2-amount'].forEach(id=>$(id).addEventListener(id==='m2-op'?'change':'input',simPreview));
  resetSim();

  const errors=[
    {q:'De 3x + 6 = 18 alguien escribió 3x = 18. ¿Es correcto?',valid:false,why:'No. Debe restar 6 en ambos lados: 3x = 12 y x = 4.'},
    {q:'De 4x = 28 alguien dividió ambos miembros entre 4 y obtuvo x = 7. ¿Es válido?',valid:true,why:'Sí. Dividir ambos miembros entre 4 conserva la igualdad y da x = 7.'},
    {q:'De 5x + 8 = 2x + 32 alguien restó 2x en ambos miembros y obtuvo 3x + 8 = 32. ¿Es válido?',valid:true,why:'Sí. Se resta el mismo término 2x en ambos lados y la igualdad se conserva.'},
    {q:'De 2x + 10 = 40 alguien dividió solo 2x entre 2 y obtuvo x + 10 = 40. ¿Es válido?',valid:false,why:'No. Si divides todo entre 2 obtienes x + 5 = 20. También puedes restar 10 primero: 2x = 30.'},
    {q:'De 2x = 10 alguien multiplicó ambos miembros por cero y obtuvo 0 = 0, afirmando que x = 5. ¿Es válida esa justificación?',valid:false,why:'No. Multiplicar por cero pierde información: 0 = 0 es verdadera para cualquier x y no permite despejar.'}
  ];
  let errIndex=0;
  function renderError(){const e=errors[errIndex];$('m2-error-question').textContent='Caso '+(errIndex+1)+'/'+errors.length+': '+e.q;$('m2-error-feedback').textContent='Decide si la operación conserva correctamente la igualdad.';}
  function chooseError(choice){const e=errors[errIndex];$('m2-error-feedback').textContent=(choice===e.valid?'✓ ¡Correcto! ':'✕ Revisa el razonamiento. ')+e.why;}
  $('m2-error-yes').addEventListener('click',()=>chooseError(true));
  $('m2-error-no').addEventListener('click',()=>chooseError(false));
  $('m2-error-next').addEventListener('click',()=>{errIndex=(errIndex+1)%errors.length;renderError();});
  renderError();

  /* V7: práctica de modelación completa, no simple traducción. */
  const practice={
    basico:[
      {q:'Compras tres boletos del mismo precio y pagas $75 en total. ¿Cuánto cuesta cada boleto?',eq:'3x=75',x:25,meaning:'Precio de un boleto (pesos)',wrong:['Número de boletos','Dinero que pagaste en total'],hint:'Tres veces el precio unitario da 75.',why:'3x = 75 → x = 75/3 = 25 pesos por boleto.',tag:'COMPRA DE BOLETOS'},
      {q:'Un taxi cobra $25 de tarifa inicial y $12 por kilómetro. Un viaje costó $121. ¿Cuántos kilómetros recorriste?',eq:'25+12x=121',x:8,meaning:'Kilómetros recorridos',wrong:['Costo por kilómetro','Precio fijo del taxi'],hint:'Costo fijo + costo por kilómetro × distancia = 121.',why:'25 + 12x = 121 → 12x = 96 → x = 8 kilómetros.',tag:'TRANSPORTE'},
      {q:'Cuatro botellas iguales cuestan $96. ¿Cuánto cuesta cada botella?',eq:'4x=96',x:24,meaning:'Precio de una botella (pesos)',wrong:['Total de botellas','Costo de las cuatro botellas'],hint:'Multiplica el precio de cada botella por cuatro.',why:'4x = 96 → x = 24 pesos.',tag:'COMPRAS'},
      {q:'Tienes algunas cuentas para hacer una pulsera. Compras seis más y ahora tienes 19. ¿Cuántas tenías al principio?',eq:'x+6=19',x:13,meaning:'Cuentas iniciales',wrong:['Cuentas compradas','Total de cuentas al final'],hint:'Cantidad inicial + seis = 19.',why:'x + 6 = 19 → x = 13 cuentas.',tag:'MANUALIDADES'},
      {q:'Ahorras la misma cantidad cada día durante cinco días. Al final reúnes $85. ¿Cuánto ahorraste cada día?',eq:'5x=85',x:17,meaning:'Ahorro por día (pesos)',wrong:['Número de días','Ahorro total (pesos)'],hint:'Cinco días por el ahorro diario son 85.',why:'5x = 85 → x = 17 pesos por día.',tag:'AHORRO'},
      {q:'Una sala cobra $30 de inscripción más una cuota individual. Pagas $95 en total. ¿Cuánto es la cuota individual?',eq:'30+x=95',x:65,meaning:'Cuota individual (pesos)',wrong:['Inscripción inicial','Pago total'],hint:'La inscripción es un cargo fijo, no x.',why:'30 + x = 95 → x = 65 pesos.',tag:'SERVICIOS'},
      {q:'El doble de las canicas que tienes, menos nueve, equivale a 29. ¿Cuántas canicas tienes?',eq:'2x-9=29',x:19,meaning:'Número actual de canicas',wrong:['Canicas que se quitaron','Doble de las canicas'],hint:'El doble de x, menos 9, es igual a 29.',why:'2x − 9 = 29 → 2x = 38 → x = 19 canicas.',tag:'COLECCIÓN'}
    ],
    intermedio:[
      {q:'Tres entradas iguales y $25 de servicio cuestan $145. ¿Cuál es el precio de una entrada?',eq:'3x+25=145',x:40,meaning:'Precio de cada entrada (pesos)',wrong:['Servicio de compra','Cantidad de entradas'],hint:'El servicio se paga una sola vez.',why:'3x + 25 = 145 → 3x = 120 → x = 40 pesos.',tag:'EVENTOS'},
      {q:'Una promoción permite pagar la mitad del precio de un curso más $17 de inscripción. En total pagas $47. ¿Cuál era el precio completo del curso?',eq:'x/2+17=47',x:60,meaning:'Precio original del curso (pesos)',wrong:['Costo de inscripción','Pago final de la promoción'],hint:'El descuento significa x/2, no 2x.',why:'x/2 + 17 = 47 → x/2 = 30 → x = 60 pesos.',tag:'CURSOS'},
      {q:'Cuatro paquetes idénticos contienen x dulces y 3 caramelos extra cada uno. En total hay 92 piezas. ¿Cuántos dulces x contiene cada paquete?',eq:'4(x+3)=92',x:20,meaning:'Dulces sin extras en cada paquete',wrong:['Número de paquetes','Total de piezas'],hint:'Cada paquete contiene x+3, y hay cuatro paquetes.',why:'4(x + 3) = 92 → x + 3 = 23 → x = 20 dulces.',tag:'PAQUETES'},
      {q:'Cinco accesorios del mismo precio reciben un descuento total de $30 y pagas $175. ¿Cuál era el precio de cada accesorio?',eq:'5x-30=175',x:41,meaning:'Precio original de un accesorio (pesos)',wrong:['Descuento total','Número de accesorios'],hint:'El descuento aplica una sola vez al total.',why:'5x − 30 = 175 → 5x = 205 → x = 41 pesos.',tag:'DESCUENTOS'},
      {q:'Tres amigos aportan cada uno x pesos, pero cada uno gasta $7 antes de juntar el dinero. Si reúnen $66, ¿cuánto tenía originalmente cada uno?',eq:'3(x-7)=66',x:29,meaning:'Dinero original de cada amigo (pesos)',wrong:['Gasto de cada amigo','Dinero reunido al final'],hint:'Cada persona aporta x−7; son tres personas.',why:'3(x − 7) = 66 → x − 7 = 22 → x = 29 pesos.',tag:'AMIGOS'},
      {q:'Dos juegos del mismo precio y una recarga adicional de $18 cuestan $104. ¿Cuánto cuesta un juego?',eq:'2x+18=104',x:43,meaning:'Precio de un juego (pesos)',wrong:['Costo de la recarga','Número de juegos'],hint:'La recarga se suma solo una vez.',why:'2x + 18 = 104 → 2x = 86 → x = 43 pesos.',tag:'VIDEOJUEGOS'},
      {q:'La cuarta parte de la cantidad de puntos que tenías, más 5 puntos extra, da 21. ¿Cuántos puntos tenías al inicio?',eq:'x/4+5=21',x:64,meaning:'Puntos iniciales',wrong:['Puntos extra','Puntos después de la operación'],hint:'La cuarta parte es x/4.',why:'x/4 + 5 = 21 → x/4 = 16 → x = 64 puntos.',tag:'PUNTAJE'}
    ],
    reto:[
      {q:'Dos plataformas cobran distinto: A pide $12 fijos más $3 por película; B cobra $42 fijos más $2 por película. ¿Para cuántas películas cobran lo mismo?',eq:'3x+12=2x+42',x:30,meaning:'Número de películas',wrong:['Precio de una película','Cargo fijo del plan A'],hint:'Iguala el costo del plan A con el costo del plan B.',why:'3x+12 = 2x+42 → x+12 = 42 → x=30 películas. Ambos planes cuestan $102.',tag:'COMPARACIÓN DE PLANES'},
      {q:'Para comprar cuadernos, A cobra $4 por cuaderno y descuenta $20 del total; B cobra $2 por cuaderno más $30 de envío. ¿Para cuántos cuadernos pagas lo mismo?',eq:'4x-20=2x+30',x:25,meaning:'Número de cuadernos',wrong:['Precio de un cuaderno','Costo del envío'],hint:'Costo A = 4x−20; costo B = 2x+30.',why:'4x−20=2x+30 → 2x=50 → x=25 cuadernos. Ambos cuestan $80.',tag:'COMPARACIÓN DE TIENDAS'},
      {q:'Plan A de datos: $8 fijos más $5 por GB. Plan B: $68 fijos más $2 por GB. ¿Para cuántos GB cuestan lo mismo?',eq:'5x+8=2x+68',x:20,meaning:'Gigabytes utilizados',wrong:['Cuota fija del plan B','Precio por GB del plan A'],hint:'La igualdad debe comparar ambos costos totales.',why:'5x+8=2x+68 → 3x=60 → x=20 GB. Ambos cuestan $108.',tag:'INTERNET'},
      {q:'Taxi A cobra $15 iniciales y $2 por km; taxi B, $5 iniciales y $3 por km. ¿A qué distancia se igualan los costos?',eq:'2x+15=3x+5',x:10,meaning:'Kilómetros recorridos',wrong:['Tarifa inicial de A','Costo por kilómetro de B'],hint:'Costo A = 2x+15 y costo B = 3x+5.',why:'2x+15=3x+5 → 10=x → x=10 km. Ambos cobran $35.',tag:'TAXIS'},
      {q:'Un salón A cobra $6 por invitado más $8 de servicio; el salón B cobra $2 por invitado más $68 de decoración. ¿Para cuántos invitados se igualan?',eq:'6x+8=2x+68',x:15,meaning:'Número de invitados',wrong:['Costo de decoración','Precio del servicio'],hint:'Ambos costos dependen del mismo número de invitados.',why:'6x+8=2x+68 → 4x=60 → x=15 invitados. Ambos cuestan $98.',tag:'EVENTOS'},
      {q:'Taller A cobra $4 por pieza más $10 de preparación; taller B cobra $2 por pieza más $58 de preparación. ¿Para cuántas piezas cobran lo mismo?',eq:'4x+10=2x+58',x:24,meaning:'Número de piezas',wrong:['Cuota de preparación','Precio por pieza de B'],hint:'Escribe una ecuación con el costo de cada taller a un lado.',why:'4x+10=2x+58 → 2x=48 → x=24 piezas. Ambos cuestan $106.',tag:'TALLERES'},
      {q:'Sofía ya tiene $50 y ahorra $4 por semana. Mario empieza con $14 y ahorra $6 por semana. ¿Después de cuántas semanas tendrán la misma cantidad?',eq:'50+4x=14+6x',x:18,meaning:'Semanas transcurridas',wrong:['Ahorro semanal de Sofía','Dinero inicial de Mario'],hint:'El dinero de Sofía y el de Mario deben ser iguales.',why:'50+4x=14+6x → 36=2x → x=18 semanas. Ambos tendrán $122.',tag:'AHORRO'}
    ]
  };
  let level='basico',pindex=0,attempts=0;
  const currentPractice=()=>practice[level][pindex];
  function practiceRender(){
    const p=currentPractice();attempts=0;
    $('m2-practice-question').textContent=p.q;
    $('m2-practice-tag').textContent=p.tag;
    $('m2-practice-count').textContent='Caso '+(pindex+1)+' de '+practice[level].length;
    const pick=$('m2-practice-meaning');pick.replaceChildren();
    const prompt=document.createElement('option');prompt.value='';prompt.textContent='Selecciona una opción...';pick.append(prompt);
    const opts=[p.meaning,...p.wrong];
    // Alterar el orden de forma determinista por caso, sin depender de conexión.
    if(pindex%2===0)opts.push(opts.shift());
    if(pindex%3===0)opts.reverse();
    opts.forEach(label=>{const o=document.createElement('option');o.value=label;o.textContent=label;pick.append(o);});
    ['m2-practice-eq','m2-practice-x','m2-practice-verify'].forEach(id=>$(id).value='');
    const box=$('m2-practice-feedback');box.hidden=true;box.replaceChildren();
    $('m2-practice-solution').disabled=true;
    $('m2-practice-solution').textContent='Ver solución razonada (2 intentos)';
    document.querySelectorAll('[data-m2-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m2Level===level)));
  }
  function practiceFeedback(title,steps,good){
    const root=$('m2-practice-feedback');root.replaceChildren();root.hidden=false;root.className='m2-feedback-box '+(good?'good':'try');
    const titleEl=document.createElement('strong');titleEl.textContent=title;root.append(titleEl);
    const ul=document.createElement('ul');ul.className='m2-feedback-steps';
    steps.forEach(([t,ok])=>{const li=document.createElement('li');li.className=ok?'ok':'bad';li.textContent=(ok?'✓ ':'• ')+t;ul.append(li);});root.append(ul);
  }
  $('m2-practice-check').addEventListener('click',()=>{
    const p=currentPractice(),eq=$('m2-practice-eq').value,x=$('m2-practice-x').value,verify=$('m2-practice-verify').value;
    const meaningOK=$('m2-practice-meaning').value===p.meaning,eqOK=eqModelMatch(eq,p.eq),xOK=solutionMatch(x,p.x);
    let verifyValue=NaN;
    try{verifyValue=parseLinear(verify).b;}catch(e){}
    const [a]=parseEquation(p.eq),expectedCheck=a.a*p.x+a.b;
    // La comprobación debe ser numérica, no una expresión con x.
    const verifyOK=/^\s*-?(?:\d+(?:[.,]\d*)?|[.,]\d+)\s*$/.test(verify)&&approx(Number(verify.replace(',','.')),expectedCheck);
    attempts++;
    if(attempts>=2){$('m2-practice-solution').disabled=false;$('m2-practice-solution').textContent='Ver solución razonada';}
    const steps=[
      [meaningOK?'Identificaste correctamente qué representa x.':'Revisa el significado de x según lo que pregunta la historia.',meaningOK],
      [eqOK?'Tu ecuación modela la situación.':'La ecuación debe comparar exactamente las cantidades del enunciado, antes de resolver.',eqOK],
      [xOK?'El valor de x es correcto.':'El despeje aún no es correcto. Sustituye el valor obtenido en la igualdad.',xOK],
      [verifyOK?'La comprobación numérica coincide en ambos miembros.':'Calcula cuánto vale cada miembro de la ecuación original al sustituir x.',verifyOK]
    ];
    const all=meaningOK&&eqOK&&xOK&&verifyOK;
    if(all)steps.push([p.why,true]);
    practiceFeedback(all?'¡Excelente! Modelaste, resolviste y verificaste.':'Revisa tu procedimiento: '+[meaningOK,eqOK,xOK,verifyOK].filter(Boolean).length+'/4 pasos correctos.',steps,all);
  });
  $('m2-practice-hint').addEventListener('click',()=>{const p=currentPractice();practiceFeedback('💡 Pista para construir el modelo',[[p.hint,true],['Primero interpreta qué representa x; luego escribe la igualdad de los datos.',true]],false);});
  $('m2-practice-solution').addEventListener('click',()=>{if(attempts<2)return;const p=currentPractice();const left=parseEquation(p.eq)[0];practiceFeedback('Resolución razonada',[[p.why,true],['Ecuación: '+p.eq+'. Valor: x = '+nfmt(p.x)+'.',true],['Comprobación: ambos miembros valen '+nfmt(left.a*p.x+left.b)+'.',true],['En este caso, x representa: '+p.meaning+'.',true]],true);});
  $('m2-practice-next').addEventListener('click', () => {
    pindex = (pindex + 1) % practice[level].length;
    practiceRender();
    $('m2-practice-question').focus();
  });
  document.querySelectorAll('[data-m2-level]').forEach(b=>b.addEventListener('click',()=>{level=b.dataset.m2Level;pindex=0;practiceRender();}));
  practiceRender();

  /* 3. Evaluación individual de 10 preguntas: sin calificación hasta entregar. */
  const exam=[
    {type:'mc',q:'¿Qué significa el signo = en una ecuación?',options:['Que debemos sumar ambos lados.','Que ambos miembros tienen el mismo valor.','Que x siempre es cero.','Que debemos cambiar de signo.'],right:1,why:'El signo igual expresa que ambos miembros tienen el mismo valor.'},
    {type:'mc',q:'En 4x + 6 = 26, ¿qué operación en ambos lados elimina el +6 y deja 4x en el primer miembro?',options:['Sumar 6.','Dividir entre 4 primero.','Restar 6.','Multiplicar por 6.'],right:2,why:'Restar 6 mantiene la igualdad y deja 4x = 20.'},
    {type:'mc',q:'¿Cuál de estas opciones comprueba que x = 5 es solución de x + 7 = 12?',options:['5 − 7 = 12','5 + 7 = 12','12 + 7 = 5','5 + 12 = 7'],right:1,why:'Al sustituir x por 5 se obtiene 5 + 7 = 12, una igualdad verdadera.'},
    {type:'solve',q:'Resuelve: x + 9 = 17. ¿Cuánto vale x?',x:8,why:'Restamos 9 a ambos lados: x = 8.'},
    {type:'solve',q:'Resuelve: 3x = 27. ¿Cuánto vale x?',x:9,why:'Dividimos ambos lados entre 3: x = 9.'},
    {type:'solve',q:'Resuelve: 4x + 6 = 2x + 22. ¿Cuánto vale x?',x:8,why:'Restamos 2x: 2x + 6 = 22. Restamos 6: 2x = 16. Dividimos entre 2: x = 8.'},
    {type:'model',q:'Tres cuadernos del mismo precio y un envío de $12 cuestan $72. ¿Cuánto cuesta cada cuaderno?',eq:'3x+12=72',x:20,why:'3x + 12 = 72; al restar 12, 3x = 60 y x = 20 pesos.'},
    {type:'model',q:'El doble de una edad más cinco años es 31. ¿Cuál es esa edad?',eq:'2x+5=31',x:13,why:'2x + 5 = 31; 2x = 26, x = 13 años.'},
    {type:'model',q:'Plan A cobra $12 de cuota fija y $3 por película. Plan B cobra $42 de cuota fija y $2 por película. ¿Con cuántas películas cuestan lo mismo?',eq:'3x+12=2x+42',x:30,why:'3x + 12 = 2x + 42; al restar 2x y 12 resulta x = 30 películas. Ambos planes cuestan $102.'},
    {type:'model',q:'Juan tiene cierta cantidad de canicas. Le regalan siete y ahora tiene diecinueve. ¿Cuántas tenía al principio?',eq:'x+7=19',x:12,why:'x + 7 = 19; si restamos siete, x = 12 canicas.'}
  ];
  const storageKey='despejando-dudas-m2-evaluacion-v1';
  const draft = readExamRecord().draft;
  const validDraft = Array.isArray(draft?.answers) && draft.answers.length === exam.length;
  let cursor = validDraft && Number.isInteger(draft.position) && draft.position >= 0 &&
    draft.position < exam.length ? draft.position : 0;
  let answers = exam.map((q, index) => {
    const item = validDraft ? draft.answers[index] : null;
    if (q.type === 'mc') {
      const choice = item?.choice;
      return Number.isInteger(choice) && choice >= 0 && choice < q.options.length ? {choice} : {};
    }
    const answer = {};
    if (typeof item?.x === 'string') answer.x = item.x;
    if (q.type === 'model' && typeof item?.eq === 'string') answer.eq = item.eq;
    return answer;
  });
  const eString = item => item.type==='model'?item.eq+'; x = '+nfmt(item.x):item.type==='solve'?'x = '+nfmt(item.x):item.options[item.right];
  const responseGiven=(i)=>{
    const q=exam[i],a=answers[i];
    return q.type==='mc'?a.choice!==undefined:q.type==='solve'?Boolean((a.x||'').trim()):Boolean((a.eq||'').trim())&&Boolean((a.x||'').trim());
  };
  function updateAnswerCount() {
    const count = answers.filter((answer, index) => responseGiven(index)).length;
    $('m2-test-answered').textContent = count + ' de ' + exam.length + ' respondidas';
    $('m2-test-progress').setAttribute('aria-valuenow', String(count));
    $('m2-test-fill').style.width = (100 * count / exam.length) + '%';
  }
  function renderExam(){
    const q=exam[cursor],ans=answers[cursor];
    $('m2-test-counter').textContent='Pregunta '+(cursor+1)+' de '+exam.length;
    updateAnswerCount();
    $('m2-test-question').textContent=q.q;
    const pane=$('m2-test-inputs');pane.replaceChildren();
    if(q.type==='mc'){
      const grid=document.createElement('div');grid.className='m1-exam-choices';
      q.options.forEach((opt,j)=>{
        const b=document.createElement('button');b.type='button';b.className='m1-option';b.textContent=String.fromCharCode(65+j)+'. '+opt;
        b.setAttribute('aria-pressed',String(ans.choice===j));
        b.addEventListener('click', () => {
          ans.choice = j;
          [...grid.children].forEach((button, index) => button.setAttribute('aria-pressed', String(index === j)));
          updateAnswerCount();
          saveDraft();
        });
        grid.append(b);
      });pane.append(grid);
    }else{
      if(q.type==='model')makeInput('1. Escribe la ecuación que representa la historia','eq','Ej.: 3x + 12 = 72');
      makeInput(q.type==='model'?'2. ¿Cuál es el valor de x?':'Escribe el valor de x','x','Ej.: 8');
    }
    function makeInput(label,key,placeholder){
      const field=document.createElement('div');
      const id='m2-exam-'+key;
      const lbl=document.createElement('label');lbl.className='m1-answer-label';lbl.htmlFor=id;lbl.textContent=label;
      const inp=document.createElement('input');inp.className='m1-free-input';inp.type='text';inp.id=id;inp.placeholder=placeholder;inp.autocomplete='off';inp.spellcheck=false;inp.value=ans[key]||'';
      inp.addEventListener('input', () => {
        ans[key] = inp.value;
        updateAnswerCount();
        saveDraft();
      });
      field.append(lbl,inp);pane.append(field);
    }
    $('m2-test-prev').disabled=cursor===0;
    $('m2-test-next').hidden=cursor===exam.length-1;
    $('m2-test-submit').hidden=cursor!==exam.length-1;
  }
  function questionScore(q,a){
    if(q.type==='mc')return a.choice===q.right?1:0;
    if(q.type==='solve')return solutionMatch(a.x,q.x)?1:0;
    return (eqModelMatch(a.eq,q.eq)?.5:0)+(solutionMatch(a.x,q.x)?.5:0);
  }
  function readExamRecord() {
    try {
      const record = JSON.parse(localStorage.getItem(storageKey));
      if (record && typeof record === 'object' && !Array.isArray(record)) return record;
    } catch (error) {}
    return {};
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
    const hasDraft = cursor > 0 || answers.some(answer => answer.choice !== undefined ||
      Boolean((answer.eq || '').trim()) || Boolean((answer.x || '').trim()));
    if (!hadDraft && !hasDraft) return;
    if (hasDraft) record.draft = {position: cursor, answers, updatedAt: Date.now()};
    else delete record.draft;
    if (writeExamRecord(record) && hadDraft !== hasDraft) loadProgress(record);
  }
  function saveGrade(score) {
    const record = readExamRecord();
    delete record.draft;
    record.last = score;
    record.best = Number.isFinite(record.best) ? Math.max(score, record.best) : score;
    record.date = new Date().toISOString();
    return writeExamRecord(record);
  }
  function textNode(tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;}
  function progressRender(score, best, hasDraft){
    const root=$('m2-progress-summary');root.replaceChildren();
    if(score===null){root.append(textNode('strong','Todavía no has realizado la evaluación.'),textNode('p','Cuando la termines verás aquí tu último resultado y tu mejor puntuación.','muted'));}
    else{root.append(textNode('strong','Última evaluación del Módulo 2'),textNode('div',nfmt(score)+' / 10','m1-progress-score'),textNode('p','Mejor resultado: '+nfmt(best)+' / 10. Puedes repetir el cuestionario para seguir mejorando.','muted'));}
    const link = document.createElement('a');
    link.className = 'btn btn-primary';
    link.href = '#m2-evaluacion';
    link.textContent = hasDraft ? 'Continuar evaluación →' :
      score === null ? 'Ir a la evaluación →' : 'Volver a evaluar →';
    root.append(link);
  }
  function loadProgress(record = readExamRecord()) {
    const hasDraft = Boolean(record.draft);
    if (Number.isFinite(record.last) && Number.isFinite(record.best)) {
      progressRender(record.last, record.best, hasDraft);
      return;
    }
    progressRender(null, null, hasDraft);
  }
  function submitExam(){
    const answered=answers.filter((a,i)=>responseGiven(i)).length;
    if(answered<exam.length && !window.confirm('Has respondido '+answered+' de '+exam.length+' preguntas. Las demás valdrán cero. ¿Quieres entregar de todos modos?'))return;
    const total=exam.reduce((score,q,i)=>score+questionScore(q,answers[i]),0);
    const saved=saveGrade(total);loadProgress();
    $('m2-exam-stage').hidden=true;
    const root=$('m2-exam-result');root.replaceChildren();root.hidden=false;root.className='m2-exam-result';
    const resultTitle = textNode('h3', 'Resultado de la evaluación');
    resultTitle.tabIndex = -1;
    root.append(resultTitle, textNode('div', nfmt(total) + ' / 10', 'm2-result-grade'));
    root.append(textNode('p',total>=8?'¡Muy buen avance! Sigue practicando para mantenerlo.':total>=6?'Vas avanzando. Revisa las preguntas y vuelve a intentar.':'Repasa los conceptos y usa la balanza antes de repetir la evaluación.'));
    root.append(textNode('p',saved?'Tu puntuación se guardó en este navegador.':'Tu resultado está disponible aquí, pero no pudo guardarse en este navegador.','m1-note'));
    const reviews=document.createElement('div');reviews.className='m2-exam-reviews';
    exam.forEach((q,i)=>{
      const a=answers[i],score=questionScore(q,a),box=document.createElement('div');box.className='m2-review'+(score===1?' correct':'');
      box.append(textNode('strong','Pregunta '+(i+1)+' · '+nfmt(score)+' / 1 punto'),textNode('p',q.q));
      let user='Sin responder';
      if(q.type==='mc' && a.choice!==undefined)user=q.options[a.choice];
      if(q.type==='solve' && a.x)user='x = '+a.x;
      if(q.type==='model' && (a.eq||a.x))user=(a.eq||'Sin ecuación')+'; x = '+(a.x||'sin solución');
      box.append(textNode('p','Tu respuesta: '+user),textNode('p','Respuesta esperada: '+eString(q)),textNode('p','Explicación: '+q.why));
      reviews.append(box);
    });
    root.append(reviews);
    const repeat=document.createElement('button');repeat.type='button';repeat.className='btn btn-primary';repeat.textContent='Repetir la evaluación ↻';
    repeat.addEventListener('click', () => {
      answers = exam.map(() => ({}));
      root.hidden = true;
      $('m2-exam-stage').hidden = false;
      goToQuestion(0);
    });
    root.append(repeat);
    resultTitle.focus({preventScroll: true});
    $('m2-evaluacion').scrollIntoView({behavior:'smooth'});
  }
  function goToQuestion(position) {
    cursor = position;
    saveDraft();
    renderExam();
    $('m2-test-question').focus();
  }
  $('m2-test-prev').addEventListener('click', () => {
    if (cursor > 0) goToQuestion(cursor - 1);
  });
  $('m2-test-next').addEventListener('click', () => {
    if (cursor < exam.length - 1) goToQuestion(cursor + 1);
  });
  $('m2-test-submit').addEventListener('click',submitExam);
  renderExam();loadProgress();
})();
