/* Aritmética exacta para expresiones polinómicas de las actividades. */
(() => {
  'use strict';

  const constante = 0;
  const gradoMaximo = 16;
  const base = gradoMaximo + 1;
  const uno = [1n, 1n];

  function fraccion(numerador, denominador = 1n) {
    if (!denominador) throw new Error('No se puede dividir entre cero.');
    if (!numerador) return [0n, 1n];
    let a = numerador < 0n ? -numerador : numerador;
    let b = denominador < 0n ? -denominador : denominador;
    while (b) [a, b] = [b, a % b];
    const divisor = denominador < 0n ? -a : a;
    const n = numerador / divisor;
    const d = denominador / divisor;
    if (n.toString().length > 192 || d.toString().length > 192) {
      throw new Error('Prueba con números o fracciones más pequeños.');
    }
    return [n, d];
  }

  function leerDecimal(texto) {
    const partes = String(texto).match(/^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:e([+-]?\d+))?$/i);
    if (!partes) throw new Error('Escribe un número válido.');
    const [, signo, mantisa, exponente = '0'] = partes;
    const [entero, decimales = ''] = mantisa.split('.');
    const escala = decimales.length - Number(exponente);
    if (mantisa.length > 192 || !Number.isInteger(escala) || Math.abs(escala) > 192) {
      throw new Error('Prueba con números más pequeños.');
    }
    const numerador = BigInt((entero || '0') + decimales) * (signo === '-' ? -1n : 1n);
    return escala >= 0 ? fraccion(numerador, 10n ** BigInt(escala)) :
      fraccion(numerador * 10n ** BigInt(-escala));
  }

  function asignar(pol, clave, [n, d]) {
    const [a, b] = pol.get(clave) || [0n, 1n];
    const coeficiente = fraccion(a * d + n * b, b * d);
    if (coeficiente[0]) pol.set(clave, coeficiente);
    else pol.delete(clave);
  }

  function escalar(pol, [n, d]) {
    const resultado = new Map();
    for (const [clave, [a,b]] of pol) asignar(resultado, clave, fraccion(a * n, b * d));
    return resultado;
  }

  function producto(p, q) {
    const resultado = new Map();
    for (const [i, [a,b]] of p) {
      for (const [j, [c,d]] of q) {
        const x = Math.floor(i / base) + Math.floor(j / base);
        const y = i % base + j % base;
        if (x + y > gradoMaximo) throw new Error('Usa una expresión de grado menor o igual a 16.');
        asignar(resultado, x * base + y, fraccion(a * c, b * d));
      }
    }
    return resultado;
  }

  function valorConstante(pol, error) {
    for (const clave of pol.keys()) {
      if (clave !== constante) throw new Error(error);
    }
    return pol.get(constante) || [0n, 1n];
  }

  function separar(texto, limite) {
    const literal = String(texto ?? '').trim().toLowerCase();
    if (/\d\s+[\d.]|\.\s+\d/.test(literal)) {
      throw new Error('Escribe cada número seguido, sin espacios entre sus cifras.');
    }
    const s = literal.replace(/\s+/g, '')
      .replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/,/g, '.');
    if (!s || s.length > limite || !/^[0-9xy.+*\-/()^]+$/.test(s)) {
      throw new Error('Escribe una expresión con x, y, números y operaciones (sin el signo =).');
    }
    const tokens = [];
    const izquierda = new Set(['numero', 'x', 'y', ')']);
    const derecha = new Set(['numero', 'x', 'y', '(']);
    for (let i = 0; i < s.length;) {
      const numero = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      const simbolo = numero ? 'numero' : s[i];
      const anterior = tokens.at(-1)?.simbolo;
      if (numero && (anterior === 'x' || anterior === 'y')) {
        throw new Error('Escribe 2x para multiplicar por dos, o x² para elevar al cuadrado.');
      }
      if (izquierda.has(anterior) && derecha.has(simbolo) && !(anterior === 'numero' && simbolo === 'numero')) {
        tokens.push({simbolo: '*'});
      }
      tokens.push({simbolo, numero: numero?.[0]});
      i += numero ? numero[0].length : 1;
    }
    return tokens;
  }

  function analizar(texto, limite = 90) {
    const tokens = separar(texto, limite);
    let i = 0;
    const es = simbolo => tokens[i]?.simbolo === simbolo;
    function atomo() {
      if (es('numero')) {
        const valor = leerDecimal(tokens[i++].numero);
        return valor[0] ? new Map([[constante, valor]]) : new Map();
      }
      if (es('x') || es('y')) return new Map([[tokens[i++].simbolo === 'x' ? base : 1, uno]]);
      if (es('(')) {
        i++;
        const interior = suma();
        if (!es(')')) throw new Error('Revisa que los paréntesis estén completos.');
        i++;
        return interior;
      }
      throw new Error('Falta un número, una variable o un paréntesis.');
    }

    function potencia() {
      const pol = atomo();
      if (!es('^')) return pol;
      i++;
      const [n,d] = valorConstante(signo(), 'Usa un exponente entero sin variables.');
      if (d !== 1n || n < 0n || n > BigInt(gradoMaximo)) {
        throw new Error('Usa un exponente entero entre 0 y 16.');
      }
      if (!pol.size && n === 0n) throw new Error('La potencia 0⁰ no está definida.');
      let resultado = new Map([[constante, uno]]);
      for (let p = 0; p < Number(n); p++) resultado = producto(resultado, pol);
      return resultado;
    }

    function signo() {
      if (es('+')) { i++; return signo(); }
      if (es('-')) { i++; return escalar(signo(), [-1n, 1n]); }
      return potencia();
    }

    function multiplicacion() {
      let pol = signo();
      while (es('*') || es('/')) {
        const op = tokens[i++].simbolo;
        const siguiente = signo();
        if (op === '*') {
          pol = producto(pol, siguiente);
        } else {
          const [n,d] = valorConstante(siguiente, 'En estos ejercicios, divide solo entre números sin variables.');
          pol = escalar(pol, fraccion(d, n));
        }
      }
      return pol;
    }

    function suma() {
      const pol = multiplicacion();
      while (es('+') || es('-')) {
        const factor = tokens[i++].simbolo === '+' ? 1n : -1n;
        for (const [clave,[n,d]] of multiplicacion()) asignar(pol, clave, [factor*n,d]);
      }
      return pol;
    }

    const pol = suma();
    if (i !== tokens.length) throw new Error('Revisa los símbolos y paréntesis de tu expresión.');
    return pol;
  }

  function mismosCoeficientes(a, b) {
    return a.size === b.size && [...a].every(([clave, [n,d]]) => {
      const otro = b.get(clave);
      return otro && n === otro[0] && d === otro[1];
    });
  }

  function lineal(texto) {
    const pol = analizar(texto, 110);
    if ([...pol.keys()].some(clave => clave !== constante && clave !== base)) {
      throw new Error('Escribe una expresión lineal con x.');
    }
    return pol;
  }

  function lados(texto) {
    const partes = String(texto ?? '').split('=');
    if (partes.length !== 2) throw new Error('Escribe una ecuación con un solo signo =.');
    return partes.map(lineal);
  }

  function expresionesLineales(ingresada, esperada) {
    try { return mismosCoeficientes(lineal(ingresada), lineal(esperada)); }
    catch { return false; }
  }

  function miembrosLineales(ingresada, esperada) {
    try {
      const [a,b] = lados(ingresada);
      const [c,d] = lados(esperada);
      return (mismosCoeficientes(a,c) && mismosCoeficientes(b,d)) ||
        (mismosCoeficientes(a,d) && mismosCoeficientes(b,c));
    } catch { return false; }
  }

  const fracciones = Object.freeze({
    crear: fraccion,
    leerDecimal,
    sumar: ([a,b],[c,d]) => fraccion(a*d + c*b, b*d),
    restar: ([a,b],[c,d]) => fraccion(a*d - c*b, b*d),
    multiplicar: ([a,b],[c,d]) => fraccion(a*c, b*d),
    dividir: ([a,b],[c,d]) => fraccion(a*d, b*c)
  });

  function sustituirEnEcuacionLineal(texto, valor) {
    return lados(texto).map(pol => {
      const a = pol.get(base) || [0n, 1n];
      const b = pol.get(constante) || [0n, 1n];
      return fracciones.sumar(fracciones.multiplicar(a, valor), b);
    });
  }

  window.DespejandoAlgebra = Object.freeze({
    equivalentes: (ingresada, esperada) => mismosCoeficientes(analizar(ingresada), analizar(esperada)),
    expresionesLineales,
    miembrosLineales,
    sustituirEnEcuacionLineal,
    fracciones
  });
})();
