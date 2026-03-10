AUDIT_TRAIL_IMPLEMENTATION.md

1. Schema

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    old_status shipment_status,
    new_status shipment_status,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    changed_by TEXT DEFAULT 'system'
);


Rationale:

shipment_id: Links the log entry to a specific shipment record for easy filtering.

old_status/new_status: Captures the exact state transition (e.g., Pending -> In Transit) for historical accuracy.

changed_at: Standardized UTC timestamp for chronological auditing.

changed_by: A placeholder field to track the source of the change, defaulting to 'system' until authentication is integrated.

2. RLS

Policy: RLS is enabled. Only SELECT is allowed for the anon role. No manual INSERT, UPDATE, or DELETE operations are permitted for users.
Why: Audit logs must be immutable records. By restricting write access to the database itself (via a SECURITY DEFINER trigger), we ensure that users cannot tamper with, delete, or fabricate logs to hide errors or malfeasance.

3. Mechanism

Choice: Database Trigger (AFTER UPDATE)
Reasoning: A database trigger is the most resilient implementation. It guarantees that an audit log is created regardless of how the update occurs—whether through the dashboard, a direct SQL command, or a background process. We used SECURITY DEFINER on the trigger function to bypass RLS restrictions during the automated logging process.

4. Trade-offs

Approach Not Chosen: Server Action Insertion

Advantage: Placing logic in the Server Action makes it easier to access application-level state (like the specific user session) without needing complex database functions.

Disadvantage: Fragmented integrity. If a status is updated via a different part of the app or directly in the database without calling that specific Server Action, the change goes unlogged. This creates "blind spots" that undermine the reliability of the audit trail.