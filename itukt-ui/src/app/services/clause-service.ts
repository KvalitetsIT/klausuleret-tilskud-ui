import { ClauseStatus, ClauseStatusInput, DslInput, DslOutput, DslUpdateInput } from "@api/index";
import { Observable } from "rxjs/internal/Observable";

export abstract class ClauseService {
    abstract getClauses(status: ClauseStatus): Observable<Array<DslOutput>>;
    abstract createClause(dslInput: DslInput, skipValidation: boolean): Observable<DslOutput>;
    abstract deleteClause(clause: DslOutput): Observable<void>;
    abstract approveClause(clause: { uuid: string, name: string }, resetSkippedValidations: boolean): Observable<void>;
    abstract updateClauseStatus(name: string, newStatus: ClauseStatusInput.StatusEnum): Observable<void>;
    abstract getClauseHistory(uuid: string): Observable<Array<DslOutput>>
    abstract updateDraftClause(name: string, dslInput: DslUpdateInput, skipValidation: boolean): Observable<DslOutput>;
    abstract getClauseDrugsCount(name: string): Observable<number>;
    abstract getDepartmentSpecialities(): Observable<Set<string>>;
} 