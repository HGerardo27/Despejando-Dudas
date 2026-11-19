(() => {
  'use strict';

  const pasos = [
    {key: 'despejando-dudas-diagnostico-v1', hash: 'dg-test', ruta: 'diagnostico', inicio: 'dg-start', breve: 'diagnóstico', nombre: 'Diagnóstico inicial', total: 20},
    {key: 'despejando-dudas-m1-evaluacion-v1', hash: 'm1-evaluacion', ruta: 'modulo1', breve: 'evaluación del Módulo 1', nombre: 'Evaluación del Módulo 1', total: 10},
    {key: 'despejando-dudas-m2-evaluacion-v1', hash: 'm2-evaluacion', ruta: 'modulo2', breve: 'evaluación del Módulo 2', nombre: 'Evaluación del Módulo 2', total: 10},
    {key: 'despejando-dudas-final-v1', hash: 'fx-test', ruta: 'evaluacion', inicio: 'fx-start', breve: 'examen final', nombre: 'Examen final', total: 20}
  ];
  const portada = document.getElementById('dd-continue-home');
  const panel = document.getElementById('dd-continue-progress');

  const {leer, borrarTodo} = window.DespejandoProgreso;

  function tieneRespuesta(a) {
    if (a && typeof a === 'object') return Object.values(a).some(tieneRespuesta);
    return a !== null && a !== undefined && (typeof a !== 'string' || a.trim() !== '');
  }

  function borradores() {
    return pasos.flatMap(paso => {
      const draft = leer(paso.key)?.draft;
      if (!Array.isArray(draft?.answers) || draft.answers.length !== paso.total ||
          !Number.isInteger(draft.position) || draft.position < 0 || draft.position >= paso.total) return [];
      let respondidas = draft.answers.filter(tieneRespuesta).length;
      if (paso.ruta === 'modulo2') {
        respondidas = Number.isInteger(draft.respondidas) && draft.respondidas >= 0 && draft.respondidas <= paso.total
          ? draft.respondidas
          : draft.answers.filter((respuesta, index) => {
            if (index < 6) return tieneRespuesta(respuesta);
            return tieneRespuesta(respuesta?.eq) && tieneRespuesta(respuesta?.x);
          }).length;
      }
      return [{...paso, respondidas, position: draft.position, fecha: Number(draft.updatedAt) || 0}];
    }).sort((a, b) => b.fecha - a.fecha);
  }

  function enlace(texto, ruta) {
    const a = document.createElement('a');
    a.textContent = texto;
    a.href = '#' + ruta;
    a.className = 'btn btn-outline';
    return a;
  }

  function mostrar() {
    const lista = borradores();
    const reciente = lista[0];
    portada.hidden = !reciente;
    if (reciente) {
      portada.href = '#' + reciente.hash;
      portada.textContent = 'Continuar donde me quedé';
      portada.setAttribute('aria-label', 'Continuar donde me quedé: ' + reciente.breve);
    }
    panel.replaceChildren();
    if (lista.length) {
      const acciones = document.createElement('div');
      acciones.className = 'dg-actions';
      for (const paso of lista) {
        acciones.append(enlace('Continuar ' + paso.breve + ' · ' + paso.respondidas + '/' + paso.total, paso.hash));
      }
      panel.append(acciones);
      return;
    }
    const [, modulo1, modulo2, final] = pasos.map(paso => leer(paso.key));
    if (final?.first) {
      panel.append(enlace('Repasar los módulos', 'modulos'));
    } else if (modulo1?.last != null && modulo2?.last != null) {
      panel.append(enlace('Ir al examen final', 'evaluacion'));
    } else if (modulo1?.last != null) {
      panel.append(enlace('Explorar el Módulo 2', 'modulo2'));
    } else {
      panel.append(enlace('Explorar el Módulo 1', 'modulo1'));
    }
  }

  function abrirBorrador(hash) {
    const paso = borradores().find(item => item.hash === hash && item.inicio);
    if (!paso || !document.getElementById(hash).hidden) return;
    document.getElementById(paso.inicio).click();
  }

  window.addEventListener('dd:navigate', event => {
    abrirBorrador(event.detail.hash);
    mostrar();
  });
  window.addEventListener('dd:progress', mostrar);
  window.addEventListener('storage', mostrar);

  const button = document.getElementById('reset-all-progress');
  const message = document.getElementById('reset-progress-status');
  button.addEventListener('click', () => {
    const ask = '¿Seguro que quieres reiniciar todo tu progreso?\n\nSe borrarán los resultados y borradores. Se conservará el estilo visual.\n\nNo se puede deshacer.';
    if (!window.confirm(ask)) return;
    try {
      borrarTodo(pasos.map(paso => paso.key));
      window.location.reload();
    } catch {
      message.textContent = 'No se pudo acceder al almacenamiento de este navegador. Revisa que permita guardar datos locales.';
    }
  });

  try { abrirBorrador(decodeURIComponent(location.hash.slice(1))); } catch { /* Enlace inválido. */ }
  mostrar();
})();
