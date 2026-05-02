// Publications data — edit here, used by the Publications section.
export const publications = [
  {
    id: 'awe-dyn-2026',
    type: 'preprint',
    year: '2026',
    title: 'Dynamic Operation of Pressurized Alkaline Water Electrolyzers under Variable Renewable Input',
    authors: ['Darshan Jogani', 'et al.'],
    venue: 'Journal of Power Sources',
    status: 'In preparation',
    doi: '#',
    abstract: 'A dynamic model and experimental campaign on pressurized AWE under fluctuating renewable input, with quantitative comparison of three control strategies.',
  },
  {
    id: 'dechema-2026',
    type: 'conference',
    year: '2026',
    title: 'Electrolyzer System Performance and Economic Assessment for Industrial Power-to-X',
    authors: ['Darshan Jogani'],
    venue: 'DECHEMA 2026 · Frankfurt am Main',
    status: 'Selected (oral)',
    doi: '#',
    abstract: 'Recent doctoral findings on dynamic AWE operation, control strategies, and the economics of scaling green hydrogen.',
  },
  {
    id: 'p2m-tea-2026',
    type: 'preprint',
    year: '2026',
    title: 'Techno-Economic Pathways for Green Methanol via Alkaline Water Electrolysis',
    authors: ['Darshan Jogani', 'et al.'],
    venue: 'International Journal of Hydrogen Energy',
    status: 'In preparation',
    doi: '#',
    abstract: 'A coupled techno-economic and process model for AWE-fed methanol synthesis under variable renewable supply.',
  },
  {
    id: 'msc-thesis-2025',
    type: 'thesis',
    year: '2025',
    title: 'Techno-economic Analysis and Optimization of Alkaline Water Electrolysis in Power-to-Methanol Processes',
    authors: ['Darshan Jogani'],
    venue: "Master's Thesis · Defended",
    status: 'Available on request',
    doi: '#',
    abstract: 'Master\'s thesis combining Aspen Plus process simulation with a coupled TEA framework for green methanol production.',
  },
];

export const toBibtex = (p) => {
  const key = p.id.replace(/[^a-z0-9]/gi, '');
  const authors = p.authors.join(' and ');
  const isThesis = p.type === 'thesis';
  const isConf = p.type === 'conference';
  const entry = isThesis ? 'mastersthesis' : isConf ? 'inproceedings' : 'article';
  return `@${entry}{${key},
  author    = {${authors}},
  title     = {${p.title}},
  ${isConf ? 'booktitle' : 'journal'} = {${p.venue}},
  year      = {${p.year}},
  note      = {${p.status}}
}`;
};
