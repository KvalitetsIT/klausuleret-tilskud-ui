import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClauseValidators } from 'src/app/shared/clause-validators';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DslOutput } from '@api/index';
import { Observable } from 'rxjs';
import { ClauseService } from 'src/app/services/clause-service';
import { DslBuilder } from 'src/app/shared/dsl-builder/dsl-builder';
import { DslTooltip } from 'src/app/shared/dsl-tooltip/dsl-tooltip';

@Component({
    selector: 'clause-edit-items',
    templateUrl: 'clause-edit-items.html',
    styleUrls: ['../clause-content-items.css', 'clause-edit-items.css'],
    imports: [
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        DslTooltip,
        MatButtonModule,
        MatIconModule,
        DslBuilder,
    ],
})
export class ClauseEditItems {
    @Input({ required: true }) clause!: DslOutput;

    private service = inject(ClauseService);
    private fb = inject(FormBuilder);

    readonly requiredValidator = ClauseValidators.Required;

    form!: FormGroup;
    editMode = false;

    ngOnInit() {
        this.form = this.fb.group({
            dsl: [this.clause.dsl, this.requiredValidator.validator],
            error: [this.clause.error, this.requiredValidator.validator],
        });
    }

    save(skipValidation: boolean): Observable<DslOutput> {
        const { dsl, error } = this.form.value;
        return this.clause.status == 'DRAFT'
            ? this.service.updateDraftClause(this.clause.name, { dsl: dsl ?? '', error: error ?? '' }, skipValidation)
            : this.service.createClause({ name: this.clause.name, dsl: dsl ?? '', error: error ?? '' }, skipValidation);
    }

    editModeOnOff() {
        this.editMode = !this.editMode;
    }

}