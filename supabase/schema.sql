create table if not exists audits (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id text primary key,
  audit_id text references audits(id),
  email text not null,
  company text,
  role text,
  team_size text,
  monthly_savings numeric,
  annual_savings numeric,
  created_at timestamptz not null default now()
);

create table if not exists shared_audits (
  share_id text primary key,
  audit_id text references audits(id),
  payload jsonb not null,
  created_at timestamptz not null default now()
);
