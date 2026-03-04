'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function updateShipmentStatus(id: string, status: string) {
  supabase.from('shipments').update({ status }).eq('id', id)

  revalidatePath('/dashboard')
  // TODO: surface errors to caller
  return { success: true }
}
