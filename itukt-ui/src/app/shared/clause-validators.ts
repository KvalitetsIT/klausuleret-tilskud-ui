import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClauseStatus, DslOutput } from '@api/index';
import { ClauseService } from '../services/clause-service';

export interface ClauseValidator {
    name: string;
    validator: (control: AbstractControl<string>) => ValidationErrors | null;
    errorMessage: string;
}

@Injectable({ providedIn: 'root' })
export class Required implements ClauseValidator {
    name = 'required';
    validator = Validators.required;
    errorMessage = 'Påkrævet';
}

@Injectable({ providedIn: 'root' })
export class NameInUse implements ClauseValidator {
    private clauseService = inject(ClauseService);

    private activeClauses = toSignal<Array<DslOutput>>(
        this.clauseService.getClauses(ClauseStatus.Active)
    );
    private draftClauses = toSignal<Array<DslOutput>>(
        this.clauseService.getClauses(ClauseStatus.Draft)
    );

    name = 'nameInUseByActiveClause';
    validator = (control: AbstractControl<string>): ValidationErrors | null => {
        return this.activeClauses()?.some(c => c.name.toUpperCase() === control.value.toUpperCase())
            || this.draftClauses()?.some(c => c.name.toUpperCase() === control.value.toUpperCase())
            ? { [this.name]: true }
            : null;
    };
    errorMessage = 'Klausulkode allerede i brug';
}

export class ClauseValidators {
    static get Required(): ClauseValidator {
        return inject(Required);
    }

    static get NameInUse(): ClauseValidator {
        return inject(NameInUse);
    }
}