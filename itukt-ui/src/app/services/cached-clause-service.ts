import { inject, Injectable } from "@angular/core";
import { ClauseService } from "./clause-service";
import { ClauseStatus, DslOutput, DslInput, ClauseStatusInput, DslUpdateInput } from "@api/index";
import { BehaviorSubject, Observable, shareReplay, switchMap, tap } from "rxjs";
import { ConcreteClauseService } from "./concrete-clause-service";

@Injectable({ providedIn: 'root' })
export class CachedClauseService implements ClauseService {
    private concreteClauseService = inject(ConcreteClauseService);
    private cache: Cache = new Cache();

    getClauses(status: ClauseStatus): Observable<Array<DslOutput>> {
        return this.cache.get<Array<DslOutput>>(() => this.concreteClauseService.getClauses(status), "getClauses", status);
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

    getClauseHistory(uuid: string): Observable<Array<DslOutput>> {
        return this.cache.get<Array<DslOutput>>(() => this.concreteClauseService.getClauseHistory(uuid), "getClauseHistory", uuid);
    }

    getClauseDrugsCount(name: string): Observable<number> {
        return this.cache.get<number>(() => this.concreteClauseService.getClauseDrugsCount(name), "getClauseDrugsCount", name);
    }

    updateDraftClause(name: string, dslInput: DslUpdateInput): Observable<DslOutput> {
        return this.withCacheClear(this.concreteClauseService.updateDraftClause(name, dslInput));
    }

    private withCacheClear(response: Observable<any>): Observable<any> {
        return response.pipe(
            tap(() => {
                this.cache.clear();
            })
        );
    }
}

class Cache {
    
    private cache: Record<string, { data$: Observable<any>, refresh: () => void }> = {};

    get<T>(fetchFn: () => Observable<T>, ...keys: string[]): Observable<T> {
        const key = keys.join('|');
        const entry = this.cache[key] ??= this.createRefreshableStream(fetchFn);
        return entry.data$;
    }

    clear(): void {
        Object.values(this.cache).forEach(entry => entry.refresh());
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