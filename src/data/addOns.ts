export interface AddOn {
  id: string;
  displayName: string;
  description: string;
  price: number;
  priceConfirmed: boolean;
  hasCustomText?: boolean; // for message card
  available: boolean;
}

export const ADD_ONS: AddOn[] = [
  {
    id: 'cracker_basket_small',
    displayName: 'Cracker Basket (Small)',
    description: 'Artisanal assorted crackers — the perfect complement to every bite.',
    price: 25.00,
    priceConfirmed: true,
    available: true,
  },
  {
    id: 'sparkling_lemonades',
    displayName: 'Artisanal Sparkling Lemonades',
    description: 'Refreshing, handcrafted sparkling lemonades. Perfect for any gathering.',
    price: 24.95,
    priceConfirmed: true,
    available: true,
  },
  {
    id: 'honeycomb',
    displayName: 'Honeycomb',
    description: 'Pure, natural honeycomb — a stunning addition to any cheese board.',
    price: 10.00,
    priceConfirmed: true,
    available: true,
  },
  {
    id: 'cocktail_napkins',
    displayName: 'Cocktail Napkins',
    description: 'Elegant cocktail napkins for your event.',
    price: 2.97,
    priceConfirmed: true,
    available: true,
  },
  {
    id: 'bamboo_forks',
    displayName: 'Bamboo Appetizer Forks',
    description: 'Eco-friendly bamboo appetizer forks — 24 pack.',
    price: 2.97,
    priceConfirmed: true,
    available: true,
  },
  {
    id: 'message_card',
    displayName: 'Custom Message Card',
    description: 'Add a personalized message to your order. Up to 200 characters.',
    price: 0,
    priceConfirmed: true,
    hasCustomText: true,
    available: true,
  },
  {
    id: 'gift_wrapping',
    displayName: 'Gift Wrapping',
    description: 'Beautiful gift wrapping for your board.',
    price: 0, // CONFIRM WITH OWNER
    priceConfirmed: false, // CONFIRM WITH OWNER
    available: true,
  },
];
