import { useState } from "react";
import { Prototype } from "../Prototype";
import { Section } from "../chrome";

export function PrototypeTab() {
  const [key, setKey] = useState(0);
  return (
    <Section title="Prototyp" lead="Klikalna aplikacja zbudowana z tych samych komponentów i tej samej logiki co Storybook. Po prawej trzy moduły (postać, scena, akcje) ze swoimi ustawieniami, a pod nimi stan wyliczony z reguł.">
      <div className="ctl"><button className="mini" onClick={() => setKey((k) => k + 1)}>Zacznij od nowa</button></div>
      <Prototype key={key} />
    </Section>
  );
}
