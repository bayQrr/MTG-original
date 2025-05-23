# 🧙 MTG Project – Magic: The Gathering Deck Builder

Een interactieve webapplicatie waarmee gebruikers kaarten kunnen zoeken, bekijken en beheren in eigen decks. Dankzij een API-integratie, zoomfunctie, deckbeheer en draw-testfunctie biedt dit project een alles-in-één ervaring voor verzamelaars en spelers.

## 📌 live
https://mtg-original.onrender.com

---

## 📚 Inhoudstafel
- [Beschrijving](#beschrijving)
- [Functionaliteiten](#functionaliteiten)
- [Technologieën](#technologieën)
- [DeckChecker](#deckchecker)
- [Drawtest](#drawtest)
- [Wireframes](#wireframes)
- [Installatie](#installatie)
- [Toekomstige uitbreidingen](#toekomstige-uitbreidingen)

---

## 📝 Beschrijving

Bij het betreden van de applicatie komt de gebruiker op een landing page waar meerdere projecten worden getoond. Elke tegel bevat de naam en afbeelding van een project.

- Gebruikers moeten inloggen voordat ze toegang krijgen tot het MTG-project.
- Decks zijn **gebruiker-gebonden**: elke gebruiker heeft zijn eigen collectie en decks.
- Andere projecten zijn niet toegankelijk

---

## ⚙️ Functionaliteiten

### 🔍 Kaarten zoeken (API)
- Zoek met een tekstveld naar kaarten via de officiële [MTG API](https://docs.magicthegathering.io/)
- Resultaten tonen de eerste 10 kaarten met afbeelding
-  paginatie bij meer dan 10 kaarten
-  randkleur per zeldzaamheid:
  - Wit = Common
  - Blauw = Uncommon
  - Geel = Rare
  - Rood = Mythic Rare
-  hover-effect op kaarten (lichte vergroting)

### 🔎 Inzoomen & Toevoegen aan deck
- Klik op een kaart om deze groter weer te geven (op dezelfde pagina)
- Bekijk extra eigenschappen van de kaart
- Voeg de kaart toe aan een deck
- Zie in welk(e) deck(s) de kaart reeds voorkomt

---

## 📦 DeckChecker

- Elk deck bevat:
  - Een **naam**
  - Een **achtergrondafbeelding** (URL opgeslagen in JSON)
  - Maximaal **60 kaarten**
  - Maximaal **4 kopieën per kaart** (tenzij het een **land** is)
  - **Gemiddelde mana-cost** (land-kaarten niet meegerekend)

### 🔧 Beheer
- Bekijk decks als tegels met afbeelding + naam
- Kaarten kunnen:
  - worden verwijderd
  - in aantal verhoogd of verlaagd worden

---

## 🃏 Drawtest

- Shuffle je deck
- Trek kaarten één voor één
- Bekijk twee stapels:
  - De draw-stapel
  - De getrokken kaarten (laatste bovenaan)
- geef een kaartnaam op en bereken kans dat je die als volgende trekt

---

## 🖼️ Wireframes

Bekijk het ontwerp en de gebruikersflow via figma:  
👉 [Wireframes openen bekijk page 2] https://www.figma.com/design/qToJEzIJhhxfiOyRLCsZoE/MGT-Originals?node-id=9-62&t=AxSPRphwkiij3PTe-1

---

## 🛠️ Technologieën
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**:  MongoDB en mogelijlheid om decks te exporteren in JSON-bestand
- **API**: [Magic: The Gathering API](https://docs.magicthegathering.io/)

---

## 🚀 Installatie

```bash
git clone https://github.com/zaidaelaissati/Magic-The-Gathering.git
cd mtg-project
npm install
npm start
