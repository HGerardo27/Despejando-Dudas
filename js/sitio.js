(function () {
      'use strict';
      const pages = [...document.querySelectorAll('[data-page]')];
      const links = [...document.querySelectorAll('[data-nav]')];
      const menu = document.querySelector('.menu-toggle');
      const navigation = document.getElementById('main-navigation');
      const routes = new Set(pages.map(page => page.dataset.page));
      const themeButton = document.getElementById('theme-toggle');
      const themeName = themeButton.querySelector('.theme-name');
      const themeIcon = themeButton.querySelector('.theme-icon');
      const themeColor = document.querySelector('meta[name="theme-color"]');
      function applyTheme(theme) {
        const cyber = theme === 'cyberpunk';
        document.documentElement.dataset.theme = cyber ? 'cyberpunk' : 'modern';
        themeName.textContent = cyber ? 'Cyberpunk' : 'Moderno';
        themeIcon.textContent = cyber ? '✦' : '◐';
        themeButton.setAttribute('aria-pressed', String(cyber));
        themeButton.setAttribute('aria-label', cyber
          ? 'Estilo Synthwave Cyberpunk activo. Cambiar a diseño moderno'
          : 'Estilo moderno activo. Cambiar a Synthwave Cyberpunk');
        themeButton.title = cyber ? 'Cambiar a diseño moderno' : 'Cambiar a estilo Synthwave Cyberpunk';
        if (themeColor) themeColor.setAttribute('content', cyber ? '#0b0820' : '#14243d');
        try { localStorage.setItem('despejando-dudas-theme', cyber ? 'cyberpunk' : 'modern'); } catch (e) {}
      }
      themeButton.addEventListener('click', () => {
        applyTheme(document.documentElement.dataset.theme === 'cyberpunk' ? 'modern' : 'cyberpunk');
      });
      applyTheme(document.documentElement.dataset.theme);
      function closeMenu() {
        navigation.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Abrir menú');
      }
      function navigate(event) {
        let hash = '';
        try { hash = decodeURIComponent(location.hash.slice(1)); }
        catch { /* Un enlace mal codificado abre el inicio. */ }
        const anchor = document.getElementById(hash);
        const section = anchor?.closest('[data-page]');
        const route = routes.has(hash) ? hash : section?.dataset.page || 'inicio';
        pages.forEach(page => { page.classList.toggle('active', page.dataset.page === route); });
        links.forEach(link => {
          const active = link.dataset.nav === route;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
        closeMenu();
        const heading = document.getElementById('page-' + route).querySelector('h1');
        if (section && anchor !== section) {
          requestAnimationFrame(() => {
            if (!anchor.getClientRects().length) return;
            anchor.scrollIntoView({block: 'start'});
            const target = anchor.querySelector('h2, h3') || anchor;
            if (event) {
              target.setAttribute('tabindex', '-1');
              target.focus({preventScroll: true});
            }
          });
        } else {
          window.scrollTo({top:0, behavior:'instant'});
          if (event) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({preventScroll: true});
          }
        }
        document.title = route === 'inicio' ? 'Despejando Dudas | Aprende álgebra a tu ritmo' :
          heading.textContent + ' | Despejando Dudas';
        window.dispatchEvent(new CustomEvent('dd:navigate', {detail: {hash, route}}));
      }
      menu.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('open');
        menu.setAttribute('aria-expanded', String(isOpen));
        menu.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      });
      document.addEventListener('keydown', event => {if (event.key === 'Escape') closeMenu();});
      window.addEventListener('hashchange', navigate);
      navigate();
    })();
