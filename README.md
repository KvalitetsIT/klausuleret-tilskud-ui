# Introduktion
En editor til at redigere regler for klausuleret tilskud.

# Forudsætninger
For at bygge app'en kræves:
- Node.js (v20+)
- npm (v10+)
- Docker (testet med version v27.5.1)
- Java (v21)

# Installation og kørsel
Projektet kan installeres og køres med docker compose.
I compose folderen, kør:

```bash
docker compose up
```

Man skal pege på en kørende instans af klausuleret-tilskud-valideringskomponenten, for at der kan vises og redigeres data i app'en. 
Komponenten findes her: https://github.com/KvalitetsIT/klausuleret-tilskud-valideringskomponent/

Angular-app'en kan også startes direkte med `ng serve` via npm, hvilket er praktisk under udvikling.

```bash
cd itukt-ui
npm install
npm start
```

I så fald læses miljøvariable fra følgende fil: `itukt-ui/src/environments/environment.ts`.

# Miljøvariable

| Miljøvariabel           | Beskrivelse                       | Påkrævet |
|-------------------------|-----------------------------------|----------|
| ITUKT_AUTH_GATEWAY_URL  | URL til auth gateway foran api'et | Ja       |