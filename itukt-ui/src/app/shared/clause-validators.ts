import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ClausesService } from '../services/clauses';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClauseStatus, DslOutput } from '@api/index';

@Injectable({ providedIn: 'root' })
export class ClauseValidators {
    private clauseService = inject(ClausesService);

    private activeClauses = toSignal<Array<DslOutput>>(
        this.clauseService.getClauses(ClauseStatus.Active)
    );

    clauseNameInUseValidator = (control: AbstractControl): ValidationErrors | null => {
        return this.activeClauses()?.map(c => c.name).includes(control.value)
            ? { nameInUseByActiveClause: true }
            : null;
    };
}