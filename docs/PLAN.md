# Tamadoist — plan aplikacji (companion app: Tamagotchi/Pou + cele/nawyki)

## Context
Repo `chrizspace/tamadoist` jest pusty (README + .gitignore). Budujemy companion app: wirtualna postać, której energia zależy od snu i nawodnienia, z docelowym rozszerzeniem o cele/zadania w stylu Todoist. Kolejność pracy wg użytkownika: **plan → Figma (prototyp) → implementacja**. Ten dokument to etap 1.

Stack (uzgodniony): pnpm + Turborepo, Next.js (web, Vercel), Supabase (Auth Google (Apple później) + Postgres), Storybook, Playwright; później Expo/React Native.

## Zasady produktowe (MVP)
**Sen**
- Zawsze 8h. Użytkownik wybiera tylko godzinę zaśnięcia; pobudka = zaśnięcie + 8h (domyślnie 22:00–06:00).
- W oknie snu postać śpi, energia się regeneruje, akcje zablokowane.

**Energia (0–100%)**
- Dzień aktywny = 16h (pobudka → zaśnięcie). Bazowo energia starcza na 30% dnia aktywnego (~4,8h; domyślnie 6:00 → ok. 10:48).
- Cel wody liczony z **wagi**: `dailyGoalMl = weightKg * 35` (powszechnie stosowany przelicznik 30–35 ml/kg; domyślnie 35, przykład 70 kg → 2450 ml). Zaokrąglenie do 50 ml, clamp 1500–4000 ml. Użytkownik może ręcznie nadpisać cel; waga to nowe pole onboardingu/ustawień (`profiles.weight_kg`). Uwaga: to praktyczna reguła, nie zwalidowany standard kliniczny; potrzeby rosną przy sporcie/upale/chorobie, więc w UI pokazujemy disclaimer. Wpisy wody: szklanka 250 ml itd.
- Woda wydłuża pasek: pełny cel = 100% dnia aktywnego. Liniowo: `energyUntil = wake + 16h * (0.30 + 0.70 * min(drunk/goal, 1))`.
- Gdy energia = 0 → postać „zmęczona”, akcje (cele, zadania) niedostępne do wypicia wody lub snu.
- Cała logika to czysta funkcja w `packages/core` (bez zależności od React/DOM) → testy jednostkowe, reużycie w RN.

**Postać**: imię nadawane w onboardingu, zmiana w ustawieniach. Stany: energiczna / zmęczona / śpiąca / (później) głodna, szczęśliwa.

**Faza 2 (po MVP)**: cele i zadania (własne + integracja Todoist API), nagrody za ukończenie, XP/poziomy, powiadomienia (woda, pora snu).

## Onboarding / walkthrough (3 kroki + powitanie)
1. Logowanie (tylko Google na start) → ekran powitalny.
2. **Imię postaci** (walidacja 1–20 znaków).
3. **Wyjaśnienie energii**: ilustracja paska — „energia = sen + woda”; bazowo 30% dnia, woda wydłuża. Interaktywna mini-demo (suwak wody).
4. **Godzina snu**: picker godziny zaśnięcia, auto 8h, podgląd okna 22→6.
5. **Waga → cel wody**: podanie wagi (kg), podgląd wyliczonego celu (waga × 35 ml), możliwość ręcznej korekty.
→ Home.

Ekrany: Login, Onboarding (3 kroki), Home (postać + pasek energii + szybkie „+250 ml”), Woda (log/historia), Ustawienia (imię, sen, cel wody, wylogowanie).

## Architektura repo
```
apps/web            Next.js (App Router), Tailwind, @supabase/ssr
packages/ui         design tokens + primitives (Button, Input, ProgressBar/EnergyBar, Card, Modal, TimePicker, Avatar/Pet) + *.stories.tsx
packages/core       logika domeny: energy.ts, sleep.ts, water.ts (+ vitest)
packages/config     tsconfig, eslint
apps/mobile         (przyszłość) Expo; współdzieli core, tokeny
e2e/                testy Playwright
```
UI primitives piszemy z myślą o RN: tokeny w JSON (kolory, spacing, typografia), komponenty bez zależności od Next. Docelowo rozważyć NativeWind / react-native-web.

**Supabase (schemat)**
- `profiles(user_id pk→auth.users, pet_name, sleep_start time, weight_kg numeric, water_goal_ml int (domyślnie weight_kg*35, nadpisywalny), onboarded bool, tz text)`
- `water_logs(id, user_id, amount_ml, logged_at)`
- RLS: tylko właściciel wierszy. Auth: Google OAuth (Apple odłożone do wersji mobilnej/po zakupie konta Apple Developer), callback `/auth/callback`.
- Dzień liczony w strefie `tz` użytkownika.

## Storybook
- Storybook 8 (react-vite lub nextjs framework) w `packages/ui`; każdy primitive + token (Colors, Typography, Spacing) ma story, `autodocs`, addon a11y.
- Stany: default/hover/disabled/error; EnergyBar: 0/30/70/100%; Pet: awake/tired/sleeping.
- CI: `storybook build` + opcjonalnie hosting na Vercelu jako osobny projekt.

## Playwright
- E2E: onboarding (imię → wyjaśnienie → sen → home), dodanie wody podnosi pasek, zmiana godziny snu przelicza okno 8h, ochrona tras (niezalogowany → /login), ustawienia.
- Auth w testach: mock sesji Supabase (storageState / testowy użytkownik z service key lokalnie); OAuth providerów nie testujemy e2e.
- Zegar: `page.clock` do deterministycznych testów energii i snu.
- Unit: vitest dla `packages/core` (granice: północ, strefa czasowa, woda > cel, 0 ml).

## Deploy (Vercel)
- Projekt monorepo, root `apps/web`, Turborepo remote cache; zmienne: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Preview deployments per PR; Playwright w GitHub Actions na preview URL.
- Supabase: osobne projekty dev/prod, migracje w `supabase/migrations`.

## Fazy realizacji
0. **Plan** (ten dokument) — zatwierdzenie.
1. **Figma**: po podłączeniu konektora — design tokens, komponenty (te same nazwy co w Storybook), 5 ekranów + flow onboardingu, prototyp klikalny. Wyjście: link do pliku, eksport tokenów.
2. **Fundament**: monorepo, CI, Storybook ze tokenami i primitives, `core` + testy jednostkowe.
3. **Auth + dane**: Supabase, OAuth Google, migracje, RLS.
4. **Onboarding + Home + Woda + Ustawienia** wg Figmy.
5. **Playwright e2e** + deploy Vercel (preview + prod).
6. Faza 2: cele/Todoist, powiadomienia, Expo.

## Weryfikacja
- `pnpm test` (vitest core), `pnpm storybook build`, `pnpm playwright test` zielone lokalnie i w CI.
- Ręcznie: logowanie Google, onboarding, +250 ml → pasek rośnie, zmiana snu 23:00 → okno 23–07.
- Preview Vercel działa, RLS potwierdzone (użytkownik A nie widzi danych B).

## Do ustalenia później
- Formuła energii (liniowa vs. progi); Apple Sign-In później (wymaga płatnego konta Apple Developer).

## Postać (styl ilustracji, w duchu Duolingo)
- Przyjazny, zaokrąglony maskotek (np. mały stworek/ptak) o prostych kształtach, grubych jasnych konturach, płaskich kolorach i dużych oczach — czytelny w małych rozmiarach.
- Paleta: żywa zieleń/turkus jako kolor główny, ciepłe akcenty (żółty, pomarańcz), duży kontrast, zaokrąglone przyciski z "3D" cieniem na dole (jak Duolingo).
- Typografia: zaokrąglony sans (np. Nunito / DIN Rounded). Animacje: lekkie "oddychanie", mruganie, ziewanie przy niskiej energii, zzz podczas snu.
- Stany (SVG/Lottie, jeden komponent `Pet`): energiczny, zmęczony, śpiący, pije wodę (+ później: szczęśliwy, głodny). Własna, oryginalna postać — nie kopiujemy Duo.
