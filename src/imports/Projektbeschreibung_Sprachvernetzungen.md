# Projektbeschreibung: Sprachvernetzungen
*Systemanweisung für das Claude-Projekt*

---

## Kontext & Konzept

Ich arbeite an einem künstlerischen Coding-Projekt namens **„Sprachvernetzungen"** – einer interaktiven Visualisierung, die Texte in ihre Bestandteile zerlegt und als dynamisches Netz sichtbar macht.

Das Projekt ist in **Processing (Java)** geschrieben und erzeugt aus einem Eingabetext alle möglichen zusammenhängenden Wortfolgen (Substrings auf Wortebene). Diese werden als Knoten in einem physikbasierten, force-directed Graphen angeordnet – in 2D und 3D.

---

## Technischer Stand des Codes

### Datenpipeline
`processText()` → zerlegt Text an Satzgrenzen → `buildSubstrings()` → erzeugt aus jedem Satz alle n*(n+1)/2 Wortfolgen als Knoten.

Beispiel: „blue island goes" → `blue`, `island`, `goes`, `blue island`, `island goes`, `blue island goes`

### Knotenstruktur (`Node`)
- `label` — der Substring selbst (in Großbuchstaben)
- `pos`, `vel`, `force` — physikalische Vektoren (PVector)
- `sentenceIds` (HashSet) — aus welchen Sätzen der Knoten stammt; **Knoten die in mehreren Sätzen vorkommen sind natürliche Hubs**
- `getWordCount()` — Wortanzahl als Größenmaß

### Kantenlogik (`Edge`)
Hierarchisches Enthaltenseins-Netz: ein längerer Substring ist mit den beiden Substrings verbunden, die entstehen, wenn man je ein Wort vom linken oder rechten Rand entfernt.  
→ **kein semantisches Netz, sondern ein Inklusions-Netz**

### Physik (force-directed layout)
- **Abstoßung** (O(n²), paarweise):
  - Knoten aus demselben Satz: Faktor 0.7 (weniger Abstoßung → Clusterbildung)
  - Knoten aus verschiedenen Sätzen: Faktor 2.0
  - Wortlängenunterschied verstärkt Abstoßung (`differenceFactor`)
- **Federkraft** entlang der Kanten — zieht verbundene Knoten zusammen
- Toggle Physik: Taste `P` | Toggle 3D: Taste `3`

### Rendering
- **2D:** farbige Boxen (Farbe = Wortanzahl, HSB-kodiert), weiße Kanten als `line()`
- **3D:** schwarze Boxen, grün-monochromer Text, Kanten als kameraorientierte QUAD-Bänder (billboarding)

### Bekannte Bugs & Schwächen
| Problem | Beschreibung |
|---|---|
| `t`-Bug in Federlogik | `t = constrain(t, 0, 0.01f)` — skaliert nur 1% des Bereichs, macht Tuning-Parameter wirkungslos |
| Kanten-Duplikate | `buildSubstrings()` prüft nicht auf bereits bestehende Kanten → identische Kanten häufen sich |
| `strength`-Cap | `differenceFactor` kann Tausende erreichen, wird aber sofort auf `min(strength, 5.0f)` gekappt — komplexe Formel verpufft |
| O(n²) Abstoßung | Jeder Frame, jeder Knoten gegen jeden — bei vielen Knoten kritisch |
| Monolithische Architektur | Datenverarbeitung, Physik, Rendering, Input alles in einer Datei |

---

## Konzeptuelle Dimensionen (Projektrahmen)

Das Projekt untersucht:
- **Wortfolgen als Netz** — nicht-lineares Lesen, Enthaltensein statt Linearität
- **Hubs als Bedeutungsträger** — Wörter/Phrasen, die mehrere Sätze verbinden
- **Mehrsprachigkeit** — aktuell Englisch, perspektivisch Deutsch und weitere Sprachen
- **Netzlogik als ästhetisches Prinzip** — das Netz ist gleichzeitig Inhalt und Form

Noch nicht im Code (bewusst ausgeklammert, für spätere Phasen):
- Wörter-in-Wörtern auf Zeichenebene (z.B. „Vernetzung" enthält „Netz")
- Sprachmarkierung der Knoten
- Timeline / Interface-Erweiterungen

---

## Meine Arbeitsweise mit Claude

Ich möchte in diesem Projekt **gemeinsam und iterativ** vorgehen. Ich werde konkrete Aufgaben stellen, z.B.:

- Einzelne Bugs beheben (mit Erklärung, was und warum)
- Performance-Optimierungen einbauen (z.B. räumliches Hashing für Abstoßung)
- Neue visuelle oder konzeptuelle Features entwickeln
- Den Code schrittweise in eine sauberere Architektur refaktorieren
- Fragen zu Physik, Algorithmen oder Processing-spezifischem Verhalten klären

**Bitte:**
- Gib mir immer **fertigen, direkt einsetzbaren Code** (keine Pseudocode-Skelette)
- Erkläre Änderungen kurz, aber präzise — ich möchte verstehen, was du warum änderst
- Weise auf Seiteneffekte oder neue Folgeprobleme hin
- Wenn eine Aufgabe mehrere sinnvolle Lösungswege hat, nenn die Varianten kurz, bevor du eine umsetzt

---

## Aktueller Code (Referenz)

Der Basiscode ist eine `.pde`-Datei (Processing). Ich werde den jeweils aktuellen Stand am Anfang einer Arbeitssession anhängen oder auf konkrete Stellen verweisen.

Kernfunktionen:
- `processText(String)` — Einstiegspunkt
- `buildSubstrings(String[], int)` — Knoten- und Kantenbau
- `applyForces()` — Physik
- `updatePositions()` — Integration
- `drawNodes2D()` / `drawEdges2D()` — 2D-Rendering
- `drawNodes3D()` / `drawEdges3D()` — 3D-Rendering
- `arrangeNodesRadially()` / `arrangeNodesCone3D()` — Startlayouts
