import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ManagementService } from '@api/api/management.service';
import { ClauseStatus } from '@api/index';
import { DslOutput } from '@api/model/dslOutput';

@Injectable({ providedIn: 'root' })
export class ClausesService {
  private api = inject(ManagementService);

  getClauses(status: ClauseStatus): Observable<Array<DslOutput>> {
    return this.api.getAllClausesDslV20250801(status);
  }
}
