/* Code de la route · dessin des situations (SVG original, aucune image externe).
   SCENE.render(spec) renvoie le code SVG d'une scène 640 × 400 :
   - { sign: 'AB4' }                       panneau seul, en gros plan
   - { drv: {...} }                        vue du conducteur (voir drv())
   - { top: {...} }                        carrefour vu du dessus (voir top())
   - { dash: ['route', ...] }              voyants du tableau de bord
   - { card: 'P' }                         illustration de thème (sans situation)
*/
(function () {
  'use strict';
  const K = '#151515', RED = '#D52B1E', BLUE = '#1B4FB8', YEL = '#F7C600', W = '#fff';

  /* ---------- Panneaux : dessinés dans un carré de 100, centrés sur 0,0 ---------- */
  const tri = (inner) => `<path d="M0-48 L50 38 Q52 42 47 42 L-47 42 Q-52 42 -50 38 Z" fill="${RED}" stroke="#7a1410" stroke-width="1"/><path d="M0-30 L36 32 L-36 32 Z" fill="${W}"/>${inner}`;
  const circ = (inner, bg) => `<circle r="50" fill="${RED}"/><circle r="39" fill="${bg || W}"/>${inner}`;
  const blue = (inner) => `<circle r="50" fill="${W}"/><circle r="47" fill="${BLUE}"/>${inner}`;
  const sq = (inner, bg) => `<rect x="-48" y="-48" width="96" height="96" rx="9" fill="${W}" stroke="#999" stroke-width="1"/><rect x="-44" y="-44" width="88" height="88" rx="6" fill="${bg || BLUE}"/>${inner}`;
  const bar = (c) => `<path d="M-28 28 L28 -28" stroke="${c || RED}" stroke-width="9" stroke-linecap="butt"/>`;
  const walker = (s, c) => `<g transform="scale(${s || 1})" fill="${c || K}" stroke="${c || K}" stroke-linecap="round"><circle cx="2" cy="-14" r="4.5" stroke="none"/><path d="M1-8 L-2 6 M-1-4 L-9 2 M0-5 L8 0 M-2 6 L-9 18 M-2 6 L6 17" stroke-width="4.6" fill="none"/></g>`;
  const bike = (c) => `<g fill="none" stroke="${c || K}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="-14" cy="12" r="9"/><circle cx="14" cy="12" r="9"/><path d="M-14 12 L-4 -4 L10 -4 L14 12 M-4 -4 L2 12 L10 -4 M-7 -9 L-1 -9 M10 -4 L8 -11 L13 -11"/></g>`;
  const carFront = (c, x) => `<g transform="translate(${x} 0)"><rect x="-12" y="-11" width="24" height="12" rx="4" fill="${c}"/><rect x="-15" y="-2" width="30" height="14" rx="4" fill="${c}"/><rect x="-13" y="11" width="6" height="6" rx="1.5" fill="${c}"/><rect x="7" y="11" width="6" height="6" rx="1.5" fill="${c}"/><rect x="-9" y="-8" width="18" height="6" rx="2" fill="${W}" opacity=".85"/></g>`;
  const arrow = (d, c, w) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w || 10}" stroke-linejoin="round"/>`;
  const head = (x, y, ang, c, s) => `<path d="M0 -${s || 12} L${s || 12} 0 L0 ${s || 12} Z" fill="${c}" transform="translate(${x} ${y}) rotate(${ang})"/>`;
  const num = (n, c, fs) => `<text y="${(fs || 40) * 0.36}" text-anchor="middle" font-family="Arial Narrow,Arial,Helvetica,sans-serif" font-weight="700" font-size="${fs || 40}" fill="${c || K}" letter-spacing="-1">${n}</text>`;
  const stripes = (c) => `<g stroke="${c || K}" stroke-width="2.4"><path d="M-30 18 L18 -30 M-26 26 L26 -26 M-18 30 L30 -18"/></g>`;

  const SIGNS = {
    A1a: () => tri(`<path d="M-8 30 L-8 6 Q-8 -10 10 -14" fill="none" stroke="${K}" stroke-width="7"/>`),
    A1b: () => tri(`<path d="M8 30 L8 6 Q8 -10 -10 -14" fill="none" stroke="${K}" stroke-width="7"/>`),
    A1c: () => tri(`<path d="M-6 30 L-6 20 Q-6 10 4 6 Q12 2 6 -8 Q2 -14 -6 -16" fill="none" stroke="${K}" stroke-width="6.5"/>`),
    A2b: () => tri(`<path d="M-26 30 Q0 2 26 30 Z" fill="${K}"/>`),
    A3: () => tri(`<path d="M-14 30 L-14 14 L-6 -2 L-6 -18 M14 30 L14 14 L6 -2 L6 -18" fill="none" stroke="${K}" stroke-width="5.5"/>`),
    A4: () => tri(`<g transform="translate(0 -2)"><rect x="-12" y="-14" width="24" height="12" rx="3" fill="${K}"/><rect x="-16" y="-6" width="32" height="9" rx="3" fill="${K}"/><circle cx="-9" cy="4" r="3.5" fill="${K}"/><circle cx="9" cy="4" r="3.5" fill="${K}"/><path d="M-10 10 q-6 6 0 12 t0 10 M10 10 q6 6 0 12 t0 10" fill="none" stroke="${K}" stroke-width="2.6"/></g>`),
    A8: () => tri(`<path d="M-24 28 L24 28 L24 4 Z" fill="${K}"/><text x="-6" y="0" text-anchor="middle" font-family="Arial" font-weight="700" font-size="14" fill="${K}">10%</text>`),
    A13a: () => tri(`<g transform="translate(-8 10)">${walker(1)}</g><g transform="translate(10 14) scale(.8)">${walker(1)}</g>`),
    A13b: () => tri(`<g transform="translate(0 10)">${walker(1.15)}</g><path d="M-18 30 h36" stroke="${K}" stroke-width="3" stroke-dasharray="5 3"/>`),
    A14: () => tri(`<rect x="-4.5" y="-14" width="9" height="30" rx="3" fill="${K}"/><circle cy="25" r="5" fill="${K}"/>`),
    A17: () => tri(`<rect x="-9" y="-16" width="18" height="46" rx="5" fill="${K}"/><circle cy="-7" r="5.5" fill="${RED}"/><circle cy="7" r="5.5" fill="#F39200"/><circle cy="21" r="5.5" fill="#1E9E4A"/>`),
    A18: () => tri(`${arrow('M-8 30 L-8 -6', K, 6)}${head(-8, -10, -90, K, 8)}${arrow('M8 -12 L8 22', K, 6)}${head(8, 26, 90, K, 8)}`),
    A21: () => tri(`<g transform="translate(0 12) scale(.9)">${bike()}</g>`),
    AB1: () => tri(`<path d="M-15 -6 L15 30 M15 -6 L-15 30" stroke="${K}" stroke-width="8"/>`),
    AB2: () => tri(`<path d="M0 -14 L0 32" stroke="${K}" stroke-width="10"/><path d="M-22 12 L22 12" stroke="${K}" stroke-width="5"/>`),
    AB3a: () => `<path d="M-50 -40 L50 -40 L0 46 Z" fill="${RED}" stroke="#7a1410" stroke-width="1" stroke-linejoin="round"/><path d="M-33 -30 L33 -30 L0 28 Z" fill="${W}"/>`,
    AB4: () => `<path d="M-20.7 -50 L20.7 -50 L50 -20.7 L50 20.7 L20.7 50 L-20.7 50 L-50 20.7 L-50 -20.7 Z" fill="${W}"/><path d="M-18.6 -45 L18.6 -45 L45 -18.6 L45 18.6 L18.6 45 L-18.6 45 L-45 18.6 L-45 -18.6 Z" fill="${RED}"/><text y="10" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="29" fill="${W}">STOP</text>`,
    AB6: () => `<g transform="rotate(45)"><rect x="-36" y="-36" width="72" height="72" fill="${W}" stroke="#777" stroke-width="1.2"/><rect x="-24" y="-24" width="48" height="48" fill="${YEL}"/></g>`,
    AB7: () => `<g transform="rotate(45)"><rect x="-36" y="-36" width="72" height="72" fill="${W}" stroke="#777" stroke-width="1.2"/><rect x="-24" y="-24" width="48" height="48" fill="${YEL}"/></g><g stroke="${K}" stroke-width="5"><path d="M-30 14 L14 -30 M-20 22 L22 -20 M-14 30 L30 -14"/></g>`,
    AB25: () => tri(`<g transform="translate(0 10)" fill="none" stroke="${K}" stroke-width="4.5"><path d="M-12 -7 A14 14 0 0 1 12 -7"/><path d="M14 4 A14 14 0 0 1 2 14"/><path d="M-6 13 A14 14 0 0 1 -14 -1"/></g><g transform="translate(0 10)">${head(13, -6, 60, K, 5)}${head(0, 14, 180, K, 5)}${head(-13, -3, -60, K, 5)}</g>`),
    B0: () => circ(''),
    B1: () => `<circle r="50" fill="${RED}"/><rect x="-32" y="-9" width="64" height="18" fill="${W}"/>`,
    B2a: () => circ(`${arrow('M8 30 L8 0 Q8 -12 -6 -12 L-14 -12', K, 9)}${head(-18, -12, 180, K, 11)}${bar()}`),
    B2b: () => circ(`${arrow('M-8 30 L-8 0 Q-8 -12 6 -12 L14 -12', K, 9)}${head(18, -12, 0, K, 11)}${bar()}`),
    B2c: () => circ(`${arrow('M12 30 L12 -4 Q12 -20 -2 -20 Q-14 -20 -14 -6 L-14 6', K, 8)}${head(-14, 10, 90, K, 10)}${bar()}`),
    B3: () => circ(`${carFront(RED, -14)}${carFront(K, 14)}`),
    B6a1: () => `<circle r="50" fill="${RED}"/><circle r="40" fill="${BLUE}"/><path d="M-28 -28 L28 28" stroke="${RED}" stroke-width="10"/>`,
    B6d: () => `<circle r="50" fill="${RED}"/><circle r="40" fill="${BLUE}"/><path d="M-28 -28 L28 28 M28 -28 L-28 28" stroke="${RED}" stroke-width="10"/>`,
    B12: () => circ(`${num('3,5m', K, 23)}${head(0, -22, 90, K, 7)}${head(0, 23, -90, K, 7)}`),
    B21_1: () => blue(`${arrow('M-8 30 L-8 2 Q-8 -10 6 -10 L12 -10', W, 10)}${head(16, -10, 0, W, 13)}`),
    B21_2: () => blue(`${arrow('M8 30 L8 2 Q8 -10 -6 -10 L-12 -10', W, 10)}${head(-16, -10, 180, W, 13)}`),
    B21a1: () => blue(`${arrow('M-16 -16 L10 10', W, 10)}${head(14, 14, 45, W, 13)}`),
    B22a: () => blue(`<g transform="translate(0 2) scale(1.15)">${bike(W)}</g>`),
    B25: (v) => blue(num(v || 30, W, 40)),
    B31: () => `<circle r="50" fill="${W}" stroke="#888" stroke-width="1.5"/>${stripes('#333')}`,
    B33: (v) => `<circle r="50" fill="${W}" stroke="#888" stroke-width="1.5"/>${num(v || 70, '#8a8a8a', 40)}${stripes('#333')}`,
    B14: (v) => circ(num(v || 50, K, String(v || 50).length > 2 ? 34 : 42)),
    C1a: () => sq(`<text y="25" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="70" fill="${W}">P</text>`),
    C12: () => sq(`${arrow('M0 36 L0 -14', W, 14)}${head(0, -22, -90, W, 18)}`),
    C13a: () => sq(`<rect x="-8" y="-12" width="16" height="48" fill="${W}"/><rect x="-26" y="-30" width="52" height="16" fill="${RED}"/>`),
    C20a: () => sq(`<path d="M0 -34 L34 30 L-34 30 Z" fill="${W}"/><g transform="translate(0 10)">${walker(1)}</g><path d="M-18 26 h36" stroke="${K}" stroke-width="3" stroke-dasharray="5 3"/>`),
    C107: () => sq(`<g transform="scale(1.7)">${carFront(W, 0)}</g>`),
    C108: () => sq(`<g transform="scale(1.7)">${carFront(W, 0)}</g><path d="M-34 34 L34 -34" stroke="${RED}" stroke-width="8"/>`),
    C207: () => sq(`<path d="M-30 40 L-6 -6 M30 40 L6 -6" stroke="${W}" stroke-width="7"/><path d="M0 40 L0 30 M0 20 L0 10 M0 2 L0 -4" stroke="${W}" stroke-width="3"/><path d="M-36 -12 Q0 -30 36 -12" fill="none" stroke="${W}" stroke-width="7"/><path d="M-30 -14 v-10 M30 -14 v-10" stroke="${W}" stroke-width="5"/>`),
    C208: () => SIGNS.C207() + `<path d="M-38 38 L38 -38" stroke="${RED}" stroke-width="8"/>`,
    EB10: (v) => `<rect x="-62" y="-30" width="124" height="60" rx="4" fill="${W}" stroke="${RED}" stroke-width="7"/><text y="8" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="17" fill="${K}">${v || 'VILLEBRUNE'}</text>`,
    EB20: (v) => SIGNS.EB10(v) + `<path d="M-56 24 L56 -24" stroke="${RED}" stroke-width="7"/>`,
    B30: () => `<rect x="-46" y="-56" width="92" height="112" rx="5" fill="${W}" stroke="#888" stroke-width="1.5"/><text y="-30" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="22" fill="${K}">ZONE</text><g transform="translate(0 16) scale(.62)">${circ(num(30, K, 42))}</g>`,
    B52: () => `<rect x="-46" y="-56" width="92" height="112" rx="5" fill="${W}" stroke="#888" stroke-width="1.5"/><text y="-30" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="14" fill="${K}">ZONE DE</text><text y="-14" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="14" fill="${K}">RENCONTRE</text><g transform="translate(0 22) scale(.5)">${circ(num(20, K, 42))}</g>`,
  };
  /* panneau : code « B14:70 » → B14 avec la valeur 70 */
  function sign(code, x, y, s) {
    const [c, v] = String(code).split(':');
    const f = SIGNS[c];
    if (!f) return '';
    return `<g transform="translate(${x} ${y}) scale(${s})">${f(v)}</g>`;
  }

  /* ---------- Outils ---------- */
  function rng(seed) {
    let h = 2166136261;
    for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const poly = (pts, fill, extra) => `<path d="M${pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L')} Z" fill="${fill}" ${extra || ''}/>`;

  /* ---------- Vue du conducteur ----------
     o.env   : 'ville' | 'campagne' | 'autoroute' | 'voie-rapide'
     o.w     : 'sec' | 'pluie' | 'brouillard' | 'nuit' | 'neige'
     o.line  : 'disc' | 'cont' | 'mixte-disc' (pointillés de mon côté) | 'mixte-cont' | 'none'
     o.curve : -1 (gauche) … 1 (droite)
     o.s     : panneaux côté droit, ex. ['B14:50', 'AB4']  ·  o.sl : côté gauche
     o.light : 'R' | 'O' | 'V' | 'Oc'  (feu tricolore à droite)
     o.veh   : véhicule devant ('voiture' | 'camion' | 'bus' | 'velo' | 'moto' | 'tracteur')
     o.opp   : véhicule en face ('voiture' | 'camion')
     o.ped   : piéton (1 = sur le passage, 'bord' = au bord)
     o.zebra, o.stopline, o.inter (carrefour), o.speed (compteur), o.kids, o.ball
  */
  function drv(o) {
    const R = rng(JSON.stringify(o));
    const env = o.env || 'campagne', w = o.w || 'sec';
    const night = w === 'nuit';
    const HZ = 168, H = 400, BOT = 340; /* le capot couvre le bas */
    const cv = o.curve || 0;
    const cx = (s) => 320 + cv * 150 * (1 - s) * (1 - s);           /* centre de fuite selon la profondeur */
    const P = (xb, s) => [cx(s) + (xb - 320) * s, HZ + (H - HZ) * s];  /* xb = abscisse au bas de l'image */
    const sky = { sec: ['#7DB9EA', '#D9ECF8'], pluie: ['#7E8A96', '#BAC3CC'], brouillard: ['#C9CED2', '#D9DDE0'], nuit: ['#050B1C', '#17254A'], neige: ['#B9C4CE', '#E1E6EA'] }[w] || ['#7DB9EA', '#D9ECF8'];
    const ground = night ? '#0E1A10' : w === 'neige' ? '#E9EEF2' : env === 'ville' ? '#9A9A94' : '#7DAA55';
    const asph = night ? '#1B1D22' : w === 'pluie' ? '#4A4F57' : w === 'neige' ? '#7A7F86' : '#5E636B';
    const mark = night ? '#C9C9C0' : '#F4F4EE';
    let g = `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`;
    g += `<rect width="640" height="400" fill="url(#sk)"/>`;
    if (!night && (w === 'sec')) g += `<circle cx="${90 + R() * 80}" cy="${40 + R() * 20}" r="22" fill="#FFF6C9" opacity=".9"/>`;
    if (night) for (let i = 0; i < 26; i++) g += `<circle cx="${R() * 640}" cy="${R() * 140}" r="${R() * 1.2 + .3}" fill="#fff" opacity="${.4 + R() * .5}"/>`;
    /* horizon : collines ou immeubles */
    if (env === 'ville') {
      for (const side of [-1, 1]) {
        let x = side < 0 ? 0 : 640;
        while (side < 0 ? x < 250 : x > 390) {
          const bw = 40 + R() * 55, bh = 40 + R() * 110, col = night ? '#141a2a' : ['#C9B79C', '#B9A88E', '#D6C6AE', '#A9B2B8', '#C4A28A'][Math.floor(R() * 5)];
          const x0 = side < 0 ? x : x - bw;
          g += `<rect x="${x0}" y="${HZ - bh + 30}" width="${bw}" height="${bh}" fill="${col}"/>`;
          for (let wy = HZ - bh + 40; wy < HZ + 18; wy += 18) for (let wx = x0 + 6; wx < x0 + bw - 10; wx += 14) g += `<rect x="${wx}" y="${wy}" width="7" height="9" fill="${night ? (R() > .6 ? '#F6D27A' : '#22293b') : '#7F95A6'}" opacity=".85"/>`;
          x -= side * bw;
        }
      }
    } else {
      g += `<path d="M0 ${HZ} Q120 ${HZ - 38} 240 ${HZ - 8} T480 ${HZ - 16} T640 ${HZ - 4} L640 ${HZ + 2} L0 ${HZ + 2} Z" fill="${night ? '#0A140C' : w === 'neige' ? '#D3DCE3' : '#6B9A4A'}" opacity=".9"/>`;
    }
    g += `<rect y="${HZ}" width="640" height="${H - HZ}" fill="${ground}"/>`;
    /* chaussée : voie de gauche (sens inverse ou 2e voie), ma voie, éventuellement bande d'arrêt d'urgence */
    const fast = env === 'autoroute' || env === 'voie-rapide';
    const L = fast ? -560 : -500, M = 40, Rr = 600, E = fast ? 820 : 640;
    const steps = 40, edge = (xb) => { const a = []; for (let i = 0; i <= steps; i++) a.push(P(xb, i / steps)); return a; };
    const left = edge(env === 'ville' ? L - 80 : L), right = edge(E);
    g += poly([...left, ...right.reverse()], asph);
    if (env === 'ville') {
      g += poly([...edge(L - 80), ...edge(L - 260).reverse()], night ? '#2a2c31' : '#B8B5AD');
      g += poly([...edge(E), ...edge(E + 220).reverse()], night ? '#2a2c31' : '#B8B5AD');
      g += poly([...edge(E), ...edge(E + 14).reverse()], night ? '#555' : '#E8E6E0');
    }
    /* carrefour : une route coupe la mienne */
    if (o.inter) {
      const a = P(-900, .36), b = P(1600, .36), c = P(1600, .46), d = P(-900, .46);
      g += poly([a, b, c, d], asph);
    }
    /* marquage : bande pleine ou pointillés, dessinée en profondeur */
    const strip = (xb, w2, s0, s1, col) => poly([P(xb - w2, s0), P(xb + w2, s0), P(xb + w2, s1), P(xb - w2, s1)], col || mark);
    const dashed = (xb, w2, col) => { for (let k = 0; k < 40; k++) { const z0 = 1 + k * 1.1, s0 = 1 / z0, s1 = 1 / (z0 + 0.45); if (s0 < 0.04) break; if (o.inter && s0 > .36 && s1 < .46) continue; g += strip(xb, w2, s1, s0, col); } };
    const solid = (xb, w2, col) => { if (o.inter) { g += strip(xb, w2, .46, 1, col); g += strip(xb, w2, 0.02, .36, col); } else g += strip(xb, w2, 0.02, 1, col); };
    const ln = o.line || (env === 'ville' ? 'disc' : env === 'autoroute' ? 'disc' : 'disc');
    if (ln === 'disc') dashed(M, 7);
    else if (ln === 'cont') solid(M, 7);
    else if (ln === 'mixte-disc') { dashed(M + 9, 5); solid(M - 9, 5); }
    else if (ln === 'mixte-cont') { solid(M + 9, 5); dashed(M - 9, 5); }
    if (env !== 'ville') { solid(Rr + (fast ? 10 : 0), fast ? 9 : 5); }
    if (fast) {
      /* glissière centrale à gauche */
      g += poly([...edge(L - 20), ...edge(L).reverse()], '#8E9399');
      for (let i = 1; i < 12; i++) { const s = 1 / (1 + i * .9); const p = P(L - 10, s); g += `<rect x="${p[0] - 1.5 * s}" y="${p[1] - 22 * s}" width="${3 * s + .5}" height="${22 * s}" fill="#666"/>`; }
      g += poly([P(L - 12, .02), P(L - 12, 1), P(L - 12, 1).map((v, i) => v - (i ? 26 : 0)), P(L - 12, .02).map((v, i) => v - (i ? 1 : 0))], '#B7BDC4');
      /* balises de bord tous les 50 m */
      for (let i = 1; i < 10; i++) { const s = 1 / (1 + i * 1.6); const p = P(E + 60, s); g += `<rect x="${p[0] - 3 * s}" y="${p[1] - 50 * s}" width="${8 * s + 1}" height="${50 * s}" fill="#fff" stroke="#333" stroke-width=".5"/><rect x="${p[0] - 3 * s}" y="${p[1] - 44 * s}" width="${8 * s + 1}" height="${7 * s}" fill="#111"/>`; }
    }
    if (o.zebra) for (let i = 0; i < 9; i++) { const xb = L + 70 + i * ((E - L - 140) / 8); g += poly([P(xb - 32, .40), P(xb + 32, .40), P(xb + 32, .47), P(xb - 32, .47)], mark); }
    if (o.stopline) g += poly([P(M + 10, .5), P(Rr - 10, .5), P(Rr - 10, .53), P(M + 10, .53)], mark);
    if (o.cedline) for (let i = 0; i < 9; i++) { const xb = M + 30 + i * 62; g += poly([P(xb, .5), P(xb + 34, .5), P(xb + 34, .52), P(xb, .52)], mark); }
    if (o.bus) { g += poly([P(Rr - 160, .02), P(Rr, .02), P(Rr, 1), P(Rr - 160, 1)], '#7a5b4a', 'opacity=".55"'); g += `<text x="${P(Rr - 80, .7)[0]}" y="${P(0, .7)[1]}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="26" fill="#fff" transform="scale(1 .6) translate(0 ${P(0, .7)[1] * .66})">BUS</text>`; }
    /* bas-côté : arbres en campagne */
    if (env === 'campagne' && !night) for (let i = 1; i < 9; i++) { const s = 1 / (1 + i * 1.1); for (const xb of [L - 300 - R() * 200, E + 260 + R() * 300]) { const p = P(xb, s); g += `<rect x="${p[0] - 4 * s}" y="${p[1] - 60 * s}" width="${8 * s}" height="${60 * s}" fill="#6B4B2E"/><circle cx="${p[0]}" cy="${p[1] - 80 * s}" r="${40 * s}" fill="${w === 'neige' ? '#E4EAEE' : '#3F7A35'}"/>`; } }
    /* usagers */
    const objs = [];
    if (o.veh) objs.push({ s: o.vehS || .42, x: 320, k: o.veh, back: true });
    if (o.opp) objs.push({ s: o.oppS || .3, x: L / 2 + M / 2 - 30, k: o.opp, back: false });
    if (o.veh2) objs.push({ s: .32, x: L / 2 + M / 2, k: o.veh2, back: true });
    if (o.ped) objs.push({ s: .43, x: o.ped === 'bord' ? E + 60 : 380, k: 'ped' });
    if (o.kids) objs.push({ s: .5, x: E + 90, k: 'kid' }, { s: .52, x: E + 160, k: 'kid' });
    if (o.ball) objs.push({ s: .55, x: 380, k: 'ball' });
    if (o.anim) objs.push({ s: .45, x: 260, k: 'cerf' });
    objs.sort((a, b) => a.s - b.s);
    for (const ob of objs) g += user(ob, P, night);
    /* feu tricolore */
    if (o.light) {
      const p = P(Rr + 120, .55), s = .55;
      const col = { R: [RED, '#3a1512', '#13301c'], O: ['#3a1512', '#F39200', '#13301c'], Oc: ['#3a1512', '#F39200', '#13301c'], V: ['#3a1512', '#3a2a10', '#22C55E'] }[o.light];
      g += `<rect x="${p[0] - 3}" y="${p[1] - 230 * s}" width="6" height="${230 * s}" fill="#444"/><rect x="${p[0] - 22}" y="${p[1] - 330 * s}" width="44" height="118" rx="8" fill="#1d1d1d" stroke="#000"/>`;
      col.forEach((c, i) => { g += `<circle cx="${p[0]}" cy="${p[1] - 330 * s + 20 + i * 38}" r="14" fill="${c}"/>`; if (c === RED || c === '#F39200' || c === '#22C55E') g += `<circle cx="${p[0]}" cy="${p[1] - 330 * s + 20 + i * 38}" r="22" fill="${c}" opacity=".25"/>`; });
    }
    /* panneaux */
    const post = (list, xb, s0, sideLeft) => {
      if (!list || !list.length) return;
      const p = P(xb, s0), sz = 1.0, top = p[1] - 160 - (list.length - 1) * 96;
      g += `<rect x="${p[0] - 3}" y="${top}" width="6" height="${p[1] - top}" fill="#8b8f95"/>`;
      list.forEach((c, i) => { g += sign(c, p[0], top + 10 + i * 96, sz * .9); });
    };
    { const s0 = fast ? .42 : o.inter ? .5 : .6, tx = fast ? 590 : 560; post(o.s, 320 + (tx - 320) / s0, s0); }
    post(o.sl, L - 200, .55, true);
    /* météo */
    if (w === 'pluie') { let d = ''; for (let i = 0; i < 160; i++) { const x = R() * 660, y = R() * 400; d += `M${x.toFixed(0)} ${y.toFixed(0)} l-4 14 `; } g += `<path d="${d}" stroke="#E3ECF5" stroke-width="1.2" opacity=".6"/>`; }
    if (w === 'neige') for (let i = 0; i < 140; i++) g += `<circle cx="${R() * 640}" cy="${R() * 400}" r="${R() * 2 + .8}" fill="#fff" opacity=".9"/>`;
    if (w === 'brouillard') g += `<rect width="640" height="400" fill="#E3E6E8" opacity=".55"/><rect width="640" height="${HZ + 70}" fill="#E8EBED" opacity=".55"/>`;
    /* capot et compteur */
    g += `<path d="M-10 400 L-10 ${BOT + 18} Q320 ${BOT - 24} 650 ${BOT + 18} L650 400 Z" fill="${night ? '#05070b' : '#1F2733'}"/>`;
    if (o.speed != null) g += `<g transform="translate(320 ${BOT + 30})"><rect x="-62" y="-22" width="124" height="44" rx="12" fill="#0b0f15" stroke="#3a4656"/><text x="-6" y="11" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="30" fill="#E8F1FF">${o.speed}</text><text x="2" y="10" font-family="Arial,Helvetica,sans-serif" font-size="14" fill="#9fb0c5">km/h</text></g>`;
    return g;
  }

  function user(ob, P, night) {
    const p = P(ob.x, ob.s), s = ob.s * 1.7;
    const t = (inner) => `<g transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${s.toFixed(3)})">${inner}</g>`;
    const wheels = (w) => `<rect x="${-w / 2}" y="-14" width="22" height="16" rx="4" fill="#111"/><rect x="${w / 2 - 22}" y="-14" width="22" height="16" rx="4" fill="#111"/>`;
    switch (ob.k) {
      case 'voiture': return t(`${wheels(150)}<path d="M-78 -16 L-78 -60 Q-76 -74 -60 -78 L-46 -112 Q-42 -120 -30 -120 L30 -120 Q42 -120 46 -112 L60 -78 Q76 -74 78 -60 L78 -16 Z" fill="${ob.back ? '#B4222B' : '#2B5DA8'}"/><path d="M-38 -110 L38 -110 L50 -80 L-50 -80 Z" fill="${night ? '#111' : '#9CC1D9'}"/>${ob.back ? `<rect x="-72" y="-62" width="28" height="12" rx="3" fill="${night ? '#FF3B30' : '#F25A4F'}"/><rect x="44" y="-62" width="28" height="12" rx="3" fill="${night ? '#FF3B30' : '#F25A4F'}"/><rect x="-22" y="-40" width="44" height="12" fill="#eee"/>` : `<rect x="-72" y="-62" width="28" height="12" rx="3" fill="#FFF7D0"/><rect x="44" y="-62" width="28" height="12" rx="3" fill="#FFF7D0"/>${night ? '<circle cx="-58" cy="-56" r="30" fill="#FFF6C9" opacity=".35"/><circle cx="58" cy="-56" r="30" fill="#FFF6C9" opacity=".35"/>' : ''}`}`);
      case 'camion': return t(`${wheels(170)}<rect x="-88" y="-210" width="176" height="196" rx="4" fill="${ob.back ? '#E4E1D8' : '#D9822B'}" stroke="#777"/>${ob.back ? `<path d="M0 -205 V-20" stroke="#999" stroke-width="3"/><rect x="-80" y="-36" width="22" height="12" fill="#F25A4F"/><rect x="58" y="-36" width="22" height="12" fill="#F25A4F"/>` : `<rect x="-70" y="-190" width="140" height="60" fill="#9CC1D9"/><rect x="-80" y="-50" width="26" height="14" fill="#FFF7D0"/><rect x="54" y="-50" width="26" height="14" fill="#FFF7D0"/>`}`);
      case 'bus': return t(`${wheels(170)}<rect x="-90" y="-200" width="180" height="186" rx="14" fill="#2E8B57"/><rect x="-78" y="-186" width="156" height="70" rx="6" fill="#9CC1D9"/><rect x="-80" y="-40" width="24" height="12" fill="#F25A4F"/><rect x="56" y="-40" width="24" height="12" fill="#F25A4F"/><rect x="-40" y="-104" width="80" height="20" fill="#111"/><text y="-89" text-anchor="middle" font-family="Arial" font-size="16" fill="#FFB800">LIGNE 4</text>`);
      case 'tracteur': return t(`<circle cx="-56" cy="-34" r="34" fill="#111"/><circle cx="56" cy="-34" r="34" fill="#111"/><rect x="-46" y="-130" width="92" height="100" rx="6" fill="#2F8F3A"/><rect x="-36" y="-122" width="72" height="44" fill="#9CC1D9"/><rect x="-20" y="-30" width="40" height="18" fill="#F39200"/>`);
      case 'velo': case 'moto': return t(`<g transform="translate(${ob.k === 'velo' ? 150 : 0} 0)"><rect x="-6" y="-46" width="12" height="44" rx="4" fill="#111"/><path d="M-16 -98 L16 -98 L22 -48 L-22 -48 Z" fill="${ob.k === 'velo' ? '#F2A900' : '#333'}"/><circle cy="-112" r="14" fill="${ob.k === 'velo' ? '#2D2D2D' : '#D52B1E'}"/><path d="M-22 -80 L-34 -64 M22 -80 L34 -64" stroke="#333" stroke-width="7"/><rect x="-4" y="-30" width="8" height="8" fill="#F25A4F"/></g>`);
      case 'ped': return t(`<g transform="scale(2.2) translate(0 -26)">${walker(1.4, night ? '#ddd' : '#1d2a44')}</g>`);
      case 'kid': return t(`<g transform="scale(1.5) translate(0 -26)">${walker(1.4, '#B83280')}</g>`);
      case 'ball': return t(`<circle cy="-18" r="18" fill="#E53935"/><path d="M-18 -18 h36" stroke="#fff" stroke-width="4"/>`);
      case 'cerf': return t(`<path d="M-60 -60 L40 -60 L52 -90 L64 -96 L60 -80 L50 -56 L44 -10 L34 -10 L30 -40 L-40 -40 L-46 -10 L-56 -10 Z" fill="#7a4a24"/><path d="M56 -96 L48 -120 M56 -96 L70 -118 M50 -110 L40 -116" stroke="#5a3418" stroke-width="4"/>`);
    }
    return '';
  }

  /* ---------- Carrefour vu du dessus ----------
     o.sig : { S, W, E, N } régime de chaque arrivée : 'AB4' | 'AB3a' | 'AB2' | 'AB6' | 'AB1' | 'R' | 'V' | null
     o.cars : [{ at: 'W'|'E'|'N', col: '#…', name }]   o.go : 'droit' | 'gauche' | 'droite'
  */
  function top(o) {
    let g = `<rect width="640" height="400" fill="#7FAF5A"/>`;
    const C = [320, 200], h = 62;
    g += `<rect x="0" y="${C[1] - h}" width="640" height="${2 * h}" fill="#5E636B"/><rect x="${C[0] - h}" y="0" width="${2 * h}" height="400" fill="#5E636B"/>`;
    /* trottoirs aux coins */
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g += `<path d="M${C[0] + sx * h} ${sy < 0 ? 0 : 400} L${C[0] + sx * h} ${C[1] + sy * (h + 14)} Q${C[0] + sx * h} ${C[1] + sy * h} ${C[0] + sx * (h + 14)} ${C[1] + sy * h} L${sx < 0 ? 0 : 640} ${C[1] + sy * h}" fill="none" stroke="#C9C6BD" stroke-width="6"/>`;
    const dash = 'stroke="#F4F4EE" stroke-width="4" stroke-dasharray="18 14"';
    const main = (o.main === 'EW');
    g += `<path d="M0 ${C[1]} H${C[0] - h - 4} M${C[0] + h + 4} ${C[1]} H640" ${main ? 'stroke="#F4F4EE" stroke-width="4"' : dash}/>`;
    g += `<path d="M${C[0]} 0 V${C[1] - h - 4} M${C[0]} ${C[1] + h + 4} V400" ${dash}/>`;
    /* lignes d'arrêt ou de cédez-le-passage selon le régime */
    const SL = { S: [C[0] + 2, C[1] + h + 2, C[0] + h - 2, C[1] + h + 2], N: [C[0] - h + 2, C[1] - h - 2, C[0] - 2, C[1] - h - 2], W: [C[0] - h - 2, C[1] + 2, C[0] - h - 2, C[1] + h - 2], E: [C[0] + h + 2, C[1] - h + 2, C[0] + h + 2, C[1] - 2] };
    const SP = { S: [C[0] + h + 30, C[1] + h + 34], N: [C[0] - h - 30, C[1] - h - 34], W: [C[0] - h - 34, C[1] + h + 30], E: [C[0] + h + 34, C[1] - h - 30] };
    for (const k of ['S', 'N', 'W', 'E']) {
      const r = (o.sig || {})[k];
      if (!r) continue;
      const l = SL[k];
      if (r === 'AB4' || r === 'R') g += `<path d="M${l[0]} ${l[1]} L${l[2]} ${l[3]}" stroke="#F4F4EE" stroke-width="6"/>`;
      if (r === 'AB3a') g += `<path d="M${l[0]} ${l[1]} L${l[2]} ${l[3]}" stroke="#F4F4EE" stroke-width="5" stroke-dasharray="8 6"/>`;
      const p = SP[k];
      if (r === 'R' || r === 'V') {
        g += `<rect x="${p[0] - 10}" y="${p[1] - 26}" width="20" height="52" rx="5" fill="#1d1d1d"/>`;
        ['R', 'O', 'V'].forEach((c, i) => { g += `<circle cx="${p[0]}" cy="${p[1] - 15 + i * 15}" r="6" fill="${c === r ? (c === 'R' ? RED : '#22C55E') : '#333'}"/>`; });
      } else g += sign(r, p[0], p[1], .34);
    }
    /* voitures */
    const pos = { S: [C[0] + 31, C[1] + h + 62, 0], N: [C[0] - 31, C[1] - h - 62, 180], W: [C[0] - h - 62, C[1] + 31, 90], E: [C[0] + h + 62, C[1] - 31, 270] };
    const car = (x, y, rot, col, me) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-17" y="-32" width="34" height="64" rx="9" fill="${col}" stroke="${me ? '#fff' : 'rgba(0,0,0,.35)'}" stroke-width="${me ? 3 : 1.5}"/><rect x="-13" y="-22" width="26" height="13" rx="3" fill="#BFD7E8"/><rect x="-13" y="12" width="26" height="9" rx="3" fill="#BFD7E8"/><rect x="-15" y="-33" width="9" height="4" rx="1" fill="#FFF7C2"/><rect x="6" y="-33" width="9" height="4" rx="1" fill="#FFF7C2"/></g>`;
    for (const c of o.cars || []) { const p = pos[c.at]; g += car(p[0], p[1], p[2], c.col, false); }
    const me = pos.S;
    g += car(me[0], me[1], 0, BLUE, true);
    /* intention : flèche */
    const ar = { droit: `M${me[0]} ${me[1] - 40} V${C[1] - h - 20}`, gauche: `M${me[0]} ${me[1] - 40} V${C[1] + 10} Q${me[0]} ${C[1] - 31} ${C[0] - 20} ${C[1] - 31} H${C[0] - h - 24}`, droite: `M${me[0]} ${me[1] - 40} V${C[1] + 50} Q${me[0]} ${C[1] + 31} ${me[0] + 22} ${C[1] + 31} H${C[0] + h + 24}` }[o.go || 'droit'];
    const tip = { droit: [me[0], C[1] - h - 30, -90], gauche: [C[0] - h - 32, C[1] - 31, 180], droite: [C[0] + h + 32, C[1] + 31, 0] }[o.go || 'droit'];
    g += `<path d="${ar}" fill="none" stroke="#FFD43B" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 12" opacity=".95"/>${head(tip[0], tip[1], tip[2], '#FFD43B', 12)}`;
    g += `<text x="${me[0] + 26}" y="${me[1] + 30}" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="15" fill="#fff" stroke="#0008" stroke-width="3" paint-order="stroke">MOI</text>`;
    return g;
  }

  /* ---------- Voyants du tableau de bord ---------- */
  const DCOL = { G: '#2FD158', B: '#3B8BFF', O: '#FFA319', R: '#FF3B30' };
  const VOY = {
    croisement: ['G', `<path d="M8 -18 Q-14 -18 -14 0 Q-14 18 8 18 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M14 -12 L30 -4 M14 -2 L30 6 M14 8 L30 16" stroke="currentColor" stroke-width="4"/>`],
    route: ['B', `<path d="M8 -18 Q-14 -18 -14 0 Q-14 18 8 18 Z" fill="currentColor"/><path d="M14 -12 H32 M14 -4 H32 M14 4 H32 M14 12 H32" stroke="currentColor" stroke-width="4"/>`],
    position: ['G', `<path d="M-10 -12 Q-22 -12 -22 0 Q-22 12 -10 12 Z M10 -12 Q22 -12 22 0 Q22 12 10 12 Z" fill="currentColor"/><path d="M-14 -8 L-30 -14 M-14 8 L-30 14 M14 -8 L30 -14 M14 8 L30 14 M-15 0 H-31 M15 0 H31" stroke="currentColor" stroke-width="3"/>`],
    brouillardAV: ['G', `<path d="M4 -18 Q-18 -18 -18 0 Q-18 18 4 18 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M10 -12 L28 -4 M10 -2 L28 6 M10 8 L28 16" stroke="currentColor" stroke-width="4"/><path d="M19 -20 q-5 7 0 14 t0 14 t0 14" fill="none" stroke="currentColor" stroke-width="3"/>`],
    brouillardAR: ['O', `<path d="M-4 -18 Q18 -18 18 0 Q18 18 -4 18 Z" fill="currentColor"/><path d="M-10 -10 H-30 M-10 0 H-30 M-10 10 H-30" stroke="currentColor" stroke-width="4"/><path d="M-20 -20 q-5 7 0 14 t0 14 t0 14" fill="none" stroke="currentColor" stroke-width="3"/>`],
    huile: ['R', `<path d="M-26 4 L-8 -8 L14 -8 L30 -14 L22 6 L-20 6 Z" fill="currentColor"/><path d="M-26 4 L-30 -4" stroke="currentColor" stroke-width="4"/><path d="M33 -4 q2 6 0 9" stroke="currentColor" stroke-width="3" fill="none"/><path d="M-4 -8 V-14 M-10 -16 H2" stroke="currentColor" stroke-width="3"/>`],
    batterie: ['R', `<rect x="-26" y="-14" width="52" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="4"/><path d="M-18 -20 h10 M8 -20 h10 M-17 2 h10 M-12 -3 v10 M8 2 h10" stroke="currentColor" stroke-width="4"/>`],
    temperature: ['R', `<path d="M0 -24 V6" stroke="currentColor" stroke-width="5"/><circle cy="12" r="7" fill="currentColor"/><path d="M4 -18 h8 M4 -10 h8 M4 -2 h8" stroke="currentColor" stroke-width="3"/><path d="M-26 22 q6 -5 13 0 t13 0 t13 0 t13 0" fill="none" stroke="currentColor" stroke-width="3"/>`],
    frein: ['R', `<circle r="16" fill="none" stroke="currentColor" stroke-width="4"/><path d="M-24 -14 Q-32 0 -24 14 M24 -14 Q32 0 24 14" fill="none" stroke="currentColor" stroke-width="4"/><path d="M0 -9 V4" stroke="currentColor" stroke-width="5"/><circle cy="10" r="2.8" fill="currentColor"/>`],
    abs: ['O', `<circle r="16" fill="none" stroke="currentColor" stroke-width="4"/><path d="M-24 -14 Q-32 0 -24 14 M24 -14 Q32 0 24 14" fill="none" stroke="currentColor" stroke-width="4"/><text y="5" text-anchor="middle" font-family="Arial" font-weight="700" font-size="12" fill="currentColor">ABS</text>`],
    ceinture: ['R', `<circle cx="-2" cy="-20" r="6" fill="currentColor"/><path d="M-12 22 L-12 -4 Q-12 -10 -4 -10 L4 -10 Q10 -10 10 -2 L10 8 L-4 8" fill="none" stroke="currentColor" stroke-width="5"/><path d="M8 -12 L-14 12" stroke="currentColor" stroke-width="3.5"/>`],
    carburant: ['O', `<rect x="-16" y="-20" width="22" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="4"/><rect x="-12" y="-16" width="14" height="10" fill="currentColor"/><path d="M6 -10 L14 -4 L14 12 Q14 16 18 14 L18 -8 L12 -16" fill="none" stroke="currentColor" stroke-width="3"/>`],
    moteur: ['O', `<path d="M-24 -6 H-18 V-12 H-6 V-18 H8 V-12 H14 L20 -6 H26 V10 H20 L14 16 H-12 L-18 10 H-24 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>`],
    pneu: ['O', `<path d="M-20 -12 Q-26 0 -20 12 L-16 18 H16 L20 12 Q26 0 20 -12" fill="none" stroke="currentColor" stroke-width="4"/><path d="M-20 22 h4 M-10 22 h4 M0 22 h4 M10 22 h4" stroke="currentColor" stroke-width="3"/><path d="M0 -8 V4" stroke="currentColor" stroke-width="4.5"/><circle cy="10" r="2.6" fill="currentColor"/>`],
    airbag: ['R', `<circle cx="-12" cy="-16" r="6" fill="currentColor"/><path d="M-18 22 L-18 0 Q-18 -6 -10 -6 L-2 -6 L4 8 L-6 8" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="16" cy="-2" r="12" fill="currentColor"/>`],
    detresse: ['R', `<path d="M0 -22 L22 16 L-22 16 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M0 -10 L11 9 L-11 9 Z" fill="none" stroke="currentColor" stroke-width="3"/>`],
  };
  function dash(list) {
    let g = `<defs><radialGradient id="dg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#1b2230"/><stop offset="1" stop-color="#07090d"/></radialGradient></defs><rect width="640" height="400" fill="#111"/><rect x="30" y="40" width="580" height="320" rx="60" fill="url(#dg)" stroke="#2a3140" stroke-width="3"/>`;
    g += `<g opacity=".25" fill="none" stroke="#9fb0c5" stroke-width="3"><path d="M110 300 A150 150 0 1 1 290 300"/><path d="M350 300 A150 150 0 1 1 530 300"/></g>`;
    const n = list.length, sp = Math.min(150, 460 / n);
    list.forEach((k, i) => { const v = VOY[k]; if (!v) return; const x = 320 - ((n - 1) * sp) / 2 + i * sp; g += `<g transform="translate(${x} 200) scale(2.2)" color="${DCOL[v[0]]}" style="filter:drop-shadow(0 0 4px ${DCOL[v[0]]})">${v[1]}</g>`; });
    return g;
  }

  /* ---------- Illustration de thème (questions sans situation routière) ---------- */
  const CARD = {
    L: ['#1B4FB8', () => sign('B14:50', 320, 200, 1.8)],
    C: ['#6D28D9', () => `<g transform="translate(320 205)" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"><circle r="100"/><circle r="22" fill="#fff"/><path d="M-96 -12 Q0 30 96 -12 M0 22 V96"/></g>`],
    R: ['#0F766E', () => `<g transform="translate(320 200)"><path d="M-60 160 L-12 -150 L12 -150 L60 160 Z" fill="#40474f"/><path d="M0 150 V100 M0 70 V30 M0 5 V-25 M0 -45 V-70" stroke="#fff" stroke-width="7"/></g>`],
    U: ['#B45309', () => `<g transform="translate(250 230) scale(2.6)">${walker(1.6, '#fff')}</g><g transform="translate(410 230) scale(2.4)">${bike('#fff')}</g>`],
    D: ['#334155', () => `<g transform="translate(320 200)"><rect x="-130" y="-80" width="260" height="160" rx="16" fill="#fff"/><rect x="-110" y="-56" width="70" height="88" rx="6" fill="#CBD5E1"/><path d="M-20 -40 H100 M-20 -14 H100 M-20 12 H70" stroke="#94A3B8" stroke-width="10" stroke-linecap="round"/><text x="-75" y="62" font-family="Arial" font-weight="700" font-size="22" fill="${BLUE}" text-anchor="middle">B</text></g>`],
    P: ['#B91C1C', () => `<g transform="translate(320 200)"><rect x="-90" y="-90" width="180" height="180" rx="30" fill="#fff"/><path d="M-22 -60 H22 V-22 H60 V22 H22 V60 H-22 V22 H-60 V-22 H-22 Z" fill="${RED}"/></g>`],
    Q: ['#0E7490', () => `<g transform="translate(320 210)" fill="#fff"><path d="M-160 40 L-130 -30 Q-120 -50 -90 -52 L60 -52 Q90 -52 110 -30 L160 0 L160 50 L-160 50 Z"/><circle cx="-90" cy="58" r="30" fill="#0b1220"/><circle cx="100" cy="58" r="30" fill="#0b1220"/><path d="M-110 -30 L-90 -44 L-10 -44 L-10 -30 Z M5 -44 L60 -44 L90 -30 L5 -30 Z" fill="#7dd3fc"/></g>`],
    M: ['#4D7C0F', () => `<g transform="translate(320 200)" fill="none" stroke="#fff" stroke-width="12"><circle r="70"/><circle r="28"/>${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 -70 V-100" transform="rotate(${a})"/>`).join('')}</g>`],
    S: ['#9D174D', () => `<g transform="translate(320 200) scale(2.4)" color="#fff">${VOY.ceinture[1]}</g>`],
    E: ['#15803D', () => `<g transform="translate(320 200)"><path d="M0 -110 Q90 -60 70 40 Q50 110 0 120 Q-50 110 -70 40 Q-90 -60 0 -110 Z" fill="#fff"/><path d="M0 110 V-60 M0 0 L40 -30 M0 40 L-40 10" stroke="#15803D" stroke-width="10"/></g>`],
  };
  function card(k) {
    const c = CARD[k] || CARD.L;
    return `<rect width="640" height="400" fill="${c[0]}"/><g opacity=".12" fill="#fff">${[...Array(10)].map((_, i) => `<circle cx="${(i * 97) % 640}" cy="${(i * 57) % 400}" r="${40 + (i % 3) * 30}"/>`).join('')}</g>${c[1]()}`;
  }

  function render(spec) {
    let body;
    if (!spec) body = card('L');
    else if (spec.sign) body = `<rect width="640" height="400" fill="#E7EDF3"/><rect y="290" width="640" height="110" fill="#C9D3DC"/><rect x="316" y="250" width="8" height="150" fill="#8b8f95"/>${[].concat(spec.sign).map((c, i, a) => sign(c, 320, 165 - (a.length - 1) * 70 + i * 140, a.length > 1 ? 1.15 : 1.9)).join('')}`;
    else if (spec.drv) body = drv(spec.drv);
    else if (spec.top) body = top(spec.top);
    else if (spec.dash) body = dash(spec.dash);
    else body = card(spec.card);
    return `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;
  }

  window.SCENE = { render, sign, SIGNS, VOY, DCOL };
})();
