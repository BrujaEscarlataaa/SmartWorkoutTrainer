// Lancer : node test.js
const assert = require('assert');
const { SPORTS, FREQUENCES, NIVEAUX_GLISSE, INTENSITES, DUREES, MATERIEL, ZONES, MUSCLES, EXOS, exosParZone, statutSeance, JOURS_SEMAINE, jourSemaine, estTermine, bilanParSport, genererProgramme } = require('./logic.js');

for (const e of EXOS) for (const z of e.zones) assert(ZONES[z], `zone inconnue ${z} dans ${e.nom}`);
for (const e of EXOS) for (const m of e.materiel) assert(MATERIEL[m], `matériel inconnu ${m} dans ${e.nom}`);
// chaque muscle d'un exo appartient à une de ses zones, et chaque muscle a au moins un exo
for (const e of EXOS) for (const m of e.muscles) assert(e.zones.some(z => MUSCLES[z][m]), `muscle ${m} hors des zones de ${e.nom}`);
for (const z in ZONES) for (const m in MUSCLES[z]) assert(exosParZone(z, m).length, `aucun exo pour ${m}`);
assert.strictEqual(exosParZone('genoux', '').length, EXOS.filter(e => e.zones.includes('genoux')).length);

const debut = '2026-11-19';
assert.throws(() => genererProgramme({ sport: 'ski', niveau: 'expert', age: '20-25', taille: 175, poids: 70, debut, echeance: debut, duree: '60', seancesSemaine: 3 }));

const materiels = [[], ['elastique'], ['kettlebell'], Object.keys(MATERIEL)];
let n = 0;
for (const sport in SPORTS) for (const age of ['15-19', '26-30', '56-60']) for (const sexe of ['homme', 'femme', 'ni'])
for (const niv of Object.keys(SPORTS[sport].glisse ? NIVEAUX_GLISSE : FREQUENCES)) for (const [taille, poids] of [[175, 70], [165, 95]])
for (const materiel of materiels) for (const duree in DUREES) for (const seancesSemaine of [1, 3, 6])
for (const echeance of ['2026-11-20', '2027-01-15']) {
  const p = genererProgramme({ sport, age, sexe, frequence: niv, niveau: niv, taille, poids, debut, echeance, duree, seancesSemaine, materiel });
  const jours = (Date.parse(echeance) - Date.parse(debut)) / 864e5;
  const ctx = `${sport} ${age} ${niv} ${materiel} ${duree} ${seancesSemaine}/sem ${echeance}`;
  assert.strictEqual(p.seances.length, Math.max(1, Math.round(jours / 7 * seancesSemaine)), ctx);
  p.seances.forEach((s, i) => {
    assert.strictEqual(s.numero, i + 1);
    assert(s.date >= debut && s.date < echeance, `date ${s.date} hors période ${ctx}`);
    assert(i === 0 || s.date >= p.seances[i - 1].date, 'dates non triées');
    assert(s.series >= 1 && s.series <= 5);
    assert.strictEqual(s.exos.length, DUREES[duree].exos, `nb exos ${ctx}`);
    assert(s.exos.every(Boolean));
    assert(s.exos.some(e => e.type === 'gainage'), 'pas de gainage');
    assert(s.exos.every(e => e.niveau <= p.niveau));
    assert(s.exos.every(e => e.materiel.every(m => materiel.includes(m))), `matériel non choisi ${ctx}`);
    assert(new Set(s.exos).size === s.exos.length, 'doublon');
    if (parseInt(age) >= 51 || p.imc >= 30) assert(!s.exos.some(e => e.type === 'pliométrie'), 'sauts interdits');
    assert(s.calme.length > 0);
  });
  // personnalisé : la séance N et la même séance la semaine suivante ne sont pas identiques
  const cle = s => s.exos.map(e => e.nom).sort().join('|');
  p.seances.forEach((s, i) => {
    const suivante = p.seances[i + seancesSemaine];
    if (suivante && suivante.phase === s.phase) assert.notStrictEqual(cle(s), cle(suivante), `séances ${i + 1} et ${i + 1 + seancesSemaine} identiques ${ctx}`);
  });
  // avec du matériel coché, le programme s'en sert
  if (materiel.length) assert(p.seances.some(s => s.exos.some(e => e.materiel.length)), `matériel inutilisé ${ctx}`);
  if (jours >= 21) assert(p.seances.at(-1).phase === 'Affûtage' && p.seances[0].phase === 'Adaptation', ctx);
  n++;
}
// l'intensité change le volume : légère < modérée < intense
const vol = intensite => genererProgramme({ sport: 'course', frequence: '3-4', age: '26-30', sexe: 'ni', taille: 175, poids: 70, debut, echeance: '2027-01-15', duree: '45', seancesSemaine: 3, intensite })
  .seances.reduce((t, s) => t + s.series, 0);
assert(vol('legere') < vol('moderee') && vol('moderee') < vol('intense'), 'intensité sans effet');
for (const intensite in INTENSITES) assert(genererProgramme({ sport: 'ski', niveau: 'debutant', age: '56-60', sexe: 'femme', taille: 165, poids: 95, debut, echeance: '2027-01-15', duree: '30', seancesSemaine: 1, intensite, materiel: [] }).seances.every(s => s.series >= 1 && s.exos.every(Boolean)));
// statut : cochée > en retard (date passée) > à venir (dont aujourd'hui)
assert.strictEqual(statutSeance({ numero: 1, date: '2026-11-18' }, [1], '2026-11-19'), 'faite');
assert.strictEqual(statutSeance({ numero: 2, date: '2026-11-18' }, [1], '2026-11-19'), 'retard');
assert.strictEqual(statutSeance({ numero: 3, date: '2026-11-19' }, [], '2026-11-19'), 'a-venir');
// début choisi dans le futur : la 1re séance tombe ce jour-là
assert.strictEqual(genererProgramme({ sport: 'course', frequence: '1-2', age: '26-30', sexe: 'ni', taille: 175, poids: 70, debut: '2026-12-07', echeance: '2027-01-15', duree: '45', seancesSemaine: 2 }).seances[0].date, '2026-12-07');
// jours préférés : séances uniquement ces jours-là, 1 par jour ; 6 par semaine maximum
const base = { sport: 'course', frequence: '1-2', age: '26-30', sexe: 'ni', taille: 175, poids: 70, debut: '2026-11-19', echeance: '2027-01-15', duree: '45' };
const lmv = genererProgramme({ ...base, jours: [0, 2, 4] }); // lundi, mercredi, vendredi
const jourDe = d => (new Date(d + 'T12:00Z').getUTCDay() + 6) % 7;
assert(lmv.seances.every(s => [0, 2, 4].includes(jourDe(s.date))), 'jour non choisi');
assert.strictEqual(new Set(lmv.seances.map(s => s.date)).size, lmv.seances.length, '2 séances le même jour');
assert.strictEqual(lmv.seances.length, 24); // 19/11/2026 -> 14/01/2027 : 8 lundis, 8 mercredis, 8 vendredis
assert.throws(() => genererProgramme({ ...base, jours: [0, 1, 2, 3, 4, 5, 6] }));
assert(genererProgramme({ ...base, seancesSemaine: 7 }).seances.length <= Math.round(57 / 7 * 6), '7 séances/semaine acceptées');
assert.throws(() => genererProgramme({ ...base, echeance: '2026-11-20', jours: [0] })); // jeudi -> vendredi : pas de lundi
assert.strictEqual(JOURS_SEMAINE.length, 7);
// progrès : terminé = échéance atteinte ou tout fait ; cumul par sport
assert.strictEqual(jourSemaine('2026-11-23'), 0); // lundi
assert(estTermine({ total: 10, faites: 10, echeance: '2027-01-01' }, '2026-11-19'));
assert(estTermine({ total: 10, faites: 2, echeance: '2026-11-19' }, '2026-11-19'));
assert(!estTermine({ total: 10, faites: 9, echeance: '2026-12-01' }, '2026-11-19'));
assert.deepStrictEqual(bilanParSport([
  { sport: 'ski', total: 10, faites: 10, echeance: '2027-01-01' },
  { sport: 'ski', total: 8, faites: 3, echeance: '2027-01-01' },
  { sport: 'velo', total: 6, faites: 6, echeance: '2026-10-01' },
], '2026-11-19'), { ski: { programmes: 2, termines: 1, faites: 13, prevues: 18 }, velo: { programmes: 1, termines: 1, faites: 6, prevues: 6 } });
console.log('OK', n, 'programmes');
