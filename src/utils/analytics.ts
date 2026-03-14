/**
 * Analytics — fires events to Google Analytics (window.gtag) and Meta Pixel (window.fbq).
 * All events match the schema in spec Section 10.5.
 *
 * Safe to call even when gtag/fbq are not loaded (no-ops with console.warn in dev).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function ga(event: string, params: Record<string, unknown>): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  } else if (import.meta.env.DEV) {
    console.info('[Analytics] GA event:', event, params);
  }
}

function fb(event: string, params: Record<string, unknown>): void {
  if (typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  } else if (import.meta.env.DEV) {
    console.info('[Analytics] FB event:', event, params);
  }
}

// ─── Wizard Step Events ────────────────────────────────────────────────────────

export function trackWizardStart(): void {
  ga('wizard_start', { event_category: 'builder' });
  fb('InitiateCheckout', { content_name: 'Build Your Board Wizard' });
}

export function trackStepView(step: number, stepName: string): void {
  ga('step_view', { event_category: 'builder', step, step_name: stepName });
}

export function trackCategorySelected(category: 'cc' | 'co'): void {
  ga('category_selected', { event_category: 'builder', board_category: category });
}

export function trackSizeSelected(sku: string, price: number): void {
  ga('size_selected', { event_category: 'builder', sku, price });
}

// ─── Ingredient Events ─────────────────────────────────────────────────────────

export function trackIngredientAdded(
  ingredientId: string,
  ingredientName: string,
  points: number,
  boardSku: string
): void {
  ga('ingredient_added', {
    event_category: 'customizer',
    ingredient_id: ingredientId,
    ingredient_name: ingredientName,
    points,
    board_sku: boardSku,
  });
}

export function trackIngredientRemoved(ingredientId: string, boardSku: string): void {
  ga('ingredient_removed', {
    event_category: 'customizer',
    ingredient_id: ingredientId,
    board_sku: boardSku,
  });
}

export function trackBudgetFull(boardSku: string, budgetType: 'main' | 'accs'): void {
  ga('budget_full', { event_category: 'customizer', board_sku: boardSku, budget_type: budgetType });
}

export function trackSurpriseMe(boardSku: string): void {
  ga('surprise_me', { event_category: 'customizer', board_sku: boardSku });
}

// ─── Board & Order Events ──────────────────────────────────────────────────────

export function trackBoardDuplicated(boardSku: string): void {
  ga('board_duplicated', { event_category: 'builder', board_sku: boardSku });
}

export function trackBoardShared(boardSku: string): void {
  ga('board_shared', { event_category: 'builder', board_sku: boardSku });
}

export function trackBoardDownloaded(boardSku: string): void {
  ga('board_downloaded', { event_category: 'builder', board_sku: boardSku });
}

export function trackAddOnAdded(addOnId: string, price: number): void {
  ga('addon_added', { event_category: 'builder', addon_id: addOnId, price });
}

export function trackOrderStarted(orderTotal: number, boardCount: number): void {
  ga('begin_checkout', {
    event_category: 'checkout',
    currency: 'USD',
    value: orderTotal,
    num_boards: boardCount,
  });
  fb('InitiateCheckout', {
    value: orderTotal,
    currency: 'USD',
    num_items: boardCount,
  });
}

export function trackOrderSubmitted(orderId: string, total: number, skus: string[]): void {
  ga('purchase', {
    event_category: 'checkout',
    transaction_id: orderId,
    currency: 'USD',
    value: total,
    items: skus.map(sku => ({ item_id: sku })),
  });
  fb('Purchase', {
    value: total,
    currency: 'USD',
    content_ids: skus,
    order_id: orderId,
  });
}
