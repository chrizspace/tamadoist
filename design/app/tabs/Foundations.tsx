import { useState } from "react";
import { Button, ElevationGuide, colors, radius, space, typography } from "@tamadoist/ui";
import { Section, Spec, SpecGrid, copyText } from "../chrome";

const GROUPS: Record<string, (keyof typeof colors)[]> = {
  Brand: ["primary", "primaryDark", "primarySoft", "accent", "accentDark"],
  Water: ["water", "waterDark", "waterSoft"],
  Sleep: ["night", "nightSoft"],
  Neutral: ["bg", "surface", "border", "text", "textMuted"],
  Feedback: ["danger"],
  Scene: ["sky", "skyNight", "hillFar", "hill", "hillNight", "tree", "treeTrunk"],
};

export function Foundations() {
  const [copied, setCopied] = useState("");
  const copy = (hex: string) => copyText(hex, () => { setCopied(hex); window.setTimeout(() => setCopied(""), 1300); });
  return (
    <>
      <Section title="Architektura" lead="Aplikacja składa się z trzech niezależnych modułów. Nowa funkcja to nowy wpis w danych danego modułu, a nie zmiana ekranów.">
        <div className="archgrid">
          {[
            ["1 · Postać", "packages/core/src/character", "Imię, godziny snu (zawsze 8 h), waga, cel wody, energia i stany.", "Nowy stan: dodaj do PET_STATES i narysuj w Pet."],
            ["2 · Scena", "packages/core/src/scene", "Pory dnia (światło) i lokalizacje: Dom, Praca, Rekreacja z pomieszczeniami.", "Nowa lokalizacja: wpis w LOCATIONS i rysunek w LOCATION_ART."],
            ["3 · Akcje", "packages/core/src/actions", "Pasek akcji budowany z rejestru. Na razie tylko woda.", "Nowa akcja: wpis w ACTIONS i własny ekran."],
          ].map(([t, path, what, how]) => (
            <div key={t} className="box arch"><h3>{t}</h3><p className="mono path">{path}</p><p>{what}</p><p className="note">{how}</p></div>
          ))}
        </div>
        <p className="note">Wybór sceny łączy moduły: lokalizację wskazuje ręczny wybór, sen, plan dnia albo miejsce, a porę dnia wyznacza zegar. Pora zmienia tylko światło.</p>
      </Section>

      <Section title="Płasko czy 3D" lead="Jedna zasada dla całego interfejsu: 3D mają tylko elementy, które można nacisnąć. Informacje i pola są płaskie, a arkusze, dialogi i menu mają tylko miękki cień.">
        <ElevationGuide />
      </Section>

      <Section title="Kolory" lead="Ciepła zieleń marki, żółty akcent, błękit wody i fiolet nocy. Kliknij próbkę, żeby skopiować kod.">
        {Object.entries(GROUPS).map(([g, keys]) => (
          <div key={g}>
            <div className="group">{g}</div>
            <div className="swatches">
              {keys.map((k) => (
                <button key={k} className="sw" onClick={() => copy(colors[k])}><i style={{ background: colors[k] }} /><b>{k}</b><span>{colors[k]}</span></button>
              ))}
            </div>
          </div>
        ))}
        <div className="toast-demo" role="status" aria-live="polite" data-on={!!copied}>{copied && `Skopiowano ${copied}`}</div>
      </Section>

      <Section title="Typografia — Nunito" lead="Zaokrąglony krój o grubych wagach, czytelny na małych ekranach.">
        <div className="box tscale">
          {(["display", "title", "heading", "body", "caption", "button"] as const).map((n) => {
            const t = typography[n];
            return <div key={n}><span className="lab">{n} · {t.size} / {t.weight}</span><span style={{ fontSize: t.size, fontWeight: t.weight }}>Wypij wodę, wyśpij się, zdobywaj cele</span></div>;
          })}
        </div>
      </Section>

      <Section title="Odstępy i promienie">
        <SpecGrid>
          <Spec title="Spacing"><div className="sp">{Object.values(space).map((s) => <div key={s}><i style={{ width: s, height: s }} />{s}</div>)}</div></Spec>
          <Spec title="Radius"><div className="rd">{Object.entries(radius).map(([n, r]) => <div key={n} style={{ borderRadius: r }}>{n}</div>)}</div></Spec>
          <Spec title="Przycisk „3D”" note="Pełny, ostry cień 4 px w ciemniejszym odcieniu. Po naciśnięciu zapada się o 4 px."><div style={{ width: 240 }}><Button>Dalej</Button></div></Spec>
        </SpecGrid>
      </Section>
    </>
  );
}
