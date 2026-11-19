// Données + génération du programme. Fichier sans DOM : utilisable dans le navigateur et testé avec Node (test.js).

const ZONES = {
  nuque: 'Nuque', epaules: 'Épaules', poignets: 'Poignets', abdos: 'Abdos / tronc',
  lombaires: 'Lombaires', hanches: 'Hanches', fessiers: 'Fessiers', quadriceps: 'Quadriceps',
  ischios: 'Ischio-jambiers', genoux: 'Genoux', mollets: 'Mollets', chevilles: 'Chevilles',
};

// Muscles (ou structures) de chaque zone. Clés uniques : un exercice les liste dans `muscles`.
const MUSCLES = {
  nuque: { trapeze_sup: 'Trapèze supérieur', cou_prof: 'Fléchisseurs profonds du cou' },
  epaules: { deltoides: 'Deltoïdes', coiffe: 'Coiffe des rotateurs', rhomboides: 'Rhomboïdes / trapèze moyen' },
  poignets: { flech_avb: 'Fléchisseurs de l’avant-bras', ext_avb: 'Extenseurs de l’avant-bras' },
  abdos: { grand_droit: 'Grand droit', obliques: 'Obliques', transverse: 'Transverse' },
  lombaires: { erecteurs: 'Érecteurs du rachis', carre_lomb: 'Carré des lombes' },
  hanches: { flech_hanche: 'Fléchisseurs de hanche (psoas)', adducteurs: 'Adducteurs', abducteurs: 'Abducteurs' },
  fessiers: { grand_fessier: 'Grand fessier', moyen_fessier: 'Moyen fessier' },
  quadriceps: { droit_femoral: 'Droit fémoral', vastes: 'Vastes' },
  ischios: { biceps_fem: 'Biceps fémoral', semi: 'Semi-tendineux / semi-membraneux' },
  genoux: { vmo: 'Vaste interne (VMO)', rotulien: 'Tendon rotulien', proprio_genou: 'Proprioception du genou' },
  mollets: { gastro: 'Gastrocnémiens', soleaire: 'Soléaire' },
  chevilles: { fibulaires: 'Fibulaires (péroniers)', achille: 'Tendon d’Achille', proprio_cheville: 'Proprioception de la cheville' },
};

// Zones prioritaires par sport, de la plus à la moins importante.
// glisse : on demande le niveau technique plutôt que la fréquence de pratique (saison courte).
const SPORTS = {
  ski:        { nom: 'Ski',          glisse: true, zones: ['genoux', 'quadriceps', 'abdos', 'hanches', 'chevilles', 'ischios'] },
  snowboard:  { nom: 'Snowboard',    glisse: true, zones: ['genoux', 'chevilles', 'abdos', 'poignets', 'epaules', 'fessiers'] },
  surf:       { nom: 'Surf',         glisse: true, zones: ['epaules', 'lombaires', 'abdos', 'hanches', 'genoux', 'chevilles'] },
  course:     { nom: 'Course à pied', zones: ['chevilles', 'mollets', 'genoux', 'hanches', 'fessiers', 'abdos'] },
  velo:       { nom: 'Vélo',         zones: ['lombaires', 'abdos', 'fessiers', 'quadriceps', 'nuque', 'hanches'] },
  natation:   { nom: 'Natation',     zones: ['epaules', 'abdos', 'lombaires', 'nuque', 'fessiers'] },
};

const AGES = ['15-19', '20-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66+'];

// niveau des exercices : 1 débutant -> 3 avancé
const FREQUENCES = {
  '0':   { label: "Moins d'1 fois par semaine", niveau: 1 },
  '1-2': { label: '1 à 2 fois par semaine',     niveau: 1 },
  '3-4': { label: '3 à 4 fois par semaine',     niveau: 2 },
  '5+':  { label: '5 fois ou plus par semaine', niveau: 3 },
};
// Ski / snowboard / surf. bonus : séries en plus pour l'expert.
const NIVEAUX_GLISSE = {
  debutant:      { label: 'Débutant',      niveau: 1 },
  intermediaire: { label: 'Intermédiaire', niveau: 2 },
  confirme:      { label: 'Confirmé',      niveau: 3 },
  expert:        { label: 'Expert',        niveau: 3, bonus: 1 },
};

// shortcut: nb d'exos estimé (échauffement + retour au calme ≈ 15 min, ~5 min par exo), à affiner avec les séries réelles.
const DUREES = {
  '30': { label: '30 min', exos: 3 },
  '45': { label: '45 min', exos: 5 },
  '60': { label: '1 h', exos: 7 },
  '90': { label: '1 h 30', exos: 10 },
};

// séries en plus/en moins, niveau des exos en plus/en moins, repos entre les séries
const INTENSITES = {
  legere:  { label: 'Légère',  series: -1, niveau: -1, repos: '60-90 s' },
  moderee: { label: 'Modérée', series: 0,  niveau: 0,  repos: '45-60 s' },
  intense: { label: 'Intense', series: 1,  niveau: 0,  repos: '30-45 s' },
};

const MATERIEL = {
  elastique: 'Élastique', halteres: 'Haltères', kettlebell: 'Kettlebell',
  banc: 'Banc, chaise ou marche', swissball: 'Swiss ball',
};

// type : gainage | renfo | pliométrie | mobilité ; niveau : 1 débutant -> 3 avancé ; materiel : tout ce qui est requis (vide = aucun)
const EXOS = [
  { nom: 'Planche (gainage ventral)', zones: ['abdos', 'lombaires', 'epaules'], muscles: ['transverse', 'grand_droit', 'erecteurs', 'deltoides'], type: 'gainage', niveau: 1, dose: '20-45 s', desc: 'Appui avant-bras et pointes de pieds, corps aligné, nombril rentré, ne pas creuser le dos.' },
  { nom: 'Planche latérale', zones: ['abdos', 'hanches'], muscles: ['obliques', 'abducteurs'], type: 'gainage', niveau: 1, dose: '20-40 s / côté', desc: 'Sur un avant-bras, hanches hautes, corps en ligne droite. Genoux au sol pour faciliter.' },
  { nom: 'Dead bug', zones: ['abdos', 'lombaires'], muscles: ['transverse', 'grand_droit'], type: 'gainage', niveau: 1, dose: '8-10 / côté', desc: 'Sur le dos, bras et genoux à 90°. Tendre bras et jambe opposés en gardant le bas du dos collé au sol.' },
  { nom: 'Bird dog', zones: ['lombaires', 'fessiers', 'abdos'], muscles: ['erecteurs', 'carre_lomb', 'grand_fessier', 'transverse'], type: 'gainage', niveau: 1, dose: '8-10 / côté', desc: 'À quatre pattes, tendre bras et jambe opposés sans bouger le bassin. Tenir 2 s.' },
  { nom: 'Hollow body', zones: ['abdos'], muscles: ['grand_droit', 'transverse'], type: 'gainage', niveau: 2, dose: '15-30 s', desc: 'Sur le dos, bras et jambes tendus décollés du sol, bas du dos plaqué. Position « banane ».' },
  { nom: 'Pallof press', zones: ['abdos', 'hanches'], muscles: ['obliques', 'transverse'], materiel: ['elastique'], type: 'gainage', niveau: 2, dose: '10 / côté', desc: 'Élastique fixé sur le côté, pousser les mains devant la poitrine sans laisser le buste tourner.' },
  { nom: 'Copenhagen plank', zones: ['hanches', 'abdos'], muscles: ['adducteurs', 'obliques'], materiel: ['banc'], type: 'gainage', niveau: 3, dose: '15-25 s / côté', desc: 'Planche latérale, jambe du dessus posée sur un banc : renforce les adducteurs.' },
  { nom: 'Mountain climbers', zones: ['abdos', 'epaules'], muscles: ['grand_droit', 'deltoides'], type: 'gainage', niveau: 2, dose: '30 s', desc: 'En position de pompe, ramener alternativement les genoux vers la poitrine, bassin stable.' },
  { nom: 'Superman', zones: ['lombaires', 'fessiers'], muscles: ['erecteurs', 'grand_fessier'], type: 'renfo', niveau: 1, dose: '10-12', desc: 'À plat ventre, décoller bras et jambes quelques centimètres, regard vers le sol. Tenir 2 s.' },
  { nom: 'Pont fessier', zones: ['fessiers', 'ischios', 'lombaires'], muscles: ['grand_fessier', 'semi', 'erecteurs'], type: 'renfo', niveau: 1, dose: '12-15', desc: 'Sur le dos, pieds au sol, monter le bassin en serrant les fessiers. Ne pas cambrer.' },
  { nom: 'Pont fessier unipodal', zones: ['fessiers', 'ischios'], muscles: ['grand_fessier', 'moyen_fessier', 'biceps_fem'], type: 'renfo', niveau: 2, dose: '10 / jambe', desc: 'Comme le pont fessier, sur une seule jambe, bassin bien horizontal.' },
  { nom: 'Squat poids du corps', zones: ['quadriceps', 'fessiers', 'genoux'], muscles: ['vastes', 'droit_femoral', 'grand_fessier'], type: 'renfo', niveau: 1, dose: '12-15', desc: 'Pieds largeur d’épaules, descendre en poussant les fesses en arrière, genoux dans l’axe des pieds.' },
  { nom: 'Chaise contre le mur', zones: ['quadriceps', 'genoux'], muscles: ['vastes', 'vmo'], type: 'renfo', niveau: 1, dose: '30-60 s', desc: 'Dos au mur, cuisses parallèles au sol, genoux au-dessus des chevilles. Idéal pour le ski.' },
  { nom: 'Fente avant', zones: ['quadriceps', 'fessiers', 'genoux'], muscles: ['vastes', 'droit_femoral', 'grand_fessier'], type: 'renfo', niveau: 2, dose: '10 / jambe', desc: 'Grand pas en avant, descendre le genou arrière vers le sol. Genou avant aligné avec le pied.' },
  { nom: 'Squat bulgare', zones: ['quadriceps', 'fessiers', 'genoux'], muscles: ['vastes', 'grand_fessier', 'moyen_fessier', 'vmo'], materiel: ['banc'], type: 'renfo', niveau: 3, dose: '8-10 / jambe', desc: 'Pied arrière posé sur un banc, descendre sur la jambe avant en contrôlant le genou.' },
  { nom: 'Step-down excentrique', zones: ['genoux', 'quadriceps'], muscles: ['vmo', 'rotulien', 'vastes'], materiel: ['banc'], type: 'renfo', niveau: 2, dose: '8-10 / jambe', desc: 'Debout sur une marche, descendre lentement (3 s) le talon opposé vers le sol, genou dans l’axe.' },
  { nom: 'Extension du genou à l’élastique (TKE)', zones: ['genoux', 'quadriceps'], muscles: ['vmo', 'vastes'], materiel: ['elastique'], type: 'renfo', niveau: 1, dose: '15', desc: 'Élastique derrière le genou, tendre complètement la jambe en contractant le quadriceps.' },
  { nom: 'Nordic hamstring curl', zones: ['ischios', 'genoux'], muscles: ['biceps_fem', 'semi'], type: 'renfo', niveau: 3, dose: '5-8', desc: 'À genoux, chevilles bloquées, se laisser tomber vers l’avant le plus lentement possible.' },
  { nom: 'Soulevé de terre unipodal', zones: ['ischios', 'fessiers', 'chevilles'], muscles: ['biceps_fem', 'semi', 'grand_fessier', 'proprio_cheville'], type: 'renfo', niveau: 2, dose: '8-10 / jambe', desc: 'Sur une jambe, pencher le buste en avant dos droit en tendant l’autre jambe derrière.' },
  { nom: 'Marche latérale à l’élastique', zones: ['hanches', 'fessiers', 'genoux'], muscles: ['abducteurs', 'moyen_fessier', 'proprio_genou'], materiel: ['elastique'], type: 'renfo', niveau: 1, dose: '10 pas / côté', desc: 'Élastique au-dessus des genoux, semi-fléchi, pas latéraux sans laisser les genoux rentrer.' },
  { nom: 'Clamshell', zones: ['hanches', 'fessiers'], muscles: ['abducteurs', 'moyen_fessier'], type: 'renfo', niveau: 1, dose: '15 / côté', desc: 'Allongé sur le côté, genoux pliés, ouvrir le genou du dessus sans basculer le bassin.' },
  { nom: 'Élévations des mollets', zones: ['mollets', 'chevilles'], muscles: ['gastro', 'achille'], type: 'renfo', niveau: 1, dose: '15-20', desc: 'Debout, monter sur la pointe des pieds puis redescendre lentement.' },
  { nom: 'Mollets excentriques sur marche', zones: ['mollets', 'chevilles'], muscles: ['gastro', 'soleaire', 'achille'], materiel: ['banc'], type: 'renfo', niveau: 2, dose: '10-12 / jambe', desc: 'Monter sur deux pieds, redescendre sur un seul en 3 s, talon sous le niveau de la marche.' },
  { nom: 'Équilibre unipodal', zones: ['chevilles', 'genoux'], muscles: ['proprio_cheville', 'fibulaires', 'proprio_genou'], type: 'renfo', niveau: 1, dose: '30 s / jambe', desc: 'Tenir sur une jambe, genou légèrement fléchi. Progresser : yeux fermés, puis sur coussin.' },
  { nom: 'Éversion de cheville à l’élastique', zones: ['chevilles'], muscles: ['fibulaires'], materiel: ['elastique'], type: 'renfo', niveau: 1, dose: '15 / côté', desc: 'Assis, élastique autour de l’avant du pied, tourner le pied vers l’extérieur contre la résistance.' },
  { nom: 'Rotations externes d’épaule', zones: ['epaules'], muscles: ['coiffe'], materiel: ['elastique'], type: 'renfo', niveau: 1, dose: '12-15 / bras', desc: 'Coude collé au corps à 90°, tourner l’avant-bras vers l’extérieur contre un élastique.' },
  { nom: 'Y-T-W allongé', zones: ['epaules', 'nuque'], muscles: ['rhomboides', 'coiffe', 'trapeze_sup'], type: 'renfo', niveau: 1, dose: '8 de chaque lettre', desc: 'À plat ventre, lever les bras en formant Y, T puis W, omoplates serrées, pouces vers le haut.' },
  { nom: 'Pompes', zones: ['epaules', 'abdos', 'poignets'], muscles: ['deltoides', 'transverse', 'ext_avb'], type: 'renfo', niveau: 2, dose: '8-15', desc: 'Corps gainé, descendre la poitrine près du sol. Sur les genoux pour faciliter.' },
  { nom: 'Rétraction du menton', zones: ['nuque'], muscles: ['cou_prof'], type: 'renfo', niveau: 1, dose: '10 × 5 s', desc: 'Assis droit, reculer le menton (« double menton ») sans baisser la tête. Tenir 5 s.' },
  { nom: 'Flexion / extension des poignets', zones: ['poignets'], muscles: ['flech_avb', 'ext_avb'], type: 'renfo', niveau: 1, dose: '15 / sens', desc: 'Avant-bras posé sur la cuisse, petite charge (bouteille), monter et descendre le poignet.' },
  { nom: 'Sauts latéraux (skater)', zones: ['quadriceps', 'genoux', 'chevilles', 'hanches'], muscles: ['vastes', 'proprio_genou', 'proprio_cheville', 'abducteurs'], type: 'pliométrie', niveau: 3, dose: '10 / côté', desc: 'Sauter latéralement d’un pied sur l’autre, réception amortie, genou dans l’axe.' },
  { nom: 'Squat sauté', zones: ['quadriceps', 'fessiers'], muscles: ['vastes', 'droit_femoral', 'grand_fessier'], type: 'pliométrie', niveau: 3, dose: '8-10', desc: 'Squat puis saut vertical explosif, réception souple sur l’avant des pieds.' },
  { nom: 'Goblet squat', zones: ['quadriceps', 'fessiers', 'genoux'], muscles: ['vastes', 'grand_fessier', 'vmo'], materiel: ['kettlebell'], type: 'renfo', niveau: 1, dose: '10-12', desc: 'Kettlebell tenue contre la poitrine, squat profond buste droit, genoux dans l’axe des pieds.' },
  { nom: 'Swing kettlebell', zones: ['fessiers', 'ischios', 'lombaires'], muscles: ['grand_fessier', 'biceps_fem', 'erecteurs'], materiel: ['kettlebell'], type: 'renfo', niveau: 2, dose: '15', desc: 'Charnière de hanche, projeter la kettlebell à hauteur de poitrine par la poussée des hanches, dos droit.' },
  { nom: 'Fentes avec haltères', zones: ['quadriceps', 'fessiers', 'genoux'], muscles: ['vastes', 'grand_fessier', 'vmo'], materiel: ['halteres'], type: 'renfo', niveau: 2, dose: '8-10 / jambe', desc: 'Un haltère dans chaque main, fente avant contrôlée, genou avant aligné avec le pied.' },
  { nom: 'Soulevé de terre roumain aux haltères', zones: ['ischios', 'fessiers', 'lombaires'], muscles: ['biceps_fem', 'semi', 'grand_fessier', 'erecteurs'], materiel: ['halteres'], type: 'renfo', niveau: 2, dose: '10-12', desc: 'Jambes quasi tendues, descendre les haltères le long des cuisses en poussant les fesses en arrière, dos plat.' },
  { nom: 'Rowing haltère', zones: ['epaules', 'lombaires'], muscles: ['rhomboides', 'deltoides', 'erecteurs'], materiel: ['halteres'], type: 'renfo', niveau: 1, dose: '10-12 / bras', desc: 'Buste penché dos plat, tirer l’haltère vers la hanche en serrant l’omoplate.' },
  { nom: 'Développé épaules aux haltères', zones: ['epaules', 'abdos'], muscles: ['deltoides', 'transverse'], materiel: ['halteres'], type: 'renfo', niveau: 2, dose: '8-12', desc: 'Debout gainé, pousser les haltères au-dessus de la tête sans cambrer.' },
  { nom: 'Élévations des mollets lestées', zones: ['mollets', 'chevilles'], muscles: ['gastro', 'soleaire', 'achille'], materiel: ['halteres'], type: 'renfo', niveau: 2, dose: '12-15', desc: 'Haltères en main, monter sur la pointe des pieds puis redescendre lentement.' },
  { nom: 'Marche du fermier', zones: ['poignets', 'abdos', 'nuque'], muscles: ['flech_avb', 'obliques', 'trapeze_sup'], materiel: ['halteres'], type: 'gainage', niveau: 1, dose: '30-40 m', desc: 'Marcher en tenant des haltères lourds le long du corps, épaules basses, buste droit.' },
  { nom: 'Gainage sur swiss ball', zones: ['abdos', 'epaules'], muscles: ['transverse', 'grand_droit', 'deltoides'], materiel: ['swissball'], type: 'gainage', niveau: 2, dose: '20-40 s', desc: 'Planche avant-bras posés sur le ballon, corps aligné, sans laisser le ballon rouler.' },
  { nom: 'Leg curl au swiss ball', zones: ['ischios', 'fessiers'], muscles: ['biceps_fem', 'semi', 'grand_fessier'], materiel: ['swissball'], type: 'renfo', niveau: 2, dose: '8-12', desc: 'Sur le dos, talons sur le ballon, bassin levé, ramener le ballon vers les fesses.' },
  { nom: 'Woodchop à l’élastique', zones: ['abdos'], muscles: ['obliques', 'transverse'], materiel: ['elastique'], type: 'gainage', niveau: 2, dose: '10 / côté', desc: 'Élastique fixé en hauteur, tirer en diagonale vers la hanche opposée en tournant le buste, bassin stable.' },
  { nom: 'Face pull à l’élastique', zones: ['epaules', 'nuque'], muscles: ['coiffe', 'rhomboides', 'trapeze_sup'], materiel: ['elastique'], type: 'renfo', niveau: 1, dose: '12-15', desc: 'Élastique à hauteur du visage, tirer vers le front en écartant les coudes, omoplates serrées.' },
  { nom: 'Montée sur banc (step-up)', zones: ['quadriceps', 'fessiers', 'genoux'], muscles: ['vastes', 'grand_fessier', 'vmo', 'proprio_genou'], materiel: ['banc'], type: 'renfo', niveau: 1, dose: '10 / jambe', desc: 'Monter sur un banc stable en poussant sur la jambe d’appui, redescendre lentement, genou dans l’axe.' },
  { nom: 'Ouverture thoracique (open book)', zones: ['lombaires', 'epaules'], muscles: ['erecteurs', 'rhomboides'], type: 'mobilité', niveau: 1, dose: '8 / côté', desc: 'Allongé sur le côté, genoux pliés, ouvrir le bras du dessus vers l’arrière en suivant du regard.' },
  { nom: 'Étirement des fléchisseurs de hanche', zones: ['hanches', 'quadriceps'], muscles: ['flech_hanche', 'droit_femoral'], type: 'mobilité', niveau: 1, dose: '30 s / côté', desc: 'Fente basse genou au sol, avancer doucement le bassin, buste droit.' },
  { nom: 'Étirement des mollets au mur', zones: ['mollets', 'chevilles'], muscles: ['gastro', 'achille'], type: 'mobilité', niveau: 1, dose: '30 s / jambe', desc: 'Mains au mur, jambe arrière tendue talon au sol, pencher le corps vers l’avant.' },
  { nom: 'Étirement des ischios', zones: ['ischios', 'lombaires'], muscles: ['biceps_fem', 'semi'], type: 'mobilité', niveau: 1, dose: '30 s / jambe', desc: 'Sur le dos, jambe tendue levée tenue avec une serviette, sans forcer.' },
  { nom: 'Mobilité de la nuque', zones: ['nuque', 'epaules'], muscles: ['trapeze_sup', 'cou_prof'], type: 'mobilité', niveau: 1, dose: '5 / sens', desc: 'Inclinaisons et rotations lentes de la tête, sans douleur.' },
];

// muscle vide = tous les muscles de la zone
const exosParZone = (zone, muscle) => EXOS.filter(e => e.zones.includes(zone) && (!muscle || e.muscles.includes(muscle)));

EXOS.forEach(e => e.materiel ??= []);

const STATUTS = { faite: 'Faite', retard: 'En retard', 'a-venir': 'À venir' };
// dates ISO comparées en texte : la séance du jour n'est en retard qu'à partir du lendemain
const statutSeance = (s, faites, aujourdhui) => faites.includes(s.numero) ? 'faite' : s.date < aujourdhui ? 'retard' : 'a-venir';

const MAX_SEANCES_SEMAINE = 6; // au moins un jour de repos par semaine
const JOURS_SEMAINE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const JOUR = 864e5;
const ajouterJours = (iso, n) => new Date(Date.parse(iso) + n * JOUR).toISOString().slice(0, 10);
const jourSemaine = iso => (new Date(Date.parse(iso)).getUTCDay() + 6) % 7; // 0 = lundi

// Progrès. x : { sport, debut, echeance, total, faites } (faites = nombre de séances cochées)
// terminé = échéance atteinte ou toutes les séances faites
const estTermine = (x, aujourdhui) => x.faites >= x.total || x.echeance <= aujourdhui;
function bilanParSport(programmes, aujourdhui) {
  const b = {};
  for (const x of programmes) {
    const s = b[x.sport] ??= { programmes: 0, termines: 0, faites: 0, prevues: 0 };
    s.programmes++; s.faites += x.faites; s.prevues += x.total;
    if (estTermine(x, aujourdhui)) s.termines++;
  }
  return b;
}

// p : sport, age, sexe, frequence | niveau (glisse), taille, poids,
//     debut / echeance ('YYYY-MM-DD'), duree (clé DUREES), seancesSemaine (1-6), jours (0 lundi -> 6 dimanche, [] = au choix), intensite (clé INTENSITES), materiel (clés MATERIEL, [] = sans)
function genererProgramme(p) {
  const jours = Math.round((Date.parse(p.echeance) - Date.parse(p.debut)) / JOUR);
  if (!(jours > 0)) throw new Error("La date d'échéance doit être après la date de début.");
  const joursPref = (p.jours || []).map(Number);
  if (joursPref.length > MAX_SEANCES_SEMAINE) throw new Error(`${MAX_SEANCES_SEMAINE} séances par semaine maximum : garde au moins un jour de repos.`);
  const parSemaine = joursPref.length || Math.min(MAX_SEANCES_SEMAINE, Math.max(1, Math.round(+p.seancesSemaine) || 1));
  const glisse = SPORTS[p.sport].glisse;
  const base = glisse ? NIVEAUX_GLISSE[p.niveau] : FREQUENCES[p.frequence];
  const materiel = p.materiel || [];
  const intensite = INTENSITES[p.intensite] || INTENSITES.moderee;
  const ageMin = parseInt(p.age, 10);
  const imc = p.poids / ((p.taille / 100) ** 2);
  const notes = [];

  let niveau = Math.max(1, base.niveau + intensite.niveau);
  if (ageMin >= 51 && niveau > 2) { niveau = 2; notes.push('Après 50 ans, on privilégie le contrôle et la mobilité plutôt que les exercices les plus intenses.'); }
  const sansImpact = ageMin >= 51 || imc >= 30;
  if (imc >= 30) notes.push('IMC ≥ 30 : exercices sans sauts pour préserver les articulations.');
  if (ageMin < 20) notes.push('15-19 ans : charges légères, la technique avant la charge.');

  let zones = [...SPORTS[p.sport].zones];
  // Les femmes ont un risque plus élevé de rupture du LCA : on renforce le contrôle hanche/genou.
  if (p.sexe === 'femme' && !zones.slice(0, 3).includes('hanches')) {
    zones = zones.filter(z => z !== 'hanches');
    zones.splice(1, 0, 'hanches');
    notes.push('Accent sur la stabilité hanche/genou (prévention des blessures du ligament croisé).');
  }

  const pool = EXOS.filter(e => e.type !== 'mobilité' && e.niveau <= niveau && !(sansImpact && e.type === 'pliométrie')
    && e.materiel.every(m => materiel.includes(m)));
  const mobilite = EXOS.filter(e => e.type === 'mobilité' && e.zones.some(z => zones.includes(z)));
  const nb = DUREES[p.duree].exos;
  const usage = new Map();
  const use = e => usage.get(e) || 0;
  // le moins utilisé d'abord (rotation d'une séance à l'autre), puis avec le matériel choisi, puis le plus difficile
  const tri = (a, b) => use(a) - use(b) || b.materiel.length - a.materiel.length || b.niveau - a.niveau;

  // Chaque séance est composée à part : zones en rotation et exos les moins faits jusque-là.
  function composer(k, niveauMax) {
    const dispo = pool.filter(e => e.niveau <= niveauMax);
    const ordre = zones.slice(k % zones.length).concat(zones.slice(0, k % zones.length));
    const choisis = [];
    for (let i = 0; choisis.length < nb && i < ordre.length * nb; i++) {
      const c = dispo.filter(e => e.zones.includes(ordre[i % ordre.length]) && !choisis.includes(e)).sort(tri)[0];
      if (c) choisis.push(c);
    }
    // pas assez d'exos sur les zones du sport : on complète avec le reste
    for (const e of dispo.filter(e => !choisis.includes(e)).sort(tri)) if (choisis.length < nb) choisis.push(e);
    // matériel coché mais pas utilisé (séance courte) : on remplace un exo par un exo avec matériel sur une zone du sport
    if (materiel.length && !choisis.some(e => e.materiel.length)) {
      const m = dispo.filter(e => e.materiel.length && e.zones.some(z => zones.includes(z))).sort(tri)[0];
      const i = choisis.findLastIndex(e => e.type !== 'gainage');
      if (m) choisis[i < 0 ? choisis.length - 1 : i] = m;
    }
    if (!choisis.some(e => e.type === 'gainage')) {
      const g = dispo.filter(e => e.type === 'gainage' && !choisis.includes(e)).sort(tri)[0];
      const i = choisis.findLastIndex(e => !e.materiel.length); // garder les exos avec matériel
      choisis[i < 0 ? choisis.length - 1 : i] = g;
    }
    // même combinaison que la séance de la semaine d'avant : on change un exo
    const avant = seances[k - parSemaine];
    if (avant && choisis.every(e => avant.exos.includes(e))) {
      const autre = dispo.filter(e => !choisis.includes(e)).sort(tri)[0];
      let i = choisis.findLastIndex(e => e.type !== 'gainage' && !e.materiel.length);
      if (i < 0) i = choisis.findLastIndex(e => e.type !== 'gainage');
      if (autre && i >= 0) choisis[i] = autre;
    }
    choisis.forEach(e => usage.set(e, use(e) + 1));
    const calme = [0, 1].map(j => mobilite[(2 * k + j) % mobilite.length]).filter((e, j, a) => a.indexOf(e) === j);
    return { exos: choisis, calme };
  }

  // Séances du début à la veille de l'échéance (sur les jours préférés s'il y en a), avec une progression en 3 phases.
  const dates = joursPref.length
    ? Array.from({ length: jours }, (_, d) => ajouterJours(p.debut, d)).filter(d => joursPref.includes(jourSemaine(d)))
    : Array.from({ length: Math.max(1, Math.round(jours / 7 * parSemaine)) }, (_, k) => ajouterJours(p.debut, Math.floor(k * 7 / parSemaine)));
  if (!dates.length) throw new Error("Aucun de tes jours préférés ne tombe entre le début et l'échéance.");
  const total = dates.length;
  const series0 = niveau + 1 + (base.bonus || 0) + intensite.series;
  const seances = [];
  for (let k = 0; k < total; k++) {
    const jour = Math.round((Date.parse(dates[k]) - Date.parse(p.debut)) / JOUR);
    let phase = 'Progression', series = series0 + 1, niveauMax = niveau;
    if (jours < 21) { phase = 'Préparation'; series = series0; }
    else if (k >= total - parSemaine) { phase = 'Affûtage'; series = series0 - 1; }
    // adaptation : exos un cran plus faciles avant d'attaquer ceux de son niveau
    else if (k < (total - parSemaine) / 3) { phase = 'Adaptation'; series = series0; niveauMax = Math.max(1, niveau - 1); }
    seances.push({ numero: k + 1, date: dates[k], semaine: Math.floor(jour / 7) + 1, phase,
      series: Math.min(5, Math.max(1, series)), ...composer(k, niveauMax) });
  }
  if (jours >= 21) notes.push('Adaptation (exos plus simples) → progression (exos de ton niveau, +1 série) → affûtage la dernière semaine (volume réduit pour arriver en forme). Les exercices changent d’une séance à l’autre.');

  return { niveau, imc: Math.round(imc * 10) / 10, zones, seances, notes, semaines: Math.ceil(jours / 7) };
}

if (typeof module !== 'undefined') module.exports = { ZONES, MUSCLES, SPORTS, AGES, FREQUENCES, INTENSITES, NIVEAUX_GLISSE, DUREES, MATERIEL, EXOS, exosParZone, STATUTS, statutSeance, MAX_SEANCES_SEMAINE, JOURS_SEMAINE, ajouterJours, jourSemaine, estTermine, bilanParSport, genererProgramme };
