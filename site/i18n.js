/* Valelec · couche de traduction (anglais).
   Le site est écrit en français. En anglais, chaque texte affiché (et aria-label, title, placeholder, alt) est remplacé
   par sa traduction, y compris ce que le code ajoute ensuite (messages, états, QCM…).
   - Une phrase qui contient des mots en gras, en italique… est traduite d'un bloc : les balises sont notées <a>…</a>, <b>…</b>
     dans l'ordre où elles apparaissent, et la traduction les replace où il faut (avec leurs classes et attributs d'origine).
   - Les repères d'appareils (Q1, KM1, PC2…) et les nombres deviennent ⟦0⟧, ⟦1⟧… : une seule entrée couvre « Q1 armé », « D4 armé »… ;
     les nombres passent au format anglais (0,53 → 0.53 ; 2 007 → 2,007).
   - Mode « collect » (?lang=collect) : rien n'est traduit, chaque texte vu est noté dans window.__COL (préparation du dictionnaire). */
(function () {
  const MODE = window.LANG;
  const D = (window.I18N_EN && window.I18N_EN.t) || {};
  /* phrases-modèles : {n} = morceau n traduit (ou laissé tel quel, nombres au format anglais) */
  const REGLES = ((window.I18N_EN && window.I18N_EN.r) || []).map(([p, t]) => [new RegExp(p), t]);
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
    for (const [re, tpl] of REGLES) { const m = k.match(re); if (m) return tpl.replace(/\{(\d+)\}/g, (x, i) => { const g = m[+i] || ''; const t = trCle(g); if (t != null) return t; const gg = gabarit(g); return remplir(gg.k, gg.v); }); }
    for (const [fr, en] of SUFFIXES) if (k.endsWith(fr)) { const base = k.slice(0, -fr.length); return (trCle(base) ?? base) + en; }
    if (k.includes(' · ') && !k.includes('<')) { const parts = k.split(' · '), out = parts.map((p) => trCle(p) ?? p); if (out.some((o, i) => o !== parts[i])) return out.join(' · '); }
    return null;
  }
  const COL = window.__COL = window.__COL || new Set();
  const RESTE = window.__RESTE = window.__RESTE || new Set(); /* textes sans traduction (vérification) */
  function tr(s) {
    if (s == null) return s; const str = String(s), k = norm(str);
    if (!k || !LETTRES.test(k)) return str;
    if (MODE === 'collect') { COL.add(k); return str; }
    const t = trCle(k); if (t == null) { RESTE.add(k); return str; }
    return str.match(/^\s*/)[0] + t + str.match(/\s*$/)[0];
  }
  window.tr = tr;
  if (MODE !== 'en' && MODE !== 'collect') return;

  const SAUTER = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'KBD', 'TEXTAREA', 'svg']);
  const INLINE = new Set(['B', 'STRONG', 'I', 'EM', 'SPAN', 'A', 'SMALL', 'SUP', 'SUB', 'BR', 'ABBR', 'MARK', 'U', 'S', 'Q', 'DFN', 'CITE', 'TIME', 'WBR']);
  const ATTRS = ['aria-label', 'title', 'placeholder', 'alt', 'aria-description'];
  const fait = new WeakMap();
  const horsTrad = (e) => e.closest && e.closest('[translate="no"]');
  const lettre = (i) => String.fromCharCode(97 + i);
  /* un « bloc » : du texte direct mêlé à des éléments en ligne (gras, italique…) */
  function estBloc(e) {
    if (!e || e.nodeType !== 1 || SAUTER.has(e.nodeName) || e.namespaceURI !== 'http://www.w3.org/1999/xhtml') return false;
    let texteDirect = false, inline = false;
    for (const c of e.childNodes) {
      if (c.nodeType === 3) { if (c.nodeValue.trim()) texteDirect = true; }
      else if (c.nodeType === 1) { if (!INLINE.has(c.nodeName) || c.querySelector(':not(' + [...INLINE].join(',').toLowerCase() + ')')) return false; inline = true; }
    }
    return texteDirect && inline;
  }
  function ser(e, L) {
    let o = '';
    for (const c of e.childNodes) {
      if (c.nodeType === 3) o += c.nodeValue.replace(/</g, '&lt;');
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
    const L = [], s = ser(e, L), cle = norm(s); if (fait.get(e) === s) return;
    if (!LETTRES.test(cle)) { fait.set(e, s); return; }
    if (MODE === 'collect') { COL.add(cle); fait.set(e, s); return; }
    let t = null;
    if (D[cle] !== undefined) t = D[cle];
    else { const g = gabarit(cle); if (g.k !== cle && D[g.k] !== undefined) t = remplir(D[g.k], g.v); }
    if (t == null) { RESTE.add(cle); fait.set(e, s); L.forEach((x) => arbre(x)); return; }
    const debut = s.match(/^\s*/)[0], fin = s.match(/\s*$/)[0];
    e.replaceChildren(construire(debut + t + fin, L));
    fait.set(e, ser(e, []));
    L.forEach((x) => attrs(x));
  }
  function texte(n) {
    const p = n.parentNode; if (!p || SAUTER.has(p.nodeName) || horsTrad(p)) return;
    const v = n.nodeValue; if (fait.get(n) === v) return;
    const t = tr(v); if (t !== v) n.nodeValue = t; fait.set(n, n.nodeValue);
  }
  function attrs(el) {
    if (!el.getAttribute || horsTrad(el)) return;
    for (const a of ATTRS) { const v = el.getAttribute(a); if (v) { const t = tr(v); if (t !== v) el.setAttribute(a, t); } }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && el.value) { const t = tr(el.value); if (t !== el.value) el.value = t; }
  }
  /* dessins SVG : leurs textes et leurs étiquettes (aria-label, title) */
  function svg(r) { attrs(r); r.querySelectorAll('*').forEach((x) => { attrs(x); if (x.nodeName === 'text' || x.nodeName === 'tspan' || x.nodeName === 'title') x.childNodes.forEach((c) => { if (c.nodeType === 3) texte(c); }); }); }
  function arbre(r) {
    if (!r) return;
    if (r.nodeName === 'svg') return svg(r);
    if (r.nodeType === 3) { const p = r.parentElement; if (p && estBloc(p)) return bloc(p); return texte(r); }
    if (r.nodeType !== 1 || SAUTER.has(r.nodeName)) return;
    if (estBloc(r)) { attrs(r); return bloc(r); }
    attrs(r);
    const tw = document.createTreeWalker(r, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: (x) => {
      if (x.nodeType === 1) { if (x.nodeName === 'svg') { svg(x); return NodeFilter.FILTER_REJECT; } if (SAUTER.has(x.nodeName)) { attrs(x); return NodeFilter.FILTER_REJECT; } if (estBloc(x)) { attrs(x); bloc(x); return NodeFilter.FILTER_REJECT; } }
      return NodeFilter.FILTER_ACCEPT; } });
    while (tw.nextNode()) { const x = tw.currentNode; if (x.nodeType === 3) texte(x); else attrs(x); }
    /* textes des schémas SVG (<text>, <tspan>) */
    if (r.querySelectorAll) r.querySelectorAll('svg text, svg title').forEach((x) => { if (!x.querySelector('tspan')) x.childNodes.forEach((c) => { if (c.nodeType === 3) texte(c); }); else x.querySelectorAll('tspan').forEach((ts) => ts.childNodes.forEach((c) => { if (c.nodeType === 3) texte(c); })); });
    if (r.nodeName === 'text' || r.nodeName === 'tspan') r.childNodes.forEach((c) => { if (c.nodeType === 3) texte(c); });
  }
  /* un changement à l'intérieur d'un bloc retraduit le bloc entier */
  const blocDe = (n) => { let e = n.nodeType === 1 ? n : n.parentElement; for (let i = 0; e && i < 4; i++, e = e.parentElement) { if (estBloc(e)) return e; if (!INLINE.has(e.nodeName)) break; } return null; };
  const mo = new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.type === 'attributes') { attrs(m.target); continue; }
      const b = blocDe(m.target);
      if (b) { bloc(b); continue; }
      if (m.type === 'childList') m.addedNodes.forEach(arbre);
      else if (m.type === 'characterData') { const p = m.target.parentNode; if (p && (p.nodeName === 'text' || p.nodeName === 'tspan')) texte(m.target); else arbre(m.target); }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  const tout = () => arbre(document.documentElement);
  if (document.body) tout();
  document.addEventListener('DOMContentLoaded', tout);
  const titre = () => { const t = tr(document.title); if (t !== document.title) document.title = t; };
  document.addEventListener('DOMContentLoaded', () => { const el = document.querySelector('title'); if (el) new MutationObserver(titre).observe(el, { childList: true, characterData: true, subtree: true }); titre(); });
  const P = window.prompt, A = window.alert, C = window.confirm;
  window.prompt = (m, d) => P.call(window, tr(m), d); window.alert = (m) => A.call(window, tr(m)); window.confirm = (m) => C.call(window, tr(m));
})();
