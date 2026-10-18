import { MEALS_GOAL, type LocationId, type PeriodId } from "@tamadoist/core";
import { HeaderBar } from "../components/HeaderBar";
import { Icon, type IconName } from "../components/Icon";
import { TimeCard } from "../components/TimeCard";
import { TimePicker } from "../components/TimePicker";
import { RoundAction } from "../actions/RoundButton";
import { PetStage } from "../character/PetStage";
import type { DialKey } from "../character/Indicators";
import type { PetState } from "../character/Pet";
import { Phone, SAMPLE } from "./Screens";

export const NUTRITION_COLORS = { water: "#2A9BD8", food: "#E0A800", sleep: "#4B4FA8" } as const;

export interface NutritionScreenProps {
  name?: string;
  drunkMl?: number;
  goalMl?: number;
  meals?: number;
  mealsGoal?: number;
  sleepStart?: string;
  sleepEnd?: string;
  energyPercent?: number;
  location?: LocationId;
  period?: PeriodId;
  state?: PetState;
  /** Short pill after an action, e.g. "+250 ml". */
  gain?: string;
  onBack?: () => void;
  onWater?: () => void;
  onMeal?: () => void;
  onSleep?: () => void;
  onIndicator?: (key: DialKey) => void;
}

function Stat({ icon, label, value, pct, color }: { icon: IconName; label: string; value: string; pct?: number; color: string }) {
  return (
    <div className="td-nutri__stat" style={{ ["--c" as string]: color }}>
      <span className="td-nutri__label"><Icon name={icon} />{label}</span>
      <b>{value}</b>
      {pct !== undefined && (
        <div className="td-nutri__track" role="progressbar" aria-label={label} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
        </div>
      )}
    </div>
  );
}

/**
 * Nutrition: drink, eat and sleep in one action. The interaction bar shows the three at a glance,
 * the dock has one round button for each (+250 ml, a meal, and the sleep window).
 */
export function NutritionScreen({
  name = SAMPLE.name, drunkMl = 1700, goalMl = 2450, meals = 2, mealsGoal = MEALS_GOAL, sleepStart = "22:00", sleepEnd = "06:00",
  energyPercent = SAMPLE.energyPercent, location = "recreation.park", period = "noon", state = "awake", gain,
  onBack, onWater, onMeal, onSleep, onIndicator,
}: NutritionScreenProps) {
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="back" title="Odżywianie" percent={energyPercent} onBack={onBack} onIndicator={onIndicator} />
      <PetStage location={location} state={state} name={name} top={226} />
      <div className="td-nutri" data-testid="nutrition-card">
        {gain && <span className="td-counter__gain td-nutri__gain" role="status">{gain}</span>}
        <Stat icon="drop" label="Woda" value={`${drunkMl} / ${goalMl} ml`} pct={goalMl > 0 ? (drunkMl / goalMl) * 100 : 0} color={NUTRITION_COLORS.water} />
        <Stat icon="utensils" label="Jedzenie" value={`${meals} / ${mealsGoal}`} pct={mealsGoal > 0 ? (meals / mealsGoal) * 100 : 0} color={NUTRITION_COLORS.food} />
        <Stat icon="moon" label="Sen" value={`${sleepStart} → ${sleepEnd}`} color={NUTRITION_COLORS.sleep} />
      </div>
      <div className="td-actionbar td-actionbar--trio">
        <RoundAction tone="water" icon="drop" label="+250 ml" onClick={onWater} />
        <RoundAction tone="food" icon="utensils" label="Posiłek" onClick={onMeal} />
        <RoundAction tone="sleep" icon="moon" label="Sen" onClick={onSleep} />
      </div>
    </Phone>
  );
}

export interface SleepPageProps {
  sleepStart: string;
  sleepEnd: string;
  onSleepStart?: (v: string) => void;
  onClose?: () => void;
}

/** Sleep on its own full screen: sleep always lasts 8 hours, you only pick when it starts. */
export function SleepPage({ sleepStart, sleepEnd, onSleepStart, onClose }: SleepPageProps) {
  return (
    <div className="td-phone td-phone--plain">
      <div className="td-statusfull">
        <header className="td-status__head">
          <h3>Sen</h3>
          <button type="button" className="td-status__close" onClick={onClose} aria-label="Zamknij"><Icon name="close" /></button>
        </header>
        <div className="td-status">
          <section className="td-status__sec" style={{ ["--c" as string]: NUTRITION_COLORS.sleep }}>
            <header><h4>Okno snu</h4><span>8 h</span></header>
            <TimeCard start={sleepStart} end={sleepEnd} />
            <TimePicker label="Godzina zaśnięcia" value={sleepStart} onChange={onSleepStart ?? (() => undefined)} />
            <p className="td-status__hint">Sen zawsze trwa 8 godzin. W tym czasie energia ładuje się do 100%.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
