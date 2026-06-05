# Heldenarchiv

Eine Heldenverwaltung für **Das Schwarze Auge 4.1** (DSA 4.1): Heldenbögen,
Heldengruppen, Abenteuer mit Alltag-/Reise-/Kampf-Tabellen, Kampfplatz- und
Reisekarte-Raster sowie ein **Steigern-Modus** mit den AP-Kosten der Regeln
(Eigenschaften, Talente, Kampftalente, Zauber, Liturgien, Vor-/Nachteile,
Sonderfertigkeiten).

Gebaut mit React + Vite. Daten werden im **localStorage** des Browsers
gespeichert.

---

## Schnellstart (lokale Entwicklung)

Voraussetzung: [Node.js](https://nodejs.org/) (LTS-Version).

```bash
npm install      # Abhängigkeiten installieren (einmalig)
npm run dev      # Entwicklungsserver starten
```

Danach die angezeigte Adresse öffnen (Standard: `http://localhost:5173/heldenarchiv/`).

> Hinweis: Wegen der `base`-Einstellung für GitHub Pages (siehe unten) liegt die
> lokale Adresse unter `/heldenarchiv/`, nicht direkt unter `/`.

---

## Produktiv-Build

```bash
npm run build    # erzeugt den Ordner dist/ mit statischen Dateien
npm run preview  # den Build lokal testen
```

Der Inhalt von `dist/` ist eine rein statische Website und kann bei jedem
Static-Hosting (GitHub Pages, Netlify, Vercel, …) abgelegt werden.

---

## Wo werden die Daten gespeichert?

**Im localStorage des jeweiligen Browsers.** Das hat wichtige Konsequenzen:

- Die Daten liegen **nur auf diesem einen Gerät in diesem einen Browser**.
- Es gibt **keine Synchronisation** zwischen Personen oder Geräten. Jede Person,
  die die App öffnet, hat ihre eigenen, privaten Daten.
- Das ursprüngliche Modell „Meister sieht die Helden aller Spieler" funktioniert
  in dieser Version **nicht** geräteübergreifend.
- Leeren der Browserdaten/Website-Daten löscht auch die Helden.

Die gesamte Speicher-Logik steckt in einer einzigen Datei: [`src/storage.js`](src/storage.js).
Sie stellt dasselbe `window.storage`-Interface bereit, das die App erwartet,
aber auf Basis von localStorage. **Der Rest der App bleibt unverändert.**

### Später echte Mehrbenutzer-Speicherung (z. B. Supabase)

Um echte, geteilte Persistenz über mehrere Personen/Geräte zu bekommen, muss
nur `src/storage.js` gegen eine Backend-Anbindung (z. B. Supabase oder Firebase)
ausgetauscht werden — die Komponenten und die Spiellogik bleiben gleich, weil
alle Speicherzugriffe durch dieses eine Modul laufen. Hinweis: Das aktuelle
Login ist ein Klartext-Passwort-System auf Vertrauensbasis und sollte vor einem
echten Backend durch eine ordentliche Authentifizierung ersetzt werden.

---

## Deployment auf GitHub Pages

Dieses Repository enthält bereits einen GitHub-Actions-Workflow
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)), der bei jedem
Push auf `main` automatisch baut und veröffentlicht.

**Einmalige Einrichtung:**

1. **`base` anpassen.** In [`vite.config.js`](vite.config.js) den Wert von
   `base` auf den **exakten Namen deines Repositories** setzen, mit Schrägstrichen
   davor und danach:

   ```js
   base: '/DEIN-REPO-NAME/',
   ```

   (Bei eigener Domain oder einem `username.github.io`-Repo stattdessen `'/'`.)

2. Repository auf GitHub anlegen und den Code pushen (siehe unten).

3. Auf GitHub: **Settings → Pages → Build and deployment → Source → „GitHub Actions"** wählen.

4. Auf `main` pushen. Der Workflow läuft, und nach Abschluss ist die Seite unter
   `https://DEIN-NUTZERNAME.github.io/DEIN-REPO-NAME/` erreichbar.

> Das Repository muss **öffentlich** sein, wenn du einen kostenlosen
> GitHub-Account nutzt, sonst ist GitHub Pages nicht verfügbar.

---

## Erstes Pushen zu GitHub

```bash
git init
git add .
git commit -m "Initial commit: Heldenarchiv"
# Leeres Repo auf github.com anlegen, dann:
git remote add origin https://github.com/DEIN-NUTZERNAME/DEIN-REPO-NAME.git
git branch -M main
git push -u origin main
```

---

## Projektstruktur

```
heldenarchiv/
├─ index.html               # HTML-Einstiegspunkt
├─ package.json             # Abhängigkeiten + Skripte
├─ vite.config.js           # Vite-Konfiguration (inkl. base für Pages)
├─ .github/workflows/
│   └─ deploy.yml           # Auto-Deploy zu GitHub Pages
└─ src/
    ├─ main.jsx             # bindet den Speicher-Shim ein und startet die App
    ├─ HeldenArchiv.jsx     # die gesamte Anwendung (eine große Komponente)
    ├─ storage.js           # localStorage-Speicher (ersetzt window.storage)
    └─ index.css            # Tailwind-Import
```

---

## Lizenz / Nutzung

Privates Werkzeug für eine Spielgruppe. *Das Schwarze Auge* und DSA sind
geschützte Marken ihrer jeweiligen Rechteinhaber; dieses Projekt ist ein
inoffizielles Fan-Hilfsmittel ohne offizielle Verbindung.
