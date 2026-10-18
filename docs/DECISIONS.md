# Decisions

Product and technical decisions, newest last. The spec is `docs/PROMPT.md`.

## 2026-10-18: Morning review, cutoff and pet sleep

Decided by the owner.

- **Morning review ("daily stand-up").** A reminder at a user-set time (default 08:00) opens a review screen listing every open task. Each task goes to today, tomorrow or later; the user confirms today's plan with one button. The energy engine counts the confirmed plan; tasks added later in the day join it. The review is not mandatory: skipping it is not penalised and today's tasks count as they are.
- **Cutoff at 15:00** (wake + 9h, derived). If even one task of today's plan is undone at the cutoff, the pet falls asleep early.
- **Sleep time proportional to progress:** `sleep = cutoff + (bedtime - cutoff) * completion` (linear). All done → 22:00, 50 % → 18:30, nothing → 15:00. Tasks done after the cutoff still raise energy and push the sleep time later until the pet is asleep.
- **The pet wakes at the user's regular wake time** (bedtime + 8h, 06:00 by default), so after an early bedtime it sleeps longer than 8 h. The 8-hour rule applies to the user's schedule.

## 2026-10-18: Repository workflow

- `main` starts with a minimal commit; the spec and every later step go through a branch and a pull request.
- The spec stays in English (code and UI are English; `pl` locale comes later).
