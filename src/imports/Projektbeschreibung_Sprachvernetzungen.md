# Projektbeschreibung: Sprachvernetzungen (Wortnetz UI)
---

## Kontext & Konzept

Ich arbeite an einem künstlerischen Coding-Projekt namens **„Sprachvernetzungen"** – einer interaktiven Visualisierung, die Texte in ihre Bestandteile zerlegt und als dynamisches Netz sichtbar macht.

**Aktueller Stand:** Das Projekt ist aktuell als **Web-App** umgesetzt (React + TypeScript) und rendert das Netz mit **Three.js**.  
Ziel bleibt: Sprache als „Struktur“ sichtbar machen – nicht als linearen Text, sondern als Netz aus Teilen und Einschlüssen.

---

## Was die App aktuell kann (auf einen Blick)

- **Text eingeben** und „Anwenden“ → Netz wird neu aufgebaut
- **Parsing / Zerteilung**:
  - **Satzebene**: Sätze → Wortfolgen (N‑Gramme auf Wortebene)
  - **Wortebene**: Wörter → Zeichenfolgen (Substrings auf Zeichenebene)
  - **Beides**: kombiniert beide Ebenen
- **Force‑Layout / Physik** in Echtzeit (kann „zur Ruhe kommen“ und dann stoppen)
- **2D/3D‑View‑Mode Umschaltung** (die App unterstützt beide Modi; die 2D‑Implementation ist zentral als Three.js‑Orthokamera umgesetzt)
- **Inspector (links)**: Farben, Darstellung, Physik, Parsing, Text
- **Timeline (unten)**: Abspielkopf (Playhead), Play/Pause/Stop, Keyframes (Kamera/Physik), Undo/Redo, Scene Marker
- **Save/Load**: Export/Import eines JSON‑States (Text, Parameter, Keyframes usw.)
- **Theme**: light/dark/system

---

## Technischer Stand des Codes (Web-App)

### Einstieg / App-Struktur

- Einstieg: `index.html` → lädt `src/main.tsx`
- `src/main.tsx` rendert `src/app/App.tsx`
- `App.tsx` ist die Zentrale: hält den State (Text, Modus, Parameter, Keyframes) und verbindet:
  - `TopBar` (Datei-Menü, Theme, View-Mode, Render-Mode)
  - `Inspector` (Parameter-UI)
  - `Preview` (zeigt das Netz; je nach View-Mode 2D/3D)
  - `Timeline` (Zeitsteuerung + Keyframes)

### Datenpipeline (Netzaufbau aus Text)

In der 2D-Implementierung passiert der Netzaufbau grob so:

1. **Text normalisieren**  
   - Satzzeichen entfernen, Whitespace glätten, Uppercase

2. **Sätze splitten** (bei Satzzeichen)

3. **Knoten erzeugen** (je nach `parseMode`)
   - Satzebene: aus jedem Satz alle zusammenhängenden **Wortfolgen**
   - Wortebene: aus jedem Wort alle zusammenhängenden **Zeichenfolgen**
   - Beides: kombiniert beides (Wörter können als Brücke zwischen Ebenen dienen)

4. **Kanten erzeugen (Inklusion)**  
   Ein längerer String ist mit den Strings verbunden, die entstehen, wenn man links oder rechts **ein Element entfernt**:
   - Wortebene: „BLUE ISLAND GOES“ → Kanten zu „ISLAND GOES“ und „BLUE ISLAND“
   - Zeichenebene: analog über Zeichen

**Wichtig:** Das ist **kein semantisches Netz**, sondern ein **Einschluss-/Inklusionsnetz**.

### Knoten- und Kantenmodell

Aktuell (Web-App) gibt es intern ein einfaches Graph-Modell:

**GraphNode**
- `label`: der Text des Knotens (Wortfolge oder Zeichenfolge)
- `wordCount`: Größe/„Länge“ (bei Wortfolgen Anzahl Wörter; bei Zeichenfolgen die Zeichenanzahl)
- `sentenceIds`: Menge der Satz-IDs, aus denen der Knoten stammt (ermöglicht „Hubs“ über mehrere Sätze)
- `x, y`, `vx, vy`: Position + Geschwindigkeit für das Force-Layout
- optional: `textSprite` (Three.js Sprite für Rendering)

**GraphEdge**
- verbindet zwei GraphNodes (`a`, `b`)
- optional: `line` (Three.js Line)

### Physik (Force-Directed Layout)

Die Simulation läuft pro Frame ungefähr so:

- **Dämpfung**: Geschwindigkeit wird pro Frame reduziert
- optional **Gravity**: zieht alles zur Mitte (stabilisiert den Graphen)
- optional **Turbulence**: kleine zufällige Impulse (organische Bewegung)
- **Abstoßung**: jedes Knotenpaar beeinflusst sich (O(n²))
  - wenn zwei Knoten einen Satz teilen, ist die Abstoßung geringer (Clusterbildung)
  - zusätzlich verstärkt ein Unterschied in der „Größe“ (wordCount) die Abstoßung
  - Kraft wird nach oben begrenzt (damit es nicht explodiert)
- **Federkräfte entlang der Kanten**:
  - Kanten versuchen eine Ziel-Länge (`linkDistance`) zu erreichen
  - Stärke über `springK`
- **„Stillstand“-Erkennung**:
  - wenn die Bewegung klein genug ist und keine Turbulenz läuft, stoppt die Physik nach einer Weile (Performance)

### Rendering (2D)

2D wird mit Three.js umgesetzt, aber „flach“:

- Kamera: **OrthographicCamera** (1 World Unit ≈ 1 CSS Pixel bei Zoom=1)
- Interaktion: `OrbitControls` als **Pan + Zoom**, Rotation deaktiviert
- Kanten: `THREE.Line` mit **Vertex Colors** (Farbgradient entlang der Linie)
- Knoten: `THREE.Sprite` mit einer Canvas-Textur
  - Text wird in eine Offscreen-Canvas gerendert (inkl. Rahmen/Highlight)
  - Sprite-Skalierung hängt u.a. von der Wortanzahl ab
- Hover:
  - Raycasting auf Sprite-Objekte
  - Hover-Node wird neu gerendert (Outline/Highlight) und Cursor wird „pointer“

### UI / Inspector

Der Inspector ist in Tabs organisiert:

- **Inhalt**: Text + „Anwenden“, Parsing-Modus
- **Visuell**: Farb-Schema + Sättigung/Helligkeit, Appearance (Farben), Style (Edge opacity/width, Node scale)
- **Kamera**: Hinweise + Anzeige/Liste von Keyframes
- **Physik**: Repulsion, Spring, Damping, Link Distance, Gravity, Turbulence, Min Speed, Reset

#### UI-Konvention: SliderParam (Click-to-type)

Jeder Slider, der rechts einen numerischen Wert zeigt, muss diesen Wert **als Button** rendern, der **Click-to-type** ermöglicht:

- Klick auf Zahl → inline `<input>`
- Commit: Enter, Tab, oder Blur
- Cancel: Escape
- Commit-Wert wird immer auf `[min, max]` begrenzt (clamp)
- Bei skalierten Parametern wird `parseInput` genutzt, um die Skalierung rückgängig zu machen

Dieses Muster ist im Projekt bereits als `SliderParam` umgesetzt.

### Timeline / Keyframes / State

Die App hat eine Timeline-Logik:

- Play/Pause (Spacebar toggelt Play/Pause, solange man nicht in einem Input/Textfeld tippt)
- Playhead läuft bis zur definierten Timeline-Dauer
- Keyframes:
  - Kamera-Keyframes (v.a. für 3D relevant)
  - Physik-Keyframes (z.B. repulsion/springK/damping)
  - Keyframes können verschoben/dupliziert/gelöscht werden
  - Keyframes haben Interpolation („auto“ vs „manual“) und ggf. Gewichte (Easing Handles)
- Undo/Redo:
  - es wird ein History-Stack geführt (mit Begrenzung)
- Scene Marker:
  - Markierungen mit Zeit + Label (verschieben/umbenennen/löschen)
- Save/Load:
  - Export: JSON-Datei herunterladen
  - Import: JSON-Datei laden und Zustand wiederherstellen

---

## Bekannte Schwächen / mögliche nächste Schritte (Web-App)

- **O(n²) Abstoßung**: bei vielen Knoten wird es schnell teuer (Performance).
- **Edge-Duplikate** werden bereits vermieden, aber das kostet aktuell `edges.some(...)` (kann bei vielen Kanten ebenfalls teuer werden).
- **2D/3D Feature-Parität**: manche Dinge (v.a. Kamera-Keyframes) sind primär für 3D sinnvoll; die UI zeigt aber beides an.
- **Text-Parsing**: aktuell recht „hart“ (Uppercase, einfache Satztrennung); Mehrsprachigkeit/Tokenisierung könnte später verbessert werden.

---
