# Planung: Carthago C2-tourer 3D-Stauraum-Manager

> Stand: MVP ist gebaut und deployed. Änderungen gegenüber der ersten Planung sind unten dokumentiert.

## 1. Projekt-Ziel

Eine interaktive Web-App, mit der der Stauraum eines **Carthago C2-tourer I 148 RB-QB „L“ comfort 4.2 t** verwaltet werden kann.

**Kern-Interaktionen:**
- Links eine verschachtelte, dateisystem-ähnliche Liste aller Fächer.
- Klick auf ein Fach öffnet unten eine Detailleiste (Bottom Sheet) mit dem Inhalt.
- Im Dialog „Inhalt hinzufügen“ gibt es vorgefertigte Standard-Gegenstände mit Symbolen **oder** eine Freitext-Eingabe.
- Menge wird über Plus-/Minus-Buttons eingestellt.
- In der linken Liste gibt es pro Gegenstand einen Kreis/Checkbox zum Abhaken und rechts einen Counter mit Plus/Minus.

## 2. Entscheidungen nach der Planungsphase

| Thema | Entscheidung |
|---|---|
| 3D-Modell-Genauigkeit | Einfach/stilisiert – Boxen, klare Übersicht, keine Fotorealistik |
| Referenzfotos | Verwendung von offiziellen Carthago-Web-Bildern, keine eigenen Fotos nötig |
| Packlisten | **Nicht** umgesetzt |
| Gewicht | Umgesetzt: Gewicht pro Gegenstand, Summe pro Fach & Gesamtsumme |
| Hosting | GitHub Pages, direkt eingerichtet |
| Akzentfarbe | **Terracotta** `#E07A5F` |
| Dark Mode | Unterstützt |

## 3. Recherche: Dein Wohnmobil

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
| Kühlschrank | 153 l (29 l Gefrierfach) |
| Frischwasser / Abwasser | 150 l / 140 l |
| Heizung | Truma Combi 6 |

**Quellen:**
- [Carthago Modellseite](https://www.carthago.com/wohnmobile/c2-tourer-i-148-rb-qb-l-comfort-4-2t/)
- [Carthago C2-tourer Übersicht](https://www.carthago.com/wohnmobile/vollintegrierte-wohnmobile/c2-tourer-i/)
- [Preisliste / Grundrisse (PDF)](./docs/references/carthago-c2-tourer-preisliste-2026.pdf)
- [Außenansicht (PNG)](./docs/references/c2-tourer-148-rb-qb-l-exterior.png)
- [Referenzbilder Innenraum & Stauraum](./docs/references/)

## 4. Fächer-Struktur (umgesetzt)

```
Wohnmobil
├── Heckgarage
│   ├── Heckgarage links
│   └── Heckgarage rechts
├── Doppelboden-Keller
│   ├── Keller vorne
│   ├── Keller Mitte
│   └── Keller hinten
├── L-Wohnsitzgruppe
│   ├── Sitzbank links
│   └── Seitensitzbank
├── Küche
│   ├── Oberschränke
│   ├── Unterschränke / Auszüge
│   └── Kühlschrank
├── Bad
│   ├── Waschbecken-Unterschrank
│   └── Bad-Stauschrank
└── Schlafbereich
    ├── Kleiderschrank links
    ├── Kleiderschrank rechts
    ├── Bett-Auszug
    └── Hubbett / Stauraum
```

## 5. Tech-Stack

| Bereich | Wahl |
|---|---|
| Framework | React + TypeScript |
| Build-Tool | Vite |
| 3D-Engine | Three.js + React Three Fiber |
| 3D-Modellierung | Blender (gesteuert via Python-Skript) |
| 3D-Format | glTF / .glb |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| State | Zustand + LocalStorage persistence |
| Hosting | GitHub Pages |

## 6. UI/UX

- **Layout:** Sidebar links (Fächerbaum), Hauptbereich Mitte (3D), Bottom Sheet unten.
- **Farben:** Heller Sand-Grau-Hintergrund, weiße Panels, Terracotta als Akzent.
- **Dark Mode:** `dark`-Klasse auf `<html>`, automatisch aus LocalStorage wiederhergestellt.
- **Auswahl-Highlight:** Fach im Baum bekommt Terracotta-Hintergrund, 3D-Objekt wird halb-transparent emissive markiert.

## 7. 3D-Modell: Blender-Workflow

1. **Skript:** `scripts/create_model.py` erzeugt das Modell vollständig per Python.
2. **Einheit:** Meter.
3. **Modell:** Vereinfachte Außenhülle, Innenraum-Boden/Wände, Möbel als Boxen.
4. **Fächer:** Separate Meshes mit `comp_`-Prefix, z. B. `comp_garage_left`.
5. **Export:** `bpy.ops.export_scene.gltf(...)` nach `web/public/models/c2-tourer.glb`.
6. **Web:** `useGLTF` lädt das Modell, Raycasting filtert nach `comp_*`-Namen.

```bash
# Modell neu generieren
/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/create_model.py
```

## 8. Datenmodell

```typescript
interface Compartment {
  id: string
  name: string
  parentId?: string
  meshName: string
  icon: string
}

interface InventoryItem {
  id: string
  compartmentId: string
  name: string
  icon: string
  quantity: number
  checked: boolean
  weightKg?: number
}
```

## 9. Features (MVP)

- [x] 3D-Modell des Wohnmobils im Browser laden
- [x] Fächerbaum links mit Expand/Collapse
- [x] Fach-Auswahl per Klick (Baum + 3D-Modell)
- [x] Bottom Sheet zeigt Inhalte des Fachs
- [x] „Inhalt hinzufügen“-Dialog mit Standard-Items + Freitext
- [x] Plus-/Minus-Buttons für Menge
- [x] Checkbox + Counter in der Listenansicht
- [x] Lokale Speicherung im Browser
- [x] Gewichtssumme pro Fach und Gesamtgewicht
- [x] Dark Mode
- [x] GitHub Pages Deployment

## 10. Live-URL

https://danielfaludi123-bit.github.io/carthago-c2-tourer-inventory/
