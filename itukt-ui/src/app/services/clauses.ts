import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagementService } from '@api/services/management.service';
import { ClauseOutput } from '@api/models/clause-output'; 
import { DslOutput } from '@api/models/dsl-output';

@Injectable({ providedIn: 'root' })
export class ClausesService {
  private api = inject(ManagementService);

  getClausesAsJson(): Observable<ClauseOutput[]> {
    return this.api.getAllClausesV20250801$Json();
  }

  getClausesAsDsl(): Observable<Array<DslOutput>> {
    return this.api.getAllClausesDslV20250801();
  }
}
