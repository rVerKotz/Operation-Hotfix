'use server'

import { supabase } from '@/lib/supabase'
import type { Shipment } from '@/types/shipment'
import { normalizeCargoDetails } from '@/utils/normalizeCargoDetails'

// TODO: add caching
export async function searchShipments(query: string): Promise<Shipment[]> {
  const { data } = await supabase.from('shipments').select('*')
  const rows = data ?? []

  if (!query.trim()) {
    return rows.map((row) => ({
      ...row,
      cargo_details: normalizeCargoDetails(row.cargo_details),
    }))
  }

  return rows
    .filter((row) => {
      const normalized = normalizeCargoDetails(row.cargo_details)
      return (
        normalized?.item?.toLowerCase().includes(query.toLowerCase()) ?? false
      )
    })
    .map((row) => ({
      ...row,
      cargo_details: normalizeCargoDetails(row.cargo_details),
    }))
}
