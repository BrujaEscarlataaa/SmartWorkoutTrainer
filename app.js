const $ = id => document.getElementById(id);
const fill = (sel, entries) => sel.innerHTML = entries.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');

fill($('sport'), Object.entries(SPORTS).map(([k, s]) => [k, s.nom]));
fill($('age'), AGES.map(a => [a, a.replace('-', ' à ') + ' ans']));
fill($('frequence'), Object.entries(FREQUENCES).map(([k, f]) => [k, f.label]));
$('frequence').value = '1-2';
fill($('niveau'), Object.entries(NIVEAUX_GLISSE).map(([k, n]) => [k, n.label]));
// le programme peut porter sur un autre sport que celui du profil
fill($('sport-prog'), Object.entries(SPORTS).map(([k, s]) => [k, s.nom]));
fill($('frequence-prog'), Object.entries(FREQUENCES).map(([k, f]) => [k, f.label]));
$('frequence-prog').value = '1-2';
fill($('niveau-prog'), Object.entries(NIVEAUX_GLISSE).map(([k, n]) => [k, n.label]));
fill($('duree'), Object.entries(DUREES).map(([k, d]) => [k, d.label]));
$('duree').value = '45';
fill($('seancesSemaine'), Array.from({ length: MAX_SEANCES_SEMAINE }, (_, i) => i + 1).map(n => [n, `${n} séance${n > 1 ? 's' : ''}`]));
$('seancesSemaine').value = '2';
$('jours').insertAdjacentHTML('beforeend', JOURS_SEMAINE
  .map((j, i) => `<label><input type="checkbox" name="jours" value="${i}"> ${j}</label>`).join(''));
// jours cochés = nombre de séances par semaine ; au-delà de 6 on bloque les autres cases
function majJours() {
  const cases = [...document.querySelectorAll('#jours input')], n = cases.filter(c => c.checked).length;
  cases.forEach(c => c.disabled = !c.checked && n >= MAX_SEANCES_SEMAINE);
  $('seancesSemaine').disabled = n > 0;
  if (n) $('seancesSemaine').value = n;
}
$('jours').addEventListener('change', majJours);
fill($('intensite'), Object.entries(INTENSITES).map(([k, i]) => [k, i.label]));
$('intensite').value = 'moderee';
$('materiel').insertAdjacentHTML('beforeend', Object.entries(MATERIEL)
  .map(([k, m]) => `<label><input type="checkbox" name="materiel" value="${k}"> ${m}</label>`).join(''));

const aujourdhui = () => new Date().toLocaleDateString('sv'); // 'YYYY-MM-DD' en heure locale
$('debut').value = aujourdhui();
$('echeance').min = ajouterJours(aujourdhui(), 1);
// l'échéance doit rester après le début
$('debut').addEventListener('change', e => { if (e.target.value) $('echeance').min = ajouterJours(e.target.value, 1); });
$('echeance').value = ajouterJours(aujourdhui(), 56);
const montrerProg = html => { $('programme').hidden = !html; $('programme').innerHTML = html; };
const pct = (n, total) => total ? Math.round(100 * n / total) : 0;
const barre = (p, label, c) => `<div class="barre" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}"><span style="width:${p}%${c ? ';background:' + c : ''}"></span></div>`;
const hero = (eyebrow, titre, sous) => `<div class="hero"><p class="eyebrow">${eyebrow}</p><h1>${titre}</h1><p class="sous">${sous}</p></div>`;
const dateFR = iso => iso.split('-').reverse().join('/');
const jourFR = iso => new Date(iso + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });

// ski / snowboard : niveau technique au lieu de la fréquence de pratique
function lierGlisse(suffixe) {
  const sel = $('sport' + suffixe);
  sel.addEventListener('change', () => {
    const glisse = !!SPORTS[sel.value].glisse;
    $('label-niveau' + suffixe).hidden = !glisse;
    $('label-frequence' + suffixe).hidden = glisse;
  });
  sel.dispatchEvent(new Event('change'));
}
lierGlisse('');
lierGlisse('-prog');
$('avecMateriel').addEventListener('change', e => $('materiel').hidden = e.target.value !== 'oui');

// --- Silhouette : [forme, attributs, zone ou null], dessinée deux fois (face à x=0, dos à x=220)
const commun = [
  ['circle', { cx: 100, cy: 30, r: 22 }],
  ['rect', { x: 70, y: 66, width: 60, height: 100, rx: 14 }],
  ['rect', { x: 42, y: 78, width: 16, height: 98, rx: 8 }],
  ['rect', { x: 142, y: 78, width: 16, height: 98, rx: 8 }],
  ['rect', { x: 72, y: 158, width: 56, height: 32, rx: 10 }],
  ['ellipse', { cx: 87, cy: 372, rx: 12, ry: 6 }],
  ['ellipse', { cx: 113, cy: 372, rx: 12, ry: 6 }],
  ['rect', { x: 92, y: 50, width: 16, height: 16, rx: 4 }, 'nuque'],
  ['circle', { cx: 62, cy: 80, r: 13 }, 'epaules'],
  ['circle', { cx: 138, cy: 80, r: 13 }, 'epaules'],
  ['circle', { cx: 50, cy: 184, r: 7 }, 'poignets'],
  ['circle', { cx: 150, cy: 184, r: 7 }, 'poignets'],
  ['circle', { cx: 87, cy: 356, r: 7 }, 'chevilles'],
  ['circle', { cx: 113, cy: 356, r: 7 }, 'chevilles'],
];
const face = [
  ['rect', { x: 78, y: 284, width: 18, height: 64, rx: 8 }],
  ['rect', { x: 104, y: 284, width: 18, height: 64, rx: 8 }],
  ['rect', { x: 80, y: 102, width: 40, height: 54, rx: 8 }, 'abdos'],
  ['circle', { cx: 78, cy: 170, r: 9 }, 'hanches'],
  ['circle', { cx: 122, cy: 170, r: 9 }, 'hanches'],
  ['rect', { x: 76, y: 192, width: 22, height: 70, rx: 10 }, 'quadriceps'],
  ['rect', { x: 102, y: 192, width: 22, height: 70, rx: 10 }, 'quadriceps'],
  ['circle', { cx: 87, cy: 273, r: 10 }, 'genoux'],
  ['circle', { cx: 113, cy: 273, r: 10 }, 'genoux'],
];
const dos = [
  ['rect', { x: 78, y: 264, width: 18, height: 20, rx: 6 }],
  ['rect', { x: 104, y: 264, width: 18, height: 20, rx: 6 }],
  ['rect', { x: 80, y: 116, width: 40, height: 40, rx: 8 }, 'lombaires'],
  ['ellipse', { cx: 88, cy: 178, rx: 14, ry: 12 }, 'fessiers'],
  ['ellipse', { cx: 112, cy: 178, rx: 14, ry: 12 }, 'fessiers'],
  ['rect', { x: 76, y: 194, width: 22, height: 68, rx: 10 }, 'ischios'],
  ['rect', { x: 102, y: 194, width: 22, height: 68, rx: 10 }, 'ischios'],
  ['rect', { x: 78, y: 286, width: 18, height: 60, rx: 8 }, 'mollets'],
  ['rect', { x: 104, y: 286, width: 18, height: 60, rx: 8 }, 'mollets'],
];

const svg = $('silhouette');
const NS = 'http://www.w3.org/2000/svg';
function dessiner(formes, dx, titre) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', `translate(${dx} 0)`);
  for (const [tag, attrs, zone] of formes) {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (zone) {
      Object.assign(el.dataset, { zone });
      el.setAttribute('class', 'zone');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', ZONES[zone]);
      el.innerHTML = `<title>${ZONES[zone]}</title>`;
    } else el.setAttribute('class', 'corps');
    g.appendChild(el);
  }
  const t = document.createElementNS(NS, 'text');
  Object.entries({ x: 100, y: 396, 'text-anchor': 'middle', class: 'legende' }).forEach(([k, v]) => t.setAttribute(k, v));
  t.textContent = titre;
  g.appendChild(t);
  svg.appendChild(g);
}
// corps d'abord, zones cliquables ensuite pour qu'elles soient au-dessus
dessiner([...commun.filter(f => !f[2]), ...face, ...commun.filter(f => f[2])], 0, 'Face');
dessiner([...commun.filter(f => !f[2]), ...dos, ...commun.filter(f => f[2])], 220, 'Dos');

const zonesEls = () => svg.querySelectorAll('.zone');
const tags = zones => zones.map(z => `<span class="tag">${ZONES[z]}</span>`).join('');
const niveaux = ['', 'débutant', 'intermédiaire', 'avancé'];
const exoHTML = (e, series) => `<div class="exo"><b>${e.nom}</b>
  <small>${e.type} · ${niveaux[e.niveau]} · ${series ? series + ' séries × ' : ''}${e.dose}${e.materiel.length ? ' · ' + e.materiel.map(m => MATERIEL[m]).join(', ') : ''}</small><br>${e.desc}<br>${tags(e.zones)}</div>`;

function choisirZone(zone) {
  zonesEls().forEach(el => el.classList.toggle('actif', el.dataset.zone === zone));
  $('zone-exos').innerHTML = `<h2>${ZONES[zone]}</h2>
    <label>Muscle <select id="muscle"></select></label><div id="liste-exos"></div>`;
  fill($('muscle'), [['', 'Tous les muscles de la zone'], ...Object.entries(MUSCLES[zone])]);
  $('muscle').addEventListener('change', e => afficherExos(zone, e.target.value));
  afficherExos(zone, '');
}
function afficherExos(zone, muscle) {
  const liste = exosParZone(zone, muscle).sort((a, b) => a.niveau - b.niveau);
  $('liste-exos').innerHTML = `<p class="note">${liste.length} exercice(s)</p>` + liste.map(e => exoHTML(e)).join('');
}
svg.addEventListener('click', e => e.target.dataset.zone && choisirZone(e.target.dataset.zone));
svg.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.zone) { e.preventDefault(); choisirZone(e.target.dataset.zone); }
});

// --- Profil (page d'accueil), mémorisé dans le navigateur
const CLE = 'sport-trainer-profil';
let profil = null;
// programmes en cours, un par sport : leurs paramètres (regénérés à l'identique) + les numéros des séances faites
const CLE_PROGS = 'sport-trainer-programmes', CLE_PROG = 'sport-trainer-programme'; // CLE_PROG : ancienne version à un seul programme, lue mais jamais effacée
let actifs = [];
const sauver = () => { try { localStorage.setItem(CLE_PROGS, JSON.stringify(actifs.map(({ p, faites }) => ({ p, faites })))); } catch {} };
// chaque séance connaît son sport et son programme : deux sports peuvent avoir une séance le même jour
function charger(p, faites = []) {
  const a = { p, faites, prog: genererProgramme(p) };
  a.prog.seances.forEach(s => Object.assign(s, { sport: p.sport, a, cle: p.sport + ':' + s.numero }));
  return a;
}
const toutes = () => actifs.flatMap(a => a.prog.seances).sort((x, y) => x.date.localeCompare(y.date) || x.sport.localeCompare(y.sport));
const seanceDe = cle => { const [sp, n] = cle.split(':'); return actifs.find(a => a.p.sport === sp).prog.seances[n - 1]; };
// programmes remplacés ou arrêtés : { sport, debut, echeance, total, faites }
const CLE_HIST = 'sport-trainer-historique';
let historique = [];
try { historique = JSON.parse(localStorage.getItem(CLE_HIST)) || []; } catch {}
const resumeProg = a => ({ sport: a.p.sport, debut: a.p.debut, echeance: a.p.echeance, total: a.prog.seances.length, faites: a.faites.length });
function archiver(a) {
  if (!a.faites.length) return; // programme jamais commencé : on ne le garde pas
  historique.push(resumeProg(a));
  try { localStorage.setItem(CLE_HIST, JSON.stringify(historique)); } catch {}
}

const COULEURS = { ski: '#1c7ed6', snowboard: '#6936cf', surf: '#2f9e44', course: '#e8590c', velo: '#c2255c', natation: '#0c8599' };
const AVEC_IMAGE = ['ski', 'snowboard', 'surf', 'course', 'velo', 'natation'];
const imgSport = (sp, cls = '') => AVEC_IMAGE.includes(sp) ? `<img class="photo ${cls}" src="img/${sp}.jpg" alt="" loading="lazy">` : '';
// Profil : l'image suit le sport choisi
const majPhotoProfil = () => $('photo-profil').innerHTML = imgSport($('sport').value, 'entiere');
$('sport').addEventListener('change', majPhotoProfil);
majPhotoProfil();
const couleur = sp => COULEURS[sp] ?? '#5f6b7a';
const nomSport = sp => SPORTS[sp]?.nom ?? sp;
const tagSport = sp => `<span class="tag sp" style="--sp:${couleur(sp)}">${nomSport(sp)}</span>`;
const puce = sp => `<span class="puce" style="background:${couleur(sp)}" aria-hidden="true"></span>`;

try { profil = JSON.parse(localStorage.getItem(CLE)); } catch {}
if (profil && !SPORTS[profil.sport]) profil = null; // profil d'une ancienne version
if (profil) {
  for (const [k, v] of Object.entries(profil)) if ($('form-profil').elements[k]) $('form-profil').elements[k].value = v;
  $('sport').dispatchEvent(new Event('change'));
}

function texteProfil() {
  const s = SPORTS[profil.sport];
  return [s.nom, s.glisse ? NIVEAUX_GLISSE[profil.niveau].label : FREQUENCES[profil.frequence].label,
    profil.age.replace('-', ' à ') + ' ans', { homme: 'Homme', femme: 'Femme', ni: 'Non identifié' }[profil.sexe],
    `${profil.taille} cm`, `${profil.poids} kg`].join(' · ');
}
const resumeProfil = () => profil && ($('resume-profil').textContent = texteProfil());
// sport / pratique / niveau proposés par défaut pour un nouveau programme
function preremplirSport(src) {
  for (const k of ['sport', 'frequence', 'niveau']) if (src?.[k]) $('objectif').elements[k].value = src[k];
  $('sport-prog').dispatchEvent(new Event('change'));
}

$('form-profil').addEventListener('submit', e => {
  e.preventDefault();
  profil = Object.fromEntries(new FormData(e.target));
  profil.taille = +profil.taille; profil.poids = +profil.poids;
  try { localStorage.setItem(CLE, JSON.stringify(profil)); } catch {}
  montrerProg(''); // les anciens programmes ne correspondent plus au profil
  actifs.forEach(archiver);
  actifs = [];
  sauver();
  zonesEls().forEach(el => el.classList.remove('cible'));
  preremplirSport(profil);
  location.hash = 'seances';
});

// --- Navigation entre les pages (#accueil, #seances, #calendrier, #profil, #progres)
const VUES = ['accueil', 'seances', 'calendrier', 'profil', 'progres'];
function afficherVue() {
  let vue = location.hash.slice(1);
  if (vue === 'programme') vue = 'seances'; // ancien lien
  if (!VUES.includes(vue)) vue = 'accueil';
  if (vue === 'calendrier' && !actifs.length) vue = 'seances';
  if ((vue === 'accueil' || vue === 'seances') && !profil) vue = 'profil';
  // re-rendu à chaque visite : les statuts (en retard…) dépendent du jour
  ({ accueil: afficherAccueil, calendrier: afficherCalendrier, progres: afficherProgres, seances: afficherProgramme })[vue]?.();
  document.querySelectorAll('[data-vue]').forEach(s => s.hidden = s.dataset.vue !== vue);
  document.querySelectorAll('[data-lien]').forEach(a => {
    if (a.dataset.lien === vue) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    a.classList.toggle('inactif', (['accueil', 'seances'].includes(a.dataset.lien) && !profil) || (a.dataset.lien === 'calendrier' && !actifs.length));
  });
  resumeProfil();
  scrollTo(0, 0);
}
addEventListener('hashchange', afficherVue);

const erreur = msg => montrerProg(`<div class="card"><p class="erreur">${msg}</p></div>`);
$('objectif').addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const p = { ...profil, ...Object.fromEntries(fd) };
  p.materiel = p.avecMateriel === 'oui' ? fd.getAll('materiel') : [];
  p.jours = fd.getAll('jours').map(Number);
  if (p.jours.length) p.seancesSemaine = p.jours.length; // le select désactivé n'est pas envoyé
  if (p.avecMateriel === 'oui' && !p.materiel.length) return erreur('Coche au moins un matériel, ou choisis « Sans matériel ».');
  let a;
  try { a = charger(p); } catch (err) { return erreur(err.message); }
  // un seul programme en cours par sport : le nouveau remplace celui du même sport
  const ancien = actifs.find(x => x.p.sport === p.sport);
  if (ancien) archiver(ancien);
  actifs = [...actifs.filter(x => x !== ancien), a];
  sauver();
  afficherVue(); // affiche les programmes et active le lien Calendrier
});

function afficherProgramme() {
  const zones = new Set(actifs.flatMap(a => a.prog.zones));
  zonesEls().forEach(el => el.classList.toggle('cible', zones.has(el.dataset.zone)));
  montrerProg(actifs.map(({ p, prog }) => {
    const glisse = SPORTS[p.sport].glisse, ouverte = prog.seances.find(s => s.date >= aujourdhui())?.numero ?? 1;
    return `<div class="card" style="border-top:6px solid ${couleur(p.sport)}">
      <div class="entete-prog">
        ${imgSport(p.sport, 'vignette')}
        <h2>${puce(p.sport)}Programme ${nomSport(p.sport)} — ${glisse ? NIVEAUX_GLISSE[p.niveau].label : 'niveau ' + niveaux[prog.niveau]}</h2>
        <button type="button" class="secondaire" data-arreter="${p.sport}">Arrêter ce programme</button>
      </div>
      <p class="note">Du <b>${dateFR(p.debut)}</b> · objectif : prêt·e le <b>${dateFR(p.echeance)}</b> · ${prog.seances.length} séance(s) sur ${prog.semaines} semaine(s),
        ${p.seancesSemaine} par semaine${p.jours?.length ? ' (' + p.jours.map(j => JOURS_SEMAINE[j].toLowerCase()).join(', ') + ')' : ''} en plus de ta pratique · ${DUREES[p.duree].label} par séance · intensité ${INTENSITES[p.intensite].label.toLowerCase()} ·
        ${p.materiel.length ? p.materiel.map(m => MATERIEL[m]).join(', ') : 'sans matériel'} · IMC ${prog.imc} · repos ${INTENSITES[p.intensite].repos} entre les séries.</p>
      <p>Zones prioritaires : ${tags(prog.zones)}</p>
      ${prog.notes.map(n => `<p class="note">• ${n}</p>`).join('')}
      ${prog.seances.map(s => `
      <details class="seance"${s.numero === ouverte ? ' open' : ''}>
        <summary>Séance ${s.numero} · ${jourFR(s.date)} · semaine ${s.semaine} · ${s.phase} · ${s.series} séries ${tagStatut(s)}</summary>
        <p class="note"><b>Échauffement</b> : 5-10 min de cardio léger + mobilité des articulations.</p>
        ${s.exos.map(x => exoHTML(x, s.series)).join('')}
        <p class="note"><b>Retour au calme</b></p>
        ${s.calme.map(x => exoHTML(x)).join('')}
      </details>`).join('')}
    </div>`;
  }).join(''));
}
$('programme').addEventListener('click', e => {
  const sp = e.target.dataset.arreter;
  if (!sp || !confirm(`Arrêter le programme ${nomSport(sp)} ? Il sera rangé dans ton historique s'il a des séances faites.`)) return;
  const a = actifs.find(x => x.p.sport === sp);
  archiver(a);
  actifs = actifs.filter(x => x !== a);
  sauver();
  afficherVue();
});

// --- Calendrier + checklist
const statut = s => statutSeance(s, s.a.faites, aujourdhui());
const tagStatut = s => `<span class="tag st ${statut(s)}">${STATUTS[statut(s)]}</span>`;
const iso = (a, m, j) => `${a}-${String(m + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
const ICONES = { faite: '✓', retard: '✗', 'a-venir': '•' };

const moisDe = d => { const [a, m] = d.split('-').map(Number); return a * 12 + m - 1; }; // mois numérotés : année * 12 + mois
let moisAffiche = 0;

function grille() {
  const liste = toutes(), parDate = new Map();
  for (const s of liste) parDate.set(s.date, [...(parDate.get(s.date) || []), s]);
  const min = moisDe(liste[0].date), max = moisDe(liste.at(-1).date);
  moisAffiche = Math.min(max, Math.max(min, moisAffiche));
  const i = moisAffiche, a = Math.floor(i / 12), m = i % 12;
  let cases = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(j => `<div class="entete" aria-hidden="true">${j}</div>`).join('')
    + '<div></div>'.repeat((new Date(a, m, 1).getDay() + 6) % 7); // la semaine commence lundi
  for (let j = 1; j <= new Date(a, m + 1, 0).getDate(); j++) {
    const d = iso(a, m, j), auj = d === aujourdhui() ? ' auj' : '';
    // une pastille par séance, couleur du sport ; le statut est donné par l'icône
    cases += `<div class="jour${auj}">${j}${(parDate.get(d) || []).map(s => `<span class="pastille" data-st="${statut(s)}" style="--sp:${couleur(s.sport)}" role="img"
      aria-label="${nomSport(s.sport)}, séance ${s.numero} : ${STATUTS[statut(s)]}" title="${nomSport(s.sport)} · séance ${s.numero} · ${STATUTS[statut(s)]}">${ICONES[statut(s)]} S${s.numero}</span>`).join('')}</div>`;
  }
  $('cal').innerHTML = `<div class="nav-mois"><button type="button" data-dec="-1" aria-label="Mois précédent"${i <= min ? ' disabled' : ''}>‹</button>
    <h3 aria-live="polite">${new Date(a, m, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h3>
    <button type="button" data-dec="1" aria-label="Mois suivant"${i >= max ? ' disabled' : ''}>›</button></div><div class="cal">${cases}</div>`;
}

$('cal').addEventListener('click', e => {
  const b = e.target.closest('[data-dec]');
  if (!b) return;
  moisAffiche += +b.dataset.dec;
  grille();
  $('cal').querySelector(`[data-dec="${b.dataset.dec}"]`).focus(); // garder le focus clavier sur la flèche
});

function afficherCalendrier() {
  $('legende').innerHTML = actifs.map(a => tagSport(a.p.sport)).join(' ')
    + ` · ${ICONES.faite} faite · <span class="erreur">${ICONES.retard} en retard</span> · ${ICONES['a-venir']} à venir · le jour encadré est aujourd'hui`;
  moisAffiche = moisDe(aujourdhui()); // ramené dans les mois des programmes par grille()
  grille();
  $('checklist').innerHTML = toutes().map(s => `<li><label><input type="checkbox" value="${s.cle}"${s.a.faites.includes(s.numero) ? ' checked' : ''}>
    <span>${tagSport(s.sport)} Séance ${s.numero} · ${jourFR(s.date)} · ${s.phase}</span></label> ${tagStatut(s)}</li>`).join('');
}

// pas de re-rendu de la liste : la case cochée garde le focus clavier
function marquer(cle, fait) {
  const s = seanceDe(cle), a = s.a;
  a.faites = fait ? [...new Set([...a.faites, s.numero])] : a.faites.filter(x => x !== s.numero);
  sauver();
}
$('checklist').addEventListener('change', e => {
  marquer(e.target.value, e.target.checked);
  e.target.closest('li').querySelector('.st').outerHTML = tagStatut(seanceDe(e.target.value));
  grille();
});

// --- Accueil
// séances du prochain jour d'entraînement (aujourd'hui compris, même faites) : une par sport au plus
const prochaines = () => { const l = toutes().filter(s => s.date >= aujourdhui()); return l.filter(s => s.date === l[0]?.date); };

function afficherAccueil() {
  if (!actifs.length) {
    $('page-accueil').innerHTML = hero('Tableau de bord', 'Bonjour !', `${texteProfil()} · <a href="#profil">modifier</a>`)
      + '<div class="card"><h2>Pas encore de programme</h2><p class="note">Choisis ton objectif et tes dates pour générer tes séances.</p><p><a href="#seances">Créer mon programme</a></p></div>';
    return;
  }
  const auj = aujourdhui(), liste = toutes(), ps = prochaines();
  const total = liste.length, faites = actifs.reduce((t, a) => t + a.faites.length, 0);
  const retards = liste.filter(x => statut(x) === 'retard').length;
  const lundi = ajouterJours(auj, -jourSemaine(auj));
  const jours = JOURS_SEMAINE.map((j, i) => { const d = ajouterJours(lundi, i); return [j, d, liste.filter(x => x.date === d)]; });
  const dansSemaine = jours.flatMap(x => x[2]);
  const semaine = jours.map(([j, d, ss]) => `<div class="jour${d === auj ? ' auj' : ''}"><small>${j.slice(0, 3)} ${d.slice(8)}</small><br>${ss.length
    ? ss.map(x => `<span class="ic ${statut(x)}" style="box-shadow:0 0 0 2px var(--card), 0 0 0 4px ${couleur(x.sport)}" role="img"
        aria-label="${nomSport(x.sport)}, séance ${x.numero} : ${STATUTS[statut(x)]}" title="${nomSport(x.sport)} · séance ${x.numero} · ${STATUTS[statut(x)]}">${ICONES[statut(x)]}</span>`).join(' ')
    : '<small class="note">repos</small>'}</div>`).join('');
  const titre = !ps.length ? 'Programmes terminés' : ps[0].date === auj
    ? (ps.length > 1 ? 'Séances du jour' : 'Séance du jour') : (ps.length > 1 ? 'Prochaines séances' : 'Prochaine séance');
  $('page-accueil').innerHTML = hero('Tableau de bord', 'Bonjour !', `${texteProfil()} · <a href="#profil">modifier</a>`) + `
    <div class="kpis">
      <div class="kpi"><span>Séances faites</span><b>${faites} / ${total}</b><small>${actifs.map((a, i) => i ? nomSport(a.p.sport).toLowerCase() : nomSport(a.p.sport)).join(', ')}</small></div>
      <div class="kpi vert"><span>Réalisation</span><b>${pct(faites, total)} %</b><small>${actifs.length} programme${actifs.length > 1 ? 's' : ''} en cours</small></div>
      <div class="kpi violet"><span>Cette semaine</span><b>${dansSemaine.filter(x => statut(x) === 'faite').length} / ${dansSemaine.length}</b><small>${retards ? `<a href="#calendrier" style="color:#fff">${retards} séance(s) en retard</a>` : 'Aucune séance en retard'}</small></div>
    </div>
    <div class="grille">
      <div class="card">
        <h2>Cette semaine</h2>
        <p class="note">Du ${dateFR(lundi)} au ${dateFR(ajouterJours(lundi, 6))}</p>
        <div class="cal" style="margin-top:12px">${semaine}</div>
        ${actifs.map(a => `<h3>${puce(a.p.sport)}Programme ${nomSport(a.p.sport)}</h3>
        <span class="pct">${pct(a.faites.length, a.prog.seances.length)} %</span>${barre(pct(a.faites.length, a.prog.seances.length), 'Programme ' + nomSport(a.p.sport), couleur(a.p.sport))}
        <p class="note">Du ${dateFR(a.p.debut)} au ${dateFR(a.p.echeance)}</p>`).join('')}
        <p><a href="#calendrier">Voir le calendrier</a></p>
      </div>
      <div class="actif">
        <h2>${titre}</h2>
        ${ps.length ? `<p>${ps[0].date === auj ? "Aujourd'hui" : jourFR(ps[0].date)}</p>
        ${ps.map(s => `<div class="bloc">
          ${imgSport(s.sport)}
          <p>${tagSport(s.sport)} ${tagStatut(s)}</p>
          <p class="gros"><b>${s.series}</b> séries · ${DUREES[s.a.p.duree].label}</p>
          <p>Séance ${s.numero} · ${s.phase}</p>
          <ul>${s.exos.map(e => `<li>${e.nom} <small>${s.series} × ${e.dose}</small></li>`).join('')}</ul>
          <label><input type="checkbox" data-faite="${s.cle}"${s.a.faites.includes(s.numero) ? ' checked' : ''}> Séance de ${nomSport(s.sport).toLowerCase()} faite</label>
        </div>`).join('')}
        <p><a href="#seances">Voir le détail des exercices</a></p>`
        : `<p>Bravo, tu es arrivé·e au bout !</p><p><a href="#seances">Créer un nouveau programme</a></p>`}
      </div>
    </div>`;
}
$('page-accueil').addEventListener('change', e => {
  const cle = e.target.dataset.faite;
  if (!cle) return;
  marquer(cle, e.target.checked);
  afficherAccueil();
  $('page-accueil').querySelector(`[data-faite="${cle}"]`).focus();
});

// --- Progrès : programmes passés + programmes en cours
function afficherProgres() {
  const auj = aujourdhui();
  const tous = [...historique, ...actifs.map(resumeProg)];
  if (!tous.length) {
    $('page-progres').innerHTML = hero('Votre parcours sportif', 'Mes progrès', 'Aucun programme pour l\'instant.')
      + '<div class="card"><h2>Commence ton parcours</h2><p><a href="#seances">Crée ton premier programme</a></p></div>';
    return;
  }
  const b = bilanParSport(tous, auj);
  const termines = tous.filter(x => estTermine(x, auj)).length, faites = tous.reduce((t, x) => t + x.faites, 0);
  const noms = Object.keys(b).map((sp, i) => i ? nomSport(sp).toLowerCase() : nomSport(sp));
  const listeNoms = noms.length > 1 ? noms.slice(0, -1).join(', ') + ' et ' + noms.at(-1) : noms[0];
  const enCours = tous.length - termines;
  $('page-progres').innerHTML = hero('Votre parcours sportif', 'Mes progrès', `${termines} programme(s) terminé(s) sur ${tous.length} · ${faites} séance(s) faite(s) au total`) + `
    <div class="kpis">
      <div class="kpi"><span>Séances faites</span><b>${faites}</b><small>Tous sports confondus</small></div>
      <div class="kpi vert"><span>Programmes terminés</span><b>${termines} / ${tous.length}</b><small>${enCours} programme${enCours > 1 ? 's' : ''} en cours</small></div>
      <div class="kpi violet"><span>Sports pratiqués</span><b>${noms.length}</b><small>${listeNoms}</small></div>
    </div>
    <div class="${actifs.length ? 'grille' : ''}">
      <div class="card">
        <h2>Progression par sport</h2>
        <p class="note">Le détail de vos séances et de vos programmes.</p>
        <div class="table"><table>
          <thead><tr><th scope="col">Sport</th><th scope="col">Programmes</th><th scope="col">Terminés</th><th scope="col">Séances faites</th><th scope="col">Réalisation</th></tr></thead>
          <tbody>${Object.entries(b).map(([sp, x]) => `<tr><th scope="row">${puce(sp)}${nomSport(sp)}</th><td>${x.programmes}</td><td>${x.termines}</td>
            <td>${x.faites} / ${x.prevues}</td><td><span class="pct">${pct(x.faites, x.prevues)} %</span>${barre(pct(x.faites, x.prevues), 'Réalisation ' + nomSport(sp), couleur(sp))}</td></tr>`).join('')}</tbody>
        </table></div>
      </div>
      ${actifs.length ? `<div class="pile">${actifs.map(a => { const r = resumeProg(a); return `<div class="actif">
        ${imgSport(r.sport)}
        ${tagSport(r.sport)}
        <h2>Programme ${nomSport(r.sport)}</h2>
        <p>${dateFR(r.debut)} – ${dateFR(r.echeance)}</p>
        <p class="gros"><b>${r.faites}</b> / ${r.total} séances</p>
        ${barre(pct(r.faites, r.total), 'Programme ' + nomSport(r.sport))}
        <p>${pct(r.faites, r.total)} % du programme réalisé</p>
      </div>`; }).join('')}</div>` : ''}
    </div>
    <div class="card">
      <h2>Historique</h2>
      <ul class="liste">${tous.slice().reverse().map(x => `<li><b>${puce(x.sport)}${nomSport(x.sport)}</b>
        <span class="periode">du ${dateFR(x.debut)} au ${dateFR(x.echeance)}</span><span class="nb">${x.faites} / ${x.total} séances</span>
        <span class="tag ${estTermine(x, auj) ? 'faite' : 'a-venir'}">${estTermine(x, auj) ? 'Terminé' : 'En cours'}</span></li>`).join('')}</ul>
    </div>`;
}

// --- Au chargement : on retrouve les programmes (ou l'ancien programme unique) et les séances cochées
let brut = [];
try { brut = JSON.parse(localStorage.getItem(CLE_PROGS)) ?? [JSON.parse(localStorage.getItem(CLE_PROG))].filter(Boolean); } catch {}
actifs = brut.flatMap(x => { try { return [charger(x.p, x.faites)]; } catch { return []; } });
const dernier = actifs.at(-1)?.p;
preremplirSport(dernier ?? profil);
if (dernier) {
  const f = $('objectif').elements;
  for (const k of ['debut', 'echeance', 'duree', 'seancesSemaine', 'intensite', 'avecMateriel']) if (dernier[k]) f[k].value = dernier[k];
  document.querySelectorAll('#materiel input').forEach(c => c.checked = dernier.materiel.includes(c.value));
  $('materiel').hidden = dernier.avecMateriel !== 'oui';
  document.querySelectorAll('#jours input').forEach(c => c.checked = (dernier.jours || []).includes(+c.value));
  majJours();
  $('echeance').min = ajouterJours(dernier.debut, 1);
}
afficherVue();
