import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ManagementService } from '@api/api/management.service';
import { ClauseStatus, DslInput } from '@api/index';
import { DslOutput } from '@api/model/dslOutput';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ClausesService {
  private api = inject(ManagementService);
  private snackbar = inject(MatSnackBar);

  getClauses(status: ClauseStatus): Observable<Array<DslOutput>> {
    return this.api.getAllClausesDslV20250801(status);
  }

  createClause(dslInput: DslInput): Observable<DslOutput> {
    const response = this.api.createClauseFromDslV20250801(dslInput);
    this.subscribeWithSnackbar(response, "Klausul blev oprettet", "Klausul oprettelse fejlede");
    return response;
  }

  subscribeWithSnackbar(response: Observable<any>, successMessage: string, errorMessage: string): void {
    response.subscribe({
      next: (result) => {
        this.openSnackbar(successMessage);
      },
      error: (err) => {
        this.openSnackbar(errorMessage + '.\n' + err.error.message);
      }
    });
  }

  openSnackbar(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'snackbar'
    });
  }
}
