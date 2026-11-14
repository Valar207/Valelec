/* Valelec · couche de traduction (anglais), réversible sans recharger la page.
   Le site est écrit en français. En anglais, chaque texte affiché (et aria-label, title, placeholder, alt) est remplacé
   par sa traduction, y compris ce que le code ajoute ensuite. Le français d'origine est gardé en mémoire : window.i18nSet('fr')
   le remet en place, window.i18nSet('en') retraduit (le dictionnaire i18n-en.js n'est chargé qu'au premier passage en anglais).
   Après chaque bascule, l'évènement « langue » prévient le glossaire et la 3D.
   - Une phrase avec du gras, de l'italique… est traduite d'un bloc : balises notées <a>…</a>, <b>…</b> dans l'ordre ;
     les mots du glossaire (.gl) sont lus comme du texte simple (le glossaire les repère de nouveau ensuite, dans la bonne langue).
   - Repères d'appareils (Q1, KM1…) et nombres → ⟦0⟧, ⟦1⟧… ; nombres au format anglais (0,53 → 0.53 ; 2 007 → 2,007).
   - Mode « collect » (?lang=collect) : rien n'est traduit, chaque texte vu est noté dans window.__COL (préparation du dictionnaire). */
(function () {
  let MODE = window.LANG;
  let D = {}, REGLES = [];
  const charger = () => { const E = window.I18N_EN; if (!E) return false; D = E.t || {}; REGLES = (E.r || []).map(([p, t]) => [new RegExp(p), t]); return true; };
  charger();
  const REF = /\b(?=[A-Z0-9]*\d)[A-Z][A-Z0-9]{0,5}\b/g;
  const LETTRES = /[A-Za-zÀ-ÿŒœ]{2,}|(^|\s)à(\s|$)/;
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const SUFFIXES = [[' (défile horizontalement)', ' (scrolls horizontally)']];
  const gabarit = (s) => {
    const v = []; let k = s.replace(REF, (m) => { v.push(m); return '⟦' + (v.length - 1) + '⟧'; });
    k = k.replace(/(^|[^⟦\d])(\d+(?:[  ]\d{3})*(?:,\d+)?)(?![⟧\d])/g, (m, a, n) => { v.push(n); return a + '⟦' + (v.length - 1) + '⟧'; });
    return { k, v };
  };
  const nombreEN = (x) => (/^\d/.test(x) ? x.replace(/,(\d+)$/, '.$1').replace(/[  ](?=\d{3})/g, ',') : x);
  const remplir = (t, v) => t.replace(/⟦(\d+)⟧/g, (m, i) => (v[+i] === undefined ? m : nombreEN(v[+i])));
  function trCle(k) {
    if (D[k] !== undefined) return D[k];
    const g = gabarit(k);
    if (g.k !== k && D[g.k] !== undefined) return remplir(D[g.k], g.v);
    for (const [re, tpl] of REGLES) { const m = k.match(re); if (m) return tpl.replace(/\{(\d+)\}/g, (x, i) => { const s = m[+i] || ''; const t = trCle(s); if (t != null) return t; const gg = gabarit(s); return remplir(gg.k, gg.v); }); }
    for (const [fr, en] of SUFFIXES) if (k.endsWith(fr)) { const base = k.slice(0, -fr.length); return (trCle(base) ?? base) + en; }
    if (k.includes(' · ') && !k.includes('<')) { const parts = k.split(' · '), out = parts.map((p) => trCle(p) ?? p); if (out.some((o, i) => o !== parts[i])) return out.join(' · '); }
    return null;
  }
  const COL = window.__COL = window.__COL || new Set();
  const RESTE = window.__RESTE = window.__RESTE || new Set(); /* textes sans traduction (vérification) */
  function tr(s) {
    if (s == null || (MODE !== 'en' && MODE !== 'collect')) return s;
    const str = String(s), k = norm(str);
    if (!k || !LETTRES.test(k)) return str;
    if (MODE === 'collect') { COL.add(k); return str; }
    const t = trCle(k); if (t == null) { RESTE.add(k); return str; }
    return str.match(/^\s*/)[0] + t + str.match(/\s*$/)[0];
  }
  window.tr = tr;

  const SAUTER = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'KBD', 'TEXTAREA']);
  const INLINE = new Set(['B', 'STRONG', 'I', 'EM', 'SPAN', 'A', 'SMALL', 'SUP', 'SUB', 'BR', 'ABBR', 'MARK', 'U', 'S', 'Q', 'DFN', 'CITE', 'TIME', 'WBR']);
  const SEL_INLINE = ':not(' + [...INLINE].join(',').toLowerCase() + ')';
  const ATTRS = ['aria-label', 'title', 'placeholder', 'alt', 'aria-description'];
  /* mémoire : texte d'origine → texte posé, pour pouvoir revenir au français */
  const ORIG = new WeakMap(), POSE = new WeakMap();     // nœuds texte
  const ORIGB = new WeakMap(), POSEB = new WeakMap();   // blocs (enfants d'origine, contenu posé)
  const ORIGA = new WeakMap();                          // attributs : { nom: [origine, posé] }
  const vu = new WeakMap();                             // collecte : déjà noté
  const horsTrad = (e) => e.closest && e.closest('[translate="no"]');
  const lettre = (i) => String.fromCharCode(97 + i);
  const estGl = (c) => c.nodeType === 1 && c.classList && c.classList.contains('gl');
  function estBloc(e) {
    if (!e || e.nodeType !== 1 || SAUTER.has(e.nodeName) || e.namespaceURI !== 'http://www.w3.org/1999/xhtml') return false;
    let texteDirect = false, inline = false;
    for (const c of e.childNodes) {
      if (c.nodeType === 3) { if (c.nodeValue.trim()) texteDirect = true; }
      else if (c.nodeType === 1) { if (estGl(c)) { texteDirect = true; continue; } if (!INLINE.has(c.nodeName) || c.querySelector(SEL_INLINE)) return false; inline = true; }
    }
    return texteDirect && (inline || [...e.childNodes].some(estGl));
  }
  function ser(e, L) {
    let o = '';
    for (const c of e.childNodes) {
      if (c.nodeType === 3) o += c.nodeValue.replace(/</g, '&lt;');
      else if (estGl(c)) o += c.textContent.replace(/</g, '&lt;');
      else if (c.nodeType === 1) { const i = L.push(c) - 1, t = lettre(i); o += c.nodeName === 'BR' || c.nodeName === 'WBR' ? `<${t}/>` : `<${t}>${ser(c, L)}</${t}>`; }
    }
    return o;
  }
  function construire(s, L) {
    const frag = document.createDocumentFragment(), pile = [frag], re = /<([a-z])\/>|<([a-z])>|<\/([a-z])>|([^<]+|<)/g; let m;
    while ((m = re.exec(s))) {
      const haut = pile[pile.length - 1];
      if (m[1]) { const o = L[m[1].charCodeAt(0) - 97]; haut.appendChild(o ? o.cloneNode(false) : document.createElement('br')); }
      else if (m[2]) { const o = L[m[2].charCodeAt(0) - 97], n = o ? o.cloneNode(false) : document.createElement('span'); haut.appendChild(n); pile.push(n); }
      else if (m[3]) { if (pile.length > 1) pile.pop(); }
      else haut.appendChild(document.createTextNode(m[4].replace(/&lt;/g, '<')));
    }
    return frag;
  }
  function bloc(e) {
    if (horsTrad(e)) return;
    const L = [], s = ser(e, L), cle = norm(s);
    if (MODE === 'collect') { if (vu.get(e) !== s) { vu.set(e, s); if (LETTRES.test(cle)) COL.add(cle); } return; }
    if (POSEB.get(e) === s) return;                        // déjà notre traduction
    if (!LETTRES.test(cle)) return;
    let t = null;
    if (D[cle] !== undefined) t = D[cle];
    else { const g = gabarit(cle); if (g.k !== cle && D[g.k] !== undefined) t = remplir(D[g.k], g.v); }
    if (t == null) { RESTE.add(cle); L.forEach((x) => arbre(x)); e.childNodes.forEach((c) => { if (c.nodeType === 3) texte(c); }); return; }
    const debut = s.match(/^\s*/)[0], fin = s.match(/\s*$/)[0];
    ORIGB.set(e, [...e.childNodes]);
    e.replaceChildren(construire(debut + t + fin, L));
    POSEB.set(e, ser(e, []));
    L.forEach((x) => attrs(x));
  }
  function texte(n) {
    const p = n.parentNode; if (!p || SAUTER.has(p.nodeName) || horsTrad(p)) return;
    const v = n.nodeValue;
    if (MODE === 'collect') { if (vu.get(n) !== v) { vu.set(n, v); tr(v); } return; }
    if (POSE.get(n) === v) return;
    const t = tr(v); ORIG.set(n, v); if (t !== v) n.nodeValue = t; POSE.set(n, n.nodeValue);
  }
  function attrs(el) {
    if (!el.getAttribute || horsTrad(el)) return;
    let m = ORIGA.get(el);
    for (const a of ATTRS) {
      const v = el.getAttribute(a); if (!v) continue;
      if (m && m[a] && m[a][1] === v) continue;
      const t = tr(v); if (MODE === 'collect') continue;
      if (!m) { m = {}; ORIGA.set(el, m); }
      m[a] = [v, t]; if (t !== v) el.setAttribute(a, t);
    }
  }
  function svg(r) { attrs(r); r.querySelectorAll('*').forEach((x) => { attrs(x); if (x.nodeName === 'text' || x.nodeName === 'tspan' || x.nodeName === 'title') x.childNodes.forEach((c) => { if (c.nodeType === 3) texte(c); }); }); }
  function arbre(r) {
    if (!r || (MODE !== 'en' && MODE !== 'collect')) return;
    if (r.nodeType === 3) { const p = r.parentElement; if (p && estBloc(p)) return bloc(p); return texte(r); }
    if (r.nodeType !== 1 || SAUTER.has(r.nodeName)) return;
    if (r.nodeName === 'svg') return svg(r);
    if (estBloc(r)) { attrs(r); return bloc(r); }
    attrs(r);
    const tw = document.createTreeWalker(r, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: (x) => {
      if (x.nodeType === 1) { if (x.nodeName === 'svg') { svg(x); return NodeFilter.FILTER_REJECT; } if (SAUTER.has(x.nodeName)) { attrs(x); return NodeFilter.FILTER_REJECT; } if (estBloc(x)) { attrs(x); bloc(x); return NodeFilter.FILTER_REJECT; } }
      return NodeFilter.FILTER_ACCEPT; } });
    while (tw.nextNode()) { const x = tw.currentNode; if (x.nodeType === 3) texte(x); else attrs(x); }
  }
  /* retour au français : on remet ce qui avait été remplacé, sauf si le code l'a changé depuis */
  function restaurer() {
    const tw = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    const blocs = [], textes = [], elems = [];
    for (let n = tw.currentNode; n; n = tw.nextNode()) {
      if (n.nodeType === 3) { if (ORIG.has(n)) textes.push(n); }
      else { if (ORIGB.has(n)) blocs.push(n); if (ORIGA.has(n)) elems.push(n); }
    }
    textes.forEach((n) => { if (n.nodeValue === POSE.get(n)) n.nodeValue = ORIG.get(n); ORIG.delete(n); POSE.delete(n); });
    elems.forEach((el) => { const m = ORIGA.get(el); for (const a in m) if (el.getAttribute(a) === m[a][1]) el.setAttribute(a, m[a][0]); ORIGA.delete(el); });
    blocs.reverse().forEach((e) => { if (ser(e, []) === POSEB.get(e)) e.replaceChildren(...ORIGB.get(e)); ORIGB.delete(e); POSEB.delete(e); });
    /* filet de sécurité : le glossaire a pu découper un texte traduit pour y poser ses infobulles.
       On retire ces infobulles (il les remettra en français), puis on retrouve le français avec le dictionnaire lu à l'envers. */
    const parents = new Set();
    document.querySelectorAll('.gl').forEach((g) => { const p = g.parentNode; if (!p) return; p.replaceChild(document.createTextNode(g.textContent), g); parents.add(p); });
    parents.forEach((p) => p.normalize());
    const INV = inverse();
    const tw2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: (x) => (x.nodeType === 1 && (SAUTER.has(x.nodeName) || x.getAttribute('translate') === 'no') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const reste = [];
    for (let n = tw2.nextNode(); n; n = tw2.nextNode()) if (n.nodeType === 3) reste.push(n); else if (n.getAttribute) for (const a of ATTRS) { const v = n.getAttribute(a); if (v && INV.has(norm(v))) n.setAttribute(a, INV.get(norm(v))); }
    reste.forEach((n) => { const k = norm(n.nodeValue); const f = k && versFR(k); if (f != null) n.nodeValue = n.nodeValue.match(/^\s*/)[0] + f + n.nodeValue.match(/\s*$/)[0]; });
  }
  /* anglais → français : exact, puis phrase-modèle (repères et nombres), puis morceau par morceau pour « a · b » */
  const nombreFR = (x) => (/^\d/.test(x) ? x.replace(/,(?=\d{3})/g, '\u202f').replace(/\.(\d+)$/, ',$1') : x);
  function versFR(k) {
    const INV = inverse(); if (INV.has(k)) return INV.get(k);
    const v = []; let g = k.replace(REF, (m) => { v.push(m); return '\u27e6' + (v.length - 1) + '\u27e7'; });
    g = g.replace(/(^|[^\u27e6\d])(\d+(?:,\d{3})*(?:\.\d+)?)(?![\u27e7\d])/g, (m, a, n) => { v.push(n); return a + '\u27e6' + (v.length - 1) + '\u27e7'; });
    if (g !== k && INVT.has(g)) return INVT.get(g).replace(/\u27e6(\d+)\u27e7/g, (m, i) => (v[+i] === undefined ? m : nombreFR(v[+i])));
    if (k.includes(' · ')) { const parts = k.split(' · '), out = parts.map((p) => versFR(p) ?? p); if (out.some((o, i) => o !== parts[i])) return out.join(' · '); }
    return null;
  }
  /* dictionnaire à l'envers (anglais → français), seulement pour les entrées sans repère ni balise */
  let INVC = null;
  const INVT = new Map();
  const inverse = () => { if (INVC) return INVC; INVC = new Map(); for (const k in D) { const v = D[k]; if (k.includes('<')) continue; if (k.includes('\u27e6')) { if (!INVT.has(v)) INVT.set(v, k); } else if (!INVC.has(v)) INVC.set(v, k); } return INVC; };
  /* un changement à l'intérieur d'un bloc retraduit le bloc entier */
  const blocDe = (n) => { let e = n.nodeType === 1 ? n : n.parentElement; for (let i = 0; e && i < 4; i++, e = e.parentElement) { if (estBloc(e)) return e; if (!INLINE.has(e.nodeName)) break; } return null; };
  const mo = new MutationObserver((ms) => {
    if (MODE !== 'en' && MODE !== 'collect') return;
    for (const m of ms) {
      if (m.type === 'attributes') { attrs(m.target); continue; }
      const b = blocDe(m.target);
      if (b) { bloc(b); continue; }
      if (m.type === 'childList') m.addedNodes.forEach(arbre);
      else if (m.type === 'characterData') { const p = m.target.parentNode; if (p && (p.nodeName === 'text' || p.nodeName === 'tspan')) texte(m.target); else arbre(m.target); }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  /* titre de l'onglet */
  let titreFR = null;
  const titre = () => { if (MODE !== 'en') return; const t = tr(document.title); if (t !== document.title) { titreFR = document.title; document.title = t; } };
  const tout = () => arbre(document.documentElement);
  if (document.body) tout();
  document.addEventListener('DOMContentLoaded', () => { tout(); const el = document.querySelector('title'); if (el) new MutationObserver(titre).observe(el, { childList: true, characterData: true, subtree: true }); titre(); });
  const P = window.prompt, A = window.alert, C = window.confirm;
  window.prompt = (m, d) => P.call(window, tr(m), d); window.alert = (m) => A.call(window, tr(m)); window.confirm = (m) => C.call(window, tr(m));

  /* bascule sans recharger */
  let dico = null;
  const chargerDico = () => dico || (dico = new Promise((ok, ko) => {
    if (charger()) return ok();
    const s = document.createElement('script'); s.src = 'i18n-en.js'; s.onload = () => (charger() ? ok() : ko(new Error('dictionnaire vide'))); s.onerror = () => { dico = null; ko(new Error('dictionnaire introuvable')); }; document.head.appendChild(s);
  }));
  window.i18nSet = async (l) => {
    if (l !== 'en' && l !== 'fr') return;
    if (l === 'en') await chargerDico();
    if (l === MODE) return;
    MODE = l; window.LANG = l; document.documentElement.lang = l;
    try { localStorage.setItem('pn-lang', l); } catch (e) {}
    if (/[?&]lang=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash);
    if (l === 'en') { tout(); titre(); } else { restaurer(); if (titreFR) { document.title = titreFR; titreFR = null; } }
    document.dispatchEvent(new CustomEvent('langue', { detail: l }));
  };
})();
