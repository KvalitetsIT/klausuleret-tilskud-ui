# Introduktion
En editor til at redigere regler for klausuleret tilskud.

# Forudsætninger
For at bygge app'en kræves:
- Node.js (v20+)
- npm (v10+)
- Docker (testet med version v27.5.1)
- Java (v21)

# Installation og kørsel
Projektet installeres ved først at bygge angular-app'en, og herefter bygge et Docker image.

```bash
# Byg angular app
cd itukt-ui
npm install
npm run build

# Byg et lokalt Docker image
docker build -t itukt-ui:local .

# Sæt ITUKT_API_BASE_URL og start app op på port 4200
docker run -e ITUKT_API_BASE_URL="http://localhost:8080" -p 4200:8080 itukt-ui:local
```

Man skal pege på en kørende instans af klausuleret-tilskud-valideringskomponenten, for at der kan vises og redigeres data i app'en. 
Komponenten findes her: https://github.com/KvalitetsIT/klausuleret-tilskud-valideringskomponent/

Angular-app'en kan også startes direkte med `ng serve` via npm, hvilket er praktisk under udvikling.

```bash
cd itukt-ui
npm install
npm start
```

I så fald læses ITUKT_API_BASE_URL fra følgende fil: `itukt-ui/src/environments/environment.ts`.

