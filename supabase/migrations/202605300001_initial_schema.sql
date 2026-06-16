create extension if not exists pgcrypto;
create extension if not exists citext;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_center_member(target_center uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and center_id = target_center
  );
$$;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  center_id uuid not null references public.centers (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'admin', 'staff', 'teacher')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guardians (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  full_name text not null,
  email citext not null,
  phone text not null,
  preferred_channel text not null default 'email' check (preferred_channel in ('email', 'sms', 'whatsapp')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  guardian_id uuid not null references public.guardians (id) on delete restrict,
  full_name text not null,
  status text not null default 'active' check (status in ('active', 'trial', 'inactive')),
  grade text not null,
  primary_program text not null,
  days_per_week text not null,
  notes text,
  balance_due numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  full_name text not null,
  specialties text[] not null default '{}',
  availability_summary text not null,
  email citext,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  title text not null,
  category text not null,
  description text,
  weekly_capacity integer not null default 0,
  location text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_course_assignments (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  is_lead boolean not null default false,
  created_at timestamptz not null default now(),
  unique (teacher_id, course_id)
);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists public.schedule_slots (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  day_of_week text not null check (day_of_week in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  start_time time not null,
  end_time time not null,
  room_name text not null,
  location text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  schedule_slot_id uuid references public.schedule_slots (id) on delete set null,
  attendance_date date not null,
  status text not null check (status in ('present', 'absent', 'late')),
  billed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (student_id, course_id, attendance_date)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  due_date date not null,
  amount numeric(12, 2) not null,
  status text not null default 'pending' check (status in ('paid', 'pending', 'overdue', 'partial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  invoice_id uuid references public.invoices (id) on delete set null,
  student_id uuid not null references public.students (id) on delete cascade,
  amount numeric(12, 2) not null,
  method text not null,
  paid_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.fee_alerts (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  invoice_id uuid references public.invoices (id) on delete set null,
  severity text not null check (severity in ('due-soon', 'overdue', 'partial')),
  channel text not null check (channel in ('email', 'sms', 'in-app')),
  alert_date date not null default current_date,
  due_date date not null,
  amount_due numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.email_automations (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  name text not null,
  trigger_event text not null,
  audience text not null,
  channel text not null default 'email' check (channel in ('email', 'whatsapp')),
  status text not null default 'draft' check (status in ('live', 'draft')),
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.history_events (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  entity_name text not null,
  summary text not null,
  happened_at timestamptz not null,
  retention_signal text not null check (retention_signal in ('reenroll', 'watch', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers (id) on delete cascade,
  module text not null,
  title text not null,
  detail text not null,
  happened_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_guardians_center_id on public.guardians (center_id);
create index if not exists idx_students_center_id on public.students (center_id);
create index if not exists idx_students_guardian_id on public.students (guardian_id);
create index if not exists idx_teachers_center_id on public.teachers (center_id);
create index if not exists idx_courses_center_id on public.courses (center_id);
create index if not exists idx_schedule_slots_center_id on public.schedule_slots (center_id);
create index if not exists idx_attendance_records_center_id on public.attendance_records (center_id);
create index if not exists idx_invoices_center_id on public.invoices (center_id);
create index if not exists idx_payments_center_id on public.payments (center_id);
create index if not exists idx_fee_alerts_center_id on public.fee_alerts (center_id);
create index if not exists idx_history_events_center_id on public.history_events (center_id);
create index if not exists idx_activity_logs_center_id on public.activity_logs (center_id);

drop trigger if exists trg_centers_updated_at on public.centers;
create trigger trg_centers_updated_at
before update on public.centers
for each row
execute function public.set_updated_at();

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_guardians_updated_at on public.guardians;
create trigger trg_guardians_updated_at
before update on public.guardians
for each row
execute function public.set_updated_at();

drop trigger if exists trg_students_updated_at on public.students;
create trigger trg_students_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

drop trigger if exists trg_teachers_updated_at on public.teachers;
create trigger trg_teachers_updated_at
before update on public.teachers
for each row
execute function public.set_updated_at();

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row
execute function public.set_updated_at();

drop trigger if exists trg_schedule_slots_updated_at on public.schedule_slots;
create trigger trg_schedule_slots_updated_at
before update on public.schedule_slots
for each row
execute function public.set_updated_at();

drop trigger if exists trg_invoices_updated_at on public.invoices;
create trigger trg_invoices_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at();

drop trigger if exists trg_email_automations_updated_at on public.email_automations;
create trigger trg_email_automations_updated_at
before update on public.email_automations
for each row
execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.centers enable row level security;
alter table public.guardians enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.courses enable row level security;
alter table public.teacher_course_assignments enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.schedule_slots enable row level security;
alter table public.attendance_records enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.fee_alerts enable row level security;
alter table public.email_automations enable row level security;
alter table public.history_events enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "center members can read centers" on public.centers;
create policy "center members can read centers"
on public.centers
for select
using (public.is_center_member(id));

drop policy if exists "center members can update centers" on public.centers;
create policy "center members can update centers"
on public.centers
for update
using (public.is_center_member(id))
with check (public.is_center_member(id));

drop policy if exists "users can read center profiles" on public.user_profiles;
create policy "users can read center profiles"
on public.user_profiles
for select
using (id = auth.uid() or public.is_center_member(center_id));

drop policy if exists "users can bootstrap own profile" on public.user_profiles;
create policy "users can bootstrap own profile"
on public.user_profiles
for insert
with check (id = auth.uid());

drop policy if exists "center members can update profiles" on public.user_profiles;
create policy "center members can update profiles"
on public.user_profiles
for update
using (id = auth.uid() or public.is_center_member(center_id))
with check (id = auth.uid() or public.is_center_member(center_id));

drop policy if exists "center members can access guardians" on public.guardians;
create policy "center members can access guardians"
on public.guardians
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access students" on public.students;
create policy "center members can access students"
on public.students
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access teachers" on public.teachers;
create policy "center members can access teachers"
on public.teachers
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access courses" on public.courses;
create policy "center members can access courses"
on public.courses
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access teacher assignments" on public.teacher_course_assignments;
create policy "center members can access teacher assignments"
on public.teacher_course_assignments
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access enrollments" on public.course_enrollments;
create policy "center members can access enrollments"
on public.course_enrollments
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access schedule" on public.schedule_slots;
create policy "center members can access schedule"
on public.schedule_slots
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access attendance" on public.attendance_records;
create policy "center members can access attendance"
on public.attendance_records
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access invoices" on public.invoices;
create policy "center members can access invoices"
on public.invoices
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access payments" on public.payments;
create policy "center members can access payments"
on public.payments
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access fee alerts" on public.fee_alerts;
create policy "center members can access fee alerts"
on public.fee_alerts
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access automations" on public.email_automations;
create policy "center members can access automations"
on public.email_automations
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access history" on public.history_events;
create policy "center members can access history"
on public.history_events
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

drop policy if exists "center members can access activity logs" on public.activity_logs;
create policy "center members can access activity logs"
on public.activity_logs
for all
using (public.is_center_member(center_id))
with check (public.is_center_member(center_id));

create or replace view public.student_directory as
select
  s.id,
  s.full_name,
  s.status,
  s.grade,
  s.primary_program,
  s.days_per_week,
  g.full_name as guardian_name,
  g.email as guardian_email,
  g.phone as guardian_phone,
  s.notes,
  s.balance_due
from public.students s
join public.guardians g on g.id = s.guardian_id;

create or replace view public.teacher_directory as
select
  t.id,
  t.full_name,
  array_to_string(t.specialties, ', ') as expertise,
  t.availability_summary,
  count(distinct tca.course_id)::int as assigned_courses,
  count(distinct ce.student_id)::int as assigned_students
from public.teachers t
left join public.teacher_course_assignments tca on tca.teacher_id = t.id
left join public.course_enrollments ce
  on ce.course_id = tca.course_id
 and ce.status = 'active'
group by t.id, t.full_name, t.specialties, t.availability_summary;

create or replace view public.course_catalog as
select
  c.id,
  c.title,
  c.category,
  c.weekly_capacity,
  coalesce(max(case when tca.is_lead then t.full_name end), 'Unassigned') as lead_teacher,
  count(distinct ce.student_id)::int as enrolled_students,
  c.location
from public.courses c
left join public.teacher_course_assignments tca on tca.course_id = c.id
left join public.teachers t on t.id = tca.teacher_id
left join public.course_enrollments ce
  on ce.course_id = c.id
 and ce.status = 'active'
where c.active = true
group by c.id, c.title, c.category, c.weekly_capacity, c.location;

create or replace view public.schedule_overview as
select
  ss.id,
  initcap(ss.day_of_week) as day_of_week,
  to_char(ss.start_time, 'HH12:MI AM') as start_time,
  to_char(ss.end_time, 'HH12:MI AM') as end_time,
  c.title as course_title,
  t.full_name as teacher_name,
  ss.room_name,
  count(distinct ce.student_id)::int as student_count
from public.schedule_slots ss
join public.courses c on c.id = ss.course_id
join public.teachers t on t.id = ss.teacher_id
left join public.course_enrollments ce
  on ce.course_id = ss.course_id
 and ce.status = 'active'
group by
  ss.id,
  ss.day_of_week,
  ss.start_time,
  ss.end_time,
  c.title,
  t.full_name,
  ss.room_name;

create or replace view public.fee_alert_overview as
select
  fa.id,
  s.full_name as student_name,
  g.full_name as guardian_name,
  fa.amount_due,
  to_char(fa.due_date, 'Mon DD, YYYY') as due_date,
  fa.severity,
  fa.channel
from public.fee_alerts fa
join public.students s on s.id = fa.student_id
join public.guardians g on g.id = s.guardian_id;
