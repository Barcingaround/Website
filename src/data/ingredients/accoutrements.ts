import type { Ingredient } from './meats';

export const ACCOUTREMENTS: Ingredient[] = [
  {
    id: 'pistachios',
    displayName: 'Pistachios',
    category: 'accoutrement',
    boardTypes: ['cc', 'co'],
    pointCost: 1,
    unitsPerPoint: 1, // cluster
    unitLabel: 'cluster',
    renderStyle: 'nut_cluster',
    zone: 'ACCENT_SCATTER',
    allergens: ['tree_nuts'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_small', 'cc_medium', 'cc_large', 'co_small', 'co_medium', 'co_large'],
    description: 'Shell-on pistachios in a rustic cluster.',
    renderColor: '#C8B870',
    shellColor: '#D4C888',
    notes: 'Shell-on; render as loose pile, some open showing green interior.',
  },
  {
    id: 'walnuts',
    displayName: 'Walnuts',
    category: 'accoutrement',
    boardTypes: ['cc', 'co'],
    pointCost: 1,
    unitsPerPoint: 1, // cluster of halves
    unitLabel: 'cluster',
    renderStyle: 'nut_cluster',
    zone: 'ACCENT_SCATTER',
    allergens: ['tree_nuts'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_small', 'cc_medium', 'cc_large', 'co_small', 'co_medium', 'co_large'],
    description: 'Whole walnut halves in a rich, textural cluster.',
    renderColor: '#8B6040',
    notes: 'Brain-like walnut half shape. Warm brown. 4–6 halves per cluster.',
  },
  {
    id: 'cornichons',
    displayName: 'Cornichons',
    category: 'accoutrement',
    boardTypes: ['cc', 'co'],
    pointCost: 1,
    unitsPerPoint: 1, // cluster of 5–6 pickles
    unitLabel: 'cluster',
    renderStyle: 'pickle_cluster',
    zone: 'LOWER_CENTER',
    allergens: [],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_small', 'cc_medium', 'cc_large', 'co_small', 'co_medium', 'co_large'],
    description: 'Tiny French gherkin pickles. Tart, crunchy, essential.',
    renderColor: '#6B9040',
    notes: 'Small stubby cylindrical shape, ridged texture, dark green. 5–6 per cluster.',
  },
  {
    id: 'green_olives',
    displayName: 'Green Olives',
    category: 'accoutrement',
    boardTypes: ['cc', 'co'],
    pointCost: 1,
    unitsPerPoint: 1, // cluster of ~8–10 olives
    unitLabel: 'cluster',
    renderStyle: 'olive_cluster',
    zone: 'LOWER_CENTER',
    allergens: [],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_small', 'cc_medium', 'cc_large', 'co_small', 'co_medium', 'co_large'],
    description: 'Plump green olives. Briny, meaty, olive-oil glistened.',
    renderColor: '#7A9840',
    notes: 'Round-oval shape, bright olive green. Slight sheen. 8–10 per cluster.',
  },
];

export interface FixedInclusion {
  id: string;
  displayName: string;
  renderStyle: string;
  zone: string;
  countBySize: { small: number; medium: number; large: number };
  boardTypes?: Array<'cc' | 'co'>;
  renderColor?: string;
  lidColor?: string;
  labelColor?: string;
  notes?: string;
  [key: string]: unknown;
}

// FIXED INCLUSIONS — always on every board, no points, not selectable
export const FIXED_INCLUSIONS: FixedInclusion[] = [
  {
    id: 'jam_jar_board_miami',
    displayName: 'The Board Miami Jam',
    renderStyle: 'branded_jar',
    zone: 'JAR_PLACEMENT',
    countBySize: { small: 1, medium: 1, large: 2 },
    renderColor: '#FFFFFF',
    lidColor: '#1A1A1A',
    labelColor: '#2D5A2D',
    notes: 'Circular jar, black lid, white label with green botanical "The Board Miami" circular badge. Never buried.',
  },
  {
    id: 'honey_jar_garden_delights',
    displayName: 'Garden Delights Honey',
    renderStyle: 'branded_jar',
    zone: 'JAR_PLACEMENT',
    boardTypes: ['co'], // CHEESE ONLY boards only
    countBySize: { small: 1, medium: 1, large: 1 },
    renderColor: '#F5D060',
    lidColor: '#D4A020',
    notes: 'Gold/honey-colored jar with gold lid. Always on Cheese Only boards.',
  },
  {
    id: 'rosemary_sprigs',
    displayName: 'Fresh Rosemary',
    renderStyle: 'herb_sprig',
    zone: 'GARNISH_SCATTER',
    countBySize: { small: 3, medium: 5, large: 8 },
    renderColor: '#4A7A30',
    notes: 'Thin needle-like sprig. Dark forest green. Scatter throughout board in gaps.',
  },
  {
    id: 'microgreens',
    displayName: 'Microgreens',
    renderStyle: 'herb_scatter',
    zone: 'GARNISH_SCATTER',
    countBySize: { small: 2, medium: 3, large: 4 },
    renderColor: '#5A8A40',
    notes: 'Tiny tender herb leaves, bright fresh green.',
  },
];
