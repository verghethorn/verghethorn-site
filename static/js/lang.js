// Language switcher: same page in the other language; remembers the choice.
const here = location.pathname.startsWith('/ru/') ? location.pathname.slice(3) : location.pathname;
const target = code => (code === 'en' ? '' : `/${code}`) + here + location.hash;
document.querySelectorAll('[data-lang]').forEach(a => {
  a.href = target(a.dataset.lang);
  a.addEventListener('click', () => { try { localStorage.setItem('vt-lang', a.dataset.lang); } catch {} });
});
const wrap = document.querySelector('[data-lang-wrap]');
if (wrap) {
  const btn = wrap.querySelector('[data-lang-btn]'), menu = wrap.querySelector('[data-lang-menu]');
  const set = on => { menu.hidden = !on; btn.setAttribute('aria-expanded', String(on)); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(menu.hidden); });
  addEventListener('click', e => { if (!wrap.contains(e.target)) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
}
