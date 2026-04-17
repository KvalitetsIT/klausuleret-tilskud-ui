import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ManagementService } from '@api/api/management.service';
import { ClauseStatus, ClauseStatusInput, DraftClauseStatusInput, DslInput } from '@api/index';
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

  deleteClause(clause: DslOutput): Observable<void> {
    const response = this.api._20250801clausesIdDelete(clause.uuid);
    return this.addSnackbar(response, "Klausul blev slettet", "Sletning af klausul fejled")
  }

  approveClause(clause: { uuid: string, name: string }, resetSkippedValidations: boolean): Observable<void> {
    const response = this.api.updateDraftStatusV20250801(clause.uuid, { status: DraftClauseStatusInput.StatusEnum.Active,  resetSkippedValidations: resetSkippedValidations});
    return this.addSnackbar(response, `Klausul godkendt. '${clause.name}' er nu aktiv`, "Klausul godkendelse fejlede");
  }

  updateClauseStatus(name: string, newStatus: ClauseStatusInput.StatusEnum): Observable<void> {
    const response = this.api.updateClauseStatusV20250801(name, { status: newStatus });
    const action = newStatus === ClauseStatusInput.StatusEnum.Active ? 'aktiveret' : 'inaktiveret';
    return this.addSnackbar(response, `Klausul '${name}' blev ${action}`, `Opdatering af klausul status fejlede`);
  }

  getClauseHistory(name: string): Observable<Array<DslOutput>> {
    return this.api.getClauseHistoryV20250801(name);
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
