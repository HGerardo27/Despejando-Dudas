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

  function separar(texto) {
    const s = String(texto ?? '').trim().toLowerCase().replace(/\s+/g, '')
      .replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/,/g, '.');
    if (!s || s.length > 90 || !/^[0-9xy.+*\-/()^]+$/.test(s)) {
      throw new Error('Escribe una expresión con x, y, números y operaciones (sin el signo =).');
    }
    const tokens = [];
    const izquierda = new Set(['numero', 'x', 'y', ')']);
    const derecha = new Set(['numero', 'x', 'y', '(']);
    for (let i = 0; i < s.length;) {
      const numero = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      const simbolo = numero ? 'numero' : s[i];
      const anterior = tokens.at(-1)?.simbolo;
      if (izquierda.has(anterior) && derecha.has(simbolo) && !(anterior === 'numero' && simbolo === 'numero')) {
        tokens.push({simbolo: '*'});
      }
      tokens.push({simbolo, numero: numero?.[0]});
      i += numero ? numero[0].length : 1;
    }
    return tokens;
  }

  function analizar(texto) {
    const tokens = separar(texto);
    let i = 0;
    const es = simbolo => tokens[i]?.simbolo === simbolo;
    function atomo() {
      if (es('numero')) {
        const [entero, decimales = ''] = tokens[i++].numero.split('.');
        const n = BigInt((entero || '0') + decimales);
        return n ? new Map([[constante, fraccion(n, 10n ** BigInt(decimales.length))]]) : new Map();
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

  function equivalentes(ingresada, esperada) {
    const a = analizar(ingresada);
    const b = analizar(esperada);
    return a.size === b.size && [...a].every(([clave, [n,d]]) => {
      const otro = b.get(clave);
      return otro && n === otro[0] && d === otro[1];
    });
  }

  window.DespejandoAlgebra = Object.freeze({equivalentes});
})();
