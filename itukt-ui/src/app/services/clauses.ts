import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ManagementService } from '@api/api/management.service';
import { ClauseStatus, ClauseStatusInput, DslInput } from '@api/index';
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
    return this.addSnackbar(response, "Klausul blev oprettet", "Klausul oprettelse fejlede");
  }

  approveClause(clauseId: string): Observable<void> {
    const response = this.api.updateClauseStatusV20250801(clauseId, { status: ClauseStatusInput.StatusEnum.Active });
    return this.addSnackbar(response, "Klausul blev godkendt", "Klausul godkendelse fejlede");
  }

  addSnackbar(response: Observable<any>, successMessage: string, errorMessage: string): Observable<any> {
    return response.pipe(
      tap({
        next: () => this.openSnackbar(successMessage),
        error: (err) => this.openSnackbar(errorMessage + '\n' + err.error.message)
      })
    );
  }

  openSnackbar(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'snackbar'
    });
  }
}
