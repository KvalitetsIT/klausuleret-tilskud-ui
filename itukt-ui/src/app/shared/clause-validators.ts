import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClauseStatus, DslOutput } from '@api/index';
import { ClauseService } from '../services/clause-service';

interface ClauseValidator {
    name: string;
    validator: (control: AbstractControl<string>) => ValidationErrors | null;
    errorMessage: string;
}

class Required implements ClauseValidator {
    name = 'required';
    validator = Validators.required;
    errorMessage = 'Påkrævet';
}

class MaxLength implements ClauseValidator {
    name = 'maxlength';
    validator: (control: AbstractControl<string>) => ValidationErrors | null;
    errorMessage: string;
    
    constructor(maxLength: number) {
        this.validator = Validators.maxLength(maxLength);
        this.errorMessage = `Maksimal længde er ${maxLength} tegn`;
    }
}

@Injectable({ providedIn: 'root' })
class NameInUse implements ClauseValidator {
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
    public static readonly Required = new Required();
    public static readonly ErrorMaxLength = new MaxLength(1000);
    public static readonly NameMaxLength = new MaxLength(255);

    public static get NameInUse(): ClauseValidator {
        return inject(NameInUse);
    }
}