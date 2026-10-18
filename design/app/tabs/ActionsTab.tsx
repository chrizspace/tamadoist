import { useState } from "react";
import { ACTIONS, GLASS_ML, applyWater } from "@tamadoist/core";
import { SleepPage, ActionBar, ActionButton, HomeScreen, RoundButton, SAMPLE, WaterCounter, NutritionScreen } from "@tamadoist/ui";
import { Gallery, Section, Spec, SpecGrid } from "../chrome";

export function ActionsTab() {
  const [ml, setMl] = useState(1700);
  const d = SAMPLE;
  return (
    <>
      <Section title="Rejestr akcji" lead="Pasek akcji na dole ekranu jest budowany z rejestru. Dodanie akcji to jeden wpis i jeden ekran, bez zmian w istniejących ekranach.">
        <div className="box"><table className="tbl"><thead><tr><th>id</th><th>etykieta</th><th>ikona</th><th>ekran</th><th>zablokowana we śnie</th><th>podświetlona gdy zmęczony</th></tr></thead>
          <tbody>{ACTIONS.map((a) => <tr key={a.id}><td className="mono">{a.id}</td><td>{a.label}</td><td className="mono">{a.icon}</td><td className="mono">{a.screen}</td><td>{a.blockedWhenSleeping ? "tak" : "nie"}</td><td>{a.highlightedWhenTired ? "tak" : "nie"}</td></tr>)}</tbody></table></div>
      </Section>

      <Section title="Zadbaj" lead="Jedna akcja łączy sen, jedzenie i picie. Pasek interakcji pokazuje wodę, posiłki i okno snu, a w docku są trzy okrągłe przyciski: +250 ml, Posiłek i Sen.">
        <SpecGrid>
          <Spec title="Pasek akcji" note="Trzy stany: zwykły, zmęczony (akcja podświetlona) i śpi (Zadbaj nadal dostępne, bo pić i jeść można też wieczorem i w nocy; Zadania i Nawyki zablokowane)." stage="hillbg col">
            {([["zwykły", false, false], ["zmęczony", false, true], ["śpi", true, false]] as const).map(([l, sleeping, tired]) => (
              <div key={l} className="barrow"><span className="mono">{l}</span><div className="td-actionbar" style={{ position: "static" }}><ActionBar context={{ sleeping, tired }} /></div></div>
            ))}
          </Spec>
          <Spec title="Ikona Zadbaj zależy od potrzeby" note="Przycisk pokazuje najbliższą potrzebę: picie, jedzenie albo sen. W ostatniej godzinie przed snem i podczas snu zawsze sen; wcześniej wygrywa to, z czym postać jest bardziej do tyłu (woda lub posiłki)." stage="hillbg">
            <ActionButton label="Zadbaj" icon="drop" /><ActionButton label="Zadbaj" icon="utensils" /><ActionButton label="Zadbaj" icon="moon" />
          </Spec>
          <Spec title="Przycisk akcji" stage="hillbg"><ActionButton /><ActionButton active /><ActionButton disabled /></Spec>
          <Spec title="Dodawanie wody (składnik Odżywiania)" note={`Zapis w applyWater: krok ${GLASS_ML} ml, wynik nigdy poniżej zera.`} stage="hillbg col">
            <div className="td-static" style={{ position: "relative", height: 76, width: 320 }}><WaterCounter drunkMl={ml} goalMl={2450} /></div>
            <div style={{ display: "flex", gap: 56 }}>
              <RoundButton kind="minus" onClick={() => setMl((v) => applyWater(v, -GLASS_ML))} />
              <RoundButton kind="plus" onClick={() => setMl((v) => applyWater(v, GLASS_ML))} />
            </div>
          </Spec>
        </SpecGrid>
      </Section>

      <Section title="Ekrany akcji">
        <Gallery items={[
          { title: "Home z paskiem akcji", node: <HomeScreen {...d} /> },
          { title: "Home zmęczony", note: "Akcja Zadbaj jest podświetlona.", node: <HomeScreen {...d} state="tired" energyPercent={0} /> },
          { title: "Home śpi", note: "Zadbaj nadal dostępne.", node: <HomeScreen {...d} state="sleeping" energyPercent={50} location="home.bedroom" period="night" /> },
          { title: "Zadbaj", node: <NutritionScreen /> },
          { title: "Zadbaj po dodaniu szklanki", node: <NutritionScreen state="drinking" gain="+250 ml" /> },
          { title: "Sen", node: <SleepPage sleepStart="22:00" sleepEnd="06:00" /> },
        ]} />
      </Section>
    </>
  );
}
