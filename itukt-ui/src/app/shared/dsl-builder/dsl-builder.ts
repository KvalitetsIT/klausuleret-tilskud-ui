import { Component, inject, Input, signal } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExpressionType } from '../expression-types';
import { Expression } from './expression/expression';
import { ClauseService } from 'src/app/services/clause-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs';

@Component({
    standalone: true,
    selector: 'dsl-builder',
    templateUrl: 'dsl-builder.html',
    styleUrls: ['dsl-builder.css'],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        Expression,
        MatProgressSpinner,
        MatAutocompleteModule,
        AsyncPipe,
        ReactiveFormsModule
    ],
})
export class DslBuilder {
    @Input({ required: true }) dslField!: AbstractControl;
    private clauseService = inject(ClauseService);

    ExpressionType = ExpressionType;
    expressionTypes = Object.values(ExpressionType);
    selectedExpressionType: ExpressionType | undefined;

    operators = ['=', '<', '<=', '>=', '>'];
    selectedOperator = this.operators[0];
    valueForm = new FormControl('');

    filteredSpecialities: Observable<string[]> | undefined;

    ngOnInit(): void {
        this.clauseService.getDepartmentSpecialities()
            .subscribe({
                next: (departmentSpecialities) => this.filteredSpecialities = this.valueForm.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '', departmentSpecialities)),
                )
            });
    }

    private _filter(value: string, options: Set<string>): string[] {
        return Array.from(options).filter(option => option.toLowerCase().includes(value.toLowerCase()));
    }

    appendExpression = () => {
        if (this.selectedExpressionType === undefined) return;

        this.append([this.selectedExpressionType.valueOf(), this.selectedOperator, this.valueForm.value as string]);
        this.selectedExpressionType = undefined;
        this.resetOperatorAndValue();
    }

    append(values: string[]) {
        const prefix = this.dslField.value ? this.dslField.value + ' ' : '';
        this.dslField.setValue(prefix + values.join(' '));
    }

    resetOperatorAndValue() {
        this.selectedOperator = this.operators[0];
        this.valueForm.setValue("");
    }
}