# Planung: Carthago C2-tourer 3D-Stauraum-Manager

> Stand: Planungsphase. Noch keine Website gebaut.

## 1. Projekt-Ziel

Eine interaktive Web-App, mit der der Stauraum eines **Carthago C2-tourer I 148 RB-QB „L“ comfort 4.2 t** verwaltet werden kann.

**Kern-Interaktionen:**
- Links eine verschachtelte, dateisystem-ähnliche Liste aller Fächer.
- Klick auf ein Fach öffnet unten eine Detailleiste (Bottom Sheet) mit dem Inhalt.
- Im Dialog „Inhalt hinzufügen“ gibt es vorgefertigte Standard-Gegenstände mit Symbolen **oder** eine Freitext-Eingabe.
- Menge wird über Plus-/Minus-Buttons eingestellt.
- In der linken Liste gibt es pro Gegenstand einen Kreis/Checkbox zum Abhaken und rechts einen Counter mit Plus/Minus.

## 2. Recherche: Dein Wohnmobil

| Merkmal | Wert |
|---|---|
| Modell | Carthago C2-tourer I 148 RB-QB „L“ comfort 4.2 t |
| Aufbau | Integriert (A-Klasse) |
| Basisfahrzeug | Fiat Ducato |
| Länge / Breite / Höhe | 7.360 mm / 2.170 mm / 2.950 mm |
| Radstand | 4.035 mm |
| Doppelboden-Höhe / Kellerstauraum | 220 mm / 460 mm |
| Stehhöhe im Wohnraum | 1.980 mm |
| Heckgarage Innenhöhe | 1.120 mm (1.240 mm mit Pedelec-Garage) |
| Heckgaragentüren | je 1.050 × 1.100 mm (Fahrer- & Beifahrerseite) |
| Queensbett | 1.900 × 1.450 mm |
| Hubbett über Fahrerhaus | 1.900 × 1.500 mm |
| Sitzgruppe als Bett | 1.940 × 985 / 550 mm |
| Kühlschrank | 153 l (29 l Gefrierfach) |
| Frischwasser / Abwasser | 150 l / 140 l |
| Heizung | Truma Combi 6 |
| Techn. zul. Gesamtmasse | 4.250 kg (optional 4.500 kg) |
| Masse fahrbereit | ca. 3.073 kg |

**Quellen:**
- [Carthago Modellseite](https://www.carthago.com/wohnmobile/c2-tourer-i-148-rb-qb-l-comfort-4-2t/)
- [Carthago C2-tourer Übersicht](https://www.carthago.com/wohnmobile/vollintegrierte-wohnmobile/c2-tourer-i/)
- [Preisliste / Grundrisse (PDF)](./docs/references/carthago-c2-tourer-preisliste-2026.pdf)
- [Außenansicht (PNG)](./docs/references/c2-tourer-148-rb-qb-l-exterior.png)

## 3. Vorgeschlagene Fächer-Struktur

Basierend auf dem Grundriss (L-Wohnsitzgruppe, Komfort-Winkelküche, Raumbad, Queensbett, Doppelboden-Keller, Heckgarage):

```
Wohnmobil
├── Heckgarage
│   ├── Garage links
│   ├── Garage rechts
│   └── Durchladeraum (zentral)
├── Doppelboden-Keller
│   ├── Keller vorne (Fahrerhaus)
│   ├── Keller Mitte (Wohnraum)
│   └── Keller hinten (Bett/Garage)
├── Eingang / Garderobe
│   └── Schuhschrank / Ausziehfach
├── L-Wohnsitzgruppe
│   ├── Sitzbank links (Stauraum)
│   ├── Seitensitzbank
│   └── Tischfach / Ablagen
├── Küche
│   ├── Kühlschrank
│   ├── Küchenschränke oben
│   ├── Küchenschränke unten (6 Auszüge)
│   └── Abfallbehälter / Hygienebereich
├── Bad / Umkleide
│   ├── Waschbecken-Unterschrank
│   ├── Dusche-Ablage
│   └── Stauschrank Bad
└── Schlafbereich
    ├── Kleiderschrank links vom Bett
    ├── Kleiderschrank rechts vom Bett
    ├── Bett-Auszug / Frontfach
    └── Hubbett über Fahrerhaus
```

> ⚠️ Diese Struktur ist ein erster Vorschlag. Sie wird präziser, wenn du Fotos oder einen genauen Grundriss lieferst.

## 4. Tech-Stack

| Bereich | Wahl | Begründung |
|---|---|---|
| Framework | **React + TypeScript** | Komponentenbasiert, gute Typ-Sicherheit |
| Build-Tool | **Vite** | Schnell, modern, gut für Three.js |
| 3D-Engine | **Three.js + React Three Fiber** | De-Facto-Standard, declarative Komponenten |
| 3D-Modellierung | **Blender** | Kostenlos, glTF-Export, präzise Maßstäbe |
| 3D-Format | **glTF / .glb** | Effizient, von Three.js nativ unterstützt |
| Styling | **Tailwind CSS** | Schnelles UI, konsistente Abstände |
| Icons | **Lucide React** | Klare, leichte Symbole für Gegenstände |
| State | **Zustand** oder React Context | Für Fächer-/Inhalte-State |
| Speicher | **LocalStorage** | Sofort nutzbar, offline-fähig |
| Hosting | **GitHub Pages** | Kostenlos, direkt aus dem Repo |

## 5. UI/UX-Konzept

### Layout

```
+--------------------------------------------------+
|  Header (Titel + Gesamtgewicht/Zuladung)         |
+-----------+--------------------------------------+
|           |                                      |
| Fächer-   |        3D-Ansicht Wohnmobil          |
| baum      |        (Three.js / R3F)              |
| links     |                                      |
|           |                                      |
+-----------+--------------------------------------+
|  Bottom Sheet: Inhalt des gewählten Fachs        |
+--------------------------------------------------+
```

### Farben

- **Hintergrund:** Sehr helles Grau / fast Weiß (`#F9FAFB`)
- **Karten/Panel:** Weiß (`#FFFFFF`)
- **Text:** Dunkelgrau (`#111827`)
- **Akzentfarbe:** Helles Rot – z. B. `#EF4444` (Tailwind `red-500`)
  - Alternativ ein etwas wärmeres Carthago-Korallenrot (`#F87171`, `red-400`)
  - Ich empfehle **red-500** als Primärfarbe und **red-100** als Hintergrund für ausgewählte Fächer
- **Erfüllt/Abgehakt:** Grün (`#22C55E`) oder Rot invertiert

> Dein Vorschlag „helles Rot“ passt gut – es ist auffällig, aber nicht aggressiv. Wenn du es dezenter magst, würde ich zu einem warmen Terracotta (`#E07A5F`) raten, das besser zu Wohnmobil-Holztönen passt.

### Interaktionen

- **Fach auswählen:** Klick im linken Baum **oder** Klick auf das 3D-Modell.
- **Ausgewähltes Fach:** Roter Rand / roter Hintergrund im Baum, 3D-Objekt leicht hervorgehoben.
- **Bottom Sheet:** Schiebt sich von unten hoch, zeigt Titel, Icon-Liste und „Hinzufügen“-Button.
- **Hinzufügen-Dialog:** Tabs „Vorschläge“ / „Eigener Gegenstand“.
- **Liste links:**
  - Links: Kreis-Checkbox (abgehakt = durchgestrichen)
  - Mitte: Name + Icon
  - Rechts: Minus | Anzahl | Plus

## 6. 3D-Modell: Blender-Workflow

### Schritt-für-Schritt

1. **Referenzen sammeln**
   - Grundriss (PDF bereits im Repo)
   - Außenansicht (PNG bereits im Repo)
   - Fotos vom echten Fahrzeug, besonders Innenraum und Garage (noch offen)

2. **Blender-Setup**
   - Einheit: **Meter** (1 Blender-Einheit = 1 m)
   - Maßstäbe aus der Recherche übernehmen (7,36 m Länge, 2,17 m Breite, 2,95 m Höhe)
   - Hintergrund-Referenzbilder als Planes einblenden

3. **Grobes Modell (Block-out)**
   - Außenhülle als Box
   - Innenraum: Boden, Wände, Decke mit Fenstern
   - Möbel als einfache Boxen (später Details)

4. **Fächer als separate Objekte**
   - Jedes Fach bekommt ein eigenes Mesh (z. B. `comp_garage_left`, `comp_wardrobe_bed_left`).
   - Diese Meshes können zunächst als farbige Boxen / transparente Hüllen dargestellt werden.
   - Material: halb-transparent, wenn nicht ausgewählt; leuchtend rot, wenn ausgewählt.

5. **Details**
   - Räder, Fahrerhaus, Fenster, Türen, Kühlschrank, Bett, Sitze
   - Keine übermäßigen Details – Ziel ist Übersicht, nicht Fotorealismus

6. **Beleuchtung**
   - Hell und klar: Haupt-Sonne + Ambient Light + Innenraum-Punklichter
   - **Nicht zu dunkel**, wie du es wünschst

7. **Export**
   - `File → Export → glTF 2.0 (.glb/.gltf)`
   - Einstellungen: Include „Selected Objects“ aus, Materials „Export“ an
   - Im Repo unter `public/models/c2-tourer.glb` ablegen

8. **Web-Integration**
   - `<Canvas>` mit `<OrbitControls>` und `<ambientLight>`
   - `<primitive object={scene} />`
   - Raycaster auf Mausklick: getroffenes Objekt nach `comp_*`-Name filtern
   - Ausgewähltes Fach: Material ändern oder Outline-Postprocessing

## 7. Datenmodell

```typescript
interface Compartment {
  id: string;          // z. B. "garage-left"
  name: string;        // „Heckgarage links“
  parentId?: string;   // für Baumstruktur
  meshName?: string;   // Name des Objekts im glb
  icon?: string;       // Lucide-Icon-Name
}

interface InventoryItem {
  id: string;
  compartmentId: string;
  name: string;
  icon: string;        // Lucide-Icon-Name
  quantity: number;
  checked: boolean;
  custom: boolean;     // true = selbst eingegeben
  weightKg?: number;   // optional
}

interface AppState {
  compartments: Compartment[];
  items: InventoryItem[];
  selectedCompartmentId: string | null;
}
```

## 8. Standard-Gegenstände mit Symbolen

| Kategorie | Beispiele | Icon |
|---|---|---|
| Camping-Möbel | Stuhl, Tisch, Liege | `Armchair`, `Table`, `Bed` |
| Küche | Teller, Tasse, Besteck, Topf, Pfanne | `Utensils`, `CookingPot` |
| Elektronik | Kabel, Powerbank, Ladegerät, Lampe | `Plug`, `Battery`, `Lightbulb` |
| Kleidung | T-Shirts, Hosen, Jacke, Schuhe | `Shirt`, `Footprints` |
| Bett/Bad | Bettwäsche, Handtücher, Duschzeug | `Bed`, `Bath`, `Droplet` |
| Werkzeug | Werkzeugkasten, Ersatzteile | `Wrench`, `Tool` |
| Outdoor | Grill, Markise, Teppich, Fahrrad | `Flame`, `Tent`, `Bike` |
| Hygiene & Medizin | Erste-Hilfe-Kasten, Zahnbürste | `BriefcaseMedical`, `Pill` |
| Lebensmittel | Konserven, Getränke, Snacks | `Apple`, `CupSoda` |

## 9. Feature-Liste (MVP)

- [ ] 3D-Modell des Wohnmobils im Browser laden
- [ ] Fächerbaum links mit Expand/Collapse
- [ ] Fach-Auswahl per Klick (Baum + 3D-Modell)
- [ ] Bottom Sheet zeigt Inhalte des Fachs
- [ ] „Inhalt hinzufügen“-Dialog mit Standard-Items + Freitext
- [ ] Plus-/Minus-Buttons für Menge
- [ ] Checkbox + Counter in der Listenansicht
- [ ] Lokale Speicherung im Browser
- [ ] Gewichtssumme pro Fach und Gesamtgewicht (optional)

**Spätere Erweiterungen:**
- Mehrere Packlisten (Sommer, Winter, Kurztrip)
- Barcode/QR-Scan für Gegenstände
- Cloud-Sync (z. B. Supabase)
- Achslast-/Zuladungswarnung

## 10. Offene Fragen an dich

Damit ich das 3D-Modell und die Fächer korrekt aufbauen kann, brauche ich noch:

1. **Fotos oder Video** vom Innenraum, besonders:
   - Garage (beide Seiten, Durchladeraum)
   - Doppelboden-Klappen / Keller
   - Küchenschränke (offen)
   - Kleiderschränke neben dem Queensbett
   - Bad-Schränke
   - L-Wohnsitzgruppe mit Stauraum

2. **Genauigkeit des 3D-Modells:**
   - Soll es stilisiert/vereinfacht sein (klare Boxen, Übersicht)
   - Oder möglichst detailgetreu mit allen Schränken und Materialien?

3. **Zusatz-Features:**
   - Soll ich Gewichte erfassen und eine Zuladungs-Übersicht anzeigen?
   - Soll es mehrere Packlisten geben (z. B. „Sommerurlaub“, „Ski-Wochenende“)?
   - Soll die Seite später öffentlich über GitHub Pages erreichbar sein?

4. **Design:**
   - Akzentfarbe „helles Rot“ bestätigt? Oder lieber Terracotta/Orange?
   - Dark Mode gewünscht?

## 11. Nächste Schritte

1. Du gibst Feedback zur Fächer-Struktur und lieferst ggf. Fotos.
2. Ich finalisiere das Datenmodell und die Farben.
3. Ich baue das Grundgerüst der React-App (Vite + Tailwind + R3F).
4. Ich modelliere das erste Blender-Block-out und exportiere es als `.glb`.
5. Iteration: Fächer verfeinern, UI-Interaktionen hinzufügen.
