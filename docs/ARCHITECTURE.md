# Architecture

Spec: [`PROMPT.md`](./PROMPT.md). Decisions: [`DECISIONS.md`](./DECISIONS.md).

## Folder structure

```
tamadoist/
├── apps/
│   ├── mobile/                 # Expo (Expo Router), iOS + Android via EAS, on-device Storybook
│   │   ├── app/                # routes: (auth), (tabs)/index, review, history, settings
│   │   ├── components/         # app-only components (+ stories)
│   │   └── .rnstorybook/       # @storybook/react-native config (EXPO_PUBLIC_STORYBOOK=true)
│   └── web/                    # Next.js App Router, web Storybook (published to GitHub Pages)
│       ├── app/
│       ├── components/
│       └── .storybook/
├── packages/
│   ├── core/                   # pure domain logic: activity, schedule, energy, sleep, mood (+ Vitest)
│   ├── api/                    # typed Supabase client, TanStack Query hooks, offline mutation queue
│   ├── design-tokens/          # design system source of truth → RN theme + CSS variables
│   └── ui/                     # shared RN components (react-native-web on web) + *.stories.tsx
├── supabase/
│   ├── migrations/             # SQL migrations (schema, RLS, constraints)
│   ├── functions/              # Edge Functions (later: Todoist sync)
│   └── seed.sql
├── docs/                       # PROMPT, ARCHITECTURE, DECISIONS
└── .github/workflows/          # CI: lint, typecheck, test, Storybook, EAS preview
```

## Tooling

- pnpm workspaces + Turborepo (`turbo.json`): `lint`, `typecheck`, `test`, `build`, `dev`.
- Shared `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- ESLint flat config (`typescript-eslint` strict) + Prettier; Husky runs lint-staged before commit.
- Internal packages export their TypeScript sources directly (`main: ./src/index.ts`); apps compile them, so no package build step is needed.
