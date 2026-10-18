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

## 2026-10-18: Core engine defaults

Picked as defaults; the owner can change them.

- **Pet day** runs from one wake time to the next, not from midnight, so a bedtime after midnight (e.g. 01:00) stays in the same day. Task due dates still use the calendar date.
- **DST:** bedtime, wake and cutoff are wall-clock times. On a DST night the user's 8 hours on the clock are 7 or 9 real hours.
- **Energy** = awake time left until the (projected) sleep time ÷ full day (wake → bedtime), 0 while asleep. Unfinished tasks pull the sleep time earlier, so the bar drains faster; completing a task raises it.
- **Mood**, by precedence: `sleeping` (asleep) > `happy` (task completed in the last 2 minutes, or every planned task done) > `sad` (slept early 3 days in a row) > `tired` (energy below 30 %) > `idle`.
