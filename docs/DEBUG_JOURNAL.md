# **Debug Journal**

Complete one entry per bug. All six entries are required for full marks.

## **Bug 1 — Silent RLS Block**

| Field | Your Entry |
| :---- | :---- |
| **Symptom** | The dashboard loads but the table is completely empty, displaying "No Data Found" despite data existing in the database. |
| **Hypothesis** | Row Level Security (RLS) is enabled on the shipments table, but the SELECT policy is explicitly set to USING (false), blocking all read requests from the client. |
| **AI Prompt** | "Analyze legacy\_setup.sql. Why would a Supabase query return empty results for the shipments table even if rows exist, assuming RLS is enabled?" |
| **Fix** | Updated the RLS policy for SELECT in legacy\_setup.sql from USING (false) to USING (true) to allow public read access. |

## **Bug 2 — Ghost Mutation**

| Field | Your Entry |
| :---- | :---- |
| **Symptom** | Status updates show a green "Status updated successfully" message, but changes do not persist after a page refresh. |
| **Hypothesis** | The UPDATE RLS policy is set to USING (false), which causes the update to fail silently or be ignored by the database even if the server action executes. |
| **AI Prompt** | "Status updates in my Next.js Server Action show success in UI, but data isn't changing in Supabase. Check the UPDATE policy in this SQL: \[insert legacy\_setup.sql snippet\]." |
| **Fix** | Changed the UPDATE RLS policy in legacy\_setup.sql from USING (false) to USING (true) to allow public status modifications. |

## **Bug 3 — Infinite Loop**

| Field | Your Entry |
| :---- | :---- |
| **Symptom** | The dashboard freezes immediately upon loading, and the server terminal is flooded with hundreds of GET requests per second. |
| **Hypothesis** | A useEffect hook inside the DataTable component is calling router.refresh(), which triggers a page re-render, leading to an infinite cycle of mounts and refreshes. |
| **AI Prompt** | "My Next.js dashboard is hitting an infinite loop of requests. Check this DataTable component for problematic useEffect hooks: \[insert src/components/data-table.tsx\]." |
| **Fix** | Removed the router.refresh() call from the useEffect hook in src/components/data-table.tsx to stop recursive page reloads. |

## **Bug 4 — The Invisible Cargo**

| Field | Your Entry |
| :---- | :---- |
| **Symptom** | The 'Cargo' column displays 'Unknown Item' or '-' despite the database admin confirming that cargo data exists for those rows. |
| **Hypothesis** | The database stores cargo\_details as a JSON array \[{...}\] rather than a single object, and the normalization utility is failing to access the nested keys. |
| **AI Prompt** | "Cargo details are blank in my table. The DB stores JSONB as \[{"item": "...", "weight\_kg": ...}\]. How do I fix my normalization utility to handle this array?" |
| **Fix** | Updated normalizeCargoDetails.ts to check if input is an array and extract the first element, while also mapping both item and item\_name keys. |

## **Bug 5 — The Unreliable Search**

| Field | Your Entry |
| :---- | :---- |
| **Symptom** | Rapidly typing in the search box causes flickering results or displays data that doesn't match the current search string. |
| **Hypothesis** | An async race condition exists where multiple search requests are in flight, and older (stale) requests are finishing after newer ones, overwriting the state. |
| **AI Prompt** | "How do I fix a race condition in a Next.js search bar using Server Actions? Rapid typing makes old results overwrite newer ones." |
| **Fix** | Implemented a searchId ref to ignore stale responses and added a 500ms debounce timer to the search handler in DataTable.tsx. |

## **Bug 6 — The Persistent Ghost**

| Field | Your Entry |
| :---- | :---- |
| **Symptom** | Changing status from 'Delivered' to 'Pending' shows a success toast but the change never saves; other transitions work fine. |
| **Hypothesis** | A database trigger (check\_status\_transition) is preventing this specific transition, but the Server Action isn't returning the error message to the UI. |
| **AI Prompt** | "Supabase update returns an error because of a DB trigger. How do I handle this error in my Server Action and show it via a toast instead of a generic success?" |
| **Fix** | Wrapped updateStatus in a try/catch block to return error objects and updated the UI to display the specific DB error via toast.error(). |

