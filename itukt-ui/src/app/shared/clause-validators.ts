import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClauseStatus, DslOutput } from '@api/index';
import { ClauseService } from '../services/clause-service';

@Injectable({ providedIn: 'root' })
export class ClauseValidators {
    private clauseService = inject(ClauseService);

    private activeClauses = toSignal<Array<DslOutput>>(
        this.clauseService.getClauses(ClauseStatus.Active)
    );
    private draftClauses = toSignal<Array<DslOutput>>(
        this.clauseService.getClauses(ClauseStatus.Draft)
    );

    clauseNameInUseValidator = (control: AbstractControl<string>): ValidationErrors | null => {
        return this.activeClauses()?.some(c => c.name.toUpperCase() === control.value.toUpperCase())
            || this.draftClauses()?.some(c => c.name.toUpperCase() === control.value.toUpperCase())
            ? { nameInUseByActiveClause: true }
            : null;
    };
}