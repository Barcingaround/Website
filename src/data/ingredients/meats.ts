export interface Ingredient {
  id: string;
  displayName: string;
  category: 'meat' | 'cheese' | 'fruit' | 'accoutrement';
  boardTypes: Array<'cc' | 'co'>;
  pointCost: number;
  unitsPerPoint: number | { cc: number; co: number };
  unitLabel: string;
  renderStyle: string;
  zone: string | { cc: string; co: string };
  allergens: string[];
  seasonal: boolean;
  available: boolean;
  suggestedOnSizes: string[];
  description: string;
  renderColor?: string;
  notes?: string;
  [key: string]: unknown;
}

export const MEATS: Ingredient[] = [
  {
    id: 'prosciutto',
    displayName: 'Prosciutto di Parma',
    category: 'meat',
    boardTypes: ['cc'],
    pointCost: 3,
    unitsPerPoint: 10, // slices — calibrated from labeled photo (50 slices = 5 allocations × 10)
    unitLabel: 'slices',
    renderStyle: 'continuous_fan',
    zone: 'TOP_SWEEP',
    allergens: ['pork'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_small', 'cc_medium', 'cc_large'],
    description: 'Delicate, paper-thin Italian ham. Fan-draped across the top of your board.',
    renderColor: '#C4706B',
    rindColor: undefined,
    notes: 'Fan width and layer depth scale with unit count.',
  },
  {
    id: 'salami_genoa',
    displayName: 'Genoa Salami',
    category: 'meat',
    boardTypes: ['cc'],
    pointCost: 2,
    unitsPerPoint: 12, // rosettes — calibrated: 72 total ÷ 6 allocations = 12/pt
    unitLabel: 'rosettes',
    renderStyle: 'rosette_cluster',
    zone: 'SALAMI_BAND',
    allergens: ['pork'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_small', 'cc_medium', 'cc_large'],
    description: 'Classic Italian salami hand-rolled into elegant roses.',
    renderColor: '#8B3A3A',
    notes: 'Rolled into tight rosettes.',
  },
  {
    id: 'salami_peppered',
    displayName: 'Peppered Salami',
    category: 'meat',
    boardTypes: ['cc'],
    pointCost: 2,
    unitsPerPoint: 12,
    unitLabel: 'rosettes',
    renderStyle: 'rosette_cluster',
    zone: 'SALAMI_BAND',
    allergens: ['pork'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_medium', 'cc_large'],
    description: 'Coarsely ground black pepper crust. Bold and aromatic.',
    renderColor: '#7A3030',
    notes: 'Black pepper fleck texture on surface.',
  },
  {
    id: 'salami_calabrese',
    displayName: 'Calabrese Salame',
    category: 'meat',
    boardTypes: ['cc'],
    pointCost: 2,
    unitsPerPoint: 12,
    unitLabel: 'rosettes',
    renderStyle: 'rosette_cluster',
    zone: 'SALAMI_BAND',
    allergens: ['pork'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_medium', 'cc_large'],
    description: 'Spicy Southern Italian salami with red pepper heat.',
    renderColor: '#8C2D2D',
    notes: 'Red pepper flecks visible.',
  },
  {
    id: 'soppressata',
    displayName: 'Soppressata',
    category: 'meat',
    boardTypes: ['cc'],
    pointCost: 2,
    unitsPerPoint: 12,
    unitLabel: 'rosettes',
    renderStyle: 'rosette_cluster',
    zone: 'SALAMI_BAND',
    allergens: ['pork'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_medium', 'cc_large'],
    description: 'Rustic pressed Italian salami with peppercorn studding.',
    renderColor: '#7D2E2E',
    notes: 'Peppercorn studs visible on surface.',
  },
  {
    id: 'coppa',
    displayName: 'Coppa',
    category: 'meat',
    boardTypes: ['cc'],
    pointCost: 2,
    unitsPerPoint: 10, // CONFIRM WITH OWNER
    unitLabel: 'slices',
    renderStyle: 'folded_fan',
    zone: 'SALAMI_BAND',
    allergens: ['pork'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_large'],
    description: 'Whole-muscle cured pork shoulder. Rich, marbled, intensely flavored.',
    renderColor: '#903535',
    notes: 'Slightly thicker cut; can be fan-folded or flat-layered.',
  },
  {
    id: 'serrano',
    displayName: 'Serrano Ham',
    category: 'meat',
    boardTypes: ['cc'],
    pointCost: 3,
    unitsPerPoint: 10,
    unitLabel: 'slices',
    renderStyle: 'continuous_fan',
    zone: 'TOP_SWEEP',
    allergens: ['pork'],
    seasonal: false,
    available: true,
    suggestedOnSizes: ['cc_small', 'cc_medium', 'cc_large'],
    description: 'Spanish mountain-cured ham. Nutty, complex, silky thin.',
    renderColor: '#B8605A',
    notes: 'Alternative to prosciutto in TOP_SWEEP zone.',
  },
];
