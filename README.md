# Carthago C2-tourer 3D-Stauraum-Manager 🚐

Interaktiver Stauraum-Manager für den **Carthago C2-tourer I 148 RB-QB „L“ comfort 4.2 t**.

Links eine dateisystem-ähnliche Liste aller Fächer, in der Mitte ein interaktives 3D-Modell des Wohnmobils. Ein Klick auf ein Fach öffnet unten eine Leiste mit dem aktuellen Inhalt. Gegenstände lassen sich per Dialog hinzufügen – entweder aus einer Auswahl vorgefertigter Standard-Items mit Symbolen oder als Freitext. Jedem Gegenstand kann optional ein Gewicht in kg zugewiesen werden.

> 🎨 Akzentfarbe: **Terracotta** · 🌙 Dark Mode: unterstützt · ⚖️ Gewichts-Summe: pro Fach & gesamt

## Live-Demo

- **Website:** https://danielfaludi123-bit.github.io/carthago-c2-tourer-inventory/
- **Repository:** https://github.com/danielfaludi123-bit/carthago-c2-tourer-inventory
- **Planung:** [`PLANUNG.md`](./PLANUNG.md)

## Lokale Entwicklung

```bash
cd web
npm install
npm run dev
```

## Build

```bash
cd web
npm run build
```

## 3D-Modell aktualisieren

Das Modell wird mit Blender aus dem Python-Skript `scripts/create_model.py` generiert:

```bash
/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/create_model.py
```

## Tech-Stack

- React + TypeScript + Vite
- Three.js / React Three Fiber für das 3D-Modell
- Blender für Modellierung und Export als `.glb`
- Tailwind CSS für das UI
- LocalStorage für lokale Daten
- GitHub Pages für Hosting
