import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ManagementService } from '@api/api/management.service';
import { ClauseOutput } from '@api/model/clauseOutput';
import { DslOutput } from '@api/model/dslOutput';

@Injectable({ providedIn: 'root' })
export class ClausesService {
  private api = inject(ManagementService);

  getClausesAsJson(): Observable<ClauseOutput[]> {
    return this.api.getAllClausesV20250801();
  }

  getClausesAsDsl(): Observable<Array<DslOutput>> {
    return this.api.getAllClausesDslV20250801();
  }
}
