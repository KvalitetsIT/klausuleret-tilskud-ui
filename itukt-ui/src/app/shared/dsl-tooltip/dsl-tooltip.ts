import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    standalone: true,
    selector: 'dsl-tooltip',
    templateUrl: 'dsl-tooltip.html',
    styleUrls: ['dsl-tooltip.css'],
    imports: [MatIconModule, MatTooltipModule],
})
export class DslTooltip {
    
    tooltipText = `Klausulbetingelsen kan indeholde følgende typer af betingelser:
  - Alder: Angivelse af patientens alder med en af følgende operatorer: >=, <=, >, <, =. 
        Eksempel: ALDER > 60
  - Indikation: Angivelse af indikationskode.
        Eksempel: INDIKATION = "155"
  - Lægespeciale: Angivelse af lægespeciale.
        Eksempel: LÆGESPECIALE = "PSYK"
  - Afdelingsspeciale: Angivelse af afdelingsspeciale.
        Eksempel: AFDELINGSSPECIALE = "DEPRE"
  - Eksisterende lægemiddel: Angivelse af et eksisterende lægemiddel.
    Herunder formkode (FORM), ATC kode (ATC) og administrationsvejskode (ROUTE).
    Hver af disse koder kan udelades.
        Eksempel 1: EKSISTERENDE_LÆGEMIDDEL = {FORM = "TAB", ATC = "A10BK", ROUTE = "ORAL"}
        Eksempel 2: EKSISTERENDE_LÆGEMIDDEL = {ATC = "A10BK"}
    
Betingelserne kan kombineres med og/eller, og kan grupperes med parenteser.
        Eksempel: (ALDER > 60 eller INDIKATION = "155") og LÆGESPECIALE = "PSYK"

Betingelser med flere mulige værdiger kan angives med operatoren 'i'.
        Eksempel 1: INDIKATION i ["31", "415"]
        Eksempel 2: EKSISTERENDE_LÆGEMIDDEL i [{ATC = "A10BK"}, {ATC = "A10BD19"}]
`;
}