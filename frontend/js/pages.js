/* Tawa inner pages: navbar, bag, favorites, account (demo, browser-only), shop, product, checkout, contact, counters */
import { PRODUCTS } from './data.js';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const load = (k, d) => { try { return JSON.parse(localStorage.getItem('tawa:' + k)) ?? d; } catch { return d; } };
const S = { cart: load('cart', {}), favs: load('favs', []), user: load('user', null), users: load('users', {}) };
const save = k => { try { localStorage.setItem('tawa:' + k, JSON.stringify(S[k])); } catch {} };
const P = id => PRODUCTS.find(p => p.id === id);
const money = n => '$' + n.toFixed(2);
const grad = p => `--c1:${p.c[0]};--c2:${p.c[1]}`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let filter = 'all', query = '', pq = 1, authMode = 'in';

/* ---------- Shared UI ---------- */
document.body.insertAdjacentHTML('beforeend', `
<div class="scrim" data-close hidden></div>
<aside class="drawer" id="cart" aria-label="Shopping bag" hidden>
  <header><h2>Your bag</h2><button class="icon" data-close aria-label="Close bag">×</button></header>
  <div id="cart-body"></div><footer id="cart-foot"></footer>
</aside>
<dialog id="auth" aria-label="Account"><button class="icon x" data-close-auth aria-label="Close">×</button><div id="auth-body"></div></dialog>
<div class="toast" role="status"></div>`);
$('.navbar__toggle')?.insertAdjacentHTML('beforebegin', `
<div class="navbar__actions">
  <a class="icon" href="favorites.html" aria-label="Favorites">♡<sup id="fav-n"></sup></a>
  <button class="icon" data-open="cart" aria-label="Open bag">Bag<sup id="cart-n"></sup></button>
  <button class="btn btn--sm" data-open="auth" id="acct">Sign in</button>
</div>`);

let toastT;
const toast = msg => { const t = $('.toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); };
const drawer = open => { $('#cart').hidden = !open; $('.scrim').hidden = !open; };

/* ---------- Renderers ---------- */
const card = p => `<div class="card"><a href="product.html?id=${p.id}"><div class="ph" style="${grad(p)}"></div><h3>${p.name}</h3></a>
<div class="card__row"><span>${money(p.price)}</span><button class="icon" data-fav="${p.id}" aria-pressed="false" aria-label="Save ${p.name} to favorites">♡</button></div>
<button class="btn" data-add="${p.id}">Add to bag</button></div>`;

const cartItems = () => Object.entries(S.cart).map(([id, q]) => ({ p: P(id), q })).filter(i => i.p);
const total = () => cartItems().reduce((s, i) => s + i.p.price * i.q, 0);

function render() {
  const items = cartItems(), count = items.reduce((s, i) => s + i.q, 0);
  $('#cart-n').textContent = count || ''; $('#fav-n').textContent = S.favs.length || '';
  $('#acct').textContent = S.user ? S.user.name.split(' ')[0] : 'Sign in';
  $('#cart-body').innerHTML = items.length ? items.map(({ p, q }) => `<div class="line"><div class="ph" style="${grad(p)}"></div>
    <div><strong>${p.name}</strong><div>${money(p.price)}</div><div class="qty"><button data-dec="${p.id}" aria-label="Decrease">-</button><output>${q}</output><button data-inc="${p.id}" aria-label="Increase">+</button><button class="link" data-del="${p.id}">Remove</button></div></div></div>`).join('')
    : '<p class="empty">Your bag is empty. <a href="shop.html">Browse the shop</a>.</p>';
  $('#cart-foot').innerHTML = items.length ? `<div class="sub"><span>Subtotal</span><strong>${money(total())}</strong></div><a class="btn btn--primary" href="checkout.html">Go to checkout</a>` : '';
  $$('[data-fav]').forEach(b => { const on = S.favs.includes(b.dataset.fav); b.setAttribute('aria-pressed', on); b.firstChild.textContent = on ? '♥' : '♡'; });

  const grid = $('#products');
  if (grid) {
    const list = PRODUCTS.filter(p => (filter === 'all' || p.cat === filter) && p.name.toLowerCase().includes(query));
    grid.innerHTML = list.length ? list.map(card).join('') : '<p class="empty">No products match your search. Clear the search or pick another category.</p>';
  }
  const fav = $('#favs');
  if (fav) fav.innerHTML = S.favs.length ? S.favs.map(id => card(P(id))).join('') : '<p class="empty">You have not saved anything yet. Tap the heart on a product to keep it here.</p>';
  $$('[data-fav]').forEach(b => { const on = S.favs.includes(b.dataset.fav); b.setAttribute('aria-pressed', on); b.firstChild.textContent = on ? '♥' : '♡'; });
  renderSummary();
}

function renderProduct() {
  const root = $('#product'); if (!root) return;
  const p = P(new URLSearchParams(location.search).get('id')) || PRODUCTS[0];
  document.title = `${p.name} · Tawa Cosmetics`;
  const alts = [p.c, ...PRODUCTS.filter(x => x !== p).slice(0, 3).map(x => x.c)];
  root.innerHTML = `<div class="split"><div><div class="ph" id="main-img" style="${grad(p)}"></div><div class="thumbs">${alts.map((c, i) => `<button class="${i ? '' : 'is-active'}" aria-label="View image ${i + 1}" data-c1="${c[0]}" data-c2="${c[1]}"><div class="ph" style="--c1:${c[0]};--c2:${c[1]}"></div></button>`).join('')}</div></div>
  <div><a href="shop.html">Back to shop</a><h1 style="font-size:clamp(2.2rem,5vw,3.6rem);margin-top:12px">${p.name}</h1><div class="price">${money(p.price)}</div><p>${p.desc}</p>
  <div class="qty"><button id="minus" aria-label="Decrease quantity">-</button><output id="qty">1</output><button id="plus" aria-label="Increase quantity">+</button></div>
  <div class="row"><button class="btn btn--primary" data-add="${p.id}" data-pdp>Add to bag</button><button class="btn" data-fav="${p.id}" aria-pressed="false"><span>♡</span> Save</button></div>
  <p style="margin-top:28px"><strong>Good to know:</strong> fragrance-free, suitable for sensitive skin.</p></div></div>`;
  pq = 1;
}

function renderSummary() {
  const box = $('#summary'); if (!box) return;
  const items = cartItems();
  box.innerHTML = items.length ? items.map(({ p, q }) => `<div class="sub"><span>${p.name} × ${q}</span><span>${money(p.price * q)}</span></div>`).join('') + `<div class="sub"><strong>Total</strong><strong>${money(total())}</strong></div>`
    : '<p class="empty">Your bag is empty. <a href="shop.html">Browse the shop</a>.</p>';
  const em = $('#co-email'); if (em && S.user && !em.value) em.value = S.user.email;
}

function renderAuth() {
  const b = $('#auth-body');
  if (S.user) { b.innerHTML = `<h2>Hi, ${esc(S.user.name.split(' ')[0])}</h2><p>Signed in as ${esc(S.user.email)}.</p><div class="row"><a class="btn" href="favorites.html">My favorites</a><button class="btn btn--primary" id="signout">Sign out</button></div>`; return; }
  const up = authMode === 'up';
  b.innerHTML = `<div class="tabs"><button class="${up ? '' : 'is-active'}" data-mode="in">Sign in</button><button class="${up ? 'is-active' : ''}" data-mode="up">Create account</button></div>
  <form id="auth-form" novalidate>${up ? '<label>Full name<input name="name" autocomplete="name"></label>' : ''}
  <label>Email<input name="email" type="email" autocomplete="email"></label>
  <label>Password<input name="password" type="password" autocomplete="${up ? 'new-password' : 'current-password'}" placeholder="At least 8 characters"></label>
  <div class="err" id="auth-err"></div><button class="btn btn--primary">${up ? 'Create account' : 'Sign in'}</button></form>`;
}

/* ---------- Events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button,a,[data-close]'); if (!t) return;
  const d = t.dataset;
  if (d.open === 'cart') drawer(true);
  else if (d.open === 'auth') { renderAuth(); $('#auth').showModal(); }
  else if ('close' in d) drawer(false);
  else if ('closeAuth' in d) $('#auth').close();
  else if (d.add) { const n = 'pdp' in d ? pq : 1; S.cart[d.add] = Math.min(9, (S.cart[d.add] || 0) + n); save('cart'); render(); drawer(true); }
  else if (d.inc || d.dec) { const id = d.inc || d.dec; S.cart[id] = Math.min(9, (S.cart[id] || 0) + (d.inc ? 1 : -1)); if (S.cart[id] < 1) delete S.cart[id]; save('cart'); render(); }
  else if (d.del) { delete S.cart[d.del]; save('cart'); render(); }
  else if (d.fav) { const on = S.favs.includes(d.fav); S.favs = on ? S.favs.filter(i => i !== d.fav) : [...S.favs, d.fav]; save('favs'); render(); toast(on ? 'Removed from favorites' : 'Saved to favorites'); }
  else if (d.mode) { authMode = d.mode; renderAuth(); }
  else if (t.id === 'signout') { S.user = null; save('user'); $('#auth').close(); render(); toast('Signed out'); }
  else if (t.id === 'minus') $('#qty').textContent = pq = Math.max(1, pq - 1);
  else if (t.id === 'plus') $('#qty').textContent = pq = Math.min(9, pq + 1);
  else if (d.c1) { $$('.thumbs button').forEach(b => b.classList.toggle('is-active', b === t)); const m = $('#main-img'); m.style.setProperty('--c1', d.c1); m.style.setProperty('--c2', d.c2); }
  else if (t.matches('.filters button')) { filter = d.f; $$('.filters button').forEach(b => b.classList.toggle('is-active', b === t)); render(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { drawer(false); $('.navbar__menu')?.classList.remove('is-open'); } });
$('#auth').addEventListener('click', e => { if (e.target.id === 'auth') e.target.close(); });
$('#search')?.addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); render(); });

document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'auth-form') {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(f)), err = $('#auth-err'), up = authMode === 'up', em = (v.email || '').trim().toLowerCase();
    if (up && !v.name.trim()) return err.textContent = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(em)) return err.textContent = 'Enter a valid email address.';
    if ((v.password || '').length < 8) return err.textContent = 'Password must be at least 8 characters.';
    if (up) { if (S.users[em]) return err.textContent = 'An account with this email exists. Sign in instead.'; S.users[em] = { name: v.name.trim() }; save('users'); }
    else if (!S.users[em]) return err.textContent = 'No account found for this email. Create an account first.';
    S.user = { name: S.users[em].name, email: em }; save('user'); $('#auth').close(); render(); toast(up ? 'Account created' : 'Signed in');
  }
  if (f.id === 'checkout') {
    e.preventDefault(); let ok = true;
    $$('[data-req]', f).forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.nextElementSibling.textContent = bad ? 'Check this field.' : ''; if (bad) ok = false; });
    if (!ok || !cartItems().length) return;
    S.cart = {}; save('cart'); render();
    f.outerHTML = `<div class="ok show" role="status"><h2>Order placed</h2><p>Your order number is TW-${Math.floor(10000 + Math.random() * 90000)}. We will email a confirmation shortly. Payment is collected on delivery.</p><a class="btn" href="shop.html">Keep shopping</a></div>`;
  }
  if (f.id === 'contact') {
    e.preventDefault(); let ok = true;
    $$('[data-req]', f).forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.nextElementSibling.textContent = bad ? (i.type === 'email' ? 'Enter a valid email address.' : 'This field is required.') : ''; if (bad) ok = false; });
    if (ok) { $('.ok').classList.add('show'); f.reset(); }
  }
});

/* ---------- Navbar ---------- */
const nav = $('.navbar'), toggle = $('.navbar__toggle'), menu = $('.navbar__menu');
toggle?.addEventListener('click', () => { const o = menu.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', o); toggle.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); });
const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 50);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- Counters ---------- */
$$('[data-count]').forEach(el => new IntersectionObserver(([en], io) => {
  if (!en.isIntersecting) return; io.disconnect();
  const t = +el.dataset.count, s = performance.now();
  const tick = n => { const p = Math.min((n - s) / 1400, 1); el.textContent = Math.round(t * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}, { threshold: .4 }).observe(el));

renderProduct(); render();
