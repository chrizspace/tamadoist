import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ActionsTab } from "./tabs/ActionsTab";
import { CharacterTab } from "./tabs/CharacterTab";
import { ComponentsTab } from "./tabs/ComponentsTab";
import { Foundations } from "./tabs/Foundations";
import { PrototypeTab } from "./tabs/PrototypeTab";
import { SceneTab } from "./tabs/SceneTab";

const TABS = [
  { id: "foundations", label: "Foundations", view: Foundations },
  { id: "postac", label: "Postać", view: CharacterTab },
  { id: "scena", label: "Scena", view: SceneTab },
  { id: "akcje", label: "Akcje", view: ActionsTab },
  { id: "components", label: "Components", view: ComponentsTab },
  { id: "prototyp", label: "Prototyp", view: PrototypeTab },
] as const;

type TabId = (typeof TABS)[number]["id"];

function App() {
  const initial = (location.hash || "").slice(1) as TabId;
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === initial) ? initial : "foundations");
  useEffect(() => { try { history.replaceState(null, "", `#${tab}`); } catch { /* sandboxed frame */ } }, [tab]);
  const Current = TABS.find((t) => t.id === tab)!.view;
  return (
    <div className="wrap">
      <header className="top">
        <h1><small>Tamadoist · v0.4 preview</small>Design System</h1>
        <nav className="tabs" role="tablist" aria-label="Sekcje">
          {TABS.map((t) => <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} data-tab={t.id} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </nav>
      </header>
      <main role="tabpanel" aria-labelledby={`tab-${tab}`}><Current /></main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
