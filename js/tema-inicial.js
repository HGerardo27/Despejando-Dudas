// Aplicar el tema guardado antes de pintar la página para evitar destellos.
    try { if (localStorage.getItem('despejando-dudas-theme') === 'cyberpunk') document.documentElement.dataset.theme = 'cyberpunk'; } catch (e) {}
