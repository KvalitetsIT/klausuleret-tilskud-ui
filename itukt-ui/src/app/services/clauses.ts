import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementService } from '@api/api/management.service';
import { ClauseStatus, ClauseStatusInput, DraftClauseStatusInput, DslInput } from '@api/index';
import { DslOutput } from '@api/model/dslOutput';

@Injectable({ providedIn: 'root' })
export class ClausesService {
  private api = inject(ManagementService);
  private snackbar = inject(MatSnackBar);

  private cache: Record<string, Record<string, { data$: Observable<Array<DslOutput>>, refresh: () => void }>> = {};


  getClauses(status: ClauseStatus): Observable<Array<DslOutput>> {
    const getClausesCache = this.cache["getClauses"] ??= {};
    const entry = getClausesCache[status] ??= this.createRefreshableStream(() => this.api.getAllClausesDslV20250801(status));
    return entry.data$;
  }

  createClause(dslInput: DslInput): Observable<DslOutput> {
    const response = this.api.createClauseFromDslV20250801(dslInput);
    return this.withCacheClear(
      this.addSnackbar(response, "Klausul blev oprettet", "Klausul oprettelse fejlede"));
  }

  deleteClause(clause: DslOutput): Observable<void> {
    const response = this.api.deleteClauseV20250801(clause.uuid);
    return this.withCacheClear(
      this.addSnackbar(response, "Klausul blev slettet", "Sletning af klausul fejlede"));
  }

  approveClause(clause: { uuid: string, name: string }, resetSkippedValidations: boolean): Observable<void> {
    const response = this.api.updateDraftStatusV20250801(clause.uuid, { status: DraftClauseStatusInput.StatusEnum.Active, resetSkippedValidations: resetSkippedValidations });
    return this.withCacheClear(
      this.addSnackbar(response, `Klausul godkendt. '${clause.name}' er nu aktiv`, "Klausul godkendelse fejlede"));
  }

  updateClauseStatus(name: string, newStatus: ClauseStatusInput.StatusEnum): Observable<void> {
    const response = this.api.updateClauseStatusV20250801(name, { status: newStatus });
    const action = newStatus === ClauseStatusInput.StatusEnum.Active ? 'aktiveret' : 'inaktiveret';
    return this.withCacheClear(
      this.addSnackbar(response, `Klausul '${name}' blev ${action}`, `Opdatering af klausul status fejlede`));
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

  withCacheClear(response: Observable<any>): Observable<any> {
    return response.pipe(
      tap(() => {
        this.clearCaches();
      })
    );
  }

  openSnackbar(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'snackbar'
    });
  }

  clearCaches(): void {
    Object.values(this.cache).forEach(innerCache => Object.values(innerCache).forEach(entry => entry.refresh()));
  }

  createRefreshableStream<T>(fetchFn: () => Observable<T>) {
    const refresher$ = new BehaviorSubject<void>(undefined);

    const data$ = refresher$.pipe(
      switchMap(() => fetchFn()),
      shareReplay(1)
    );

    return {
      data$: data$,
      refresh: () => refresher$.next()
    };
  }
}
