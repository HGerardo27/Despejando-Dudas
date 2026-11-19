(() => {
  'use strict';

  const reinicio = 'despejando-dudas-reinicio-v1';

  function dato(texto) {
    try {
      const valor = JSON.parse(texto);
      return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : null;
    } catch {
      return null;
    }
  }

  function leer(clave) {
    try { return dato(localStorage.getItem(clave)); }
    catch { return null; }
  }

  function avisarConflicto() {
    const id = 'dd-conflicto-progreso';
    if (document.getElementById(id)) return;
    const aviso = document.createElement('div');
    aviso.id = id;
    aviso.className = 'container m1-feedback error';
    aviso.setAttribute('role', 'alert');
    aviso.textContent = 'El progreso cambió en otra pestaña. Esta edición no se guardó. Recarga la página para recuperar la versión guardada.';
    document.getElementById('main-content').before(aviso);
    aviso.scrollIntoView({block: 'nearest'});
  }

  function abrir(clave) {
    let version;
    let epoca;
    function recargar() {
      try {
        version = localStorage.getItem(clave);
        epoca = localStorage.getItem(reinicio);
        return dato(version);
      } catch {
        return null;
      }
    }

    function actualizar(record) {
      try {
        if (localStorage.getItem(clave) !== version || localStorage.getItem(reinicio) !== epoca) {
          avisarConflicto();
          return false;
        }
        const siguiente = record === null ? null : JSON.stringify(record);
        if (siguiente === null) localStorage.removeItem(clave);
        else localStorage.setItem(clave, siguiente);
        version = siguiente;
        window.dispatchEvent(new CustomEvent('dd:progress', {detail: {key: clave}}));
        return true;
      } catch {
        return false;
      }
    }

    recargar();
    return Object.freeze({leer: () => leer(clave), recargar, guardar: actualizar, borrar: () => actualizar(null)});
  }

  function borrarTodo(claves) {
    const marca = crypto.getRandomValues(new Uint32Array(4)).join('-');
    localStorage.setItem(reinicio, marca);
    for (const clave of claves) localStorage.removeItem(clave);
  }

  window.DespejandoProgreso = Object.freeze({abrir, leer, borrarTodo});
})();
