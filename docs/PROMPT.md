# Prompt: Tamadoist

You are a senior mobile engineer. Build **Tamadoist**: a to-do app with a Tamagotchi pet whose energy depends on completing the day's planned tasks. This is MVP v1: a simple to-do list with a pet. Design the architecture so habits, vitamins and finance habits can be added later (see "Roadmap") without a rewrite.

## Product

- The user has a pet. Each day has a list of planned tasks.
- **Morning review ("daily stand-up")**: at the start of each day (reminder at a user-set time, default 08:00) a review screen lists every open task (today's, overdue and undated). The user quickly decides for each one: **today**, **tomorrow** or **later** (pick a date), then confirms today's plan with one button. The energy engine counts the confirmed plan. Tasks added later in the day join today's plan.
- The pet has an **energy bar** for the day. Completing all planned tasks keeps the energy enough for the whole day. Skipped tasks drain it faster, so the pet **goes to sleep earlier** (a sleep time shown on screen).
- Home screen: big pet animation (idle / happy / tired / sleeping), energy bar, "sleeps at HH:MM" label, today's task list with checkboxes, quick add.
- Completing a task: the pet reacts (animation, haptic), energy rises.
- Language: English UI, i18n-ready (the owner is Polish; add `pl` later).

## Energy / sleep rules (put in a pure, unit-tested module `packages/core`)

- **Sleep is always exactly 8 hours.** Default schedule: bedtime 22:00, wake 06:00. The user sets only the bedtime; wake time is always derived as `bedtime + 8h` (never stored or edited separately), so the awake window is always 16 hours. Validate this invariant in `packages/core` and in the database (a check constraint or a generated column).
- Awake window: wake 06:00 to full-day bedtime 22:00 by default.
- Early sleep is the penalty: the pet falls asleep before the bedtime but still wakes at the regular wake time (06:00 by default). The user's own 8-hour schedule never changes.
- Each task has `weight` (1-3, default 1). `planned = sum(weight of today's tasks)`, `done = sum(weight of completed)`.
- `completion = planned == 0 ? 1 : done / planned`.
- **Cutoff** = wake + 9h (15:00 with the default schedule), derived like the wake time, never stored separately. If even one task of today's plan is not done by the cutoff, the pet falls asleep early.
- Sleep time = cutoff + (bedtime - cutoff) * f(completion), with f linear by default: all done → sleeps at the bedtime (22:00); 50 % done → 18:30; nothing done → 15:00, so the pet never sleeps before the cutoff. Before the cutoff the app shows the projected sleep time; tasks completed after the cutoff still raise the energy and push the sleep time later (until the pet is asleep). Recompute whenever a task changes. Before the cutoff each unfinished task also drains energy over time, so the bar falls during the day unless tasks are done.
- Energy bar = fraction of remaining awake time vs. full-day length, adjusted by completion.
- At midnight local time the day rolls over; overdue tasks can be carried over (user setting). A pet that sleeps early too many days in a row gets a `sad` mood (streaks, no permanent death in v1).
- Pure functions: `computeCutoff(settings)`, `computeSleepTime(tasks, now, settings)`, `computeEnergy(...)`, `computeMood(...)`. Cover with Vitest/Jest tests, including edge cases (no tasks, all done, DST change, timezone, a bedtime after midnight such as 01:00 → wake 09:00, and that sleep is always 8h; the user's sleep is 8h, the pet's sleep after an early bedtime is longer because it still wakes at the regular wake time; one undone task at the cutoff; tasks finished after the cutoff).

## Tech stack

- Monorepo (pnpm + Turborepo):
  - `apps/mobile`: **React Native with Expo** (SDK latest, TypeScript, Expo Router), builds for iOS and Android with EAS.
  - `apps/web`: **Next.js** (App Router, TypeScript), same features, built after mobile but with the shared code in place from the start.
  - `packages/core`: shared domain logic (energy, sleep, mood), types, validation (zod).
  - `packages/api`: typed Supabase client wrappers and shared hooks (TanStack Query).
  - `packages/design-tokens`: the design system's single source of truth (colours, typography, spacing, radii, shadows, motion, pet mood colours) as TypeScript, exported for both React Native (StyleSheet/theme object) and web (CSS variables / Tailwind theme). Components use semantic tokens only, never raw values.
  - `packages/ui`: shared components (Button, Checkbox, TaskItem, EnergyBar, PetView, SleepTimeLabel, Card, TextField, …), written once with React Native primitives and rendered on the web through `react-native-web`; platform-specific variants via `.native.tsx` / `.web.tsx` only where needed.
- Backend: **Supabase** (Postgres, Auth, Row Level Security, Edge Functions, Realtime). No custom server.
- State: TanStack Query for server state, Zustand for UI state. Offline-first: tasks can be created and completed offline and synced when back online (optimistic updates, queued mutations).
- Animation: Lottie or Rive for the pet (placeholder pixel-art sprites for v1), Reanimated for the bar.
- Notifications: Expo push notifications. Morning review reminder (default 08:00) that opens the review screen, "Your pet is getting sleepy" a bit before the cutoff and before sleep time.
- Auth: Supabase Auth with email magic link + Sign in with Apple + Google.

## Storybook (required for web and mobile)

- **Every component and the whole design system are documented in Storybook**, for both platforms:
  - **Web:** Storybook (`@storybook/nextjs` for `apps/web` components, with `react-native-web` so `packages/ui` stories render too), published to GitHub Pages from CI.
  - **Mobile:** `@storybook/react-native` (on-device Storybook) in `apps/mobile`, opened from a dev-only entry (e.g. `EXPO_PUBLIC_STORYBOOK=true`), reusing the same story files.
- Story files live next to the component (`Component.stories.tsx`), title `Group/Name` (e.g. `Pet/EnergyBar`), with stories for every state (pet moods idle/happy/tired/sleeping/sad, energy 0/50/100 %, task done/undone/overdue, loading, error, long text).
- Design-system pages in Storybook: colour palette, typography scale, spacing, radii, shadows, icons, motion, rendered from `packages/design-tokens` so they never drift.
- Controls/args for props, the a11y addon (zero violations on web), and interaction tests (`play` functions) for key flows such as completing a task.
- A test fails CI if a component in `packages/ui` or `apps/*/components` has no story.

## Data model (Supabase, SQL migrations in `supabase/migrations`)

Every table has `id uuid pk`, `user_id uuid references auth.users`, `created_at`, `updated_at`, and **RLS so a user only sees their own rows**.

- `profiles`: display_name, timezone, bedtime time default '22:00' (wake time = bedtime + 8h and cutoff = wake + 9h, both derived, not separate editable columns), review_time time default '08:00', carry_over_tasks bool, locale.
- `pets`: name, species, mood, level, xp (v1 may keep just one pet per user).
- `tasks`: title, notes, weight smallint (1-3), due_date date, due_time time null, completed_at timestamptz null, source text (`manual` now; later `todoist`), external_id text null, recurrence rrule text null.
- `daily_snapshots`: date, plan_confirmed_at timestamptz null (morning review), planned_weight, done_weight, sleep_time, energy_end (for history and streaks).
- Design for later (do not implement yet, but keep the schema extensible): `habits`, `habit_logs`, `supplements`, `supplement_logs`, `finance_habits`. Use a generic `activity` abstraction in `packages/core` (`kind: task | habit | vitamin | finance`, `weight`, `scheduledFor`, `completedAt`) so the energy engine works on any kind.

## MVP scope (v1)

1. Auth and onboarding (name the pet, pick a bedtime, default 22:00; the app shows the wake time as bedtime + 8h; pick the morning review time, default 08:00).
2. Morning review screen: today / tomorrow / later for every open task, confirm today's plan.
3. Create, edit, delete, complete tasks for today and the next days; weights; swipe actions.
4. Pet screen with energy bar and sleep time that update live.
5. Daily rollover and history screen (calendar of days with a pet mood icon).
6. Push reminders; settings (bedtime, with wake time following at +8h; morning review time; carry-over; notifications).
7. Web app (Next.js) with the same home screen after the mobile MVP works.

Out of scope for v1 (but plan for them): Todoist import (OAuth + sync via Edge Function, mapped to `tasks.source = 'todoist'`), habits (e.g. workouts), vitamins/supplements with reminders, finance habits (to be specified by the owner later), widgets, multiple pets.

## Roadmap (for architecture only)

1. Todoist two-way sync.
2. Habits (recurring, streaks, e.g. exercise).
3. Vitamins and supplements (daily schedule, reminders).
4. Finance habits (specification to come).
5. Pet evolution, items, widgets.

## Quality bar

- TypeScript strict, ESLint, Prettier, Husky pre-commit.
- Unit tests for `packages/core` (high coverage), component tests for the home screen, one Maestro (or Detox) e2e flow: sign in, add task, complete it, pet reacts.
- GitHub Actions CI: lint, typecheck, test, Storybook build + story coverage check + Storybook interaction/a11y tests, EAS preview build on PR.
- Accessibility: screen-reader labels, large text support, reduced-motion respected.
- `README.md` with setup (Supabase local via CLI, env vars, `pnpm dev`, EAS build), and `docs/ARCHITECTURE.md`.
- No secrets in the repo; `.env.example` only.

## How to work

1. Start by writing down the folder structure and the first SQL migration, then go straight on to building them.
2. Build in small, reviewable steps: (a) monorepo and CI, (b) `packages/core` with tests, (c) design tokens, `packages/ui` and Storybook for web and mobile, (d) Supabase schema and RLS, (e) mobile auth, tasks CRUD and the morning review, (f) pet screen and animations, (g) notifications, (h) web app. Every new or changed component ships with its stories in the same step.
3. After each step, run the tests and typecheck and summarize what changed.
4. Ask me only when blocked on a product decision; otherwise pick a sensible default and note it in `docs/DECISIONS.md`.
