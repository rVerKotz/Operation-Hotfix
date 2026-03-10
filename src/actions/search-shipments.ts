'use server'

import { supabase } from '@/lib/supabase'
import type { Shipment } from '@/types/shipment'
import { normalizeCargoDetails } from '@/utils/normalizeCargoDetails'

// Simple in-memory cache for the server instance
const searchCache = new Map<string, { data: Shipment[], timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

export async function searchShipments(query: string): Promise<Shipment[]> {
  const normalizedQuery = query.trim().toLowerCase();
  const now = Date.now();

  // Check cache first
  if (searchCache.has(normalizedQuery)) {
    const cached = searchCache.get(normalizedQuery)!;
    if (now - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  // Fetch from Supabase
  // Note: For real scalability, we'd use .ilike() filter in the query,
  // but since cargo_details is JSONB and needs normalization, we fetch and filter.
  const { data, error } = await supabase.from('shipments').select('*');
  
  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  const rows = data ?? [];

  const results = rows
    .map((row) => ({
      ...row,
      cargo_details: normalizeCargoDetails(row.cargo_details),
    }))
    .filter((row) => {
      if (!normalizedQuery) return true;
      return (
        row.cargo_details?.item?.toLowerCase().includes(normalizedQuery) ?? false
      );
    });

  // Store in cache
  searchCache.set(normalizedQuery, { data: results, timestamp: now });

  return results;
}