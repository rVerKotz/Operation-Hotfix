"use server";

import { supabase } from "@/lib/supabase";
import { Shipment } from "@/types/shipment";
import { revalidatePath } from "next/cache";

/**
 * Bug 6 Fix: Switched from throwing errors to returning a result object.
 * This prevents Next.js from showing a "Runtime Error" screen and allows
 * the client-side toast to display the specific business logic error.
 */
export async function updateStatus(id: string, status: Shipment['status']) {
  try {
    const { error, data } = await supabase
      .from("shipments")
      .update({ status })
      .eq("id", id)
      .select(); //Bug 2: Ensure we select to verify the update

    if (error) {
      // Return the error message from the DB trigger (Bug 6)
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: "Shipment not found or no changes made" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "An unexpected error occurred" };
  }
}