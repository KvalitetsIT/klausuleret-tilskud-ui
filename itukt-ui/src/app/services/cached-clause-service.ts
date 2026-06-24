import { inject, Injectable } from "@angular/core";
import { ClauseService } from "./clause-service";
import { ClauseStatus, DslOutput, DslInput, ClauseStatusInput } from "@api/index";
import { BehaviorSubject, Observable, shareReplay, switchMap, tap } from "rxjs";
import { ConcreteClauseService } from "./concrete-clause-service";

@Injectable({ providedIn: 'root' })
export class CachedClauseService implements ClauseService {
    private concreteClauseService = inject(ConcreteClauseService);
    private cache: Record<string, Record<string, { data$: Observable<Array<DslOutput>>, refresh: () => void }>> = {};

    getClauses(status: ClauseStatus): Observable<Array<DslOutput>> {
        const getClausesCache = this.cache["getClauses"] ??= {};
        const entry = getClausesCache[status] ??= this.createRefreshableStream(() => this.concreteClauseService.getClauses(status));
        return entry.data$;
    }

    createClause(dslInput: DslInput): Observable<DslOutput> {
        return this.withCacheClear(this.concreteClauseService.createClause(dslInput));
    }

    deleteClause(clause: DslOutput): Observable<void> {
        return this.withCacheClear(this.concreteClauseService.deleteClause(clause));
    }

    approveClause(clause: { uuid: string; name: string; }, resetSkippedValidations: boolean): Observable<void> {
        return this.withCacheClear(this.concreteClauseService.approveClause(clause, resetSkippedValidations));
    }

    updateClauseStatus(name: string, newStatus: ClauseStatusInput.StatusEnum): Observable<void> {
        return this.withCacheClear(this.concreteClauseService.updateClauseStatus(name, newStatus));
    }

    getClauseHistory(name: string): Observable<Array<DslOutput>> {
        const getClauseHistoryCache = this.cache["getClauseHistory"] ??= {};
        const entry = getClauseHistoryCache[name] ??= this.createRefreshableStream(() => this.concreteClauseService.getClauseHistory(name));
        return entry.data$;
    }


    private withCacheClear(response: Observable<any>): Observable<any> {
        return response.pipe(
            tap(() => {
                this.clearCaches();
            })
        );
    }

    private clearCaches(): void {
        Object.values(this.cache).forEach(innerCache => Object.values(innerCache).forEach(entry => entry.refresh()));
    }

    private createRefreshableStream<T>(fetchFn: () => Observable<T>) {
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