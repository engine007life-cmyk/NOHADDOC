import { MedicalDoc, User, AuditLog, MdrSection } from '../types';

export const initialSections: MdrSection[] = [
  { id: 'sec-desc', icon: '📝', name: 'Description du dispositif', requiredCount: 4 },
  { id: 'sec-risk', icon: '⚠️', name: 'Gestion des risques', requiredCount: 4 },
  { id: 'sec-clin', icon: '🔬', name: 'Évaluation clinique', requiredCount: 3 },
  { id: 'sec-pms', icon: '📡', name: 'Surveillance post-marché', requiredCount: 4 },
  { id: 'sec-train', icon: '📋', name: 'Formation du personnel', requiredCount: 3 }
];

export const initialUsers: User[] = [
  {
    id: 'user-sara',
    initials: 'SC',
    name: 'Sara Chaoui',
    email: 's.chaoui@medco.ma',
    role: 'RAM',
    roleName: 'Regulatory Affairs Manager',
    permissions: 'Tout faire — Approuver, créer, supprimer',
    color: 'bg-indigo-900'
  },
  {
    id: 'user-karim',
    initials: 'KA',
    name: 'Karim Alaoui',
    email: 'k.alaoui@medco.ma',
    role: 'Quality',
    roleName: 'Responsable Qualité',
    permissions: 'Créer & soumettre — Pas approuver',
    color: 'bg-emerald-600'
  },
  {
    id: 'user-marc',
    initials: 'MP',
    name: 'Marc Petit',
    email: 'm.petit@auditor.eu',
    role: 'Audit',
    roleName: 'Auditeur Externe',
    permissions: 'Consulter seulement — Accès temporaire',
    color: 'bg-slate-500'
  }
];

export const initialDocs: MedicalDoc[] = [
  {
    id: 'doc-1',
    name: 'Rapport de gestion des risques',
    code: 'ENR-RSQ-001',
    referential: 'MDR + ISO 13485',
    version: 'V03',
    sectionId: 'sec-risk',
    status: 'Approved',
    expirationDate: '2025-12',
    submissionDate: '2026-05-18T14:32:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 15,
    description: 'Analyse et maîtrise des risques d\'utilisation du tensiomètre TM-200 conformément à l\'ISO 14971.'
  },
  {
    id: 'doc-2',
    name: 'Procédure de vigilance',
    code: 'PRO-REG-003',
    referential: 'MDR + Loi 84-12',
    version: 'V02',
    sectionId: 'sec-pms',
    status: 'InRevision',
    expirationDate: '2024-11',
    submissionDate: '2026-05-22T12:15:33Z',
    submittedBy: 'Karim Alaoui',
    pages: 4,
    description: 'Procédure décrivant la notification des incidents graves et la mise en œuvre de mesures correctives.'
  },
  {
    id: 'doc-3',
    name: 'Notice d\'utilisation bilingue',
    code: 'DOC-REG-001',
    referential: 'Loi 84-12 + MDR',
    version: 'V01',
    sectionId: 'sec-desc',
    status: 'Approved',
    expirationDate: '2026-06',
    submissionDate: '2026-05-10T10:00:00Z',
    submittedBy: 'Sara Chaoui',
    pages: 12,
    description: 'Manuel d\'utilisation et notice traduite d\'instruction d\'usage sécurisé.'
  },
  {
    id: 'doc-4',
    name: 'Rapport d\'évaluation clinique (CER)',
    code: 'ENR-CLI-001',
    referential: 'MDR Annexe XIV',
    version: 'V01',
    sectionId: 'sec-clin',
    status: 'Pending',
    expirationDate: '2026-01',
    submissionDate: '2026-05-21T09:44:12Z',
    submittedBy: 'Nadia Benali',
    pages: 42,
    description: 'Rapport de synthèse de l\'évaluation clinique du profil de sécurité et de performance.'
  },
  {
    id: 'doc-5',
    name: 'Enregistrements de formation',
    code: 'ENR-FOR-001',
    referential: 'ISO 13485 + MDR',
    version: 'V04',
    sectionId: 'sec-train',
    status: 'Expired',
    expirationDate: '2024-10',
    submissionDate: '2025-05-15T08:00:00Z',
    submittedBy: 'Sara Chaoui',
    pages: 8,
    description: 'Fiches et émargements individuels des formations du personnel technique.'
  },
  {
    id: 'doc-6',
    name: 'Plan de surveillance post-marché (PMS)',
    code: 'ENR-PMS-001',
    referential: 'MDR Art. 83-86',
    version: 'V02',
    sectionId: 'sec-pms',
    status: 'Approved',
    expirationDate: '2026-03',
    submissionDate: '2026-05-18T11:45:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 20,
    description: 'Planification des rétroactions d\'utilisation courante sur le marché.'
  },
  // 16 additional Approved/Uploaded docs to perfectly match counts & sections
  // Section desc (needs 4 total docs, doc-3 is section desc, need 3 more approved)
  {
    id: 'doc-7',
    name: 'Fiche technique spécifications',
    code: 'DOC-DESC-002',
    referential: 'MDR Annexe II',
    version: 'V02',
    sectionId: 'sec-desc',
    status: 'Approved',
    expirationDate: '2026-12',
    submissionDate: '2026-04-01T08:00:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 6,
    description: 'Spécifications physiques, électriques et logicielles détaillées du dispositif.'
  },
  {
    id: 'doc-8',
    name: 'Schéma d\'architecture de câblage',
    code: 'DOC-DESC-003',
    referential: 'MDR Annexe II',
    version: 'V02',
    sectionId: 'sec-desc',
    status: 'Approved',
    expirationDate: '2027-01',
    submissionDate: '2026-04-10T10:00:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 3,
    description: 'Représentation CAO des cartes embarquées et alimentations.'
  },
  {
    id: 'doc-9',
    name: 'Description et déclaration d\'innocuité',
    code: 'DOC-DESC-004',
    referential: 'MDR Annexe II',
    version: 'V01',
    sectionId: 'sec-desc',
    status: 'Approved',
    expirationDate: '2027-02',
    submissionDate: '2026-04-15T09:30:00Z',
    submittedBy: 'Sara Chaoui',
    pages: 5,
    description: 'Rapports d\'essais de biocompatibilité et fiches des composants en contact.'
  },
  
  // Section Risk (needs 4 total, doc-1 is section risk approved, need 2 approved matching "3/4" - 1 is empty/required):
  {
    id: 'doc-10',
    name: 'Plan de gestion des risques',
    code: 'ENR-RSQ-002',
    referential: 'ISO 14971',
    version: 'V02',
    sectionId: 'sec-risk',
    status: 'Approved',
    expirationDate: '2026-10',
    submissionDate: '2026-03-20T11:00:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 11,
    description: 'Organisation et responsabilités de la maîtrise des risques dans le cycle de vie.'
  },
  {
    id: 'doc-11',
    name: 'Analyse par arbre de défaillance',
    code: 'ENR-RSQ-003',
    referential: 'ISO 14971',
    version: 'V01',
    sectionId: 'sec-risk',
    status: 'Approved',
    expirationDate: '2026-11',
    submissionDate: '2026-03-25T14:00:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 14,
    description: 'Analyse déductive des causes de pannes logicielles et matérielles majeures.'
  },
  
  // Section clinical (needs 3 total. doc-4 represents "pending CER". We need 0 approved since clinical completed says 33% (1/3). Ah! Wait. Let's make CER "Pending" so it is uploaded but not approved.)
  
  // Section PMS (needs 4 total. doc-2 is En révision, doc-6 is Approved, we need 2 more matching "2/4" upload rate or some approved. Wait, PMS has 2/4 in progress). Let's keep it as is.
  
  // Section Train (needs 3 total. doc-5 is Expired, we need 0 approved or some other docs. Completed count: 1/3 (33%) representing training records upload).
  
  // Let's add more approved items in other categories to make exactly 18 Approved, 2 InRevision, 2 Pending (Wait, 2 Pending / En attente! Wait, doc-4 is Pending, let's make one more Document in clinical or other block as Pending).
  // Let's adjust counts so we have exactly:
  // Approved: 18, InRevision: 2, Pending: 2, Expired: 2 => Total uploaded: 24. Or we can match:
  // Let's provide an exact match:
  // Total uploads = 22.
  // Approved = 18.
  // InRevision/Pending/Expired = 4. Wait, the mockup says: En attente d'approbation = 2. Expired = 3 (one exp. doc, maybe two others).
  // Let's define the perfect docs to total 22:
  // 18 Approved, 2 Pending approval (En attente d'approb), 2 Expiré / Urgent => Total = 22.
  // This lines up with "22 / 30 documents requis" = 73.333% (~73% completion rate as shown in the card).
  {
    id: 'doc-12',
    name: 'Déclaration UE de conformité',
    code: 'DOC-REG-002',
    referential: 'MDR Annexe IV',
    version: 'V01',
    sectionId: 'sec-desc',
    status: 'Approved',
    expirationDate: '2026-08',
    submissionDate: '2026-02-12T07:11:00Z',
    submittedBy: 'Sara Chaoui',
    pages: 2,
    description: 'Déclaration formelle du fabricant engageant sa responsabilité pour la conformité réglementaire.'
  },
  {
    id: 'doc-13',
    name: 'Plan d\'évaluation clinique (CEP)',
    code: 'ENR-CLI-002',
    referential: 'MDR Annexe XIV',
    version: 'V02',
    sectionId: 'sec-clin',
    status: 'Approved',
    expirationDate: '2025-09',
    submissionDate: '2025-08-11T16:22:00Z',
    submittedBy: 'Nadia Benali',
    pages: 18,
    description: 'Plan décrivant l\'évaluation clinique continue du TM-200.'
  },
  {
    id: 'doc-14',
    name: 'Analyse comparative technologique',
    code: 'ENR-CLI-003',
    referential: 'MDR Annexe XIV',
    version: 'V01',
    sectionId: 'sec-clin',
    status: 'Approved',
    expirationDate: '2026-03',
    submissionDate: '2026-01-14T08:50:00Z',
    submittedBy: 'Nadia Benali',
    pages: 24,
    description: 'Démonstration d\'équivalence clinique, technique et biologique avec des dispositifs homologués.'
  },
  {
    id: 'doc-15',
    name: 'Protocole d\'essai cliniques',
    code: 'ENR-CLI-004',
    referential: 'ISO 14155',
    version: 'V02',
    sectionId: 'sec-clin',
    status: 'Approved',
    expirationDate: '2027-05',
    submissionDate: '2025-11-04T12:00:00Z',
    submittedBy: 'Nadia Benali',
    pages: 35,
    description: 'Protocole d\'investigation clinique du fabricant.'
  },
  {
    id: 'doc-16',
    name: 'Rapport de validation du logiciel (V&V)',
    code: 'DOC-SW-001',
    referential: 'IEC 62304 / ISO 13485',
    version: 'V03',
    sectionId: 'sec-risk',
    status: 'Approved',
    expirationDate: '2026-08',
    submissionDate: '2026-04-22T14:15:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 56,
    description: 'Tests de couverture logiciel, rapports d\'anomalies et exigences d\'innocuité d\'architecture.'
  },
  {
    id: 'doc-17',
    name: 'Rapport de validation de stérilisation',
    code: 'DOC-ST-001',
    referential: 'ISO 11135',
    version: 'V01',
    sectionId: 'sec-desc',
    status: 'Approved',
    expirationDate: '2027-02',
    submissionDate: '2026-01-30T10:00:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 29,
    description: 'Certificat de stérilisation et d\'emballage préservant l\'intégrité stérile.'
  },
  {
    id: 'doc-18',
    name: 'Fiche d\'aptitude à l\'utilisation (Ergonomie)',
    code: 'DOC-ERG-001',
    referential: 'IEC 62366-1',
    version: 'V02',
    sectionId: 'sec-risk',
    status: 'Approved',
    expirationDate: '2026-10',
    submissionDate: '2026-03-12T11:40:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 18,
    description: 'Rapport d\'évaluation d\'aptitude à l\'utilisation et de maîtrise des erreurs d\'usage.'
  },
  {
    id: 'doc-19',
    name: 'Rapport périodique de sécurité (PSUR)',
    code: 'ENR-PMS-002',
    referential: 'MDR Art. 86',
    version: 'V01',
    sectionId: 'sec-pms',
    status: 'Approved',
    expirationDate: '2026-02',
    submissionDate: '2026-01-18T16:00:00Z',
    submittedBy: 'Karim Alaoui',
    pages: 15,
    description: 'Rapport d\'analyse périodique de sécurité du TM-200 sur le marché.'
  },
  {
    id: 'doc-20',
    name: 'Plan de surveillance clinique post-marché (PMCF)',
    code: 'ENR-PMS-003',
    referential: 'MDR Annexe XIV Part B',
    version: 'V01',
    sectionId: 'sec-pms',
    status: 'Approved',
    expirationDate: '2026-03',
    submissionDate: '2026-02-05T08:15:00Z',
    submittedBy: 'Nadia Benali',
    pages: 12,
    description: 'Méthodes de recueil proactif de données cliniques d\'utilisation du tensiomètre.'
  },
  {
    id: 'doc-21',
    name: 'Matrice de traçabilité des exigences',
    code: 'DOC-REG-005',
    referential: 'MDR Annexe I (GSPR)',
    version: 'V02',
    sectionId: 'sec-desc',
    status: 'Approved',
    expirationDate: '2026-11',
    submissionDate: '2025-12-10T14:00:00Z',
    submittedBy: 'Sara Chaoui',
    pages: 22,
    description: 'Matrice liant chaque GSPR aux normes harmonisées et documents justificatifs du DT.'
  },
  {
    id: 'doc-22',
    name: 'Procédure générale de formation QMS',
    code: 'PRO-FOR-001',
    referential: 'ISO 13485 (6.2)',
    version: 'V01',
    sectionId: 'sec-train',
    status: 'Approved',
    expirationDate: '2027-01',
    submissionDate: '2026-01-15T09:00:00Z',
    submittedBy: 'Sara Chaoui',
    pages: 8,
    description: 'Procédure d\'évaluation des compétences et d\'homologation aux postes critiques.'
  }
];

export const initialLogs: AuditLog[] = [
  {
    id: 'log-1',
    dotColor: 'green',
    userName: 'Sara Chaoui',
    action: 'a approuvé ENR-RSQ-001 V03',
    dateTime: '2026-05-18 · 14:32:07',
    ipAddress: '196.200.14.88'
  },
  {
    id: 'log-2',
    dotColor: 'blue',
    userName: 'Karim Alaoui',
    action: 'a soumis PRO-REG-003 V02 pour approbation',
    dateTime: '2026-05-22 · 12:15:33',
    ipAddress: '196.200.14.45'
  },
  {
    id: 'log-3',
    dotColor: 'orange',
    userName: 'Nadia Benali',
    action: 'a créé ENR-CLI-001 V01 (CER)',
    dateTime: '2026-05-21 · 09:44:12',
    ipAddress: '196.200.14.12'
  },
  {
    id: 'log-4',
    dotColor: 'red',
    userName: 'Système',
    action: 'a généré une alerte — ENR-FOR-001 expiré',
    dateTime: '2026-05-15 · 08:00:00',
    ipAddress: 'Automatique'
  }
];
