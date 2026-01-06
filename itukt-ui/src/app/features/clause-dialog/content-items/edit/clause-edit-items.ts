import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DslOutput } from '@api/index';
import { ClausesService } from 'src/app/services/clauses';

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
    ],
})
export class ClauseEditItems {
    @Input({ required: true }) clause!: DslOutput;

    private service = inject(ClausesService);
    private fb = inject(FormBuilder);
    form!: FormGroup;
    loading = false;

    ngOnInit() {
        this.form = this.fb.group({
            dsl: [this.clause.dsl, Validators.required],
            error: [this.clause.error, Validators.required],
        });
    }

    save() {
        console.log('Saving clause edit:', this.form.value);
        this.loading = true;
    }

}