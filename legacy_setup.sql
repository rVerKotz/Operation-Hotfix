-- Operation Hotfix - Initial DB Setup
-- Run this in Supabase SQL Editor

create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  status text not null check (status in ('Pending', 'In Transit', 'Delivered')),
  cargo_details jsonb
);

alter table shipments enable row level security;

create policy "Allow anon update"
  on shipments
  for update
  using (true)
  with check (true);

create or replace function prevent_delivered_to_pending()
returns trigger as $$
begin
  if OLD.status = 'Delivered' and NEW.status = 'Pending' then
    raise exception 'Cannot revert a delivered shipment to pending status';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger check_status_transition
  before update on shipments
  for each row
  execute function prevent_delivered_to_pending();

insert into shipments (status, cargo_details) values
  ('Pending',    '[{"item": "Laptop Batch A", "weight_kg": 120}]'),
  ('In Transit', '[{"item": "Medical Supplies", "weight_kg": 45}]'),
  ('Delivered',  '[{"item": "Office Furniture", "weight_kg": 310}]'),
  ('Pending',    null),
  ('In Transit', '[{"item": "Electronic Components", "weight_kg": 67}]');
