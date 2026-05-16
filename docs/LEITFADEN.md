# Wortnetze — Leitfaden zum gemeinsamen Vibe‑Coding

Dieser Leitfaden ist intern: er richtet sich an die zwei Personen, die an Wortnetze arbeiten — den Konzeptgeber der ursprünglichen Processing‑Idee und Christoph, der den Editor aufgebaut hat. Er ist nicht Teil der öffentlichen Doku‑Hierarchie (`AGENTS.md`, `PROJECT.md`, `ARCHITECTURE.md`, `STYLE_GUIDE.md`) und wird von dort auch nicht verlinkt.

Zweck: beide sollen denselben Workflow fahren können — Änderungen vorschlagen, reviewen, mergen. Das Dokument erklärt die Werkzeuge, den Git‑Umgang und die Architektur des Editors so, dass kein eigenes Programmieren nötig ist, aber das Beauftragen und Lesen von AI‑Vorschlägen funktioniert.

---

## 0. Wie du diesen Leitfaden liest

Lies nicht alles am Stück. Spring in den Abschnitt, der gerade dran ist. Begriffe in *Kursiv* werden im Glossar am Ende kurz definiert. Querverweise auf die englischen Repo‑Dokumente (`AGENTS.md`, `ARCHITECTURE.md` etc.) sind absichtlich nicht ersetzt — die bleiben die Quelle der Wahrheit für die AI‑Agenten.

---

# Teil A — Was wir gemeinsam bauen

## 1. Was Wortnetze ist

Wortnetze ist ein browserbasierter Editor, der einen Text als animiertes Netzwerk aus Wörtern darstellt — Knoten sind die Wörter, Kanten sind die Beziehungen aus n‑Gramm‑Analyse. Die ursprüngliche Skizze entstand in *Processing* (Java‑basierte Coding‑Umgebung für Kunst und Visualisierung). Diese Skizze hat Christoph in einen vollwertigen Editor umgebaut, mit Timeline, Keyframe‑Animation, parametrischer Physik und einer Sidebar zur Feinjustierung.

Das Tool ist als künstlerisches Instrument gedacht, nicht als Dashboard oder Datenwerkzeug. Der visuelle Bezug liegt bei Programmen wie Figma (UI‑Design) und Adobe After Effects (Bewegtbild) — die Sidebar mit Klapp‑Sektionen, Slidern und Eigenschaftslisten orientiert sich an deren Eigenschaften‑Panels.

Aufbau der Oberfläche, falls du sie noch nicht offen hast:

- **Canvas** in der Mitte: das 3D‑Netzwerk selbst, gerendert mit *Three.js*.
- **TopBar** oben: Datei‑, Bearbeiten‑, Ansicht‑Menüs, Version, Schnellaktionen.
- **Toolbar** links innen: das aktive Werkzeug (Hand, Auswählen, etc.).
- **Sidebar** rechts: fünf Tabs — Inhalt, Visualisierung, Physik, Kamera, Canvas — jedes Tab steuert eine Gruppe von Parametern.
- **Timeline** unten: Zeitstrahl mit Keyframes für Kamera und Physikparameter.

Was im Repo unter welcher Datei steckt, listet `PROJECT.md`. Wenn du wissen willst, *warum* etwas so gebaut ist (z. B. warum Knoten als Sprites statt als 3D‑Geometrie rendern), steht das in `ARCHITECTURE.md`.

---

# Teil B — Der Werkzeugkasten

## 2. Die Werkzeugkette im Überblick

Vier Bausteine spielen zusammen. Es lohnt sich, das Bild einmal komplett zu sehen, bevor wir in die Details gehen.

1. **GitHub Codespaces** — ein vollständiger Linux‑Computer, der auf Googles oder Microsofts Servern läuft. Dein eigener Rechner muss nur einen Browser haben. Du kannst nichts lokal kaputtmachen, und mehrere Geräte greifen auf denselben Stand zu.
2. **VSCode** — der Editor, der im Codespace läuft. Du siehst ihn als Webseite im Browser oder in der VSCode‑Desktop‑App, die sich mit dem Codespace verbindet. Im Editor öffnest du Dateien, schreibst Befehle in ein Terminal und siehst die Versionsverwaltung.
3. **Browser‑Vorschau** — sobald du den *Dev‑Server* startest (siehe Abschnitt 17), zeigt VSCode eine URL an, die du in einem neuen Browser‑Tab öffnest. Dort läuft die App live. Jede Änderung am Code aktualisiert die Vorschau sofort.
4. **AI‑Agent** — Claude Code im Terminal, GitHub Copilot im Seitenpanel von VSCode, oder Google Antigravity als eigene IDE. Das ist die Person, die für dich programmiert. Du beschreibst die gewünschte Änderung, der Agent schreibt den Code, du prüfst das Ergebnis.

Daraus folgt: du brauchst keinen Compiler, kein npm, kein Git lokal installiert. Alles liegt im Codespace. Wenn du heute abends den Laptop wechselst, startest du denselben Codespace im neuen Browser und arbeitest weiter.

## 3. GitHub Education — was kostenlos verfügbar ist

Beide Konten sind über das GitHub‑Education‑Programm verifiziert. Daraus ergeben sich vier konkrete Vergünstigungen:

- **GitHub Copilot** ist gratis (über den 2026 eingeführten Copilot‑Student‑Plan). Der „Auto"‑Modus wählt automatisch ein passendes Premium‑Modell. Direkte manuelle Auswahl von Claude Opus oder Sonnet ist im Student‑Plan seit Frühjahr 2026 eingeschränkt, aber „Auto" routet ohnehin auf vergleichbar gute Modelle.
- **GitHub Codespaces** umfasst 180 Core‑Stunden pro Monat auf Pro‑Niveau (Pro = bessere Hardware: 4 Kerne statt 2). Das reicht für mehrere Stunden Editor‑Nutzung pro Tag. Im Codespaces‑Dashboard (`github.com/codespaces`) siehst du den Verbrauch.
- **Student Developer Pack** enthält dutzende Drittanbieter‑Vergünstigungen (Domains, Cloud‑Credits, Lerntools). Für uns nicht zentral, aber gut zu wissen.
- **Zertifizierungsgutscheine** — ein Voucher pro Kalenderjahr für eine GitHub‑Foundations‑ oder Copilot‑Zertifizierung. Optional.

Hinweis: Neue Anmeldungen für Copilot Pro / Pro+ (die kostenpflichtigen Pläne) sind seit April 2026 pausiert. Wer schon einen aktiven Plan hat, behält ihn. Die Student‑Plan‑Anmeldung über Education läuft weiter.

## 4. GitHub Codespaces

Ein Codespace ist eine virtuelle Maschine, die GitHub für dich startet. Er enthält das Repo bereits ausgecheckt, Node.js installiert, Git konfiguriert und VSCode als Oberfläche.

**Codespace starten:** auf der Repo‑Seite oben rechts den grünen „Code"‑Knopf, dann Tab „Codespaces", dann „Create codespace on `<branchname>`". Beim ersten Start dauert die Einrichtung ein paar Minuten. Danach hast du einen URL‑Eintrag, den du jederzeit wieder öffnen kannst.

**Codespace pausieren:** geschieht automatisch nach 30 Minuten ohne Aktivität. Alle Dateien bleiben erhalten. Aktive Stunden zählen nur, solange der Codespace läuft.

**Codespace löschen:** wenn ein bestimmter Stand nicht mehr gebraucht wird (z. B. nach einem fertigen PR), unter `github.com/codespaces` den Eintrag entfernen. Ungenutzte Codespaces zählen langfristig gegen das Speicher‑Kontingent.

**Welcher Codespace gehört zu welchem Branch?** Jeder Codespace ist an einen Branch geknüpft. In der unteren VSCode‑Statusleiste steht der aktive Branch (z. B. `phase1.1-sidebar-atoms-hierarchy`). Wenn du innerhalb des Codespaces den Branch wechselst (siehe Teil C), ändert sich nur das, nicht der Codespace selbst.

Für unsere Zusammenarbeit empfehlenswert: pro aktiver Arbeitslinie ein eigener Codespace. So bleibt unklarheitsfrei, wer woran arbeitet.

## 5. VSCode als IDE

VSCode (Visual Studio Code) ist ein Texteditor von Microsoft, der mit Plugins zu einer vollständigen Programmierumgebung (*IDE — Integrated Development Environment*) ausgebaut wird. Im Codespace startet er automatisch.

Die fünf Bereiche, die du im Alltag siehst:

- **Explorer** (links): die Datei‑ und Ordnerstruktur des Projekts. Hier navigierst du zum Code.
- **Editor** (Mitte): die geöffneten Dateien als Tabs. Mehrere Dateien nebeneinander durch Drag.
- **Terminal** (unten, mit `` Strg+` `` aufrufbar): hier startest du Befehle wie `npm run dev` oder sprichst mit Claude Code.
- **Source Control** (linkes Seitenpanel, Verzweigungs‑Icon): das Git‑Frontend. Geänderte Dateien, Staging, Commit‑Eingabefeld.
- **Ports** (im Terminal‑Bereich): zeigt, welche Server gerade laufen, und gibt dir den Klick‑Link zum Browser.

Zwei Tastenkombinationen, die viel sparen:

- `Strg/Cmd + P` öffnet eine Suche über alle Dateinamen — schneller als der Explorer.
- `Strg/Cmd + Shift + P` öffnet die Befehls‑Palette mit *allen* Editor‑Funktionen.

**Drei Wege, mit einem AI‑Agenten zu arbeiten:**

- **VSCode + Claude Code im Terminal.** Christoph nutzt das. Du tippst `claude` im Terminal, beschreibst die Änderung, der Agent stellt Rückfragen, schlägt Edits vor und führt sie nach Bestätigung aus. Dialogisch, mit langem Kontext.
- **VSCode + GitHub Copilot Agent Mode.** Eingebaut in VSCode, kein separater Start. Im rechten Panel öffnet sich ein Chat. „Agent Mode" (seit 2025 verfügbar, seit 2026 weiter ausgebaut mit Sub‑Agenten und Plan‑Agent) führt mehrstufige Aufgaben aus — Code schreiben, Terminal nutzen, Browser‑Tests laufen lassen. Vorteil: tiefe GitHub‑Integration (Issues, PR‑Kommentare, Actions).
- **Google Antigravity.** Eigene IDE (kein VSCode‑Plugin), seit November 2025 verfügbar, von Google gestartet zusammen mit Gemini 3. Zwei Sichten: die „Editor View" sieht aus wie ein klassischer Editor, die „Manager View" ist eine Steuerzentrale, in der du mehrere Agenten parallel beauftragst. Die Agenten erzeugen „Artifacts" — Pläne, Screenshots, Browser‑Aufnahmen — als Beleg ihrer Arbeit. Standardmodell ist Gemini 3 Pro, Claude Sonnet ist umschaltbar.

Pragmatische Empfehlung: starte mit VSCode + Copilot, weil Copilot bei eurem Education‑Plan ohnehin enthalten ist. Wenn dir das zu wenig führt, probiere Claude Code dazu.

## 6. Die AI‑Agenten und ihre Regeln

Egal welches der drei Werkzeuge zum Einsatz kommt — alle lesen dieselben Regel‑Dateien aus dem Repo. So bekommt jedes Tool denselben Stil, dieselben Constraints, dieselbe Architektur‑Sicht. Die wichtigsten:

- **`AGENTS.md`** — die Quelle der Wahrheit. Hier stehen die unveränderlichen Regeln: „App.tsx bleibt schlanker Layout‑Komponist", „UI ist deutsch", „bei Unklarheit nachfragen, nicht raten". Wenn du selber einen Agenten beauftragst, lohnt es sich, einen Blick in diese Datei zu werfen, damit deine Anweisung nicht im Widerspruch zu den Repo‑Regeln steht.
- **`PROJECT.md`** — eine Karte, welche Datei welche Rolle hat. Nützlich, wenn du jemanden auf eine bestimmte Stelle ansetzen willst.
- **`ARCHITECTURE.md`** — das Innenleben des Editors: Render‑Pipeline, Datenfluss, Physik‑Worker, Kamera‑System. Liest der Agent, bevor er an 3D‑ oder State‑Code geht.
- **`STYLE_GUIDE.md`** — visuelle Regeln: erlaubte Farbtokens, Slider‑Verhalten, Typografie. Liest der Agent, bevor er UI‑Code anfasst.
- **`ROADMAP.md`** — was geplant ist und was noch fehlt (aktuell noch nicht final ausgeschrieben).
- **`CLAUDE.md`** und **`GEMINI.md`** — sehr kurze Dateien, die nur darauf hinweisen, dass die echten Regeln in `AGENTS.md` stehen. Sie existieren, weil die Werkzeuge von Anthropic und Google diese Dateinamen automatisch laden. Inhaltlich redundant, formal nötig.

**Plan‑Modus vs. Auto‑Modus.** Beide großen AI‑Werkzeuge unterscheiden zwischen zwei Arbeitsweisen. Im Plan‑Modus erstellt der Agent erst einen schriftlichen Vorschlag, du segnest ihn ab, dann erst werden Dateien geändert. Im Auto‑Modus schreibt der Agent direkt los und du bestätigst pro Tool‑Aufruf. Plan‑Modus ist sinnvoll bei größeren oder unklaren Aufgaben, Auto‑Modus bei kleinen, gut umrissenen Änderungen.

**Wie du selbst beauftragst.** Eine brauchbare Anweisung enthält drei Teile: was geändert werden soll, in welcher Datei (falls bekannt), und warum bzw. wie es sich ins Bestehende einfügt. Beispiel: „In der Sidebar im Visualisierungs‑Tab soll bei den Knoten‑Optionen ein neuer Slider für die Knoten‑Transparenz erscheinen. Bitte erst einen Plan vorschlagen, das soll konsistent zu den anderen Slider‑Atomen sein." Je mehr Kontext der Agent hat, desto weniger Korrekturschleifen brauchst du.

## 7. Wöchentliche und Session‑Limits

Die AI‑Modelle, die wir nutzen, sind in den meisten Plänen mengenbegrenzt. Die zwei Begrenzungen, die im Alltag auftauchen:

**Session‑Fenster (5 Stunden).** Sobald du eine erste Nachricht an Claude Code schickst, beginnt ein rollendes Fünf‑Stunden‑Fenster. In diesem Fenster steht dir ein Nachrichten‑Budget zur Verfügung, das vom Plan abhängt. Beim Anthropic‑Pro‑Plan ist es klein, bei Max 5× sind es grob 225 Nachrichten pro Fenster, bei Max 20× rund 900. Wenn das Fenster voll ist, musst du warten, bis es vorbeigeht.

**Wochenlimit (rollende 7 Tage).** Unabhängig davon gibt es ein wöchentliches Maximum, das du über mehrere 5‑h‑Fenster verteilen kannst. Das ist die echte Obergrenze.

Bei Copilot funktioniert das ähnlich, aber der „Auto"‑Modus zählt nicht ins Premium‑Kontingent: er bleibt also offen, selbst wenn dein Anteil an manuell wählbaren Modellen aufgebraucht ist.

Praktische Konsequenzen:

- **Schwere Aufgaben (Architektur, Doku‑Überarbeitung, schwieriges Debugging)** mit dem teuersten verfügbaren Modell (Opus oder Pro‑high) — die kosten viel pro Antwort, lohnen sich aber bei den 10 % der Aufgaben, bei denen Qualität zählt.
- **Routine‑Refactoring, kleine Features, Atom‑Anwendung** mit dem mittleren Modell (Sonnet oder Pro‑low).
- **Trivialitäten (Umbenennungen, einzeilige Fixes)** mit dem günstigsten Modell (Haiku oder Flash).

Faustregel: planen mit dem teuersten, ausführen mit dem mittleren, putzen mit dem günstigsten.

## 8. Welche Modelle konkret zur Auswahl stehen

Drei Anbieter, drei Werkzeuge, jeweils eigene Modellpaletten. Stand Mai 2026:

**In Google Antigravity** (Modell‑Schalter oben rechts):

| Modell | Charakter | Wofür |
|---|---|---|
| Gemini 3 Flash | schnellster, billigster | simple Edits, „lese diese Datei und erkläre" |
| Gemini 3.1 Pro (low) | Allrounder, Default | die meisten Agenten‑Aufgaben |
| Gemini 3.1 Pro (high) | derselbe, mit längerem Nachdenken | knifflige Bugs, neue Patterns |
| Claude Sonnet (aktuelle Version) | Anthropics Arbeitstier | sauberes Refactoring, vorhandene Muster anwenden |
| Claude Opus (aktuelle Version) | gründlichster Denker | Architektur, Debugging unerklärlicher Phänomene |

**In GitHub Copilot** (Plan‑abhängig): GPT‑5.x, Claude Sonnet 4.6, Gemini 2.5 Pro, plus Auto‑Modus als Fallback. Im Student‑Plan ist Auto die zuverlässige Wahl.

**In Claude Code** (Kommandozeilen‑Tool von Anthropic): Opus 4.7 (~$5/$25 pro Million Tokens), Sonnet 4.6 (~$3/$15), Haiku 4.5 (~$1/$5). Die Tokenisierung von Opus 4.7 erzeugt für denselben Eingabetext bis zu 35 % mehr Tokens als die Vorversion — die effektiven Kosten pro Anfrage sind also höher als der reine Preis pro Token suggeriert.

Welches Werkzeug du wählst, ist oft Geschmackssache: Claude Code ist dialogischer und stark beim Refactoring, Copilot ist tiefer in GitHub‑Workflows verzahnt, Antigravity bietet die Manager‑View für mehrere parallele Agenten. Die Modelle dahinter sind sich in der Qualität nahe.

---

# Teil C — Gemeinsam arbeiten mit Git

Dieser Teil ist der wichtigste für die Zusammenarbeit. Bisher hat Christoph weitgehend allein gearbeitet und direkt auf den `main`‑Branch commitet. Das geht, solange nur eine Person etwas ändert. Sobald zwei parallel arbeiten, brauchen wir Branches und Pull Requests — sonst überschreibt jeder die Änderungen des anderen.

## 9. Git‑Grundbegriffe

Git verwaltet eine Folge von Schnappschüssen eines Verzeichnisses. Die Begriffe lassen sich am leichtesten an der Analogie eines Manuskripts erklären: stell dir vor, du arbeitest an einem Buch mit mehreren Kapiteln und willst jede Version dauerhaft archivieren.

- **Arbeitsverzeichnis (working tree):** der Stapel Manuskript auf deinem Schreibtisch, an dem du gerade schreibst. Hier siehst du die aktuelle Fassung jeder Datei.
- **Staging (auch: Index):** ein zweiter, kleinerer Stapel daneben. Du nimmst gezielt die Seiten dorthin, die in den nächsten Schnappschuss eingehen sollen. So kannst du fünf Dateien geändert haben, aber nur drei davon ins Archiv geben.
- **Commit:** das eigentliche Versiegeln. Du fasst den Staging‑Stapel zusammen, schreibst eine kurze Nachricht darauf („Sidebar‑Slider eingefügt"), und Git legt diesen Schnappschuss unwiderruflich ab. Jede Datei, jeder Buchstabe, das Datum, der Autor — alles bleibt erhalten.
- **Repository (Repo):** das Archiv aller bisherigen Schnappschüsse plus die laufende Arbeit. Liegt einmal in deinem Codespace, einmal auf GitHub.
- **Push:** du schickst neue Schnappschüsse von deinem Codespace zum gemeinsamen GitHub‑Server, damit andere sie sehen.
- **Pull:** der umgekehrte Weg. Du holst neue Schnappschüsse, die der/die andere auf GitHub abgelegt hat, in deinen Codespace.

In VSCode laufen die meisten dieser Schritte über das Source‑Control‑Panel. Du brauchst die Kommandozeile nicht. Wenn doch, hier die direkten Befehle:

```
git status               # was hat sich geändert?
git add <datei>          # eine Datei zum Staging hinzufügen
git commit -m "Nachricht"
git push                 # zum Server schicken
git pull                 # vom Server holen
```

## 10. Branches — warum wir nicht mehr direkt auf main commiten

Ein Branch ist eine parallele Variante des Repos. Solange du auf einem Branch arbeitest, kannst du beliebige Commits machen, ohne dass die Hauptlinie (`main`) davon betroffen ist. Erst wenn du fertig bist und der Branch reviewt wurde, fließt er zurück in `main`.

Analogie aus der Bildbearbeitung: ein Branch verhält sich ähnlich wie eine Adjustment Layer in Photoshop — eine zusätzliche Ebene über dem Originalbild, an der du frei experimentieren kannst. Solange du sie nicht aufs Originalbild zusammenrechnest, bleibt das Original unberührt. Du kannst die Ebene auch wegwerfen, falls das Experiment nicht aufgeht.

Warum das hier nötig wird: wenn zwei Leute gleichzeitig direkt an `main` schreiben, kommen sich ihre Schnappschüsse in die Quere. Git müsste raten, welche Änderung gewinnt, und je nach Reihenfolge gehen Dinge verloren. Mit Branches arbeitet jeder in seiner eigenen Linie; das Zusammenführen ist ein expliziter, kontrollierter Schritt.

**Einen Branch erstellen.** Im VSCode‑Source‑Control‑Panel gibt es unten links den Branch‑Namen. Klick drauf → „Create new branch from main" → Namen eingeben. Oder in der Kommandozeile:

```
git checkout main
git pull
git checkout -b feature/<kurzbeschreibung>
```

Wir nutzen ein einfaches Namensschema: `feature/<thema>` für neue Funktionen, `fix/<thema>` für Bugfixes, `docs/<thema>` für reine Dokumentation. Beispiel: `feature/sidebar-color-row`.

**Zwischen Branches wechseln.** `git checkout <branch>` oder im Source‑Control‑Panel der Klick auf den Branch‑Namen unten. Vorher unbedingt offene Änderungen committen oder stashen, sonst nimmt Git sie ungewollt auf den nächsten Branch mit.

**Branch löschen.** Nachdem ein Branch gemerged wurde (siehe Pull Requests), löscht man ihn — der Inhalt steckt ja jetzt in `main`. Auf GitHub gibt es nach dem Merge einen „Delete branch"‑Knopf. Lokal: `git branch -d <branch>`.

**Merge‑Konflikte.** Wenn beide am selben Branch dieselbe Zeile derselben Datei ändern, weiß Git nicht, welche Version gewinnen soll. Das nennt sich Konflikt und passiert in der Praxis selten, wenn die Branches gut zugeschnitten sind. Im Konfliktfall markiert Git die betroffenen Zeilen mit `<<<<<<<` und `>>>>>>>` — du musst entscheiden, welche Variante bleibt. Eine AI im Terminal kann dir dabei helfen („löse den Merge‑Konflikt in dieser Datei, behalte beide Änderungen wenn möglich").

## 11. Pull Requests — das Herz der Zusammenarbeit

Ein Pull Request (PR) ist eine formale Anfrage: „Auf meinem Branch sind diese Änderungen. Ich schlage vor, sie in `main` zu übernehmen. Bitte schau drüber, kommentiere, dann mergen wir." Der Begriff stammt aus der Anfangszeit der Open‑Source‑Welt — „pull" bezog sich auf den Vorgang, dass der Projekt‑Eigentümer die Änderungen aus deinem Fork zu sich „zieht". Heute meint man damit den gesamten Review‑Vorgang.

Analogie: vergleichbar mit einem Korrekturlauf vor dem Druck. Du hast dein Manuskriptkapitel fertig, gibst es dem/der Lektor:in, sie/er markiert Stellen, kommentiert, schlägt Umformulierungen vor. Du arbeitest die Anmerkungen ein, dann erst geht der finale Stand in den Druck.

Warum ein PR überhaupt nötig ist und nicht direkt mergen:

1. **Vier‑Augen‑Prinzip:** der Reviewer sieht Dinge, die der Autor übersehen hat.
2. **Diskussion am konkreten Code:** Kommentare können an einzelne Zeilen geheftet werden, nicht nur an die Datei oder den Branch insgesamt.
3. **Nachvollziehbarer Verlauf:** in einem Jahr steht im PR, was wir warum geändert haben — das ist effektiv die Projekt‑Memoir.
4. **Sicherheitsnetz:** wenn der Build kaputtgeht oder ein Test scheitert, fängt es der PR ab, bevor es in `main` landet.

**Anatomie eines PR auf GitHub:**

- **Titel** — eine Zeile, was gemacht wurde.
- **Beschreibung** — drei bis fünf Sätze: was, warum, wie testen. Optional Screenshots.
- **Diff‑Ansicht** — Zeile für Zeile, welche Änderungen vorgeschlagen sind. Rot = gelöscht, grün = neu.
- **Reviewers** — Personen, die explizit um Review gebeten werden.
- **Conversation** — Kommentare zum PR insgesamt oder zu einzelnen Zeilen.
- **Checks** — falls GitHub‑Actions laufen (siehe Teil E), sieht man hier grünes Häkchen oder rotes Kreuz.
- **Merge‑Knopf** — wird aktiv, wenn alle Bedingungen erfüllt sind.

**Der Ablauf, Schritt für Schritt:**

1. Auf deinem Branch arbeiten, commiten, pushen.
2. Auf GitHub erscheint nach dem ersten Push automatisch ein gelber Banner: „Compare & pull request". Anklicken.
3. Titel und Beschreibung schreiben. Wenn unklar ist, was getestet werden muss, ein paar konkrete Schritte angeben („Sidebar öffnen, im Visualisierungs‑Tab den neuen Slider bewegen, Vorschau prüfen").
4. Den/die Reviewer:in rechts in der Seitenleiste eintragen.
5. „Create pull request" klicken.
6. Der/die Reviewer:in geht den Diff durch, hinterlässt ggf. Kommentare an einzelnen Zeilen. Du siehst die Benachrichtigung in deinem GitHub‑Posteingang.
7. Du machst neue Commits auf demselben Branch und pushst sie. Der PR aktualisiert sich automatisch — keine Neueröffnung nötig.
8. Wenn alles passt, klickt der/die Reviewer:in „Approve". Anschließend kann der „Merge pull request"‑Knopf gedrückt werden.
9. Nach dem Merge: den Branch löschen (Knopf erscheint direkt). Im eigenen Codespace lokal `git checkout main && git pull`, um den frischen Stand zu holen.

**Wer mergt?** Im Zweifel der/die Autor:in selbst, nach dem Approve. Das ist die übliche Konvention: der/die Reviewer:in gibt frei, der/die Autor:in drückt den Knopf, weil sie/er besser weiß, ob noch etwas hinterherkommt.

**Branch Protection einrichten.** Damit niemand versehentlich direkt auf `main` commitet, lässt sich das technisch unterbinden. In den Repo‑Settings unter „Rules" einen Ruleset anlegen, der für den `main`‑Branch verlangt: „Require a pull request before merging", „Require approvals: 1". Die „Required Reviewer Rules" wurden im Februar 2026 für alle Repos allgemein verfügbar. Für Admins (also uns beide) ist ein Override möglich, falls einer mal allein dringend etwas reinheben muss — aber regulär läuft alles über PRs.

## 12. Vorgeschlagener Wochen‑Rhythmus

Ein konkretes Schema für die Zusammenarbeit:

1. Vor dem Arbeiten in deinem Codespace: `git checkout main`, `git pull`. Du hast den frischen Stand.
2. Neuen Branch erstellen: `git checkout -b feature/<thema>`.
3. Arbeiten. Lieber drei kleine Commits („Slider eingefügt", „Label angepasst", „Test im Browser geprüft") als ein riesiger Sammelschritt. Die Commit‑Nachrichten kannst du dir vom AI‑Agenten generieren lassen.
4. Wenn ein logischer Schritt fertig ist und im Browser funktioniert: pushen.
5. PR öffnen, Beschreibung schreiben, anderen pingen.
6. Während du auf das Review wartest: am nächsten Branch weiterarbeiten.
7. Nach dem Approve mergen, Branch löschen, von vorne.

Faustregel: lieber fünf kleine PRs pro Woche als ein großer am Freitag. Kleine PRs sind schneller reviewt, weniger fehleranfällig, leichter zu rollbacken, wenn etwas schiefging.

---

# Teil D — Was unter der Haube läuft

Hier geht es nicht darum, dass du den Code schreibst. Es geht darum, dass du eine PR‑Beschreibung verstehst, einen Vorschlag eines AI‑Agenten einordnen kannst und weißt, worauf der/die andere sich bezieht, wenn von „dem Atom" oder „dem Worker" die Rede ist.

## 13. Die Sprache: TypeScript

Der Editor ist in TypeScript geschrieben. TypeScript ist im Kern JavaScript (die Sprache, in der fast alle Browser‑Programme laufen) mit einer Erweiterung: jeder Wert hat einen *Typ*. Eine Variable, die eine Zahl halten soll, ist als `number` deklariert. Eine, die einen Text hält, als `string`. Eine Funktion, die einen Slider‑Wert nimmt und zurückgibt, hat dokumentierte Eingabe‑ und Ausgabetypen.

Warum das hilft: der Editor (VSCode) merkt sofort, wenn jemand versehentlich einen Text dort einsetzt, wo eine Zahl erwartet wird — und unterstreicht die Stelle rot, lange bevor das Programm überhaupt läuft. Das fängt eine ganze Klasse von Fehlern ab. Für dich beim Lesen heißt das: wenn in einer Codezeile `: string` oder `: number` steht, ist das eine Typ‑Angabe, kein Wert.

Die Datei `tsconfig.json` im Repo legt fest, wie streng TypeScript urteilt. Wir laufen im strict mode — das ist die unnachgiebigste Variante und macht den Code am sichersten.

## 14. Die UI‑Bausteine: React, shadcn, Tailwind, atomic components

Die Oberfläche ist mit **React** gebaut. React ist eine Bibliothek von Facebook (jetzt Meta), die das Prinzip durchsetzt: eine Oberfläche besteht aus *Komponenten* — kleine, eigenständige Bausteine, die jeweils ein Stück UI darstellen. Eine Komponente ist eine Funktion, die ein Stück HTML zurückgibt. Komponenten können andere Komponenten enthalten, so ergibt sich die Baumstruktur der ganzen App.

**shadcn/ui** ist keine klassische Komponentenbibliothek — du installierst keine fertige Sammlung, sondern kopierst die Quelltexte der Komponenten direkt in dein Repo (unter `src/app/components/ui/`). Vorteil: du kannst sie anpassen, ohne von einer fremden Bibliothek abhängig zu sein. Im Repo benutzen wir shadcn als Quelle für Slider, Schalter, Menüs, Dialoge, etc. Die Komponenten basieren wiederum auf **Radix UI** (zuverlässige Logik, keine Optik) und werden mit **Tailwind CSS** gestylt.

**Tailwind CSS** ist eine sehr eigenwillige Art, Stile zu schreiben. Statt eine separate CSS‑Datei zu pflegen, schreibst du die Stile als Klassen direkt an das HTML‑Element: `<div className="flex items-center gap-2 px-4 py-2">`. Jede Klasse macht eine genau definierte Sache (`flex` = Flex‑Layout, `gap-2` = 8 Pixel Abstand). Das wirkt zunächst chaotisch, ist aber bei größeren Projekten erstaunlich pflegeleicht — weil keine fremden Stile irgendwo anders liegen, die das Element überschreiben könnten.

**Atomic Components** ist unser Architekturprinzip. Vergleichbar mit den Components in Figma: ein Baustein wird einmal definiert, vielfach instanziert, und eine Änderung am Master schlägt überall durch. Konkret bei uns: in der Sidebar gibt es eine Hierarchie von Bausteinen:

```
Sidebar (das ganze rechte Panel)
 └─ Section   — H2‑Überschrift, fasst eine Gruppe verwandter Steuerelemente zusammen
     └─ Group — H3‑Überschrift, optional, für echte Untergruppen mit mehreren Steuerelementen
         └─ Row — eine Zeile mit einem Steuerelement (Slider, Schalter, Farbfeld)
             └─ Atom — die unteilbaren Stücke darin (Value‑Chip, Keyframe‑Toggle, Slider‑Track)
```

Alle Rows haben dieselbe Grundgrammatik: links ein Label, rechts ein Wert‑Chip plus Zubehör, darunter das eigentliche Steuerelement, darunter optional eine Beschreibung. Definiert wird das in `src/app/components/sidebar/SidebarAtoms.tsx`. Wenn wir einmal das Atom anpassen (z. B. die Akzentfarbe ändern), ändert sich das Erscheinungsbild aller Slider in der gesamten Sidebar automatisch. Das ist der Grund für den Aufwand, alles atomar zu bauen — Konsistenz mit einem zentralen Schalter.

Der laufende Refactor (Phase 1 bis 5, dokumentiert im internen Master‑Plan) bringt die übrigen UI‑Flächen — TopBar, Toolbar, Timeline, Preview, Dialoge — auf dasselbe Atom‑Prinzip.

## 15. Die 3D‑Welt: Three.js

**Three.js** ist eine Bibliothek, die 3D‑Grafik im Browser möglich macht, ohne ein Plugin oder eine Spiele‑Engine. Sie nutzt WebGL, eine Browser‑Schnittstelle zur Grafikkarte. Drumherum baut Three.js den ganzen Werkzeugkasten: Szene, Kamera, Lichter, Materialien, Renderer, Animations‑Loop.

Wir nutzen Three.js **imperativ** — das heißt: wir rufen die Funktionen direkt auf, statt eine React‑Wrapper‑Bibliothek wie `react-three-fiber` zu verwenden. Begründung: bei einer kunstorientierten Anwendung mit eigener Physik, eigener Kamera‑Logik und Custom‑Shadern (Glitch‑Effekt, weiche Texturen) gewinnen wir mehr Kontrolle, als wir an Bequemlichkeit verlieren. Der Code für das 3D‑Bild liegt komplett in `Network3D.tsx`.

Drei Render‑Entscheidungen, die du im Code immer wieder lesen wirst:

- **Knoten als Sprites.** Ein Sprite in Three.js ist eine flache Grafik, die immer zur Kamera ausgerichtet bleibt — vergleichbar mit einem Stoffschild auf einer Bühne, das man je nach Zuschauer‑Position dreht, damit es immer frontal lesbar ist. Für jedes Wort generieren wir eine Bild‑Textur (in HTML‑Canvas), die den Text scharf zeigt, und kleben sie auf den Sprite. Drei Texturen pro Wort (normal, hervorgehoben, ausgewählt) werden gecacht.
- **Kanten als ein einziges Linienobjekt.** Statt jede Verbindung als eigenes 3D‑Objekt zu führen, packen wir alle Linien in ein einziges `THREE.LineSegments`‑Bündel. Das ist ein Detail mit großer Wirkung: die Grafikkarte zeichnet alle Kanten in einem einzigen Aufruf, statt zehntausende einzeln zu malen.
- **Physik im Web Worker.** Die Kräfte, die die Knoten bewegen (Anziehung, Abstoßung, Dämpfung, Streuung), werden nicht im selben Thread berechnet wie die UI. Stattdessen läuft ein **Web Worker** — ein Hintergrund‑Thread des Browsers — der die Positionen rechnet und das Ergebnis als Float‑Array an den Hauptthread zurückschickt. Vorteil: die Bedienoberfläche bleibt flüssig, selbst wenn die Physik viel rechnet. Der Worker‑Code liegt in `src/app/graph/physics.worker.ts`.

Im Repo gibt es zwei Kameramodi: 3D (perspektivisch, mit Maussteuerung über OrbitControls) und 2D (orthographisch, also wie ein technischer Riss ohne Tiefenverkürzung). Im Code unterscheidet sich das nur an wenigen Stellen, sonst ist der Render‑Pfad identisch.

## 16. Animation: Hermite‑ und Bezier‑Kurven

Die Timeline am unteren Rand des Editors enthält *Keyframes* — Zeitpunkte, an denen ein Wert (z. B. die Kameraposition oder ein Physik‑Parameter) explizit festgelegt ist. Zwischen zwei Keyframes muss der Wert auf irgendeine Weise interpoliert werden. Lineare Interpolation — also stur die direkte Verbindung — fühlt sich mechanisch an. Für eine kunstorientierte Anwendung brauchen wir geschwungene Verläufe.

Zwei Standardansätze:

**Hermite‑Kurven.** Definiert durch zwei Endpunkte und die Tangenten (also die Steigung) an genau diesen Endpunkten. Die Kurve folgt der Steigung beim Start und beim Ende; dazwischen verläuft sie glatt. Vorteil: wenn zwei Hermite‑Segmente am selben Punkt verbunden werden und ihre Tangenten übereinstimmen, gibt es keinen Knick. Wir nutzen Hermite für die Kamera‑Keyframes, weil die Kameras dann weiche Schwenks ohne Ruckler ergeben.

**Bezier‑Kurven.** Definiert durch zwei Endpunkte und zwei Kontrollpunkte, die *neben* der Kurve liegen. Die Kontrollpunkte ziehen die Kurve in ihre Richtung, ohne dass die Kurve sie tatsächlich erreicht. Bezier‑Kurven sind die übliche Form in Vektorgrafik (SVG, Illustrator, Figma‑Pen‑Tool) und in den Beschleunigungs‑/Verzögerungskurven von Animationsprogrammen wie After Effects — dort hast du in der Easing‑Editor‑Ansicht kleine „Anfasser" an jedem Keyframe; das sind genau die Bezier‑Kontrollpunkte.

Praktischer Unterschied: Hermite ist intuitiver, wenn man Tangenten meint („wie schnell soll's am Anfang/Ende gehen?"), Bezier ist intuitiver, wenn man die Form der Kurve visuell ziehen will. Mathematisch sind beide äquivalent — eine Hermite‑Kurve lässt sich in eine Bezier umrechnen und umgekehrt.

Im Repo steckt die Kurvenlogik in `easing.ts` plus den Keyframe‑Hooks. Details zu der Wahl Hermite stehen in `ARCHITECTURE.md` Abschnitt 1.6.

## 17. Wie du das Programm in Codespaces startest

Drei Befehle reichen, und nur der erste lädt etwas auf den Codespace.

**`npm install`** — einmal nach dem ersten Codespace‑Start. Lädt alle externen Bibliotheken (React, Three.js, shadcn‑Abhängigkeiten, Vite, TypeScript, etc.), die in `package.json` aufgelistet sind, in den Ordner `node_modules/`. Dauert beim ersten Mal ein paar Minuten und braucht ~1 GB Speicher. `npm` (Node Package Manager) ist das Verwaltungswerkzeug dafür.

**`npm run dev`** — startet den *Dev‑Server*. Der Dev‑Server ist ein Prozess, der den Code im Speicher kompiliert und sofort im Browser ausliefert. Das Werkzeug dahinter heißt **Vite**: es übersetzt TypeScript live in JavaScript, sobald der Browser eine Datei anfragt, und schickt die Übersetzung zurück. Eine echte Build‑Phase auf der Festplatte gibt es nicht. Nebeneffekt: jede Codeänderung erscheint innerhalb von Millisekunden in der Browser‑Vorschau, weil Vite nur das eine geänderte Modul neu ausliefert. Diese Live‑Aktualisierung heißt **HMR — Hot Module Replacement**. Verhält sich wie die Live‑Vorschau in Programmen mit Echtzeit‑Render: sobald du etwas änderst, aktualisiert sich das Vorschaufenster.

Im Codespace: sobald der Dev‑Server läuft, erscheint im VSCode‑Ports‑Tab ein Eintrag für Port 5173 mit einer öffentlich zugänglichen URL. Klick → öffnet im neuen Browser‑Tab → die App läuft.

**`npm run build`** — für den echten Auslieferungs‑Build. Vite kompiliert alles ein einziges Mal, optimiert (minimiert, bündelt, hasht die Dateinamen), und legt das Ergebnis im Ordner `dist/` ab. Dieser Ordner ist der Inhalt, der später auf GitHub Pages veröffentlicht wird.

Variante: **`npm run dev:fixed`** ist ein Wrapper‑Skript (`scripts/dev-fixed.sh`), das `npm run dev` immer auf Port 5173 festnagelt und abbricht, falls dieser Port schon belegt ist. Sinnvoll, wenn du sicher gehen willst, dass nur eine Dev‑Server‑Instanz läuft.

---

# Teil E — Wie die App veröffentlicht wird

## 18. Wie das Deployment heute läuft

Die Veröffentlichung ist bereits eingerichtet. Du musst nichts dafür tun außer verstehen, was passiert.

Im Repo gibt es eine Datei `.github/workflows/deploy.yml`. Das ist eine **GitHub Actions**‑Workflow‑Definition: ein YAML‑Dokument, das beschreibt, welche Schritte unter welchen Bedingungen ablaufen sollen. GitHub Actions ist ein Automatisierungs‑Dienst, der mit jedem Repo ausgeliefert wird — er stellt Server bereit, die auf Knopfdruck oder Ereignis Skripte ausführen.

Konkret bei uns: sobald ein Commit auf den Branch `main` gepusht wird (also nach jedem Merge eines PR), startet GitHub einen Server, der vier Schritte ausführt:

1. Das Repo auschecken (`actions/checkout`).
2. Node.js und pnpm einrichten.
3. `pnpm install` und `pnpm run build` ausführen — das erzeugt den optimierten `dist/`‑Ordner.
4. Den `dist/`‑Inhalt als „Pages Artifact" hochladen und auf **GitHub Pages** veröffentlichen.

**GitHub Pages** ist ein kostenloses Hosting für statische Dateien (HTML, CSS, JavaScript, Bilder), eingebaut in jedes GitHub‑Repo. Da unsere App eine SPA (Single‑Page Application) ist und keine Server‑Logik braucht, passt das perfekt. Der Inhalt landet unter der Repo‑URL — in unserem Fall mit dem Pfad‑Präfix `/wortnetzui/`, weil GitHub Pages das Repo unter einem Unterordner serviert. Genau deshalb steht in `vite.config.ts` die Zeile `base: '/wortnetzui/'`: Vite wird damit angewiesen, alle Asset‑URLs im fertigen Build mit diesem Präfix zu beginnen, sonst würden die JavaScript‑ und CSS‑Dateien beim Laden ins Leere zeigen.

Was du daraus mitnimmst:

- „PR mergen" und „Veröffentlichung im Netz" sind effektiv dieselbe Handlung — der Merge nach `main` löst die Veröffentlichung aus.
- Wenn die Action fehlschlägt (rotes Kreuz neben dem Commit auf GitHub), ist *nicht* die Veröffentlichung kaputtgegangen, sondern der Build. Der vorherige veröffentlichte Stand bleibt online, bis ein erfolgreicher Build ihn ersetzt.
- Die Action ist über `Actions` im Repo‑Reiter live einsehbar. Jeder Lauf hat ein Protokoll mit jedem Schritt — sehr nützlich beim Diagnostizieren.

## 19. Optional: aus der Web‑App eine Desktop‑App machen

Stand heute läuft Wortnetze ausschließlich im Browser. Das hat Grenzen — Datei‑Export geht nur per Download‑Dialog, kein eigenes Programm‑Icon im Dock, keine Offline‑Nutzung nach dem ersten Laden. Wenn wir das Tool einmal in Ausstellungs‑ oder Workshop‑Kontexten verteilen wollen, bietet sich an, die Web‑App in einen Desktop‑Wrapper zu stecken. Zwei Optionen:

**Electron** ist der ältere, etablierte Ansatz. Ein Electron‑Programm bündelt eine vollständige Chrome‑Engine plus Node.js mit jeder App. Das ist, was VSCode selbst nutzt, was Slack, Discord und viele andere große Apps verwenden. Vorteil: riesiges Ökosystem, Code in JavaScript, einfache Einarbeitung. Nachteil: die Apps sind groß (>100 MB für ein „Hello World") und brauchen viel RAM, weil jede App ihre eigene Chrome‑Kopie mitbringt.

**Tauri** ist die neuere, schlankere Alternative. Statt eine eigene Browser‑Engine mitzuliefern, nutzt Tauri die WebView, die im Betriebssystem ohnehin schon vorhanden ist (WebView2 auf Windows, WKWebView auf macOS, WebKitGTK auf Linux). Die App bleibt dadurch klein (~12 MB), startet schnell und verbraucht etwa ein Zehntel des RAM von Electron. Das Backend (also der native Teil, der mit dem Betriebssystem spricht) ist in Rust geschrieben — eine systemnahe Sprache, die AI‑Agenten ebenfalls schreiben können.

Empfehlung für Wortnetze: Tauri, falls wir je verpacken wollen. Three.js braucht Grafikleistung; jeder gesparte RAM zählt. Konkrete Schritte wären (zur Orientierung, nicht zum Abtippen): `npm install @tauri-apps/cli@2`, dann `npx tauri init` (das fragt nach Dev‑URL — bei uns `http://localhost:5173` — und Build‑Command — `npm run build`), anschließend liegen Rust‑Dateien unter `src-tauri/`, und `npm run tauri build` erzeugt Installer für das aktuelle Betriebssystem.

Größenordnung des Aufwands: ein Tag Setup, ein paar weitere für Datei‑Dialoge, Icons und Installer‑Konfiguration. Kein riesiges Projekt, aber kein Tagesgeschäft. Eher: „wenn das Tool reif ist und wir es verteilen wollen."

---

# Teil F — Nachschlagen

## 20. Wo welche Information im Repo wohnt

| Datei / Ordner | Inhalt |
|---|---|
| `AGENTS.md` | Die unveränderlichen Regeln für AI‑Agenten — Quelle der Wahrheit. |
| `PROJECT.md` | Karte: welche Datei welche Rolle hat. |
| `ARCHITECTURE.md` | Render‑Pipeline, State, Physik, Kamera — das technische Innenleben. |
| `STYLE_GUIDE.md` | Farben, Spacing, Slider‑Verhalten, Typografie. |
| `ROADMAP.md` | Was geplant ist (aktuell Platzhalter, wird im laufenden Refactor ausgeschrieben). |
| `ATTRIBUTIONS.md` | Lizenzhinweise der eingesetzten Bibliotheken. |
| `CLAUDE.md` / `GEMINI.md` | Dünne Weiterleitungen zu `AGENTS.md` — vom jeweiligen AI‑Werkzeug automatisch geladen. |
| `package.json` | Liste aller Abhängigkeiten und der ausführbaren Skripte (`npm run dev` etc.). |
| `vite.config.ts` | Konfiguration des Dev‑Servers und Builds — inklusive `base: '/wortnetzui/'` für Pages. |
| `src/app/App.tsx` | Layout‑Komponist — soll möglichst schlank bleiben. |
| `src/app/context/WortnetzContext.tsx` | Globaler Zustand, einzige Quelle der Wahrheit für die UI. |
| `src/app/components/Sidebar.tsx` | Die rechte Sidebar mit den fünf Tabs. |
| `src/app/components/sidebar/SidebarAtoms.tsx` | Die atomaren Bausteine der Sidebar. |
| `src/app/components/sidebar/tabs/` | Die einzelnen Tab‑Implementationen (Visual, Physics, Camera, …). |
| `src/app/components/Network3D.tsx` | Three.js‑Szene, Renderer, RAF‑Loop. |
| `src/app/graph/physics.worker.ts` | Physik‑Berechnung im Hintergrund‑Thread. |
| `src/app/graph/parsing.ts` | N‑Gramm‑Extraktion aus dem Eingabetext. |
| `src/app/components/timeline/` | Timeline, Tracks, Keyframe‑Editor. |
| `.github/workflows/deploy.yml` | Der Automatismus für Pages‑Veröffentlichung. |

## 21. Glossar

- **Artifact** — Ergebnis, das ein AI‑Agent oder ein Build‑Schritt nach getaner Arbeit hinterlässt (Plan, Screenshot, fertige Datei).
- **Atom** — kleinster wiederverwendbarer UI‑Baustein in unserem System.
- **Branch** — parallele Variante des Repos, in der frei experimentiert werden kann.
- **Build** — der Schritt, der den Quellcode in eine ausgelieferte, optimierte Form übersetzt.
- **Bezier** — Kurve, definiert durch Endpunkte und externe Kontrollpunkte.
- **Codespace** — virtueller Computer von GitHub mit vorinstalliertem Editor und Repo.
- **Commit** — versiegelter Schnappschuss der aktuellen Dateien plus Nachricht.
- **Component (React)** — ein UI‑Baustein als Funktion, die HTML zurückgibt.
- **Dev Server** — der Prozess, der den Code live für den Browser bereitstellt.
- **Electron** — Desktop‑App‑Framework, bündelt Chrome und Node mit der App.
- **GitHub Actions** — Automatisierungsdienst, der Skripte auf GitHub‑Servern ausführt.
- **GitHub Pages** — kostenloses Hosting statischer Dateien direkt aus einem Repo.
- **Hermite** — Kurve, definiert durch Endpunkte und ihre Tangenten.
- **HMR (Hot Module Replacement)** — Live‑Austausch geänderter Code‑Module ohne Neuladen der Seite.
- **IDE** — Integrated Development Environment, also ein Editor mit Werkzeugen drum herum.
- **Keyframe** — explizit gesetzter Wert zu einem Zeitpunkt in einer Animation.
- **Merge** — Zusammenführen zweier Branches.
- **npm** — Paket‑Manager für JavaScript/TypeScript‑Bibliotheken.
- **Port** — eine Nummer, an der ein laufender Server erreichbar ist (bei uns 5173 für Dev).
- **Pull** — neue Schnappschüsse vom Server holen.
- **Pull Request (PR)** — formaler Vorschlag, einen Branch in `main` zu mergen, inklusive Review.
- **Push** — Schnappschüsse zum Server schicken.
- **React** — Bibliothek für Komponenten‑basierte Oberflächen.
- **Repo (Repository)** — der versionierte Container für ein Projekt.
- **Rust** — systemnahe Programmiersprache, im Tauri‑Backend verwendet.
- **shadcn/ui** — Sammlung kopierbarer React‑Komponenten, gebaut auf Radix UI und Tailwind.
- **SPA (Single‑Page Application)** — Webanwendung, bei der nur eine HTML‑Seite geladen und alles Weitere per JavaScript verändert wird.
- **Sprite** — flaches 2D‑Bild, das in einer 3D‑Szene zur Kamera ausgerichtet bleibt.
- **Staging** — Vorbereitungsbereich für den nächsten Commit; man wählt aus, was rein soll.
- **Tailwind CSS** — Stil‑Bibliothek, bei der Stile als Utility‑Klassen direkt am Element notiert werden.
- **Tauri** — schlankes Desktop‑App‑Framework auf Basis der OS‑WebView und Rust.
- **Three.js** — JavaScript‑Bibliothek für 3D‑Grafik im Browser.
- **TypeScript** — JavaScript mit Typprüfung.
- **Vite** — moderner Dev‑Server und Bundler, ersetzt das, was früher Webpack tat.
- **Web Worker** — Hintergrund‑Thread im Browser, läuft parallel zum Hauptthread.
- **YAML** — schlankes Konfigurationsformat, in dem GitHub‑Actions‑Workflows geschrieben sind.

## 22. Erste Mitmach‑Aufgaben

Vorschläge, an denen sich der erste Branch + erste PR ausprobieren lassen. Alle sind klein genug, dass sie eine Sitzung mit AI‑Unterstützung nicht sprengen.

1. **Eine Sidebar‑Beschriftung anpassen.** Suche im Repo nach einem deutschen Label, das dir umständlich vorkommt (`grep -ri "Streuung" src/`), schlage eine bessere Formulierung vor, mach den Branch, ändere die Stelle, push, PR. Lerneffekt: ganzer Workflow am Mini‑Beispiel.
2. **Eine Farbpalette hinzufügen.** In `src/app/components/Sidebar.tsx` gibt es eine Liste der Gradient‑Presets (Indigo → Violett etc.). Füge eine eigene Kombination hinzu — ein Name auf Deutsch, zwei Hex‑Werte. PR mit Screenshot.
3. **Einen neuen Tooltip schreiben.** Suche eine UI‑Komponente, die keinen Tooltip hat, aber einen vertragen könnte (eine Toolbar‑Schaltfläche, ein Sidebar‑Slider). Füge ihn hinzu. Lerneffekt: minimale Code‑Änderung, sichtbare Wirkung.
4. **Ein Architektur‑Detail in `ARCHITECTURE.md` ergänzen.** Wenn dir beim Lesen etwas auffällt, das nicht klar ist, schreib einen Absatz dazu — als PR mit Markdown‑Änderung, keine Code‑Änderung. Lerneffekt: PRs müssen nicht Code sein.

Faustregel für alle vier: erst den Plan‑Modus eines AI‑Agenten anfordern („mach einen Plan, schreibe noch keinen Code"), den Plan ansehen, dann ausführen lassen. So lernst du, wie die Werkzeuge dich anweisen.
