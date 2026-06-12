# Testdefinition: [UC-1547] Investitionsantrag erstellen

## Übersicht

**Formular:** Investitionsantrag erstellen  
**App:** Anträge (MDA) – Power Apps Model Driven App  
**Datum:** 2026-06-06  

---

## Formularstruktur (laut Screenshot)

Das Formular ist in einem mehrstufigen Prozessfluss aufgebaut:

| Stufe | Name |
|---|---|
| 1 | Initialisierung |
| 2 | Antragsstufen |
| 3 | Projektdetails |
| 4 | Meilensteine |

### Abschnitte auf Stufe „Initialisierung"

#### Definition
| Feld | Pflichtfeld | Typ |
|---|---|---|
| Antragsschritt DEBUG | Nein | Lookup / Suche |
| Genehmigungskat. | Ja | Dropdown |
| Version | Ja | Text |
| Besitzer | Ja | Lookup (Person) |

#### Rechte Spalte – Hauptfelder
| Feld | Pflichtfeld | Typ |
|---|---|---|
| Titel | Ja | Text |
| Projektbeschreibung | Nein | Rich-Text-Editor |

#### Projektinfos
| Feld | Pflichtfeld | Typ |
|---|---|---|
| Projektreferenz | Ja | Text |
| Projektstart | Ja | Datum (dd/MM/yyyy) |
| Projektende | Nein | Datum (dd/MM/yyyy) |
| Projektleiter | Nein | Lookup (Person) |

#### Genehmigungszuweisung
| Feld | Pflichtfeld | Typ |
|---|---|---|
| Auftraggeber | Ja | Lookup (Person) |
| Finanzen (Team) | Ja | Lookup (Team) |
| Direktor (Team) | Ja | Lookup (Team) |

---

## Testfälle

### TC-01 – Formular öffnen (Neuer Antrag)

**Vorbedingung:** Nutzer ist angemeldet und befindet sich in der Ansicht „Investitionsanträge".  
**Schritte:**
1. Auf „+ Neu" in der Menüleiste klicken.

**Erwartetes Ergebnis:**
- Das Formular „Investitionsantrag erstellen – Nicht gespeichert" öffnet sich.
- Die Prozessleiste zeigt Stufe **Initialisierung** als aktiv.
- Alle Pflichtfelder sind leer und mit `*` markiert.
- Der **Besitzer** ist automatisch auf den angemeldeten Nutzer vorbelegt.

---

### TC-02 – Pflichtfelder validieren (Speichern ohne Eingabe)

**Vorbedingung:** Leeres Formular ist geöffnet.  
**Schritte:**
1. Auf „Speichern" oder „Speichern und schließen" klicken, ohne Felder auszufüllen.

**Erwartetes Ergebnis:**
- Fehlermeldungen erscheinen bei allen Pflichtfeldern: Titel, Genehmigungskat., Version, Projektreferenz, Projektstart, Auftraggeber, Finanzen (Team), Direktor (Team).
- Der Datensatz wird **nicht** gespeichert.

---

### TC-03 – Minimalantrag erstellen und speichern

**Vorbedingung:** Leeres Formular ist geöffnet.  
**Schritte:**
1. **Titel** eingeben: `Test Investitionsantrag`.
2. **Genehmigungskat.** aus Dropdown wählen: z. B. `Projektkosten 1 bis 5 MCHF`.
3. **Version** eingeben: `1.0`.
4. **Projektreferenz** eingeben: `PRJ-2026-001`.
5. **Projektstart** eingeben: `01/07/2026`.
6. **Auftraggeber** per Lookup suchen und auswählen.
7. **Finanzen (Team)** per Lookup bestätigen oder neu setzen.
8. **Direktor (Team)** per Lookup auswählen.
9. Auf „Speichern" klicken.

**Erwartetes Ergebnis:**
- Der Datensatz wird gespeichert (Titelzeile zeigt nicht mehr „Nicht gespeichert").
- Alle eingegebenen Werte bleiben im Formular erhalten.

---

### TC-04 – Projektleiter zuweisen

**Vorbedingung:** Antrag aus TC-03 ist geöffnet.  
**Schritte:**
1. Im Abschnitt „Projektinfos" das Feld **Projektleiter** anklicken.
2. Namen eingeben und eine Person aus den Suchergebnissen auswählen.
3. Speichern.

**Erwartetes Ergebnis:**
- Der Projektleiter wird im Feld als Link angezeigt.
- Klick auf den Link öffnet die Kontaktkarte der Person.

---

### TC-05 – Projektbeschreibung (Rich Text) eingeben

**Vorbedingung:** Antrag ist geöffnet.  
**Schritte:**
1. In den Rich-Text-Editor für **Projektbeschreibung** klicken.
2. Text eingeben und Formatierungen (Fett, Kursiv) anwenden.
3. Speichern.

**Erwartetes Ergebnis:**
- Die Formatierungen bleiben nach dem Speichern und Neuladen erhalten.

---

### TC-06 – Prozessfluss-Navigation

**Vorbedingung:** Antrag ist gespeichert (TC-03).  
**Schritte:**
1. In der Prozessleiste auf **Antragsstufen** klicken.

**Erwartetes Ergebnis:**
- Die Prozessleiste wechselt zur nächsten Stufe.
- Das Formular zeigt die zugehörigen Felder der Stufe „Antragsstufen".

---

### TC-07 – Vorhandener Antrag in der Liste sichtbar

**Vorbedingung:** Antrag aus TC-03 ist gespeichert.  
**Schritte:**
1. Zurück zur Ansicht „Investitionsanträge" navigieren (linkes Menü).

**Erwartetes Ergebnis:**
- Der neu erstellte Antrag erscheint in der Listenansicht mit korrektem Titel.
