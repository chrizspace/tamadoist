import { useState } from "react";
import { ACTIONS, GLASS_ML, applyWater } from "@tamadoist/core";
import { ActionBar, ActionButton, HomeScreen, RoundButton, SAMPLE, WaterCounter, WaterScreen } from "@tamadoist/ui";
import { Gallery, Section, Spec, SpecGrid } from "../chrome";

export function ActionsTab() {
  const [ml, setMl] = useState(1700);
  const d = SAMPLE;
  return (
    <>
      <Section title="Rejestr akcji" lead="Pasek akcji na dole ekranu jest budowany z rejestru. Dodanie akcji to jeden wpis i jeden ekran, bez zmian w istniejących ekranach.">
        <div className="box"><table className="tbl"><thead><tr><th>id</th><th>etykieta</th><th>ikona</th><th>ekran</th><th>blokada we śnie</th><th>podświetlona gdy zmęczony</th></tr></thead>
          <tbody>{ACTIONS.map((a) => <tr key={a.id}><td className="mono">{a.id}</td><td>{a.label}</td><td className="mono">{a.icon}</td><td className="mono">{a.screen}</td><td>{a.blockedWhenSleeping ? "tak" : "nie"}</td><td>{a.highlightedWhenTired ? "tak" : "nie"}</td></tr>)}</tbody></table></div>
      </Section>

      <Section title="Woda" lead="Jedyna akcja na ten moment. Dodajesz lub odejmujesz po szklance (250 ml), a postać pije i energia rośnie.">
        <SpecGrid>
          <Spec title="Pasek akcji" note="Trzy stany: zwykły, zmęczony (akcja podświetlona) i śpi (zablokowana)." stage="hillbg col">
            {([["zwykły", false, false], ["zmęczony", false, true], ["śpi", true, false]] as const).map(([l, sleeping, tired]) => (
              <div key={l} className="barrow"><span className="mono">{l}</span><div className="td-actionbar" style={{ position: "static" }}><ActionBar context={{ sleeping, tired }} /></div></div>
            ))}
          </Spec>
          <Spec title="Przycisk akcji" stage="hillbg"><ActionButton /><ActionButton active /><ActionButton disabled /></Spec>
          <Spec title="Dodawanie wody" note={`Zapis w applyWater: krok ${GLASS_ML} ml, wynik nigdy poniżej zera.`} stage="hillbg col">
            <div style={{ position: "relative", height: 84, width: 260 }}><WaterCounter drunkMl={ml} goalMl={2450} top={0} /></div>
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
          { title: "Home zmęczony", note: "Akcja Woda jest podświetlona.", node: <HomeScreen {...d} state="tired" energyPercent={0} /> },
          { title: "Home śpi", note: "Akcja zablokowana.", node: <HomeScreen {...d} state="sleeping" energyPercent={100} location="home.bedroom" period="night" /> },
          { title: "Woda", node: <WaterScreen {...d} /> },
          { title: "Woda po dodaniu szklanki", node: <WaterScreen {...d} drinking /> },
        ]} />
      </Section>
    </>
  );
}
