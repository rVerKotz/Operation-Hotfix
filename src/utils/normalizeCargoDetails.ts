import type { Shipment } from '@/types/shipment'

/**
 * Bug 4 Fix: Normalizes cargo details by handling both direct objects 
 * and arrays of objects (which the seed data uses).
 */
export function normalizeCargoDetails(details: any): Shipment['cargo_details'] {
  if (!details) return null;
  
  // If the data is an array (e.g. from the SQL insert: '[{"item": "..."}]'), 
  // grab the first element.
  const data = Array.isArray(details) ? details[0] : details;

  if (!data) return null;

  return {
    item: data.item || data.item_name || data.itemName || "Unknown Item",
    weight_kg: data.weight_kg || data.weight || 0
  };
}