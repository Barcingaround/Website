import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { BoardSKU } from '../data/boardSizes';
import { BOARD_SIZES } from '../data/boardSizes';
import { STANDARD_COMPOSITIONS } from '../data/standardCompositions';

export interface IngredientSelection {
  ingredientId: string;
  pointsAllocated: number;
}

export interface BoardConfig {
  boardId: string;
  sku: BoardSKU;
  category: 'cc' | 'co';
  size: 'small' | 'medium' | 'large';
  boardName: string;
  boardNumber: number;
  mainPointBudget: number;
  accsBudget: number;
  ingredientSelections: IngredientSelection[];
  accoutrementSelections: IngredientSelection[];
  visualSeed: number;
  visualSnapshot: string | null;
  price: number;
  priceConfirmed: boolean;
}

export interface AddOnSelection {
  addOnId: string;
  quantity: number;
  price: number;
  customText?: string;
}

export interface ValidationError {
  boardId: string;
  field: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface BuilderState {
  orderId: string;
  boards: BoardConfig[];
  addOns: AddOnSelection[];
  deliveryDate: string | null;
  deliveryTime: string | null;
  deliveryAddress: string;
  specialInstructions: string;
  giftMessage: string;
  currentStep: number;
  currentBoardIndex: number;
  isLoading: boolean;
  validationErrors: ValidationError[];
  dietaryFilters: {
    halalFriendly: boolean;
    nutFree: boolean;
    noDairy: boolean;
  };

  // Actions
  setStep: (step: number) => void;
  setCurrentBoardIndex: (index: number) => void;

  addBoard: (sku: BoardSKU, useStandardComposition?: boolean) => void;
  removeBoard: (boardId: string) => void;
  updateBoardName: (boardId: string, name: string) => void;
  updateIngredientPoints: (boardId: string, ingredientId: string, points: number, isAccoutrement: boolean) => void;
  duplicateBoard: (sourceBoardId: string) => void;
  fillBoardWithStandard: (boardId: string) => void;
  clearBoard: (boardId: string) => void;
  setBoardSnapshot: (boardId: string, snapshot: string) => void;

  addAddOn: (addOnId: string, price: number) => void;
  removeAddOn: (addOnId: string) => void;
  updateAddOnQuantity: (addOnId: string, quantity: number) => void;
  setAddOnCustomText: (addOnId: string, text: string) => void;

  setDeliveryDate: (date: string) => void;
  setDeliveryTime: (time: string) => void;
  setDeliveryAddress: (address: string) => void;
  setSpecialInstructions: (text: string) => void;
  setGiftMessage: (text: string) => void;

  setDietaryFilter: (filter: keyof BuilderState['dietaryFilters'], value: boolean) => void;

  resetOrder: () => void;
}

function createEmptyBoard(sku: BoardSKU, boardNumber: number): BoardConfig {
  const config = BOARD_SIZES[sku];
  return {
    boardId: uuidv4(),
    sku,
    category: config.category,
    size: config.size,
    boardName: `Board ${boardNumber}`,
    boardNumber,
    mainPointBudget: config.mainPointBudget,
    accsBudget: config.accsBudget,
    ingredientSelections: [],
    accoutrementSelections: [],
    visualSeed: 42,
    visualSnapshot: null,
    price: config.price,
    priceConfirmed: config.priceConfirmed,
  };
}

function applyStandardComposition(board: BoardConfig): BoardConfig {
  const composition = STANDARD_COMPOSITIONS[board.sku];
  if (!composition) return board;
  return {
    ...board,
    ingredientSelections: composition.mainIngredients.map(a => ({
      ingredientId: a.ingredientId,
      pointsAllocated: a.pointsAllocated,
    })),
    accoutrementSelections: composition.accoutrements.map(a => ({
      ingredientId: a.ingredientId,
      pointsAllocated: a.pointsAllocated,
    })),
  };
}

const initialState = {
  orderId: uuidv4(),
  boards: [] as BoardConfig[],
  addOns: [] as AddOnSelection[],
  deliveryDate: null,
  deliveryTime: null,
  deliveryAddress: '',
  specialInstructions: '',
  giftMessage: '',
  currentStep: 0,
  currentBoardIndex: 0,
  isLoading: false,
  validationErrors: [] as ValidationError[],
  dietaryFilters: {
    halalFriendly: false,
    nutFree: false,
    noDairy: false,
  },
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  setCurrentBoardIndex: (index) => set({ currentBoardIndex: index }),

  addBoard: (sku, useStandard = false) => {
    const { boards } = get();
    const boardNumber = boards.length + 1;
    let board = createEmptyBoard(sku, boardNumber);
    if (useStandard) {
      board = applyStandardComposition(board);
    }
    set({ boards: [...boards, board] });
  },

  removeBoard: (boardId) => {
    set(state => ({
      boards: state.boards
        .filter(b => b.boardId !== boardId)
        .map((b, i) => ({ ...b, boardNumber: i + 1 })),
    }));
  },

  updateBoardName: (boardId, name) => {
    set(state => ({
      boards: state.boards.map(b =>
        b.boardId === boardId ? { ...b, boardName: name } : b
      ),
    }));
  },

  updateIngredientPoints: (boardId, ingredientId, points, isAccoutrement) => {
    set(state => ({
      boards: state.boards.map(b => {
        if (b.boardId !== boardId) return b;
        const field = isAccoutrement ? 'accoutrementSelections' : 'ingredientSelections';
        const existing = b[field].find(s => s.ingredientId === ingredientId);
        let updated: IngredientSelection[];
        if (points === 0) {
          updated = b[field].filter(s => s.ingredientId !== ingredientId);
        } else if (existing) {
          updated = b[field].map(s =>
            s.ingredientId === ingredientId ? { ...s, pointsAllocated: points } : s
          );
        } else {
          updated = [...b[field], { ingredientId, pointsAllocated: points }];
        }
        return { ...b, [field]: updated };
      }),
    }));
  },

  duplicateBoard: (sourceBoardId) => {
    const { boards } = get();
    const source = boards.find(b => b.boardId === sourceBoardId);
    if (!source) return;
    const boardNumber = boards.length + 1;
    const duplicate: BoardConfig = {
      ...source,
      boardId: uuidv4(),
      boardNumber,
      boardName: `Copy of ${source.boardName}`,
      visualSnapshot: null,
    };
    set({ boards: [...boards, duplicate] });
  },

  fillBoardWithStandard: (boardId) => {
    set(state => ({
      boards: state.boards.map(b => {
        if (b.boardId !== boardId) return b;
        return applyStandardComposition(b);
      }),
    }));
  },

  clearBoard: (boardId) => {
    set(state => ({
      boards: state.boards.map(b =>
        b.boardId !== boardId ? b : {
          ...b,
          ingredientSelections: [],
          accoutrementSelections: [],
          visualSnapshot: null,
        }
      ),
    }));
  },

  setBoardSnapshot: (boardId, snapshot) => {
    set(state => ({
      boards: state.boards.map(b =>
        b.boardId === boardId ? { ...b, visualSnapshot: snapshot } : b
      ),
    }));
  },

  addAddOn: (addOnId, price) => {
    const { addOns } = get();
    if (addOns.find(a => a.addOnId === addOnId)) return;
    set({ addOns: [...addOns, { addOnId, quantity: 1, price }] });
  },

  removeAddOn: (addOnId) => {
    set(state => ({ addOns: state.addOns.filter(a => a.addOnId !== addOnId) }));
  },

  updateAddOnQuantity: (addOnId, quantity) => {
    if (quantity <= 0) {
      get().removeAddOn(addOnId);
      return;
    }
    set(state => ({
      addOns: state.addOns.map(a =>
        a.addOnId === addOnId ? { ...a, quantity } : a
      ),
    }));
  },

  setAddOnCustomText: (addOnId, text) => {
    set(state => ({
      addOns: state.addOns.map(a =>
        a.addOnId === addOnId ? { ...a, customText: text } : a
      ),
    }));
  },

  setDeliveryDate: (date) => set({ deliveryDate: date }),
  setDeliveryTime: (time) => set({ deliveryTime: time }),
  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  setSpecialInstructions: (text) => set({ specialInstructions: text }),
  setGiftMessage: (text) => set({ giftMessage: text }),

  setDietaryFilter: (filter, value) => {
    set(state => ({
      dietaryFilters: { ...state.dietaryFilters, [filter]: value },
    }));
  },

  resetOrder: () => set({ ...initialState, orderId: uuidv4() }),
}));
