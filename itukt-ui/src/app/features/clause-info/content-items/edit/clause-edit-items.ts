import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DslOutput } from '@api/index';
import { Observable } from 'rxjs';
import { ClauseService } from 'src/app/services/clause-service';
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
    ],
})
export class ClauseEditItems {
    @Input({ required: true }) clause!: DslOutput;

    private service = inject(ClauseService);
    private fb = inject(FormBuilder);
    form!: FormGroup;

    ngOnInit() {
        this.form = this.fb.group({
            dsl: [this.clause.dsl, Validators.required],
            error: [this.clause.error, Validators.required],
        });
    }

    save(skipValidation: boolean): Observable<DslOutput> {
        const { dsl, error } = this.form.value;
        return this.clause.status == 'DRAFT'
            ? this.service.updateDraftClause(this.clause.name, { dsl: dsl ?? '', error: error ?? '' }, skipValidation)
            : this.service.createClause({ name: this.clause.name, dsl: dsl ?? '', error: error ?? '' }, skipValidation);
    }

}