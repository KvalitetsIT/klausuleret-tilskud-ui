import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagementService } from '@api/services/management.service';
import { ClauseOutput } from '@api/models/clause-output'; 

@Injectable({ providedIn: 'root' })
export class ClausesService {
  private api = inject(ManagementService);

  // Hent alle clauses
  getClauses(): Observable<ClauseOutput[]> {
    // Her anvendes default-udgave der blot returnerer 'body'
    return this.api.getAllClausesV20250801$Json();
  }
}
