// Zone affinity mapping — which zone each ingredient renders in, by board type

export const ZONE_AFFINITIES: Record<string, { cc?: string; co?: string; default?: string }> = {
  // Meats — C&C only
  prosciutto:      { cc: 'TOP_SWEEP' },
  salami_genoa:    { cc: 'SALAMI_BAND' },
  salami_peppered: { cc: 'SALAMI_BAND' },
  salami_calabrese:{ cc: 'SALAMI_BAND' },
  soppressata:     { cc: 'SALAMI_BAND' },
  coppa:           { cc: 'SALAMI_BAND' },
  serrano:         { cc: 'TOP_SWEEP' },

  // Cheeses
  brie:           { cc: 'LEFT_FLANK',    co: 'UPPER_LEFT_FAN' },
  manchego:       { cc: 'RIGHT_FLANK',   co: 'LEFT_EDGE_LINING' },
  gouda_cubes:    { default: 'CENTER_MOUND' },
  mature_cheddar: { cc: 'LOWER_RIGHT',   co: 'RIGHT_EDGE_LINING' },
  herb_goat:      { cc: 'LOWER_CENTER' },
  boursin:        { co: 'LOWER_CENTER' },
  humboldt_fog:   { co: 'LOWER_RIGHT_FAN' },

  // Fruits
  green_grapes:      { default: 'RIGHT_FLANK_UPPER' },
  red_grapes:        { default: 'UPPER_RIGHT_CORNER' },
  strawberries:      { default: 'ACCENT_SCATTER' },
  blackberries:      { default: 'ACCENT_SCATTER' },
  blueberries:       { default: 'ACCENT_SCATTER' },
  raspberries:       { default: 'ACCENT_SCATTER' },
  mandarin:          { default: 'ACCENT_SCATTER' },
  dried_apricots:    { default: 'LOWER_ARC' },
  dragon_fruit:      { co: 'LOWER_LEFT_ANCHOR' },
  kiwi:              { co: 'RIGHT_CENTER' },
  chocolate_almonds: { default: 'ACCENT_SCATTER' },
  chocolate_pretzels:{ default: 'ACCENT_SCATTER' },

  // Accoutrements
  pistachios:   { default: 'ACCENT_SCATTER' },
  walnuts:      { default: 'ACCENT_SCATTER' },
  cornichons:   { default: 'LOWER_CENTER' },
  green_olives: { default: 'LOWER_CENTER' },
};

// Layer order for rendering (lower index = rendered first / behind)
// Higher-index items appear on top
export const RENDER_LAYER_ORDER = [
  // Background (rendered by BoardBackground component, not here)

  // Layer 1: Meats — fills entire zones before anything else
  'prosciutto',
  'serrano',

  // Layer 2: Edge-lining cheeses (CO boards)
  'manchego_edge',  // rendered as edge lining on CO
  'mature_cheddar_edge',

  // Layer 3: Fanned cheeses
  'brie',
  'manchego',
  'mature_cheddar',
  'humboldt_fog',

  // Layer 4: Center mound
  'gouda_cubes',

  // Layer 5: Salami band (CC only)
  'salami_genoa',
  'salami_peppered',
  'salami_calabrese',
  'soppressata',
  'coppa',

  // Layer 6: Soft cheeses
  'herb_goat',
  'boursin',

  // Layer 7: Dragon fruit — ALWAYS on top of cheese
  'dragon_fruit',

  // Layer 8: Fruits
  'green_grapes',
  'red_grapes',
  'strawberries',
  'blackberries',
  'blueberries',
  'raspberries',
  'mandarin',
  'dried_apricots',
  'kiwi',
  'chocolate_almonds',
  'chocolate_pretzels',

  // Layer 9: Accoutrements
  'pistachios',
  'walnuts',
  'cornichons',
  'green_olives',

  // Layer 10: Fixed inclusions (jars)
  'jam_jar_board_miami',
  'honey_jar_garden_delights',

  // Layer 11: Garnish (last — goes on top of everything)
  'rosemary_sprigs',
  'microgreens',
];
