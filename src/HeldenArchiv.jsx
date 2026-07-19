import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronDown, ChevronRight, Save, Sword, Swords, Sparkles, Scroll, Package, User, Dice5, Sun, Map as MapIcon, Info, Flame, Star, StarOff, Award } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Palette
//   --red   #DB2B39   vermillion, accent, danger
//   --navy  #29335C   structural ink, text, borders
//   --sky   #7EBCE6   cool highlight, hover
//   --olive #A6A57A   muted, secondary
//   --sand  #E6C79C   primary background
// ═══════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap');

    :root {
      --red: #DB2B39;
      --navy: #29335C;
      --sky: #7EBCE6;
      --olive: #A6A57A;
      --sand: #FAF3DD;
      --paper: #F2E8C5;
      --cream: #FFFAE8;
    }

    .font-display { font-family: 'DM Serif Display', serif; letter-spacing: -0.01em; }
    .font-body { font-family: 'Newsreader', serif; }
    .smallcaps { font-family: 'DM Serif Display', serif; text-transform: uppercase; letter-spacing: 0.14em; }

    .surface-sand {
      background-color: var(--sand);
    }
    .card {
      background-color: var(--paper);
      border: 1px solid rgba(41,51,92,0.20);
    }

    /* Decorative masthead banner */
    .banner {
      position: relative;
      margin-bottom: 2rem;
      border: 1px solid rgba(41,51,92,0.25);
    }
    .banner-rule {
      height: 5px;
      background-color: var(--navy);
    }
    .banner-thin {
      height: 2px;
      background-color: var(--red);
    }
    .banner-body {
      background-color: var(--sky);
      padding: 1.5rem 1rem 1.25rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .banner-body::before, .banner-body::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40px;
      height: 1px;
      background-color: var(--navy);
      opacity: 0.35;
    }
    .banner-body::before { left: 1rem; }
    .banner-body::after { right: 1rem; }
    .banner-diamond {
      display: inline-block;
      width: 8px; height: 8px;
      background-color: var(--red);
      transform: rotate(45deg);
      vertical-align: middle;
      margin: 0 0.75rem;
    }
    .banner-sub {
      background-color: var(--cream);
      padding: 0.4rem 1rem;
      text-align: center;
    }

    .ink-input {
      background-color: transparent;
      border: none;
      border-bottom: 1px solid rgba(41,51,92,0.35);
      outline: none;
      color: var(--navy);
      transition: border-color 0.18s, background-color 0.18s;
    }
    .ink-input:focus {
      border-bottom: 2px solid var(--navy);
      background-color: rgba(248,232,196,0.4);
    }
    .ink-input::placeholder { color: var(--olive); font-style: italic; }

    .btn-primary {
      background-color: var(--navy);
      color: var(--cream);
      transition: background-color 0.18s, transform 0.05s;
    }
    .btn-primary:hover { background-color: #1d264a; }
    .btn-primary:active { transform: translateY(1px); }

    .btn-accent {
      background-color: var(--sky);
      color: var(--navy);
      transition: background-color 0.18s;
    }
    .btn-accent:hover { background-color: #6aa9d3; }

    .tab-active {
      background-color: var(--navy);
      color: var(--sand);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1.5rem 0 0.75rem;
    }
    .section-title::before, .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: rgba(41,51,92,0.25);
    }
    .section-title .diamond {
      width: 6px; height: 6px;
      background-color: var(--red);
      transform: rotate(45deg);
      flex-shrink: 0;
    }

    .stat-frame {
      background-color: var(--cream);
      border: 1.5px solid var(--navy);
      border-radius: 2px;
    }
    .stat-accent {
      background-color: var(--cream);
      border: 1.5px solid var(--navy);
      border-radius: 2px;
      position: relative;
    }
    .stat-accent::before {
      content: '';
      position: absolute; top: -1.5px; left: -1.5px; right: -1.5px;
      height: 4px;
      background-color: var(--navy);
    }

    .scroll-shadow {
      box-shadow:
        0 1px 0 0 rgba(41,51,92,0.04),
        0 4px 10px -2px rgba(41,51,92,0.10);
    }

    @keyframes saved-pulse {
      0% { opacity: 0; transform: translateY(-4px); }
      20% { opacity: 1; transform: translateY(0); }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }
    .saved-indicator { animation: saved-pulse 1.8s ease-out; }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    input[type=checkbox] { accent-color: var(--navy); }

    body { color: var(--navy); }
  `}</style>
);

// ───────────────────────────────────────────────────────────────
// DSA 4.1 constants
// ───────────────────────────────────────────────────────────────
const ATTRIBUTES = [
  ['MU', 'Mut'],
  ['KL', 'Klugheit'],
  ['IN', 'Intuition'],
  ['CH', 'Charisma'],
  ['FF', 'Fingerfertigkeit'],
  ['GE', 'Gewandtheit'],
  ['KO', 'Konstitution'],
  ['KK', 'Körperkraft'],
];

const DEFAULT_TALENTS = [
  ['Körperlich', 'Akrobatik', 'MU/GE/KK'],
  ['Körperlich', 'Athletic', 'GE/KO/KK'],
  ['Körperlich', 'Fliegen', 'MU/IN/GE'],
  ['Körperlich', 'Gaukeleien', 'MU/CH/FF'],
  ['Körperlich', 'Klettern', 'MU/GE/KK'],
  ['Körperlich', 'Körperbeherrschung', 'MU/IN/GE'],
  ['Körperlich', 'Reiten', 'CH/GE/KK'],
  ['Körperlich', 'Schleichen', 'MU/IN/GE'],
  ['Körperlich', 'Schwimmen', 'GE/KO/KK'],
  ['Körperlich', 'Selbstbeherrschung', 'MU/KO/KK'],
  ['Körperlich', 'Sich Verstecken', 'MU/IN/GE'],
  ['Körperlich', 'Singen', 'IN/CH/CH'],
  ['Körperlich', 'Sinnesschärfe', 'KL/IN/IN'],
  ['Körperlich', 'Skifahren', 'GE/GE/KO'],
  ['Körperlich', 'Stimmen Imitieren', 'KL/IN/CH'],
  ['Körperlich', 'Tanzen', 'CH/GE/GE'],
  ['Körperlich', 'Taschendiebstahl', 'MU/FF/IN'],
  ['Körperlich', 'Zechen', 'IN/KO/KK'],
  ['Gesellschaft', 'Betören', 'IN/CH/CH'],
  ['Gesellschaft', 'Etikette', 'KL/IN/CH'],
  ['Gesellschaft', 'Galanterie', 'IN/CH/FF'],
  ['Gesellschaft', 'Gassenwissen', 'KL/IN/CH'],
  ['Gesellschaft', 'Lehren', 'KL/IN/CH'],
  ['Gesellschaft', 'Menschenkenntnis', 'KL/IN/CH'],
  ['Gesellschaft', 'Schauspielerei', 'MU/KL/CH'],
  ['Gesellschaft', 'Schriftl. Ausdruck', 'MU/CH/GE'],
  ['Gesellschaft', 'Sich Verkleiden', 'KL/IN/IN'],
  ['Gesellschaft', 'Überreden', 'MU/IN/CH'],
  ['Gesellschaft', 'Überzeugen', 'KL/IN/CH'],
  ['Natur', 'Fährtensuchen', 'KL/IN/KO'],
  ['Natur', 'Fallenstellen', 'KL/FF/KK'],
  ['Natur', 'Fesseln', 'FF/GE/KK'],
  ['Natur', 'Fischen & Angeln', 'IN/FF/KK'],
  ['Natur', 'Orientierung', 'KL/IN/IN'],
  ['Natur', 'Seefischerei', 'IN/FF/KK'],
  ['Natur', 'Wettervorhersage', 'KL/IN/IN'],
  ['Natur', 'Wildnisleben', 'IN/GE/KO'],
  ['Wissen', 'Anatomie', 'MU/KL/FF'],
  ['Wissen', 'Baukunst', 'KL/KL/FF'],  
  ['Wissen', 'Brettspiel', 'KL/KL/IN'],
  ['Wissen', 'Geographie', 'KL/KL/IN'],
  ['Wissen', 'Geschichtswissen', 'KL/KL/IN'],
  ['Wissen', 'Gesteinskunde', 'KL/IN/FF'],
  ['Wissen', 'Götter & Kulte', 'KL/KL/IN'],
  ['Wissen', 'Heraldik', 'KL/KL/FF'],
  ['Wissen', 'Hüttenkunde', 'KL/IN/KO'],
  ['Wissen', 'Kriegskunst', 'MU/KL/CH'],
  ['Wissen', 'Kryptographie', 'KL/KL/IN'],
  ['Wissen', 'Magiekunde', 'KL/KL/IN'],
  ['Wissen', 'Mechanik', 'KL/KL/FF'],
  ['Wissen', 'Pflanzenkunde', 'KL/IN/FF'],
  ['Wissen', 'Philosophie', 'KL/KL/IN'],
  ['Wissen', 'Rechnen', 'KL/KL/IN'],
  ['Wissen', 'Rechtskunde', 'KL/KL/IN'],
  ['Wissen', 'Sagen & Legenden', 'KL/IN/CH'],
  ['Wissen', 'Schätzen', 'KL/KL/IN'],
  ['Wissen', 'Schiffbau', 'KL/KL/FF'],
  ['Wissen', 'Sprachenkunde', 'KL/KL/IN'],
  ['Wissen', 'Staatskunst', 'KL/IN/CH'],
  ['Wissen', 'Sternkunde', 'KL/KL/IN'],
  ['Wissen', 'Tierkunde', 'MU/KL/IN'],
  ['Sprache', 'Lesen/Schreiben [Schrift]', 'KL/KL/FF'],
  ['Sprache', 'Sprachen [Muttersprache]', 'KL/IN/CH'],
  ['Sprache', 'Sprachen [Fremdsprache]', 'KL/IN/CH'],
  ['Handwerk', 'Abrichten', 'MU/IN/CH'],
  ['Handwerk', 'Boote Fahren', 'GE/KO/KK'],
  ['Handwerk', 'Eissegler Fahren', 'IN/GE/KK'],
  ['Handwerk', 'Fahrzeug Lenken', 'IN/CH/FF'],
  ['Handwerk', 'Falschspiel', 'MU/CH/FF'],
  ['Handwerk', 'Feuersteinbearbeitung', 'KL/FF/FF'],
  ['Handwerk', 'Grobschmied', 'FF/KK/KO'],
  ['Handwerk', 'Heilkunde Gift', 'MU/KL/IN'],
  ['Handwerk', 'Heilkunde Krankheiten', 'MU/KL/CH'],
  ['Handwerk', 'Heilkunde Wunden', 'KL/CH/FF'],
  ['Handwerk', 'Holzbearbeitung', 'KL/FF/KK'],
  ['Handwerk', 'Hundeschlitten Fahren', 'CH/FF/GE'],
  ['Handwerk', 'Kartografie', 'KL/KL/FF'],
  ['Handwerk', 'Lederarbeiten', 'KL/FF/FF'],
  ['Handwerk', 'Malen/Zeichen', 'KL/IN/FF'],
  ['Handwerk', 'Musizieren', 'IN/CH/FF'],
  ['Handwerk', 'Schlösser Knacken', 'IN/FF/FF'],
  ['Handwerk', 'Schneidern', 'KL/FF/FF'],
  ['Handwerk', 'Stoffe Färben', 'KL/FF/KK'],
  ['Handwerk', 'Tätowieren', 'IN/FF/FF'],
  ['Handwerk', 'Töpfern', 'KL/FF/FF'],
  ['Handwerk', 'Webkunst', 'FF/FF/KK'],
  ['Kampf', 'Anderthalbhänder', 'NK'],
  ['Kampf', 'Armbrust', 'FK'],
  ['Kampf', 'Belagerungswaffen', 'FK'],
  ['Kampf', 'Blasrohr', 'FK'],
  ['Kampf', 'Bogen', 'FK'],
  ['Kampf', 'Diskus', 'FK'],
  ['Kampf', 'Dolche & Kleinwaffen', 'NK'],
  ['Kampf', 'Fechtwaffen', 'NK'],
  ['Kampf', 'Hiebwaffen', 'NK'],
  ['Kampf', 'Infanteriewaffen', 'NK'],
  ['Kampf', 'Kettenstäbe', 'NK'],
  ['Kampf', 'Kettenwaffen', 'NK'],
  ['Kampf', 'Lanzenreiten', 'NK'],
  ['Kampf', 'Peitschen', 'NK'],
  ['Kampf', 'Raufen', 'NK'],
  ['Kampf', 'Ringen', 'NK'],
  ['Kampf', 'Säbel', 'NK'],
  ['Kampf', 'Schleuder', 'FK'],
  ['Kampf', 'Schwerter', 'NK'],
  ['Kampf', 'Speere', 'FK'],
  ['Kampf', 'Stäbe', 'NK'],
  ['Kampf', 'Wurfbeile', 'FK'],
  ['Kampf', 'Wurfmesser', 'FK'],
  ['Kampf', 'Wurfspeere', 'FK'],
  ['Kampf', 'Zweihandflegel', 'NK'],
  ['Kampf', 'Zweihand-Hiebwaffen', 'NK'],
  ['Kampf', 'Zweihandschwerter', 'NK'],
];

const TALENT_CATEGORIES = ['Körperlich', 'Gesellschaft', 'Natur', 'Wissen', 'Sprache', 'Handwerk', 'Eigene', 'Kampf'];

// Common DSA 4.1 weapon types grouped by combat skill. TP values are typical
// core-rulebook defaults; players can override per-weapon after picking from the list.
const WEAPON_TYPES = [
  // Nahkampf — Anderthalbhänder
  { category: 'Anderthalbhänder', name: 'Anderthalbhänder', type: 'NK', tp: '1W+5' },
  { category: 'Anderthalbhänder', name: 'Bastardschwert', type: 'NK', tp: '1W+5' },
  { category: 'Anderthalbhänder', name: 'Nachtwind', type: 'NK', tp: '1W+4' },
  { category: 'Anderthalbhänder', name: 'Rondrakamm', type: 'NK', tp: '1W+2' },
  { category: 'Anderthalbhänder', name: 'Tuzakmesser', type: 'NK', tp: '1W+6' },
  // Fernkampf - Armbrust
  { category: 'Armbrust', name: 'Leichte Armbrust', type: 'FK', tp: '1W+6' },
  { category: 'Armbrust', name: 'Schwere Armbrust', type: 'FK', tp: '2W+6' },
  { category: 'Armbrust', name: 'Balläster', type: 'FK', tp: '2W+2' },
  { category: 'Armbrust', name: 'Eisenwalder', type: 'FK', tp: '1W+3' },
  { category: 'Armbrust', name: 'Arbalone', type: 'FK', tp: '3W+6' },
  { category: 'Armbrust', name: 'Balestra', type: 'FK', tp: '2W+2' },
  { category: 'Armbrust', name: 'Balestrina', type: 'FK', tp: '1W+4' },
  // Fernkampf - Belagerungswaffen
  { category: 'Belagerungswaffen', name: 'Ballistische Schleudergeräte', type: 'FK', tp: '1W+4' },
  { category: 'Belagerungswaffen', name: 'Hornisse', type: 'FK', tp: '1W+4' },
  { category: 'Belagerungswaffen', name: 'Torsionschleudern', type: 'FK', tp: '1W+4' },
  { category: 'Belagerungswaffen', name: 'Drachenmäuler', type: 'FK', tp: '1W+4' },
  { category: 'Belagerungswaffen', name: 'Belagerungs-Armbrust', type: 'FK', tp: '1W+4' },
  // Fernkampf — Blasrohr
  { category: 'Blasrohr', name: 'Blasrohr', type: 'FK', tp: '1W-1' },
  // Fernkampf — Bogen
  { category: 'Bogen', name: 'Kurzbogen', type: 'FK', tp: '1W+4' },
  { category: 'Bogen', name: 'Kompositbogen', type: 'FK', tp: '1W+5' },
  { category: 'Bogen', name: 'Kriegsbogen', type: 'FK', tp: '1W+7' },
  { category: 'Bogen', name: 'Langbogen', type: 'FK', tp: '1W+6' },
  { category: 'Bogen', name: 'Elfenbogen', type: 'FK', tp: '1W+5' },
  { category: 'Bogen', name: 'Orkischer Reiterbogen', type: 'FK', tp: '1W+5' },
  // Fernkampf — Diskus
  { category: 'Diskus', name: 'Diskus', type: 'FK', tp: '1W+3' },
  { category: 'Diskus', name: 'Kampfdiskus', type: 'FK', tp: '1W+5' },
  // Nahkampf — Dolche & Klein
  { category: 'Dolche', name: 'Basiliskenzunge', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Borndorn', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Dolch', type: 'NK', tp: '1W+1' },
  { category: 'Dolche', name: 'Drachenzahn', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Elberfänger', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Hakendolch', type: 'NK', tp: '1W+1' },
  { category: 'Dolche', name: 'Jagdmesser', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Kurzschwert', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Langdolch', type: 'NK', tp: '1W+1' },
  { category: 'Dolche', name: 'Linkhand', type: 'NK', tp: '1W+1' },
  { category: 'Dolche', name: 'Mengbilar', type: 'NK', tp: '1W+1' },
  { category: 'Dolche', name: 'Ogerfänger', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Schwerer Dolch', type: 'NK', tp: '1W+2' },
  { category: 'Dolche', name: 'Waqquif', type: 'NK', tp: '1W+2' },
  // Nahkampf - Fechtwaffen
  { category: 'Fechtwaffen', name: 'Degen', type: 'NK', tp: '1W+3' },
  { category: 'Fechtwaffen', name: 'Florett', type: 'NK', tp: '1W+3' },
  { category: 'Fechtwaffen', name: 'Magierdegen', type: 'NK', tp: '1W+2' },
  { category: 'Fechtwaffen', name: 'Rapier', type: 'NK', tp: '1W+3' },
  { category: 'Fechtwaffen', name: 'Stockdegen', type: 'NK', tp: '1W+3' },
  { category: 'Fechtwaffen', name: 'Wolfsmesser', type: 'NK', tp: '1W+3' },
  // Nahkampf - Hiebwaffen
  { category: 'Hiebwaffen', name: 'Brabakbengel', type: 'NK', tp: '1W+5' },
  { category: 'Hiebwaffen', name: 'Byakka', type: 'NK', tp: '1W+5' },
  { category: 'Hiebwaffen', name: 'Gruufhai', type: 'NK', tp: '1W+1' },
  { category: 'Hiebwaffen', name: 'Keule', type: 'NK', tp: '1W+2' },
  { category: 'Hiebwaffen', name: 'Lindwurmschläger', type: 'NK', tp: '1W+4' },
  { category: 'Hiebwaffen', name: 'Molokdeschnaja', type: 'NK', tp: '1W+4' },
  { category: 'Hiebwaffen', name: 'Orknase', type: 'NK', tp: '1W+5' },
  { category: 'Hiebwaffen', name: 'Rabenschnabel', type: 'NK', tp: '1W+4' },
  { category: 'Hiebwaffen', name: 'Schmiedehammer', type: 'NK', tp: '1W+4' },
  { category: 'Hiebwaffen', name: 'Schneidzahn', type: 'NK', tp: '1W+4' },
  { category: 'Hiebwaffen', name: 'Skraja', type: 'NK', tp: '1W+3' },
  { category: 'Hiebwaffen', name: 'Sonnenszepter', type: 'NK', tp: '1W+3' },
  { category: 'Hiebwaffen', name: 'Streitaxt', type: 'NK', tp: '1W+4' },
  { category: 'Hiebwaffen', name: 'Streitkolben', type: 'NK', tp: '1W+4' },
  { category: 'Hiebwaffen', name: 'Zwergenskraja', type: 'NK', tp: '1W+3' },
  // Nahkampf - Infanteriewaffen
  { category: 'Infanteriewaffen', name: 'Glefe', type: 'NK', tp: '1W+4' },
  { category: 'Infanteriewaffen', name: 'Hakenspiess', type: 'NK', tp: '1W+3' },
  { category: 'Infanteriewaffen', name: 'Hellebarde', type: 'NK', tp: '1W+5' },
  { category: 'Infanteriewaffen', name: 'Langaxt', type: 'NK', tp: '2W+2' },
  { category: 'Infanteriewaffen', name: 'Pailos', type: 'NK', tp: '2W+2' },
  { category: 'Infanteriewaffen', name: 'Partisane', type: 'NK', tp: '1W+5' },
  { category: 'Infanteriewaffen', name: 'Schnitter', type: 'NK', tp: '1W+5' },
  { category: 'Infanteriewaffen', name: 'Sturmsense', type: 'NK', tp: '1W+4' },
  { category: 'Infanteriewaffen', name: 'Wurmspiess', type: 'NK', tp: '1W+5' },
  // Nahkampf - Kettenstäbe
  { category: 'Kettenstäbe', name: 'Kettenstab', type: 'NK', tp: '1W+2' },
  // Nahkampf - Kettenwaffen
  { category: 'Kettenwaffen', name: 'Morgenstern', type: 'NK', tp: '1W+1' },
  { category: 'Kettenwaffen', name: 'Ochsenherde', type: 'NK', tp: '3W+3' },
  { category: 'Kettenwaffen', name: 'Ogerschelle', type: 'NK', tp: '2W+2' },
  { category: 'Kettenwaffen', name: 'Neunschwänzige', type: 'NK', tp: '1W+1' },
  { category: 'Kettenwaffen', name: 'Geissel', type: 'NK', tp: '1W-1' },
  // Nahkampf — Lanzenreiten
  { category: 'Lanzenreiten', name: 'Dschadra', type: 'NK', tp: '1W+5' },
  { category: 'Lanzenreiten', name: 'Kriegslanze', type: 'NK', tp: '1W+3' },
  { category: 'Lanzenreiten', name: 'Turnierlanze', type: 'NK', tp: '1W+2' },
  // Nahkampf — Peitschen
  { category: 'Peitschen', name: 'Peitsche', type: 'NK', tp: '1W' },
  // Nahkampf — Raufen / waffenlos
  { category: 'Raufen', name: 'Raufen', type: 'NK', tp: '1W' },
  // Nahkampf — Ringen / waffenlos
  { category: 'Ringen', name: 'Ringen', type: 'NK', tp: '1W-1' },
  // Nahkampf — Säbel
  { category: 'Säbel', name: 'Amazonensäbel', type: 'NK', tp: '1W+4' },
  { category: 'Säbel', name: 'Arbach', type: 'NK', tp: '1W+4' },
  { category: 'Säbel', name: 'Entermesser', type: 'NK', tp: '1W+3' },
  { category: 'Säbel', name: 'Haumesser', type: 'NK', tp: '1W+3' },
  { category: 'Säbel', name: 'Khunchomer', type: 'NK', tp: '1W+4' },
  { category: 'Säbel', name: 'Kurzschwert', type: 'NK', tp: '1W+2' },
  { category: 'Säbel', name: 'Robbentöter', type: 'NK', tp: '1W+3' },
  { category: 'Säbel', name: 'Säbel', type: 'NK', tp: '1W+3' },
  { category: 'Säbel', name: 'Sklaventod', type: 'NK', tp: '1W+4' },
  { category: 'Säbel', name: 'Waqqif', type: 'NK', tp: '1W+2' },
  // Fernkampf - Schleuder
  { category: 'Schleuder', name: 'Schleuder', type: 'FK', tp: '1W+2' },
  { category: 'Schleuder', name: 'Fledermaus', type: 'FK', tp: '1W+2' },
  { category: 'Schleuder', name: 'Lasso', type: 'FK', tp: '1W+4' },
  { category: 'Schleuder', name: 'Leichtes Wurfnetz', type: 'FK', tp: '1W+2' },
  { category: 'Schleuder', name: 'Schweres Wurfnetz', type: 'FK', tp: '1W+6' },
  { category: 'Schleuder', name: 'Wurfhaken', type: 'FK', tp: '1W+2' },
  // Nahkampf — Schwerter
  { category: 'Schwerter', name: 'Amazonensäbel', type: 'NK', tp: '1W+4' },
  { category: 'Schwerter', name: 'Barbarenschwert', type: 'NK', tp: '1W+5' },
  { category: 'Schwerter', name: 'Bastardschwert', type: 'NK', tp: '1W+5' },
  { category: 'Schwerter', name: 'Breitschwert', type: 'NK', tp: '1W+4' },
  { category: 'Schwerter', name: 'Kurzschwert', type: 'NK', tp: '1W+2' },
  { category: 'Schwerter', name: 'Kusliker Säbel', type: 'NK', tp: '1W+3' },
  { category: 'Schwerter', name: 'Langschwert', type: 'NK', tp: '1W+3' },
  { category: 'Schwerter', name: 'Nachtwind', type: 'NK', tp: '1W+4' },
  { category: 'Schwerter', name: 'Rapier', type: 'NK', tp: '1W+3' },
  { category: 'Schwerter', name: 'Robbentöter', type: 'NK', tp: '1W+3' },
  { category: 'Schwerter', name: 'Säbel', type: 'NK', tp: '1W+3' },
  { category: 'Schwerter', name: 'Turnierschwert', type: 'NK', tp: '1W+3' },
  // Nahkampf — Speere
  { category: 'Speere', name: 'Dreizack', type: 'NK', tp: '1W+4' },
  { category: 'Speere', name: 'Dschadra', type: 'NK', tp: '1W+5' },
  { category: 'Speere', name: 'Efferdbart', type: 'NK', tp: '1W+4' },
  { category: 'Speere', name: 'Holzspeer', type: 'NK', tp: '1W+3' },
  { category: 'Speere', name: 'Speer', type: 'NK', tp: '1W+5' },
  { category: 'Speere', name: 'Drachentöter', type: 'NK', tp: '3W+5' },
  { category: 'Speere', name: 'Jagdspiess', type: 'NK', tp: '1W+6' },
  { category: 'Speere', name: 'Partisane', type: 'NK', tp: '1W+5' },
  { category: 'Speere', name: 'Pike', type: 'NK', tp: '1W+5' },
  { category: 'Speere', name: 'Stossspeer', type: 'NK', tp: '2W+2' },
  { category: 'Speere', name: 'Wurmspiess', type: 'NK', tp: '1W+5' },
  // Nahkampf — Stäbe
  { category: 'Stäbe', name: 'Kampfstab', type: 'NK', tp: '1W+1' },
  { category: 'Stäbe', name: 'Magierstab', type: 'NK', tp: '1W+1' },
  { category: 'Stäbe', name: 'Zweililien', type: 'NK', tp: '1W+3' },
  // Fernkampf - Wurfbeile
  { category: 'Wurfbeile', name: 'Wurfbeil', type: 'FK', tp: '1W+3' },
  { category: 'Wurfbeile', name: 'Schneidzahn', type: 'FK', tp: '1W+4' },
  { category: 'Wurfbeile', name: 'Wurfkeule', type: 'FK', tp: '1W+3' },
  // Fernkampf - Wurfmesser
  { category: 'Wurfmesser', name: 'Borndorn', type: 'FK', tp: '1W+2' },
  { category: 'Wurfmesser', name: 'Wurfmesser', type: 'FK', tp: '1W' },
  { category: 'Wurfmesser', name: 'Wurfdolch', type: 'FK', tp: '1W+1' },
  { category: 'Wurfmesser', name: 'Wurfpfeil', type: 'FK', tp: '1W' },
  { category: 'Wurfmesser', name: 'Wurfstern', type: 'FK', tp: '1W' },
  { category: 'Wurfmesser', name: 'Wurfscheibe', type: 'FK', tp: '1W+1' },
  { category: 'Wurfmesser', name: 'Wurfring', type: 'FK', tp: '1W' },
  // Fernkampf - Wurfspeere
  { category: 'Wurfspeere', name: 'Efferdbart', type: 'FK', tp: '1W+4' },
  { category: 'Wurfspeere', name: 'Granatapfel', type: 'FK', tp: '1W+4' },
  { category: 'Wurfspeere', name: 'Holzspeer', type: 'FK', tp: '1W+3' },
  { category: 'Wurfspeere', name: 'Speer', type: 'FK', tp: '1W+5' },
  { category: 'Wurfspeere', name: 'Speerschleuder', type: 'FK', tp: '1W+1' },
  { category: 'Wurfspeere', name: 'Stabschleuder', type: 'FK', tp: '1W+1' },
  { category: 'Wurfspeere', name: 'Wurfspeer', type: 'FK', tp: '1W+3' },
  // Nahkampf — Zweihandflegel
  { category: 'Zweihandflegel', name: 'Kriegsflegel', type: 'NK', tp: '1W+6' },
  // Nahkampf — Zweihand-Hiebwaffen
  { category: 'Zweihand-Hiebwaffen', name: 'Barbarenstreitaxt', type: 'NK', tp: '2W+4' },
  { category: 'Zweihand-Hiebwaffen', name: 'Echsische Axt', type: 'NK', tp: '1W+5' },
  { category: 'Zweihand-Hiebwaffen', name: 'Felsspalter', type: 'NK', tp: '2W+2' },
  { category: 'Zweihand-Hiebwaffen', name: 'Gruufhai', type: 'NK', tp: '1W+6' },
  { category: 'Zweihand-Hiebwaffen', name: 'Kriegshammer', type: 'NK', tp: '2W+3' },
  { category: 'Zweihand-Hiebwaffen', name: 'Langaxt', type: 'NK', tp: '2W+2' },
  { category: 'Zweihand-Hiebwaffen', name: 'Orknase', type: 'NK', tp: '1W+5' },
  { category: 'Zweihand-Hiebwaffen', name: 'Pailos', type: 'NK', tp: '2W+4' },
  { category: 'Zweihand-Hiebwaffen', name: 'Warunker Hammer', type: 'NK', tp: '1W+6' },
  { category: 'Zweihand-Hiebwaffen', name: 'Zwergenschlägel', type: 'NK', tp: '1W+5' },
  // Nahkampf — Zweihandschwerter
  { category: 'Zweihandschwerter', name: 'Andergaster', type: 'NK', tp: '3W+2' },
  { category: 'Zweihandschwerter', name: 'Anderthalbhänder', type: 'NK', tp: '1W+5' },
  { category: 'Zweihandschwerter', name: 'Boronssichel', type: 'NK', tp: '2W+6' },
  { category: 'Zweihandschwerter', name: 'Doppelkhunchomer', type: 'NK', tp: '1W+6' },
  { category: 'Zweihandschwerter', name: 'Grosser Sklaventod', type: 'NK', tp: '2W+4' },
  { category: 'Zweihandschwerter', name: 'Rondrakamm', type: 'NK', tp: '2W+2' },
  { category: 'Zweihandschwerter', name: 'Tuzakmesser', type: 'NK', tp: '1W+6' },
  { category: 'Zweihandschwerter', name: 'Zweihänder', type: 'NK', tp: '2W+4' },
];

// Common DSA 4.1 spells grouped by Repräsentation. Probe, kosten, and
// Steigerungskategorie use typical core rulebook values; users can override
// any field per spell after picking from the list.
const SPELL_TYPES = [
  // Magier — Verwandlung / Heilung / Beherrschung / Hellsicht etc.
  { repr: 'Magier', name: 'Adlerschwinge', probe: 'KL/IN/GE', kosten: '8', kategorie: 'B' },
  { repr: 'Magier', name: 'Armatrutz', probe: 'KL/IN/CH', kosten: '4', kategorie: 'C' },
  { repr: 'Magier', name: 'Axxeleratus', probe: 'KL/IN/GE', kosten: '7', kategorie: 'D' },
  { repr: 'Magier', name: 'Balsam Salabunde', probe: 'KL/CH/FF', kosten: 'X', kategorie: 'C' },
  { repr: 'Magier', name: 'Bannbaladin', probe: 'KL/IN/CH', kosten: '4', kategorie: 'C' },
  { repr: 'Magier', name: 'Blitz dich find', probe: 'KL/CH/KK', kosten: '5', kategorie: 'C' },
  { repr: 'Magier', name: 'Custodosigil', probe: 'KL/IN/FF', kosten: '4', kategorie: 'B' },
  { repr: 'Magier', name: 'Desintegratus', probe: 'KL/IN/CH', kosten: 'X', kategorie: 'D' },
  { repr: 'Magier', name: 'Eigenschaften wiederherstellen', probe: 'KL/IN/CH', kosten: 'X', kategorie: 'C' },
  { repr: 'Magier', name: 'Fulminictus', probe: 'KL/CH/KK', kosten: '5', kategorie: 'B' },
  { repr: 'Magier', name: 'Gardianum', probe: 'KL/IN/CH', kosten: '4', kategorie: 'B' },
  { repr: 'Magier', name: 'Horriphobus', probe: 'KL/IN/CH', kosten: '6', kategorie: 'B' },
  { repr: 'Magier', name: 'Ignifaxius', probe: 'KL/CH/KK', kosten: '5', kategorie: 'B' },
  { repr: 'Magier', name: 'Invocatio minor', probe: 'KL/IN/CH', kosten: '5', kategorie: 'C' },
  { repr: 'Magier', name: 'Klarum Purum', probe: 'KL/IN/FF', kosten: '2', kategorie: 'B' },
  { repr: 'Magier', name: 'Manifesto', probe: 'KL/IN/KK', kosten: 'X', kategorie: 'B' },
  { repr: 'Magier', name: 'Motoricus', probe: 'KL/IN/FF', kosten: '5', kategorie: 'A' },
  { repr: 'Magier', name: 'Odem Arcanum', probe: 'KL/IN/IN', kosten: '4', kategorie: 'B' },
  { repr: 'Magier', name: 'Plumbumbarum', probe: 'KL/CH/KK', kosten: '5', kategorie: 'B' },
  { repr: 'Magier', name: 'Sanftmut', probe: 'KL/IN/CH', kosten: '6', kategorie: 'B' },
  { repr: 'Magier', name: 'Sapefacta', probe: 'KL/IN/CH', kosten: '5', kategorie: 'C' },
  { repr: 'Magier', name: 'Somnigravis', probe: 'KL/IN/CH', kosten: '6', kategorie: 'C' },
  { repr: 'Magier', name: 'Transversalis', probe: 'KL/IN/CH', kosten: 'X', kategorie: 'D' },
  { repr: 'Magier', name: 'Visibili', probe: 'KL/IN/FF', kosten: '6', kategorie: 'C' },
  // Druiden
  { repr: 'Druiden', name: 'Band und Fessel', probe: 'KL/IN/FF', kosten: '6', kategorie: 'B' },
  { repr: 'Druiden', name: 'Beherrschung brechen', probe: 'KL/IN/CH', kosten: '6', kategorie: 'C' },
  { repr: 'Druiden', name: 'Donnerkeil', probe: 'MU/CH/KK', kosten: '7', kategorie: 'C' },
  { repr: 'Druiden', name: 'Erstarre zu Eis', probe: 'KL/CH/KK', kosten: '6', kategorie: 'C' },
  { repr: 'Druiden', name: 'Geisterbann', probe: 'MU/KL/CH', kosten: '6', kategorie: 'D' },
  { repr: 'Druiden', name: 'Tiere rufen', probe: 'MU/IN/CH', kosten: '5', kategorie: 'B' },
  // Hexen
  { repr: 'Hexen', name: 'Aengsten', probe: 'KL/IN/CH', kosten: '4', kategorie: 'B' },
  { repr: 'Hexen', name: 'Besenflug', probe: 'IN/CH/KK', kosten: '6', kategorie: 'B' },
  { repr: 'Hexen', name: 'Calmundo Animo', probe: 'MU/IN/CH', kosten: '4', kategorie: 'B' },
  { repr: 'Hexen', name: 'Hexenblick', probe: 'KL/IN/CH', kosten: '4', kategorie: 'A' },
  { repr: 'Hexen', name: 'Hexenkrallen', probe: 'KL/CH/FF', kosten: '4', kategorie: 'B' },
  { repr: 'Hexen', name: 'Salander', probe: 'KL/IN/CH', kosten: '8', kategorie: 'B' },
  // Elfen
  { repr: 'Elfen', name: 'Duaditus', probe: 'KL/IN/CH', kosten: '6', kategorie: 'B' },
  { repr: 'Elfen', name: 'Lockruf der Wildnis', probe: 'IN/CH/IN', kosten: '5', kategorie: 'B' },
  { repr: 'Elfen', name: 'Pfeilzauber', probe: 'KL/IN/FF', kosten: '4', kategorie: 'B' },
  { repr: 'Elfen', name: 'Schmetterlingszauber', probe: 'KL/CH/FF', kosten: '4', kategorie: 'A' },
  // Geoden
  { repr: 'Geoden', name: 'Erdsegen', probe: 'KL/IN/CH', kosten: '5', kategorie: 'B' },
  { repr: 'Geoden', name: 'Felsenfest', probe: 'KL/IN/KO', kosten: '5', kategorie: 'B' },
  // Scharlatane
  { repr: 'Scharlatane', name: 'Beschleunigte Bewegungen', probe: 'KL/IN/GE', kosten: '4', kategorie: 'B' },
  { repr: 'Scharlatane', name: 'Gaukelei', probe: 'KL/IN/CH', kosten: '3', kategorie: 'A' },
  { repr: 'Scharlatane', name: 'Harmlose Gestalt', probe: 'KL/IN/CH', kosten: '6', kategorie: 'B' },
];

// Common DSA 4.1 Liturgien grouped by Gottheit. Grad is the liturgy's level
// (I–VI). Users can override any field per liturgy after picking from the list.
const LITURGY_TYPES = [
  // Praios
  { gottheit: 'Praios', name: 'Bann der Untoten', grad: 'III' },
  { gottheit: 'Praios', name: 'Blendstrahl', grad: 'I' },
  { gottheit: 'Praios', name: 'Großes Richtfeuer', grad: 'IV' },
  { gottheit: 'Praios', name: 'Wahrheit erkennen', grad: 'II' },
  // Rondra
  { gottheit: 'Rondra', name: 'Rondras Fels', grad: 'II' },
  { gottheit: 'Rondra', name: 'Schlachtgesang', grad: 'I' },
  { gottheit: 'Rondra', name: 'Waffensegen', grad: 'II' },
  { gottheit: 'Rondra', name: 'Zorn der Löwin', grad: 'IV' },
  // Travia
  { gottheit: 'Travia', name: 'Friedenszauber', grad: 'II' },
  { gottheit: 'Travia', name: 'Gastrecht', grad: 'I' },
  { gottheit: 'Travia', name: 'Heim und Herd', grad: 'III' },
  // Boron
  { gottheit: 'Boron', name: 'Letzte Ruhe', grad: 'I' },
  { gottheit: 'Boron', name: 'Schlaf der Gerechten', grad: 'II' },
  { gottheit: 'Boron', name: 'Totengeleit', grad: 'III' },
  // Hesinde
  { gottheit: 'Hesinde', name: 'Auge der Erkenntnis', grad: 'II' },
  { gottheit: 'Hesinde', name: 'Schlangenweisheit', grad: 'I' },
  { gottheit: 'Hesinde', name: 'Wissen der Schlange', grad: 'III' },
  // Phex
  { gottheit: 'Phex', name: 'Diebesgeschick', grad: 'I' },
  { gottheit: 'Phex', name: 'Schattenmantel', grad: 'II' },
  { gottheit: 'Phex', name: 'Verhüllung', grad: 'III' },
  // Peraine
  { gottheit: 'Peraine', name: 'Heilsegen', grad: 'I' },
  { gottheit: 'Peraine', name: 'Gesundheit', grad: 'II' },
  { gottheit: 'Peraine', name: 'Lebenshauch', grad: 'IV' },
  // Efferd
  { gottheit: 'Efferd', name: 'Wasseratem', grad: 'II' },
  { gottheit: 'Efferd', name: 'Günstiger Wind', grad: 'I' },
  { gottheit: 'Efferd', name: 'Sturmgebrüll', grad: 'III' },
  // Firun
  { gottheit: 'Firun', name: 'Fährte des Wildes', grad: 'I' },
  { gottheit: 'Firun', name: 'Kältesegen', grad: 'II' },
  // Tsa
  { gottheit: 'Tsa', name: 'Lebenssegen', grad: 'II' },
  { gottheit: 'Tsa', name: 'Verjüngung', grad: 'V' },
  { gottheit: 'Tsa', name: 'Neubeginn', grad: 'I' },
  // Ingerimm
  { gottheit: 'Ingerimm', name: 'Feuersegen', grad: 'I' },
  { gottheit: 'Ingerimm', name: 'Meisterhandwerk', grad: 'II' },
  // Rahja
  { gottheit: 'Rahja', name: 'Rausch der Sinne', grad: 'I' },
  { gottheit: 'Rahja', name: 'Liebreiz', grad: 'II' },
];

// Liturgy Steigerungskategorie scales with the liturgy's Grad: higher Grad
// liturgies are harder (more expensive) to raise. I→B … VI→G.
const GRAD_TO_KATEGORIE = { 'I': 'B', 'II': 'C', 'III': 'D', 'IV': 'E', 'V': 'F', 'VI': 'G' };
function liturgyKategorie(liturgy) {
  // Explicit override on the liturgy wins; otherwise derive from Grad; fallback C.
  if (liturgy && liturgy.kategorie) return liturgy.kategorie;
  if (liturgy && liturgy.grad && GRAD_TO_KATEGORIE[liturgy.grad]) return GRAD_TO_KATEGORIE[liturgy.grad];
  return 'C';
}

// Common DSA 4.1 Vorteile grouped by category. GP = Generierungspunkte cost
// (typical core values). `leveled: true` marks advantages bought in steps,
// where the listed GP is the per-step cost. Users can override GP per entry.
const VORTEIL_TYPES = [
  // Körperlich  
  { kategorie: 'Körperlich', name: 'Ausdauernd', gp: '1', leveled: true},
  { kategorie: 'Körperlich', name: 'Balance', gp: '10' },
  { kategorie: 'Körperlich', name: 'Beidhändig', gp: '12' },
  { kategorie: 'Körperlich', name: 'Dämmerungssicht', gp: '10' },
  { kategorie: 'Körperlich', name: 'Eisern', gp: '7' },
  { kategorie: 'Körperlich', name: 'Entfernungssinn', gp: '10' },
  { kategorie: 'Körperlich', name: 'Gefahreninstinkt', gp: '15' },
  { kategorie: 'Körperlich', name: 'Glück', gp: '20' },
  { kategorie: 'Körperlich', name: 'Gutaussehend', gp: '5' },
  { kategorie: 'Körperlich', name: 'Herausragende Balance', gp: '20' },
  { kategorie: 'Körperlich', name: 'Herausragende Eigenschaft', gp: '8', leveled: true },
  { kategorie: 'Körperlich', name: 'Herausragender Sinn', gp: '5' },  
  { kategorie: 'Körperlich', name: 'Herausragendes Aussehen', gp: '12' },  
  { kategorie: 'Körperlich', name: 'Hitzeresistenz', gp: '5' },  
  { kategorie: 'Körperlich', name: 'Hohe Lebenskraft', gp: '3', leveled: true }, 
  { kategorie: 'Körperlich', name: 'Immunität gegen Gift', gp: '10'},
  { kategorie: 'Körperlich', name: 'Innerer Kompass', gp: '7'},
  { kategorie: 'Körperlich', name: 'Kälteresistenz', gp: '5'},
  { kategorie: 'Körperlich', name: 'Linkshänder', gp: '5'},
  { kategorie: 'Körperlich', name: 'Nachtsicht', gp: '5'},
  { kategorie: 'Körperlich', name: 'Natürlicher Rüstungschutz', gp: '10', levled: true},
  // Kampf
  { kategorie: 'Kampf', name: 'Akademische Ausbildung (Krieger)', gp: '20' },
  { kategorie: 'Kampf', name: 'Beidhändig', gp: '20' },
  { kategorie: 'Kampf', name: 'Kampfrausch', gp: '15' },
  // Magisch
  { kategorie: 'Magisch', name: 'Hohe Magieresistenz', gp: '3', leveled: true },
  // Karmal
  { kategorie: 'Karmal', name: 'Hohe Karmalqualität', gp: '12', leveled: true },
  { kategorie: 'Karmal', name: 'Karmalqualität', gp: '8' },
  // Sozial
  { kategorie: 'Sozial', name: 'Adlige Abstammung', gp: '7' },
  { kategorie: 'Sozial', name: 'Adliges Erbe', gp: '10' },
  { kategorie: 'Sozial', name: 'Ausrüstungsvorteil', gp: '1', leveled: true },
  { kategorie: 'Sozial', name: 'Besonderer Besitz', gp: '7' },
  { kategorie: 'Sozial', name: 'Feenfreund', gp: '7' },
  { kategorie: 'Sozial', name: 'Glück im Spiel', gp: '7' },
  { kategorie: 'Sozial', name: 'Koboldfreund', gp: '15' },
  // Wissen & Fähigkeiten
  { kategorie: 'Wissen & Fähigkeiten', name: 'Akademische Ausbildung (Gelehrter)', gp: '10' },
  { kategorie: 'Wissen & Fähigkeiten', name: 'Breigefächerte Bildung', gp: '15' },
  { kategorie: 'Wissen & Fähigkeiten', name: 'Eidetisches Gedächnis', gp: '35' },
  { kategorie: 'Wissen & Fähigkeiten', name: 'Gebildet', gp: '1', leveled: true },
  { kategorie: 'Wissen & Fähigkeiten', name: 'Gutes Gedächnis', gp: '7' },
  { kategorie: 'Wissen & Fähigkeiten', name: 'Ortskenntnis', gp: '3' },
  { kategorie: 'Wissen & Fähigkeiten', name: 'Prophezeien', gp: '12' },
];

// Common DSA 4.1 Nachteile grouped by category. gp = the GP the disadvantage
// is worth (returned at creation; in Steigern mode taking one refunds AP at 1:1).
const NACHTEIL_TYPES = [
  // Allgemein
  { kategorie: 'Allgemein', name: 'Behäbig', gp: '6', leveled: true },
  { kategorie: 'Allgemein', name: 'Blutrausch', gp: '7' },
  { kategorie: 'Allgemein', name: 'Eingeschränkter Sinn', gp: '3' },
  { kategorie: 'Allgemein', name: 'Farbenblind', gp: '2' },
  { kategorie: 'Allgemein', name: 'Glasknochen', gp: '20' },
  { kategorie: 'Allgemein', name: 'Kleinwüchsig', gp: '5' },
  { kategorie: 'Allgemein', name: 'Krankheitsanfällig', gp: '5' },
  { kategorie: 'Allgemein', name: 'Kurzatmig', gp: '8' },
  { kategorie: 'Allgemein', name: 'Lahm', gp: '9', leveled: true },
  { kategorie: 'Allgemein', name: 'Schlechte Eigenschaft', gp: '5', leveled: true },
  { kategorie: 'Allgemein', name: 'Schwache Ausstrahlung', gp: '5' },
  { kategorie: 'Allgemein', name: 'Unfähig für Talent', gp: '5' },
  { kategorie: 'Allgemein', name: 'Unstet', gp: '5' },
  // Kampf
  { kategorie: 'Kampf', name: 'Blutige Anfänger', gp: '10' },
  { kategorie: 'Kampf', name: 'Friedfertig', gp: '7' },
  { kategorie: 'Kampf', name: 'Kampfunfähigkeit', gp: '8' },
  // Schlechte Angewohnheiten / Schwächen
  { kategorie: 'Schwächen', name: 'Arroganz', gp: '5', leveled: true },
  { kategorie: 'Schwächen', name: 'Aberglaube', gp: '5', leveled: true },
  { kategorie: 'Schwächen', name: 'Goldgier', gp: '5', leveled: true },
  { kategorie: 'Schwächen', name: 'Jähzorn', gp: '5', leveled: true },
  { kategorie: 'Schwächen', name: 'Neugier', gp: '5', leveled: true },
  { kategorie: 'Schwächen', name: 'Vorurteile', gp: '5', leveled: true },
  { kategorie: 'Schwächen', name: 'Weltfremd', gp: '5' },
  // Ängste (Phobien)
  { kategorie: 'Ängste', name: 'Höhenangst', gp: '5', leveled: true },
  { kategorie: 'Ängste', name: 'Platzangst', gp: '5', leveled: true },
  { kategorie: 'Ängste', name: 'Angst vor Tieren', gp: '5', leveled: true },
  { kategorie: 'Ängste', name: 'Angst vor der Dunkelheit', gp: '5', leveled: true },
  // Magisch
  { kategorie: 'Magisch', name: 'Astraler Block', gp: '12' },
  { kategorie: 'Magisch', name: 'Niedrige Magieresistenz', gp: '12', leveled: true },
  { kategorie: 'Magisch', name: 'Maraskanische Veranlagung', gp: '4' },
  // Sozial
  { kategorie: 'Sozial', name: 'Übler Ruf', gp: '5', leveled: true },
  { kategorie: 'Sozial', name: 'Verpflichtungen', gp: '5', leveled: true },
  { kategorie: 'Sozial', name: 'Wenig Geld', gp: '5', leveled: true },
  { kategorie: 'Sozial', name: 'Prinzipientreue', gp: '4' },
];

// Common DSA 4.1 Sonderfertigkeiten grouped by category. ap = the fixed AP
// cost to learn the SF (typical core/Liber Cantiones values). Users can
// override the cost per entry.
const SF_TYPES = [
  // Kampf — Manöver
  { kategorie: 'Kampf', name: 'Ausfall', ap: '100' },
  { kategorie: 'Kampf', name: 'Befreiungsschlag', ap: '100' },
  { kategorie: 'Kampf', name: 'Binden', ap: '150' },
  { kategorie: 'Kampf', name: 'Entwaffnen', ap: '150' },
  { kategorie: 'Kampf', name: 'Finte', ap: '100' },
  { kategorie: 'Kampf', name: 'Gezielter Stich', ap: '150' },
  { kategorie: 'Kampf', name: 'Hammerschlag', ap: '100' },
  { kategorie: 'Kampf', name: 'Klingenwand', ap: '200' },
  { kategorie: 'Kampf', name: 'Linkshändig kämpfen', ap: '100' },
  { kategorie: 'Kampf', name: 'Meisterparade', ap: '200' },
  { kategorie: 'Kampf', name: 'Niederwerfen', ap: '100' },
  { kategorie: 'Kampf', name: 'Rückhand', ap: '150' },
  { kategorie: 'Kampf', name: 'Schildkampf I', ap: '100' },
  { kategorie: 'Kampf', name: 'Sturmangriff', ap: '100' },
  { kategorie: 'Kampf', name: 'Todesstoß', ap: '200' },
  { kategorie: 'Kampf', name: 'Umreißen', ap: '100' },
  { kategorie: 'Kampf', name: 'Wuchtschlag', ap: '100' },
  // Waffenstil / Kampfstil
  { kategorie: 'Kampfstil', name: 'Linkhandwaffen I', ap: '200' },
  { kategorie: 'Kampfstil', name: 'Parierwaffen I', ap: '200' },
  { kategorie: 'Kampfstil', name: 'Schildkampf II', ap: '200' },
  { kategorie: 'Kampfstil', name: 'Zweihändiger Kampf I', ap: '200' },
  // Magisch
  { kategorie: 'Magisch', name: 'Merkmalskenntnis', ap: '100' },
  { kategorie: 'Magisch', name: 'Repräsentation (weitere)', ap: '450' },
  { kategorie: 'Magisch', name: 'Ritualkenntnis (Gilde)', ap: '250' },
  { kategorie: 'Magisch', name: 'Hound der Beschwörung', ap: '200' },
  { kategorie: 'Magisch', name: 'Kraftkontrolle', ap: '150' },
  { kategorie: 'Magisch', name: 'Matrixgeber', ap: '200' },
  { kategorie: 'Magisch', name: 'Regeneration I (Astral)', ap: '150' },
  // Geweiht / Klerikal
  { kategorie: 'Klerikal', name: 'Liturgiekenntnis (weitere)', ap: '250' },
  { kategorie: 'Klerikal', name: 'Mirakelkunde', ap: '100' },
  { kategorie: 'Klerikal', name: 'Karmalqualität-Steigerung', ap: '150' },
  // Allgemein / Talent
  { kategorie: 'Allgemein', name: 'Akademische Ausbildung', ap: '100' },
  { kategorie: 'Allgemein', name: 'Bildung', ap: '50' },
  { kategorie: 'Allgemein', name: 'Falschspiel', ap: '75' },
  { kategorie: 'Allgemein', name: 'Geländekunde', ap: '75' },
  { kategorie: 'Allgemein', name: 'Kulturkunde', ap: '50' },
  { kategorie: 'Allgemein', name: 'Ortskenntnis', ap: '50' },
  { kategorie: 'Allgemein', name: 'Scharfschütze', ap: '100' },
  { kategorie: 'Allgemein', name: 'Schnelllader (Armbrust)', ap: '100' },
];

// ───────────────────────────────────────────────────────────────
// DSA 4.1 Leveling-up cost rules
// ───────────────────────────────────────────────────────────────
// Steigerungskategorien (cost categories) A–H. Each increase of a talent or
// spell costs (factor × newValue) AP, with extra cost when raising past the
// associated Eigenschaft (Leiteigenschaft).
const STEIGERUNGS_FAKTOR = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 10, H: 20 };

// Default Steigerungskategorie per talent name. Picked from typical DSA 4.1
// values; users can adjust per character later via the UI we'll add.
const DEFAULT_TALENT_KATEGORIEN = {
  // Körperliche Talente
  'Akrobatik': 'D', 'Athletic': 'D', 'Fliegen': 'D', 'Gaukeleien': 'D', 'Klettern': 'D', 'Körperbeherrschung': 'D', 'Reiten': 'D',
  'Schleichen': 'D', 'Schwimmen': 'D', 'Selbstbeherrschung': 'D', 'Sich Verstecken': 'D', 'Singen': 'D', 'Sinnesschärfe': 'D', 
  'Skifahren': 'D', 'Stimmen Imitieren': 'D', 'Tanzen': 'D', 'Taschendiebstahl': 'D', 'Zechen': 'D', 
  // Gesellschaftliche Talente
  'Betören': 'B', 'Etikette': 'B', 'Galanterie': 'B', 'Gassenwissen': 'B', 'Lehren': 'B', 'Menschenkenntnis': 'B', 'Schauspielerei': 'B',
  'Schriftl. Ausdruck': 'B', 'Sich Verkleiden': 'B', 'Überreden': 'B', 'Überzeugen': 'B', 
  // Natur-Talente
  'Fährtensuchen': 'B', 'Fallenstellen': 'B', 'Fesseln': 'B', 'Fischen & Angeln': 'B', 'Orientierung': 'B', 'Seefischerei': 'B', 
  'Wettervorhersage': 'B', 'Wildnisleben': 'B',
  // Wissenstalente
  'Anatomie': 'B', 'Baukunst': 'B', 'Brettspiel': 'B', 'Geographie': 'B', 'Geschichtswissen': 'B', 'Gesteinskunde': 'B', 'Götter & Kulte': 'B',
  'Heraldik': 'B', 'Hüttenkunde': 'B', 'Kriegskunst': 'B', 'Kryptographie': 'B', 'Magiekunde': 'B', 'Mechanik': 'B', 'Pflanzenkunde': 'B', 
  'Philosophie': 'B', 'Rechnen': 'B', 'Rechtskunde': 'B', 'Sagen & Legenden': 'B', 'Schätzen': 'B', 'Schiffbau': 'B', 'Sprachenkunde': 'B',
  'Staatskunst': 'B', 'Sternkunde': 'B', 'Tierkunde': 'B', 
  // Sprachen 
  'Lesen/Schreiben': 'A', 'Sprachen [Muttersprache]': 'A', 'Sprachen [Fremdsprache]': 'A', 
  // Handwerkstalente 
  'Abrichten': 'B', 'Boote Fahren': 'B', 'Eissegler Fahren': 'B', 'Fahrzeug Lenken': 'B', 'Falschspiel': 'B', 'Feuersteinbearbeitung': 'B', 
  'Grobschmied': 'B', 'Heilkunde Gift': 'B', 'Heilkunde Krankheiten': 'B', 'Heilkunde Wunden': 'B', 'Holzbearbeitung': 'B', 
  'Hundeschlitten Fahren': 'B', 'Kartographie': 'B', 'Kochen': 'B', 'Lederarbeiten': 'B', 'Malen/Zeichnen': 'B', 'Musizieren': 'B', 
  'Schlösser Knacken': 'B', 'Schneidern': 'B', 'Stoffe Färben': 'B', 'Tätowieren': 'B', 'Töpfern': 'B', 'Webkunst': 'B',
  // Kampf
  'Anderthalbhänder': 'E', 'Armbrust': 'C', 'Belagerungswaffen': 'D', 'Blasrohr': 'D', 'Bogen': 'E', 'Diskus': 'D', 'Dolche & Kleinwaffen': 'D',
  'Fechtwaffen': 'E', 'Hiebwaffen': 'D', 'Infanteriewaffen': 'D', 'Kettenstäbe': 'E', 'Kettenwaffen': 'D', 'Lanzenreiten': 'D', 'Peitschen': 'E',
  'Raufen': 'C', 'Ringen': 'D', 'Säbel': 'D', 'Schleuder': 'E', 'Schwerter': 'E', 'Speere': 'D', 'Stäbe': 'D', 'Wurfbeile': 'D', 
  'Wurfmesser': 'C', 'Wurfspeere': 'C', 'Zweihandflegel': 'D', 'Zweihand-Hiebwaffen': 'D', 'Zweihandschwerter': 'E',
  };

// Default Steigerungskategorie per weapon type. Common values from DSA 4.1.
const DEFAULT_WEAPON_KATEGORIEN = {
  // Nahkampf - Anderthalbhänder
  'Anderthalbhänder': 'E', 'Bastardschwert': 'E', 'Nachtwind': 'E', 'Rondrakamm': 'E', 'Tuzakmesser': 'E',
  // Fernkampf - Armbrust
  'Leichte Armbrust': 'C', 'Schwere Armbrust': 'C', 'Balläster': 'C', 'Arbalone': 'C', 'Balestra': 'C', 'Balestrina': 'C', 
  // Fernkampf - Belagerungswaffen
  'Ballistische Schleudergeräte': 'D', 'Hornisse': 'D', 'Torsionschleudern': 'D', 'Drachenmäuler': 'D', 'Belagerungs-Armbrust': 'D',
  // Fernkampf — Blasrohr
  'Blasrohr': 'D',
  // Fernkampf — Bogen
  'Kurzbogen': 'E', 'Kompositbogen': 'E', 'Kriegsbogen': 'E', 'Langbogen': 'E', 'Elfenbogen': 'E', 'Orkischer Reiterbogen': 'E',
  // Fernkampf — Diskus
  'Diskus': 'D', 'Kampfdiskus': 'D', 
  // Nahkampf — Dolche & Klein
  'Basiliskenzunge': 'D', 'Borndorn': 'D', 'Dolch': 'D', 'Drachenzahn': 'D', 'Elberfänger': 'D', 'Hakendolch': 'D', 'Jagdmesser': 'D', 
  'Kurzschwert': 'D', 'Langdolch': 'D', 'Linkhand': 'D', 'Mengbilar': 'D', 'Ogerfänger': 'D', 'Schwerer Dolch': 'D', 'Waqquif': 'D', 
  // Nahkampf - Fechtwaffen
  'Degen': 'E', 'Florett': 'E', 'Magierdegen': 'E', 'Rapier': 'E', 'Stockdegen': 'E', 'Wolfsmesser': 'E', 
  // Nahkampf - Hiebwaffen
  'Brabakbengel': 'D', 'Byakka': 'D', 'Gruufhai': 'D', 'Keule': 'D', 'Lindwurmschläger': 'D', 'Molokdeschnaja': 'D', 'Orknase': 'D',
  'Rabenschnabel': 'D', 'Schmiedehammer': 'D', 'Schneidzahn': 'D', 'Skraja': 'D', 'Sonnenszepter': 'D', 'Streitaxt': 'D',
  'Streitkolben': 'D', 'Zwergenskraja': 'D', 
  // Nahkampf - Infanteriewaffen
  'Glefe': 'D', 'Hakenspiess': 'D', 'Hellebarde': 'D', 'Langaxt': 'D', 'Pailos': 'D', 'Partisane': 'D', 'Schnitter': 'D', 
  'Sturmsense': 'D', 'Wurmspiess': 'D', 
  // Nahkampf - Kettenstäbe
  'Kettenstab': 'E', 
  // Nahkampf - Kettenwaffen
  'Morgenstern': 'D', 'Ochsenherde': 'D', 'Ogerschelle': 'D', 'Neunschwänzige': 'D', 'Geissel': 'D', 
  // Nahkampf — Lanzenreiten
  'Dschadra': 'D', 'Kriegslanze': 'D', 'Turnierlanze': 'D', 
  // Nahkampf — Peitschen
  'Peitsche': 'E', 
  // Nahkampf — Raufen / waffenlos
  'Raufen': 'C', 
  // Nahkampf — Ringen / waffenlos
  'Ringen': 'D', 
  // Nahkampf — Säbel
  'Amazonensäbel': 'D', 'Arbach': 'D', 'Entermesser': 'D', 'Haumesser': 'D', 'Khunchomer': 'D', 'Kurzschwert': 'D', 'Robbentöter': 'D', 
  'Säbel': 'D', 'Sklaventod': 'D', 'Waqqif': 'D', 
   // Fernkampf - Schleuder
  'Schleuder': 'E', 'Fledermaus': 'E', 'Lasso': 'E', 'Leichtes Wurfnetz': 'E', 'Schweres Wurfnetz': 'E', 'Wurfhaken': 'E', 
  // Nahkampf — Schwerter
  'Amazonensäbel': 'E', 'Barbarenschwert': 'E', 'Bastardschwert': 'E', 'Breitschwert': 'E', 'Kurzschwert': 'E', 'Kusliker Säbel': 'E', 
  'Langschwert': 'E', 'Nachtwind': 'E', 'Rapier': 'E', 'Robbentöter': 'E', 'Säbel': 'E', 'Turnierschwert': 'E', 
  // Nahkampf — Speere
  'Dreizack': 'D', 'Dschadra': 'D', 'Efferdbart': 'D', 'Holzspeer': 'D', 'Speer': 'D', 'Drachentöter': 'D', 'Jagdspiess': 'D',  'Partisane': 'D', 
  'Pike': 'D', 'Stossspeer': 'D', 'Wurmspiess': 'D', 
  // Nahkampf — Stäbe
  'Kampfstab': 'D', 'Magierstab': 'D', 'Zweililien': 'D', 
  // Fernkampf - Wurfbeile
  'Wurfbeil': 'D', 'Schneidzahn': 'D', 'Wurfkeule': 'D', 
  // Fernkampf - Wurfmesser
  'Borndorn': 'C', 'Wurfmesser': 'C', 'Wurfdolch': 'C', 'Wurfpfeil': 'C', 'Wurfstern': 'C', 'Wurfscheibe': 'C', 'Wurfring': 'C', 
  // Fernkampf - Wurfspeere
  'Efferdbart': 'C', 'Granatapfel': 'C', 'Holzspeer': 'C', 'Speer': 'C', 'Speerschleuder': 'C', 'Stabschleuder': 'C', 'Wurfspeer': 'C', 
  // Nahkampf — Zweihandflegel
  'Kriegsflegel': 'D', 
  // Nahkampf — Zweihand-Hiebwaffen
  'Barbarenstreitaxt': 'D', 'Echsische Axt': 'D', 'Felsspalter': 'D', 'Gruufhai': 'D', 'Kriegshammer': 'D', 'Langaxt': 'D', 'Orknase': 'D',
  'Pailos': 'D', 'Warunker Hammer': 'D', 'Zwergenschlägel': 'D',
  // Nahkampf — Zweihandschwerter
  'Andergaster': 'E', 'Anderthalbhänder': 'E', 'Boronssichel': 'E', 'Doppelkhunchomer': 'E', 'Grosser Sklaventod': 'E', 'Rondrakamm': 'E',
  'Tuzakmesser': 'E', 'Zweihänder': 'E', 
};

// Pure cost calculators ----------------------------------------------------

// Resolve the Steigerungskategorie for a given talent on a hero. If the hero
// has a saved override, use that; otherwise fall back to defaults; otherwise 'B'.
function talentKategorie(char, talentName) {
  const overrides = (char && char.talentKategorien) || {};
  if (overrides[talentName]) return overrides[talentName];
  return DEFAULT_TALENT_KATEGORIEN[talentName] || 'B';
}

function weaponKategorie(char, weaponName) {
  const overrides = (char && char.weaponKategorien) || {};
  if (overrides[weaponName]) return overrides[weaponName];
  return DEFAULT_WEAPON_KATEGORIEN[weaponName] || 'C';
}

// Cost to raise a talent from currentTaW to currentTaW+1. DSA 4.1:
//   - cost = factor × newValue
//   - if newValue ≤ Leiteigenschaft (max of probe attributes), no extra cost
//   - if newValue > Leiteigenschaft, doubled cost per published rules.
// For simplicity we use the highest of the three probe attribute values as the
// Leiteigenschaft threshold. Callers can also pass an explicit threshold.
function talentRaiseCost(currentTaW, kategorie, leitwert) {
  const newValue = (Number(currentTaW) || 0) + 1;
  const factor = STEIGERUNGS_FAKTOR[kategorie] || STEIGERUNGS_FAKTOR.B;
  const base = factor * newValue;
  if (typeof leitwert === 'number' && newValue > leitwert) {
    return base * 2;
  }
  return base;
}

// Compute Leitwert (max of probe attribute values) from a probe string like "MU/KL/IN"
function talentLeitwert(probe, attributes) {
  if (!probe || !attributes) return null;
  const parts = String(probe).split('/').map((p) => p.trim());
  let max = -Infinity;
  for (const p of parts) {
    const v = attributes[p];
    if (typeof v === 'number' && v > max) max = v;
  }
  return max === -Infinity ? null : max;
}

// Cost to raise a spell — same formula as talents.
function spellRaiseCost(currentZfW, kategorie, leitwert) {
  return talentRaiseCost(currentZfW, kategorie, leitwert);
}

// Cost to raise a weapon talent (AT or PA). Same formula as talents using the
// weapon's Steigerungskategorie.
function weaponTalentRaiseCost(currentTaW, kategorie) {
  const newValue = (Number(currentTaW) || 0) + 1;
  const factor = STEIGERUNGS_FAKTOR[kategorie] || STEIGERUNGS_FAKTOR.C;
  return factor * newValue;
}

// Cost to raise an attribute by 1. DSA 4.1 uses a per-attribute cost table; the
// typical published costs follow a roughly linear progression `15 × newValue`
// for values in the 8–18 range. Above 18 the cost doubles.
function attributeRaiseCost(newValue) {
  const nv = Number(newValue) || 0;
  if (nv <= 18) return 15 * nv;
  // Beyond 18: doubled progression
  return 30 * nv;
}

// Cost to raise Magieresistenz (Faktor 75 per the published rules).
function magicResistanceRaiseCost(newValue) {
  const nv = Number(newValue) || 0;
  return 75 * nv;
}

// AP bookkeeping -----------------------------------------------------------

function availableAp(char) {
  const ap = char && char.ap;
  if (!ap) return 0;
  return (Number(ap.total) || 0) - (Number(ap.spent) || 0);
}

function canAfford(char, cost) {
  return availableAp(char) >= cost;
}

// Spend AP and return the new character object. Does NOT mutate; safe for use
// with React setState. Throws if the character cannot afford the cost.
function spendAp(char, cost) {
  const have = availableAp(char);
  if (have < cost) {
    throw new Error('Nicht genug Abenteuerpunkte: brauche ' + cost + ', habe ' + have);
  }
  return {
    ...char,
    ap: {
      ...(char.ap || { total: 0, spent: 0 }),
      spent: (Number((char.ap || {}).spent) || 0) + cost,
    },
  };
}

// Hero mutators ------------------------------------------------------------
// All mutators return a new char object and throw on insufficient AP.
// They do NOT persist — callers must pass the result to their update fn.

function raiseAttribute(char, attrKey) {
  const current = (char.attributes || {})[attrKey];
  if (typeof current !== 'number') {
    throw new Error('Unbekannte Eigenschaft: ' + attrKey);
  }
  const newValue = current + 1;
  const cost = attributeRaiseCost(newValue);
  const next = spendAp(char, cost);
  return {
    ...next,
    attributes: { ...next.attributes, [attrKey]: newValue },
  };
}

function raiseTalent(char, talentId) {
  const talents = char.talents || [];
  const t = talents.find((x) => x.id === talentId);
  if (!t) throw new Error('Talent nicht gefunden: ' + talentId);
  const kat = talentKategorie(char, t.name);
  const leitwert = talentLeitwert(t.probe, char.attributes);
  const cost = talentRaiseCost(t.taw, kat, leitwert);
  const next = spendAp(char, cost);
  return {
    ...next,
    talents: talents.map((x) => x.id === talentId ? { ...x, taw: (Number(x.taw) || 0) + 1 } : x),
  };
}

function raiseSpell(char, spellId) {
  const spells = char.spells || [];
  const s = spells.find((x) => x.id === spellId);
  if (!s) throw new Error('Zauber nicht gefunden: ' + spellId);
  // Spell category overrides could be added later; default to C.
  const kat = (s.kategorie || 'C');
  const leitwert = talentLeitwert(s.probe, char.attributes);
  const cost = spellRaiseCost(s.zfw, kat, leitwert);
  const next = spendAp(char, cost);
  return {
    ...next,
    spells: spells.map((x) => x.id === spellId ? { ...x, zfw: (Number(x.zfw) || 0) + 1 } : x),
  };
}

// Liturgien: each has a Liturgiekenntnis (LkW) value raised point-by-point.
// Cost uses the Steigerungskategorie (default C), with no Leitwert doubling
// since liturgies are not tied to a single Eigenschaft the same way.
function liturgyRaiseCost(currentLkW, kategorie) {
  const newValue = (Number(currentLkW) || 0) + 1;
  const factor = STEIGERUNGS_FAKTOR[kategorie] || STEIGERUNGS_FAKTOR.C;
  return factor * newValue;
}

function raiseLiturgy(char, liturgyId) {
  const liturgies = char.liturgies || [];
  const l = liturgies.find((x) => x.id === liturgyId);
  if (!l) throw new Error('Liturgie nicht gefunden: ' + liturgyId);
  const kat = liturgyKategorie(l);
  const cost = liturgyRaiseCost(l.lkw, kat);
  const next = spendAp(char, cost);
  return {
    ...next,
    liturgies: liturgies.map((x) => x.id === liturgyId ? { ...x, lkw: (Number(x.lkw) || 0) + 1 } : x),
  };
}

// Buy an advantage during play. DSA 4.1 standard: GP→AP at 1:1, so the AP cost
// equals the advantage's GP value. Returns a new char with AP spent and the
// advantage appended (flagged paidAp so it isn't freely removable in Steigern).
function buyAdvantage(char, advantageData) {
  const cost = Number(advantageData.gp) || 0;
  const next = spendAp(char, cost);
  const entry = {
    id: 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
    ...advantageData,
    paidAp: true,
  };
  return {
    ...next,
    advantages: [...(next.advantages || []), entry],
  };
}

// Take a disadvantage during play. DSA 4.1: this returns GP, which converts to
// AP at 1:1 — i.e. the hero gains that many AP. We model the gain by reducing
// `spent` (floored at 0); any remainder raises `total` so available AP rises by
// the full GP value. Returns a new char with the disadvantage appended.
function takeDisadvantage(char, disadvantageData) {
  const refund = Number(disadvantageData.gp) || 0;
  const ap = char.ap || { total: 0, spent: 0 };
  const spent = Number(ap.spent) || 0;
  const total = Number(ap.total) || 0;
  const reduceSpent = Math.min(spent, refund);
  const remainder = refund - reduceSpent;
  const entry = {
    id: 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
    ...disadvantageData,
    paidAp: true,
  };
  return {
    ...char,
    ap: { ...ap, spent: spent - reduceSpent, total: total + remainder },
    disadvantages: [...(char.disadvantages || []), entry],
  };
}

// Learn a Sonderfertigkeit during play. SFs have a fixed AP cost (not GP), so
// the cost is the SF's `ap` value directly. Returns a new char with AP spent
// and the SF appended (flagged paidAp).
function learnSpecialAbility(char, sfData) {
  const cost = Number(sfData.ap) || 0;
  const next = spendAp(char, cost);
  const entry = {
    id: 'sf_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
    ...sfData,
    paidAp: true,
  };
  return {
    ...next,
    specialAbilities: [...(next.specialAbilities || []), entry],
  };
}

// field: 'at' or 'pa'
function raiseWeaponTalent(char, weaponName, field) {
  if (field !== 'at' && field !== 'pa') {
    throw new Error('Ungültiges Kampftalent-Feld: ' + field);
  }
  const wt = char.weaponTalents || {};
  const entry = wt[weaponName] || {};
  const current = Number(entry[field]) || 0;
  const kat = weaponKategorie(char, weaponName);
  const cost = weaponTalentRaiseCost(current, kat);
  const next = spendAp(char, cost);
  return {
    ...next,
    weaponTalents: {
      ...wt,
      [weaponName]: { ...entry, [field]: current + 1 },
    },
  };
}

function raiseMagicResistance(char) {
  const current = (char.derivedMods && Number(char.derivedMods.MR)) || 0;
  // MR is derived, modifier-based here. Treat MR raises as +1 to the MR modifier.
  // The cost factor uses the resulting absolute MR; approximate using current MR base + mod + 1.
  const baseMR = char.attributes
    ? Math.round(((char.attributes.MU || 0) + (char.attributes.KL || 0) + (char.attributes.KO || 0)) / 5)
    : 0;
  const newMR = baseMR + current + 1;
  const cost = magicResistanceRaiseCost(newMR);
  const next = spendAp(char, cost);
  return {
    ...next,
    derivedMods: { ...(next.derivedMods || {}), MR: current + 1 },
  };
}

// Convenience: compute the AP cost for any raise without applying it.
// Returns null if the raise is not applicable (unknown id, etc.).
function previewRaiseCost(char, kind, key) {
  try {
    if (kind === 'attribute') {
      const current = (char.attributes || {})[key];
      if (typeof current !== 'number') return null;
      return attributeRaiseCost(current + 1);
    }
    if (kind === 'talent') {
      const t = (char.talents || []).find((x) => x.id === key);
      if (!t) return null;
      const kat = talentKategorie(char, t.name);
      const leitwert = talentLeitwert(t.probe, char.attributes);
      return talentRaiseCost(t.taw, kat, leitwert);
    }
    if (kind === 'spell') {
      const s = (char.spells || []).find((x) => x.id === key);
      if (!s) return null;
      const kat = (s.kategorie || 'C');
      const leitwert = talentLeitwert(s.probe, char.attributes);
      return spellRaiseCost(s.zfw, kat, leitwert);
    }
    if (kind === 'liturgy') {
      const l = (char.liturgies || []).find((x) => x.id === key);
      if (!l) return null;
      return liturgyRaiseCost(l.lkw, liturgyKategorie(l));
    }
    if (kind === 'weaponAt' || kind === 'weaponPa') {
      const field = kind === 'weaponAt' ? 'at' : 'pa';
      const entry = (char.weaponTalents || {})[key] || {};
      const current = Number(entry[field]) || 0;
      const kat = weaponKategorie(char, key);
      return weaponTalentRaiseCost(current, kat);
    }
    if (kind === 'mr') {
      const mod = (char.derivedMods && Number(char.derivedMods.MR)) || 0;
      const baseMR = char.attributes
        ? Math.round(((char.attributes.MU || 0) + (char.attributes.KL || 0) + (char.attributes.KO || 0)) / 5)
        : 0;
      return magicResistanceRaiseCost(baseMR + mod + 1);
    }
  } catch (e) {
    return null;
  }
  return null;
}

const round = (n) => Math.round(n);

function computeDerived(a, mods = {}) {
  // Coerce each attribute defensively so empty-string values during editing don't break math.
  const n = (v) => Number(v) || 0;
  const MU = n(a.MU), KL = n(a.KL), IN = n(a.IN), CH = n(a.CH);
  const FF = n(a.FF), GE = n(a.GE), KO = n(a.KO), KK = n(a.KK);
  return {
    LeP: round((KO + KO + KK) / 2) + (Number(mods.LeP) || 0),
    AuP: round((MU + KO + GE) / 2) + (Number(mods.AuP) || 0),
    AsP: round((MU + IN + CH) / 2) + (Number(mods.AsP) || 0),
    KaP: round((MU + IN + CH) / 2) + (Number(mods.KaP) || 0),
    MR: round((MU + KL + KO) / 5) + (Number(mods.MR) || 0),
    INI: round((MU + MU + IN + GE) / 5) + (Number(mods.INI) || 0),
    AT: round((MU + GE + KK) / 5),
    PA: round((IN + GE + KK) / 5),
    FK: round((IN + FF + KK) / 5),
  };
}

function newCharacter(name = 'Neuer Held', ownerName = '') {
  return {
    id: 'char_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    name,
    ownerName,
    basics: {
      rasse: '', kultur: '', profession: '', titel: '',
      geschlecht: '', alter: '', groesse: '', gewicht: '',
      augen: '', haare: '', sozialstatus: '', geburtstag: '', geburtsort: '',
      aussehen: '',
    },
    attributes: { MU: 10, KL: 10, IN: 10, CH: 10, FF: 10, GE: 10, KO: 10, KK: 10 },
    derivedMods: { LeP: 0, AuP: 0, AsP: 0, KaP: 0, MR: 0, INI: 0 },
    GS: 8,
    isMagical: false,
    isBlessed: false,
    currentValues: { LeP: '', AuP: '', AsP: '', KaP: '' },
    talents: DEFAULT_TALENTS.map(([cat, name, probe], i) => ({
      id: 't_' + i, category: cat, name, probe, taw: 0,
    })),
    weapons: [],
    spells: [],
    sonderfertigkeiten: [],
    inventory: '',
    money: { D: 0, S: 0, H: 0, K: 0 },
    ap: { total: 0, spent: 0 },
    notes: '',
    lastModified: Date.now(),
  };
}

function newGroup(name = 'Neue Gruppe', createdBy = '') {
  return {
    id: 'grp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    name,
    description: '',
    characterIds: [],
    createdBy,
    lastModified: Date.now(),
  };
}

function newAdventure(name = 'Neues Abenteuer', createdBy = '') {
  return {
    id: 'adv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    name,
    description: '',
    groupIds: [],
    completed: false,
    createdBy,
    lastModified: Date.now(),
  };
}

// ───────────────────────────────────────────────────────────────
// Storage layer
// ───────────────────────────────────────────────────────────────
async function loadAll() {
  try {
    const list = await window.storage.list('char_', true);
    if (!list || !list.keys) return [];
    const chars = [];
    for (const k of list.keys) {
      try {
        const r = await window.storage.get(k, true);
        if (r && r.value) chars.push(JSON.parse(r.value));
      } catch (e) {}
    }
    chars.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
    return chars;
  } catch (e) { return []; }
}
async function saveChar(c) {
  c.lastModified = Date.now();
  try {
    await window.storage.set('char_' + c.id, JSON.stringify(c), true);
  } catch (e) {
    console.error('saveChar failed:', e);
    throw e;
  }
}
async function deleteChar(id) {
  try { await window.storage.delete('char_' + id, true); } catch (e) {}
}

async function loadAllGroups() {
  try {
    const list = await window.storage.list('group_', true);
    if (!list || !list.keys) return [];
    const groups = [];
    for (const k of list.keys) {
      try {
        const r = await window.storage.get(k, true);
        if (r && r.value) groups.push(JSON.parse(r.value));
      } catch (e) {}
    }
    groups.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
    return groups;
  } catch (e) { return []; }
}
async function saveGroup(g) {
  g.lastModified = Date.now();
  try {
    await window.storage.set('group_' + g.id, JSON.stringify(g), true);
  } catch (e) {
    console.error('saveGroup failed:', e);
    throw e;
  }
}
async function deleteGroup(id) {
  try { await window.storage.delete('group_' + id, true); } catch (e) {}
}

async function loadAllAdventures() {
  try {
    const list = await window.storage.list('adv_', true);
    if (!list || !list.keys) return [];
    const advs = [];
    for (const k of list.keys) {
      try {
        const r = await window.storage.get(k, true);
        if (r && r.value) advs.push(JSON.parse(r.value));
      } catch (e) {}
    }
    advs.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
    return advs;
  } catch (e) { return []; }
}
async function saveAdventure(a) {
  a.lastModified = Date.now();
  try {
    await window.storage.set('adv_' + a.id, JSON.stringify(a), true);
  } catch (e) {
    console.error('saveAdventure failed:', e);
    throw e;
  }
}
async function deleteAdventure(id) {
  try { await window.storage.delete('adv_' + id, true); } catch (e) {}
}

// ───────────────────────────────────────────────────────────────
// Accounts & session storage
// ───────────────────────────────────────────────────────────────
// Accounts live in SHARED storage so anyone using the artifact sees the same list.
// Session lives in PERSONAL storage so each device stays logged in independently.
// NOTE: passwords are stored as plain text. This is an honor-system login for a
// trusted gaming group — the underlying storage is readable by anyone with the
// artifact link anyway, so encryption would be theater. Don't reuse real passwords.

async function listAccounts() {
  try {
    const list = await window.storage.list('account_', true);
    if (!list || !list.keys) return [];
    const accs = [];
    for (const k of list.keys) {
      try {
        const r = await window.storage.get(k, true);
        if (r && r.value) accs.push(JSON.parse(r.value));
      } catch (e) {}
    }
    return accs;
  } catch (e) {
    console.error('listAccounts failed:', e);
    return [];
  }
}

async function loadAccount(username) {
  try {
    const r = await window.storage.get('account_' + username.toLowerCase(), true);
    return r && r.value ? JSON.parse(r.value) : null;
  } catch (e) {
    return null;
  }
}

async function saveAccount(acc) {
  const key = 'account_' + acc.username.toLowerCase();
  const value = JSON.stringify(acc);
  console.log('saveAccount: key=', key, 'value length=', value.length);
  try {
    const res = await window.storage.set(key, value, true);
    console.log('saveAccount: success, response=', res);
    return res;
  } catch (e) {
    console.error('saveAccount failed:', e);
    throw new Error('Konto konnte nicht gespeichert werden: ' + (e && e.message ? e.message : String(e)));
  }
}

async function loadSession() {
  try {
    const r = await window.storage.get('session', false);
    return r && r.value ? JSON.parse(r.value) : null;
  } catch (e) { return null; }
}

async function saveSession(s) {
  try { await window.storage.set('session', JSON.stringify(s), false); } catch (e) { console.error('saveSession failed:', e); }
}

async function clearSession() {
  try { await window.storage.delete('session', false); } catch (e) {}
}

// ───────────────────────────────────────────────────────────────
// Reusable bits
// ───────────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, type = 'text', className = '', wide = false }) => (
  <label className={`block ${wide ? 'col-span-2' : ''} ${className}`}>
    <span className="smallcaps text-[10px] block mb-1" style={{ color: 'var(--olive)' }}>{label}</span>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
      className="ink-input font-body w-full px-1 py-1"
    />
  </label>
);

const SectionTitle = ({ children }) => (
  <h2 className="section-title smallcaps text-sm" style={{ color: 'var(--red)' }}>
    <span className="diamond" />
    <span className="px-1">{children}</span>
    <span className="diamond" />
  </h2>
);

const Stat = ({ label, value, accent = false }) => (
  <div className={`${accent ? 'stat-accent' : 'stat-frame'} p-2 text-center`}>
    <div className="smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>{label}</div>
    <div className="font-display text-2xl leading-tight mt-0.5" style={{ color: 'var(--navy)' }}>{value}</div>
  </div>
);

// ───────────────────────────────────────────────────────────────
// Rasse silhouettes
// ───────────────────────────────────────────────────────────────
const ElfSilhouette = ({ fill = 'currentColor', accent }) => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style={{display: "block"}}>
    <g fill={fill}>
      {/* Dramatic flowing hair: huge sweep back and down to the left, tapered to a point */}
      <path d="M212 95 Q174 88 132 110 Q88 132 64 185 Q44 250 56 320 Q70 390 96 440 Q112 462 130 470 Q126 440 124 405 Q126 350 142 280 Q162 195 196 125 Q206 108 212 95 Z" />
      {/* Robe — slim torso flaring to a wide hem */}
      <path d="M186 138 Q176 178 168 240 Q158 310 150 384 Q140 462 130 522 L270 522 Q260 462 250 384 Q240 310 232 240 Q224 178 214 138 Q210 152 200 152 Q190 152 186 138 Z" />
      {/* Head */}
      <ellipse cx="212" cy="112" rx="14" ry="19" />
      {/* Pointed elf ear sweeping up */}
      <path d="M224 106 L242 78 L232 118 Z" />
      {/* Hair fringe falling across forehead */}
      <path d="M198 100 Q210 88 228 90 Q232 102 224 114 Q214 102 198 108 Z" />
      {/* Neck */}
      <rect x="206" y="129" width="14" height="12" />
    </g>
    {/* Staff — tall and slim on the right */}
    <rect x="296" y="44" width="6" height="496" fill={fill} />
    {/* Staff cap: sharp crystal */}
    {accent && <path d="M299 14 L316 44 L299 74 L282 44 Z" fill={accent} />}
    {accent && <circle cx="299" cy="44" r="4" fill={fill} />}
    {/* Circlet accent on forehead */}
    {accent && <path d="M196 120 Q212 113 230 120 L230 125 Q212 118 196 125 Z" fill={accent} />}
  </svg>
);

const ZwergSilhouette = ({ fill = 'currentColor', accent }) => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style={{display: "block"}}>
    <g fill={fill}>
      {/* Legs — planted broad stance */}
      <path d="M158 398 L158 478 L198 478 L200 398 Z" />
      <path d="M200 398 L202 478 L242 478 L242 398 Z" />
      {/* Heavy boots with plate caps */}
      <path d="M146 462 L146 514 L208 514 L208 462 Z" />
      <path d="M192 462 L192 514 L254 514 L254 462 Z" />
      <rect x="146" y="476" width="62" height="5" />
      <rect x="192" y="476" width="62" height="5" />
      {/* Stout chest armor */}
      <path d="M148 250 Q137 295 137 345 Q137 385 145 418 L255 418 Q263 385 263 345 Q263 295 252 250 Z" />
      {/* Rounded pauldrons */}
      <ellipse cx="146" cy="252" rx="22" ry="16" />
      <ellipse cx="254" cy="252" rx="22" ry="16" />
      {/* Belt with hanging tassets */}
      <rect x="138" y="375" width="124" height="18" />
      <path d="M150 393 L162 393 L160 414 L148 414 Z" />
      <path d="M180 393 L195 393 L193 418 L178 418 Z" />
      <path d="M205 393 L220 393 L222 418 L207 418 Z" />
      <path d="M238 393 L250 393 L252 414 L240 414 Z" />
      {/* Neck */}
      <rect x="188" y="222" width="24" height="22" />
      {/* Helmet — bucket */}
      <path d="M168 168 Q166 130 200 122 Q234 130 232 168 L232 218 Q226 234 200 234 Q174 234 168 218 Z" />
      {/* Helmet tall crest fin */}
      <path d="M190 122 L210 122 L213 86 Q200 74 187 86 Z" />
      {/* Two great swept horns */}
      <path d="M168 178 Q138 158 116 122 Q120 108 134 114 Q158 148 180 198 Z" />
      <path d="M232 178 Q262 158 284 122 Q280 108 266 114 Q242 148 220 198 Z" />
      {/* Massive forked beard — two main braids */}
      <path d="M168 215 Q144 250 136 302 Q134 348 146 382 Q158 408 174 412 Q182 384 186 352 Q190 384 196 414 Q200 420 200 414 Q200 420 204 414 Q210 384 214 352 Q218 384 226 412 Q242 408 254 382 Q266 348 264 302 Q256 250 232 215 Z" />
      {/* Mustache flared upward */}
      <path d="M170 210 Q188 224 200 220 Q212 224 230 210 Q220 230 200 230 Q180 230 170 210 Z" />
    </g>
    {/* Axe haft — thick diagonal across the body */}
    <line x1="158" y1="322" x2="332" y2="98" stroke={fill} strokeWidth="11" strokeLinecap="round" />
    {/* Lower hand gripping haft */}
    <circle cx="172" cy="306" r="13" fill={fill} />
    {/* Upper hand gripping haft */}
    <circle cx="252" cy="208" r="13" fill={fill} />
    {/* Axe head — massive crescent blade upper-right */}
    <path d="M310 130 Q344 88 362 44 Q378 76 376 120 Q362 162 320 170 Q302 162 310 130 Z" fill={fill} />
    <path d="M310 130 Q286 110 276 72 Q298 90 322 132 Z" fill={fill} />
    {/* Axe pommel/spike at base of haft */}
    <path d="M152 326 L168 322 L162 348 Z" fill={fill} />
    {/* Belt buckle accent */}
    {accent && <rect x="192" y="378" width="16" height="14" fill={accent} />}
    {/* Helmet crest accent */}
    {accent && <rect x="195" y="125" width="10" height="6" fill={accent} />}
  </svg>
);

const MenschSilhouette = ({ fill = 'currentColor', accent }) => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style={{display: "block"}}>
    <g fill={fill}>
      {/* Long flowing cape billowing back to the right */}
      <path d="M198 178 Q240 200 290 280 Q335 360 354 466 Q360 510 332 518 L242 518 Q236 450 224 372 Q214 282 198 192 Z" />
      {/* Smaller cape side on the left for balance */}
      <path d="M204 178 Q176 198 148 248 Q108 318 96 408 Q92 470 114 480 L160 480 Q156 428 168 364 Q182 282 206 198 Z" />
      {/* Legs — heroic stance */}
      <path d="M180 380 Q178 422 180 480 L200 480 Q202 422 202 380 Z" />
      <path d="M198 380 Q198 422 200 480 L220 480 Q222 422 220 380 Z" />
      {/* Greaves */}
      <path d="M170 462 L170 510 L208 510 L208 462 Z" />
      <path d="M192 462 L192 510 L230 510 L230 462 Z" />
      {/* Body / breastplate — tall hourglass */}
      <path d="M170 218 Q162 260 165 305 Q170 348 178 385 L222 385 Q230 348 235 305 Q238 260 230 218 Z" />
      {/* Sculpted abdomen line */}
      <path d="M186 340 L214 340 L214 346 L186 346 Z" />
      {/* Spiked pauldrons */}
      <path d="M148 212 Q150 184 175 175 Q190 178 192 215 Q188 232 170 232 Q152 230 148 212 Z" />
      <path d="M252 212 Q250 184 225 175 Q210 178 208 215 Q212 232 230 232 Q248 230 252 212 Z" />
      {/* Pauldron outward spikes */}
      <path d="M148 212 L120 188 L142 216 Z" />
      <path d="M252 212 L280 188 L258 216 Z" />
      {/* Belt */}
      <rect x="174" y="350" width="52" height="12" />
      {/* Neck */}
      <rect x="192" y="148" width="16" height="22" />
      {/* Helmet — ornate visor */}
      <path d="M178 108 Q175 76 200 70 Q225 76 222 108 L222 144 Q218 158 200 158 Q182 158 178 144 Z" />
      {/* Helmet brow band */}
      <path d="M178 108 Q200 96 222 108 L222 118 L178 118 Z" />
      {/* Eye slit */}
      <rect x="184" y="125" width="32" height="4" />
      {/* Helmet plume — feathered tail sweeping back-left */}
      <path d="M210 70 Q232 46 252 14 Q262 36 254 60 Q236 76 215 80 Z" />
      <path d="M212 80 Q242 62 278 24 Q286 48 270 72 Q246 86 218 88 Z" />
      <path d="M216 90 Q250 80 295 50 Q296 76 278 92 Q252 100 222 96 Z" />
      <path d="M220 100 Q252 96 295 80 Q288 102 268 110 Q244 112 224 106 Z" />
    </g>
    {/* Both arms gripping sword pommel low in front */}
    <path d="M172 232 Q168 282 190 306 Q198 314 200 318" stroke={fill} strokeWidth="15" fill="none" strokeLinecap="round" />
    <path d="M228 232 Q232 282 210 306 Q202 314 200 318" stroke={fill} strokeWidth="15" fill="none" strokeLinecap="round" />
    {/* Sword pommel */}
    <circle cx="200" cy="320" r="10" fill={fill} />
    {/* Sword grip */}
    <rect x="193" y="328" width="14" height="34" fill={fill} />
    {/* Wide crossguard with curved tips */}
    <path d="M168 358 Q168 354 174 354 L226 354 Q232 354 232 358 L232 366 Q232 370 226 370 L174 370 Q168 370 168 366 Z" fill={fill} />
    {/* Crossguard outer flares */}
    <path d="M168 360 L156 354 L158 370 Z" fill={fill} />
    <path d="M232 360 L244 354 L242 370 Z" fill={fill} />
    {/* Long sword blade pointed down between the feet */}
    <path d="M193 370 L207 370 L209 520 L200 540 L191 520 Z" fill={fill} />
    {/* Heraldic emblem on breastplate */}
    {accent && <path d="M192 268 L208 268 L212 295 L200 314 L188 295 Z" fill={accent} />}
    {/* Plume root accent */}
    {accent && <circle cx="212" cy="78" r="4" fill={accent} />}
  </svg>
);

function resolveRasse(rasse) {
  if (!rasse) return null;
  const r = rasse.toLowerCase();
  if (r.includes('elf')) return 'elf';
  if (r.includes('zwerg')) return 'zwerg';
  if (r.includes('mensch') || r.includes('thorwal') || r.includes('mittellän') ||
      r.includes('aranier') || r.includes('horasier') || r.includes('tulamid') ||
      r.includes('nivese') || r.includes('norbarde') || r.includes('svellte') ||
      r.includes('andergaster') || r.includes('nordländer')) return 'mensch';
  return null;
}

const SILHOUETTES = { elf: ElfSilhouette, zwerg: ZwergSilhouette, mensch: MenschSilhouette };

function RasseSilhouette({ rasse, fill, accent, className, style }) {
  const key = resolveRasse(rasse);
  if (!key) return null;
  const Cmp = SILHOUETTES[key];
  return (
    <div className={className} style={{ ...style, lineHeight: 0 }}>
      <Cmp fill={fill} accent={accent} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Stammdaten
// ───────────────────────────────────────────────────────────────
function StammdatenSection({ char, update, session, groups = [] }) {
  const b = char.basics;
  const setB = (k, v) => update({ ...char, basics: { ...b, [k]: v } });
  const isMeister = session && session.role === 'meister';
  const memberOf = groups.filter((g) => (g.characterIds || []).includes(char.id));
  return (
    <div className="space-y-3">
      <SectionTitle>Stammdaten</SectionTitle>

      {memberOf.length > 0 && (
        <div className="card p-2 flex items-center gap-2 flex-wrap">
          <span className="smallcaps text-[10px]" style={{ color: 'var(--olive)' }}>Gruppen</span>
          {memberOf.map((g) => (
            <span key={g.id} className="smallcaps text-[10px] px-2 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(126,188,230,0.30)', color: 'var(--navy)', border: '1px solid rgba(41,51,92,0.20)' }}>
              {g.name || 'Unbenannt'}
            </span>
          ))}
        </div>
      )}

      <div className="card p-2 flex items-center gap-3">
        <span className="smallcaps text-[10px]" style={{ color: 'var(--olive)' }}>Besitzer</span>
        {isMeister ? (
          <input
            value={char.ownerName || ''}
            onChange={(e) => update({ ...char, ownerName: e.target.value })}
            placeholder="herrenlos"
            className="ink-input font-body flex-1 px-1 py-0.5 text-sm" />
        ) : (
          <span className="font-body text-sm" style={{ color: 'var(--navy)' }}>{char.ownerName || '—'}</span>
        )}
      </div>

      <Field label="Name" value={char.name} onChange={(v) => update({ ...char, name: v })} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <Field label="Rasse" value={b.rasse} onChange={(v) => setB('rasse', v)} />
        <Field label="Kultur" value={b.kultur} onChange={(v) => setB('kultur', v)} />
        <Field label="Profession" value={b.profession} onChange={(v) => setB('profession', v)} wide />
        <Field label="Titel / Beiname" value={b.titel} onChange={(v) => setB('titel', v)} wide />
        <Field label="Geschlecht" value={b.geschlecht} onChange={(v) => setB('geschlecht', v)} />
        <Field label="Alter" value={b.alter} onChange={(v) => setB('alter', v)} />
        <Field label="Größe" value={b.groesse} onChange={(v) => setB('groesse', v)} />
        <Field label="Gewicht" value={b.gewicht} onChange={(v) => setB('gewicht', v)} />
        <Field label="Augen" value={b.augen} onChange={(v) => setB('augen', v)} />
        <Field label="Haare" value={b.haare} onChange={(v) => setB('haare', v)} />
        <Field label="Sozialstatus" value={b.sozialstatus} onChange={(v) => setB('sozialstatus', v)} />
        <Field label="Geburtstag" value={b.geburtstag} onChange={(v) => setB('geburtstag', v)} />
        <Field label="Geburtsort" value={b.geburtsort} onChange={(v) => setB('geburtsort', v)} wide />
      </div>
      <label className="block">
        <span className="smallcaps text-[10px] block mb-1" style={{ color: 'var(--olive)' }}>Aussehen / Beschreibung</span>
        <textarea
          value={b.aussehen}
          onChange={(e) => setB('aussehen', e.target.value)}
          rows={3}
          className="ink-input font-body w-full px-1 py-1 resize-none"
        />
      </label>

      <div className="pt-2 grid grid-cols-3 gap-3 items-end">
        <label className="flex items-center gap-2 col-span-3 sm:col-span-1">
          <input type="checkbox" checked={char.isMagical} onChange={(e) => update({ ...char, isMagical: e.target.checked })} />
          <span className="font-body">Zauberkundig</span>
        </label>
        <label className="flex items-center gap-2 col-span-3 sm:col-span-1">
          <input type="checkbox" checked={char.isBlessed} onChange={(e) => update({ ...char, isBlessed: e.target.checked })} />
          <span className="font-body">Geweiht</span>
        </label>
        <Field label="GS" type="number" value={char.GS} onChange={(v) => update({ ...char, GS: v })} />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Eigenschaften + abgeleitete Werte
// ───────────────────────────────────────────────────────────────
function WerteSection({ char, update, steigern = false }) {
  const d = computeDerived(char.attributes, char.derivedMods);
  const setAttr = (k, v) => update({ ...char, attributes: { ...char.attributes, [k]: v === '' ? '' : Number(v) || 0 } });
  const setMod = (k, v) => update({ ...char, derivedMods: { ...char.derivedMods, [k]: v === '' ? '' : Number(v) || 0 } });
  const setCur = (k, v) => update({ ...char, currentValues: { ...char.currentValues, [k]: v } });
  const setAp = (k, v) => update({ ...char, ap: { ...char.ap, [k]: v === '' ? '' : Number(v) || 0 } });

  const onRaiseAttr = (k) => {
    try { update(raiseAttribute(char, k)); }
    catch (e) { alert(e.message); }
  };
  const onRaiseMR = () => {
    try { update(raiseMagicResistance(char)); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Eigenschaften</SectionTitle>
      <div className="grid grid-cols-4 gap-2">
        {ATTRIBUTES.map(([k, name]) => {
          const cost = previewRaiseCost(char, 'attribute', k);
          const affordable = cost != null && canAfford(char, cost);
          return (
            <div key={k} className="stat-frame p-2 text-center">
              <div className="smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>{k}</div>
              {steigern ? (
                <>
                  <div className="font-display text-2xl mt-0.5" style={{ color: 'var(--navy)' }}>
                    {char.attributes[k]}
                  </div>
                  <button
                    onClick={() => onRaiseAttr(k)}
                    disabled={!affordable}
                    title={cost != null ? `+1 für ${cost} AP` : 'Steigerung nicht möglich'}
                    className="btn-accent rounded smallcaps text-[9px] px-1 py-0.5 mt-0.5 w-full"
                    style={!affordable ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                    +1 · {cost ?? '?'} AP
                  </button>
                </>
              ) : (
                <input
                  type="number"
                  value={char.attributes[k]}
                  onChange={(e) => setAttr(k, e.target.value)}
                  className="ink-input font-display text-2xl w-full text-center mt-0.5"
                  style={{ color: 'var(--navy)' }}
                />
              )}
              <div className="font-body text-[10px] truncate mt-0.5" style={{ color: 'var(--olive)' }} title={name}>{name}</div>
            </div>
          );
        })}
      </div>

      <SectionTitle>Abgeleitete Werte</SectionTitle>
      <div className="card p-3 space-y-3">
        {[
          ['Lebensenergie', 'LeP', '(KO+KO+KK)÷2'],
          ['Ausdauer', 'AuP', '(MU+KO+GE)÷2'],
          char.isMagical && ['Astralenergie', 'AsP', '(MU+IN+CH)÷2'],
          char.isBlessed && ['Karmaenergie', 'KaP', '(MU+IN+CH)÷2'],
        ].filter(Boolean).map(([label, key, formula]) => (
          <div key={key} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-4">
              <div className="smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>{label}</div>
              <div className="font-body italic text-[10px]" style={{ color: 'var(--olive)' }}>{formula}</div>
            </div>
            <label className="col-span-3">
              <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Mod.</span>
              <input type="number" value={char.derivedMods[key]} onChange={(e) => setMod(key, e.target.value)}
                className="ink-input font-body w-full px-1 py-0.5 text-center" />
            </label>
            <div className="col-span-2 text-center">
              <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Max</span>
              <span className="font-display text-2xl" style={{ color: 'var(--navy)' }}>{d[key]}</span>
            </div>
            <label className="col-span-3">
              <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Aktuell</span>
              <input type="number" value={char.currentValues[key] ?? ''} placeholder={d[key]}
                onChange={(e) => setCur(key, e.target.value)}
                className="ink-input font-body w-full px-1 py-0.5 text-center" />
            </label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          ['MR', 'Magieresistenz', '(MU+KL+KO)÷5', true],
          ['INI', 'INI-Basis', '(MU+MU+IN+GE)÷5', true],
          ['AT', 'AT-Basis', '(MU+GE+KK)÷5', false],
          ['PA', 'PA-Basis', '(IN+GE+KK)÷5', false],
          ['FK', 'FK-Basis', '(IN+FF+KK)÷5', false],
        ].map(([key, label, formula, hasMod]) => {
          const mrCost = key === 'MR' ? previewRaiseCost(char, 'mr') : null;
          const mrAffordable = mrCost != null && canAfford(char, mrCost);
          return (
            <div key={key} className="card p-2">
              <div className="smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>{label}</div>
              <div className="font-body italic text-[9px]" style={{ color: 'var(--olive)' }}>{formula}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-display text-2xl flex-1" style={{ color: 'var(--navy)' }}>{d[key]}</span>
                {hasMod && !steigern && (
                  <input type="number" value={char.derivedMods[key]} onChange={(e) => setMod(key, e.target.value)}
                    className="ink-input font-body w-12 px-1 py-0.5 text-center text-sm" title="Modifikator" />
                )}
                {hasMod && steigern && key === 'MR' && (
                  <button
                    onClick={onRaiseMR}
                    disabled={!mrAffordable}
                    title={mrCost != null ? `+1 für ${mrCost} AP` : 'Steigerung nicht möglich'}
                    className="btn-accent rounded smallcaps text-[9px] px-1 py-0.5"
                    style={!mrAffordable ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                    +1 · {mrCost ?? '?'} AP
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SectionTitle>Abenteuerpunkte</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        <Field label="AP gesamt" type="number" value={char.ap.total} onChange={(v) => setAp('total', v)} />
        <Field label="AP ausgegeben" type="number" value={char.ap.spent} onChange={(v) => setAp('spent', v)} />
        <div className="stat-accent p-2 text-center">
          <div className="smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>Verfügbar</div>
          <div className="font-display text-2xl mt-0.5" style={{ color: 'var(--navy)' }}>{(char.ap.total || 0) - (char.ap.spent || 0)}</div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Talente
// ───────────────────────────────────────────────────────────────
function TalenteSection({ char, update, steigern = false }) {
  const [open, setOpen] = useState({ Körperlich: true, Gesellschaft: true, Natur: true, Wissen: true, Sprache: true, Handwerk: true, Eigene: true });
  const [kampfOpen, setKampfOpen] = useState({});
  const [newTalent, setNewTalent] = useState({ category: 'Eigene', name: '', probe: '' });

  const setWeaponTalent = (weaponName, field, value) => {
    const wt = char.weaponTalents || {};
    const entry = wt[weaponName] || {};
    const v = value === '' ? '' : Number(value) || 0;
    update({
      ...char,
      weaponTalents: { ...wt, [weaponName]: { ...entry, [field]: v } },
    });
  };

  const onRaiseTalent = (id) => {
    try { update(raiseTalent(char, id)); }
    catch (e) { alert(e.message); }
  };
  const onRaiseWeapon = (weaponName, field) => {
    try { update(raiseWeaponTalent(char, weaponName, field)); }
    catch (e) { alert(e.message); }
  };

  const grouped = useMemo(() => {
    const g = {};
    TALENT_CATEGORIES.forEach((c) => (g[c] = []));
    (char.talents || []).forEach((t) => { (g[t.category] ||= []).push(t); });
    return g;
  }, [char.talents]);

  const setTalent = (id, patch) => update({ ...char, talents: char.talents.map((t) => t.id === id ? { ...t, ...patch } : t) });
  const removeTalent = (id) => update({ ...char, talents: char.talents.filter((t) => t.id !== id) });
  const addTalent = () => {
    if (!newTalent.name.trim()) return;
    update({
      ...char,
      talents: [...char.talents, {
        id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        ...newTalent, taw: 0,
      }],
    });
    setNewTalent({ ...newTalent, name: '', probe: '' });
  };

  const renderProbe = (probe) => {
    const parts = probe.split('/');
    return parts.map((p, i) => (
      <span key={i} className="font-display text-[10px]" style={{ color: 'var(--navy)' }}>
        {p}<span style={{ color: 'var(--olive)' }} className="mx-0.5">{char.attributes[p] ?? '?'}</span>
        {i < parts.length - 1 && <span style={{ color: 'var(--olive)' }} className="opacity-50">/</span>}
      </span>
    ));
  };

  return (
    <div className="space-y-3">
      <SectionTitle>Talente</SectionTitle>
      {TALENT_CATEGORIES.map((cat) => (
        (grouped[cat] && grouped[cat].length > 0) && (
          <div key={cat} className="card">
            <button onClick={() => setOpen({ ...open, [cat]: !open[cat] })}
              className="w-full flex items-center justify-between px-3 py-2 smallcaps text-xs" style={{ color: 'var(--red)' }}>
              <span>{cat}</span>
              {open[cat] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {open[cat] && (
              <div className="px-2 pb-2 space-y-1">
                {grouped[cat].map((t) => {
                  const tCost = previewRaiseCost(char, 'talent', t.id);
                  const tAfford = tCost != null && canAfford(char, tCost);
                  return (
                  <div key={t.id} className="grid grid-cols-12 gap-2 items-center px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(248,232,196,0.5)' }}>
                    <input value={t.name} onChange={(e) => setTalent(t.id, { name: e.target.value })}
                      disabled={steigern}
                      className="ink-input font-body text-sm col-span-5 px-1 py-0.5" />
                    <div className="col-span-4 flex items-center gap-0.5 flex-wrap">
                      {renderProbe(t.probe)}
                    </div>
                    {steigern ? (
                      <div className="col-span-2 flex items-center justify-between gap-1">
                        <span className="font-display text-base" style={{ color: 'var(--navy)' }}>{t.taw}</span>
                        <button
                          onClick={() => onRaiseTalent(t.id)}
                          disabled={!tAfford}
                          title={tCost != null ? `+1 für ${tCost} AP` : 'Steigerung nicht möglich'}
                          className="btn-accent rounded smallcaps text-[9px] px-1 py-0.5"
                          style={!tAfford ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                          +{tCost ?? '?'}
                        </button>
                      </div>
                    ) : (
                      <input type="number" value={t.taw} onChange={(e) => setTalent(t.id, { taw: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
                        className="ink-input font-display text-base col-span-2 px-1 py-0.5 text-center"
                        style={{ color: 'var(--navy)' }} />
                    )}
                    {!steigern ? (
                      <button onClick={() => removeTalent(t.id)} className="col-span-1 transition" style={{ color: 'var(--olive)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--navy)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--olive)'}>
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    ) : <div className="col-span-1" />}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      ))}

      <div className="border-2 border-dashed rounded p-3" style={{ borderColor: 'rgba(41,51,92,0.25)' }}>
        <div className="smallcaps text-[10px] mb-2" style={{ color: 'var(--olive)' }}>Talent hinzufügen</div>
        <div className="grid grid-cols-12 gap-2">
          <select value={newTalent.category} onChange={(e) => setNewTalent({ ...newTalent, category: e.target.value })}
            className="ink-input font-body text-sm col-span-4 px-1 py-1">
            {TALENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Name" value={newTalent.name} onChange={(e) => setNewTalent({ ...newTalent, name: e.target.value })}
            className="ink-input font-body text-sm col-span-5 px-1 py-1" />
          <input placeholder="MU/KL/IN" value={newTalent.probe} onChange={(e) => setNewTalent({ ...newTalent, probe: e.target.value.toUpperCase() })}
            className="ink-input font-body text-sm col-span-2 px-1 py-1 uppercase" />
          <button onClick={addTalent} className="btn-accent col-span-1 rounded">
            <Plus className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Kampftalente — TaW per weapon type, split into AT and PA */}
      <SectionTitle>Kampftalente</SectionTitle>
      {[...new Set(WEAPON_TYPES.map((w) => w.category))].map((cat) => {
        const open = !!kampfOpen[cat];
        const weapons = WEAPON_TYPES.filter((w) => w.category === cat);
        return (
          <div key={cat} className="card">
            <button onClick={() => setKampfOpen({ ...kampfOpen, [cat]: !open })}
              className="w-full flex items-center justify-between px-3 py-2 smallcaps text-xs" style={{ color: 'var(--red)' }}>
              <span>{cat}</span>
              {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {open && (
              <div className="px-2 pb-2 space-y-1">
                <div className="grid grid-cols-12 gap-2 px-2 smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>
                  <span className="col-span-6">Waffentyp</span>
                  <span className="col-span-2 text-center">Typ</span>
                  <span className="col-span-2 text-center">AT</span>
                  <span className="col-span-2 text-center">PA</span>
                </div>
                {weapons.map((w) => {
                  const wt = (char.weaponTalents || {})[w.name] || {};
                  const atCost = previewRaiseCost(char, 'weaponAt', w.name);
                  const paCost = previewRaiseCost(char, 'weaponPa', w.name);
                  const atAfford = atCost != null && canAfford(char, atCost);
                  const paAfford = paCost != null && canAfford(char, paCost);
                  return (
                    <div key={w.name} className="grid grid-cols-12 gap-2 items-center px-2 py-1 rounded"
                      style={{ backgroundColor: 'rgba(248,232,196,0.5)' }}>
                      <span className="font-body text-sm col-span-6 truncate" style={{ color: 'var(--navy)' }}>{w.name}</span>
                      <span className="col-span-2 text-center smallcaps text-[10px]" style={{ color: 'var(--olive)' }}>
                        {w.type}
                      </span>
                      {steigern ? (
                        <div className="col-span-2 flex items-center justify-between gap-1">
                          <span className="font-display text-base" style={{ color: 'var(--navy)' }}>{wt.at ?? 0}</span>
                          <button
                            onClick={() => onRaiseWeapon(w.name, 'at')}
                            disabled={!atAfford}
                            title={atCost != null ? `+1 für ${atCost} AP` : ''}
                            className="btn-accent rounded smallcaps text-[9px] px-1 py-0.5"
                            style={!atAfford ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                            +{atCost ?? '?'}
                          </button>
                        </div>
                      ) : (
                        <input type="number"
                          value={wt.at ?? ''}
                          onChange={(e) => setWeaponTalent(w.name, 'at', e.target.value)}
                          className="ink-input font-display text-base col-span-2 px-1 py-0.5 text-center"
                          style={{ color: 'var(--navy)' }} />
                      )}
                      {w.type === 'NK' ? (
                        steigern ? (
                          <div className="col-span-2 flex items-center justify-between gap-1">
                            <span className="font-display text-base" style={{ color: 'var(--navy)' }}>{wt.pa ?? 0}</span>
                            <button
                              onClick={() => onRaiseWeapon(w.name, 'pa')}
                              disabled={!paAfford}
                              title={paCost != null ? `+1 für ${paCost} AP` : ''}
                              className="btn-accent rounded smallcaps text-[9px] px-1 py-0.5"
                              style={!paAfford ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                              +{paCost ?? '?'}
                            </button>
                          </div>
                        ) : (
                          <input type="number"
                            value={wt.pa ?? ''}
                            onChange={(e) => setWeaponTalent(w.name, 'pa', e.target.value)}
                            className="ink-input font-display text-base col-span-2 px-1 py-0.5 text-center"
                            style={{ color: 'var(--navy)' }} />
                        )
                      ) : (
                        <span className="col-span-2 text-center font-body italic text-xs" style={{ color: 'var(--olive)' }}>—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Kampf
// ───────────────────────────────────────────────────────────────
function KampfSection({ char, update }) {
  const d = computeDerived(char.attributes, char.derivedMods);
  const [newW, setNewW] = useState({ name: '', tp: '', type: 'NK' });
  const setW = (id, patch) => update({ ...char, weapons: char.weapons.map((w) => w.id === id ? { ...w, ...patch } : w) });
  const removeW = (id) => update({ ...char, weapons: char.weapons.filter((w) => w.id !== id) });
  const setPrimary = (id) => update({
    ...char,
    weapons: char.weapons.map((w) => ({ ...w, primary: w.id === id })),
  });
  const addW = () => {
    if (!newW.name.trim()) return;
    update({ ...char, weapons: [...char.weapons, { id: 'w_' + Date.now(), ...newW }] });
    setNewW({ name: '', tp: '', type: 'NK' });
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Kampfwerte</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="AT-Basis" value={d.AT} accent />
        <Stat label="PA-Basis" value={d.PA} accent />
        <Stat label="FK-Basis" value={d.FK} accent />
      </div>

      <div className="space-y-2">
        {char.weapons.map((w) => {
          const wt = (char.weaponTalents || {})[w.name] || {};
          const atTaw = Number(wt.at) || 0;
          const paTaw = Number(wt.pa) || 0;
          const at = (w.type === 'FK' ? d.FK : d.AT) + atTaw;
          const pa = w.type === 'FK' ? null : d.PA + paTaw;
          const known = WEAPON_TYPES.some((wt2) => wt2.name === w.name);
          return (
            <div key={w.id} className="card p-2 space-y-2"
              style={w.primary ? { borderLeft: '4px solid var(--navy)' } : {}}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={!!w.primary}
                  onChange={(e) => e.target.checked ? setPrimary(w.id) : setW(w.id, { primary: false })} />
                <span className="smallcaps text-[10px]"
                  style={{ color: w.primary ? 'var(--red)' : 'var(--olive)' }}>
                  {w.primary ? 'Primärwaffe' : 'als Primärwaffe markieren'}
                </span>
              </label>
              <div className="grid grid-cols-12 gap-2 items-center">
                <input value={w.name} onChange={(e) => setW(w.id, { name: e.target.value })}
                  className="ink-input font-body col-span-7 px-1 py-0.5" placeholder="Waffe" />
                <select value={w.type} onChange={(e) => setW(w.id, { type: e.target.value })}
                  className="ink-input font-body text-sm col-span-4 px-1 py-0.5">
                  <option value="NK">Nahkampf</option>
                  <option value="FK">Fernkampf</option>
                </select>
                <button onClick={() => removeW(w.id)} className="col-span-1" style={{ color: 'var(--olive)' }}>
                  <Trash2 className="w-3.5 h-3.5 mx-auto" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>TP</span>
                  <input value={w.tp} onChange={(e) => setW(w.id, { tp: e.target.value })}
                    className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" placeholder="1W+4" />
                </label>
                <div className="text-center">
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>{w.type === 'FK' ? 'FK' : 'AT'}</span>
                  <span className="font-display text-xl" style={{ color: 'var(--navy)' }}>{at}</span>
                  <span className="font-body italic text-[9px] block" style={{ color: 'var(--olive)' }}>
                    {w.type === 'FK' ? 'FK-Basis' : 'AT-Basis'} {w.type === 'FK' ? d.FK : d.AT}
                    {atTaw !== 0 && <span> · TaW {atTaw >= 0 ? '+' : ''}{atTaw}</span>}
                  </span>
                </div>
                <div className="text-center">
                  {w.type !== 'FK' ? (
                    <>
                      <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>PA</span>
                      <span className="font-display text-xl" style={{ color: 'var(--navy)' }}>{pa}</span>
                      <span className="font-body italic text-[9px] block" style={{ color: 'var(--olive)' }}>
                        PA-Basis {d.PA}
                        {paTaw !== 0 && <span> · TaW {paTaw >= 0 ? '+' : ''}{paTaw}</span>}
                      </span>
                    </>
                  ) : <span className="font-body italic text-xs" style={{ color: 'var(--olive)' }}>—</span>}
                </div>
              </div>
              {!known && (
                <div className="font-body italic text-[10px]" style={{ color: 'var(--olive)' }}>
                  Kein Kampftalent für „{w.name}" — TaW-Punkte unter Talente · Kampftalente werden nur für aufgelistete Waffentypen angewendet.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-2 border-dashed rounded p-3" style={{ borderColor: 'rgba(41,51,92,0.25)' }}>
        <div className="smallcaps text-[10px] mb-2" style={{ color: 'var(--olive)' }}>Waffe hinzufügen</div>
        <div className="space-y-2">
          <select
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              const wt = WEAPON_TYPES.find((w) => w.name === v);
              if (wt) setNewW({ name: wt.name, type: wt.type, tp: wt.tp });
            }}
            value=""
            className="ink-input font-body text-sm w-full px-1 py-1">
            <option value="">— Waffentyp wählen —</option>
            {[...new Set(WEAPON_TYPES.map((w) => w.category))].map((cat) => (
              <optgroup key={cat} label={cat}>
                {WEAPON_TYPES.filter((w) => w.category === cat).map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name} ({w.type} · {w.tp})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="grid grid-cols-12 gap-2">
            <input placeholder="Name" value={newW.name} onChange={(e) => setNewW({ ...newW, name: e.target.value })}
              className="ink-input font-body text-sm col-span-5 px-1 py-1" />
            <input placeholder="TP (1W+4)" value={newW.tp} onChange={(e) => setNewW({ ...newW, tp: e.target.value })}
              className="ink-input font-body text-sm col-span-3 px-1 py-1" />
            <select value={newW.type} onChange={(e) => setNewW({ ...newW, type: e.target.value })}
              className="ink-input font-body text-sm col-span-3 px-1 py-1">
              <option value="NK">Nahkampf</option>
              <option value="FK">Fernkampf</option>
            </select>
            <button onClick={addW} className="btn-accent col-span-1 rounded">
              <Plus className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Zauber
// ───────────────────────────────────────────────────────────────
function ZauberSection({ char, update, steigern = false }) {
  const [newS, setNewS] = useState({ name: '', probe: '', zfw: 0, kosten: '', rep: '' });
  const setS = (id, patch) => update({ ...char, spells: char.spells.map((s) => s.id === id ? { ...s, ...patch } : s) });
  const removeS = (id) => update({ ...char, spells: char.spells.filter((s) => s.id !== id) });
  const addS = () => {
    if (!newS.name.trim()) return;
    update({ ...char, spells: [...char.spells, { id: 's_' + Date.now(), ...newS }] });
    setNewS({ name: '', probe: '', zfw: 0, kosten: '', rep: '' });
  };
  const onRaiseSpell = (id) => {
    try { update(raiseSpell(char, id)); }
    catch (e) { alert(e.message); }
  };

  if (!char.isMagical) {
    return (
      <div className="space-y-4">
        <SectionTitle>Zauber</SectionTitle>
        <div className="text-center font-body italic py-8" style={{ color: 'var(--olive)' }}>
          Dieser Held ist nicht zauberkundig. Aktiviere „Zauberkundig" in den Stammdaten.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SectionTitle>Zauber</SectionTitle>
      {char.spells.length === 0 && (
        <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>Noch keine Zauber.</div>
      )}
      {char.spells.map((s) => {
        const sCost = previewRaiseCost(char, 'spell', s.id);
        const sAfford = sCost != null && canAfford(char, sCost);
        return (
        <div key={s.id} className="card p-2 space-y-2">
          <div className="flex items-center gap-2">
            <input value={s.name} onChange={(e) => setS(s.id, { name: e.target.value })}
              disabled={steigern}
              className="ink-input font-body flex-1 px-1 py-0.5" placeholder="Zauber" />
            {!steigern && (
              <button onClick={() => removeS(s.id)} style={{ color: 'var(--olive)' }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <label>
              <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Probe</span>
              <input value={s.probe} onChange={(e) => setS(s.id, { probe: e.target.value.toUpperCase() })}
                disabled={steigern}
                className="ink-input font-body w-full px-1 py-0.5 text-center text-sm uppercase" placeholder="MU/KL/IN" />
            </label>
            <label>
              <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>ZfW</span>
              {steigern ? (
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display text-base flex-1 text-center" style={{ color: 'var(--navy)' }}>{s.zfw}</span>
                  <button
                    onClick={() => onRaiseSpell(s.id)}
                    disabled={!sAfford}
                    title={sCost != null ? `+1 für ${sCost} AP` : ''}
                    className="btn-accent rounded smallcaps text-[9px] px-1 py-0.5"
                    style={!sAfford ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                    +{sCost ?? '?'}
                  </button>
                </div>
              ) : (
                <input type="number" value={s.zfw} onChange={(e) => setS(s.id, { zfw: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
                  className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" />
              )}
            </label>
            <label>
              <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Kosten</span>
              <input value={s.kosten} onChange={(e) => setS(s.id, { kosten: e.target.value })}
                disabled={steigern}
                className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" placeholder="7 AsP" />
            </label>
            <label>
              <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Repr.</span>
              <input value={s.rep} onChange={(e) => setS(s.id, { rep: e.target.value })}
                disabled={steigern}
                className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" placeholder="Mag" />
            </label>
          </div>
        </div>
        );
      })}

      <div className="border-2 border-dashed rounded p-3" style={{ borderColor: 'rgba(41,51,92,0.25)' }}>
        <div className="smallcaps text-[10px] mb-2" style={{ color: 'var(--olive)' }}>Zauber hinzufügen</div>
        <div className="space-y-2">
          <select
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              const st = SPELL_TYPES.find((s) => s.name === v);
              if (st) setNewS({
                name: st.name,
                probe: st.probe,
                zfw: 0,
                kosten: st.kosten,
                rep: st.repr,
                kategorie: st.kategorie,
              });
            }}
            value=""
            className="ink-input font-body text-sm w-full px-1 py-1">
            <option value="">— Zauber wählen —</option>
            {[...new Set(SPELL_TYPES.map((s) => s.repr))].map((rep) => (
              <optgroup key={rep} label={rep}>
                {SPELL_TYPES.filter((s) => s.repr === rep).map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.probe} · {s.kosten} AsP)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="grid grid-cols-12 gap-2">
            <input placeholder="Name" value={newS.name} onChange={(e) => setNewS({ ...newS, name: e.target.value })}
              className="ink-input font-body text-sm col-span-11 px-1 py-1" />
            <button onClick={addS} className="btn-accent col-span-1 rounded">
              <Plus className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Liturgien (only meaningful for geweihte Helden)
// ───────────────────────────────────────────────────────────────
function LiturgieSection({ char, update, steigern = false }) {
  const [newL, setNewL] = useState({ name: '', grad: 'I', kosten: '', gottheit: '', lkw: 0 });
  const setL = (id, patch) => update({ ...char, liturgies: (char.liturgies || []).map((l) => l.id === id ? { ...l, ...patch } : l) });
  const removeL = (id) => update({ ...char, liturgies: (char.liturgies || []).filter((l) => l.id !== id) });
  const addL = () => {
    if (!newL.name.trim()) return;
    update({ ...char, liturgies: [...(char.liturgies || []), { id: 'l_' + Date.now(), ...newL }] });
    setNewL({ name: '', grad: 'I', kosten: '', gottheit: '', lkw: 0 });
  };
  const onRaiseLiturgy = (id) => {
    try { update(raiseLiturgy(char, id)); }
    catch (e) { alert(e.message); }
  };

  if (!char.isBlessed) {
    return (
      <div className="space-y-4">
        <SectionTitle>Liturgien</SectionTitle>
        <div className="text-center font-body italic py-8" style={{ color: 'var(--olive)' }}>
          Dieser Held ist nicht geweiht. Aktiviere „Geweiht" auf dem Held-Reiter, um Liturgien zu führen.
        </div>
      </div>
    );
  }

  const liturgies = char.liturgies || [];

  return (
    <div className="space-y-4">
      <SectionTitle>Liturgien</SectionTitle>

      {liturgies.length === 0 ? (
        <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>
          Noch keine Liturgien. Wähle unten die erste aus.
        </div>
      ) : (
        liturgies.map((l) => {
          const lCost = previewRaiseCost(char, 'liturgy', l.id);
          const lAfford = lCost != null && canAfford(char, lCost);
          return (
          <div key={l.id} className="card p-2 space-y-2">
            <div className="flex items-center gap-2">
              <input value={l.name} onChange={(e) => setL(l.id, { name: e.target.value })}
                disabled={steigern}
                className="ink-input font-body flex-1 px-1 py-0.5" placeholder="Liturgie" />
              {!steigern && (
                <button onClick={() => removeL(l.id)} style={{ color: 'var(--olive)' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <label>
                <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Grad</span>
                <select value={l.grad} onChange={(e) => setL(l.id, { grad: e.target.value })}
                  disabled={steigern}
                  className="ink-input font-body w-full px-1 py-0.5 text-center text-sm">
                  {['I', 'II', 'III', 'IV', 'V', 'VI'].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <span className="smallcaps text-[8px] block text-center mt-0.5" style={{ color: 'var(--olive)' }}>
                  Kat. {liturgyKategorie(l)}
                </span>
              </label>
              <label>
                <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>LkW</span>
                {steigern ? (
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display text-base flex-1 text-center" style={{ color: 'var(--navy)' }}>{l.lkw ?? 0}</span>
                    <button
                      onClick={() => onRaiseLiturgy(l.id)}
                      disabled={!lAfford}
                      title={lCost != null ? `+1 für ${lCost} AP` : ''}
                      className="btn-accent rounded smallcaps text-[9px] px-1 py-0.5"
                      style={!lAfford ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                      +{lCost ?? '?'}
                    </button>
                  </div>
                ) : (
                  <input type="number" value={l.lkw ?? ''}
                    onChange={(e) => setL(l.id, { lkw: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
                    className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" />
                )}
              </label>
              <label>
                <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Kosten</span>
                <input value={l.kosten} onChange={(e) => setL(l.id, { kosten: e.target.value })}
                  disabled={steigern}
                  className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" placeholder="KaP" />
              </label>
              <label>
                <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Gottheit</span>
                <input value={l.gottheit} onChange={(e) => setL(l.id, { gottheit: e.target.value })}
                  disabled={steigern}
                  className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" placeholder="—" />
              </label>
            </div>
          </div>
          );
        })
      )}

      <div className="border-2 border-dashed rounded p-3" style={{ borderColor: 'rgba(41,51,92,0.25)' }}>
        <div className="smallcaps text-[10px] mb-2" style={{ color: 'var(--olive)' }}>Liturgie hinzufügen</div>
        <div className="space-y-2">
          <select
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              const lt = LITURGY_TYPES.find((l) => l.name === v);
              if (lt) setNewL({ name: lt.name, grad: lt.grad, kosten: '', gottheit: lt.gottheit, lkw: 0 });
            }}
            value=""
            className="ink-input font-body text-sm w-full px-1 py-1">
            <option value="">— Liturgie wählen —</option>
            {[...new Set(LITURGY_TYPES.map((l) => l.gottheit))].map((g) => (
              <optgroup key={g} label={g}>
                {LITURGY_TYPES.filter((l) => l.gottheit === g).map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.name} (Grad {l.grad})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="grid grid-cols-12 gap-2">
            <input placeholder="Name" value={newL.name} onChange={(e) => setNewL({ ...newL, name: e.target.value })}
              className="ink-input font-body text-sm col-span-11 px-1 py-1" />
            <button onClick={addL} className="btn-accent col-span-1 rounded">
              <Plus className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Vorteile (advantages) — GP-based, dropdown + cards
// ───────────────────────────────────────────────────────────────
function VorteileSection({ char, update, steigern = false }) {
  const [newV, setNewV] = useState({ name: '', gp: '', kategorie: 'Allgemein', wert: '', notes: '' });
  const advantages = char.advantages || [];
  const setV = (id, patch) => update({ ...char, advantages: advantages.map((v) => v.id === id ? { ...v, ...patch } : v) });
  const removeV = (id) => update({ ...char, advantages: advantages.filter((v) => v.id !== id) });
  const addV = () => {
    if (!newV.name.trim()) return;
    update({ ...char, advantages: [...advantages, { id: 'v_' + Date.now(), ...newV }] });
    setNewV({ name: '', gp: '', kategorie: 'Allgemein', wert: '', notes: '' });
  };
  // Steigern mode: buy the advantage for AP (1:1 with GP)
  const buyV = () => {
    if (!newV.name.trim()) return;
    try {
      update(buyAdvantage(char, newV));
      setNewV({ name: '', gp: '', kategorie: 'Allgemein', wert: '', notes: '' });
    } catch (e) { alert(e.message); }
  };

  // Total GP spent on advantages (for the summary line)
  const totalGp = advantages.reduce((sum, v) => sum + (Number(v.gp) || 0), 0);
  const addCost = Number(newV.gp) || 0;
  const addAffordable = canAfford(char, addCost);

  return (
    <div className="space-y-4">
      <SectionTitle>Vorteile</SectionTitle>

      {advantages.length === 0 ? (
        <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>
          Noch keine Vorteile. Wähle unten den ersten aus.
        </div>
      ) : (
        <>
          <div className="smallcaps text-[10px] text-right" style={{ color: 'var(--olive)' }}>
            Summe · <strong style={{ color: 'var(--navy)' }}>{totalGp}</strong> GP
          </div>
          {advantages.map((v) => (
            <div key={v.id} className="card p-2 space-y-2"
              style={v.paidAp ? { borderLeft: '4px solid var(--navy)' } : {}}>
              <div className="flex items-center gap-2">
                <input value={v.name} onChange={(e) => setV(v.id, { name: e.target.value })}
                  disabled={steigern}
                  className="ink-input font-body flex-1 px-1 py-0.5" placeholder="Vorteil" />
                {v.paidAp && (
                  <span className="smallcaps text-[9px]" style={{ color: 'var(--navy)' }} title="Mit AP gekauft">
                    AP
                  </span>
                )}
                {!steigern && (
                  <button onClick={() => removeV(v.id)} style={{ color: 'var(--olive)' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>GP</span>
                  <input type="number" value={v.gp ?? ''}
                    disabled={steigern}
                    onChange={(e) => setV(v.id, { gp: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
                    className="ink-input font-display text-base w-full px-1 py-0.5 text-center" style={{ color: 'var(--navy)' }} />
                </label>
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Stufe/Wert</span>
                  <input value={v.wert ?? ''} onChange={(e) => setV(v.id, { wert: e.target.value })}
                    disabled={steigern}
                    className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" placeholder="—" />
                </label>
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Kategorie</span>
                  <select value={v.kategorie || 'Allgemein'} onChange={(e) => setV(v.id, { kategorie: e.target.value })}
                    disabled={steigern}
                    className="ink-input font-body w-full px-1 py-0.5 text-center text-sm">
                    {['Allgemein', 'Kampf', 'Magisch', 'Karmal', 'Sozial'].map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </label>
              </div>
              <input value={v.notes ?? ''} onChange={(e) => setV(v.id, { notes: e.target.value })}
                disabled={steigern}
                className="ink-input font-body text-sm w-full px-1 py-0.5" placeholder="Anmerkung (optional)" />
            </div>
          ))}
        </>
      )}

      <div className="border-2 border-dashed rounded p-3" style={{ borderColor: 'rgba(41,51,92,0.25)' }}>
        <div className="smallcaps text-[10px] mb-2 flex items-center justify-between" style={{ color: 'var(--olive)' }}>
          <span>Vorteil hinzufügen</span>
          {steigern && (
            <span style={{ color: 'var(--navy)' }}>1 GP = 1 AP</span>
          )}
        </div>
        <div className="space-y-2">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              const vt = VORTEIL_TYPES.find((x) => x.name === val);
              if (vt) setNewV({ name: vt.name, gp: vt.gp, kategorie: vt.kategorie, wert: '', notes: '' });
            }}
            value=""
            className="ink-input font-body text-sm w-full px-1 py-1">
            <option value="">— Vorteil wählen —</option>
            {[...new Set(VORTEIL_TYPES.map((v) => v.kategorie))].map((kat) => (
              <optgroup key={kat} label={kat}>
                {VORTEIL_TYPES.filter((v) => v.kategorie === kat).map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.gp} GP{v.leveled ? ' / Stufe' : ''})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="grid grid-cols-12 gap-2 items-center">
            <input placeholder="Name" value={newV.name} onChange={(e) => setNewV({ ...newV, name: e.target.value })}
              className="ink-input font-body text-sm col-span-7 px-1 py-1" />
            <input type="number" placeholder="GP" value={newV.gp ?? ''}
              onChange={(e) => setNewV({ ...newV, gp: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
              className="ink-input font-body text-sm col-span-4 px-1 py-1 text-center" title="GP-Kosten" />
            {steigern ? (
              <button onClick={buyV} disabled={!addAffordable || addCost <= 0}
                title={addCost > 0 ? `Kaufen für ${addCost} AP` : 'GP-Kosten angeben'}
                className="btn-accent col-span-1 rounded"
                style={(!addAffordable || addCost <= 0) ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            ) : (
              <button onClick={addV} className="btn-accent col-span-1 rounded">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>
          {steigern && newV.name.trim() && (
            <div className="smallcaps text-[10px] text-center"
              style={{ color: addAffordable ? 'var(--navy)' : 'var(--red)' }}>
              Kosten · {addCost} AP{!addAffordable && ' — nicht genug AP'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Nachteile (disadvantages) — GP-based, dropdown + cards.
// In Steigern mode, taking one refunds AP at 1:1.
// ───────────────────────────────────────────────────────────────
function NachteileSection({ char, update, steigern = false }) {
  const [newN, setNewN] = useState({ name: '', gp: '', kategorie: 'Allgemein', wert: '', notes: '' });
  const disadvantages = char.disadvantages || [];
  const setN = (id, patch) => update({ ...char, disadvantages: disadvantages.map((n) => n.id === id ? { ...n, ...patch } : n) });
  const removeN = (id) => update({ ...char, disadvantages: disadvantages.filter((n) => n.id !== id) });
  const addN = () => {
    if (!newN.name.trim()) return;
    update({ ...char, disadvantages: [...disadvantages, { id: 'n_' + Date.now(), ...newN }] });
    setNewN({ name: '', gp: '', kategorie: 'Allgemein', wert: '', notes: '' });
  };
  // Steigern mode: taking the disadvantage refunds AP (1:1 with GP)
  const takeN = () => {
    if (!newN.name.trim()) return;
    try {
      update(takeDisadvantage(char, newN));
      setNewN({ name: '', gp: '', kategorie: 'Allgemein', wert: '', notes: '' });
    } catch (e) { alert(e.message); }
  };

  const totalGp = disadvantages.reduce((sum, n) => sum + (Number(n.gp) || 0), 0);
  const refund = Number(newN.gp) || 0;

  const NACHTEIL_KATEGORIEN = ['Allgemein', 'Kampf', 'Schwächen', 'Ängste', 'Magisch', 'Sozial'];

  return (
    <div className="space-y-4">
      <SectionTitle>Nachteile</SectionTitle>

      {disadvantages.length === 0 ? (
        <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>
          Noch keine Nachteile. Wähle unten den ersten aus.
        </div>
      ) : (
        <>
          <div className="smallcaps text-[10px] text-right" style={{ color: 'var(--olive)' }}>
            Summe · <strong style={{ color: 'var(--navy)' }}>{totalGp}</strong> GP
          </div>
          {disadvantages.map((n) => (
            <div key={n.id} className="card p-2 space-y-2"
              style={n.paidAp ? { borderLeft: '4px solid var(--red)' } : {}}>
              <div className="flex items-center gap-2">
                <input value={n.name} onChange={(e) => setN(n.id, { name: e.target.value })}
                  disabled={steigern}
                  className="ink-input font-body flex-1 px-1 py-0.5" placeholder="Nachteil" />
                {n.paidAp && (
                  <span className="smallcaps text-[9px]" style={{ color: 'var(--red)' }} title="Im Spiel genommen — AP gutgeschrieben">
                    AP
                  </span>
                )}
                {!steigern && (
                  <button onClick={() => removeN(n.id)} style={{ color: 'var(--olive)' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>GP</span>
                  <input type="number" value={n.gp ?? ''}
                    disabled={steigern}
                    onChange={(e) => setN(n.id, { gp: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
                    className="ink-input font-display text-base w-full px-1 py-0.5 text-center" style={{ color: 'var(--navy)' }} />
                </label>
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Stufe/Wert</span>
                  <input value={n.wert ?? ''} onChange={(e) => setN(n.id, { wert: e.target.value })}
                    disabled={steigern}
                    className="ink-input font-body w-full px-1 py-0.5 text-center text-sm" placeholder="—" />
                </label>
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Kategorie</span>
                  <select value={n.kategorie || 'Allgemein'} onChange={(e) => setN(n.id, { kategorie: e.target.value })}
                    disabled={steigern}
                    className="ink-input font-body w-full px-1 py-0.5 text-center text-sm">
                    {NACHTEIL_KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </label>
              </div>
              <input value={n.notes ?? ''} onChange={(e) => setN(n.id, { notes: e.target.value })}
                disabled={steigern}
                className="ink-input font-body text-sm w-full px-1 py-0.5" placeholder="Anmerkung (optional)" />
            </div>
          ))}
        </>
      )}

      <div className="border-2 border-dashed rounded p-3" style={{ borderColor: 'rgba(41,51,92,0.25)' }}>
        <div className="smallcaps text-[10px] mb-2 flex items-center justify-between" style={{ color: 'var(--olive)' }}>
          <span>Nachteil hinzufügen</span>
          {steigern && (
            <span style={{ color: 'var(--red)' }}>1 GP = +1 AP</span>
          )}
        </div>
        <div className="space-y-2">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              const nt = NACHTEIL_TYPES.find((x) => x.name === val);
              if (nt) setNewN({ name: nt.name, gp: nt.gp, kategorie: nt.kategorie, wert: '', notes: '' });
            }}
            value=""
            className="ink-input font-body text-sm w-full px-1 py-1">
            <option value="">— Nachteil wählen —</option>
            {[...new Set(NACHTEIL_TYPES.map((n) => n.kategorie))].map((kat) => (
              <optgroup key={kat} label={kat}>
                {NACHTEIL_TYPES.filter((n) => n.kategorie === kat).map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name} ({n.gp} GP{n.leveled ? ' / Stufe' : ''})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="grid grid-cols-12 gap-2 items-center">
            <input placeholder="Name" value={newN.name} onChange={(e) => setNewN({ ...newN, name: e.target.value })}
              className="ink-input font-body text-sm col-span-7 px-1 py-1" />
            <input type="number" placeholder="GP" value={newN.gp ?? ''}
              onChange={(e) => setNewN({ ...newN, gp: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
              className="ink-input font-body text-sm col-span-4 px-1 py-1 text-center" title="GP-Wert" />
            {steigern ? (
              <button onClick={takeN} disabled={refund <= 0}
                title={refund > 0 ? `Nehmen — ${refund} AP gutschreiben` : 'GP-Wert angeben'}
                className="btn-accent col-span-1 rounded"
                style={refund <= 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            ) : (
              <button onClick={addN} className="btn-accent col-span-1 rounded">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>
          {steigern && newN.name.trim() && (
            <div className="smallcaps text-[10px] text-center" style={{ color: 'var(--red)' }}>
              Gutschrift · +{refund} AP
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Sonderfertigkeiten — AP-cost based, dropdown + cards.
// In Steigern mode, learning one costs its AP value directly.
// ───────────────────────────────────────────────────────────────
function SonderfertigkeitenSection({ char, update, steigern = false }) {
  const [newSF, setNewSF] = useState({ name: '', ap: '', kategorie: 'Kampf', notes: '' });
  const abilities = char.specialAbilities || [];
  const setSF = (id, patch) => update({ ...char, specialAbilities: abilities.map((s) => s.id === id ? { ...s, ...patch } : s) });
  const removeSF = (id) => update({ ...char, specialAbilities: abilities.filter((s) => s.id !== id) });
  const addSF = () => {
    if (!newSF.name.trim()) return;
    update({ ...char, specialAbilities: [...abilities, { id: 'sf_' + Date.now(), ...newSF }] });
    setNewSF({ name: '', ap: '', kategorie: 'Kampf', notes: '' });
  };
  // Steigern mode: learn the SF for AP
  const learnSF = () => {
    if (!newSF.name.trim()) return;
    try {
      update(learnSpecialAbility(char, newSF));
      setNewSF({ name: '', ap: '', kategorie: 'Kampf', notes: '' });
    } catch (e) { alert(e.message); }
  };

  const totalAp = abilities.reduce((sum, s) => sum + (Number(s.ap) || 0), 0);
  const learnCost = Number(newSF.ap) || 0;
  const learnAffordable = canAfford(char, learnCost);

  const SF_KATEGORIEN = ['Kampf', 'Kampfstil', 'Magisch', 'Klerikal', 'Allgemein'];

  return (
    <div className="space-y-4">
      <SectionTitle>Sonderfertigkeiten</SectionTitle>

      {abilities.length === 0 ? (
        <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>
          Noch keine Sonderfertigkeiten. Wähle unten die erste aus.
        </div>
      ) : (
        <>
          <div className="smallcaps text-[10px] text-right" style={{ color: 'var(--olive)' }}>
            Summe · <strong style={{ color: 'var(--navy)' }}>{totalAp}</strong> AP
          </div>
          {abilities.map((s) => (
            <div key={s.id} className="card p-2 space-y-2"
              style={s.paidAp ? { borderLeft: '4px solid var(--navy)' } : {}}>
              <div className="flex items-center gap-2">
                <input value={s.name} onChange={(e) => setSF(s.id, { name: e.target.value })}
                  disabled={steigern}
                  className="ink-input font-body flex-1 px-1 py-0.5" placeholder="Sonderfertigkeit" />
                {s.paidAp && (
                  <span className="smallcaps text-[9px]" style={{ color: 'var(--navy)' }} title="Mit AP gelernt">
                    AP
                  </span>
                )}
                {!steigern && (
                  <button onClick={() => removeSF(s.id)} style={{ color: 'var(--olive)' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>AP-Kosten</span>
                  <input type="number" value={s.ap ?? ''}
                    disabled={steigern}
                    onChange={(e) => setSF(s.id, { ap: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
                    className="ink-input font-display text-base w-full px-1 py-0.5 text-center" style={{ color: 'var(--navy)' }} />
                </label>
                <label>
                  <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>Kategorie</span>
                  <select value={s.kategorie || 'Kampf'} onChange={(e) => setSF(s.id, { kategorie: e.target.value })}
                    disabled={steigern}
                    className="ink-input font-body w-full px-1 py-0.5 text-center text-sm">
                    {SF_KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </label>
              </div>
              <input value={s.notes ?? ''} onChange={(e) => setSF(s.id, { notes: e.target.value })}
                disabled={steigern}
                className="ink-input font-body text-sm w-full px-1 py-0.5" placeholder="Anmerkung (optional)" />
            </div>
          ))}
        </>
      )}

      <div className="border-2 border-dashed rounded p-3" style={{ borderColor: 'rgba(41,51,92,0.25)' }}>
        <div className="smallcaps text-[10px] mb-2 flex items-center justify-between" style={{ color: 'var(--olive)' }}>
          <span>Sonderfertigkeit hinzufügen</span>
          {steigern && <span style={{ color: 'var(--navy)' }}>kostet AP</span>}
        </div>
        <div className="space-y-2">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              const st = SF_TYPES.find((x) => x.name === val);
              if (st) setNewSF({ name: st.name, ap: st.ap, kategorie: st.kategorie, notes: '' });
            }}
            value=""
            className="ink-input font-body text-sm w-full px-1 py-1">
            <option value="">— Sonderfertigkeit wählen —</option>
            {[...new Set(SF_TYPES.map((s) => s.kategorie))].map((kat) => (
              <optgroup key={kat} label={kat}>
                {SF_TYPES.filter((s) => s.kategorie === kat).map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.ap} AP)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="grid grid-cols-12 gap-2 items-center">
            <input placeholder="Name" value={newSF.name} onChange={(e) => setNewSF({ ...newSF, name: e.target.value })}
              className="ink-input font-body text-sm col-span-7 px-1 py-1" />
            <input type="number" placeholder="AP" value={newSF.ap ?? ''}
              onChange={(e) => setNewSF({ ...newSF, ap: e.target.value === '' ? '' : Number(e.target.value) || 0 })}
              className="ink-input font-body text-sm col-span-4 px-1 py-1 text-center" title="AP-Kosten" />
            {steigern ? (
              <button onClick={learnSF} disabled={!learnAffordable || learnCost <= 0}
                title={learnCost > 0 ? `Lernen für ${learnCost} AP` : 'AP-Kosten angeben'}
                className="btn-accent col-span-1 rounded"
                style={(!learnAffordable || learnCost <= 0) ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            ) : (
              <button onClick={addSF} className="btn-accent col-span-1 rounded">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>
          {steigern && newSF.name.trim() && (
            <div className="smallcaps text-[10px] text-center"
              style={{ color: learnAffordable ? 'var(--navy)' : 'var(--red)' }}>
              Kosten · {learnCost} AP{!learnAffordable && ' — nicht genug AP'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Section: Inventar / Geld / SF / Notizen
// ───────────────────────────────────────────────────────────────
function InventarSection({ char, update }) {
  const setM = (k, v) => update({ ...char, money: { ...char.money, [k]: v === '' ? '' : Number(v) || 0 } });

  return (
    <div className="space-y-4">
      <SectionTitle>Geld</SectionTitle>
      <div className="grid grid-cols-4 gap-2">
        {[['D', 'Dukaten'], ['S', 'Silbertaler'], ['H', 'Heller'], ['K', 'Kreuzer']].map(([k, name]) => (
          <label key={k} className="stat-frame p-2 text-center block">
            <span className="smallcaps text-[9px] block" style={{ color: 'var(--olive)' }}>{name}</span>
            <input type="number" value={char.money[k]} onChange={(e) => setM(k, e.target.value)}
              className="ink-input font-display text-xl w-full text-center mt-0.5"
              style={{ color: 'var(--navy)' }} />
          </label>
        ))}
      </div>

      <SectionTitle>Ausrüstung</SectionTitle>
      <textarea value={char.inventory} onChange={(e) => update({ ...char, inventory: e.target.value })}
        rows={6} placeholder="Schwert, Lederrüstung, Reisetasche, Wasserschlauch …"
        className="ink-input font-body w-full px-2 py-1 resize-none" />

      <SectionTitle>Notizen</SectionTitle>
      <textarea value={char.notes} onChange={(e) => update({ ...char, notes: e.target.value })}
        rows={6} placeholder="Hintergrund, Verbündete, offene Plotfäden …"
        className="ink-input font-body w-full px-2 py-1 resize-none" />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Character view (tabbed)
// ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'held', label: 'Held', icon: User },
  { id: 'werte', label: 'Werte', icon: Dice5 },
  { id: 'talente', label: 'Talente', icon: Scroll },
  { id: 'kampf', label: 'Kampf', icon: Sword },
  { id: 'zauber', label: 'Zauber', icon: Sparkles },
  { id: 'liturgie', label: 'Liturgien', icon: Flame },
  { id: 'vorteile', label: 'Vorteile', icon: Star },
  { id: 'nachteile', label: 'Nachteile', icon: StarOff },
  { id: 'sf', label: 'Sonderf.', icon: Award },
  { id: 'invent', label: 'Habe', icon: Package },
];

function CharacterView({ char, update, onBack, savedAt, session, groups = [] }) {
  const [tab, setTab] = useState('held');
  const [steigern, setSteigern] = useState(false);
  const avail = availableAp(char);
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between px-3 py-2 sticky top-0 z-10 surface-sand"
        style={{ borderBottom: '1px solid rgba(41,51,92,0.20)' }}>
        <button onClick={onBack} className="flex items-center gap-1 font-body text-sm" style={{ color: 'var(--navy)' }}>
          <ChevronLeft className="w-4 h-4" /> Heldenliste
        </button>
        <div className="font-display truncate flex-1 text-center px-2" style={{ color: 'var(--red)' }}>{char.name || 'Unbenannt'}</div>
        <div className="w-24 text-right">
          {savedAt && (
            <span key={savedAt} className="saved-indicator inline-flex items-center gap-1 smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>
              <Save className="w-3 h-3" /> gespeichert
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid rgba(41,51,92,0.15)' }}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox"
            checked={steigern}
            onChange={(e) => setSteigern(e.target.checked)} />
          <span className="smallcaps text-[10px]"
            style={{ color: steigern ? 'var(--red)' : 'var(--olive)' }}>
            {steigern ? 'Steigern aktiv' : 'Steigern'}
          </span>
        </label>
        {steigern && (
          <span className="smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>
            Verfügbare AP · <strong>{avail}</strong>
          </span>
        )}
      </div>

      <div className="flex gap-0.5 overflow-x-auto px-2 py-2" style={{ borderBottom: '1px solid rgba(41,51,92,0.15)' }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-sm smallcaps text-[10px] transition ${active ? 'tab-active' : ''}`}
              style={!active ? { color: 'var(--navy)' } : {}}>
              <Icon className="w-4 h-4 mb-0.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {resolveRasse(char.basics.rasse) && (
        <div
          aria-hidden
          className="pointer-events-none"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -45%)',
            width: '440px',
            maxWidth: '85vw',
            maxHeight: '85vh',
            opacity: 0.12,
            zIndex: 0,
          }}>
          <RasseSilhouette rasse={char.basics.rasse} fill="var(--navy)" accent="var(--sky)" style={{ width: '100%', height: 'auto' }} />
        </div>
      )}
      <div className="p-4 relative" style={{ zIndex: 1 }}>
        {tab === 'held' && <StammdatenSection char={char} update={update} session={session} groups={groups} />}
        {tab === 'werte' && <WerteSection char={char} update={update} steigern={steigern} />}
        {tab === 'talente' && <TalenteSection char={char} update={update} steigern={steigern} />}
        {tab === 'kampf' && <KampfSection char={char} update={update} />}
        {tab === 'zauber' && <ZauberSection char={char} update={update} steigern={steigern} />}
        {tab === 'liturgie' && <LiturgieSection char={char} update={update} steigern={steigern} />}
        {tab === 'vorteile' && <VorteileSection char={char} update={update} steigern={steigern} />}
        {tab === 'nachteile' && <NachteileSection char={char} update={update} steigern={steigern} />}
        {tab === 'sf' && <SonderfertigkeitenSection char={char} update={update} steigern={steigern} />}
        {tab === 'invent' && <InventarSection char={char} update={update} />}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Heldengruppe view (Meister only)
// ───────────────────────────────────────────────────────────────
function GroupView({ group, allChars, adventures = [], update, onBack, onDelete, onOpenChar, onOpenAdventure, savedAt }) {
  const inGroup = (id) => (group.characterIds || []).includes(id);
  const toggleChar = (id) => {
    const newIds = inGroup(id)
      ? group.characterIds.filter((x) => x !== id)
      : [...(group.characterIds || []), id];
    update({ ...group, characterIds: newIds });
  };

  const members = allChars.filter((c) => inGroup(c.id));
  const nonMembers = allChars.filter((c) => !inGroup(c.id));

  const renderCharRow = (c, action) => {
    const d = computeDerived(c.attributes, c.derivedMods);
    return (
      <div key={c.id} className="card scroll-shadow flex items-stretch overflow-hidden">
        <div style={{ width: 6, backgroundColor: 'var(--navy)', flexShrink: 0 }} />
        <button onClick={() => onOpenChar(c.id)} className="flex-1 text-left p-3 min-w-0">
          <div className="font-display text-lg flex items-baseline gap-2 flex-wrap" style={{ color: 'var(--navy)' }}>
            <span className="truncate">{c.name || 'Unbenannt'}</span>
            {c.ownerName && (
              <span className="smallcaps text-[10px]" style={{ color: 'var(--olive)' }}>
                — {c.ownerName}
              </span>
            )}
          </div>
          <div className="font-body italic text-xs truncate" style={{ color: 'var(--olive)' }}>
            {[c.basics.rasse, c.basics.profession].filter(Boolean).join(' · ') || 'noch namenlos'}
          </div>
          <div className="smallcaps text-[10px] mt-1 flex gap-3 flex-wrap" style={{ color: 'var(--navy)' }}>
            <span>LeP <strong style={{ color: 'var(--navy)' }}>{d.LeP}</strong></span>
            <span>AT <strong style={{ color: 'var(--navy)' }}>{d.AT}</strong></span>
            <span>PA <strong style={{ color: 'var(--navy)' }}>{d.PA}</strong></span>
            {c.isMagical && <span>AsP <strong style={{ color: 'var(--navy)' }}>{d.AsP}</strong></span>}
          </div>
        </button>
        <div className="p-3 flex items-center flex-shrink-0">
          {action}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between px-3 py-2 sticky top-0 z-10 surface-sand"
        style={{ borderBottom: '1px solid rgba(41,51,92,0.20)' }}>
        <button onClick={onBack} className="flex items-center gap-1 font-body text-sm" style={{ color: 'var(--navy)' }}>
          <ChevronLeft className="w-4 h-4" /> Gruppen
        </button>
        <div className="font-display truncate flex-1 text-center px-2" style={{ color: 'var(--red)' }}>
          {group.name || 'Unbenannte Gruppe'}
        </div>
        <div className="w-24 text-right">
          {savedAt && (
            <span key={savedAt} className="saved-indicator inline-flex items-center gap-1 smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>
              <Save className="w-3 h-3" /> gespeichert
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Field label="Gruppenname" value={group.name} onChange={(v) => update({ ...group, name: v })} />

        <label className="block">
          <span className="smallcaps text-[10px] block mb-1" style={{ color: 'var(--olive)' }}>Beschreibung</span>
          <textarea
            value={group.description || ''}
            onChange={(e) => update({ ...group, description: e.target.value })}
            rows={3}
            placeholder="Kampagne, Treffpunkt, gemeinsame Ziele …"
            className="ink-input font-body w-full px-1 py-1 resize-none"
          />
        </label>

        <SectionTitle>Mitglieder ({members.length})</SectionTitle>
        {members.length === 0 ? (
          <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>
            Noch keine Mitglieder.
          </div>
        ) : (
          <div className="space-y-1">
            {members.map((c) => renderCharRow(c,
              <button onClick={() => toggleChar(c.id)} className="btn-accent rounded px-3 py-1 smallcaps text-[10px]">
                Entfernen
              </button>
            ))}
          </div>
        )}

        <SectionTitle>Held hinzufügen</SectionTitle>
        {nonMembers.length === 0 ? (
          <div className="text-center font-body italic py-2" style={{ color: 'var(--olive)' }}>
            Alle Helden sind bereits in dieser Gruppe.
          </div>
        ) : (
          <div className="space-y-1">
            {nonMembers.map((c) => renderCharRow(c,
              <button onClick={() => toggleChar(c.id)} className="btn-primary rounded px-3 py-1 smallcaps text-[10px]">
                <Plus className="w-3 h-3 inline mr-1" /> Hinzufügen
              </button>
            ))}
          </div>
        )}

        {(() => {
          // Adventures this Heldengruppe has been part of, sorted: open first, then completed
          const groupAdventures = (adventures || []).filter((a) => (a.groupIds || []).includes(group.id));
          groupAdventures.sort((a, b) => {
            if (!!a.completed === !!b.completed) return (b.lastModified || 0) - (a.lastModified || 0);
            return a.completed ? 1 : -1;
          });
          return (
            <>
              <SectionTitle>Abenteuer ({groupAdventures.length})</SectionTitle>
              {groupAdventures.length === 0 ? (
                <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>
                  Diese Gruppe hat noch an keinem Abenteuer teilgenommen.
                </div>
              ) : (
                <div className="space-y-2">
                  {groupAdventures.map((a) => {
                    const ap = Number(a.ap) || 0;
                    return (
                      <div key={a.id} className="card scroll-shadow flex items-stretch overflow-hidden">
                        <div style={{ width: 6, backgroundColor: a.completed ? 'var(--olive)' : 'var(--red)', flexShrink: 0 }} />
                        <button onClick={() => onOpenAdventure && onOpenAdventure(a.id)}
                          className="flex-1 text-left p-3 min-w-0">
                          <div className="font-display text-lg flex items-baseline gap-2 flex-wrap" style={{ color: 'var(--navy)' }}>
                            <span className="truncate">{a.name || 'Unbenannt'}</span>
                            {a.completed ? (
                              <span className="smallcaps text-[9px] px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: 'rgba(166,165,122,0.30)', color: 'var(--navy)', border: '1px solid rgba(41,51,92,0.20)' }}>
                                Abgeschlossen
                              </span>
                            ) : (
                              <span className="smallcaps text-[9px] px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: 'rgba(219,43,57,0.10)', color: 'var(--red)', border: '1px solid rgba(219,43,57,0.30)' }}>
                                Laufend
                              </span>
                            )}
                          </div>
                          {a.description && (
                            <div className="font-body italic text-xs truncate" style={{ color: 'var(--olive)' }}>{a.description}</div>
                          )}
                          {a.completed && ap > 0 && (
                            <div className="smallcaps text-[10px] mt-1" style={{ color: 'var(--navy)' }}>
                              AP vergeben · <strong>{ap}</strong>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}

      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// LocationsTable — dynamic list of places for the Reise tab
// ───────────────────────────────────────────────────────────────
const LOCATION_TYPES = ['Stadt', 'Dorf', 'Festung', 'Kloster', 'Andere'];

function LocationsTable({ adventure, update }) {
  const locations = adventure.reiseLocations || [];
  const setLocations = (next) => update({ ...adventure, reiseLocations: next });
  const addLocation = () => {
    setLocations([...locations, {
      id: 'loc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: '',
      type: 'Stadt',
    }]);
  };
  const updateLocation = (id, patch) => setLocations(locations.map((l) => l.id === id ? { ...l, ...patch } : l));
  const removeLocation = (id) => setLocations(locations.filter((l) => l.id !== id));

  return (
    <div className="space-y-2">
      <SectionTitle>Orte</SectionTitle>
      {locations.length === 0 ? (
        <div className="text-center font-body italic py-4 border-2 border-dashed rounded"
          style={{ borderColor: 'rgba(41,51,92,0.20)', color: 'var(--olive)' }}>
          Noch keine Orte. Füge unten den ersten hinzu.
        </div>
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-2 px-1 smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>
            <span className="col-span-7 pl-2">Name</span>
            <span className="col-span-4">Typ</span>
          </div>
          {locations.map((l) => (
            <div key={l.id} className="card grid grid-cols-12 gap-2 items-center px-2 py-1">
              <input
                value={l.name}
                onChange={(e) => updateLocation(l.id, { name: e.target.value })}
                placeholder="Ortsname"
                className="ink-input font-body text-sm col-span-7 px-1 py-0.5" />
              <select
                value={l.type}
                onChange={(e) => updateLocation(l.id, { type: e.target.value })}
                className="ink-input font-body text-sm col-span-4 px-1 py-0.5">
                {LOCATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={() => removeLocation(l.id)} className="col-span-1"
                title="Ort entfernen"
                style={{ color: 'var(--olive)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--olive)'}>
                <Trash2 className="w-3.5 h-3.5 mx-auto" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={addLocation}
        className="btn-accent rounded w-full smallcaps text-[10px] py-2 flex items-center justify-center gap-1">
        <Plus className="w-3 h-3" /> Ort hinzufügen
      </button>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Reisekarte — overview map for the Reise tab. Mixes heroes, NSCs
// and locations on a single snap grid.
// ───────────────────────────────────────────────────────────────

// SVG symbols per location type. ViewBox is 24×24 with stroke-aware sizing.
function LocationSymbol({ type, size }) {
  const stroke = 'var(--red)';
  const fill = 'var(--paper)';
  const sw = 2;
  const common = { width: size, height: size, viewBox: '0 0 24 24', style: { display: 'block' } };
  switch (type) {
    case 'Stadt':
      // City: building with three crenellations
      return (
        <svg {...common}>
          <path d="M3 20 L3 9 L7 9 L7 6 L11 6 L11 9 L15 9 L15 6 L19 6 L19 9 L21 9 L21 20 Z"
            fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
        </svg>
      );
    case 'Dorf':
      // Village: small house with peaked roof
      return (
        <svg {...common}>
          <path d="M4 20 L4 11 L12 4 L20 11 L20 20 Z"
            fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
        </svg>
      );
    case 'Festung':
      // Fortress: castle with battlements
      return (
        <svg {...common}>
          <path d="M3 21 L3 8 L6 8 L6 5 L9 5 L9 8 L12 8 L12 5 L15 5 L15 8 L18 8 L18 5 L21 5 L21 21 Z"
            fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
        </svg>
      );
    case 'Kloster':
      // Monastery: cross above a domed building
      return (
        <svg {...common}>
          <rect x="11" y="2" width="2" height="6" fill={stroke} />
          <rect x="9" y="4" width="6" height="2" fill={stroke} />
          <path d="M4 20 L4 14 Q4 8 12 8 Q20 8 20 14 L20 20 Z"
            fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
        </svg>
      );
    case 'Andere':
    default:
      // Other: simple diamond
      return (
        <svg {...common}>
          <path d="M12 3 L21 12 L12 21 L3 12 Z"
            fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
        </svg>
      );
  }
}

function ReisekarteGrid({ adventure, update, heroes, npcs }) {
  const gridRef = useRef(null);
  const [drag, setDrag] = useState(null);

  const initialsOf = (name) => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Build marker list. Stable ordering: heroes → NSCs → locations.
  const markers = useMemo(() => {
    const locs = adventure.reiseLocations || [];
    return [
      ...heroes.map((c) => ({ id: c.id, kind: 'held', name: c.name || 'Unbenannt', initials: initialsOf(c.name) })),
      ...npcs.map((n) => ({ id: n.id, kind: 'nsc', name: n.name || 'NSC', initials: initialsOf(n.name) })),
      ...locs.map((l) => ({ id: l.id, kind: 'ort', name: l.name || 'Ort', type: l.type || 'Andere' })),
    ];
  }, [heroes, npcs, adventure.reiseLocations]);

  // Grid side length: 2× marker count, clamped to [6, 12]
  const N = Math.max(6, Math.min(12, markers.length * 2));

  const positions = adventure.reisePositions || {};

  // Default layout: combatants spread across top row, locations across bottom row
  const defaultPositionFor = (m, idx, list) => {
    const total = list.length;
    const col = total === 1 ? Math.floor(N / 2) : Math.round((idx + 0.5) * (N - 1) / total);
    const row = m.kind === 'ort' ? N - 1 : 0;
    return { row: Math.max(0, Math.min(N - 1, row)), col: Math.max(0, Math.min(N - 1, col)) };
  };

  const combatantList = markers.filter((m) => m.kind !== 'ort');
  const locationList = markers.filter((m) => m.kind === 'ort');

  // Resolve positions: honor saved ones (clamped to grid), assign defaults to the rest.
  // For a travel map we allow overlap, so no collision avoidance beyond keeping defaults
  // off the same cell on first placement.
  const resolvedPositions = useMemo(() => {
    const out = {};
    const usedForDefault = new Set();
    for (const m of markers) {
      const saved = positions[m.id];
      if (saved && typeof saved.row === 'number' && typeof saved.col === 'number') {
        const r = Math.max(0, Math.min(N - 1, saved.row));
        const c = Math.max(0, Math.min(N - 1, saved.col));
        out[m.id] = { row: r, col: c };
      }
    }
    const assignDefault = (m, idx, list) => {
      if (out[m.id]) return;
      const target = defaultPositionFor(m, idx, list);
      let r = target.row, c = target.col;
      if (usedForDefault.has(r + ',' + c)) {
        for (let dist = 1; dist < N * 2; dist++) {
          let found = false;
          for (let dc = -dist; dc <= dist && !found; dc++) {
            for (let dr = -dist; dr <= dist && !found; dr++) {
              if (Math.abs(dc) !== dist && Math.abs(dr) !== dist) continue;
              const nr = target.row + dr, nc = target.col + dc;
              if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
              if (!usedForDefault.has(nr + ',' + nc)) { r = nr; c = nc; found = true; }
            }
          }
          if (found) break;
        }
      }
      out[m.id] = { row: r, col: c };
      usedForDefault.add(r + ',' + c);
    };
    combatantList.forEach((m, i) => assignDefault(m, i, combatantList));
    locationList.forEach((m, i) => assignDefault(m, i, locationList));
    return out;
  }, [markers, N, positions]);

  const moveTo = (id, row, col) => {
    update({ ...adventure, reisePositions: { ...positions, [id]: { row, col } } });
  };

  const onPointerDown = (e, id) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({ id, x: e.clientX - rect.left, y: e.clientY - rect.top, pointerId: e.pointerId, started: false });
  };
  const onPointerMove = (e) => {
    if (!drag) return;
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({ ...drag, x: e.clientX - rect.left, y: e.clientY - rect.top, started: true });
  };
  const onPointerUp = (e) => {
    if (!drag) return;
    const rect = gridRef.current?.getBoundingClientRect();
    if (rect) {
      const cellPx = rect.width / N;
      const col = Math.max(0, Math.min(N - 1, Math.floor((e.clientX - rect.left) / cellPx)));
      const row = Math.max(0, Math.min(N - 1, Math.floor((e.clientY - rect.top) / cellPx)));
      if (drag.started) moveTo(drag.id, row, col);
    }
    setDrag(null);
  };

  if (markers.length === 0) {
    return (
      <div className="space-y-2">
        <SectionTitle>Reisekarte</SectionTitle>
        <div className="text-center font-body italic py-6 border-2 border-dashed rounded"
          style={{ borderColor: 'rgba(41,51,92,0.20)', color: 'var(--olive)' }}>
          Noch keine Helden oder Orte — füge unten welche hinzu.
        </div>
      </div>
    );
  }

  const cellPct = 100 / N;
  // Token size: half a grid cell, centered
  const tokenPct = cellPct / 2;
  const tokenOffsetPct = tokenPct / 2; // centers token within its cell

  return (
    <div className="space-y-2">
      <SectionTitle>Reisekarte</SectionTitle>
      <div className="card p-2 select-none">
        <div className="smallcaps text-[10px] mb-2 flex items-center justify-between"
          style={{ color: 'var(--olive)' }}>
          <span>Karte · {N} × {N}</span>
          <span>{combatantList.length} Reisende · {locationList.length} Orte</span>
        </div>
        <div
          ref={gridRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative w-full"
          style={{
            aspectRatio: '1 / 1',
            backgroundColor: 'var(--cream)',
            border: '1.5px solid var(--navy)',
            borderRadius: 2,
            touchAction: 'none',
            backgroundImage:
              'linear-gradient(to right, rgba(41,51,92,0.15) 1px, transparent 1px),' +
              'linear-gradient(to bottom, rgba(41,51,92,0.15) 1px, transparent 1px)',
            backgroundSize: `${cellPct}% ${cellPct}%`,
          }}>
          {markers.map((m) => {
            const pos = resolvedPositions[m.id];
            if (!pos) return null;
            const isDragging = drag && drag.id === m.id && drag.started;
            // Center of the cell in either px (dragging) or % (resting)
            const gridWidth = gridRef.current?.getBoundingClientRect().width || 0;
            const halfTokenPx = gridWidth * tokenPct / 200;
            const left = isDragging
              ? `${drag.x - halfTokenPx}px`
              : `${pos.col * cellPct + tokenOffsetPct}%`;
            const top = isDragging
              ? `${drag.y - halfTokenPx}px`
              : `${pos.row * cellPct + tokenOffsetPct}%`;
            const isOrt = m.kind === 'ort';
            const isHeld = m.kind === 'held';
            return (
              <div
                key={m.id}
                onPointerDown={(e) => onPointerDown(e, m.id)}
                title={isOrt ? m.name + ' · ' + m.type : m.name}
                className="absolute"
                style={{
                  left, top,
                  width: `${tokenPct}%`,
                  height: `${tokenPct}%`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  transition: isDragging ? 'none' : 'left 0.15s, top 0.15s',
                  zIndex: isDragging ? 10 : (isOrt ? 1 : 2),
                }}>
                {isOrt ? (
                  <div className="w-full h-full flex flex-col items-center justify-start"
                    style={{
                      filter: isDragging ? 'drop-shadow(0 4px 8px rgba(41,51,92,0.40))' : 'drop-shadow(0 1px 1px rgba(41,51,92,0.30))',
                    }}>
                    <div style={{ width: '100%', height: '100%', flexShrink: 0 }}>
                      <LocationSymbol type={m.type} size="100%" />
                    </div>
                    {m.name && (
                      <div className="font-body whitespace-nowrap"
                        style={{
                          marginTop: 2,
                          fontSize: 'clamp(7px, 1.2vw, 10px)',
                          color: 'var(--navy)',
                          lineHeight: 1,
                          textShadow: '0 0 2px var(--cream), 0 0 2px var(--cream), 0 0 2px var(--cream)',
                          textAlign: 'center',
                        }}>
                        {m.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-display leading-none"
                    style={{
                      backgroundColor: isHeld ? 'var(--sky)' : 'var(--paper)',
                      border: `1.5px solid ${isHeld ? 'var(--navy)' : 'var(--red)'}`,
                      color: isHeld ? 'var(--navy)' : 'var(--red)',
                      borderRadius: '50%',
                      boxShadow: isDragging ? '0 4px 10px rgba(41,51,92,0.35)' : '0 1px 2px rgba(41,51,92,0.25)',
                      fontSize: 'clamp(7px, 1.4vw, 11px)',
                      fontWeight: 600,
                    }}>
                    {m.initials}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mt-2 smallcaps text-[10px]"
          style={{ color: 'var(--navy)' }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: 'var(--sky)', border: '1.5px solid var(--navy)' }} />
            Helden
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: 'var(--paper)', border: '1.5px solid var(--red)' }} />
            NSC
          </span>
          {LOCATION_TYPES.map((t) => (
            <span key={t} className="flex items-center gap-1">
              <span className="inline-block" style={{ width: 14, height: 14 }}>
                <LocationSymbol type={t} size={14} />
              </span>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Kampfplatz — snap-grid battle formation map for the Kampf tab
// ───────────────────────────────────────────────────────────────
function KampfplatzGrid({ adventure, update, heroes, npcs }) {
  const gridRef = useRef(null);
  const [drag, setDrag] = useState(null); // { id, x, y } current pointer pos during drag

  // Build combatant list. Stable ordering: heroes first by their order, then NPCs.
  const combatants = useMemo(() => {
    const initialsOf = (name) => {
      if (!name) return '?';
      const words = name.trim().split(/\s+/);
      if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };
    // Use the "Aktuell" value if set, otherwise fall back to the derived max
    const valueOrMax = (cur, max) => {
      if (cur !== '' && cur != null) return cur;
      return max;
    };
    return [
      ...heroes.map((c) => {
        const cur = c.currentValues || {};
        const dh = computeDerived(c.attributes, c.derivedMods);
        // Primary weapon AT/PA from the character sheet
        const weapon = (c.weapons || []).find((w) => w.primary);
        let at = null, pa = null;
        if (weapon) {
          const wt = (c.weaponTalents || {})[weapon.name] || {};
          const atTaw = Number(wt.at) || 0;
          const paTaw = Number(wt.pa) || 0;
          at = (weapon.type === 'FK' ? dh.FK : dh.AT) + atTaw;
          pa = weapon.type === 'FK' ? null : dh.PA + paTaw;
        }
        return {
          id: c.id,
          kind: 'held',
          name: c.name || 'Unbenannt',
          initials: initialsOf(c.name),
          le: valueOrMax(cur.LeP, dh.LeP),
          ae: c.isMagical ? valueOrMax(cur.AsP, dh.AsP) : null,
          ke: c.isBlessed ? valueOrMax(cur.KaP, dh.KaP) : null,
          at,
          pa,
        };
      }),
      ...npcs.map((n) => {
        const hasLe = n.lep !== '' && n.lep != null;
        const hasAe = n.asp !== '' && n.asp != null;
        const hasKe = n.kap !== '' && n.kap != null;
        const hasAt = n.primaryWeapon && n.primaryAt !== '' && n.primaryAt != null;
        const hasPa = n.primaryWeapon && n.primaryPa !== '' && n.primaryPa != null;
        return {
          id: n.id,
          kind: 'nsc',
          name: n.name || 'NSC',
          initials: initialsOf(n.name),
          le: hasLe ? n.lep : null,
          ae: hasAe ? n.asp : null,
          ke: hasKe ? n.kap : null,
          at: hasAt ? n.primaryAt : null,
          pa: hasPa ? n.primaryPa : null,
        };
      }),
    ];
  }, [heroes, npcs]);

  // Grid side length: double the combatant count, clamped to [4, 10]
  const N = Math.max(4, Math.min(10, combatants.length * 2));

  // Default positions: heroes on row 0, NSCs on last row, spread evenly.
  // Use a stable key so positions persist as combatants are added/removed.
  const positions = adventure.kampfPositions || {};

  const defaultPositionFor = (combatant, idx, allOfKind) => {
    const total = allOfKind.length;
    // Center across the row with even spacing
    const col = total === 1 ? Math.floor(N / 2) : Math.round((idx + 0.5) * (N - 1) / total);
    const row = combatant.kind === 'held' ? 0 : N - 1;
    return { row: Math.max(0, Math.min(N - 1, row)), col: Math.max(0, Math.min(N - 1, col)) };
  };

  const heroesList = combatants.filter((c) => c.kind === 'held');
  const npcsList = combatants.filter((c) => c.kind === 'nsc');

  const resolvedPositions = useMemo(() => {
    const out = {};
    const used = new Set();
    const claim = (r, c) => { used.add(r + ',' + c); };
    // First, honor any saved positions (clamped to current grid)
    for (const cm of combatants) {
      const saved = positions[cm.id];
      if (saved && typeof saved.row === 'number' && typeof saved.col === 'number') {
        const r = Math.max(0, Math.min(N - 1, saved.row));
        const c = Math.max(0, Math.min(N - 1, saved.col));
        if (!used.has(r + ',' + c)) {
          out[cm.id] = { row: r, col: c };
          claim(r, c);
        }
      }
    }
    // Then assign defaults to the rest, avoiding collisions
    const assignDefault = (cm, idx, list) => {
      if (out[cm.id]) return;
      const target = defaultPositionFor(cm, idx, list);
      let r = target.row, c = target.col;
      if (used.has(r + ',' + c)) {
        // Search outward in spiral for a free cell
        for (let dist = 1; dist < N * 2; dist++) {
          let found = false;
          for (let dc = -dist; dc <= dist && !found; dc++) {
            for (let dr = -dist; dr <= dist && !found; dr++) {
              if (Math.abs(dc) !== dist && Math.abs(dr) !== dist) continue;
              const nr = target.row + dr, nc = target.col + dc;
              if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
              if (!used.has(nr + ',' + nc)) { r = nr; c = nc; found = true; }
            }
          }
          if (found) break;
        }
      }
      out[cm.id] = { row: r, col: c };
      claim(r, c);
    };
    heroesList.forEach((cm, i) => assignDefault(cm, i, heroesList));
    npcsList.forEach((cm, i) => assignDefault(cm, i, npcsList));
    return out;
  }, [combatants, N, positions]);

  // Move a token to (row, col); swap if cell is occupied.
  const moveTo = (id, row, col) => {
    const occupantId = Object.entries(resolvedPositions).find(
      ([oid, p]) => oid !== id && p.row === row && p.col === col
    )?.[0];
    const next = { ...positions };
    next[id] = { row, col };
    if (occupantId) {
      const prev = resolvedPositions[id];
      next[occupantId] = { row: prev.row, col: prev.col };
    }
    update({ ...adventure, kampfPositions: next });
  };

  // Pointer drag handling
  const onPointerDown = (e, id) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({ id, x: e.clientX - rect.left, y: e.clientY - rect.top, pointerId: e.pointerId, started: false });
  };
  const onPointerMove = (e) => {
    if (!drag) return;
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({ ...drag, x: e.clientX - rect.left, y: e.clientY - rect.top, started: true });
  };
  const onPointerUp = (e) => {
    if (!drag) return;
    const rect = gridRef.current?.getBoundingClientRect();
    if (rect) {
      const cellPx = rect.width / N;
      const col = Math.max(0, Math.min(N - 1, Math.floor((e.clientX - rect.left) / cellPx)));
      const row = Math.max(0, Math.min(N - 1, Math.floor((e.clientY - rect.top) / cellPx)));
      if (drag.started) moveTo(drag.id, row, col);
    }
    setDrag(null);
  };

  if (combatants.length === 0) {
    return (
      <div className="space-y-2">
        <SectionTitle>Kampfplatz</SectionTitle>
        <div className="text-center font-body italic py-6 border-2 border-dashed rounded"
          style={{ borderColor: 'rgba(41,51,92,0.20)', color: 'var(--olive)' }}>
          Noch keine Kämpfenden — füge unten Helden oder NSC hinzu.
        </div>
      </div>
    );
  }

  // Token size as % of grid width (one cell = 100/N percent)
  const cellPct = 100 / N;

  return (
    <div className="space-y-2">
      <SectionTitle>Kampfplatz</SectionTitle>
      <div className="card p-2 select-none">
        <div className="smallcaps text-[10px] mb-2 flex items-center justify-between"
          style={{ color: 'var(--olive)' }}>
          <span>Schlachtfeld · {N} × {N}</span>
          <span>{heroesList.length} Held{heroesList.length !== 1 ? 'en' : ''} · {npcsList.length} NSC</span>
        </div>
        <div
          ref={gridRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative w-full"
          style={{
            aspectRatio: '1 / 1',
            backgroundColor: 'var(--cream)',
            border: '1.5px solid var(--navy)',
            borderRadius: 2,
            touchAction: 'none',
            backgroundImage:
              'linear-gradient(to right, rgba(41,51,92,0.15) 1px, transparent 1px),' +
              'linear-gradient(to bottom, rgba(41,51,92,0.15) 1px, transparent 1px)',
            backgroundSize: `${cellPct}% ${cellPct}%`,
          }}>
          {combatants.map((cm) => {
            const pos = resolvedPositions[cm.id];
            if (!pos) return null;
            const isDragging = drag && drag.id === cm.id && drag.started;
            const left = isDragging
              ? `${drag.x - (gridRef.current?.getBoundingClientRect().width || 0) * cellPct / 200}px`
              : `${pos.col * cellPct}%`;
            const top = isDragging
              ? `${drag.y - (gridRef.current?.getBoundingClientRect().width || 0) * cellPct / 200}px`
              : `${pos.row * cellPct}%`;
            const isHeld = cm.kind === 'held';
            return (
              <div
                key={cm.id}
                onPointerDown={(e) => onPointerDown(e, cm.id)}
                title={cm.name}
                className="absolute"
                style={{
                  left, top,
                  width: `${cellPct}%`,
                  height: `${cellPct}%`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  transition: isDragging ? 'none' : 'left 0.15s, top 0.15s',
                  zIndex: isDragging ? 10 : 1,
                }}>
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-center font-display leading-none"
                  style={{
                    backgroundColor: isHeld ? 'var(--sky)' : 'var(--paper)',
                    border: `2px solid ${isHeld ? 'var(--navy)' : 'var(--red)'}`,
                    color: isHeld ? 'var(--navy)' : 'var(--red)',
                    boxShadow: isDragging ? '0 6px 14px rgba(41,51,92,0.35)' : '0 1px 2px rgba(41,51,92,0.20)',
                    overflow: 'hidden',
                    padding: '2px',
                    boxSizing: 'border-box',
                  }}>
                  <span style={{ fontSize: 'clamp(9px, 1.8vw, 14px)', fontWeight: 600 }}>
                    {cm.initials}
                  </span>
                  {(cm.le != null || cm.ae != null || cm.ke != null) && (
                    <span className="font-body" style={{ fontSize: 'clamp(6px, 1.1vw, 9px)', marginTop: 1, opacity: 0.85, lineHeight: 1 }}>
                      {cm.le != null && <>LE {cm.le}</>}
                      {cm.le != null && (cm.ae != null || cm.ke != null) && ' · '}
                      {cm.ae != null && <>AE {cm.ae}</>}
                      {cm.ae != null && cm.ke != null && ' · '}
                      {cm.ke != null && <>KE {cm.ke}</>}
                    </span>
                  )}
                  {(cm.at != null || cm.pa != null) && (
                    <span className="font-body" style={{ fontSize: 'clamp(6px, 1.1vw, 9px)', marginTop: 1, opacity: 0.85, lineHeight: 1 }}>
                      {cm.at != null && <>AT {cm.at}</>}
                      {cm.at != null && cm.pa != null && ' · '}
                      {cm.pa != null && <>PA {cm.pa}</>}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 smallcaps text-[10px]"
          style={{ color: 'var(--navy)' }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3"
              style={{ backgroundColor: 'var(--sky)', border: '2px solid var(--navy)' }} />
            Helden
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3"
              style={{ backgroundColor: 'var(--paper)', border: '2px solid var(--red)' }} />
            NSC
          </span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Abenteuer view (Meister only)
// ───────────────────────────────────────────────────────────────
// Sub-tabs inside each Abenteuer — add new modes here as needed
const ADVENTURE_TABS = [
  { id: 'allgemein', label: 'Allgemein', icon: Info },
  { id: 'alltag', label: 'Alltag', icon: Sun },
  { id: 'reise', label: 'Reise', icon: MapIcon },
  { id: 'kampf', label: 'Kampf', icon: Swords },
];

function AdventureView({ adventure, allGroups, allChars, update, updateChar, updateChars, onBack, onDelete, onOpenGroup, onOpenChar, savedAt }) {
  const [subTab, setSubTab] = useState('allgemein');
  const inAdv = (id) => (adventure.groupIds || []).includes(id);
  const toggleGroup = (id) => {
    const newIds = inAdv(id)
      ? adventure.groupIds.filter((x) => x !== id)
      : [...(adventure.groupIds || []), id];
    update({ ...adventure, groupIds: newIds });
  };

  const members = allGroups.filter((g) => inAdv(g.id));
  const nonMembers = allGroups.filter((g) => !inAdv(g.id));

  // Per-hero adventure-scoped state (only Aktivität uses this now; LE/AE/KE write to the character sheet)
  const setAlltagField = (charId, field, value) => {
    const prev = adventure.alltagState || {};
    const charState = prev[charId] || {};
    update({
      ...adventure,
      alltagState: { ...prev, [charId]: { ...charState, [field]: value } },
    });
  };

  // Write a single "Aktuell" value (LeP / AsP / KaP) back to the character sheet
  const setCharCurrent = (c, field, value) => {
    updateChar({
      ...c,
      currentValues: { ...(c.currentValues || {}), [field]: value },
    });
  };

  // Heroes in this adventure: union of characters across all assigned groups, deduplicated
  const heroes = useMemo(() => {
    const memberGroups = allGroups.filter((g) => (adventure.groupIds || []).includes(g.id));
    const ids = new Set();
    for (const g of memberGroups) {
      for (const cid of (g.characterIds || [])) ids.add(cid);
    }
    return allChars.filter((c) => ids.has(c.id));
  }, [adventure.groupIds, allGroups, allChars]);

  const renderGroupRow = (g, action) => {
    const memberCount = (g.characterIds || []).length;
    const memberNames = (g.characterIds || [])
      .map((id) => (allChars.find((c) => c.id === id) || {}).name)
      .filter(Boolean);
    return (
      <div key={g.id} className="card scroll-shadow flex items-stretch overflow-hidden">
        <div style={{ width: 6, backgroundColor: 'var(--red)', flexShrink: 0 }} />
        <button onClick={() => onOpenGroup(g.id)} className="flex-1 text-left p-3 min-w-0">
          <div className="font-display text-lg" style={{ color: 'var(--navy)' }}>{g.name || 'Unbenannt'}</div>
          {g.description && (
            <div className="font-body italic text-xs truncate" style={{ color: 'var(--olive)' }}>{g.description}</div>
          )}
          <div className="smallcaps text-[10px] mt-1" style={{ color: 'var(--navy)' }}>
            {memberCount} {memberCount === 1 ? 'Mitglied' : 'Mitglieder'}
            {memberNames.length > 0 && (
              <span style={{ color: 'var(--olive)' }} className="font-body italic ml-2 normal-case tracking-normal">
                — {memberNames.slice(0, 4).join(', ')}{memberNames.length > 4 ? ', …' : ''}
              </span>
            )}
          </div>
        </button>
        <div className="p-3 flex items-center flex-shrink-0">
          {action}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between px-3 py-2 sticky top-0 z-10 surface-sand"
        style={{ borderBottom: '1px solid rgba(41,51,92,0.20)' }}>
        <button onClick={onBack} className="flex items-center gap-1 font-body text-sm" style={{ color: 'var(--navy)' }}>
          <ChevronLeft className="w-4 h-4" /> Abenteuer
        </button>
        <div className="font-display truncate flex-1 text-center px-2" style={{ color: 'var(--red)' }}>
          {adventure.name || 'Unbenanntes Abenteuer'}
        </div>
        <div className="w-24 text-right">
          {savedAt && (
            <span key={savedAt} className="saved-indicator inline-flex items-center gap-1 smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>
              <Save className="w-3 h-3" /> gespeichert
            </span>
          )}
        </div>
      </div>

      {/* Mode tabs — same box-style strip as the character sheet */}
      <div className="flex gap-0.5 overflow-x-auto px-2 py-2" style={{ borderBottom: '1px solid rgba(41,51,92,0.15)' }}>
        {ADVENTURE_TABS.map((t) => {
          const Icon = t.icon;
          const active = subTab === t.id;
          return (
            <button key={t.id} onClick={() => setSubTab(t.id)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-sm smallcaps text-[10px] transition ${active ? 'tab-active' : ''}`}
              style={!active ? { color: 'var(--navy)' } : {}}>
              <Icon className="w-4 h-4 mb-0.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 space-y-4">
        {subTab === 'allgemein' && (
          <>
            <Field label="Abenteuername" value={adventure.name} onChange={(v) => update({ ...adventure, name: v })} />

            <label className="block">
              <span className="smallcaps text-[10px] block mb-1" style={{ color: 'var(--olive)' }}>Beschreibung</span>
              <textarea
                value={adventure.description || ''}
                onChange={(e) => update({ ...adventure, description: e.target.value })}
                rows={3}
                placeholder="Plot, Schauplatz, Auftraggeber, offene Plotfäden …"
                className="ink-input font-body w-full px-1 py-1 resize-none"
              />
            </label>

            <label className="block pt-1">
              <span className="smallcaps text-[10px] block mb-1" style={{ color: 'var(--olive)' }}>Abenteuerpunkte</span>
              <input
                type="number"
                inputMode="numeric"
                value={adventure.ap ?? ''}
                onChange={(e) => update({ ...adventure, ap: e.target.value })}
                disabled={!!adventure.apAwarded}
                placeholder="0"
                title={adventure.apAwarded
                  ? 'AP wurden bereits vergeben — Wert ist gesperrt.'
                  : 'Wird allen Helden gutgeschrieben, sobald „Abgeschlossen" markiert wird.'}
                className="ink-input font-display text-base w-full px-1 py-0.5"
                style={{ color: adventure.apAwarded ? 'var(--olive)' : 'var(--navy)' }} />
              {adventure.apAwarded && (
                <span className="font-body italic text-[10px] block mt-1" style={{ color: 'var(--olive)' }}>
                  AP wurden bereits an die beteiligten Helden vergeben.
                </span>
              )}
            </label>

            <label className="flex items-center gap-2 pt-1">
              <input type="checkbox"
                checked={!!adventure.completed}
                onChange={(e) => {
                  const checked = e.target.checked;
                  // First-time completion: award AP to every hero in the adventure
                  if (checked && !adventure.apAwarded) {
                    const apValue = Number(adventure.ap) || 0;
                    if (apValue > 0 && heroes.length > 0) {
                      const updatedHeroes = heroes.map((c) => ({
                        ...c,
                        ap: {
                          ...(c.ap || { total: 0, spent: 0 }),
                          total: (Number((c.ap || {}).total) || 0) + apValue,
                        },
                      }));
                      updateChars(updatedHeroes);
                    }
                    update({ ...adventure, completed: true, apAwarded: true });
                  } else {
                    update({ ...adventure, completed: checked });
                  }
                }} />
              <span className="font-body">Abgeschlossen</span>
            </label>

            <SectionTitle>Beteiligte Gruppen ({members.length})</SectionTitle>
            {members.length === 0 ? (
              <div className="text-center font-body italic py-4" style={{ color: 'var(--olive)' }}>
                Noch keine Gruppen zugewiesen.
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((g) => renderGroupRow(g,
                  <button onClick={(e) => { e.stopPropagation(); toggleGroup(g.id); }} className="btn-accent rounded px-3 py-1 smallcaps text-[10px]">
                    Entfernen
                  </button>
                ))}
              </div>
            )}

            <SectionTitle>Gruppe hinzufügen</SectionTitle>
            {nonMembers.length === 0 ? (
              <div className="text-center font-body italic py-2" style={{ color: 'var(--olive)' }}>
                {allGroups.length === 0 ? 'Es gibt noch keine Heldengruppen.' : 'Alle Gruppen sind diesem Abenteuer bereits zugewiesen.'}
              </div>
            ) : (
              <div className="space-y-2">
                {nonMembers.map((g) => renderGroupRow(g,
                  <button onClick={(e) => { e.stopPropagation(); toggleGroup(g.id); }} className="btn-primary rounded px-3 py-1 smallcaps text-[10px]">
                    <Plus className="w-3 h-3 inline mr-1" /> Hinzufügen
                  </button>
                ))}
              </div>
            )}

          </>
        )}

        {(() => {
          // Reusable hero/NPC/talents table — used by both Alltag and Kampf tabs.
          // The two tabs keep independent NSC lists and talent selections by passing
          // different storage keys on the adventure object.
          const renderHeroNpcTable = (npcsKey, talentsKey, mode) => {
            const npcs = adventure[npcsKey] || [];
            const hasAnyone = heroes.length + npcs.length > 0;

            // NPC mutation helpers — write back to adventure[npcsKey]
            const setNpcs = (next) => update({ ...adventure, [npcsKey]: next });
            const addNpc = () => {
              const npc = {
                id: 'npc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                name: 'Neuer NSC',
                lep: '', asp: '', kap: '',
                at: '', pa: '',
                talentValues: {},
              };
              setNpcs([...npcs, npc]);
            };
            const updateNpc = (id, patch) => setNpcs(npcs.map((n) => n.id === id ? { ...n, ...patch } : n));
            const removeNpc = (id) => setNpcs(npcs.filter((n) => n.id !== id));
            const setNpcTalent = (id, talentName, value) => {
              const npc = npcs.find((n) => n.id === id);
              if (!npc) return;
              const tv = { ...(npc.talentValues || {}), [talentName]: value };
              updateNpc(id, { talentValues: tv });
            };

            // Build dropdown options: union of (category, name, probe) across all heroes,
            // deduplicated by talent name. Sorted by category then name for predictable grouping.
            const talentOptionsMap = new Map();
            for (const c of heroes) {
              for (const t of (c.talents || [])) {
                if (!t.name) continue;
                if (!talentOptionsMap.has(t.name)) {
                  talentOptionsMap.set(t.name, { name: t.name, category: t.category || 'Eigene', probe: t.probe || '' });
                }
              }
            }
            const talentOptions = [...talentOptionsMap.values()].sort((a, b) => {
              if (a.category === b.category) return a.name.localeCompare(b.name, 'de');
              return a.category.localeCompare(b.category, 'de');
            });

            const NUM_TALENT_ROWS = 5;
            const selectedTalents = adventure[talentsKey] || [];
            const setSelectedTalent = (idx, name) => {
              const next = [...(adventure[talentsKey] || [])];
              while (next.length < NUM_TALENT_ROWS) next.push('');
              next[idx] = name;
              update({ ...adventure, [talentsKey]: next });
            };

            // Render a probe like MU/KL/IN with each attribute substituted by the hero's value
            const renderProbeWithValues = (probe, c) => {
              if (!probe) return null;
              const parts = probe.split('/');
              return parts.map((p, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ color: 'var(--olive)' }} className="opacity-50 mx-0.5">/</span>}
                  <span>{c.attributes[p] ?? '?'}</span>
                </span>
              ));
            };

            const colWidth = 116;
            const labelWidth = 76;
            const npcDivider = npcs.length > 0 && heroes.length > 0
              ? { borderLeft: '3px double var(--red)' }
              : {};

            const addNpcButton = (
              <button onClick={addNpc}
                className="btn-accent rounded px-3 py-1 smallcaps text-[10px] flex items-center gap-1">
                <Plus className="w-3 h-3" /> NSC hinzufügen
              </button>
            );

            if (!hasAnyone) {
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="smallcaps text-[10px]" style={{ color: 'var(--olive)' }}>
                      Helden im Abenteuer · 0
                    </span>
                    {addNpcButton}
                  </div>
                  <div className="text-center font-body italic py-6 border-2 border-dashed rounded" style={{ borderColor: 'rgba(41,51,92,0.20)', color: 'var(--olive)' }}>
                    Noch keine Helden — weise unter Allgemein eine Heldengruppe zu, oder füge einen NSC hinzu.
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="smallcaps text-[10px]" style={{ color: 'var(--olive)' }}>
                    Helden · {heroes.length}{npcs.length > 0 && <span> · NSC · {npcs.length}</span>}
                  </span>
                  {addNpcButton}
                </div>

              <div className="card scroll-shadow overflow-x-auto">
                <table className="border-collapse" style={{ minWidth: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: labelWidth, minWidth: labelWidth, backgroundColor: 'var(--paper)' }}
                        className="sticky left-0 z-10 smallcaps text-[10px] text-left px-2 py-2 align-bottom"
                        title="">
                        <span style={{ color: 'var(--olive)' }}>&nbsp;</span>
                      </th>
                      {heroes.map((c) => {
                        return (
                          <th key={c.id}
                            className="align-bottom px-1 pt-2 pb-1 border-b"
                            style={{ width: colWidth, minWidth: colWidth, borderColor: 'rgba(41,51,92,0.20)' }}>
                            <button onClick={() => onOpenChar(c.id)}
                              className="w-full text-left px-1 py-1 rounded transition"
                              style={{ borderLeft: '3px solid var(--navy)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(126,188,230,0.20)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <div className="font-display text-sm truncate leading-tight" style={{ color: 'var(--navy)' }}>
                                {c.name || 'Unbenannt'}
                              </div>
                              {c.ownerName && (
                                <div className="smallcaps text-[9px] mt-0.5 truncate" style={{ color: 'var(--olive)' }}>
                                  {c.ownerName}
                                </div>
                              )}
                            </button>
                          </th>
                        );
                      })}
                      {npcs.map((n, i) => (
                        <th key={n.id}
                          className="align-bottom px-1 pt-2 pb-1 border-b"
                          style={{ width: colWidth, minWidth: colWidth, borderColor: 'rgba(41,51,92,0.20)', ...(i === 0 ? npcDivider : {}) }}>
                          <div className="px-1 py-1 rounded" style={{ borderLeft: '3px solid var(--red)' }}>
                            <div className="flex items-start gap-1">
                              <input
                                value={n.name}
                                onChange={(e) => updateNpc(n.id, { name: e.target.value })}
                                placeholder="NSC"
                                className="ink-input font-display text-sm flex-1 px-1 py-0 min-w-0"
                                style={{ color: 'var(--navy)' }} />
                              <button onClick={() => removeNpc(n.id)}
                                title="NSC entfernen"
                                style={{ color: 'var(--olive)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--olive)'}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="smallcaps text-[9px] mt-0.5" style={{ color: 'var(--red)' }}>NSC</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* LE / AE / KE rows — bound to character sheet currentValues */}
                    {[
                      { key: 'LeP', npcKey: 'lep', label: 'LE', flag: null, title: 'Aktuelle Lebensenergie' },
                      { key: 'AsP', npcKey: 'asp', label: 'AE', flag: 'isMagical', title: 'Aktuelle Astralenergie' },
                      { key: 'KaP', npcKey: 'kap', label: 'KE', flag: 'isBlessed', title: 'Aktuelle Karmaenergie' },
                    ].map(({ key, npcKey, label, flag, title }) => (
                      <tr key={key}>
                        <th
                          className="sticky left-0 z-10 smallcaps text-[10px] text-left px-2 py-1"
                          style={{ width: labelWidth, minWidth: labelWidth, backgroundColor: 'var(--paper)', color: 'var(--navy)' }}>
                          {label}
                        </th>
                        {heroes.map((c) => {
                          const d = computeDerived(c.attributes, c.derivedMods);
                          const cur = c.currentValues || {};
                          const enabled = flag ? !!c[flag] : true;
                          const max = d[key];
                          return (
                            <td key={c.id} className="px-1 py-1" style={{ width: colWidth, minWidth: colWidth }}>
                              <input
                                type="number"
                                inputMode="numeric"
                                value={cur[key] ?? ''}
                                onChange={(e) => setCharCurrent(c, key, e.target.value)}
                                placeholder={enabled ? max : '—'}
                                disabled={!enabled}
                                title={enabled ? title : 'Nicht verfügbar'}
                                className="ink-input font-display text-base w-full px-1 py-0.5 text-center"
                                style={{ color: enabled ? 'var(--navy)' : 'var(--olive)' }} />
                            </td>
                          );
                        })}
                        {npcs.map((n, i) => (
                          <td key={n.id} className="px-1 py-1"
                            style={{ width: colWidth, minWidth: colWidth, ...(i === 0 ? npcDivider : {}) }}>
                            <input
                              type="number"
                              inputMode="numeric"
                              value={n[npcKey] ?? ''}
                              onChange={(e) => updateNpc(n.id, { [npcKey]: e.target.value })}
                              placeholder="—"
                              title={title}
                              className="ink-input font-display text-base w-full px-1 py-0.5 text-center"
                              style={{ color: 'var(--navy)' }} />
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* AT / PA rows — read-only base values from the character sheet */}
                    {[
                      { key: 'AT', npcKey: 'at', label: 'AT', title: 'Attacke-Basiswert' },
                      { key: 'PA', npcKey: 'pa', label: 'PA', title: 'Parade-Basiswert' },
                    ].map(({ key, npcKey, label, title }) => (
                      <tr key={key}>
                        <th
                          className="sticky left-0 z-10 smallcaps text-[10px] text-left px-2 py-1"
                          style={{ width: labelWidth, minWidth: labelWidth, backgroundColor: 'var(--paper)', color: 'var(--navy)' }}>
                          {label}
                        </th>
                        {heroes.map((c) => {
                          const d = computeDerived(c.attributes, c.derivedMods);
                          return (
                            <td key={c.id} className="px-1 py-1 text-center" style={{ width: colWidth, minWidth: colWidth }}
                              title={title}>
                              <span className="font-display text-base" style={{ color: 'var(--navy)' }}>{d[key]}</span>
                            </td>
                          );
                        })}
                        {npcs.map((n, i) => (
                          <td key={n.id} className="px-1 py-1"
                            style={{ width: colWidth, minWidth: colWidth, ...(i === 0 ? npcDivider : {}) }}>
                            <input
                              type="number"
                              inputMode="numeric"
                              value={n[npcKey] ?? ''}
                              onChange={(e) => updateNpc(n.id, { [npcKey]: e.target.value })}
                              placeholder="—"
                              title={title}
                              className="ink-input font-display text-base w-full px-1 py-0.5 text-center"
                              style={{ color: 'var(--navy)' }} />
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Visual break */}
                    <tr>
                      <td colSpan={1 + heroes.length + npcs.length} className="p-0">
                        <div style={{ height: 1, backgroundColor: 'var(--navy)', opacity: 0.25, margin: '8px 0' }} />
                      </td>
                    </tr>

                    {/* Talent rows (Alltag) */}
                    {mode !== 'kampf' && Array.from({ length: NUM_TALENT_ROWS }).map((_, rowIdx) => {
                      const sel = selectedTalents[rowIdx] || '';
                      const selOpt = talentOptionsMap.get(sel);
                      return (
                        <tr key={'talent-' + rowIdx}>
                          <th
                            className="sticky left-0 z-10 px-1 py-1"
                            style={{ width: labelWidth, minWidth: labelWidth, backgroundColor: 'var(--paper)' }}>
                            <select
                              value={sel}
                              onChange={(e) => setSelectedTalent(rowIdx, e.target.value)}
                              className="ink-input font-body text-xs w-full px-1 py-0.5"
                              style={{ color: sel ? 'var(--navy)' : 'var(--olive)' }}>
                              <option value="">— Talent —</option>
                              {talentOptions.map((o) => (
                                <option key={o.name} value={o.name}>{o.name}</option>
                              ))}
                            </select>
                            {selOpt && selOpt.probe && (
                              <div className="smallcaps text-[8px] mt-0.5 truncate" style={{ color: 'var(--olive)' }}>
                                {selOpt.probe}
                              </div>
                            )}
                          </th>
                          {heroes.map((c) => {
                            const talent = sel ? (c.talents || []).find((t) => t.name === sel) : null;
                            return (
                              <td key={c.id} className="px-1 py-1 text-center align-middle"
                                style={{ width: colWidth, minWidth: colWidth }}>
                                {!sel ? (
                                  <span className="font-body italic text-xs" style={{ color: 'var(--olive)' }}>—</span>
                                ) : !talent ? (
                                  <span className="font-body italic text-xs" style={{ color: 'var(--olive)' }} title="Held kennt dieses Talent nicht">·</span>
                                ) : (
                                  <div className="flex flex-col items-center leading-tight">
                                    <span className="font-display text-base" style={{ color: 'var(--navy)' }}>{talent.taw}</span>
                                    <span className="font-body text-[10px]" style={{ color: 'var(--olive)' }}>
                                      {renderProbeWithValues(talent.probe || (selOpt && selOpt.probe), c)}
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          {npcs.map((n, i) => (
                            <td key={n.id} className="px-1 py-1 align-middle"
                              style={{ width: colWidth, minWidth: colWidth, ...(i === 0 ? npcDivider : {}) }}>
                              {!sel ? (
                                <div className="text-center">
                                  <span className="font-body italic text-xs" style={{ color: 'var(--olive)' }}>—</span>
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  value={(n.talentValues && n.talentValues[sel]) ?? ''}
                                  onChange={(e) => setNpcTalent(n.id, sel, e.target.value)}
                                  placeholder="·"
                                  title={'TaW · ' + sel}
                                  className="ink-input font-display text-base w-full px-1 py-0.5 text-center"
                                  style={{ color: 'var(--navy)' }} />
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}

                    {/* Primärwaffe row (Kampf) */}
                    {mode === 'kampf' && (
                      <tr>
                        <th
                          className="sticky left-0 z-10 smallcaps text-[10px] text-left px-2 py-1"
                          style={{ width: labelWidth, minWidth: labelWidth, backgroundColor: 'var(--paper)', color: 'var(--navy)' }}>
                          Primärwaffe
                        </th>
                        {heroes.map((c) => {
                          const dh = computeDerived(c.attributes, c.derivedMods);
                          const weapon = (c.weapons || []).find((w) => w.primary);
                          if (!weapon) {
                            return (
                              <td key={c.id} className="px-1 py-1 text-center align-middle"
                                style={{ width: colWidth, minWidth: colWidth }}
                                title="Keine Primärwaffe gewählt">
                                <span className="font-body italic text-xs" style={{ color: 'var(--olive)' }}>—</span>
                              </td>
                            );
                          }
                          const wt = (c.weaponTalents || {})[weapon.name] || {};
                          const atTaw = Number(wt.at) || 0;
                          const paTaw = Number(wt.pa) || 0;
                          const atVal = (weapon.type === 'FK' ? dh.FK : dh.AT) + atTaw;
                          const paVal = weapon.type === 'FK' ? null : dh.PA + paTaw;
                          return (
                            <td key={c.id} className="px-1 py-1 text-center align-middle"
                              style={{ width: colWidth, minWidth: colWidth }}
                              title={weapon.name}>
                              <div className="flex flex-col items-center leading-tight">
                                <span className="font-body text-[10px] truncate w-full" style={{ color: 'var(--navy)' }}>
                                  {weapon.name}
                                </span>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                  <span className="font-display text-base" style={{ color: 'var(--navy)' }}>
                                    <span className="smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>
                                      {weapon.type === 'FK' ? 'FK' : 'AT'} </span>
                                    {atVal}
                                  </span>
                                  {paVal != null && (
                                    <span className="font-display text-base" style={{ color: 'var(--navy)' }}>
                                      <span className="smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>PA </span>
                                      {paVal}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                        {npcs.map((n, i) => {
                          const sel = n.primaryWeapon || '';
                          if (!sel) {
                            return (
                              <td key={n.id} className="px-1 py-1 align-middle"
                                style={{ width: colWidth, minWidth: colWidth, ...(i === 0 ? npcDivider : {}) }}>
                                <select
                                  value=""
                                  onChange={(e) => updateNpc(n.id, { primaryWeapon: e.target.value })}
                                  className="ink-input font-body text-xs w-full px-1 py-0.5"
                                  style={{ color: 'var(--olive)' }}>
                                  <option value="">— Waffe —</option>
                                  {[...new Set(WEAPON_TYPES.map((w) => w.category))].map((cat) => (
                                    <optgroup key={cat} label={cat}>
                                      {WEAPON_TYPES.filter((w) => w.category === cat).map((w) => (
                                        <option key={w.name} value={w.name}>{w.name}</option>
                                      ))}
                                    </optgroup>
                                  ))}
                                </select>
                              </td>
                            );
                          }
                          const selType = (WEAPON_TYPES.find((w) => w.name === sel) || {}).type || 'NK';
                          return (
                            <td key={n.id} className="px-1 py-1 align-middle"
                              style={{ width: colWidth, minWidth: colWidth, ...(i === 0 ? npcDivider : {}) }}>
                              <div className="flex flex-col items-stretch leading-tight">
                                <div className="flex items-center gap-1">
                                  <span className="font-body text-[10px] truncate flex-1" style={{ color: 'var(--navy)' }}
                                    title={sel}>
                                    {sel}
                                  </span>
                                  <button
                                    onClick={() => updateNpc(n.id, { primaryWeapon: '', primaryAt: '', primaryPa: '' })}
                                    title="Waffe entfernen"
                                    style={{ color: 'var(--olive)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--olive)'}>
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>
                                    {selType === 'FK' ? 'FK' : 'AT'}
                                  </span>
                                  <input type="number" inputMode="numeric"
                                    value={n.primaryAt ?? ''}
                                    onChange={(e) => updateNpc(n.id, { primaryAt: e.target.value })}
                                    placeholder="·"
                                    className="ink-input font-display text-base flex-1 px-0.5 py-0 text-center min-w-0"
                                    style={{ color: 'var(--navy)' }} />
                                  {selType !== 'FK' && (
                                    <>
                                      <span className="smallcaps text-[9px]" style={{ color: 'var(--olive)' }}>PA</span>
                                      <input type="number" inputMode="numeric"
                                        value={n.primaryPa ?? ''}
                                        onChange={(e) => updateNpc(n.id, { primaryPa: e.target.value })}
                                        placeholder="·"
                                        className="ink-input font-display text-base flex-1 px-0.5 py-0 text-center min-w-0"
                                        style={{ color: 'var(--navy)' }} />
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="font-body italic text-[10px] text-center" style={{ color: 'var(--olive)' }}>
                LE, AE und KE der Helden sind mit den Aktuell-Werten auf dem Heldenbogen verknüpft.
                NSC und Talentauswahl gelten nur für dieses Abenteuer.
              </div>
            </div>
            );
          };

          if (subTab === 'alltag') return renderHeroNpcTable('npcs', 'alltagTalents', 'alltag');
          if (subTab === 'reise') {
            return (
              <div className="space-y-4">
                <ReisekarteGrid
                  adventure={adventure}
                  update={update}
                  heroes={heroes}
                  npcs={adventure.reiseNpcs || []}
                />
                <LocationsTable adventure={adventure} update={update} />
                {renderHeroNpcTable('reiseNpcs', 'reiseTalents', 'reise')}
              </div>
            );
          }
          if (subTab === 'kampf') {
            return (
              <div className="space-y-4">
                <KampfplatzGrid
                  adventure={adventure}
                  update={update}
                  heroes={heroes}
                  npcs={adventure.kampfNpcs || []}
                />
                {renderHeroNpcTable('kampfNpcs', 'kampfTalents', 'kampf')}
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Meister tab configuration — add new tabs here as needed
// ───────────────────────────────────────────────────────────────
const MEISTER_TABS = [
  { id: 'helden', label: 'Helden' },
  { id: 'gruppen', label: 'Heldengruppen' },
  { id: 'abenteuer', label: 'Abenteuer' },
];

// ───────────────────────────────────────────────────────────────
// Character list
// ───────────────────────────────────────────────────────────────
function CharacterList({ chars, groups, adventures, session, view, setView, onOpen, onOpenGroup, onOpenAdventure, onCreate, onCreateGroup, onCreateAdventure, onDelete, onDeleteGroup, onDeleteAdventure, onLogout, loading }) {
  const isMeister = session && session.role === 'meister';
  const activeView = isMeister ? (view || 'helden') : 'helden';
  // Two-click delete: first click arms the trash icon (turns red), second click within 3s deletes.
  // Avoids browser confirm() dialogs, which are unreliable inside sandboxed artifact iframes.
  const [armedDeleteId, setArmedDeleteId] = useState(null);
  const armedTimer = useRef(null);
  const armDelete = (id, fn) => {
    if (armedDeleteId === id) {
      // Second click: fire delete and clear arm
      if (armedTimer.current) { clearTimeout(armedTimer.current); armedTimer.current = null; }
      setArmedDeleteId(null);
      fn(id);
      return;
    }
    // First click: arm and start auto-disarm timer
    setArmedDeleteId(id);
    if (armedTimer.current) clearTimeout(armedTimer.current);
    armedTimer.current = setTimeout(() => { setArmedDeleteId(null); armedTimer.current = null; }, 3000);
  };
  const footerHint = {
    helden: 'Helden werden im geteilten Speicher gesichert — jede Person mit diesem Artefakt-Link sieht und kann alle Helden bearbeiten.',
    gruppen: 'Heldengruppen organisieren mehrere Helden zu einer Reisegesellschaft.',
    abenteuer: 'Abenteuer bündeln eine oder mehrere Heldengruppen zu einer Spielsitzung oder Kampagne.',
  }[activeView] || '';
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-body text-sm" style={{ color: 'var(--navy)' }}>
          <span className="smallcaps text-[10px] mr-1" style={{ color: 'var(--red)' }}>
            {isMeister ? 'Meister' : 'Spieler'}
          </span>
          · {session.username}
        </div>
        <button onClick={onLogout} className="smallcaps text-[10px] transition" style={{ color: 'var(--olive)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--navy)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--olive)'}>
          Abmelden
        </button>
      </div>
      <div className="banner">
        <div className="banner-rule" />
        <div className="banner-thin" />
        <div className="banner-body">
          <h1 className="font-display text-3xl leading-none m-0" style={{ color: 'var(--red)' }}>
            <span className="banner-diamond" />
            DSApp
            <span className="banner-diamond" />
          </h1>
        </div>
        <div className="banner-thin" />
        <div className="banner-sub">
          <span className="smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>Das Schwarze Auge 4</span>
        </div>
        <div className="banner-rule" />
      </div>

      {isMeister && (
        <div className="flex overflow-x-auto mb-4" style={{ borderBottom: '1px solid rgba(41,51,92,0.20)' }}>
          {MEISTER_TABS.map((t) => (
            <button key={t.id} onClick={() => setView(t.id)}
              className="flex-1 py-2 px-2 smallcaps text-xs transition whitespace-nowrap"
              style={{
                color: activeView === t.id ? 'var(--red)' : 'var(--olive)',
                borderBottom: activeView === t.id ? '2px solid var(--red)' : '2px solid transparent',
                marginBottom: '-1px',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {activeView === 'helden' && (
        <div>
          <button onClick={onCreate}
            className="btn-primary w-full mb-4 smallcaps text-sm py-3 rounded scroll-shadow flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Neuer Held
          </button>

          {loading ? (
            <div className="text-center font-body italic py-12" style={{ color: 'var(--olive)' }}>Lade Heldenarchiv…</div>
          ) : chars.length === 0 ? (
            <div className="text-center font-body italic py-12 border-2 border-dashed rounded" style={{ borderColor: 'rgba(41,51,92,0.25)', color: 'var(--olive)' }}>
              {isMeister ? 'Noch keine Helden im Archiv.' : 'Du hast noch keine Helden.'} Erschaffe deinen ersten oben.
            </div>
          ) : (
            <div className="space-y-2">
              {chars.map((c) => {
                const d = computeDerived(c.attributes, c.derivedMods);
                const charGroups = (groups || []).filter((g) => (g.characterIds || []).includes(c.id));
                return (
                  <div key={c.id} className="card scroll-shadow flex items-stretch overflow-hidden">
                    <div style={{ width: 6, backgroundColor: 'var(--navy)' }} />
                    <button onClick={() => onOpen(c.id)} className="flex-1 text-left p-3 min-w-0">
                      <div className="font-display text-xl flex items-baseline gap-2 flex-wrap" style={{ color: 'var(--navy)' }}>
                        <span>{c.name || 'Unbenannt'}</span>
                        {isMeister && (
                          <span className="smallcaps text-[10px]" style={{ color: 'var(--olive)' }}>
                            {c.ownerName ? '— ' + c.ownerName : '— herrenlos'}
                          </span>
                        )}
                      </div>
                      <div className="font-body italic text-sm" style={{ color: 'var(--olive)' }}>
                        {[c.basics.rasse, c.basics.kultur, c.basics.profession].filter(Boolean).join(' · ') || 'noch namenloser Held'}
                      </div>
                      <div className="smallcaps text-[10px] mt-2 flex gap-3 flex-wrap" style={{ color: 'var(--navy)' }}>
                        <span>LeP <strong style={{ color: 'var(--navy)' }}>{d.LeP}</strong></span>
                        <span>AT <strong style={{ color: 'var(--navy)' }}>{d.AT}</strong></span>
                        <span>PA <strong style={{ color: 'var(--navy)' }}>{d.PA}</strong></span>
                        {c.isMagical && <span>AsP <strong style={{ color: 'var(--navy)' }}>{d.AsP}</strong></span>}
                      </div>
                      {charGroups.length > 0 && (
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {charGroups.map((g) => (
                            <span key={g.id} className="smallcaps text-[9px] px-2 py-0.5 rounded"
                              style={{ backgroundColor: 'rgba(126,188,230,0.30)', color: 'var(--navy)', border: '1px solid rgba(41,51,92,0.20)' }}>
                              {g.name || 'Unbenannt'}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                    <button onClick={() => armDelete(c.id, onDelete)}
                      title={armedDeleteId === c.id ? 'Erneut klicken zum Bestätigen' : 'Held löschen'}
                      className="p-3 transition"
                      style={{ color: armedDeleteId === c.id ? 'var(--red)' : 'var(--olive)' }}
                      onMouseEnter={(e) => { if (armedDeleteId !== c.id) e.currentTarget.style.color = 'var(--navy)'; }}
                      onMouseLeave={(e) => { if (armedDeleteId !== c.id) e.currentTarget.style.color = 'var(--olive)'; }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeView === 'gruppen' && isMeister && (
        <div>
          <button onClick={onCreateGroup}
            className="btn-primary w-full mb-4 smallcaps text-sm py-3 rounded scroll-shadow flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Neue Gruppe
          </button>

          {(!groups || groups.length === 0) ? (
            <div className="text-center font-body italic py-12 border-2 border-dashed rounded" style={{ borderColor: 'rgba(41,51,92,0.25)', color: 'var(--olive)' }}>
              Noch keine Gruppen. Lege oben die erste Heldengruppe an.
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((g) => {
                const memberCount = (g.characterIds || []).length;
                const memberNames = (g.characterIds || [])
                  .map((id) => (chars.find((c) => c.id === id) || {}).name)
                  .filter(Boolean);
                return (
                  <div key={g.id} className="card scroll-shadow flex items-stretch overflow-hidden">
                    <div style={{ width: 6, backgroundColor: 'var(--red)' }} />
                    <button onClick={() => onOpenGroup(g.id)} className="flex-1 text-left p-3 min-w-0">
                      <div className="font-display text-xl" style={{ color: 'var(--navy)' }}>{g.name || 'Unbenannt'}</div>
                      {g.description && (
                        <div className="font-body italic text-sm" style={{ color: 'var(--olive)' }}>{g.description}</div>
                      )}
                      <div className="smallcaps text-[10px] mt-2" style={{ color: 'var(--navy)' }}>
                        {memberCount} {memberCount === 1 ? 'Mitglied' : 'Mitglieder'}
                        {memberNames.length > 0 && (
                          <span style={{ color: 'var(--olive)' }} className="font-body italic ml-2 normal-case tracking-normal">
                            — {memberNames.slice(0, 4).join(', ')}{memberNames.length > 4 ? ', …' : ''}
                          </span>
                        )}
                      </div>
                    </button>
                    {onDeleteGroup && (
                      <button onClick={() => armDelete(g.id, onDeleteGroup)}
                        title={armedDeleteId === g.id ? 'Erneut klicken zum Bestätigen' : 'Gruppe löschen'}
                        className="p-3 transition"
                        style={{ color: armedDeleteId === g.id ? 'var(--red)' : 'var(--olive)' }}
                        onMouseEnter={(e) => { if (armedDeleteId !== g.id) e.currentTarget.style.color = 'var(--navy)'; }}
                        onMouseLeave={(e) => { if (armedDeleteId !== g.id) e.currentTarget.style.color = 'var(--olive)'; }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeView === 'abenteuer' && isMeister && (
        <div>
          <button onClick={onCreateAdventure}
            className="btn-primary w-full mb-4 smallcaps text-sm py-3 rounded scroll-shadow flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Neues Abenteuer
          </button>

          {(!adventures || adventures.length === 0) ? (
            <div className="text-center font-body italic py-12 border-2 border-dashed rounded" style={{ borderColor: 'rgba(41,51,92,0.25)', color: 'var(--olive)' }}>
              Noch keine Abenteuer. Lege oben das erste an.
            </div>
          ) : (
            <div className="space-y-2">
              {adventures.map((a) => {
                const groupCount = (a.groupIds || []).length;
                const groupNames = (a.groupIds || [])
                  .map((id) => (groups.find((g) => g.id === id) || {}).name)
                  .filter(Boolean);
                return (
                  <div key={a.id} className="card scroll-shadow flex items-stretch overflow-hidden">
                    <div style={{ width: 6, backgroundColor: 'var(--olive)' }} />
                    <button onClick={() => onOpenAdventure(a.id)} className="flex-1 text-left p-3 min-w-0">
                      <div className="font-display text-xl" style={{ color: 'var(--navy)' }}>{a.name || 'Unbenannt'}</div>
                      {a.description && (
                        <div className="font-body italic text-sm" style={{ color: 'var(--olive)' }}>{a.description}</div>
                      )}
                      <div className="smallcaps text-[10px] mt-2" style={{ color: 'var(--navy)' }}>
                        {groupCount} {groupCount === 1 ? 'Gruppe' : 'Gruppen'}
                        {groupNames.length > 0 && (
                          <span style={{ color: 'var(--olive)' }} className="font-body italic ml-2 normal-case tracking-normal">
                            — {groupNames.slice(0, 4).join(', ')}{groupNames.length > 4 ? ', …' : ''}
                          </span>
                        )}
                      </div>
                    </button>
                    {onDeleteAdventure && (
                      <button onClick={() => armDelete(a.id, onDeleteAdventure)}
                        title={armedDeleteId === a.id ? 'Erneut klicken zum Bestätigen' : 'Abenteuer löschen'}
                        className="p-3 transition"
                        style={{ color: armedDeleteId === a.id ? 'var(--red)' : 'var(--olive)' }}
                        onMouseEnter={(e) => { if (armedDeleteId !== a.id) e.currentTarget.style.color = 'var(--navy)'; }}
                        onMouseLeave={(e) => { if (armedDeleteId !== a.id) e.currentTarget.style.color = 'var(--olive)'; }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-10 text-center font-body italic text-xs px-4" style={{ color: 'var(--olive)' }}>
        {footerHint}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Login / Register screen
// ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('spieler');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [hasAnyAccount, setHasAnyAccount] = useState(true);
  const [storageStatus, setStorageStatus] = useState('checking');

  useEffect(() => {
    let done = false;
    // Watchdog: if storage hangs (a promise that never resolves), unlock the
    // login screen anyway after 8 seconds so the tester can still enter data.
    const watchdog = setTimeout(() => {
      if (done) return;
      done = true;
      console.warn('Storage probe timeout — entsperre Login-Eingabe trotzdem.');
      setStorageStatus('ok');
    }, 8000);

    (async () => {
      if (typeof window === 'undefined' || !window.storage) {
        done = true; clearTimeout(watchdog);
        setStorageStatus('broken');
        setError('Speicher nicht verfügbar (window.storage fehlt).');
        return;
      }
      let probeOk = false;
      let lastErr = null;
      const probeKey = 'probe_' + Date.now();
      try {
        await window.storage.set(probeKey, 'x', false);
        probeOk = true;
      } catch (e) {
        lastErr = e;
        console.warn('Probe set(personal) failed:', e);
      }
      if (!probeOk) {
        try {
          await window.storage.set(probeKey, 'x', true);
          probeOk = true;
        } catch (e) {
          lastErr = e;
          console.warn('Probe set(shared) failed:', e);
        }
      }
      try { await window.storage.delete(probeKey, false); } catch (e) {}
      try { await window.storage.delete(probeKey, true); } catch (e) {}

      if (!probeOk) {
        console.warn('Storage probe did not succeed, attempting anyway. Last error:', lastErr);
      }
      if (done) return;
      done = true;
      clearTimeout(watchdog);
      setStorageStatus('ok');

      try {
        const accs = await listAccounts();
        if (accs.length === 0) {
          setHasAnyAccount(false);
          setMode('register');
        }
      } catch (e) {
        console.error('listAccounts failed:', e);
      }
    })();

    return () => { clearTimeout(watchdog); };
  }, []);

  const submit = async () => {
    setError('');
    const u = username.trim();
    if (!u) { setError('Benutzername ist erforderlich.'); return; }
    if (!password) { setError('Passwort ist erforderlich.'); return; }
    const badMatch = u.match(/[\s/\\'"]/);
    if (badMatch) {
      const ch = badMatch[0];
      const label = ch === ' ' ? 'ein Leerzeichen'
        : ch === '/' ? 'einen Schrägstrich (/)'
        : ch === '\\' ? 'einen Backslash (\\)'
        : ch === "'" ? 'ein Apostroph (\')'
        : ch === '"' ? 'ein Anführungszeichen (")'
        : 'ein ungültiges Zeichen';
      setError('Der Benutzername enthält ' + label + '. Bitte nur Buchstaben und Zahlen ohne Leerzeichen verwenden (z. B. „BetaTester"). Das Passwort darf beliebige Zeichen enthalten.');
      return;
    }
    setBusy(true);
    try {
      const existing = await loadAccount(u);
      if (mode === 'register') {
        if (existing) {
          setError('Dieser Benutzername existiert bereits. Bitte „Anmelden" wählen.');
          return;
        }
        const acc = { username: u, password, role };
        await saveAccount(acc);
        console.log('Account erstellt:', u, role);
        onLogin(acc);
      } else {
        if (!existing) {
          setError('Kein Konto unter diesem Benutzernamen.');
          return;
        }
        if (existing.password !== password) {
          setError('Falsches Passwort.');
          return;
        }
        console.log('Angemeldet:', existing.username, existing.role);
        onLogin(existing);
      }
    } catch (e) {
      console.error('Auth submit failed:', e);
      setError('Fehler: ' + (e && e.message ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !busy && storageStatus === 'ok') submit();
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-8">
      <div className="banner">
        <div className="banner-rule" />
        <div className="banner-thin" />
        <div className="banner-body">
          <h1 className="font-display text-3xl leading-none m-0" style={{ color: 'var(--red)' }}>
            <span className="banner-diamond" />
            DSApp
            <span className="banner-diamond" />
          </h1>
        </div>
        <div className="banner-thin" />
        <div className="banner-sub">
          <span className="smallcaps text-[10px]" style={{ color: 'var(--navy)' }}>Das Schwarze Auge 4</span>
        </div>
        <div className="banner-rule" />
      </div>

      <div className="card scroll-shadow p-6 space-y-4">
        <div className="flex" style={{ borderBottom: '1px solid rgba(41,51,92,0.20)' }}>
          <button onClick={() => { setMode('login'); setError(''); }}
            className="flex-1 py-2 smallcaps text-sm transition"
            style={{
              color: mode === 'login' ? 'var(--red)' : 'var(--olive)',
              borderBottom: mode === 'login' ? '2px solid var(--red)' : '2px solid transparent',
              marginBottom: '-1px',
            }}>
            Anmelden
          </button>
          <button onClick={() => { setMode('register'); setError(''); }}
            className="flex-1 py-2 smallcaps text-sm transition"
            style={{
              color: mode === 'register' ? 'var(--red)' : 'var(--olive)',
              borderBottom: mode === 'register' ? '2px solid var(--red)' : '2px solid transparent',
              marginBottom: '-1px',
            }}>
            Neues Konto
          </button>
        </div>

        {storageStatus === 'checking' && (
          <div className="font-body italic text-sm" style={{ color: 'var(--olive)' }}>Prüfe Speicher…</div>
        )}

        {storageStatus === 'ok' && !hasAnyAccount && mode === 'register' && (
          <div className="font-body italic text-sm p-2 rounded"
            style={{ color: 'var(--navy)', backgroundColor: 'rgba(126,188,230,0.25)', border: '1px solid rgba(41,51,92,0.15)' }}>
            Noch keine Konten vorhanden. Lege das erste an — üblicherweise ist das der Meister.
          </div>
        )}

        <label className="block">
          <span className="smallcaps text-[10px] block mb-1" style={{ color: 'var(--olive)' }}>Benutzername</span>
          <input value={username}
            onChange={(e) => setUsername(e.target.value.replace(/[\s/\\'"]/g, ''))}
            onKeyDown={handleKeyDown}
            disabled={storageStatus !== 'ok'}
            autoFocus
            placeholder="z. B. BetaTester"
            className="ink-input font-body w-full px-1 py-1" />
          <span className="font-body italic text-[10px] block mt-1" style={{ color: 'var(--olive)' }}>
            Buchstaben und Zahlen, keine Leerzeichen.
          </span>
        </label>
        <label className="block">
          <span className="smallcaps text-[10px] block mb-1" style={{ color: 'var(--olive)' }}>Passwort</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}
            disabled={storageStatus !== 'ok'}
            placeholder="beliebige Zeichen erlaubt"
            className="ink-input font-body w-full px-1 py-1" />
        </label>

        {mode === 'register' && (
          <div>
            <span className="smallcaps text-[10px] block mb-2" style={{ color: 'var(--olive)' }}>Rolle</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setRole('spieler')}
                className="p-3 rounded text-left transition"
                style={{
                  border: role === 'spieler' ? '2px solid var(--navy)' : '2px solid rgba(41,51,92,0.20)',
                  backgroundColor: role === 'spieler' ? 'rgba(126,188,230,0.25)' : 'transparent',
                }}>
                <div className="font-display text-base" style={{ color: 'var(--navy)' }}>Spieler</div>
                <div className="font-body italic text-xs" style={{ color: 'var(--olive)' }}>Sieht nur eigene Helden</div>
              </button>
              <button type="button" onClick={() => setRole('meister')}
                className="p-3 rounded text-left transition"
                style={{
                  border: role === 'meister' ? '2px solid var(--navy)' : '2px solid rgba(41,51,92,0.20)',
                  backgroundColor: role === 'meister' ? 'rgba(126,188,230,0.25)' : 'transparent',
                }}>
                <div className="font-display text-base" style={{ color: 'var(--navy)' }}>Meister</div>
                <div className="font-body italic text-xs" style={{ color: 'var(--olive)' }}>Sieht alle Helden</div>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="font-body text-sm italic p-2 rounded"
            style={{ color: 'var(--red)', backgroundColor: 'rgba(219,43,57,0.10)', border: '1px solid rgba(219,43,57,0.25)' }}>
            {error}
          </div>
        )}

        <button onClick={submit} disabled={busy || storageStatus !== 'ok'}
          className="btn-primary w-full smallcaps text-sm py-3 rounded transition"
          style={{ opacity: (busy || storageStatus !== 'ok') ? 0.5 : 1 }}>
          {busy ? '…' : (mode === 'login' ? 'Anmelden' : 'Konto erstellen')}
        </button>
      </div>

      <div className="mt-6 text-center font-body italic text-xs px-4 leading-relaxed" style={{ color: 'var(--olive)' }}>
        Ehrensystem für deine Spielgruppe. Konten und Charaktere liegen im geteilten Speicher dieses Artefakts — sie sind technisch einsehbar. Bitte keine echten Passwörter wiederverwenden.
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// App
// ───────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [chars, setChars] = useState([]);
  const [groups, setGroups] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [currentAdventureId, setCurrentAdventureId] = useState(null);
  const [meisterView, setMeisterView] = useState('helden');
  const [loading, setLoading] = useState(true);
  const [savedAt, setSavedAt] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    let done = false;
    const watchdog = setTimeout(() => {
      if (!done) {
        console.warn('Session-Resume-Timeout — Speicher antwortet nicht.');
        setAuthChecked(true);
      }
    }, 12000);
    (async () => {
      try {
        const s = await loadSession();
        if (s && s.username) {
          const acc = await loadAccount(s.username);
          if (acc) setSession(acc);
        }
      } catch (e) { console.error('resume session failed:', e); }
      done = true;
      clearTimeout(watchdog);
      setAuthChecked(true);
    })();
    return () => { clearTimeout(watchdog); };
  }, []);

  useEffect(() => {
    if (!session) { setChars([]); setGroups([]); setAdventures([]); return; }
    let cancelled = false;
    // Watchdog: if storage hangs, never leave the user stuck on the loader.
    const watchdog = setTimeout(() => {
      if (!cancelled) {
        console.warn('Datenladen-Timeout — Speicher antwortet nicht.');
        setLoading(false);
      }
    }, 12000);
    (async () => {
      setLoading(true);
      try {
        const [charList, groupList, advList] = await Promise.all([
          loadAll(), loadAllGroups(), loadAllAdventures(),
        ]);
        if (cancelled) return;
        setChars(charList);
        setGroups(groupList);
        setAdventures(advList);
      } catch (e) {
        console.error('Datenladen fehlgeschlagen:', e);
        if (!cancelled) { setChars([]); setGroups([]); setAdventures([]); }
      } finally {
        clearTimeout(watchdog);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; clearTimeout(watchdog); };
  }, [session]);

  const isMeister = session && session.role === 'meister';
  const visibleChars = useMemo(() => {
    if (!session) return [];
    if (isMeister) return chars;
    return chars.filter((c) => c.ownerName === session.username);
  }, [chars, session, isMeister]);

  const current = chars.find((c) => c.id === currentId);
  const canViewCurrent = current && (isMeister || current.ownerName === session.username);
  const currentGroup = groups.find((g) => g.id === currentGroupId);
  const canViewCurrentGroup = currentGroup && isMeister;
  const currentAdventure = adventures.find((a) => a.id === currentAdventureId);
  const canViewCurrentAdventure = currentAdventure && isMeister;

  const debounceSave = (saveFn) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await saveFn();
        setSavedAt(Date.now());
      } catch (e) {}
    }, 600);
  };

  const updateChar = (updated) => {
    setChars((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    debounceSave(() => saveChar(updated));
  };

  // Batch update: persists each character immediately (no debounce coalescing)
  const updateChars = async (updatedList) => {
    if (!updatedList || updatedList.length === 0) return;
    const byId = new Map(updatedList.map((c) => [c.id, c]));
    setChars((prev) => prev.map((c) => byId.get(c.id) || c));
    try {
      await Promise.all(updatedList.map((c) => saveChar(c)));
      setSavedAt(Date.now());
    } catch (e) {
      console.error('updateChars failed:', e);
    }
  };

  const createChar = async () => {
    const c = newCharacter('Neuer Held', session.username);
    setChars((prev) => [c, ...prev]);
    setCurrentId(c.id);
    try { await saveChar(c); } catch (e) {}
  };

  const removeChar = async (id) => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    setChars((prev) => prev.filter((c) => c.id !== id));
    if (currentId === id) setCurrentId(null);
    await deleteChar(id);
    // Strip this character ID from any groups that referenced it
    const affected = groups.filter((g) => (g.characterIds || []).includes(id));
    if (affected.length > 0) {
      const updated = affected.map((g) => ({ ...g, characterIds: g.characterIds.filter((x) => x !== id) }));
      setGroups((prev) => prev.map((g) => {
        const u = updated.find((x) => x.id === g.id);
        return u || g;
      }));
      for (const g of updated) {
        try { await saveGroup(g); } catch (e) {}
      }
    }
  };

  const updateGroup = (updated) => {
    setGroups((prev) => prev.map((g) => g.id === updated.id ? updated : g));
    debounceSave(() => saveGroup(updated));
  };

  const createGroup = async () => {
    const g = newGroup('Neue Gruppe', session.username);
    setGroups((prev) => [g, ...prev]);
    setCurrentGroupId(g.id);
    try { await saveGroup(g); } catch (e) {}
  };

  const removeGroup = async (id) => {
    // Cancel any pending debounced save so it can't re-write this group after delete
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    setGroups((prev) => prev.filter((g) => g.id !== id));
    if (currentGroupId === id) setCurrentGroupId(null);
    await deleteGroup(id);
    // Strip this group ID from any adventures that referenced it
    const affected = adventures.filter((a) => (a.groupIds || []).includes(id));
    if (affected.length > 0) {
      const updated = affected.map((a) => ({ ...a, groupIds: a.groupIds.filter((x) => x !== id) }));
      setAdventures((prev) => prev.map((a) => {
        const u = updated.find((x) => x.id === a.id);
        return u || a;
      }));
      for (const a of updated) {
        try { await saveAdventure(a); } catch (e) {}
      }
    }
  };

  const updateAdventure = (updated) => {
    setAdventures((prev) => prev.map((a) => a.id === updated.id ? updated : a));
    debounceSave(() => saveAdventure(updated));
  };

  const createAdventure = async () => {
    const a = newAdventure('Neues Abenteuer', session.username);
    setAdventures((prev) => [a, ...prev]);
    setCurrentAdventureId(a.id);
    try { await saveAdventure(a); } catch (e) {}
  };

  const removeAdventure = async (id) => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    setAdventures((prev) => prev.filter((a) => a.id !== id));
    if (currentAdventureId === id) setCurrentAdventureId(null);
    await deleteAdventure(id);
  };

  const handleLogin = async (acc) => {
    await saveSession({ username: acc.username });
    setSession(acc);
  };

  const handleLogout = async () => {
    await clearSession();
    setSession(null);
    setCurrentId(null);
    setCurrentGroupId(null);
    setCurrentAdventureId(null);
    setMeisterView('helden');
  };

  if (!authChecked) {
    return (
      <div className="surface-sand min-h-screen flex items-center justify-center font-body italic" style={{ color: 'var(--olive)' }}>
        <GlobalStyles />
        Lade…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="surface-sand min-h-screen font-body">
        <GlobalStyles />
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="surface-sand min-h-screen font-body">
      <GlobalStyles />
      {canViewCurrent ? (
        <CharacterView
          char={current}
          update={updateChar}
          onBack={() => setCurrentId(null)}
          savedAt={savedAt}
          session={session}
          groups={groups}
        />
      ) : canViewCurrentGroup ? (
        <GroupView
          group={currentGroup}
          allChars={chars}
          adventures={adventures}
          update={updateGroup}
          onBack={() => setCurrentGroupId(null)}
          onDelete={removeGroup}
          onOpenChar={setCurrentId}
          onOpenAdventure={setCurrentAdventureId}
          savedAt={savedAt}
        />
      ) : canViewCurrentAdventure ? (
        <AdventureView
          adventure={currentAdventure}
          allGroups={groups}
          allChars={chars}
          update={updateAdventure}
          updateChar={updateChar}
          updateChars={updateChars}
          onBack={() => setCurrentAdventureId(null)}
          onDelete={removeAdventure}
          onOpenGroup={setCurrentGroupId}
          onOpenChar={setCurrentId}
          savedAt={savedAt}
        />
      ) : (
        <CharacterList
          chars={visibleChars}
          groups={groups}
          adventures={adventures}
          session={session}
          loading={loading}
          view={meisterView}
          setView={setMeisterView}
          onOpen={setCurrentId}
          onOpenGroup={setCurrentGroupId}
          onOpenAdventure={setCurrentAdventureId}
          onCreate={createChar}
          onCreateGroup={createGroup}
          onCreateAdventure={createAdventure}
          onDelete={removeChar}
          onDeleteGroup={removeGroup}
          onDeleteAdventure={removeAdventure}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
