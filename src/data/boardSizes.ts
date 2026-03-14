export type BoardSKU = 'cc_small' | 'cc_medium' | 'cc_large' | 'co_small' | 'co_medium' | 'co_large';
export type BoardCategory = 'cc' | 'co';
export type BoardSize = 'small' | 'medium' | 'large';

export interface BoardSizeConfig {
  sku: BoardSKU;
  category: BoardCategory;
  size: BoardSize;
  displayName: string;
  shape: 'circle' | 'rectangle';
  price: number;
  priceConfirmed: boolean;
  serves: string;
  mainPointBudget: number;
  accsBudget: number; // separate accoutrements sub-budget
  dimensions: {
    viewBox: string;
    width: number;
    height: number;
    rx?: number; // border radius for rectangles
    radius?: number; // for circles
    cx?: number;
    cy?: number;
  };
}

export const BOARD_SIZES: Record<BoardSKU, BoardSizeConfig> = {
  cc_small: {
    sku: 'cc_small',
    category: 'cc',
    size: 'small',
    displayName: 'Small Cheese & Charcuterie',
    shape: 'circle',
    price: 139.00,
    priceConfirmed: true,
    serves: '4–6',
    mainPointBudget: 22,
    accsBudget: 2,
    dimensions: {
      viewBox: '0 0 600 600',
      width: 600,
      height: 600,
      radius: 280,
      cx: 300,
      cy: 300,
    },
  },
  cc_medium: {
    sku: 'cc_medium',
    category: 'cc',
    size: 'medium',
    displayName: 'Medium Cheese & Charcuterie',
    shape: 'rectangle',
    price: 195.00, // CONFIRM WITH OWNER
    priceConfirmed: false,
    serves: '8–12',
    mainPointBudget: 38,
    accsBudget: 3,
    dimensions: {
      viewBox: '0 0 800 560',
      width: 800,
      height: 560,
      rx: 16,
    },
  },
  cc_large: {
    sku: 'cc_large',
    category: 'cc',
    size: 'large',
    displayName: 'Large Cheese & Charcuterie',
    shape: 'rectangle',
    price: 325.00, // CONFIRM WITH OWNER
    priceConfirmed: false,
    serves: '20–24',
    mainPointBudget: 62,
    accsBudget: 4,
    dimensions: {
      viewBox: '0 0 960 660',
      width: 960,
      height: 660,
      rx: 16,
    },
  },
  co_small: {
    sku: 'co_small',
    category: 'co',
    size: 'small',
    displayName: 'Small Cheese Only',
    shape: 'rectangle',
    price: 139.00, // CONFIRM WITH OWNER
    priceConfirmed: false,
    serves: '4–6',
    mainPointBudget: 22,
    accsBudget: 2,
    dimensions: {
      viewBox: '0 0 720 520',
      width: 720,
      height: 520,
      rx: 16,
    },
  },
  co_medium: {
    sku: 'co_medium',
    category: 'co',
    size: 'medium',
    displayName: 'Medium Cheese Only',
    shape: 'rectangle',
    price: 185.00,
    priceConfirmed: true,
    serves: '10–12',
    mainPointBudget: 36,
    accsBudget: 3,
    dimensions: {
      viewBox: '0 0 800 560',
      width: 800,
      height: 560,
      rx: 16,
    },
  },
  co_large: {
    sku: 'co_large',
    category: 'co',
    size: 'large',
    displayName: 'Large Cheese Only',
    shape: 'rectangle',
    price: 285.00, // CONFIRM WITH OWNER
    priceConfirmed: false,
    serves: '18–22',
    mainPointBudget: 58,
    accsBudget: 4,
    dimensions: {
      viewBox: '0 0 960 660',
      width: 960,
      height: 660,
      rx: 16,
    },
  },
};

export function getBoardConfig(sku: BoardSKU): BoardSizeConfig {
  return BOARD_SIZES[sku];
}

export const CC_SKUS: BoardSKU[] = ['cc_small', 'cc_medium', 'cc_large'];
export const CO_SKUS: BoardSKU[] = ['co_small', 'co_medium', 'co_large'];
