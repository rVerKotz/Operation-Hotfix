import type { Shipment } from '@/types/shipment'

export function normalizeCargoDetails(
  cargo: unknown
): Shipment['cargo_details'] {
  if (!cargo) return null
  if (Array.isArray(cargo))
    return (cargo[0] ?? null) as Shipment['cargo_details']
  return cargo as Shipment['cargo_details']
}
